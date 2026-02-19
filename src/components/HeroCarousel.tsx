import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PublicVideo as Video } from '@/hooks/useVideos';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '@/lib/imageAssets';

interface HeroCarouselProps {
  videos: Video[];
  autoPlayInterval?: number;
}

const HeroCarousel = ({ videos, autoPlayInterval = 5000 }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, videos.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === videos.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, videos.length, goToSlide]);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [goToNext, autoPlayInterval]);

  const currentVideo = videos[currentIndex];

  if (!currentVideo) return null;

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      {videos.map((video, index) => (
        <div
          key={video.id}
          className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <img
            src={resolveImageUrl(video.coverImage)}
            alt={video.title}
            className="w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          {/* Gradient overlays - use dark tints to keep image visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 sm:pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-xl md:max-w-2xl animate-slide-up" key={currentVideo.id}>
            {/* Category badge */}
            {currentVideo.category && (
              <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full mb-3">
                {currentVideo.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight text-balance">
              {currentVideo.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-2 leading-relaxed">
              {currentVideo.description}
            </p>

            {/* Price */}
            <p className="text-xl sm:text-2xl md:text-3xl font-bold brand-text mb-5">
              ${currentVideo.price.toFixed(2)}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate(`/video/${currentVideo.id}`)}
                className="h-12 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold brand-gradient text-primary-foreground hover:opacity-90 transition-opacity touch-target"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current" />
                Watch Preview
              </Button>
              <Button
                onClick={() => navigate(`/video/${currentVideo.id}`)}
                variant="outline"
                className="h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold border-2 border-foreground/20 hover:bg-foreground/10 touch-target"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - desktop only */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/80 transition-colors hidden md:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/80 transition-colors hidden md:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
              ? 'w-4 bg-primary'
              : 'w-1.5 bg-foreground/30 hover:bg-foreground/50'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
