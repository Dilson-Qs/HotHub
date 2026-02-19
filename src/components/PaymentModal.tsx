import { useState } from 'react';
import { X, Zap, CreditCard, Bitcoin } from 'lucide-react';
import CryptoSelector from './CryptoSelector';
import { getCheckoutUrlForPrice } from '@/lib/checkout';
import { openTelegramLink, safeOpenExternal } from '@/utils/telegram';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  price: number;
  telegramSupportLink?: string;
  paymentLinkUrl?: string | null;
}

const PaymentModal = ({
  isOpen,
  onClose,
  videoTitle,
  price,
  telegramSupportLink,
  paymentLinkUrl,
}: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'instant' | 'paypal' | 'crypto' | null>(null);

  if (!isOpen) return null;

  const handleInstantPayment = () => {
    let directUrl = paymentLinkUrl?.trim();
    if (directUrl) {
      if (!/^https?:\/\//i.test(directUrl)) directUrl = 'https://' + directUrl;
      safeOpenExternal(directUrl);
      onClose();
      return;
    }

    const checkoutUrl = getCheckoutUrlForPrice(price);
    if (checkoutUrl) {
      safeOpenExternal(checkoutUrl);
      onClose();
      return;
    }

    if (telegramSupportLink) {
      openTelegramLink(telegramSupportLink);
      onClose();
    }
  };

  const openSupport = () => {
    if (!telegramSupportLink) return;
    openTelegramLink(telegramSupportLink);
    onClose();
  };

  const handlePayPalPayment = () => openSupport();

  const handleCryptoPayment = (_crypto: string) => {
    openSupport();
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-overlay/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1 min-w-0 pr-3">
            <h2 className="text-base sm:text-lg font-bold truncate">Choose payment</h2>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {videoTitle} • <span className="text-brand font-semibold">${price.toFixed(2)}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center hover:bg-surface-hover transition-colors flex-shrink-0 touch-target"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {selectedMethod === 'crypto' ? (
            <CryptoSelector
              onSelect={handleCryptoPayment}
              onBack={handleBack}
              videoTitle={videoTitle}
              price={price}
            />
          ) : (
            <div className="space-y-2.5">
              {/* Instant Payment */}
              <button
                onClick={handleInstantPayment}
                className="w-full p-3 sm:p-4 bg-surface hover:bg-surface-hover border border-border rounded-xl flex items-center gap-3 transition-all hover:border-brand/50 group touch-target"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand/20 transition-colors">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base">Instant Payment</h3>
                  <p className="text-xs text-muted-foreground truncate">Fast, secure checkout</p>
                </div>
                <div className="text-brand font-semibold">→</div>
              </button>

              {/* PayPal */}
              <button
                onClick={handlePayPalPayment}
                className="w-full p-3 sm:p-4 bg-surface hover:bg-surface-hover border border-border rounded-xl flex items-center gap-3 transition-all hover:border-brand/50 group touch-target"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0070ba]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0070ba]/20 transition-colors">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#0070ba]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base">PayPal</h3>
                  <p className="text-xs text-muted-foreground truncate">Card or PayPal via Telegram</p>
                </div>
                <div className="text-brand font-semibold">→</div>
              </button>

              {/* Crypto */}
              <button
                onClick={() => setSelectedMethod('crypto')}
                className="w-full p-3 sm:p-4 bg-surface hover:bg-surface-hover border border-border rounded-xl flex items-center gap-3 transition-all hover:border-brand/50 group touch-target"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#f7931a]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#f7931a]/20 transition-colors">
                  <Bitcoin className="w-5 h-5 sm:w-6 sm:h-6 text-[#f7931a]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base">Cryptocurrency</h3>
                  <p className="text-xs text-muted-foreground truncate">USDT, BTC, ETH, BNB</p>
                </div>
                <div className="text-brand font-semibold">→</div>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 pt-2 pb-6 space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            📩 After payment, send your proof of payment via Telegram for manual confirmation.
          </p>
          <p className="text-xs text-muted-foreground text-center">
            🔒 Secure & encrypted payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
