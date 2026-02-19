-- Remove default Telegram username from videos (global Telegram is configured in app_settings)
ALTER TABLE public.videos
  ALTER COLUMN telegram_username DROP DEFAULT;