import { useEffect, useState } from 'react';
import hotpayLogo from '@/assets/hotpay-logo.png';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'zoom' | 'reveal' | 'exit'>('zoom');
  const [showLogo, setShowLogo] = useState(false);
  const [showLetters, setShowLetters] = useState(false);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    // Netflix-style animation sequence
    const logoTimer = setTimeout(() => setShowLogo(true), 100);
    const lettersTimer = setTimeout(() => setShowLetters(true), 800);
    const barTimer = setTimeout(() => setShowBar(true), 1400);
    const revealTimer = setTimeout(() => setPhase('reveal'), 1800);
    const exitTimer = setTimeout(() => {
      setPhase('exit');
      setTimeout(onComplete, 600);
    }, 2800);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(lettersTimer);
      clearTimeout(barTimer);
      clearTimeout(revealTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  const letters = ['H', 'o', 't', 'H', 'u', 'b'];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-all duration-700 ease-out ${phase === 'exit' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        }`}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full transition-all ease-out ${showLogo
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-0'
            }`}
          style={{
            transitionDuration: '1500ms',
            background: 'radial-gradient(circle, hsl(var(--brand) / 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Cinematic bars */}
      <div
        className={`absolute top-0 left-0 right-0 h-16 bg-black transition-all duration-700 ${phase === 'reveal' ? 'translate-y-0' : '-translate-y-full'
          }`}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 h-16 bg-black transition-all duration-700 ${phase === 'reveal' ? 'translate-y-0' : 'translate-y-full'
          }`}
      />

      <div className="flex flex-col items-center gap-6 px-4 relative z-10">
        {/* Logo with Netflix-style zoom */}
        <div
          className={`relative transition-all ease-out ${showLogo
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-[2.5]'
            }`}
          style={{ transitionDuration: showLogo ? '800ms' : '500ms' }}
        >
          <img
            src={hotpayLogo}
            alt="HotHub"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
            style={{
              filter: showLogo
                ? 'drop-shadow(0 0 40px hsl(var(--brand) / 0.6)) drop-shadow(0 0 80px hsl(var(--brand) / 0.3))'
                : 'none',
            }}
          />
        </div>

        {/* Letter-by-letter reveal */}
        <div className="flex items-center overflow-hidden">
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight transition-all duration-500 ease-out ${index < 3 ? 'text-[hsl(var(--brand))]' : 'text-white'
                } ${showLetters
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-full'
                }`}
              style={{
                transitionDelay: showLetters ? `${index * 80}ms` : '0ms',
                textShadow: index < 3
                  ? '0 0 30px hsl(var(--brand) / 0.5)'
                  : '0 0 20px rgba(255,255,255,0.2)',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Loading bar - Netflix style */}
        <div
          className={`relative h-[3px] w-48 sm:w-64 overflow-hidden rounded-full bg-white/10 transition-all duration-500 ${showBar ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--brand-light))] rounded-full"
            style={{
              width: showBar ? '100%' : '0%',
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 0 10px hsl(var(--brand) / 0.8)',
            }}
          />
        </div>

        {/* Tagline */}
        <p
          className={`text-white/50 text-xs sm:text-sm font-medium uppercase tracking-[0.3em] transition-all duration-500 ${showBar
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
            }`}
          style={{ transitionDelay: showBar ? '300ms' : '0ms' }}
        >
          Premium Content
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
