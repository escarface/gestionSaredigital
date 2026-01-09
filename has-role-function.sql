-- ============================================
-- CREATE has_role HELPER FUNCTION
-- Run this script FIRST in your Supabase SQL Editor
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
