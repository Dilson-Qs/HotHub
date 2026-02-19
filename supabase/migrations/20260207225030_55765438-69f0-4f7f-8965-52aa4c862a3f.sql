-- Add manual payment link per video
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS payment_link_url text;

-- Global app settings (e.g. telegram username)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Public can read settings (needed for frontend to get telegram username)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'app_settings' AND policyname = 'App settings are publicly readable'
  ) THEN
    CREATE POLICY "App settings are publicly readable"
    ON public.app_settings
    FOR SELECT
    USING (true);
  END IF;
END $$;

-- Admins can manage settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'app_settings' AND policyname = 'Admins can insert app settings'
  ) THEN
    CREATE POLICY "Admins can insert app settings"
    ON public.app_settings
    FOR INSERT
    WITH CHECK (has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'app_settings' AND policyname = 'Admins can update app settings'
  ) THEN
    CREATE POLICY "Admins can update app settings"
    ON public.app_settings
    FOR UPDATE
    USING (has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'app_settings' AND policyname = 'Admins can delete app settings'
  ) THEN
    CREATE POLICY "Admins can delete app settings"
    ON public.app_settings
    FOR DELETE
    USING (has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

-- Keep updated_at fresh
DROP TRIGGER IF EXISTS trg_app_settings_updated_at ON public.app_settings;
CREATE TRIGGER trg_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default telegram username if missing
INSERT INTO public.app_settings(key, value)
SELECT 'telegram_username', 'Hottpay'
WHERE NOT EXISTS (SELECT 1 FROM public.app_settings WHERE key = 'telegram_username');
