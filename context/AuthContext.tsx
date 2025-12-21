import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { DEFAULT_AVATAR } from '../constants';
import { supabase } from '../services/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;

  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string, role?: 'Admin' | 'Editor' | 'Viewer') => Promise<{ error: string | null }>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión de Supabase
  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSessionChange(session);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSessionChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSessionChange = async (session: Session | null) => {
    if (session?.user) {
      // Obtener perfil del usuario desde la tabla profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile && !error) {
        const userData: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar || DEFAULT_AVATAR,
          role: profile.role,
        };
        setUser(userData);
      } else {
        // Si no hay perfil, crear uno básico (fallback)
        const userData: User = {
          id: session.user.id,
          name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          avatar: DEFAULT_AVATAR,
          role: 'Viewer',
        };
        setUser(userData);
      }
    } else {
      setUser(null);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      return { error: e.message || 'Error signing in' };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    role: 'Admin' | 'Editor' | 'Viewer' = 'Viewer'
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            avatar: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`,
          },
        },
      });

      if (error) return { error: error.message };
      if (data.user && !data.user.identities?.length) {
        return { error: 'This email is already registered' };
      }

      return { error: null };
    } catch (e: any) {
      return { error: e.message || 'Error signing up' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };



  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signOut,

      signInWithEmail,
      signUpWithEmail,
      setUser: handleSetUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};