import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase credentials missing in .env.local');
  console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Crear cliente de Supabase
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'gestion-pro-auth',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Helper para manejar errores de Supabase
export const handleSupabaseError = (error: any, context?: string) => {
  console.error(`Supabase Error ${context ? `(${context})` : ''}:`, error);
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Verificar conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (e) {
    console.error('❌ Supabase connection error:', e);
    return false;
  }
};

export default supabase;
