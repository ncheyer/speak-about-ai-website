// CSV to SQL Converter for Speaker Migration
// This Node.js script helps convert your Google Sheets CSV export to SQL INSERT statements

// INSTRUCTIONS:
// 1. Save your Google Sheets export as 'speakers.csv' in the same folder as this script
// 2. Run: node csv-to-sql-converter.js
// 3. Copy the generated SQL statements to your Neon console

const fs = require('fs');
const path = require('path');

// Configuration - Updated to match your Google Sheets headers
const COLUMN_MAPPING = {
  name: 'NAME',              // Required
  email: null,               // Not in your sheets - will be handled separately
  bio: 'BIO',
  short_bio: 'BIO',          // Using same bio for short_bio
  one_liner: 'TITLE',        // Using title as one-liner
  headshot_url: 'IMAGE',
  website: null,             // Not in your sheets
  speaking_fee_range: 'FEE',
  topics: 'EXPERTISE',       // Using expertise as topics
  travel_preferences: null,  // Not in your sheets
  technical_requirements: null, // Not in your sheets
  dietary_restrictions: null,   // Not in your sheets
  // Additional fields from your sheets
  slug: 'SLUG',
  title: 'TITLE',
  featured: 'FEATURED',
  location: 'LOCATION',
  programs: 'PROGRAMS',
  listed: 'LISTED',
  industries: 'INDUSTRIES',
  ranking: 'RANKING',
  image_position: 'IMAGEPOSITION',
  image_offset: 'IMAGEOFFSET',
  videos: 'VIDEOS',
  testimonials: 'TESTIMONIALS'
};

function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < csvText.length) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i += 2;
        continue;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // End of row
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      }
      // Skip \r\n combinations
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
    } else {
      currentField += char;
    }
    i++;
  }
  
  // Add the last field and row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }
  
  if (rows.length === 0) return [];
  
  const headers = rows[0];
  const speakers = [];
  
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i];
    const speaker = {};
    
    headers.forEach((header, index) => {
      speaker[header] = values[index] || '';
    });
    
    speakers.push(speaker);
  }
  
  return speakers;
}


