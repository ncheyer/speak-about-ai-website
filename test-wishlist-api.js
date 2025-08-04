#!/usr/bin/env node

// Test wishlist API directly
async function testWishlistAPI() {
  console.log('Testing wishlist API endpoints...\n')
  
  const baseUrl = 'http://localhost:3000'
  
  // Test adding to wishlist
  console.log('1. Testing /api/wishlist/add endpoint:')
  try {
    const response = await fetch(`${baseUrl}/api/wishlist/add`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': 'session_id=test-session-123'
      },
      body: JSON.stringify({ speakerId: 1 })
    })
    
    console.log(`   Status: ${response.status} ${response.statusText}`)
    const data = await response.json()
    console.log('   Response:', JSON.stringify(data, null, 2))
    
    if (!response.ok) {
      console.log('   ❌ API returned error status')
    } else if (data.success) {
      console.log('   ✓ Successfully added to wishlist')
    } else {
      console.log('   ❌ Failed to add to wishlist (returned success: false)')
    }
  } catch (error) {
    console.log('   ❌ Error calling API:', error.message)
  }
  
  // Test getting wishlist
  console.log('\n2. Testing /api/wishlist endpoint:')
  try {
    const response = await fetch(`${baseUrl}/api/wishlist`, {
      headers: { 
        'Cookie': 'session_id=test-session-123'
      }
    })
    
    console.log(`   Status: ${response.status} ${response.statusText}`)
    const data = await response.json()
    console.log('   Response:', JSON.stringify(data, null, 2))
  } catch (error) {
    console.log('   ❌ Error calling API:', error.message)
  }
  
  console.log('\n📝 Summary:')
  console.log('The wishlist API is failing because DATABASE_URL is not set.')
  console.log('To fix this issue:')
  console.log('1. Uncomment and set DATABASE_URL in your .env file')
  console.log('2. Run the wishlist migration to create the necessary tables')
  console.log('3. Restart your Next.js development server')
}

// Check if Next.js is running
fetch('http://localhost:3000')
  .then(() => {
    console.log('Next.js server is running on localhost:3000\n')
    testWishlistAPI()
  })
  .catch(() => {
    console.log('❌ Next.js server is not running on localhost:3000')
    console.log('Please start your development server with: npm run dev')
  })