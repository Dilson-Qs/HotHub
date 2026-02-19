import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RefreshCcw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAppSetting } from "@/hooks/useAdminAppSetting";
import type { SpecialOfferConfig } from "@/hooks/useSpecialOffer";
import { cleanTelegramUsername } from "@/utils/telegram";

const toDatetimeLocal = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fromDatetimeLocal = (value: string) => {
  // value is local time; convert to ISO
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
};



const DEFAULTS: SpecialOfferConfig = {
  badgeText: "Limited Time Offer",
  title: "All Content Bundle",
  price: 100,
  originalPrice: 200,
  checkoutUrl: "https://checkout.gadgetxafrica.store/b/eVq3cw8RX5ClctNbLqgA80N",
  telegramMessage: "I want to buy the SPECIAL OFFER - All Content for $100",
  benefits: [
    "Access to ALL premium content",
    "Instant delivery after payment",
    "One-time payment, lifetime access",
    "Exclusive members-only content",
    "24/7 Telegram support",
  ],
  expiresAt: (() => {
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    return d.toISOString();
  })(),
};

const safeParse = (raw: string): SpecialOfferConfig => {
  try {
    const obj = JSON.parse(raw || "{}");
    return {
      ...DEFAULTS,
      ...obj,
      price: Number(obj.price ?? DEFAULTS.price),
      originalPrice: Number(obj.originalPrice ?? DEFAULTS.originalPrice),
      benefits: Array.isArray(obj.benefits) ? obj.benefits : DEFAULTS.benefits,
      expiresAt: typeof obj.expiresAt === "string" && obj.expiresAt ? obj.expiresAt : DEFAULTS.expiresAt,
    };
  } catch {
    return DEFAULTS;
  }
};

export default function SpecialOfferSettings() {
  const { toast } = useToast();

  const telegram = useAdminAppSetting("telegram_username");
  const offer = useAdminAppSetting("special_offer");

  const parsed = useMemo(() => safeParse(offer.value), [offer.value]);

  const [draft, setDraft] = useState<SpecialOfferConfig>(parsed);

  useEffect(() => {
    setDraft(parsed);
  }, [parsed]);

  const saveOffer = async () => {
    offer.setValue(JSON.stringify(draft));
    const { error } = await offer.save();
    if (error) {
      toast({
        title: "Não foi possível salvar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Oferta atualizada",
      description: "A oferta especial foi atualizada no site.",
    });
  };

  const resetTimer = () => {
    // default 24h from now
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    setDraft((p) => ({ ...p, expiresAt: d.toISOString() }));
  };

  const telegramUsername = cleanTelegramUsername(telegram.value || "");
  const telegramUrl = telegramUsername ? `https://t.me/${telegramUsername}` : "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Oferta Especial</h2>
        <p className="text-sm text-muted-foreground">
          Edite o conteúdo do banner/popup da oferta (preços, textos, links e relógio global).
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-5">
          <div className="space-y-2">
            <Label>Telegram global (usado na oferta e suporte)</Label>
            <Input
              value={telegram.value}
              onChange={(e) => telegram.setValue(e.target.value)}
              placeholder="HotHub"
              disabled={telegram.isLoading || telegram.isSaving}
            />
            {telegramUrl && (
              <p className="text-xs text-muted-foreground">
                Link: <a className="underline" href={telegramUrl} target="_blank" rel="noreferrer">{telegramUrl}</a>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Texto do selo (badge)</Label>
              <Input
                value={draft.badgeText}
                onChange={(e) => setDraft((p) => ({ ...p, badgeText: e.target.value }))}
                placeholder="Limited Time Offer"
                disabled={offer.isLoading || offer.isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={draft.title}
                onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                placeholder="All Content Bundle"
                disabled={offer.isLoading || offer.isSaving}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preço atual (USD)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={draft.price}
                onChange={(e) => setDraft((p) => ({ ...p, price: Number(e.target.value || 0) }))}
                disabled={offer.isLoading || offer.isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label>Preço original (USD)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={draft.originalPrice}
                onChange={(e) => setDraft((p) => ({ ...p, originalPrice: Number(e.target.value || 0) }))}
                disabled={offer.isLoading || offer.isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Link de checkout (BUY NOW)</Label>
            <Input
              value={draft.checkoutUrl}
              onChange={(e) => setDraft((p) => ({ ...p, checkoutUrl: e.target.value }))}
              placeholder="https://..."
              disabled={offer.isLoading || offer.isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label>Mensagem do Telegram (oferta)</Label>
            <Input
              value={draft.telegramMessage}
              onChange={(e) => setDraft((p) => ({ ...p, telegramMessage: e.target.value }))}
              placeholder="I want to buy..."
              disabled={offer.isLoading || offer.isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label>Benefícios (um por linha)</Label>
            <Textarea
              value={draft.benefits.join("\n")}
              onChange={(e) =>
                setDraft((p) => ({
                  ...p,
                  benefits: e.target.value
                    .split("\n")
                    .map((x) => x.trim())
                    .filter(Boolean),
                }))
              }
              rows={5}
              disabled={offer.isLoading || offer.isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label>Expira em (relógio global)</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="datetime-local"
                value={toDatetimeLocal(draft.expiresAt)}
                onChange={(e) => setDraft((p) => ({ ...p, expiresAt: fromDatetimeLocal(e.target.value) }))}
                disabled={offer.isLoading || offer.isSaving}
              />
              <Button type="button" variant="outline" onClick={resetTimer} disabled={offer.isLoading || offer.isSaving}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                +24h
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Dica: ao salvar, todos os visitantes verão o mesmo tempo restante.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const { error } = await telegram.save();
                if (error) {
                  toast({ title: "Erro", description: error.message, variant: "destructive" });
                } else {
                  toast({ title: "Telegram atualizado", description: "Telegram global salvo." });
                }
              }}
              disabled={telegram.isLoading || telegram.isSaving}
              className="w-full sm:w-auto"
            >
              {telegram.isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Salvar Telegram
            </Button>

            <Button onClick={saveOffer} disabled={offer.isLoading || offer.isSaving} className="w-full sm:w-auto">
              {offer.isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Oferta
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
