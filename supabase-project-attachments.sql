-- =====================================================
-- PROJECT ATTACHMENTS TABLE
-- =====================================================
-- Tabla para gestionar adjuntos de proyectos
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- Create project_attachments table
CREATE TABLE IF NOT EXISTS public.project_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =====================================================
-- INDEXES for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_project_attachments_project_id ON public.project_attachments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_attachments_created_by ON public.project_attachments(created_by);
CREATE INDEX IF NOT EXISTS idx_project_attachments_created_at ON public.project_attachments(created_at DESC);

-- =====================================================
-- ENABLE RLS (Row Level Security)
-- =====================================================
ALTER TABLE public.project_attachments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view attachments
CREATE POLICY "Enable read access for all authenticated users"
  ON public.project_attachments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow users to insert their own attachments
CREATE POLICY "Enable insert for authenticated users"
  ON public.project_attachments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

-- Policy: Allow users to delete their own attachments
CREATE POLICY "Enable delete for authenticated users"
  ON public.project_attachments
  FOR DELETE
  USING (auth.role() = 'authenticated' AND created_by = auth.uid());
