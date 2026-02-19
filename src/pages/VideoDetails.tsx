import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, MessageCircle, Zap, Maximize2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePublicVideos } from '@/hooks/useVideos';
import { openTelegramLink } from '@/utils/telegram';
import StickyBuyBar from '@/components/StickyBuyBar';
import Header from '@/components/Header';
import PaymentModal from '@/components/PaymentModal';
import ProductSalesCounter from '@/components/ProductSalesCounter';
import { resolveImageUrl } from '@/lib/imageAssets';

const VideoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVideoById, isLoading } = usePublicVideos();

  const video = getVideoById(id || '');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const expandedVideoRef = useRef<HTMLVideoElement>(null);

  const [videoTime, setVideoTime] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Toggle fullscreen nativo (preferido em mobile)
  const toggleFullscreen = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // iOS Safari usa webkitEnterFullscreen
    if ((videoElement as any).webkitEnterFullscreen) {
      (videoElement as any).webkitEnterFullscreen();
    } else if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    }
  };

  // Toggle modo expandido (overlay) - para desktop ou fallback
  const toggleExpanded = () => {
    if (!isExpanded) {
      // Guardar tempo atual do vídeo
      if (videoRef.current) {
        setVideoTime(videoRef.current.currentTime);
      }

      // Em mobile, tentar fullscreen nativo primeiro
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const videoElement = videoRef.current;

      if (isMobile && videoElement) {
        // iOS Safari
        if ((videoElement as any).webkitEnterFullscreen) {
          (videoElement as any).webkitEnterFullscreen();
          return;
        }
        // Android e outros browsers
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
          return;
        }
      }

      // Fallback para overlay (desktop ou se fullscreen falhar)
      setIsVideoLoading(true);
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  };

  // Sincronizar tempo quando vídeo expandido carregar
  const handleExpandedVideoLoad = () => {
    setIsVideoLoading(false);
    if (expandedVideoRef.current && videoTime > 0) {
      expandedVideoRef.current.currentTime = videoTime;
      expandedVideoRef.current.play().catch(() => { });
    }
  };

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    if (isExpanded) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  if (isLoading && !video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <Button onClick={() => navigate('/')}>Go back home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-36 md:pb-8">
      <Header />

      {/* Back button - mobile - positioned below header */}
      <div className="fixed top-16 left-3 z-30 md:hidden animate-slide-in-left">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm border border-border flex items-center justify-center touch-target shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Hero section with video preview */}
      <div className="relative w-full aspect-video sm:aspect-[16/10] md:aspect-[21/9] overflow-hidden">
        {/* Cover image as background */}
        <img
          src={resolveImageUrl(video.coverImage)}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

        {/* Video preview placeholder */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="relative w-full max-w-3xl group">
            <video
              ref={videoRef}
              src={video.previewVideoUrl}
              poster={resolveImageUrl(video.coverImage)}
              controls
              playsInline
              className="w-full max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] rounded-lg shadow-2xl object-contain"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>

            {/* Botão de expandir */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleExpanded();
              }}
              className="absolute top-3 left-3 z-50 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/80 backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-black/90 hover:scale-110 active:scale-95 pointer-events-auto"
              title="Expandir vídeo"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gradient fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 -mt-6 sm:-mt-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Category */}
            {video.category && (
              <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full mb-3">
                {video.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-3 leading-tight">
              {video.title}
            </h1>

            {/* Price - mobile */}
            <div className="md:hidden mb-4">
              <p className="text-2xl font-bold brand-text mb-0.5">
                ${video.price.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">One-time payment. No subscriptions.</p>
            </div>

            {/* Sales proof */}
            <ProductSalesCounter productId={video.id} className="mb-4" />

            {/* Description */}
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
              {video.description}
            </p>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3">What you'll get:</h3>
              <ul className="space-y-2.5">
                {video.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar - desktop only */}
          <div className="hidden md:block">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-5">
              {/* Price */}
              <p className="text-3xl lg:text-4xl font-bold brand-text mb-1">
                ${video.price.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mb-4">One-time payment. No subscriptions.</p>

              {/* Sales badge */}
              <ProductSalesCounter productId={video.id} variant="badge" className="mb-5" />

              {/* CTA Buttons */}
              <div className="space-y-2.5">
                <Button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="w-full h-12 lg:h-14 text-base lg:text-lg font-semibold brand-gradient text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Unlock Now
                </Button>

                <Button
                  onClick={() => openTelegramLink(video.telegramSupportLink)}
                  variant="outline"
                  className="w-full h-11 text-sm font-semibold border-border hover:bg-surface-hover"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Need help? Buy with support
                </Button>
              </div>

              {/* Urgency text */}
              <div className="mt-4 p-2.5 bg-primary/5 rounded-lg">
                <p className="text-xs text-center text-foreground">
                  ⚡ Limited availability. Access granted instantly.
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  🔒 Secure & encrypted payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky buy bar - mobile only */}
      <StickyBuyBar
        title={video.title}
        price={video.price}
        videoId={video.id}
        onPayClick={() => setIsPaymentModalOpen(true)}
        telegramSupportLink={video.telegramSupportLink}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        videoTitle={video.title}
        price={video.price}
        telegramSupportLink={video.telegramSupportLink}
        paymentLinkUrl={video.paymentLinkUrl}
      />

      {/* Modal de Vídeo Expandido */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={toggleExpanded}
        >
          {/* Loading indicator */}
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Botão fechar */}
          <button
            onClick={toggleExpanded}
            className="absolute top-4 right-4 w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all z-30"
            title="Fechar (ESC)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Botão fullscreen nativo */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (expandedVideoRef.current?.requestFullscreen) {
                expandedVideoRef.current.requestFullscreen();
              } else if ((expandedVideoRef.current as any)?.webkitEnterFullscreen) {
                (expandedVideoRef.current as any).webkitEnterFullscreen();
              }
            }}
            className="absolute top-4 right-20 w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all z-30"
            title="Tela cheia"
          >
            <Maximize2 className="w-6 h-6" />
          </button>

          {/* Vídeo expandido */}
          <video
            key="expanded-video"
            ref={expandedVideoRef}
            src={video.previewVideoUrl}
            poster={resolveImageUrl(video.coverImage)}
            controls
            autoPlay
            playsInline
            muted={false}
            preload="auto"
            onLoadedData={handleExpandedVideoLoad}
            onCanPlay={handleExpandedVideoLoad}
            className={`relative z-10 w-full h-full max-w-[95vw] max-h-[90vh] object-contain transition-opacity duration-300 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
