import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Verify Slack request signature
function verifySlackRequest(request: NextRequest, body: string): boolean {
  const signingSecret = process.env.SLACK_SIGNING_SECRET
  if (!signingSecret) return true // Skip verification in dev if not set

  const timestamp = request.headers.get('x-slack-request-timestamp')
  const signature = request.headers.get('x-slack-signature')

  if (!timestamp || !signature) return false

  // Check timestamp is within 5 minutes
  const time = Math.floor(Date.now() / 1000)
  if (Math.abs(time - parseInt(timestamp)) > 60 * 5) return false

  // Verify signature using HMAC SHA256
  const crypto = require('crypto')
  const sigBasestring = `v0:${timestamp}:${body}`
  const mySignature = 'v0=' + crypto
    .createHmac('sha256', signingSecret)
    .update(sigBasestring)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(mySignature),
    Buffer.from(signature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // Verify request is from Slack
    if (!verifySlackRequest(request, body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Parse form data
    const params = new URLSearchParams(body)
    const command = params.get('command')
    const text = params.get('text')?.trim() || ''
    const userId = params.get('user_id')
    const userName = params.get('user_name')

    if (command === '/deals') {
      // Handle different subcommands
      const subcommand = text.split(' ')[0].toLowerCase()

      switch (subcommand) {
        case 'summary':
        case '': {
          // Get pipeline summary
          const deals = await sql`
            SELECT * FROM deals
            WHERE status NOT IN ('lost', 'cancelled')
            ORDER BY created_at DESC
          `

          const statusCounts: Record<string, number> = {}
          const statusValues: Record<string, number> = {}
          let totalValue = 0

          deals.forEach((deal: any) => {
            statusCounts[deal.status] = (statusCounts[deal.status] || 0) + 1
            statusValues[deal.status] = (statusValues[deal.status] || 0) + Number(deal.deal_value || 0)
            totalValue += Number(deal.deal_value || 0)
          })

          const statusEmoji: Record<string, string> = {
            'new': '🆕',
            'contacted': '📞',
            'proposal_sent': '📨',
            'negotiation': '🤝',
            'won': '🎉'
          }

          let summaryText = `*📊 Deal Pipeline Summary*\n\n`
          summaryText += `*Total Active Deals:* ${deals.length}\n`
          summaryText += `*Total Pipeline Value:* $${totalValue.toLocaleString()}\n\n`
          summaryText += `*By Status:*\n`

          Object.entries(statusCounts).forEach(([status, count]) => {
            const emoji = statusEmoji[status] || '📋'
            const value = statusValues[status] || 0
            summaryText += `${emoji} ${status}: ${count} deals ($${value.toLocaleString()})\n`
          })

          return NextResponse.json({
            response_type: 'in_channel',
            text: summaryText
          })
        }

        case 'list': {
          // List all active deals
          const deals = await sql`
            SELECT * FROM deals
            WHERE status NOT IN ('lost', 'cancelled')
            ORDER BY deal_value DESC NULLS LAST
            LIMIT 15
          `

          if (deals.length === 0) {
            return NextResponse.json({
              response_type: 'ephemeral',
              text: 'No active deals found.'
            })
          }

          const blocks: any[] = [
            {
              type: 'header',
              text: { type: 'plain_text', text: '📋 Active Deals', emoji: true }
            }
          ]

          deals.forEach((deal: any) => {
            const value = deal.deal_value ? `$${Number(deal.deal_value).toLocaleString()}` : 'TBD'
            const date = deal.event_date ? new Date(deal.event_date).toLocaleDateString() : 'TBD'

            blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${deal.event_title}*\n${deal.client_name} • ${value} • ${date}`
              },
              accessory: {
                type: 'static_select',
                placeholder: { type: 'plain_text', text: deal.status },
                action_id: 'update_deal_status',
                options: [
                  { text: { type: 'plain_text', text: '🆕 New' }, value: `${deal.id}:new` },
                  { text: { type: 'plain_text', text: '📞 Contacted' }, value: `${deal.id}:contacted` },
                  { text: { type: 'plain_text', text: '📨 Proposal Sent' }, value: `${deal.id}:proposal_sent` },
                  { text: { type: 'plain_text', text: '🤝 Negotiation' }, value: `${deal.id}:negotiation` },
                  { text: { type: 'plain_text', text: '🎉 Won' }, value: `${deal.id}:won` },
                  { text: { type: 'plain_text', text: '❌ Lost' }, value: `${deal.id}:lost` }
                ]
              }
            })
          })

          return NextResponse.json({
            response_type: 'in_channel',
            blocks
          })
        }

        case 'stale': {
          // Find deals with no updates in 7+ days
          const staleDeals = await sql`
            SELECT *,
              EXTRACT(DAY FROM NOW() - COALESCE(updated_at, created_at)) as days_stale
            FROM deals
            WHERE status NOT IN ('won', 'lost', 'cancelled')
              AND COALESCE(updated_at, created_at) < NOW() - INTERVAL '7 days'
            ORDER BY updated_at ASC NULLS FIRST
            LIMIT 10
          `

          if (staleDeals.length === 0) {
            return NextResponse.json({
              response_type: 'ephemeral',
              text: '✅ No stale deals! All deals have been updated within the last 7 days.'
            })
          }

          let staleText = `*⚠️ Stale Deals (No updates in 7+ days)*\n\n`
          staleDeals.forEach((deal: any) => {
            const days = Math.floor(deal.days_stale)
            const value = deal.deal_value ? `$${Number(deal.deal_value).toLocaleString()}` : 'TBD'
            staleText += `• *${deal.event_title}* (${deal.client_name})\n   ${deal.status} • ${value} • _${days} days since update_\n\n`
          })

          return NextResponse.json({
            response_type: 'in_channel',
            text: staleText
          })
        }

        case 'new': {
          // Show recent deals (last 7 days)
          const newDeals = await sql`
            SELECT * FROM deals
            WHERE created_at > NOW() - INTERVAL '7 days'
            ORDER BY created_at DESC
            LIMIT 10
          `

          if (newDeals.length === 0) {
            return NextResponse.json({
              response_type: 'ephemeral',
              text: 'No new deals in the last 7 days.'
            })
          }

          let newText = `*🆕 New Deals (Last 7 Days)*\n\n`
          newDeals.forEach((deal: any) => {
            const value = deal.deal_value ? `$${Number(deal.deal_value).toLocaleString()}` : 'TBD'
            const created = new Date(deal.created_at).toLocaleDateString()
            newText += `• *${deal.event_title}* (${deal.client_name})\n   ${value} • Created ${created}\n\n`
          })

          return NextResponse.json({
            response_type: 'in_channel',
            text: newText
          })
        }

        case 'help':
        default: {
          if (subcommand && subcommand !== 'help') {
            // Unknown subcommand
            return NextResponse.json({
              response_type: 'ephemeral',
              text: `Unknown command: \`${subcommand}\`. Type \`/deals help\` for available commands.`
            })
          }

          return NextResponse.json({
            response_type: 'ephemeral',
            text: `*📋 /deals Commands*\n\n` +
              `\`/deals\` or \`/deals summary\` - Pipeline overview with totals\n` +
              `\`/deals list\` - List all active deals with status dropdowns\n` +
              `\`/deals stale\` - Deals with no updates in 7+ days\n` +
              `\`/deals new\` - Deals created in the last 7 days\n` +
              `\`/deals help\` - Show this help message`
          })
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Slack command error:', error)
    return NextResponse.json({
      response_type: 'ephemeral',
      text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}
