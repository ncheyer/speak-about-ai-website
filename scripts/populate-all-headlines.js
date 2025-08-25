const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function populateAllHeadlines() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Starting to populate headlines for all speakers...\n');

    // First, get all speakers to see what we're working with
    const allSpeakers = await sql`
      SELECT id, name, one_liner, title
      FROM speakers 
      WHERE active = true
      ORDER BY name ASC
    `;

    console.log(`Found ${allSpeakers.length} active speakers`);
    
    const speakersNeedingUpdate = allSpeakers.filter(s => 
      (!s.one_liner || s.one_liner.trim() === '') && 
      (s.title && s.title.trim() !== '')
    );
    
    console.log(`${speakersNeedingUpdate.length} speakers need headline updates (have title but no one_liner)\n`);

    if (speakersNeedingUpdate.length === 0) {
      console.log('No speakers need updating!');
      return;
    }

    // Update all speakers that have a title but no one_liner
    console.log('Updating speakers with their title field...');
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const speaker of speakersNeedingUpdate) {
      try {
        const result = await sql`
          UPDATE speakers 
          SET one_liner = ${speaker.title}
          WHERE id = ${speaker.id}
          AND (one_liner IS NULL OR one_liner = '')
          RETURNING name, one_liner
        `;
        
        if (result.length > 0) {
          console.log(`✅ ${speaker.name}: "${speaker.title}"`);
          successCount++;
        } else {
          console.log(`⚠️ ${speaker.name}: Already has headline or update skipped`);
        }
      } catch (error) {
        console.error(`❌ Failed to update ${speaker.name}:`, error.message);
        failureCount++;
      }
    }

    console.log(`\n========================================`);
    console.log(`Update Summary:`);
    console.log(`✅ Successfully updated: ${successCount} speakers`);
    if (failureCount > 0) {
      console.log(`❌ Failed updates: ${failureCount} speakers`);
    }
    console.log(`========================================\n`);

    // Verify the final state
    const finalCheck = await sql`
      SELECT 
        COUNT(*) as total_speakers,
        COUNT(CASE WHEN one_liner IS NOT NULL AND one_liner != '' THEN 1 END) as speakers_with_headlines,
        COUNT(CASE WHEN one_liner IS NULL OR one_liner = '' THEN 1 END) as speakers_without_headlines
      FROM speakers 
      WHERE active = true
    `;

    console.log('Final Database State:');
    console.log(`Total active speakers: ${finalCheck[0].total_speakers}`);
    console.log(`Speakers WITH headlines: ${finalCheck[0].speakers_with_headlines}`);
    console.log(`Speakers WITHOUT headlines: ${finalCheck[0].speakers_without_headlines}`);

    // Show a few examples of the updated headlines
    console.log('\nSample of updated headlines:');
    const samples = await sql`
      SELECT name, one_liner 
      FROM speakers 
      WHERE active = true 
      AND one_liner IS NOT NULL 
      AND one_liner != ''
      ORDER BY RANDOM()
      LIMIT 5
    `;
    
    samples.forEach(s => {
      console.log(`- ${s.name}: "${s.one_liner}"`);
    });

  } catch (error) {
    console.error('Error populating headlines:', error);
  }
}

populateAllHeadlines();