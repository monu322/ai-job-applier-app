-- Add gender and areas of improvement columns
-- Gender will be inferred by LLM during CV parsing
-- Areas of improvement will be analyzed by LLM to help users improve their CV

ALTER TABLE personas
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS areas_of_improvement JSONB DEFAULT '[]'::jsonb;

-- Add comments for new columns
COMMENT ON COLUMN personas.gender IS 'Inferred gender from CV (male, female, other, or null if cannot determine)';
COMMENT ON COLUMN personas.areas_of_improvement IS 'Array of improvement suggestions for the CV, each with title and description';
