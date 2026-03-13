import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder_key')

// TypeScript types for database
export interface User {
  id: string
  email: string
  name: string
  user_type: 'client' | 'professional'
  avatar_url?: string
  phone?: string
  location?: string
  company_name?: string
  years_experience?: number
  bio?: string
  created_at: string
  updated_at: string
}

export interface Professional {
  id: string
  user_id: string
  service_id: string
  rating: number
  reviews_count: number
  hourly_rate: number
  availability: string
  service_area_radius: number
  is_verified: boolean
  created_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  category: string
  estimated_duration: number
  base_price: number
  created_at: string
}

export interface Booking {
  id: string
  client_id: string
  professional_id: string
  service_id: string
  scheduled_date: string
  location: string
  description: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
}
