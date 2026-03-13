import { create } from 'zustand'
import { supabase, User } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signup: (email: string, password: string, name: string, userType: 'client' | 'professional', extraData?: any) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: false,
  error: null,

  signup: async (email, password, name, userType, extraData) => {
    set({ loading: true, error: null })
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Signup failed')

      // Save profile to users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            user_type: userType,
            ...(extraData || {}),
          },
        ])

      if (profileError) throw profileError

      // Automatically sign in after signup
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      set({
        session: signInData.session,
        user: {
          id: authData.user.id,
          email,
          name,
          user_type: userType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...extraData,
        },
        loading: false,
      })
    } catch (error: any) {
      set({
        error: error.message || 'Signup failed',
        loading: false,
      })
      throw error
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data.user) throw new Error('Login failed')

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError

      set({
        session: data.session,
        user: profileData,
        loading: false,
      })
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        loading: false,
      })
      throw error
    }
  },

  logout: async () => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      set({
        user: null,
        session: null,
        loading: false,
      })
    } catch (error: any) {
      set({
        error: error.message || 'Logout failed',
        loading: false,
      })
      throw error
    }
  },

  checkAuth: async () => {
    set({ loading: true })
    try {
      // Get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (sessionData.session?.user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', sessionData.session.user.id)
          .single()

        if (profileError) throw profileError

        set({
          session: sessionData.session,
          user: profileData,
          loading: false,
        })
      } else {
        set({
          session: null,
          user: null,
          loading: false,
        })
      }
    } catch (error: any) {
      console.error('Auth check error:', error)
      set({
        session: null,
        user: null,
        loading: false,
      })
    }
  },
}))
