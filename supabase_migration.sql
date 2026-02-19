-- =============================================
-- HotHub — Schema Migration for NEW Supabase Project
-- Run this in: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Create enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create tables

-- app_settings
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- sections
CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  layout TEXT NOT NULL DEFAULT 'scroll',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- videos
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  cover_image_url TEXT NOT NULL,
  preview_video_url TEXT,
  payment_link_url TEXT,
  telegram_username TEXT,
  category TEXT,
  benefits TEXT[],
  featured BOOLEAN DEFAULT false,
  section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_role public.app_role, _user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 4. Enable Row Level Security
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies — Public read for videos, sections, app_settings
CREATE POLICY "Public can read videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Public can read sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Public can read app_settings" ON public.app_settings FOR SELECT USING (true);

-- Admin can do everything
CREATE POLICY "Admins can manage videos" ON public.videos FOR ALL 
  USING (public.has_role('admin', auth.uid()));
CREATE POLICY "Admins can manage sections" ON public.sections FOR ALL 
  USING (public.has_role('admin', auth.uid()));
CREATE POLICY "Admins can manage app_settings" ON public.app_settings FOR ALL 
  USING (public.has_role('admin', auth.uid()));
CREATE POLICY "Admins can read user_roles" ON public.user_roles FOR SELECT 
  USING (public.has_role('admin', auth.uid()));

-- 6. Create storage bucket for uploads (if needed)
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
ON CONFLICT DO NOTHING;
