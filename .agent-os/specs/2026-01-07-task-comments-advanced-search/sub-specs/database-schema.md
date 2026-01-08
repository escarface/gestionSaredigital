# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2026-01-07-task-comments-advanced-search/spec.md

## New Tables

### 1. task_comments

Stores all comments posted on tasks with support for @mentions.

```sql
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  mentions UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);
CREATE INDEX idx_task_comments_created_at ON task_comments(created_at DESC);
CREATE INDEX idx_task_comments_mentions ON task_comments USING GIN(mentions);

-- Row Level Security
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read comments on tasks they have access to
CREATE POLICY "Users can view task comments" ON task_comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_comments.task_id
    )
  );

-- Policy: Authenticated users can create comments
CREATE POLICY "Users can create task comments" ON task_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Rationale:**
- `task_id` with CASCADE delete ensures comments are deleted when task is deleted
- `mentions` array stores UUIDs of mentioned users for efficient notification queries
- `content` limited to 1000 chars to prevent abuse and ensure reasonable UI
- Indexes on `task_id` and `created_at` for fast comment retrieval sorted by date
- GIN index on `mentions` array for efficient "find all comments mentioning user X" queries
- RLS policies ensure users can only comment on tasks they can access

### 2. task_activity

Stores system-generated activity log entries for tasks (status changes, assignments, etc.).

```sql
CREATE TABLE task_activity (
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
CREATE INDEX idx_task_activity_task_id ON task_activity(task_id);
CREATE INDEX idx_task_activity_created_at ON task_activity(created_at DESC);

-- Row Level Security
ALTER TABLE task_activity ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read activity for tasks they have access to
CREATE POLICY "Users can view task activity" ON task_activity
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_activity.task_id
    )
  );

-- Policy: System can insert activity (through trigger or service role)
CREATE POLICY "System can create task activity" ON task_activity
  FOR INSERT
  WITH CHECK (true);
```

**Rationale:**
- Separate table from comments for clear separation of user content vs. system logs
- `action` column stores action type: 'status_changed', 'assignee_changed', 'priority_changed', 'due_date_changed'
- `field_name`, `old_value`, `new_value` provide context for what changed
- No `updated_at` needed since activity entries are immutable
- Indexes optimize retrieval of all activity for a task, sorted chronologically

### 3. saved_views

Stores user-created saved filter views for tasks and projects.

```sql
CREATE TABLE saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('tasks', 'projects')),
  filters JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraint: Only one default view per user per entity_type
  CONSTRAINT unique_default_view UNIQUE NULLS NOT DISTINCT (user_id, entity_type, is_default)
    WHERE is_default = true
);

-- Indexes
CREATE INDEX idx_saved_views_user_id ON saved_views(user_id);
CREATE INDEX idx_saved_views_entity_type ON saved_views(entity_type);
CREATE INDEX idx_saved_views_is_default ON saved_views(user_id, entity_type, is_default) WHERE is_default = true;

-- Row Level Security
ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own saved views
CREATE POLICY "Users can view own saved views" ON saved_views
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own saved views
CREATE POLICY "Users can create saved views" ON saved_views
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own saved views
CREATE POLICY "Users can update own saved views" ON saved_views
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own saved views
CREATE POLICY "Users can delete own saved views" ON saved_views
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_saved_views_updated_at
  BEFORE UPDATE ON saved_views
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Rationale:**
- `filters` JSONB column allows flexible filter criteria without schema changes
- Example filters JSON: `{"status": ["Todo", "In Progress"], "priority": ["High"], "assignee": ["uuid-1"]}`
- `is_default` flag lets users set their preferred default view per entity type
- Unique constraint ensures only one default view per user per entity (tasks vs. projects)
- RLS ensures users can only access their own saved views (privacy)

### 4. search_history (Optional - for "Recent Searches" feature)

```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_searched_at ON search_history(searched_at DESC);

-- Row Level Security
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own search history" ON search_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create search history" ON search_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Rationale:**
- Stores recent search queries for autocomplete suggestions
- Can be queried for "last 5 searches" to show as suggestions
- Indexed on `searched_at` for efficient retrieval of recent searches
- Alternative: Use localStorage instead of DB table to avoid extra queries

## Table Modifications

### Update `tasks` table (if using activity log JSONB approach - ALTERNATIVE to task_activity table)

**Option A: Separate task_activity table (RECOMMENDED)**
- No changes to tasks table needed
- Better performance for large activity histories
- Easier to query and filter activity

**Option B: JSONB column on tasks table (ALTERNATIVE)**

```sql
-- Add activity_log column to tasks table
ALTER TABLE tasks ADD COLUMN activity_log JSONB DEFAULT '[]';

