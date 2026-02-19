import { forwardRef } from 'react';
import { useProductSalesCounter } from '@/hooks/useSalesCounter';
import { Users } from 'lucide-react';

interface ProductSalesCounterProps {
  productId: string;
  variant?: 'default' | 'badge' | 'inline';
  className?: string;
}

const ProductSalesCounter = forwardRef<HTMLDivElement, ProductSalesCounterProps>(
  ({ productId, variant = 'default', className = '' }, ref) => {
    const salesCount = useProductSalesCounter(productId);

    if (variant === 'badge') {
      return (
        <div ref={ref} className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full ${className}`}>
          <span className="text-xs font-medium text-primary">
            🔥 {salesCount.toLocaleString()} sold
          </span>
        </div>
      );
    }

    if (variant === 'inline') {
      return (
        <div ref={ref} className={`text-sm text-muted-foreground ${className}`}>
          ✅ {salesCount.toLocaleString()} people bought this
        </div>
      );
    }

    return (
      <div ref={ref} className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            <span className="text-primary font-bold">{salesCount.toLocaleString()}</span>
            <span className="text-foreground ml-1">people already unlocked this content</span>
          </span>
          <span>🔥</span>
        </div>
      </div>
    );
  }
);

ProductSalesCounter.displayName = 'ProductSalesCounter';

export default ProductSalesCounter;
