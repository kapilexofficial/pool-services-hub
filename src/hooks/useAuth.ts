import { create } from 'zustand';
import { supabase, User } from '../lib/supabase';
import { authAPI, profileAPI } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  signUp: (email: string, password: string, userData: { name: string; user_type: 'client' | 'professional' }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  signUp: async (email, password, userData) => {
    try {
      set({ isLoading: true, error: null });
      await authAPI.signUp(email, password, userData);
      
      // Auto-login after signup
      await authAPI.login(email, password);
      
      const currentUser = await authAPI.getCurrentUser();
      if (currentUser) {
        const profile = await profileAPI.getProfile(currentUser.id);
        set({
          user: {
            id: currentUser.id,
            email: currentUser.email || '',
            user_type: userData.user_type,
            profile,
            created_at: currentUser.created_at || new Date().toISOString(),
          } as User,
          isAuthenticated: true,
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Signup failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      await authAPI.login(email, password);

      const currentUser = await authAPI.getCurrentUser();
      if (currentUser) {
        const profile = await profileAPI.getProfile(currentUser.id);
        
        // Fetch user_type from profile (you'll need to store this in user_profiles)
        const userType = (profile as any).user_type || 'client';
        
        set({
          user: {
            id: currentUser.id,
            email: currentUser.email || '',
            user_type: userType as 'client' | 'professional',
            profile,
            created_at: currentUser.created_at || new Date().toISOString(),
          } as User,
          isAuthenticated: true,
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Login failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await authAPI.logout();
      set({ user: null, isAuthenticated: false });
    } catch (error: any) {
      set({ error: error.message || 'Logout failed' });
    } finally {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const currentUser = await authAPI.getCurrentUser();
      
      if (currentUser) {
        const profile = await profileAPI.getProfile(currentUser.id);
        const userType = (profile as any).user_type || 'client';
        
        set({
          user: {
            id: currentUser.id,
            email: currentUser.email || '',
            user_type: userType as 'client' | 'professional',
            profile,
            created_at: currentUser.created_at || new Date().toISOString(),
          } as User,
          isAuthenticated: true,
        });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
