import { useState, useEffect } from "react";
import { X, Zap, CheckCircle2, Send, Clock, Sparkles, Gift } from "lucide-react";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { useTelegramUsername } from "@/hooks/useAppSettings";
import { useSpecialOffer } from "@/hooks/useSpecialOffer";
import { buildTelegramLink, openTelegramLink, safeOpenExternal } from "@/utils/telegram";

const POPUP_SHOWN_KEY = "special_offer_popup_shown";

interface SpecialOfferPopupProps {
  onClose: () => void;
}

const SpecialOfferPopup = ({ onClose }: SpecialOfferPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { telegramUsername } = useTelegramUsername();
  const { config } = useSpecialOffer();
  const timer = useCountdownTimer(config.expiresAt);

  useEffect(() => {
    // Animate in
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleTelegramClick = () => {
    const url = buildTelegramLink(telegramUsername, config.telegramMessage);
    openTelegramLink(url);
  };

  const handlePayNowClick = () => {
    if (!config.checkoutUrl?.trim()) return;
    safeOpenExternal(config.checkoutUrl.trim());
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const discountPct =
    config.originalPrice > 0 ? Math.round((1 - config.price / config.originalPrice) * 100) : 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
        }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
      >
        {/* Main card */}
        <div className="relative bg-gradient-to-br from-card via-card to-card border-2 border-primary/50 rounded-2xl overflow-hidden shadow-2xl">
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-pulse" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header badge */}
          <div className="bg-gradient-to-r from-primary via-primary to-primary/80 py-2 px-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
              <span className="text-primary-foreground font-bold text-sm uppercase tracking-wider">
                {config.badgeText}
              </span>
              <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="relative p-6 space-y-5">
            {/* Timer section */}
            <div className="bg-background/50 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Offer expires in:</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="bg-primary/20 rounded-lg px-3 py-2 min-w-[60px]">
                  <span className="text-2xl font-bold text-primary font-mono">
                    {timer.hours.toString().padStart(2, "0")}
                  </span>
                  <span className="block text-[10px] text-muted-foreground uppercase">Hours</span>
                </div>
                <span className="text-2xl font-bold text-primary">:</span>
                <div className="bg-primary/20 rounded-lg px-3 py-2 min-w-[60px]">
                  <span className="text-2xl font-bold text-primary font-mono">
                    {timer.minutes.toString().padStart(2, "0")}
                  </span>
                  <span className="block text-[10px] text-muted-foreground uppercase">Min</span>
                </div>
                <span className="text-2xl font-bold text-primary">:</span>
                <div className="bg-primary/20 rounded-lg px-3 py-2 min-w-[60px]">
                  <span className="text-2xl font-bold text-primary font-mono">
                    {timer.seconds.toString().padStart(2, "0")}
                  </span>
                  <span className="block text-[10px] text-muted-foreground uppercase">Sec</span>
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">{config.title}</h2>
              </div>

              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl text-muted-foreground line-through">${config.originalPrice}</span>
                <span className="text-5xl font-black text-primary">${config.price}</span>
              </div>

              {discountPct > 0 && (
                <div className="inline-flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  <Zap className="w-4 h-4" />
                  Save {discountPct}%
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              {config.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handlePayNowClick}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 animate-pulse-glow flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                BUY NOW - ${config.price}
              </button>

              <button
                onClick={handleTelegramClick}
                className="w-full py-3 border border-primary text-primary hover:bg-primary/10 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Contact via Telegram
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Secure payment • Instant delivery • 100% Satisfaction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferPopup;

