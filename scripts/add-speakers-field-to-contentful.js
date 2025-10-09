#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const contentful = require('contentful-management')

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const ENVIRONMENT_ID = 'master' // Default environment

async function addSpeakersField() {
  try {
    console.log('🔐 Authenticating with Contentful...')
    const client = contentful.createClient({
      accessToken: MANAGEMENT_TOKEN,
    })

    console.log('🌍 Getting space and environment...')
    const space = await client.getSpace(SPACE_ID)
    const environment = await space.getEnvironment(ENVIRONMENT_ID)

    console.log('📝 Fetching blogPost content type...')
    const contentType = await environment.getContentType('blogPost')

    // Check if speakers field already exists
    const existingField = contentType.fields.find(field => field.id === 'speakers')

    if (existingField) {
      console.log('✅ speakers field already exists!')
      console.log('Field config:', JSON.stringify(existingField, null, 2))
      return
    }

    console.log('➕ Adding speakers field to blogPost content type...')

    // Add the new field
    contentType.fields.push({
      id: 'speakers',
      name: 'Speakers',
      type: 'Array',
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false,
      items: {
        type: 'Symbol',
        validations: [
          {
            size: { max: 100 }
          }
        ]
      }
    })

    console.log('💾 Saving content type...')
    const updatedContentType = await contentType.update()

    console.log('✅ Content type updated successfully!')
    console.log('📢 Publishing content type...')
    await updatedContentType.publish()

    console.log('🎉 Done! The "speakers" field has been added to the blogPost content type.')
    console.log('')
    console.log('You can now add speaker names or slugs to blog posts in Contentful.')
    console.log('Example values: ["Adam Cheyer", "Peter Norvig"] or ["adam-cheyer", "peter-norvig"]')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2))
    }
    process.exit(1)
  }
}

addSpeakersField()
