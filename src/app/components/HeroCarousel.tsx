import { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  onNavigateToContact?: () => void;
  onNavigateToTours?: () => void;
}

export function HeroCarousel({ slides, onNavigateToContact, onNavigateToTours }: HeroCarouselProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  const { translatedContent: translatedSlides } = useTranslatedContent(slides, ['title', 'subtitle', 'cta']);
  const displaySlides = (translatedSlides || slides) as Slide[];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-[#1a1410] via-[#2a201d] to-[#1a1410] overflow-hidden">
      {/* Effet de particules en arrière-plan */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4A574]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4A574]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <AnimatePresence mode="wait">
        {displaySlides.map((slide, index) => {
          if (index !== currentIndex) return null;

          return (
            <motion.div 
              key={slide.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0"
            >
              {/* Image de fond avec overlay moderne */}
              <div className="absolute inset-0">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [slide.id]: true }))}
                  className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded[slide.id] ? 'opacity-100' : 'opacity-0'}`}
                  style={{ filter: 'brightness(0.4) saturate(1.2)' }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                />
                {/* Gradient overlay moderne */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410]/90 via-[#1a1410]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/80 via-transparent to-transparent" />
              </div>

              {/* Contenu principal - Design Premium */}
              <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-24 md:pt-0">
                <div className="max-w-6xl w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                  >
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full"
                    >
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#D4A574]" />
                      <span className="text-[10px] sm:text-xs font-bold text-white/90 uppercase tracking-wider">
                        {t('hero.featured')}
                      </span>
                    </motion.div>

                    {/* Titre principal - Typographie premium */}
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 sm:mb-6 leading-tight tracking-tight"
                    >
                      <span className="block bg-gradient-to-r from-white via-[#F0E7D5] to-white bg-clip-text text-transparent">
                        {slide.title}
                      </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-3xl leading-relaxed font-light px-2 sm:px-0"
                    >
                      {slide.subtitle}
                    </motion.p>

                    {/* Boutons CTA - Design moderne */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="flex flex-wrap gap-3 sm:gap-4"
                    >
                      <motion.button 
                        onClick={onNavigateToTours}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-[#4B3935] font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl transition-all shadow-2xl hover:shadow-[#D4A574]/50 overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                          <span className="whitespace-nowrap">{slide.cta}</span>
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-lg sm:text-xl"
                          >
                            →
                          </motion.span>
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </motion.button>

                      {onNavigateToContact && (
                        <motion.button 
                          onClick={onNavigateToContact}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-xl text-white font-bold text-sm sm:text-base hover:bg-white/20 transition-all shadow-xl whitespace-nowrap"
                        >
                          {t('contact.title')}
                        </motion.button>
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Navigation latérale moderne */}
      <div className="absolute z-40 right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {displaySlides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentIndex(i)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`relative transition-all duration-500 rounded-full ${
              i === currentIndex 
                ? 'h-12 w-2 bg-gradient-to-b from-[#D4A574] to-[#C4965F] shadow-lg shadow-[#D4A574]/50' 
                : 'h-4 w-2 bg-white/30 hover:bg-white/50'
            }`}
          >
            {i === currentIndex && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 bg-gradient-to-b from-[#D4A574] to-[#C4965F] rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Scroll indicator - À droite pour mobile, centré pour desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-4 sm:right-8 md:left-1/2 md:-translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/60 text-xs font-medium uppercase tracking-wider hidden sm:block">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}