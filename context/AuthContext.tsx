import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
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
  updateProfile: (updates: Partial<User>) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  uploadAvatar: (file: File) => Promise<{ error: string | null; url?: string }>;
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
          id: (profile as Record<string, unknown>).id as string,
          name: (profile as Record<string, unknown>).name as string,
          email: (profile as Record<string, unknown>).email as string,
          avatar: ((profile as Record<string, unknown>).avatar as string | null) || DEFAULT_AVATAR,
          role: (profile as Record<string, unknown>).role as 'Admin' | 'Editor' | 'Viewer',
          bio: (profile as Record<string, unknown>).bio as string | undefined,
          phone: (profile as Record<string, unknown>).phone as string | undefined,
          timezone: ((profile as Record<string, unknown>).timezone as string | undefined) || 'UTC',
          language: ((profile as Record<string, unknown>).language as string | undefined) || 'en',
          theme: ((profile as Record<string, unknown>).theme as 'light' | 'dark' | undefined) || 'light',
          notificationsEnabled: ((profile as Record<string, unknown>).notifications_enabled as boolean | undefined) ?? true,
          emailAlerts: ((profile as Record<string, unknown>).email_alerts as boolean | undefined) ?? false,
          viewMode: ((profile as Record<string, unknown>).view_mode as 'standard' | 'compact' | undefined) || 'standard',
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

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      return { error: error.message || 'Error signing in' };
    }
  }, []);

  const signUpWithEmail = useCallback(async (
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
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      return { error: error.message || 'Error signing up' };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone;
      if (updates.language !== undefined) dbUpdates.language = updates.language;
      if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
      if (updates.notificationsEnabled !== undefined) dbUpdates.notifications_enabled = updates.notificationsEnabled;
      if (updates.emailAlerts !== undefined) dbUpdates.email_alerts = updates.emailAlerts;
      if (updates.viewMode !== undefined) dbUpdates.view_mode = updates.viewMode;

      dbUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates as Record<string, unknown> & { id?: never })
        .eq('id', user.id);

      if (error) return { error: error.message };

      setUser({ ...user, ...updates });
      return { error: null };
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      return { error: error.message || 'Error updating profile' };
    }
  }, [user]);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      return { error: error.message || 'Error updating password' };
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) return { error: uploadError.message };

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await updateProfile({ avatar: publicUrl });

      if (updateError) return { error: updateError };

      return { error: null, url: publicUrl };
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      return { error: error.message || 'Error uploading avatar' };
    }
  }, [user, updateProfile]);

  const handleSetUser = useCallback((newUser: User | null) => {
    setUser(newUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signOut,
      signInWithEmail,
      signUpWithEmail,
      updateProfile,
      updatePassword,
      uploadAvatar,
      setUser: handleSetUser,
    }),
    [user, loading, signOut, signInWithEmail, signUpWithEmail, updateProfile, updatePassword, uploadAvatar, handleSetUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};