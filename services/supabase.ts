import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validación estricta de credenciales
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

// Crear cliente de Supabase
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey,
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

// Helper para manejar errores de Supabase de forma segura
export const handleSupabaseError = (error: PostgrestError | Error | unknown, context?: string): string => {
  // Log detallado en desarrollo, solo para debugging
  if (import.meta.env.DEV) {
    console.error(`Supabase Error ${context ? `(${context})` : ''}:`, error);
  }

  // Retornar mensaje genérico al usuario (no exponer detalles internos)
  if (error && typeof error === 'object' && 'message' in error) {
    // Filtrar mensajes de error que puedan exponer información sensible
    const message = String(error.message);
    if (message.includes('JWT') || message.includes('auth') || message.includes('token')) {
      return 'Authentication error. Please try logging in again.';
    }
    if (message.includes('unique') || message.includes('duplicate')) {
      return 'This record already exists.';
    }
    if (message.includes('foreign key') || message.includes('violates')) {
      return 'Invalid reference. Please check your data.';
    }
    // Mensaje genérico para otros casos
    return 'An error occurred. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
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
