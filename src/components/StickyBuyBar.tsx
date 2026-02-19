import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, MessageCircle } from 'lucide-react';
import { openTelegramLink } from '@/utils/telegram';

interface StickyBuyBarProps {
  title: string;
  price: number;
  videoId: string;
  onPayClick: () => void;
  telegramSupportLink: string;
}

const StickyBuyBar = forwardRef<HTMLDivElement, StickyBuyBarProps>(
  ({ title, price, videoId, onPayClick, telegramSupportLink }, ref) => {
    return (
      <div ref={ref} className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        {/* Gradient fade */}
        <div className="h-6 bg-gradient-to-t from-background to-transparent" />
        
        {/* Bar content */}
        <div className="bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 safe-area-pb">
          {/* Price row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-xs text-muted-foreground truncate">{title}</p>
              <p className="text-lg font-bold brand-text">${price.toFixed(2)}</p>
            </div>
            <Button
              onClick={() => openTelegramLink(telegramSupportLink)}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-border hover:bg-surface-hover flex-shrink-0"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>

          {/* Buy button */}
          <Button
            onClick={onPayClick}
            className="w-full h-12 text-base font-semibold brand-gradient text-primary-foreground hover:opacity-90 transition-opacity touch-target"
          >
            <Zap className="w-5 h-5 mr-2" />
            Unlock Now
          </Button>
        </div>
      </div>
    );
  }
);

StickyBuyBar.displayName = 'StickyBuyBar';

export default StickyBuyBar;
