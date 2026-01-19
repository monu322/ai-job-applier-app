-- Astra Apply Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    avatar_url TEXT,
    experience_level VARCHAR(50), -- e.g., 'Entry', 'Mid-Level', 'Senior', 'Lead'
    skills JSONB DEFAULT '[]'::jsonb,
    salary_min INTEGER,
    salary_max INTEGER,
    cv_file_url TEXT,
    cv_file_name VARCHAR(255),
    market_demand VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high'
    global_matches INTEGER DEFAULT 0,
    confidence_score DECIMAL(5,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table (for future use)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    company_logo_url TEXT,
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT false,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'USD',
    visa_sponsored BOOLEAN DEFAULT false,
    description TEXT,
    requirements TEXT[],
    benefits TEXT[],
    tags TEXT[],
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    experience_required VARCHAR(50),
    industry VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table (for future use)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    persona_id UUID NOT NULL REFERENCES personas(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'applied', 'interview', 'review', 'rejected'
    match_score DECIMAL(5,2),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ai_cover_letter TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_personas_user_id ON personas(user_id);
CREATE INDEX idx_personas_is_active ON personas(is_active);
CREATE INDEX idx_applications_persona_id ON applications(persona_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Row Level Security (RLS) Policies
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Personas: Users can only see their own personas
CREATE POLICY "Users can view own personas"
    ON personas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own personas"
    ON personas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personas"
    ON personas FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own personas"
    ON personas FOR DELETE
    USING (auth.uid() = user_id);

-- Applications: Users can only see applications for their personas
CREATE POLICY "Users can view own applications"
    ON applications FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM personas
        WHERE personas.id = applications.persona_id
        AND personas.user_id = auth.uid()
    ));

CREATE POLICY "Users can create applications for own personas"
    ON applications FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM personas
        WHERE personas.id = applications.persona_id
        AND personas.user_id = auth.uid()
    ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for CV files (run this separately in Supabase Dashboard -> Storage)
-- CREATE BUCKET 'cv-uploads' WITH PUBLIC false;

-- Storage policy for CV uploads
-- CREATE POLICY "Users can upload own CVs"
--     ON storage.objects FOR INSERT
--     WITH CHECK (bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

COMMENT ON TABLE personas IS 'User career personas created from different CVs';
COMMENT ON TABLE jobs IS 'Job listings available for application';
COMMENT ON TABLE applications IS 'Job applications made by personas';
