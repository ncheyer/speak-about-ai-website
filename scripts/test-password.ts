import { verifyPassword, hashPassword } from '../lib/password-utils'

// Test password verification
const storedHash = process.env.ADMIN_PASSWORD_HASH || "b34bfe3949db4361356e70be163abec7:27a16799e2a3c64cada072197091e0ff1cefa30f9cd786b5a6ba516910334ced061038392714e4d7143e5b0829a0f604c6d536ffa9e0419e88f995afb5d117ab"

// Test with some common passwords to debug
const testPasswords = [
  'admin',
  'Admin123',
  'Admin123!',
  'password',
  'Password123',
  'Password123!',
  'speakaboutai',
  'SpeakAboutAI123'
]

console.log('Testing password verification...')
console.log('Current hash:', storedHash.substring(0, 50) + '...')
console.log('\nTrying common passwords:')

for (const password of testPasswords) {
  const result = verifyPassword(password, storedHash)
  console.log(`${password}: ${result ? '✅ MATCH' : '❌ No match'}`)
}

// Also generate a new hash for a known password for testing
console.log('\n\nGenerating new hash for "TestPassword123"...')
const newHash = hashPassword('TestPassword123')
console.log('New hash:', newHash)

// Verify the new hash works
console.log('Verifying new hash:', verifyPassword('TestPassword123', newHash) ? '✅ Works' : '❌ Failed')

// Test the exact hash from env
console.log('\n\nTesting hash structure:')
const parts = storedHash.split(':')
console.log('Salt length:', parts[0]?.length || 0, '(should be 32)')
console.log('Hash length:', parts[1]?.length || 0, '(should be 128)')
