import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAppSetting = (key: string) => {
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", key)
        .maybeSingle();

      if (cancelled) return;

      if (error) {
        // Fail silently for public reads; caller can use fallback.
        setValue(null);
      } else {
        setValue(data?.value ?? null);
      }

      setIsLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { value, isLoading };
};

export const useTelegramUsername = () => {
  const { value, isLoading } = useAppSetting("telegram_username");
  return {
    telegramUsername: value?.trim() || "HotHub",
    isLoading,
  };
};
