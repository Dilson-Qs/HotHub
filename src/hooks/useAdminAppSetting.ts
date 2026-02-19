import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAppSetting = (key: string) => {
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("app_settings")
      .select("id,value")
      .eq("key", key)
      .maybeSingle();

    if (!error) setValue(data?.value ?? "");
    setIsLoading(false);
  }, [key]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async () => {
    setIsSaving(true);

    // We can't assume a unique constraint on key, so we do a safe read → update/insert.
    const { data: existing, error: readError } = await supabase
      .from("app_settings")
      .select("id")
      .eq("key", key)
      .maybeSingle();

    if (readError) {
      setIsSaving(false);
      return { error: readError };
    }

    if (existing?.id) {
      const { error } = await supabase
        .from("app_settings")
        .update({ value: value.trim() || null })
        .eq("id", existing.id);
      setIsSaving(false);
      return { error };
    }

    const { error } = await supabase
      .from("app_settings")
      .insert({ key, value: value.trim() || null });

    setIsSaving(false);
    return { error };
  }, [key, value]);

  return {
    value,
    setValue,
    isLoading,
    isSaving,
    refresh,
    save,
  };
};
