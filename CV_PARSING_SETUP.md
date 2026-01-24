# CV Parsing Feature - Setup & Usage Guide

## Overview
Enhanced CV parsing functionality using OpenAI GPT-3.5 to extract comprehensive information from uploaded CVs, including work history, education, skills, and more.

## Database Migration

### Step 1: Run the New Migration
Execute the following SQL in your Supabase SQL Editor:

```sql
-- Run this migration to add enhanced CV parsing fields
-- File: backend/migrations/002_enhanced_cv_info.sql
```

Or copy and paste the contents of `backend/migrations/002_enhanced_cv_info.sql` into your Supabase SQL Editor and run it.

### New Fields Added to `personas` Table:
- `email` - Contact email from CV
- `phone` - Contact phone from CV  
- `summary` - Professional summary (2-3 sentences)
- `roles` - Array of job roles/titles to search for (JSONB)
- `job_search_location` - Preferred job search location
- `work_history` - Array of work history objects (JSONB)
- `education` - Highest degree and institution

## Backend Features

### Enhanced CV Parser Service
Located in `backend/app/services/cv_parser.py`

**Key Features:**
- Extracts text from PDF, DOCX, DOC, and TXT files
- Uses OpenAI GPT-3.5-turbo for intelligent parsing
- Extracts 15+ data points from CVs including:
  - Personal info (name, email, phone)
  - Professional title and summary
  - Work history with achievements, dates, and skills
  - Education details
  - Technical skills
  - Suggested job roles
  - Salary estimates
  - Job search location preferences

### API Endpoints

#### 1. Upload CV & Create Persona (Primary Endpoint)
```
POST /api/v1/personas/upload-cv
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- file: CV file (PDF, DOCX, DOC, or TXT)
```

**Response:** Complete persona object with all parsed CV information

#### 2. Parse CV Only (Legacy)
```
POST /api/v1/personas/parse-cv
Content-Type: multipart/form-data
Authorization: Bearer {token}

Body:
- file: CV file (PDF or DOCX)
```

**Response:** Parsed CV data without creating persona

## Frontend Features

### Enhanced Persona Display
Located in `mobile/app/persona.tsx`

**New UI Components:**

1. **Professional Summary Section**
   - Displays 2-3 sentence professional summary
   - Only shown if summary exists

2. **Education Section**
   - Shows highest degree and institution
   - Only shown if education data exists

3. **Work Experience Section (Expandable)**
   - Lists all work history items
   - Shows company name, position, and date range by default
   - **Toggle Arrow** - Tap to expand/collapse each work item
   - **Expanded View Shows:**
     - Key achievements (bullet points)
     - Technologies/skills used for that role
   - Styled with glassmorphism design matching app theme

### Updated Type Definitions
Located in `mobile/lib/types/user.types.ts`

```typescript
interface WorkHistoryItem {
  company: string;
  position: string;
  duration?: string;
  description?: string;
  achievements?: string[];
  start_date?: string;
  end_date?: string;
  skills?: string[];
}

interface UserProfile {
  // ... existing fields ...
  email?: string;
  phone?: string;
  summary?: string;
  roles?: string[];
  jobSearchLocation?: string;
  education?: string;
  workHistory?: WorkHistoryItem[];
}
```

## Testing the Implementation

### Backend Testing

1. **Start the Backend Server:**
   ```bash
   cd backend
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   uvicorn app.main:app --reload
   ```

2. **Test CV Upload via API:**
   ```bash
   curl -X POST "http://localhost:8000/api/v1/personas/upload-cv" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "file=@path/to/your/cv.pdf"
   ```

3. **Verify in Database:**
   Check the `personas` table in Supabase to see the parsed data

### Frontend Testing

1. **Start the Mobile App:**
   ```bash
   cd mobile
   npm start
   ```

2. **Test CV Upload Flow:**
   - Navigate to onboarding screen
   - Upload a CV file
   - Wait for CV analysis
   - View the persona page with all parsed information

3. **Test Work History Expansion:**
   - On persona page, scroll to "Work Experience" section
   - Tap on any work history item
   - Verify the arrow toggles and achievements/skills appear
   - Tap again to collapse

## Data Structure Examples

### Work History JSONB Structure
```json
[
  {
    "company": "Tech Corp",
    "position": "Senior Software Engineer",
    "start_date": "2020-01",
    "end_date": "2023-12",
    "duration": "4 years",
    "achievements": [
      "Led team of 5 developers in microservices migration",
      "Reduced API response time by 60%",
      "Implemented CI/CD pipeline"
    ],
    "skills": ["Python", "Docker", "Kubernetes", "AWS"]
  }
]
```

### Roles Array Example
```json
["Software Engineer", "Full Stack Developer", "Backend Engineer", "DevOps Engineer"]
```

## Configuration

### OpenAI API Key
Ensure your `backend/.env` file has:
```
OPENAI_API_KEY=sk-...your-key-here...
```

### Model Selection
Currently using `gpt-3.5-turbo` for cost efficiency. To upgrade to GPT-4:
- Edit `backend/app/services/cv_parser.py`
- Change `model="gpt-3.5-turbo"` to `model="gpt-4"`

## Troubleshooting

### Common Issues

1. **CV Parsing Returns Null Values:**
   - Check CV has clear text (not scanned images)
   - Verify OpenAI API key is valid
   - Check backend logs for parsing errors

2. **Work History Not Displaying:**
   - Verify `work_history` field is populated in database
   - Check frontend types match backend response
   - Ensure profile.workHistory exists before rendering

3. **Migration Errors:**
   - If columns already exist, remove `IF NOT EXISTS` from migration
   - Check Supabase logs for specific errors

4. **Storage Upload Fails:**
   - Ensure `cv-uploads` bucket exists in Supabase Storage
   - Verify storage policies allow authenticated uploads
   - Check file size is under 5MB limit

## Future Enhancements

- [ ] Add CV comparison across personas
- [ ] Generate optimized CV from parsed data
- [ ] Suggest skill improvements based on market demand
- [ ] Add LinkedIn profile import
- [ ] Multi-language CV support
- [ ] ATS optimization scoring

## Notes

- All new fields are optional (nullable) for backward compatibility
- Existing personas without the new fields will continue to work
- The UI conditionally renders sections only if data exists
- Work history expansion state is maintained in component state
- File uploads are limited to 5MB for performance
