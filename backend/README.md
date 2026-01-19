# Astra Apply Backend API

FastAPI backend with Supabase integration for the Astra Apply job application platform.

## Features

- ✅ User authentication (email/password) with Supabase Auth
- ✅ JWT token-based authorization
- ✅ Persona CRUD operations
- ✅ OpenAI GPT-4 CV parsing
- ✅ File upload support (PDF/DOCX)
- ✅ Row-level security with Supabase
- ✅ Auto-generated API documentation

## Tech Stack

- **FastAPI** 0.109 - Modern Python web framework
- **Supabase** - PostgreSQL database + Auth
- **OpenAI GPT-4** - CV parsing and analysis
- **Python 3.11+** - Runtime
- **Pydantic** - Data validation

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the SQL migration in `migrations/001_initial_schema.sql` in your Supabase SQL Editor
3. Create a storage bucket named `cv-uploads` in Supabase Dashboard

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Anon/public key from Supabase
- `SUPABASE_SERVICE_KEY` - Service role key (keep secret!)
- `OPENAI_API_KEY` - Your OpenAI API key
- `JWT_SECRET_KEY` - Random secret for JWT signing

### 5. Run the Server

```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using the main.py script
python -m app.main
```

The API will be available at:
- **API:** http://localhost:8000
- **Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## API Endpoints

### Authentication

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login and get JWT token
POST   /api/auth/logout      - Logout user
GET    /api/auth/me          - Get current user info
```

### Personas

```
GET    /api/personas                  - List all user personas
POST   /api/personas                  - Create new persona
GET    /api/personas/{id}             - Get persona by ID
PUT    /api/personas/{id}             - Update persona
DELETE /api/personas/{id}             - Delete persona
PATCH  /api/personas/{id}/activate    - Set as active persona
POST   /api/personas/parse-cv         - Parse CV file with OpenAI
```

## Usage Examples

### Register User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

### Create Persona

```bash
curl -X POST http://localhost:8000/api/personas \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "title": "Senior Software Engineer",
    "location": "San Francisco, CA",
    "experience_level": "Senior",
    "skills": ["Python", "FastAPI", "React", "AWS"],
    "salary_min": 120000,
    "salary_max": 180000
  }'
```

### Parse CV

```bash
curl -X POST http://localhost:8000/api/personas/parse-cv \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/cv.pdf"
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Supabase client
│   ├── routers/             # API route handlers
│   │   ├── auth.py         # Authentication endpoints
│   │   └── personas.py     # Persona CRUD
│   ├── schemas/             # Pydantic models
│   │   ├── auth.py
│   │   └── persona.py
│   ├── services/            # Business logic
│   │   └── cv_parser.py    # OpenAI CV parsing
│   └── middleware/
│       └── auth.py         # JWT authentication
├── migrations/
│   └── 001_initial_schema.sql
├── requirements.txt
├── .env.example
└── README.md
```

## Database Schema

See `migrations/001_initial_schema.sql` for the complete schema.

**Main Tables:**
- `personas` - User career personas
- `jobs` - Job listings (future)
- `applications` - Job applications (future)

## Security

- Row-level security (RLS) enabled on all tables
- Users can only access their own data
- JWT tokens for API authentication
- Supabase handles password hashing and auth

## Development

### Running Tests (Future)

```bash
pytest
```

### Code Formatting

```bash
black app/
isort app/
```

## Deployment

Ready to deploy to:
- Railway
- Render
- Fly.io
- AWS/GCP/Azure

## Mobile App Integration

Update the mobile app to connect to this API:
1. Install Supabase client in mobile app
2. Configure Supabase URL and keys
3. Replace mock data with API calls
4. Implement auth flow
5. Handle file uploads

## License

Portfolio/Demo Project

---

Built with ❤️ using FastAPI & Supabase