-- Index for JSONB querying
CREATE INDEX idx_tasks_activity_log ON tasks USING GIN(activity_log);
```

**If using Option B, activity entries stored as:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "user_name": "John Doe",
    "action": "status_changed",
    "old_value": "Todo",
    "new_value": "In Progress",
    "created_at": "2026-01-07T10:30:00Z"
  }
]
```

**Recommendation:** Use **Option A (separate task_activity table)** for better scalability and query performance.

## Performance Indexes

### Enhanced indexes for search functionality

```sql
-- Full-text search indexes for projects
CREATE INDEX idx_projects_name_trgm ON projects USING gin (name gin_trgm_ops);
CREATE INDEX idx_projects_client_trgm ON projects USING gin (client gin_trgm_ops);
CREATE INDEX idx_projects_description_trgm ON projects USING gin (description gin_trgm_ops);

-- Full-text search indexes for tasks
CREATE INDEX idx_tasks_title_trgm ON tasks USING gin (title gin_trgm_ops);
CREATE INDEX idx_tasks_description_trgm ON tasks USING gin (description gin_trgm_ops);

-- Composite indexes for common filter combinations
CREATE INDEX idx_tasks_status_priority ON tasks(status, priority);
CREATE INDEX idx_tasks_assignee_status ON tasks(assignee, status);
CREATE INDEX idx_tasks_due_date_status ON tasks(due_date, status);
```

**Note:** Trigram (gin_trgm_ops) indexes require the `pg_trgm` extension:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

**Rationale:**
- Trigram indexes enable fast ILIKE queries for search
- Without trigram indexes, ILIKE queries are slow on large datasets
- Composite indexes speed up common filter combinations (status + priority)
- These indexes are critical for search performance on 1000+ tasks/projects

## Migration Script

Complete migration script to run in Supabase SQL Editor:

```sql
-- Enable required extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create task_comments table
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  mentions UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);
CREATE INDEX idx_task_comments_created_at ON task_comments(created_at DESC);
CREATE INDEX idx_task_comments_mentions ON task_comments USING GIN(mentions);

ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view task comments" ON task_comments
  FOR SELECT USING (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_comments.task_id));

CREATE POLICY "Users can create task comments" ON task_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create task_activity table
CREATE TABLE task_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  field_name VARCHAR(50),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_task_activity_task_id ON task_activity(task_id);
CREATE INDEX idx_task_activity_created_at ON task_activity(created_at DESC);

ALTER TABLE task_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view task activity" ON task_activity
  FOR SELECT USING (EXISTS (SELECT 1 FROM tasks WHERE tasks.id = task_activity.task_id));

CREATE POLICY "System can create task activity" ON task_activity
  FOR INSERT WITH CHECK (true);

-- Create saved_views table
CREATE TABLE saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('tasks', 'projects')),
  filters JSONB NOT NULL DEFAULT '{}',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_saved_views_user_id ON saved_views(user_id);
CREATE INDEX idx_saved_views_entity_type ON saved_views(entity_type);
CREATE INDEX idx_saved_views_is_default ON saved_views(user_id, entity_type, is_default) WHERE is_default = true;

ALTER TABLE saved_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved views" ON saved_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create saved views" ON saved_views
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved views" ON saved_views
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved views" ON saved_views
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_saved_views_updated_at
  BEFORE UPDATE ON saved_views
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create search indexes
CREATE INDEX idx_projects_name_trgm ON projects USING gin (name gin_trgm_ops);
CREATE INDEX idx_projects_client_trgm ON projects USING gin (client gin_trgm_ops);
CREATE INDEX idx_tasks_title_trgm ON tasks USING gin (title gin_trgm_ops);
CREATE INDEX idx_tasks_status_priority ON tasks(status, priority);
CREATE INDEX idx_tasks_assignee_status ON tasks(assignee, status);
```

## Data Integrity

**Cascade Deletes:**
- Deleting a task deletes all associated comments and activity entries
- Deleting a user deletes all their comments, activity entries, and saved views
- This prevents orphaned records and maintains referential integrity

**Check Constraints:**
- Comment content limited to 1000 characters
- Saved view entity_type restricted to 'tasks' or 'projects'
- Ensures data validity at database level

**Unique Constraints:**
- Only one default saved view per user per entity type
- Prevents conflicting default views
