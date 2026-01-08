-- Migration: Task Comments & Advanced Search System
-- Created: 2026-01-07
-- Description: Adds task comments, activity tracking, saved views, and enhanced search capabilities

-- =============================================
-- STEP 1: Enable required extensions
-- =============================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================
-- STEP 1.5: Create helper function for updated_at
-- =============================================

-- Create the function if it doesn't exist (may already exist from base schema)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STEP 2: Create task_comments table
-- =============================================

CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  mentions UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_user_id ON task_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_created_at ON task_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_task_comments_mentions ON task_comments USING GIN(mentions);

-- Row Level Security
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read comments on tasks they have access to
DROP POLICY IF EXISTS "Users can view task comments" ON task_comments;
CREATE POLICY "Users can view task comments" ON task_comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_comments.task_id
    )
  );

-- Policy: Authenticated users can create comments
DROP POLICY IF EXISTS "Users can create task comments" ON task_comments;
CREATE POLICY "Users can create task comments" ON task_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_task_comments ON task_comments;
CREATE TRIGGER set_updated_at_task_comments
  BEFORE UPDATE ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- STEP 3: Create task_activity table
-- =============================================

CREATE TABLE IF NOT EXISTS task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  field_name VARCHAR(50),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_task_activity_task_id ON task_activity(task_id);
CREATE INDEX IF NOT EXISTS idx_task_activity_created_at ON task_activity(created_at DESC);

-- Row Level Security
ALTER TABLE task_activity ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read activity for tasks they have access to
DROP POLICY IF EXISTS "Users can view task activity" ON task_activity;
CREATE POLICY "Users can view task activity" ON task_activity
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_activity.task_id
    )
  );

-- Policy: System can insert activity (through trigger or service role)
DROP POLICY IF EXISTS "System can create task activity" ON task_activity;
CREATE POLICY "System can create task activity" ON task_activity
  FOR INSERT
  WITH CHECK (true);

-- =============================================
-- STEP 4: Create saved_views table
-- =============================================

CREATE TABLE IF NOT EXISTS saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('tasks', 'projects')),
  filters JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_views_user_id ON saved_views(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_views_entity_type ON saved_views(entity_type);
CREATE INDEX IF NOT EXISTS idx_saved_views_is_default ON saved_views(user_id, entity_type, is_default) WHERE is_default = true;

-- Row Level Security
ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own saved views
DROP POLICY IF EXISTS "Users can view own saved views" ON saved_views;
CREATE POLICY "Users can view own saved views" ON saved_views
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own saved views
DROP POLICY IF EXISTS "Users can create saved views" ON saved_views;
CREATE POLICY "Users can create saved views" ON saved_views
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own saved views
DROP POLICY IF EXISTS "Users can update own saved views" ON saved_views;
CREATE POLICY "Users can update own saved views" ON saved_views
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own saved views
DROP POLICY IF EXISTS "Users can delete own saved views" ON saved_views;
CREATE POLICY "Users can delete own saved views" ON saved_views
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_saved_views ON saved_views;
CREATE TRIGGER set_updated_at_saved_views
  BEFORE UPDATE ON saved_views
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- STEP 5: Create search performance indexes
-- =============================================

-- Full-text search indexes for projects (trigram indexes)
CREATE INDEX IF NOT EXISTS idx_projects_name_trgm ON projects USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_projects_client_trgm ON projects USING gin (client gin_trgm_ops);

-- Full-text search indexes for tasks (trigram indexes)
CREATE INDEX IF NOT EXISTS idx_tasks_title_trgm ON tasks USING gin (title gin_trgm_ops);

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_tasks_status_priority ON tasks(status, priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status ON tasks(assignee, status);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Uncomment to verify tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('task_comments', 'task_activity', 'saved_views');

-- Uncomment to verify RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('task_comments', 'task_activity', 'saved_views');

-- Uncomment to verify indexes were created:
-- SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('task_comments', 'task_activity', 'saved_views', 'tasks', 'projects');
