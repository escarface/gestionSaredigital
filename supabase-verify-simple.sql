-- Simple Verification Script for Task Comments Migration
-- Created: 2026-01-07
-- Run each section separately to verify the migration

-- =============================================
-- 1. Verify tables exist
-- =============================================
SELECT 'Tables Created:' as check_name;
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('task_comments', 'task_activity', 'saved_views');
-- Expected: 3 rows (task_comments, task_activity, saved_views)

-- =============================================
-- 2. Verify RLS is enabled
-- =============================================
SELECT 'RLS Status:' as check_name;
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('task_comments', 'task_activity', 'saved_views');
-- Expected: All should show rls_enabled = true

-- =============================================
-- 3. Verify policies exist
-- =============================================
SELECT 'RLS Policies:' as check_name;
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('task_comments', 'task_activity', 'saved_views')
ORDER BY tablename, policyname;
-- Expected:
-- task_comments: 2 policies (view, create)
-- task_activity: 2 policies (view, create)
-- saved_views: 4 policies (view, create, update, delete)

-- =============================================
-- 4. Verify indexes exist
-- =============================================
SELECT 'Indexes Created:' as check_name;
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_task_%'
ORDER BY tablename, indexname;
-- Expected: Multiple indexes on task_comments, task_activity, and tasks

-- =============================================
-- 5. Verify trigram extension
-- =============================================
SELECT 'Extensions:' as check_name;
SELECT extname, extversion
FROM pg_extension
WHERE extname = 'pg_trgm';
-- Expected: 1 row showing pg_trgm is installed

-- =============================================
-- 6. Check table structure
-- =============================================
SELECT 'task_comments columns:' as check_name;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'task_comments'
ORDER BY ordinal_position;
