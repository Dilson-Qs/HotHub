import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CryptoSelectorProps {
  onSelect: (crypto: string) => void;
  onBack: () => void;
  videoTitle: string;
  price: number;
}

const CRYPTO_OPTIONS = [
  { id: 'USDT', name: 'Tether (USDT)', icon: '💵', color: '#26a17b' },
  { id: 'BTC', name: 'Bitcoin (BTC)', icon: '₿', color: '#f7931a' },
  { id: 'ETH', name: 'Ethereum (ETH)', icon: 'Ξ', color: '#627eea' },
  { id: 'BNB', name: 'BNB', icon: '🔶', color: '#f3ba2f' },
];

const CryptoSelector = ({ onSelect, onBack, videoTitle, price }: CryptoSelectorProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedCrypto) {
      onSelect(selectedCrypto);
    }
  };

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to payment methods</span>
      </button>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-lg">Select Cryptocurrency</h3>
        <p className="text-sm text-muted-foreground">Choose your preferred crypto</p>
      </div>

      {/* Crypto options grid */}
      <div className="grid grid-cols-2 gap-3">
        {CRYPTO_OPTIONS.map((crypto) => (
          <button
            key={crypto.id}
            onClick={() => setSelectedCrypto(crypto.id)}
            className={`relative p-4 rounded-xl border-2 transition-all text-center ${
              selectedCrypto === crypto.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-surface hover:border-primary/50 hover:bg-surface-hover'
            }`}
          >
            {selectedCrypto === crypto.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <div 
              className="text-3xl mb-2"
              style={{ color: crypto.color }}
            >
              {crypto.icon}
            </div>
            <div className="font-semibold text-sm">{crypto.id}</div>
            <div className="text-xs text-muted-foreground">{crypto.name.split(' ')[0]}</div>
          </button>
        ))}
      </div>

      {/* Confirm button */}
      <Button
        onClick={handleConfirm}
        disabled={!selectedCrypto}
        className="w-full h-14 text-lg font-semibold brand-gradient text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedCrypto ? `Pay with ${selectedCrypto}` : 'Select a cryptocurrency'}
      </Button>

      {/* Info text */}
      <p className="text-xs text-muted-foreground text-center">
        You'll be redirected to complete payment via Telegram
      </p>
    </div>
  );
};

export default CryptoSelector;
