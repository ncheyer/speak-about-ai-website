const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function updateSpeakerHeadlines() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    return;
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    console.log('Updating speaker headlines...');

    // Sample headlines for speakers
    const speakerHeadlines = [
      {
        name: 'Adam Cheyer',
        headline: 'VP of AI Experience at Airbnb, Co-Founder of Siri'
      },
      {
        name: 'Peter Norvig',
        headline: 'Former Director of Research at Google, AI Pioneer'
      },
      // Add more speakers as needed
    ];

    // First, let's check what speakers we have
    const speakers = await sql`
      SELECT id, name, one_liner, title 
      FROM speakers 
      WHERE active = true
      LIMIT 10
    `;

    console.log('Current speakers:');
    speakers.forEach(s => {
      console.log(`- ${s.name}: ${s.one_liner || s.title || '(no headline)'}`);
    });

    // Update specific speakers with headlines
    for (const speaker of speakerHeadlines) {
      const result = await sql`
        UPDATE speakers 
        SET one_liner = ${speaker.headline}
        WHERE name = ${speaker.name}
        AND (one_liner IS NULL OR one_liner = '')
        RETURNING name, one_liner
      `;
      
      if (result.length > 0) {
        console.log(`✅ Updated ${speaker.name} with headline: ${speaker.headline}`);
      }
    }

    // For speakers without headlines, generate a default one based on their info
    const updateDefaultHeadlines = await sql`
      UPDATE speakers 
      SET one_liner = CASE 
        WHEN title IS NOT NULL AND title != '' THEN title
        WHEN company IS NOT NULL AND company != '' THEN 'AI Expert at ' || company
        ELSE 'AI & Technology Expert'
      END
      WHERE (one_liner IS NULL OR one_liner = '')
      AND active = true
      RETURNING name, one_liner
    `;

    if (updateDefaultHeadlines.length > 0) {
      console.log(`\n✅ Updated ${updateDefaultHeadlines.length} speakers with default headlines:`);
      updateDefaultHeadlines.forEach(s => {
        console.log(`  - ${s.name}: ${s.one_liner}`);
      });
    }

    // Verify the updates
    console.log('\nVerifying updates...');
    const updatedSpeakers = await sql`
      SELECT name, one_liner, title 
      FROM speakers 
      WHERE active = true
      ORDER BY ranking DESC NULLS LAST, name ASC
      LIMIT 10
    `;

    console.log('\nUpdated speaker headlines:');
    updatedSpeakers.forEach(s => {
      console.log(`- ${s.name}: ${s.one_liner || s.title || '(still no headline)'}`);
    });

  } catch (error) {
    console.error('Error updating headlines:', error);
  }
}

updateSpeakerHeadlines();