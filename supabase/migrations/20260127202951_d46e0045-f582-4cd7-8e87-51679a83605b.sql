-- Create bucket for video previews if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-previews', 'video-previews', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for video-previews bucket only
CREATE POLICY "Public can view video previews"
ON storage.objects FOR SELECT
USING (bucket_id = 'video-previews');

CREATE POLICY "Admins can upload video previews"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'video-previews' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update video previews"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'video-previews' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete video previews"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'video-previews' 
  AND has_role(auth.uid(), 'admin'::app_role)
);