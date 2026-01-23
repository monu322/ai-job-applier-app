import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { supabase } from '../supabaseClient';
import { storage } from '../storage';
import { Alert } from 'react-native';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isProcessingOAuth: boolean;
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
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
    
    // Listen for auth state changes (OAuth callbacks)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsProcessingOAuth(true);
        
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        };
        
        // Save session data
        await storage.setItem('auth_token', session.access_token);
        await storage.setItem('user_data', JSON.stringify(user));
        
        setUser(user);
        setIsLoading(false);
        setIsProcessingOAuth(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsProcessingOAuth(false);
        await storage.removeItem('auth_token');
        await storage.removeItem('user_data');
      } else if (event === 'INITIAL_SESSION') {
        setIsLoading(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      // Check Supabase session first for latest user data
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Use fresh session data with latest metadata
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
        };
        
        // Update storage with latest data
        await storage.setItem('auth_token', session.access_token);
        await storage.setItem('user_data', JSON.stringify(user));
        
        setUser(user);
      } else {
        // Fallback to storage if no session
        const token = await storage.getItem('auth_token');
        const userData = await storage.getItem('user_data');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      }
    } catch (err) {
      console.error('Error checking auth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await apiClient.login(email, password);
      setUser(response.user);
      
    } catch (err) {
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
      setIsProcessingOAuth(true);
      
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : 'astraapply://auth/callback';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account', // Force account selection screen
          },
        },
      });
      
      if (error) {
        setIsProcessingOAuth(false);
        throw error;
      }
      
    } catch (err: any) {
      const errorMessage = err.message || 'Google sign-in failed';
      setError(errorMessage);
      setIsProcessingOAuth(false);
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
        isProcessingOAuth,
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
