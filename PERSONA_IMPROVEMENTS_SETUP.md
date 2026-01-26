# Persona Improvements & Gender-Aware Features Setup

This document explains the new features added to the persona page and how to complete the setup.

## What's New

### 1. **Gender-Aware Persona Detection**
- The LLM now infers the user's gender during CV parsing based on their first name
- This enables gender-appropriate placeholder images and personalization
- Values: `"male"`, `"female"`, or `null` if uncertain

### 2. **AI CV Insights - Areas of Improvement**
- The LLM analyzes CVs during parsing and provides 3-5 actionable improvement suggestions
- Each suggestion includes:
  - **Title**: Short heading (e.g., "Add Quantifiable Achievements")
  - **Description**: 1-2 sentences explaining the improvement
- Examples of suggestions:
  - Adding metrics and numbers to achievements
  - Highlighting leadership experiences
  - Improving professional summary
  - Adding certifications
  - Showcasing relevant projects

### 3. **Updated Persona Page UI**
- The "AI Global Intelligence" section now shows:
  - **CV improvement suggestions** when available (personalized recommendations)
  - **Fallback to global intelligence metrics** when no suggestions exist

## Setup Instructions

### Step 1: Run Database Migration ⚠️ **REQUIRED**

**This step is MANDATORY before the new features will work!**

The migration adds two new columns to the `personas` table:
- `gender` (VARCHAR(20))
- `areas_of_improvement` (JSONB)

**Execute the migration:**

1. Go to your Supabase SQL Editor:
   https://supabase.com/dashboard/project/pqxcncwkjsvoixaqrnhc/sql/new

2. Copy and paste this SQL:

```sql
-- Add gender and areas of improvement columns
ALTER TABLE personas
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS areas_of_improvement JSONB DEFAULT '[]'::jsonb;

-- Add comments for new columns
COMMENT ON COLUMN personas.gender IS 'Inferred gender from CV (male, female, other, or null if cannot determine)';
COMMENT ON COLUMN personas.areas_of_improvement IS 'Array of improvement suggestions for the CV, each with title and description';
```

3. Click "Run" to execute the migration

4. **Verify the migration succeeded:**
   - Run this query to check the new columns exist:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'personas' 
   AND column_name IN ('gender', 'areas_of_improvement');
   ```
   - You should see both columns listed

### ⚠️ Important Notes:
- **Existing personas** in the database will have `NULL` values for these fields until you upload a new CV
- **To see the new features**, you must upload a NEW CV after running the migration
- Old personas won't automatically get areas of improvement - only new CV uploads will have them

### Step 2: Verify Backend Changes

The following backend files have been updated:

✅ **backend/app/services/cv_parser.py**
- Updated OpenAI prompt to extract `gender` and `areas_of_improvement`

✅ **backend/app/schemas/persona.py**
- Added `gender` field
- Added `areas_of_improvement` field with camelCase alias `areasOfImprovement`
- Added `ImprovementItem` model

✅ **backend/app/routers/personas.py**
- Updated `/upload-cv` endpoint to save new fields

### Step 3: Verify Frontend Changes

The following frontend files have been updated:

✅ **mobile/lib/types/user.types.ts**
- Added `ImprovementItem` interface
- Added `gender?` and `areasOfImprovement?` to `UserProfile`

✅ **mobile/app/persona.tsx**
- Replaced dummy "AI Global Intelligence" section
- Shows CV improvement suggestions when available
- Displays each improvement as a numbered card with title and description
- Falls back to global intelligence metrics if no suggestions

## Testing

### Test the Full Flow:

1. **Start the backend server:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Start the mobile app:**
   ```bash
   cd mobile
   npm start
   ```

3. **Upload a new CV:**
   - Go to the onboarding flow
   - Upload a CV file
   - The LLM will parse it and extract:
     - Gender (from first name)
     - Areas of improvement (3-5 suggestions)

4. **View the persona page:**
   - Navigate to the persona page
   - You should see "AI CV Insights" section with personalized recommendations
   - Each suggestion has a number badge, title, and description

### Expected Output Example:

When viewing a persona with improvements, you'll see:

```
🌟 AI CV Insights
Personalized recommendations to strengthen your profile

1️⃣ Add Quantifiable Achievements
   Include specific metrics and numbers to demonstrate your impact. For example, "Increased sales by 30%" 
   is more powerful than "Improved sales performance."

2️⃣ Highlight Leadership Experience
   Emphasize any team leadership, mentoring, or project management experience to show your growth 
   potential and soft skills.

3️⃣ Include Relevant Certifications
   Add industry-recognized certifications or courses that are relevant to your target roles. This shows 
   commitment to continuous learning.

💡 Implementing these suggestions can boost your match rate
```

## Data Structure

### Database Schema (personas table):

```sql
gender VARCHAR(20)                    -- "male", "female", or null
areas_of_improvement JSONB            -- Array of {title, description} objects
```

### Example JSONB data:

```json
[
  {
    "title": "Add Quantifiable Achievements",
    "description": "Include specific metrics and numbers to demonstrate your impact..."
  },
  {
    "title": "Highlight Leadership Experience",
    "description": "Emphasize any team leadership, mentoring, or project management..."
  }
]
```

## Future Enhancements

Potential improvements to consider:

1. **Gender-Based Avatar Selection**
   - Use the `gender` field to select appropriate placeholder avatars
   - Update avatar generation logic in the app

2. **Actionable Improvement Buttons**
   - Add "Fix This" buttons next to each suggestion
   - Guide users through implementing improvements

3. **Progress Tracking**
   - Track which improvements have been implemented
   - Show completion percentage

4. **Re-analysis Feature**
   - Allow users to re-upload CV after improvements
   - Compare before/after suggestions

## Troubleshooting

### Issue: Improvements not showing
- Verify migration was executed successfully
- Check backend logs for OpenAI API errors
- Ensure CV text was properly extracted

### Issue: Gender not inferred
- This is normal for ambiguous names
- The field will be `null` and app continues normally
- No impact on functionality

### Issue: Too many/too few suggestions
- Adjust the OpenAI prompt in `cv_parser.py`
- Change "3-5 actionable improvement suggestions" to desired range

## Files Modified

### Backend:
- `backend/migrations/003_add_gender_and_improvements.sql` (new)
- `backend/app/services/cv_parser.py` (modified)
- `backend/app/schemas/persona.py` (modified)
- `backend/app/routers/personas.py` (modified)
- `backend/run_migration.py` (new)

### Frontend:
- `mobile/lib/types/user.types.ts` (modified)
- `mobile/app/persona.tsx` (modified)

## Support

If you encounter any issues:
1. Check the backend logs for errors
2. Verify the migration was executed successfully
3. Ensure OpenAI API key is valid and has credits
4. Review the console logs in the mobile app

---

**Last Updated:** January 24, 2026
**Version:** 1.0.0
