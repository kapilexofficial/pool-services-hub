import { supabase, User, UserProfile, Professional, Booking, Payment } from './supabase';

// AUTH
export const authAPI = {
  async signUp(email: string, password: string, userData: { name: string; user_type: 'client' | 'professional' }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      await profileAPI.createProfile(data.user.id, {
        name: userData.name,
      });
    }

    return data;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
};

// PROFILES
export const profileAPI = {
  async createProfile(userId: string, data: Partial<UserProfile>) {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        ...data,
      })
      .select()
      .single();

    if (error) throw error;
    return profile;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data as UserProfile;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },
};

// PROFESSIONALS
export const professionalAPI = {
  async searchProfessionals(filters?: {
    service?: string;
    city?: string;
    minRating?: number;
    sortBy?: 'rating' | 'reviews' | 'recent';
  }) {
    let query = supabase
      .from('user_profiles')
      .select(`
        *,
        services:services(*)
      `)
      .eq('user_type', 'professional');

    if (filters?.service) {
      query = query.ilike('services.name', `%${filters.service}%`);
    }

    if (filters?.city) {
      query = query.eq('city', filters.city);
    }

    if (filters?.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    if (filters?.sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Professional[];
  },

  async getProfessional(professionalId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        services:services(*)
      `)
      .eq('id', professionalId)
      .single();

    if (error) throw error;
    return data as Professional;
  },

  async updateRating(professionalId: string, newRating: number) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ rating: newRating })
      .eq('id', professionalId)
      .select()
      .single();

    if (error) throw error;
    return data as Professional;
  },
};

// BOOKINGS
export const bookingAPI = {
  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },

  async getBooking(bookingId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return data as Booking;
  },

  async getUserBookings(userId: string, userType: 'client' | 'professional') {
    const column = userType === 'client' ? 'client_id' : 'professional_id';
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq(column, userId);

    if (error) throw error;
    return data as Booking[];
  },

  async updateBookingStatus(bookingId: string, status: Booking['status']) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },
};

// PAYMENTS
export const paymentAPI = {
  async createPayment(payment: Omit<Payment, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },

  async getPayment(paymentId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) throw error;
    return data as Payment;
  },

  async updatePaymentStatus(paymentId: string, status: Payment['status'], stripeId?: string) {
    const update: any = { status };
    if (stripeId) update.stripe_payment_id = stripeId;

    const { data, error } = await supabase
      .from('payments')
      .update(update)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return data as Payment;
  },
};
