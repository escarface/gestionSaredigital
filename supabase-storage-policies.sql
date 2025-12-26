-- =====================================================
-- STORAGE BUCKET POLICIES FOR project-attachments
-- =====================================================
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to read files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;

-- Policy: Allow authenticated users to upload files to project-attachments bucket
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-attachments');

-- Policy: Allow public access to read files in project-attachments bucket
CREATE POLICY "Allow public to read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-attachments');

-- Policy: Allow authenticated users to delete files in project-attachments bucket
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project-attachments');

-- Policy: Allow authenticated users to update files in project-attachments bucket
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project-attachments')
WITH CHECK (bucket_id = 'project-attachments');
