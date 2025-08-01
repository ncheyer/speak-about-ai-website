-- Insert sample deals data
INSERT INTO deals (
  client_name, client_email, client_phone, company,
  event_title, event_date, event_location, event_type,
  speaker_requested, attendee_count, budget_range, deal_value,
  status, priority, source, notes, last_contact, next_follow_up
) VALUES 
(
  'Sarah Johnson', 'sarah@techcorp.com', '+1-555-0123', 'TechCorp Inc',
  'AI Innovation Summit 2024', '2024-09-15', 'San Francisco, CA', 'Corporate Conference',
  'Adam Cheyer (Siri Co-Founder)', 500, '$50,000 - $75,000', 65000,
  'proposal', 'high', 'Website Contact Form', 
  'Large corporate event, very interested in AI keynote speakers. Budget confirmed.',
  '2024-01-18', '2024-01-22'
),
(
  'Michael Chen', 'm.chen@startup.io', '+1-555-0456', 'InnovateTech Startup',
  'Startup Tech Conference', '2024-08-20', 'Austin, TX', 'Tech Conference',
  'Machine Learning Expert', 200, '$15,000 - $25,000', 20000,
  'negotiation', 'medium', 'LinkedIn Outreach',
  'Startup looking for affordable ML speaker. Flexible on dates.',
  '2024-01-19', '2024-01-25'
),
(
  'Jennifer Williams', 'jwilliams@university.edu', '+1-555-0789', 'Stanford University',
  'AI Ethics Symposium', '2024-10-05', 'Palo Alto, CA', 'Academic Conference',
  'AI Ethics Expert', 150, '$10,000 - $20,000', 15000,
  'qualified', 'medium', 'Referral',
  'Academic event focused on AI ethics and responsible AI development.',
  '2024-01-16', '2024-01-23'
),
(
  'David Rodriguez', 'david@healthtech.com', '+1-555-0321', 'HealthTech Solutions',
  'Digital Health Innovation Forum', '2024-11-12', 'Boston, MA', 'Healthcare Conference',
  'Healthcare AI Specialist', 300, '$25,000 - $40,000', 35000,
  'lead', 'high', 'Website Contact Form',
  'Healthcare company interested in AI applications in medicine.',
  '2024-01-20', '2024-01-24'
),
(
  'Lisa Park', 'lisa@retailcorp.com', '+1-555-0654', 'RetailCorp',
  'Future of Retail Summit', '2024-07-30', 'Chicago, IL', 'Retail Conference',
  'Retail AI Expert', 400, '$30,000 - $50,000', 42000,
  'won', 'medium', 'Referral',
  'Successfully closed deal for retail AI keynote. Payment confirmed.',
  '2024-01-15', NULL
);
