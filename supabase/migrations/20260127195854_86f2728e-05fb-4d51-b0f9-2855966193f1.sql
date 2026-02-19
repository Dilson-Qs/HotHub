-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create videos/content table
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT NOT NULL,
    preview_video_url TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    benefits TEXT[] DEFAULT '{}',
    category TEXT,
    featured BOOLEAN DEFAULT false,
    telegram_username TEXT DEFAULT 'Najarf5',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Videos are publicly readable (everyone can see the content)
CREATE POLICY "Videos are publicly readable"
ON public.videos FOR SELECT
USING (true);

-- Only admins can insert/update/delete videos
CREATE POLICY "Admins can insert videos"
ON public.videos FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update videos"
ON public.videos FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete videos"
ON public.videos FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for video covers
INSERT INTO storage.buckets (id, name, public) VALUES ('video-covers', 'video-covers', true);

-- Storage policies for video covers
CREATE POLICY "Video covers are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'video-covers');

CREATE POLICY "Admins can upload video covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'video-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update video covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'video-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete video covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'video-covers' AND public.has_role(auth.uid(), 'admin'));