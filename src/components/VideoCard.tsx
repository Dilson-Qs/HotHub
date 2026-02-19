import { PublicVideo as Video } from '@/hooks/useVideos';
import { useNavigate } from 'react-router-dom';
import { Eye, MessageCircle, CreditCard, Play } from 'lucide-react';
import { useMemo } from 'react';
import { resolveImageUrl } from '@/lib/imageAssets';
import { getCheckoutUrlForPrice } from '@/lib/checkout';
import { openTelegramLink, safeOpenExternal } from '@/utils/telegram';

interface VideoCardProps {
  video: Video;
  fullWidth?: boolean;
}

const VideoCard = ({ video, fullWidth = false }: VideoCardProps) => {
  const navigate = useNavigate();

  const handleInstantPayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let directUrl = video.paymentLinkUrl?.trim();
    if (directUrl) {
      if (!/^https?:\/\//i.test(directUrl)) directUrl = 'https://' + directUrl;
      safeOpenExternal(directUrl);
      return;
    }

    const checkoutUrl = getCheckoutUrlForPrice(video.price);
    if (checkoutUrl) {
      safeOpenExternal(checkoutUrl);
      return;
    }

    if (video.telegramSupportLink) openTelegramLink(video.telegramSupportLink);
  };

  const handleTelegramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openTelegramLink(video.telegramSupportLink);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/video/${video.id}`);
  };

  // Stable random views based on video ID (won't flicker on re-render)
  const views = useMemo(() => {
    const hash = video.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 100 + (hash % 900);
  }, [video.id]);

  return (
    <div
      className={`group relative ${fullWidth ? 'w-full' : 'flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px]'
        }`}
    >
      {/* Card container */}
      <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
        {/* Cover Image - 1280x675 aspect ratio */}
        <div className="relative aspect-[1280/675] overflow-hidden">
          <img
            src={resolveImageUrl(video.coverImage)}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Price badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs sm:text-sm font-bold bg-primary text-primary-foreground rounded shadow-lg">
              ${video.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Title */}
          <h3 className="text-sm font-semibold line-clamp-1 text-foreground">
            {video.title} 🔞 🍑🔥✅
          </h3>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{views} views</span>
            </div>
            <span>Recently added</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={handlePreviewClick}
              className="flex items-center justify-center gap-1 py-2 bg-secondary hover:bg-muted text-secondary-foreground text-[10px] sm:text-xs font-medium rounded transition-colors"
            >
              <Play className="w-3 h-3" />
              Preview
            </button>
            <button
              onClick={handleTelegramClick}
              className="flex items-center justify-center gap-1 py-2 bg-secondary hover:bg-muted text-secondary-foreground text-[10px] sm:text-xs font-medium transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              Telegram
            </button>
            <button
              onClick={handleInstantPayClick}
              className="flex items-center justify-center gap-1 py-2 bg-primary hover:bg-brand-dark text-primary-foreground text-[10px] sm:text-xs font-medium rounded transition-colors"
            >
              <CreditCard className="w-3 h-3" />
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
