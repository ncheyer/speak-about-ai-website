#!/usr/bin/env node

/**
 * Security Setup Script
 * Generates secure credentials for the Speak About AI website
 */

const crypto = require('crypto');
const { hashPassword } = require('../lib/password-utils');

function generateSecureJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

function generateSecurePassword() {
  // Generate a secure random password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function main() {
  console.log('🔐 Security Setup for Speak About AI Website\n');
  
  // Generate secure admin password
  const adminPassword = generateSecurePassword();
  console.log('Generated Admin Password:', adminPassword);
  console.log('⚠️  SAVE THIS PASSWORD SECURELY - IT WILL NOT BE SHOWN AGAIN\n');
  
  // Hash the password
  const hashedPassword = hashPassword(adminPassword);
  console.log('Hashed Password (for ADMIN_PASSWORD_HASH):', hashedPassword);
  
  // Generate JWT secret
  const jwtSecret = generateSecureJWTSecret();
  console.log('JWT Secret (for JWT_SECRET):', jwtSecret);
  
  console.log('\n📝 Environment Variables to Set:');
  console.log('================================');
  console.log('ADMIN_EMAIL="admin@yourcompany.com"');
  console.log(`ADMIN_PASSWORD_HASH="${hashedPassword}"`);
  console.log(`JWT_SECRET="${jwtSecret}"`);
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Copy the environment variables above to your .env file');
  console.log('2. Save the admin password in a secure location');
  console.log('3. Update your production environment with these values');
  console.log('4. Remove the hardcoded credentials from your code');
  
  console.log('\n✅ Security improvements completed!');
}

main().catch(console.error);