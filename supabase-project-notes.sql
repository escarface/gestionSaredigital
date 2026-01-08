-- Create project_notes table
-- This table stores detailed notes for each project (like a notebook/journal for the project)
CREATE TABLE IF NOT EXISTS public.project_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_notes_project ON public.project_notes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_notes_created_at ON public.project_notes(created_at);

-- RLS Policies
ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;

-- Read: Authenticated users can read
CREATE POLICY "Project notes viewable by authenticated"
  ON public.project_notes FOR SELECT
  TO authenticated
  USING (true);

-- Insert: Admins and Editors
CREATE POLICY "Admins/Editors can insert project notes"
  ON public.project_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Editor')
    )
  );

-- Update: Admins and Editors
CREATE POLICY "Admins/Editors can update project notes"
  ON public.project_notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Editor')
    )
  );

-- Delete: Admins and Editors
CREATE POLICY "Admins/Editors can delete project notes"
  ON public.project_notes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('Admin', 'Editor')
    )
  );

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_project_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS project_notes_updated_at ON public.project_notes;
CREATE TRIGGER project_notes_updated_at
  BEFORE UPDATE ON public.project_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_project_notes_updated_at();

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_notes;
