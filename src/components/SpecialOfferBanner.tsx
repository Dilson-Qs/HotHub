import { Send, CheckCircle2, Gift, Zap, Clock, Sparkles } from "lucide-react";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useTelegramUsername } from "@/hooks/useAppSettings";
import { useSpecialOffer } from "@/hooks/useSpecialOffer";
import { buildTelegramLink, openTelegramLink, safeOpenExternal } from "@/utils/telegram";

const SpecialOfferBanner = () => {
  const { telegramUsername } = useTelegramUsername();
  const { config } = useSpecialOffer();
  const timer = useCountdownTimer(config.expiresAt);

  const handleTelegramClick = () => {
    const url = buildTelegramLink(telegramUsername, config.telegramMessage);
    openTelegramLink(url);
  };

  const handlePayNowClick = () => {
    if (!config.checkoutUrl?.trim()) return;
    safeOpenExternal(config.checkoutUrl.trim());
  };

  const discountPct = config.originalPrice > 0 ? Math.round((1 - config.price / config.originalPrice) * 100) : 0;

  return (
    <div className="container mx-auto px-4 md:px-8 py-4">
      <div className="relative bg-gradient-to-r from-primary/10 via-card to-primary/10 border-2 border-primary/50 rounded-xl p-4 md:p-6 overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left: Offer details */}
          <div className="flex-1 space-y-3">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {config.badgeText}
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>

            {/* Title with price */}
            <div className="flex flex-wrap items-center gap-3">
              <Gift className="w-6 h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">{config.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-lg text-muted-foreground line-through">${config.originalPrice}</span>
                <span className="text-3xl font-black text-primary">${config.price}</span>
              </div>
              {discountPct > 0 && (
                <span className="inline-flex items-center gap-1 bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs font-semibold">
                  <Zap className="w-3 h-3" />
                  {discountPct}% OFF
                </span>
              )}
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {config.benefits.slice(0, 3).map((b) => (
                <div key={b} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Timer + Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
            {/* Timer */}
            <div className="flex items-center gap-2 bg-background/80 rounded-lg px-3 py-2 border border-border">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Expires in:</span>
              <span className="font-mono font-bold text-primary text-lg">{timer.formatted}</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTelegramClick}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-primary text-primary hover:bg-primary/10 rounded-lg text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                Telegram
              </button>
              <button
                onClick={handlePayNowClick}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 animate-pulse-glow"
              >
                <Zap className="w-4 h-4" />
                BUY NOW - ${config.price}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferBanner;
