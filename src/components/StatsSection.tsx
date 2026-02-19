import { DollarSign, Users, Star, TrendingUp, ArrowRight } from 'lucide-react';
import StatsBadge from './StatsBadge';
import { useOnlineCount } from '@/hooks/useOnlineCount';
import { Button } from './ui/button';

const StatsSection = () => {
  const onlineCount = useOnlineCount(82);

  const scrollToVideos = () => {
    const videosSection = document.querySelector('[data-section="videos"]');
    if (videosSection) {
      videosSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-4 sm:py-6 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            Vídeos disponíveis
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToVideos}
            className="w-fit group border-border/50 hover:border-brand hover:text-brand text-xs sm:text-sm touch-target"
          >
            Ver todos os vídeos
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        {/* Stats Badges - Optimized grid for mobile */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <StatsBadge icon={<DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />}>
            A partir de $25
          </StatsBadge>

          <StatsBadge icon={<Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />}>
            791+ clientes
          </StatsBadge>

          <StatsBadge icon={<Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />}>
            4,7/5 ⭐
          </StatsBadge>

          <StatsBadge variant="live">
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              <span className="tabular-nums font-semibold">{onlineCount}</span>
              <span className="hidden sm:inline">online</span>
            </span>
          </StatsBadge>

          <StatsBadge icon={<TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />} className="hidden sm:inline-flex">
            Até $150
          </StatsBadge>

          <StatsBadge icon={<DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand" />} className="hidden sm:inline-flex">
            Média: $57
          </StatsBadge>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
