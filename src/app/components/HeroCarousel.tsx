// ============================================
// HERO CAROUSEL - Style Wilderness Mocha Premium  
// ============================================
import { useState, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(true);
  const [direction, setDirection] = useState(0);

  const { translatedContent: translatedSlides } = useTranslatedContent(slides, ['title', 'subtitle', 'cta']);
  const displaySlides = (translatedSlides || slides) as Slide[];

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted || displaySlides.length === 0) return;
    const timer = setInterval(() => {
      if (isMounted) {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
      }
    }, 7000);
    return () => clearInterval(timer);
  }, [displaySlides.length, isMounted]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <section className="relative w-full h-screen bg-[#3d2f2b] overflow-hidden">
      <AnimatePresence mode="wait">
        {displaySlides.map((slide, index) => {
          if (index !== currentIndex) return null;

          return (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0">
                <motion.img
                  src={slide.image}
                  alt={slide.title}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.08 }}
                  transition={{ duration: 7, ease: "linear" }}
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [slide.id]: true }))}
                  className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded[slide.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                  style={{ filter: 'brightness(0.45) contrast(1.12) saturate(1.15)' }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[#3d2f2b]/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d2f2b] via-[#3d2f2b]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3d2f2b]/40 via-transparent to-transparent" />
              </div>

              <div className="absolute inset-0 flex items-end pb-28 lg:pb-36 px-6 lg:px-16">
                <div className="max-w-[1600px] w-full mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    className="max-w-5xl"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="mb-8 flex items-center gap-5"
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="h-[2px] w-16 bg-gradient-to-r from-[#E5D8C0]/60 to-transparent origin-left"
                      />
                      <span className="text-[10px] font-light text-[#E5D8C0]/80 uppercase tracking-[0.4em]">
                        {t('hero.featured')}
                      </span>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="overflow-hidden mb-10">
                      <motion.h1
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-5xl sm:text-6xl lg:text-8xl xl:text-8xl font-extralight text-[#E5D8C0] leading-[0.95] tracking-[-0.02em]"
                      >
                        {slide.title}
                      </motion.h1>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 1.1 }}
                      className="mb-12 max-w-3xl"
                    >
                      <p className="text-lg lg:text-2xl text-[#E5D8C0]/85 leading-relaxed font-light">
                        {slide.subtitle}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.3 }}
                      className="flex flex-wrap gap-5"
                    >
                      <motion.button
                        onClick={onNavigateToTours}
                        whileHover={{ scale: 1.03, x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative px-11 py-5 bg-[#E5D8C0] text-[#3d2f2b] overflow-hidden cursor-pointer"
                      >
                        <span className="relative z-10 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.25em]">
                          <span>{slide.cta}</span>
                          <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            →
                          </motion.span>
                        </span>
                      </motion.button>

                      {onNavigateToContact && (
                        <motion.button
                          onClick={onNavigateToContact}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative px-11 py-5 border-2 border-[#E5D8C0]/40 text-[#E5D8C0] overflow-hidden backdrop-blur-sm cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-[#E5D8C0]/0 group-hover:bg-[#E5D8C0]/10 transition-all duration-500" />
                          <span className="relative z-10 text-[13px] font-light uppercase tracking-[0.25em]">
                            {t('contact.title')}
                          </span>
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

      {/* Navigation */}
      <div className="absolute z-40 bottom-28 right-6 lg:bottom-36 lg:right-16">
        <div className="flex flex-col items-end gap-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="flex items-baseline gap-2 text-[#E5D8C0]/80 font-light">
            <span className="text-3xl tabular-nums">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-sm opacity-60">/</span>
            <span className="text-sm opacity-60">{String(displaySlides.length).padStart(2, '0')}</span>
          </motion.div>

          <div className="flex flex-col gap-5">
            {displaySlides.map((_, i) => (
              <button key={i} onClick={() => goToSlide(i)} className="group relative cursor-pointer">
                <div
                  className={`transition-all duration-500 ${i === currentIndex ? 'w-16 h-[3px] bg-[#E5D8C0]' : 'w-10 h-[2px] bg-[#E5D8C0]/25 hover:bg-[#E5D8C0]/60 hover:w-12'
                    }`}
                />
                {i === currentIndex && (
                  <motion.div
                    className="absolute top-0 left-0 h-[3px] bg-[#E5D8C0]"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 7, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {isMounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 lg:left-16 lg:translate-x-0 flex flex-col items-center lg:items-start gap-5"
        >
          <span className="text-[#E5D8C0]/50 text-[9px] font-light uppercase tracking-[0.5em] lg:-rotate-90">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-[2px] h-16 bg-gradient-to-b from-[#E5D8C0]/0 via-[#E5D8C0]/70 to-[#E5D8C0]/0"
          />
        </motion.div>
      )}
    </section>
  );
}
