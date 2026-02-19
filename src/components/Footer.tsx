import { Send, AlertTriangle, Home, Video, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTelegramUsername } from '@/hooks/useAppSettings';
import { generateBuyLink, openTelegramLink } from '@/utils/telegram';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { telegramUsername } = useTelegramUsername();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToVideos = () => {
    const videosSection = document.querySelector('[data-section="videos"]');
    if (videosSection) {
      videosSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openTelegram = () => {
    const url = generateBuyLink(telegramUsername);
    openTelegramLink(url);
  };

  return (
    <footer className="mt-8 sm:mt-12">
      {/* VIP CTA Section */}
      <div className="container mx-auto px-4 md:px-8 mb-8">
        <div className="bg-gradient-to-r from-brand via-brand-dark to-brand rounded-xl p-4 sm:p-8 text-center">
          <h3 className="text-base sm:text-xl font-bold text-white mb-2">
            Para mais conteúdo VIP ou acesso completo
          </h3>
          <p className="text-white/80 text-xs sm:text-sm mb-4 max-w-xl mx-auto">
            Entre em contato para acesso exclusivo a vídeos premium e biblioteca completa.
          </p>
          <Button
            onClick={openTelegram}
            className="bg-white text-brand hover:bg-white/90 font-semibold px-4 py-2 sm:px-6 sm:py-3 h-auto text-sm sm:text-base"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Contato via Telegram
          </Button>
        </div>
      </div>

      {/* Age Verification Banner */}
      <div className="container mx-auto px-4 md:px-8 mb-8">
        <div className="bg-muted/50 border border-border rounded-xl p-4 flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">VERIFICAÇÃO DE IDADE:</span>{' '}
            Conteúdo adulto (18+). Ao acessar este site, você confirma ter pelo menos 18 anos.
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 md:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div>
              <h4 className="text-lg font-bold mb-4">
                <span className="brand-text">Hot</span>
                <span className="text-foreground">Hub</span>
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Oferecemos conteúdo premium exclusivo para nossos usuários. Todos os vídeos são cuidadosamente selecionados para garantir a mais alta qualidade para nossa audiência 18+.
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-base font-semibold text-foreground mb-4">Links Rápidos</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={scrollToTop}
                    className="text-sm text-muted-foreground hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Início
                  </button>
                </li>
                <li>
                  <button
                    onClick={scrollToVideos}
                    className="text-sm text-muted-foreground hover:text-brand transition-colors flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Vídeos
                  </button>
                </li>
              </ul>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 bg-brand/10 text-brand text-xs font-semibold px-3 py-1.5 rounded-full border border-brand/20">
                  <Shield className="w-3.5 h-3.5" />
                  18+ APENAS ADULTOS
                </span>
              </div>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-base font-semibold text-foreground mb-4">Informações Legais</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Este site contém material orientado para adultos destinado a indivíduos com 18 anos ou mais. Todos os modelos que aparecem neste site tinham 18 anos ou mais no momento da produção.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Declaração de Conformidade com Requisitos de Manutenção de Registros USC 2257.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-border">
          <div className="container mx-auto px-4 md:px-8 py-4 sm:py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <p>
                © {currentYear} <span className="brand-text font-semibold">Hot</span><span className="font-semibold">Hub</span>. Todos os direitos reservados. Apenas adultos.
              </p>
              <p className="text-center sm:text-right">
                Ao acessar este site você concorda que tem pelo menos 18 anos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
