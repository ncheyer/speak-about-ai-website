-- Insert sample deals data for testing
INSERT INTO deals (
    client_name, client_email, client_phone, company,
    event_title, event_date, event_location, event_type,
    speaker_requested, attendee_count, budget_range, deal_value,
    status, priority, source, notes, last_contact, next_follow_up
) VALUES 
(
    'Sarah Johnson', 'sarah.johnson@techcorp.com', '+1-555-0123', 'TechCorp Inc.',
    'AI Innovation Summit 2024', '2024-06-15', 'San Francisco, CA', 'Conference',
    'Peter Norvig', 500, '$50,000-$100,000', 75000.00,
    'proposal', 'high', 'Website Contact Form',
    'Interested in AI keynote speaker for their annual summit. Budget confirmed.',
    '2024-01-15', '2024-01-22'
),
(
    'Michael Chen', 'mchen@healthplus.org', '+1-555-0456', 'HealthPlus Medical',
    'Healthcare AI Workshop', '2024-05-20', 'Boston, MA', 'Workshop',
    'Dr. Shafi Ahmed', 150, '$20,000-$50,000', 35000.00,
    'negotiation', 'medium', 'LinkedIn',
    'Looking for healthcare AI expert for medical staff training workshop.',
    '2024-01-10', '2024-01-18'
),
(
    'Emily Rodriguez', 'emily.r@financeworld.com', '+1-555-0789', 'Finance World LLC',
    'Future of Finance Conference', '2024-07-10', 'New York, NY', 'Panel Discussion',
    'Cassie Kozyrkov', 300, '$30,000-$75,000', 50000.00,
    'qualified', 'high', 'Referral',
    'Panel discussion on AI in financial services. Multiple speakers needed.',
    '2024-01-12', '2024-01-20'
),
(
    'David Kim', 'dkim@autotech.com', '+1-555-0321', 'AutoTech Solutions',
    'Automotive AI Symposium', '2024-08-05', 'Detroit, MI', 'Keynote',
    'Adam Cheyer', 400, '$40,000-$80,000', 60000.00,
    'lead', 'medium', 'Cold Email',
    'Initial inquiry about AI in automotive industry keynote speaker.',
    '2024-01-08', '2024-01-16'
),
(
    'Lisa Thompson', 'lisa@retailinnovate.com', '+1-555-0654', 'Retail Innovate',
    'Retail Technology Expo', '2024-09-12', 'Las Vegas, NV', 'Fireside Chat',
    'Allie K. Miller', 250, '$25,000-$50,000', 40000.00,
    'won', 'low', 'Trade Show',
    'Confirmed booking for retail AI fireside chat. Contract signed.',
    '2024-01-05', NULL
),
(
    'Robert Wilson', 'rwilson@edutech.edu', '+1-555-0987', 'EduTech University',
    'Education AI Summit', '2024-04-18', 'Chicago, IL', 'Workshop',
    'Sharon Zhou', 200, '$15,000-$30,000', 25000.00,
    'lost', 'low', 'University Network',
    'Budget constraints led to cancellation. Keep for future opportunities.',
    '2024-01-03', NULL
),
(
    'Amanda Foster', 'afoster@globalcorp.com', '+1-555-0147', 'Global Corp International',
    'Leadership in AI Era', '2024-10-22', 'London, UK', 'Keynote',
    'Charlene Li', 600, '$75,000-$150,000', 100000.00,
    'proposal', 'urgent', 'Executive Referral',
    'High-profile international event. CEO specifically requested Charlene Li.',
    '2024-01-14', '2024-01-21'
),
(
    'James Martinez', 'jmartinez@startupaccel.com', '+1-555-0258', 'Startup Accelerator',
    'AI for Startups Bootcamp', '2024-03-30', 'Austin, TX', 'Workshop',
    'Maya Ackerman', 100, '$10,000-$25,000', 18000.00,
    'qualified', 'medium', 'Startup Network',
    'Bootcamp for early-stage AI startups. Looking for practical AI guidance.',
    '2024-01-11', '2024-01-19'
);
