import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAppSetting } from "@/hooks/useAdminAppSetting";
import { cleanTelegramUsername } from "@/utils/telegram";

export default function SiteSettings() {
  const { toast } = useToast();
  const telegram = useAdminAppSetting("telegram_username");

  const username = cleanTelegramUsername(telegram.value || "");
  const telegramUrl = username ? `https://t.me/${username}` : "";

  const onSave = async () => {
    const { error } = await telegram.save();
    if (error) {
      toast({
        title: "Não foi possível salvar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configurações salvas",
      description: "O Telegram global foi atualizado.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Configurações do site</h2>
        <p className="text-sm text-muted-foreground">
          Defina valores globais usados em todo o site (quando não houver override por vídeo).
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telegram_global">Telegram global (username)</Label>
            <Input
              id="telegram_global"
              value={telegram.value}
              onChange={(e) => telegram.setValue(e.target.value)}
              placeholder="HotHub"
              disabled={telegram.isLoading || telegram.isSaving}
            />
            <p className="text-xs text-muted-foreground">
              Pode incluir: username, @username, ou link completo (t.me/user, https://t.me/user)
            </p>
            {telegramUrl && (
              <p className="text-xs text-muted-foreground">
                Link: <a className="underline" href={telegramUrl} target="_blank" rel="noreferrer">{telegramUrl}</a>
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={onSave} disabled={telegram.isLoading || telegram.isSaving}>
              {telegram.isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
