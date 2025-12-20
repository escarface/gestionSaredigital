-- =====================================================
-- DESACTIVAR CONFIRMACIÓN DE EMAIL EN SUPABASE
-- =====================================================
-- Este script desactiva la confirmación de email para:
-- 1. Todos los usuarios existentes
-- 2. Todos los usuarios nuevos que se registren
-- =====================================================

-- =====================================================
-- PASO 1: Confirmar todos los usuarios existentes
-- =====================================================

-- Actualiza todos los usuarios no confirmados
UPDATE auth.users
SET 
  email_confirmed_at = NOW()
WHERE 
  email_confirmed_at IS NULL;

-- Verifica cuántos usuarios fueron actualizados
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed_users
FROM auth.users;

-- =====================================================
-- PASO 2: Crear/Actualizar trigger para auto-confirmar nuevos usuarios
-- =====================================================

-- Eliminar el trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Eliminar la función anterior si existe
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Crear función mejorada que auto-confirma y crea perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-confirmar el usuario inmediatamente
  UPDATE auth.users
  SET 
    email_confirmed_at = NOW()
  WHERE id = NEW.id;

  -- Crear perfil en la tabla profiles
  INSERT INTO public.profiles (id, name, email, avatar, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar', 
      'https://ui-avatars.com/api/?background=random&name=' || NEW.email
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Viewer')
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger que se ejecuta DESPUÉS de insertar un usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PASO 3: Verificación
-- =====================================================

-- Consulta para verificar que todos los usuarios están confirmados
SELECT 
  id,
  email,
  email_confirmed_at,
  confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '❌ Sin confirmar'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

-- ✅ Este script:
--    1. Confirma todos los usuarios existentes
--    2. Auto-confirma automáticamente los nuevos usuarios
--    3. Mantiene la creación de perfiles en la tabla profiles

-- ⚠️ ADVERTENCIAS:
--    - Esto desactiva la verificación de email
--    - Los usuarios podrán acceder inmediatamente sin confirmar su email
--    - Úsalo solo en entornos de desarrollo o si tienes otro método de verificación

-- 🔄 Para REACTIVAR la confirmación de email:
--    - Necesitarás revertir estos cambios
--    - Y configurar SMTP en Supabase para envío de emails

-- =====================================================
-- ALTERNATIVA: Solo confirmar usuarios específicos
-- =====================================================

-- Si solo quieres confirmar usuarios específicos, usa esto en lugar del UPDATE general:

-- Confirmar un usuario específico por email:
-- UPDATE auth.users
-- SET email_confirmed_at = NOW()
-- WHERE email = 'usuario@ejemplo.com';

-- Confirmar un usuario específico por ID:
-- UPDATE auth.users
-- SET email_confirmed_at = NOW()
-- WHERE id = 'uuid-del-usuario';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
