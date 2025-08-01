-- Create deals table for CRM system
CREATE TABLE IF NOT EXISTS deals (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    company VARCHAR(255),
    event_title VARCHAR(255) NOT NULL,
    event_date DATE,
    event_location VARCHAR(255),
    event_type VARCHAR(255),
    speaker_requested VARCHAR(255),
    attendee_count INTEGER DEFAULT 0,
    budget_range VARCHAR(100),
    deal_value DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'lead',
    priority VARCHAR(20) DEFAULT 'medium',
    source VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_contact DATE,
    next_follow_up DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_priority ON deals(priority);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);
