import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const publicSupabaseUrl = supabaseUrl;
export const publicSupabasePublishableKey = supabasePublishableKey;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabasePublishableKey as string, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    })
  : null;

export type AdminSession = {
  session: Session;
  user: User;
};

export type AdminUserRow = {
  email: string;
  id: string;
  is_active: boolean;
  role: 'owner' | 'editor';
};
