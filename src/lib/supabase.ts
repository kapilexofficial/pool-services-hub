import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  user_type: 'client' | 'professional';
  profile: UserProfile;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_at: string;
  updated_at: string;
}

export interface Professional extends UserProfile {
  rating: number;
  reviews_count: number;
  services: Service[];
  available_hours?: string;
  response_time?: number; // minutes
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price_min: number;
  price_max: number;
}

export interface Booking {
  id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  address: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  stripe_payment_id?: string;
  created_at: string;
}
