-- Verification Script for Task Comments & Advanced Search Migration
-- Created: 2026-01-07
-- Description: Verifies tables, RLS policies, indexes, and cascade deletes

-- =============================================
-- VERIFICATION 1: Check tables were created
-- =============================================

SELECT
  table_name,
  CASE
    WHEN table_name IN ('task_comments', 'task_activity', 'saved_views') THEN '✅ Created'
    ELSE '❌ Missing'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('task_comments', 'task_activity', 'saved_views')
ORDER BY table_name;

-- =============================================
-- VERIFICATION 2: Check RLS is enabled
-- =============================================

SELECT
  tablename,
  CASE
    WHEN rowsecurity = true THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('task_comments', 'task_activity', 'saved_views')
ORDER BY tablename;

-- =============================================
-- VERIFICATION 3: Check RLS policies exist
-- =============================================

SELECT
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  CASE
    WHEN qual IS NOT NULL THEN '✅ Has USING clause'
    ELSE 'No USING'
  END as using_clause,
  CASE
    WHEN with_check IS NOT NULL THEN '✅ Has WITH CHECK clause'
    ELSE 'No WITH CHECK'
  END as with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('task_comments', 'task_activity', 'saved_views')
ORDER BY tablename, policyname;

-- =============================================
-- VERIFICATION 4: Check indexes were created
-- =============================================

SELECT
  tablename,
  indexname,
  '✅ Created' as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND (
    tablename IN ('task_comments', 'task_activity', 'saved_views')
    OR indexname LIKE 'idx_task_%'
    OR indexname LIKE 'idx_projects_%trgm'
  )
ORDER BY tablename, indexname;

-- =============================================
-- VERIFICATION 5: Check pg_trgm extension
-- =============================================

SELECT
  extname,
  extversion,
  '✅ Installed' as status
FROM pg_extension
WHERE extname = 'pg_trgm';

-- =============================================
-- VERIFICATION 6: Test cascade deletes
-- =============================================

-- This section creates test data and verifies cascade deletes work
-- Run this in a transaction so we can roll it back

DO $$
DECLARE
  test_task_id UUID;
  test_comment_id UUID;
  test_activity_id UUID;
  comment_count INTEGER;
  activity_count INTEGER;
BEGIN
  RAISE NOTICE '🧪 Starting CASCADE DELETE test...';

  -- Get an existing task ID or create a test one
  SELECT id INTO test_task_id FROM tasks LIMIT 1;

  IF test_task_id IS NULL THEN
    RAISE NOTICE '⚠️  No tasks found in database. Cannot test cascade deletes.';
    RAISE NOTICE '   Please create at least one task first.';
    RETURN;
  END IF;

  RAISE NOTICE 'Using test task: %', test_task_id;

  -- Insert test comment
  INSERT INTO task_comments (task_id, user_id, content)
  VALUES (test_task_id, auth.uid(), 'Test comment for cascade delete verification')
  RETURNING id INTO test_comment_id;

  RAISE NOTICE '✅ Created test comment: %', test_comment_id;

  -- Insert test activity
  INSERT INTO task_activity (task_id, user_id, action, field_name, old_value, new_value)
  VALUES (test_task_id, auth.uid(), 'test_action', 'test_field', 'old', 'new')
  RETURNING id INTO test_activity_id;

  RAISE NOTICE '✅ Created test activity: %', test_activity_id;

  -- Verify they were created
  SELECT COUNT(*) INTO comment_count FROM task_comments WHERE id = test_comment_id;
  SELECT COUNT(*) INTO activity_count FROM task_activity WHERE id = test_activity_id;

  RAISE NOTICE 'Comment exists: % | Activity exists: %', comment_count > 0, activity_count > 0;

  -- Delete the task (should cascade delete comment and activity)
  DELETE FROM tasks WHERE id = test_task_id;

  RAISE NOTICE '🗑️  Deleted test task';

  -- Check if comment and activity were cascade deleted
  SELECT COUNT(*) INTO comment_count FROM task_comments WHERE id = test_comment_id;
  SELECT COUNT(*) INTO activity_count FROM task_activity WHERE id = test_activity_id;

  IF comment_count = 0 AND activity_count = 0 THEN
    RAISE NOTICE '✅ CASCADE DELETE WORKING: Comments and activity were deleted automatically';
  ELSE
    RAISE NOTICE '❌ CASCADE DELETE FAILED: Comment count: %, Activity count: %', comment_count, activity_count;
  END IF;

  -- Rollback the transaction to restore the deleted task
  RAISE EXCEPTION 'Rolling back transaction to restore test data';

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '🔄 Transaction rolled back - test data restored';
END $$;

-- =============================================
-- SUMMARY
-- =============================================

SELECT
  '🎉 Migration Verification Complete!' as summary,
  (SELECT COUNT(*) FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('task_comments', 'task_activity', 'saved_views')) as tables_created,
  (SELECT COUNT(*) FROM pg_policies
   WHERE schemaname = 'public'
   AND tablename IN ('task_comments', 'task_activity', 'saved_views')) as policies_created,
  (SELECT COUNT(*) FROM pg_indexes
   WHERE schemaname = 'public'
   AND (tablename IN ('task_comments', 'task_activity', 'saved_views')
        OR indexname LIKE 'idx_task_%trgm'
        OR indexname LIKE 'idx_projects_%trgm')) as indexes_created;
