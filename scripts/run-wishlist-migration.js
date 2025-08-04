#!/usr/bin/env node

/**
 * Script to run the wishlist database migration
 * This creates the wishlists table and related tables in your Neon database
 */

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🚀 Starting wishlist database migration...');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('Please set your Neon database URL in your .env file or environment variables');
    process.exit(1);
  }

  try {
    // Initialize Neon client
    const sql = neon(process.env.DATABASE_URL);
    
    // Test connection
    console.log('Testing database connection...');
    await sql`SELECT 1 as test`;
    console.log('✓ Database connection successful');
    
    // Check if speakers table exists first
    console.log('Checking prerequisites...');
    const speakersCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'speakers'
      ) as table_exists
    `;
    
    if (!speakersCheck[0]?.table_exists) {
      console.error('❌ Speakers table does not exist');
      console.log('Please run the speakers migration first');
      process.exit(1);
    }
    console.log('✓ Speakers table exists');
    
    // Read the SQL migration file
    const sqlFilePath = path.join(__dirname, 'create-wishlist-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the migration
    console.log('Running wishlist migration...');
    await sql.unsafe(sqlContent);
    
    // Verify tables were created
    console.log('Verifying migration...');
    const tableCheck = await sql`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('wishlists', 'deal_speaker_interests', 'email_notifications')
    `;
    
    const tableCount = parseInt(tableCheck[0].count);
    console.log(`✓ Created ${tableCount} tables`);
    
    // Check wishlist table structure
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'wishlists'
      ORDER BY ordinal_position
    `;
    
    console.log('✓ Wishlist table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
    console.log('\n✅ Wishlist migration completed successfully!');
    console.log('The wishlist functionality should now work properly.');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Check your DATABASE_URL is correct');
    console.log('2. Ensure the database is accessible');
    console.log('3. Make sure the speakers table exists first');
    process.exit(1);
  }
}

// Run the migration
runMigration();