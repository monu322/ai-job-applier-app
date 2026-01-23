# Setup Instructions for Job Applier App

## Database Setup (Supabase)

Your app is already configured to connect to the remote Supabase database:
- **URL**: `https://pqxcncwkjsvoixaqrnhc.supabase.co`

### Deploy Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `pqxcncwkjsvoixaqrnhc`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `backend/migrations/001_initial_schema.sql`
6. Paste into the SQL Editor
7. Click **Run** to execute the schema

This will create:
- `personas` table for storing user CV profiles
- `jobs` table for job listings
- `applications` table for tracking job applications
- Row-Level Security (RLS) policies
- Indexes for performance
- Triggers for auto-updating timestamps

### Verify Setup

After running the migration, verify:
1. Tables exist: Go to **Table Editor** and confirm `personas`, `jobs`, and `applications` tables are present
2. RLS is enabled: Check that Row Level Security is enabled on `personas` and `applications` tables

## Environment Variables

Both backend and mobile are already configured:

### Backend (.env)
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ⚠️ SUPABASE_SERVICE_KEY (update with actual service role key from Supabase dashboard)
- ✅ JWT_SECRET_KEY
- ⚠️ OPENAI_API_KEY (update with your actual OpenAI API key)

### Mobile (.env)
- ✅ EXPO_PUBLIC_SUPABASE_URL
- ✅ EXPO_PUBLIC_SUPABASE_ANON_KEY
- ✅ EXPO_PUBLIC_API_URL

## Recent Changes

### Profile Page Enhancement
- Now checks if user has any personas created
- Redirects to `/onboarding` if no personas exist
- Fetches personas from the remote Supabase database via backend API

### Onboarding Page Update
- Removed "Import from LinkedIn" button
- Users can only upload CV to create their first persona

## Running the App

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Mobile
```bash
cd mobile
npm install
npm start
```

## Testing Flow

1. **New User Flow**:
   - User signs up → authenticated
   - User navigates to Profile tab
   - Profile checks for personas
   - No personas found → redirected to Onboarding
   - User uploads CV → persona created
   - User can now access all features

2. **Existing User Flow**:
   - User logs in → authenticated
   - User navigates to Profile tab
   - Profile checks for personas
   - Personas found → stays on Profile page
   - User can view their profile and settings
