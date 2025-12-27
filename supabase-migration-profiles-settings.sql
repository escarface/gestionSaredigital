-- =====================================================
-- MIGRATION: Add Settings Fields to Profiles Table
-- =====================================================
-- Este archivo añade los campos necesarios para la página de Settings
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =====================================================

-- Añadir columnas de perfil de usuario
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Spanish';

-- Añadir columnas de preferencias
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_alerts BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_mode TEXT DEFAULT 'standard' CHECK (view_mode IN ('standard', 'compact'));

-- Comentarios para documentación
COMMENT ON COLUMN public.profiles.bio IS 'User biography or description';
COMMENT ON COLUMN public.profiles.phone IS 'User phone number';
COMMENT ON COLUMN public.profiles.timezone IS 'User timezone (default: UTC)';
COMMENT ON COLUMN public.profiles.language IS 'User preferred language (default: Spanish)';
COMMENT ON COLUMN public.profiles.theme IS 'UI theme preference (light/dark)';
COMMENT ON COLUMN public.profiles.notifications_enabled IS 'Enable web notifications';
COMMENT ON COLUMN public.profiles.email_alerts IS 'Enable email alerts';
COMMENT ON COLUMN public.profiles.view_mode IS 'UI density mode (standard/compact)';

-- Verificar que las columnas se añadieron correctamente
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('bio', 'phone', 'timezone', 'language', 'theme', 'notifications_enabled', 'email_alerts', 'view_mode')
ORDER BY ordinal_position;
