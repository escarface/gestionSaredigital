-- ============================================
-- TASK ASSIGNMENTS MIGRATION
-- Run this script in your Supabase SQL Editor
-- AFTER running has-role-function.sql and project-assignments-migration.sql
-- ============================================

-- Add new column for proper FK relationship to profiles
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);

-- Note: We keep the old 'assignee' column for backwards compatibility
-- The UI will write to both columns during transition period
