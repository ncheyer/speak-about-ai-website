const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Running migrations...');

    // Add slug column if it doesn't exist
    console.log('Adding slug column...');
    await sql`ALTER TABLE speakers ADD COLUMN IF NOT EXISTS slug VARCHAR(255)`;
    
    // Generate slugs for existing speakers
    console.log('Generating slugs for existing speakers...');
    await sql`
      UPDATE speakers 
      SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\\s-]', '', 'g'), '\\s+', '-', 'g'))
      WHERE slug IS NULL
    `;

    // Add other missing columns
    console.log('Adding missing columns...');
    await sql`ALTER TABLE speakers ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0`;
    await sql`ALTER TABLE speakers ADD COLUMN IF NOT EXISTS listed BOOLEAN DEFAULT true`;
    await sql`ALTER TABLE speakers ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false`;
    await sql`ALTER TABLE speakers ADD COLUMN IF NOT EXISTS ranking INTEGER DEFAULT 0`;
    
    // Add indexes
    console.log('Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_speakers_slug ON speakers(slug) WHERE slug IS NOT NULL`;
    await sql`CREATE INDEX IF NOT EXISTS idx_speakers_active ON speakers(active)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_speakers_featured ON speakers(featured) WHERE featured = true`;
    await sql`CREATE INDEX IF NOT EXISTS idx_speakers_ranking ON speakers(ranking DESC)`;

    console.log('Migrations completed successfully!');
    
    // Verify the columns exist
    const result = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'speakers' 
      AND column_name IN ('slug', 'profile_views', 'listed', 'featured', 'ranking')
    `;
    
    console.log('Verified columns:', result.map(r => r.column_name).join(', '));
    
  } catch (error) {
    console.error('Migration error:', error);
  }
}

runMigrations();