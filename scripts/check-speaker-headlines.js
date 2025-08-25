const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkSpeakerHeadlines() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Checking speaker headlines...\n');

    // Get all active speakers
    const allSpeakers = await sql`
      SELECT id, name, one_liner, title, bio, short_bio
      FROM speakers 
      WHERE active = true
      ORDER BY ranking DESC NULLS LAST, name ASC
    `;

    const speakersWithHeadlines = allSpeakers.filter(s => s.one_liner && s.one_liner.trim() !== '');
    const speakersWithoutHeadlines = allSpeakers.filter(s => !s.one_liner || s.one_liner.trim() === '');

    console.log(`Total active speakers: ${allSpeakers.length}`);
    console.log(`Speakers WITH headlines: ${speakersWithHeadlines.length}`);
    console.log(`Speakers WITHOUT headlines: ${speakersWithoutHeadlines.length}`);

    if (speakersWithoutHeadlines.length > 0) {
      console.log('\nSpeakers missing headlines:');
      speakersWithoutHeadlines.forEach(s => {
        const bio = s.bio || s.short_bio || '';
        const bioSnippet = bio.substring(0, 100);
        console.log(`\n- ${s.name} (ID: ${s.id})`);
        if (s.title) console.log(`  Current title field: ${s.title}`);
        if (bioSnippet) console.log(`  Bio snippet: ${bioSnippet}...`);
      });
    }

    if (speakersWithHeadlines.length > 0) {
      console.log('\n\nSample of speakers WITH headlines:');
      speakersWithHeadlines.slice(0, 5).forEach(s => {
        console.log(`- ${s.name}: "${s.one_liner}"`);
      });
    }

  } catch (error) {
    console.error('Error checking headlines:', error);
  }
}

checkSpeakerHeadlines();