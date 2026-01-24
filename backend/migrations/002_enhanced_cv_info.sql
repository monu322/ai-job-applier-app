-- Enhanced CV Information Schema
-- Adds comprehensive CV parsing fields to personas table

-- Add new fields to personas table
ALTER TABLE personas
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS roles JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS job_search_location VARCHAR(255),
ADD COLUMN IF NOT EXISTS work_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS education TEXT;

-- Add comments for new columns
COMMENT ON COLUMN personas.email IS 'Contact email from CV';
COMMENT ON COLUMN personas.phone IS 'Contact phone from CV';
COMMENT ON COLUMN personas.summary IS 'Professional summary (2-3 sentences)';
COMMENT ON COLUMN personas.roles IS 'Array of job roles/titles to search for';
COMMENT ON COLUMN personas.job_search_location IS 'Preferred job search location';
COMMENT ON COLUMN personas.work_history IS 'Array of work history objects with company, position, duration, description, achievements, start_date, end_date, skills';
COMMENT ON COLUMN personas.education IS 'Highest degree and institution';
