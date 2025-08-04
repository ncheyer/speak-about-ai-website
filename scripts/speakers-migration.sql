-- Generated Speaker Migration SQL
-- Run this in your Neon database console
-- Total speakers to import: 2
-- NOTE: Email addresses will need to be added manually or from another source

-- Speaker 1: Peter Norvig
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
    'Peter Norvig',
    'peter-norvig@speakaboutai.com', -- PLACEHOLDER - UPDATE WITH REAL EMAIL
    'https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/peter-norvig-headshot-1749608907310.jpg',
    'https://oo7gkn3bwcev8cb0.',
    'Co-Author of Artificial Intelligence: A Modern Approach, Stanford Researcher',
    'TRUE',
    '["TRUE"]',
    'Peter Norvig, a distinguished American computer scientist, is widely recognized for his profound ...',
    'peter-norvig',
    'Co-Author of Artificial Intelligence: A Modern Approach, Stanford Researcher',
    false,
    '$20k to $50k',
    'San Francisco CA',
    true,
    '["AI Research","Machine Learning","Natural Language Processing","Computer Science Education","Search Algorithms","Academic Leadership"]',
    NULL,
    '100',
    NULL,
    '[{"id":"peternorvigvideo1","title":"The Future of AI: A Fireside Chat Between Peter Norvig & Adam Cheyer","url":"https://www.youtube.com/watch?v=mSmJkzKwVCw","thumbnail":"https://i.ytimg.com/vi/mSmJkzKwVCw/hqdefault.jpg","source":"YouTube","duration":"18:14"},{"id":"peternorvigvideo2","title":"Peter Norvig: The 100,000-student classroom","url":"https://www.youtube.com/watch?v=tYclUdcsdeo","thumbnail":"https://i.ytimg.com/vi/tYclUdcsdeo/hqdefault.jpg","source":"YouTube","duration":"6:11"}]',
    '[{"quote":"The event was great!! We had incredible interest and saw strong numbers. The process was smooth and your communication was fantastic. Truly, I don‚Äôt know if there‚Äôs anything I could think of to improve!","author":"Rachel F.","position":"Marketing Campaign Manager","company":"Juniper Networks","event":"AI Gamechangers"}]',
    true,
    false  -- They'll need to register and verify email
);

-- Speaker 2: Adam Cheyer
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
    'Adam Cheyer',
    'adam-cheyer@speakaboutai.com', -- PLACEHOLDER - UPDATE WITH REAL EMAIL
    'Adam is an expert in entrepreneurship, artificial intelligence, and scaling startups. With over ten years of experience founding and exiting companies, he was a co-founder of Siri, which Apple acquired, co-founded Viv Labs, which was acquired by Samsung, and Gameplanner.AI, which was Airbnb‚Äôs first acquisition since going public. 

Through Siri and Bixby (Apple & Samsung‚Äôs voice assistants), Adam has created key technology in over 1.5 billion devices. A founding developer of Change.org, he‚Äôs helped unite 500M+ members to create social change across the globe. After his most recent acquisition, he leads all AI efforts at Airbnb as the VP of AI Experience. Adam is a 30+ year veteran in Artificial Intelligence, initially starting as a researcher at SRI International. With 39 patents and 60+ publications, his technical expertise and visionary approach to entrepreneurship are widely recognized across the globe. Before Siri, he co-founded Sentient Technologies, which applies distributed machine learning algorithms to discover novel solutions to complex problems.
 
Beyond his success in technology, Adam is also an award-winning magician. He‚Äôs performed on some of the most prestigious stages in magic, including the Magic Castle in Los Angeles and the hit TV show ‚ÄúPenn and Teller Fool Us.‚Äù As a bonus, Adam usually includes a magic trick as a way to entertain and delight during his keynotes.',
    'Adam is an expert in entrepreneurship, artificial intelligence, and scaling startups.',
    'VP of AI Experience at Airbnb Co-Founder of Siri',
    'https://oo7gkn3bwcev8cb0.public.blob.vercel-storage.com/adam-cheyer-headshot-1749607372221.jpg',
    '["Conversational AI","Voice Assistants","Entrepreneurship","Product Development","AI Product Strategy","Technology Innovation","Entrepreneurship"]',
    'Please Inquire',
    'adam-cheyer',
    'VP of AI Experience at Airbnb Co-Founder of Siri',
    true,
    NULL,
    'ChatGPT and The Rise of Conversational AI, The Future of AI and Businesses, ‚ÄúHey SIRI‚Äù: A Founding Story',
    true,
    '["Technology","Startups","Social Impact Organizations","Entertainment","Real Estate"]',
    98,
    'top',
    '100',
    '[{"id":"adamcheyervideo1","title":"The Future of AI: A Fireside Chat Between Peter Norvig & Adam Cheyer","url":"https://www.youtube.com/watch?v=mSmJkzKwVCw","thumbnail":"https://i.ytimg.com/vi/mSmJkzKwVCw/hqdefault.jpg","source":"YouTube","duration":"18:14"},{"id":"adamcheyervideo2","title":"Artificial Intelligence | Adam Cheyer of Viv Labs & Siri | SCALE 2017","url":"https://www.youtube.com/watch?v=016w517R1Hw","thumbnail":"https://i.ytimg.com/vi/016w517R1Hw/hqdefault.jpg","source":"YouTube","duration":"31:57"}]',
    '[]',
    true,
    false  -- They'll need to register and verify email
);


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
