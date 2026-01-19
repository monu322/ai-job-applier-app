from supabase import create_client, Client
from app.config import settings


class SupabaseClient:
    """Supabase database client singleton"""
    
    _client: Client = None
    _service_client: Client = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Get Supabase client with anon key (for authenticated operations)"""
        if cls._client is None:
            cls._client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_ANON_KEY
            )
        return cls._client
    
    @classmethod
    def get_service_client(cls) -> Client:
        """Get Supabase client with service role key (bypasses RLS)"""
        if cls._service_client is None:
            cls._service_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_KEY
            )
        return cls._service_client


# Dependency for route handlers
def get_supabase() -> Client:
    """FastAPI dependency to inject Supabase client"""
    return SupabaseClient.get_client()


def get_supabase_admin() -> Client:
    """FastAPI dependency to inject Supabase service client"""
    return SupabaseClient.get_service_client()
