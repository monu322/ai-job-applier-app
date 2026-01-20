import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { supabase } from '../supabaseClient';
import { storage } from '../storage';
import { Alert } from 'react-native';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes (OAuth callbacks)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AUTH] ═══════════════════════════════');
      console.log('[AUTH] Auth state changed:', event);
      console.log('[AUTH] Has session:', !!session);
      console.log('[AUTH] Session user:', session?.user);
      console.log('[AUTH] Access token:', session?.access_token ? 'EXISTS' : 'NULL');
      console.log('[AUTH] ═══════════════════════════════');
      
      if (event === 'SIGNED_IN' && session) {
        console.log('[AUTH] ✅ Processing SIGNED_IN event');
        const user = {
          id: session.user.id,
          email: session.user.email || '',
        };
        
        console.log('[AUTH] Saving token to storage...');
        // Save session data
        await storage.setItem('auth_token', session.access_token);
        await storage.setItem('user_data', JSON.stringify(user));
        console.log('[AUTH] ✅ OAuth session saved successfully');
        
        setUser(user);
        console.log('[AUTH] ✅ User state updated:', user.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('[AUTH] Processing SIGNED_OUT event');
        setUser(null);
        await storage.removeItem('auth_token');
        await storage.removeItem('user_data');
      } else {
        console.log('[AUTH] ⚠️ Unhandled event or no session');
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const token = await storage.getItem('auth_token');
      const userData = await storage.getItem('user_data');
      
      console.log('[AUTH] Checking auth - Token exists:', !!token);
      console.log('[AUTH] User data:', userData);
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('[AUTH] User authenticated:', parsedUser.email);
      } else {
        console.log('[AUTH] No authenticated user found');
      }
    } catch (err) {
      console.error('[AUTH] Error checking auth:', err);
    } finally {
      setIsLoading(false);
      console.log('[AUTH] Auth check complete');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('[AUTH] Attempting login for:', email);
      const response = await apiClient.login(email, password);
      console.log('[AUTH] Login successful:', response.user);
      
      setUser(response.user);
      console.log('[AUTH] User state updated');
      
    } catch (err) {
      console.error('[AUTH] Login error:', err);
      const errorMessage = typeof err === 'string' ? err : 'Login failed. Please check your credentials.';
      setError(errorMessage);
      Alert.alert('Login Error', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await apiClient.register(email, password, name);
      setUser(response.user);
      
      // Auto-login after registration
      await storage.setItem('auth_token', response.access_token);
      await storage.setItem('user_data', JSON.stringify(response.user));
      
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : 'Registration failed. Please try again.';
      setError(errorMessage);
      Alert.alert('Registration Error', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'astraapply://auth/callback';
      console.log('[AUTH] ═══════════════════════════════');
      console.log('[AUTH] Starting Google OAuth flow');
      console.log('[AUTH] Redirect URL:', redirectUrl);
      console.log('[AUTH] Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
      console.log('[AUTH] ═══════════════════════════════');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      console.log('[AUTH] OAuth response data:', data);
      console.log('[AUTH] OAuth error:', error);
      
      if (error) {
        console.error('[AUTH] OAuth error details:', error);
        throw error;
      }
      
      console.log('[AUTH] OAuth initiated - redirecting to Google...');
      // For web, this will redirect to Google
      // For mobile, handle the callback
      
    } catch (err: any) {
      console.error('[AUTH] Google sign-in exception:', err);
      const errorMessage = err.message || 'Google sign-in failed';
      setError(errorMessage);
      Alert.alert('Google Sign-in Error', errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        signInWithGoogle,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
