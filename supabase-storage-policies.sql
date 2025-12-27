-- =====================================================
-- STORAGE BUCKET POLICIES FOR project-attachments
-- =====================================================
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- UPDATED: Secure policies with owner-based access control

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read project attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own attachments" ON storage.objects;

-- Policy: Allow authenticated users to upload files to project-attachments bucket
CREATE POLICY "Authenticated users can upload project attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-attachments' AND
  (storage.foldername(name))[1] = 'projects'
);

-- Policy: Allow AUTHENTICATED users to read files (not public!)
-- This ensures only logged-in users can access project files
CREATE POLICY "Authenticated users can read project attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'project-attachments');

-- Policy: Allow users to delete ONLY their own files
-- Checks that the user ID in the path matches the authenticated user
-- OR that the user is an Admin (checked via profiles table)
CREATE POLICY "Users can delete their own attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-attachments' AND
  (
    -- Check if user owns the file via project_attachments table
    EXISTS (
      SELECT 1 FROM public.project_attachments
      WHERE file_url LIKE '%' || name || '%'
      AND created_by = auth.uid()
    )
    OR
    -- OR if user is Admin, allow delete
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  )
);

-- Policy: Allow users to update ONLY their own files
CREATE POLICY "Users can update their own attachments"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-attachments' AND
  (
    EXISTS (
      SELECT 1 FROM public.project_attachments
      WHERE file_url LIKE '%' || name || '%'
      AND created_by = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  )
)
WITH CHECK (bucket_id = 'project-attachments');
