#!/usr/bin/env node

import { hashPassword } from '../lib/password-utils'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

// Hide password input
const askPassword = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    const stdin = process.stdin
    const stdout = process.stdout

    stdout.write(query)

    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')

    let password = ''
    
    stdin.on('data', (ch: string) => {
      const char = ch.toString('utf8')
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false)
          stdin.pause()
          stdout.write('\n')
          resolve(password)
          break
        case '\u0003':
          process.exit()
          break
        case '\u007f': // Backspace
        case '\b':
          if (password.length > 0) {
            password = password.slice(0, -1)
            stdout.clearLine(0)
            stdout.cursorTo(query.length)
            stdout.write('*'.repeat(password.length))
          }
          break
        default:
          password += char
          stdout.write('*')
          break
      }
    })
  })
}

async function main() {
  console.log('🔐 Admin Password Reset Tool')
  console.log('============================\n')
  
  const email = await new Promise<string>((resolve) => {
    rl.question('Enter admin email: ', resolve)
  })
  
  const password = await askPassword('Enter new password: ')
  const confirmPassword = await askPassword('Confirm password: ')
  
  if (password !== confirmPassword) {
    console.error('\n❌ Passwords do not match!')
    process.exit(1)
  }
  
  if (password.length < 8) {
    console.error('\n❌ Password must be at least 8 characters long!')
    process.exit(1)
  }
  
  const hash = hashPassword(password)
  
  console.log('\n✅ Password hash generated successfully!\n')
  console.log('Add these to your .env.local file:')
  console.log('=====================================')
  console.log(`ADMIN_EMAIL="${email}"`)
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`)
  console.log('=====================================\n')
  console.log('📝 Note: Make sure to restart your Next.js server after updating the .env.local file')
  
  rl.close()
  process.exit(0)
}

main().catch(console.error)
