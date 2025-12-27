-- Delete user and related data by email (Supabase)
-- Safety: run in Supabase SQL Editor (service role)
-- Adjust the email below as needed
DO $$
DECLARE
  v_email   text := 'test@gestionpro.local';
  v_user_id uuid;
BEGIN
  -- 1) Resolve user id from email
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No user found with email: %', v_email;
    RETURN;
  END IF;

  RAISE NOTICE 'Deleting user % with id %', v_email, v_user_id;

  -- 2) Delete avatar files from storage (bucket: avatars/<user_id>/...)
  DELETE FROM storage.objects
   WHERE bucket_id = 'avatars'
     AND name LIKE v_user_id::text || '/%';

  -- 3) Delete in-app notifications (will also be removed by profile cascade, kept explicit)
  DELETE FROM public.notifications WHERE user_id = v_user_id;

  -- 4) Delete profile (FK ensures related rows referencing profiles.id with ON DELETE CASCADE are removed)
  DELETE FROM public.profiles WHERE id = v_user_id;

  -- 5) Delete auth user (direct delete; requires service role)
  -- auth.admin.delete_user() cannot be called from SQL editor in some stacks,
  -- so we remove via direct delete (cascades will handle related records).
  DELETE FROM auth.users WHERE id = v_user_id;

  RAISE NOTICE '✅ User % (% ) deleted successfully', v_email, v_user_id;
END $$;

-- Optional: verify removal
-- SELECT * FROM auth.users WHERE email = 'test@gestionpro.local';
-- SELECT * FROM public.profiles WHERE id = '<uuid>';