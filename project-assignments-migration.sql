-- ============================================
-- PROJECT ASSIGNMENTS MIGRATION
-- Run this script in your Supabase SQL Editor
-- AFTER running has-role-function.sql
-- ============================================

-- Add project_leader_id column to projects table
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS project_leader_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Create project_assignments table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.project_assignments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  assigned_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(project_id, user_id) -- Prevent duplicate assignments
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_leader ON public.projects(project_leader_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_project ON public.project_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_user ON public.project_assignments(user_id);

-- Add trigger for updated_at
CREATE TRIGGER set_updated_at_project_assignments
  BEFORE UPDATE ON public.project_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read project assignments
CREATE POLICY "Project assignments are viewable by authenticated users"
  ON public.project_assignments FOR SELECT
  TO authenticated
  USING (true);

-- Admins and Editors can insert project assignments
CREATE POLICY "Admins and Editors can insert project assignments"
  ON public.project_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Editor')
    )
  );

-- Admins and Editors can delete project assignments
CREATE POLICY "Admins and Editors can delete project assignments"
  ON public.project_assignments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Editor')
    )
  );

-- =====================================================
-- REALTIME - Enable real-time subscriptions
-- =====================================================

-- Enable real-time for project_assignments table
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_assignments;

-- =====================================================
-- COMMENTS for documentation
-- =====================================================

COMMENT ON TABLE public.project_assignments IS 'Stores many-to-many relationships between projects and team members';
COMMENT ON COLUMN public.projects.project_leader_id IS 'User ID of the project leader/manager';
COMMENT ON COLUMN public.project_assignments.assigned_by IS 'User ID who made the assignment';