function escapeSQL(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

function formatTopics(topicsString) {
  if (!topicsString) return "'[]'";
  const topics = topicsString.split(',').map(t => t.trim()).filter(t => t);
  return "'" + JSON.stringify(topics).replace(/'/g, "''") + "'";
}

function formatJSONField(jsonString) {
  if (!jsonString) return "'[]'";
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(jsonString);
    return "'" + JSON.stringify(parsed).replace(/'/g, "''") + "'";
  } catch (e) {
    // If it's not valid JSON, treat as empty array
    console.log(`Warning: Invalid JSON field, using empty array: ${jsonString.substring(0, 50)}...`);
    return "'[]'";
  }
}

function formatBoolean(value) {
  if (typeof value === 'string') {
    return value.toUpperCase() === 'TRUE' || value === '1' ? 'true' : 'false';
  }
  return value ? 'true' : 'false';
}

function truncateField(value, maxLength) {
  if (!value) return null;
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength - 3) + '...';
}

function generateShortBio(bio) {
  if (!bio) return null;
  // Extract first sentence or first 400 characters, whichever is shorter
  const firstSentence = bio.split(/[.!?]/)[0];
  if (firstSentence && firstSentence.length <= 400) {
    return firstSentence + '.';
  }
  return bio.substring(0, 397) + '...';
}

function generateSQL(speakers) {
  let sql = `-- Generated Speaker Migration SQL
-- Run this in your Neon database console
-- Total speakers to import: ${speakers.length}
-- NOTE: Email addresses will need to be added manually or from another source

`;

  speakers.forEach((speaker, index) => {
    const name = speaker[COLUMN_MAPPING.name];
    const slug = speaker[COLUMN_MAPPING.slug];
    
    if (!name) {
      console.log(`Skipping speaker ${index + 1}: Missing name`);
      return;
    }

    // Generate placeholder email from slug or name
    const placeholderEmail = slug ? `${slug}@speakaboutai.com` : 
                             name ? `${name.toLowerCase().replace(/\s+/g, '.')}@speakaboutai.com` : 
                             `speaker${index + 1}@speakaboutai.com`;

    // Truncate fields that have size limits
    const truncatedName = truncateField(name, 255);
    const truncatedTitle = truncateField(speaker[COLUMN_MAPPING.title], 255);
    const truncatedOneLinr = truncateField(speaker[COLUMN_MAPPING.title], 255); // Using title as one-liner
    const truncatedLocation = truncateField(speaker[COLUMN_MAPPING.location], 255);
    const truncatedFeeRange = truncateField(speaker[COLUMN_MAPPING.speaking_fee_range], 100);
    const shortBio = generateShortBio(speaker[COLUMN_MAPPING.bio]);

    sql += `-- Speaker ${index + 1}: ${name}
INSERT INTO speakers (
    name, 
    email, 
    bio, 
    short_bio, 
    one_liner, 
    headshot_url, 
    topics,
    speaking_fee_range,
    slug,
    title,
    featured,
    location,
    programs,
    listed,
    industries,
    ranking,
    image_position,
    image_offset,
    videos,
    testimonials,
    active,
    email_verified
) VALUES (
    ${escapeSQL(truncatedName)},
    ${escapeSQL(placeholderEmail)}, -- PLACEHOLDER - UPDATE WITH REAL EMAIL
    ${escapeSQL(speaker[COLUMN_MAPPING.bio])},
    ${escapeSQL(shortBio)},
    ${escapeSQL(truncatedOneLinr)},
    ${escapeSQL(speaker[COLUMN_MAPPING.headshot_url])},
    ${formatTopics(speaker[COLUMN_MAPPING.topics])},
    ${escapeSQL(truncatedFeeRange)},
    ${escapeSQL(speaker[COLUMN_MAPPING.slug])},
    ${escapeSQL(truncatedTitle)},
    ${formatBoolean(speaker[COLUMN_MAPPING.featured])},
    ${escapeSQL(truncatedLocation)},
    ${escapeSQL(speaker[COLUMN_MAPPING.programs])},
    ${speaker[COLUMN_MAPPING.listed] === 'FALSE' || speaker[COLUMN_MAPPING.listed] === '0' ? 'false' : 'true'},
    ${formatTopics(speaker[COLUMN_MAPPING.industries])},
    ${speaker[COLUMN_MAPPING.ranking] ? parseInt(speaker[COLUMN_MAPPING.ranking]) || 'NULL' : 'NULL'},
    ${escapeSQL(speaker[COLUMN_MAPPING.image_position])},
    ${escapeSQL(speaker[COLUMN_MAPPING.image_offset])},
    ${formatJSONField(speaker[COLUMN_MAPPING.videos])},
    ${formatJSONField(speaker[COLUMN_MAPPING.testimonials])},
    true,
    false  -- They'll need to register and verify email
);

`;
  });

  sql += `
-- After importing speakers, link them to existing projects/deals:
UPDATE projects 
SET speaker_id = (
    SELECT id FROM speakers 
    WHERE LOWER(name) = LOWER(requested_speaker_name)
) 
WHERE requested_speaker_name IS NOT NULL 
AND speaker_id IS NULL;

UPDATE deals 
SET speaker_id = (
    SELECT id FROM speakers 
    WHERE LOWER(name) = LOWER(speaker_requested)
) 
WHERE speaker_requested IS NOT NULL 
AND speaker_id IS NULL;
`;

  return sql;
}

// Main execution
try {
  const csvPath = path.join(__dirname, 'speakers.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.log('❌ speakers.csv not found!');
    console.log('Please export your Google Sheets as CSV and save it as "speakers.csv" in this folder.');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const speakers = parseCSV(csvContent);
  
  console.log(`📊 Found ${speakers.length} speakers in CSV`);
  
  // Show column mapping
  console.log('\n📋 Column Mapping (update COLUMN_MAPPING in script if needed):');
  Object.entries(COLUMN_MAPPING).forEach(([dbField, csvColumn]) => {
    console.log(`  ${dbField} ← "${csvColumn}"`);
  });

  const sql = generateSQL(speakers);
  
  const outputPath = path.join(__dirname, 'speakers-migration.sql');
  fs.writeFileSync(outputPath, sql);
  
  console.log(`\n✅ Generated SQL file: ${outputPath}`);
  console.log('📝 Next steps:');
  console.log('1. Review the generated SQL file');
  console.log('2. Copy and paste the SQL into your Neon database console');
  console.log('3. Run the SQL to import your speakers');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}