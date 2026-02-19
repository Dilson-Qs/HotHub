import { PublicVideo as Video } from '@/hooks/useVideos';
import VideoCard from './VideoCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface VideoGridProps {
  videos: Video[];
  title?: string;
  gridLayout?: boolean;
}

const VideoGrid = ({ videos, title, gridLayout = false }: VideoGridProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (videos.length === 0) return null;

  return (
    <section className="py-4 sm:py-6 md:py-8">
      {/* Section header */}
      {title && (
        <div className="container mx-auto px-4 md:px-8 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{title}</h2>
        </div>
      )}

      {gridLayout ? (
        /* Grid layout - 2 items per row on mobile */
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} fullWidth />
            ))}
          </div>
        </div>
      ) : (
        /* Scrollable row */
        <div className="relative group">
          {/* Scroll buttons - desktop only */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-24 bg-gradient-to-r from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-start pl-2"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-8 h-8 text-foreground" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-24 bg-gradient-to-l from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-end pr-2"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-8 h-8 text-foreground" />
          </button>

          {/* Video cards row */}
          <div
            ref={scrollRef}
            className="flex gap-2.5 sm:gap-3 md:gap-4 overflow-x-auto hide-scrollbar px-4 md:px-8 pb-2"
          >
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoGrid;
