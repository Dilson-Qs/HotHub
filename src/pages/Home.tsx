import { useState, useMemo } from 'react';
import { usePublicVideos } from '@/hooks/useVideos';
import { usePublicSections } from '@/hooks/useSections';
import HeroCarousel from '@/components/HeroCarousel';
import VideoGrid from '@/components/VideoGrid';
import Header from '@/components/Header';
import GlobalSalesCounter from '@/components/GlobalSalesCounter';
import StatsSection from '@/components/StatsSection';
import SpecialOfferBanner from '@/components/SpecialOfferBanner';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { videos, isLoading: videosLoading, getFeaturedVideos, getVideosBySection } = usePublicVideos();
  const { sections, isLoading: sectionsLoading, getContentSections } = usePublicSections();

  const featuredVideos = getFeaturedVideos();

  // Get content sections (non-carousel)
  const contentSections = getContentSections();

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const query = searchQuery.toLowerCase().trim();
    return videos.filter(video =>
      video.title.toLowerCase().includes(query) ||
      video.description?.toLowerCase().includes(query)
    );
  }, [searchQuery, videos]);

  const isSearching = searchQuery.trim().length > 0;
  const isLoading = videosLoading || sectionsLoading;

  // Videos not assigned to any section
  const unassignedVideos = useMemo(() => {
    return videos.filter(v => !v.sectionId);
  }, [videos]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />

      {/* Hero Carousel - hide when searching or no featured videos */}
      {!isSearching && featuredVideos.length > 0 && <HeroCarousel videos={featuredVideos} />}

      {/* Stats Section - hide when searching */}
      {!isSearching && (
        <div className="relative z-10 -mt-6 sm:-mt-8">
          <StatsSection />
          <GlobalSalesCounter className="mt-1 mb-4 sm:mt-2 sm:mb-6" />
        </div>
      )}

      {/* Search results indicator */}
      {isSearching && (
        <div className="pt-24 sm:pt-28 pb-4 container mx-auto px-4 md:px-8">
          <p className="text-muted-foreground">
            {filteredVideos.length} resultado{filteredVideos.length !== 1 ? 's' : ''} para "{searchQuery}"
          </p>
        </div>
      )}

      {/* Special Offer Banner - hide when searching */}
      {!isSearching && <SpecialOfferBanner />}

      {/* Video sections */}
      <div className={`relative z-10 pb-16 sm:pb-20 space-y-8 sm:space-y-12`} data-section="videos">
        {isSearching ? (
          /* When searching, show all results in grid */
          filteredVideos.length > 0 ? (
            <VideoGrid videos={filteredVideos} title="Resultados" gridLayout />
          ) : (
            <div className="container mx-auto px-4 md:px-8 py-12 text-center">
              <p className="text-muted-foreground text-lg">Nenhum conteúdo encontrado</p>
            </div>
          )
        ) : (
          <>
            {/* Dynamic sections from database */}
            {contentSections.map(section => {
              const sectionVideos = getVideosBySection(section.id);
              if (sectionVideos.length === 0) return null;

              return (
                <VideoGrid
                  key={section.id}
                  videos={sectionVideos}
                  title={section.display_name}
                  gridLayout={section.layout === 'grid'}
                />
              );
            })}

            {/* Unassigned videos or all videos if no sections */}
            {contentSections.length === 0 ? (
              /* No sections: show all videos */
              <>
                {videos.length > 0 && (
                  <VideoGrid videos={videos} title="All Premium Content" gridLayout />
                )}
              </>
            ) : unassignedVideos.length > 0 ? (
              /* Has sections but some videos are unassigned */
              <VideoGrid videos={unassignedVideos} title="All Content" gridLayout />
            ) : null}

            {/* Empty state */}
            {videos.length === 0 && (
              <div className="container mx-auto px-4 md:px-8 py-12 text-center">
                <p className="text-muted-foreground text-lg">Nenhum conteúdo disponível</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;