-- Create sections table to manage home page sections dynamically
CREATE TABLE public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  layout text NOT NULL DEFAULT 'scroll' CHECK (layout IN ('scroll', 'grid', 'carousel')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can read, only admins can modify
CREATE POLICY "Sections are publicly readable"
ON public.sections FOR SELECT
USING (true);

CREATE POLICY "Admins can insert sections"
ON public.sections FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update sections"
ON public.sections FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete sections"
ON public.sections FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add section_id to videos table to associate videos with sections
ALTER TABLE public.videos 
ADD COLUMN section_id uuid REFERENCES public.sections(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX idx_videos_section_id ON public.videos(section_id);
CREATE INDEX idx_sections_display_order ON public.sections(display_order);

-- Trigger for updated_at
CREATE TRIGGER update_sections_updated_at
BEFORE UPDATE ON public.sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default sections
INSERT INTO public.sections (name, display_name, display_order, layout) VALUES
  ('carousel', 'Carousel (Destaque)', 0, 'carousel'),
  ('premium', 'All Premium Content', 1, 'scroll'),
  ('all', 'All Content', 2, 'grid');