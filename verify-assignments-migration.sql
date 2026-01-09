-- ============================================
-- VERIFICATION SCRIPT - Assignment Migrations
-- Run this after executing all 3 migration scripts
-- to verify everything is set up correctly
-- ============================================

-- Test 1: Check has_role function exists
SELECT 'Test 1: has_role function' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_proc
      WHERE proname = 'has_role'
    ) THEN '✅ PASS - Function exists'
    ELSE '❌ FAIL - Function does not exist. Run has-role-function.sql'
  END as result;

-- Test 2: Check project_leader_id column exists
SELECT 'Test 2: project_leader_id column' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'projects'
      AND column_name = 'project_leader_id'
    ) THEN '✅ PASS - Column exists'
    ELSE '❌ FAIL - Column does not exist. Run project-assignments-migration.sql'
  END as result;

-- Test 3: Check project_assignments table exists
SELECT 'Test 3: project_assignments table' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'project_assignments'
    ) THEN '✅ PASS - Table exists'
    ELSE '❌ FAIL - Table does not exist. Run project-assignments-migration.sql'
  END as result;

-- Test 4: Check assigned_to column in tasks
SELECT 'Test 4: tasks.assigned_to column' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'tasks'
      AND column_name = 'assigned_to'
    ) THEN '✅ PASS - Column exists'
    ELSE '❌ FAIL - Column does not exist. Run task-assignments-migration.sql'
  END as result;

-- Test 5: Check indexes exist
SELECT 'Test 5: Performance indexes' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_indexes
      WHERE indexname IN ('idx_projects_leader', 'idx_project_assignments_project', 'idx_tasks_assigned_to')
    ) THEN '✅ PASS - Indexes exist'
    ELSE '⚠️ WARNING - Some indexes may be missing'
  END as result;

-- Test 6: Check RLS policies on project_assignments
SELECT 'Test 6: RLS policies' as test_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM pg_policies
      WHERE tablename = 'project_assignments'
    ) THEN '✅ PASS - RLS policies exist'
    ELSE '❌ FAIL - RLS policies missing. Run project-assignments-migration.sql'
  END as result;

-- Test 7: Count existing profiles (users)
SELECT 'Test 7: User profiles count' as test_name,
  CONCAT('ℹ️ INFO - ', COUNT(*), ' users in profiles table') as result
FROM public.profiles;

-- Test 8: Check if current user can use has_role
SELECT 'Test 8: has_role function works' as test_name,
  CASE
    WHEN public.has_role(auth.uid(), 'Admin') IS NOT NULL
      OR public.has_role(auth.uid(), 'Editor') IS NOT NULL
      OR public.has_role(auth.uid(), 'Viewer') IS NOT NULL
    THEN '✅ PASS - Function works correctly'
    ELSE '❌ FAIL - Function error or user not in profiles'
  END as result;

-- Summary
SELECT '===================' as separator,
  'MIGRATION VERIFICATION' as title,
  '===================' as separator2;

SELECT
  '✅ All tests passed!' as summary
WHERE NOT EXISTS (
  SELECT 1 FROM (
    -- Re-run all critical tests
    SELECT CASE
      WHEN NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_role')
      THEN 'FAIL' END as test1,
    SELECT CASE
      WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'project_leader_id')
      THEN 'FAIL' END as test2,
    SELECT CASE
      WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'project_assignments')
      THEN 'FAIL' END as test3,
    SELECT CASE
      WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'assigned_to')
      THEN 'FAIL' END as test4
  ) tests
  WHERE test1 = 'FAIL' OR test2 = 'FAIL' OR test3 = 'FAIL' OR test4 = 'FAIL'
)
UNION ALL
SELECT
  '❌ Some tests failed! Check results above.' as summary
WHERE EXISTS (
  SELECT 1 FROM (
    SELECT CASE
      WHEN NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'has_role')
      THEN 'FAIL' END as test1
  ) tests
  WHERE test1 = 'FAIL'
);

-- Helpful query: View all users that can be assigned
SELECT
  '===================' as separator,
  'Available Users for Assignment' as title,
  '===================' as separator2;

SELECT
  id,
  name,
  email,
  role,
  CASE
    WHEN role = 'Admin' THEN '👑 Admin'
    WHEN role = 'Editor' THEN '✏️ Editor'
    WHEN role = 'Viewer' THEN '👁️ Viewer'
  END as role_icon
FROM public.profiles
ORDER BY role DESC, name ASC;
