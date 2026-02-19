import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsBadgeProps {
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'live';
  className?: string;
}

const StatsBadge = ({ icon, children, variant = 'default', className }: StatsBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full",
        "text-xs sm:text-sm font-medium",
        "border border-border/50 bg-card/80 backdrop-blur-sm",
        "transition-all duration-200",
        variant === 'live' && "border-brand/40 bg-brand/10",
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="text-foreground/90 truncate">{children}</span>
    </div>
  );
};

export default StatsBadge;
