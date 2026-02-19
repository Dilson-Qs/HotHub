import { Gift, Sparkles } from 'lucide-react';

interface FloatingOfferButtonProps {
  onClick: () => void;
}

const FloatingOfferButton = ({ onClick }: FloatingOfferButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all animate-pulse-glow group"
      aria-label="Open special offer"
    >
      <div className="relative">
        <Gift className="w-5 h-5" />
        <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-primary-foreground animate-pulse" />
      </div>
      <span className="font-bold text-sm hidden sm:inline">50% OFF</span>
    </button>
  );
};

export default FloatingOfferButton;
