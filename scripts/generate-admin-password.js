#!/usr/bin/env node

const crypto = require('crypto');

// Function to hash password (same as in lib/password-utils.ts)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.log('\n❌ Please provide a password as an argument');
  console.log('Usage: node scripts/generate-admin-password.js "YourSecurePassword"\n');
  process.exit(1);
}

// Generate the hash
const passwordHash = hashPassword(password);

console.log('\n✅ Admin Password Hash Generated!\n');
console.log('Add these to your environment variables (Vercel/Railway/etc):\n');
console.log('ADMIN_EMAIL=your-admin-email@company.com');
console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('hex'));
console.log('\n⚠️  IMPORTANT: Keep these values secure and never commit them to git!\n');
console.log('Your password:', password);
console.log('(Save this password - you\'ll need it to login)\n');