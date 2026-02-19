import { useState, useEffect } from 'react';
import { X, CreditCard } from 'lucide-react';
import { generateRandomNotification, getCountryFlag, PurchaseNotification as NotificationType } from '@/data/notifications';

const NOTIFICATION_INTERVAL = 30000; // 30 seconds
const NOTIFICATION_DURATION = 4500; // 4.5 seconds visible

const PurchaseNotification = () => {
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const newNotification = generateRandomNotification();
      setNotification(newNotification);
      setIsVisible(true);
      setIsExiting(false);

      // Auto-dismiss after duration
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          setNotification(null);
        }, 300);
      }, NOTIFICATION_DURATION);
    };

    // Show first notification after a short delay
    const initialTimeout = setTimeout(showNotification, 8000);
    
    // Then show every 30 seconds
    const interval = setInterval(showNotification, NOTIFICATION_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const dismissNotification = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setNotification(null);
    }, 300);
  };

  if (!isVisible || !notification) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out
        top-3 right-3 max-w-[240px] sm:max-w-[320px]
        ${isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0'
        }`}
    >
      <div className="relative bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={dismissNotification}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/80 transition-colors z-10"
          aria-label="Dismiss notification"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Header row: Someone purchased • Country */}
          <div className="flex items-center gap-2 mb-2">
            {/* Country flag */}
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center text-xl sm:text-2xl">
              {getCountryFlag(notification.countryCode)}
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <p className="text-xs sm:text-sm text-foreground font-medium">
                {notification.buyerName} purchased • {getCountryFlag(notification.countryCode)} {notification.country}
              </p>
              {/* Completed via Stripe */}
              <p className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                <CreditCard className="w-3 h-3" />
                completed via Stripe
              </p>
            </div>
          </div>

          {/* Product row */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <span className="text-base">🔥</span>
            <p className="text-xs sm:text-sm font-semibold text-foreground truncate flex-1">
              {notification.productName}
            </p>
            <span className="text-xs sm:text-sm font-bold text-foreground">
              ${notification.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseNotification;
