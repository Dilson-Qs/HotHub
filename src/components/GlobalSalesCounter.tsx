import { useGlobalSalesCounter } from '@/hooks/useSalesCounter';
import { TrendingUp } from 'lucide-react';

interface GlobalSalesCounterProps {
  className?: string;
}

const GlobalSalesCounter = ({ className = '' }: GlobalSalesCounterProps) => {
  const salesCount = useGlobalSalesCounter(1240);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-brand/10 border border-brand/20">
        <TrendingUp className="w-4 h-4 text-brand" />
        <span className="text-xs sm:text-sm font-medium text-foreground">
          <span className="text-brand font-bold tabular-nums">{salesCount.toLocaleString()}</span>
          <span className="text-muted-foreground"> purchases on HotHub</span>
        </span>
      </div>
    </div>
  );
};

export default GlobalSalesCounter;