/**
 * Admin Login Troubleshooting Script
 * Tests the admin login configuration and credentials
 */

const { verifyPassword, hashPassword } = require('../lib/password-utils');
require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Admin Login Configuration Check\n');
console.log('='.repeat(50));

// Check environment variables
console.log('\n1. Environment Variables:');
console.log('   ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✅ Set' : '❌ Missing');
console.log('   ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH ? '✅ Set' : '❌ Missing');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');

if (process.env.ADMIN_EMAIL) {
  console.log('   Email value:', process.env.ADMIN_EMAIL);
}

// Test password verification
console.log('\n2. Password Hash Verification:');
if (process.env.ADMIN_PASSWORD_HASH) {
  const testPasswords = [
    'admin', 'Admin123', 'password', 'Password123', 
    'admin123', 'Admin@123', 'SpeakAboutAI2024'
  ];
  
  console.log('   Testing common passwords...');
  let passwordFound = false;
  
  for (const testPass of testPasswords) {
    if (verifyPassword(testPass, process.env.ADMIN_PASSWORD_HASH)) {
      console.log(`   ✅ Password matches: "${testPass}"`);
      passwordFound = true;
      break;
    }
  }
  
  if (!passwordFound) {
    console.log('   ⚠️  None of the common passwords match');
    console.log('   The password might be a custom one');
  }
}

// Generate new password hash if requested
if (process.argv[2]) {
  const newPassword = process.argv[2];
  const newHash = hashPassword(newPassword);
  console.log('\n3. New Password Hash Generation:');
  console.log('   Password:', newPassword);
  console.log('   Generated Hash:', newHash);
  console.log('\n   To use this password, set in your environment:');
  console.log(`   ADMIN_PASSWORD_HASH="${newHash}"`);
}

// Test production URL
console.log('\n4. Production Test:');
console.log('   Production URL: https://speakabout.ai/admin');
console.log('   Local test URL: http://localhost:3000/admin');

console.log('\n5. Common Issues and Solutions:');
console.log('   ❌ If login fails in production:');
console.log('      - Ensure environment variables are set in Vercel dashboard');
console.log('      - Check that ADMIN_EMAIL matches exactly (case-sensitive)');
console.log('      - Verify ADMIN_PASSWORD_HASH is copied correctly');
console.log('      - Ensure JWT_SECRET is set (required for token generation)');
console.log('\n   ❌ If getting "Authentication service unavailable":');
console.log('      - ADMIN_EMAIL or ADMIN_PASSWORD_HASH is missing');
console.log('\n   ❌ If getting "Authentication service configuration error":');
console.log('      - JWT_SECRET is missing or invalid');

console.log('\n6. To set a new password:');
console.log('   Run: node scripts/test-admin-login.js "YourNewPassword"');
console.log('   Then update ADMIN_PASSWORD_HASH in Vercel environment variables');

console.log('\n' + '='.repeat(50));