import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'COMPETITOR_SEO_ANALYSIS.json')

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Action plan not found. Run competitor analysis first.' }, { status: 404 })
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading action plan:', error)
    return NextResponse.json({ error: 'Failed to load action plan' }, { status: 500 })
  }
}
