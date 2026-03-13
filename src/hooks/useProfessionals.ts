import { create } from 'zustand';
import { Professional } from '../lib/supabase';
import { professionalAPI } from '../lib/api';

interface ProfessionalsState {
  professionals: Professional[];
  isLoading: boolean;
  error: string | null;

  // Actions
  searchProfessionals: (filters?: {
    service?: string;
    city?: string;
    minRating?: number;
    sortBy?: 'rating' | 'reviews' | 'recent';
  }) => Promise<void>;

  getProfessional: (id: string) => Promise<Professional | null>;
  clearError: () => void;
}

export const useProfessionals = create<ProfessionalsState>((set) => ({
  professionals: [],
  isLoading: false,
  error: null,

  searchProfessionals: async (filters) => {
    try {
      set({ isLoading: true, error: null });
      const data = await professionalAPI.searchProfessionals(filters);
      set({ professionals: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to search professionals' });
    } finally {
      set({ isLoading: false });
    }
  },

  getProfessional: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const professional = await professionalAPI.getProfessional(id);
      return professional;
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch professional' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
