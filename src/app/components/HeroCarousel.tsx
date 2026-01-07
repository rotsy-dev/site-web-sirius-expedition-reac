import { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
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
    <section className="relative w-full h-screen bg-[#1a1410] overflow-hidden">
      <AnimatePresence mode="wait">
        {displaySlides.map((slide, index) => {
          if (index !== currentIndex) return null;

          return (
            <motion.div 
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Image de fond fixe - Stabilité totale */}
              <div className="absolute inset-0">
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [slide.id]: true }))}
                  className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded[slide.id] ? 'opacity-100' : 'opacity-0'}`}
                  style={{ filter: 'brightness(0.5)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
              </div>

              {/* Cadre ultra-large à gauche - Marge équilibrée à droite */}
              <div className="absolute inset-0 flex items-center px-4 md:px-8 lg:px-12">
                <div className="relative p-8 md:p-12 lg:p-14 rounded-[30px] border border-white/10 backdrop-blur-sm w-full max-w-[98%] bg-black/10 shadow-xl">
                  
                  {/* Titre réduit */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-4 tracking-wide uppercase opacity-90"
                  >
                    {slide.title}
                  </motion.h2>

                  {/* Description s'étalant sur la nouvelle largeur - Taille réduite */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <p className="text-[#F3E5AB]/80 text-sm md:text-base lg:text-lg mb-10 leading-relaxed max-w-5xl  font-light">
                      {slide.subtitle}
                    </p>
                  </motion.div>

                  {/* CTAs */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-wrap gap-5"
                  >
                    <button 
                      onClick={onNavigateToTours}
                      className="px-8 py-3 bg-[#2fb5a3] hover:bg-[#26a393] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-sm"
                    >
                      {slide.cta}
                    </button>

                    {onNavigateToContact && (
                      <button 
                        onClick={onNavigateToContact}
                        className="px-8 py-3 rounded-xl border border-[#F3E5AB]/20 bg-[#2C1E16] text-[#F3E5AB] font-bold hover:bg-[#3D2B1F] transition-all shadow-xl active:scale-95 text-sm"
                      >
                        {t('contact.title')}
                      </button>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Navigation latérale */}
      <div className="absolute z-40 right-6 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        {displaySlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`transition-all duration-500 rounded-full ${i === currentIndex ? 'h-10 w-1.5 bg-[#2fb5a3]' : 'h-3 w-1.5 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}