#!/usr/bin/env python3
"""
Migration runner script to apply database migrations to Supabase
"""
import os
from pathlib import Path
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

def run_migration(migration_file: str):
    """Run a migration SQL file"""
    # Create Supabase client with service key (admin access)
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    # Read migration file
    migration_path = Path(__file__).parent / "migrations" / migration_file
    
    if not migration_path.exists():
        print(f"❌ Migration file not found: {migration_file}")
        return False
    
    with open(migration_path, 'r') as f:
        sql = f.read()
    
    print(f"📝 Running migration: {migration_file}")
    print(f"SQL:\n{sql}\n")
    
    try:
        # Execute the SQL using Supabase's raw SQL execution
        # Note: Supabase Python client doesn't have direct SQL execution
        # We need to use PostgREST or direct PostgreSQL connection
        print("⚠️  Note: This script requires manual execution through Supabase SQL Editor")
        print(f"🔗 Go to: {SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/')}/sql/new")
        print(f"\n📋 Copy and paste the SQL above into the Supabase SQL Editor and execute it.")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Astra Apply - Database Migration Runner")
    print("=" * 50)
    
    # Run the new migration
    migration_file = "003_add_gender_and_improvements.sql"
    
    if run_migration(migration_file):
        print(f"\n✅ Please execute the migration SQL in Supabase SQL Editor")
        print(f"   Once done, the new columns will be available:")
        print(f"   - gender: Inferred gender from CV")
        print(f"   - areas_of_improvement: AI-generated CV improvement suggestions")
    else:
        print(f"\n❌ Migration setup failed")
