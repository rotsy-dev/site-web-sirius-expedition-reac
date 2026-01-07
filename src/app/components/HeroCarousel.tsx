import { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, Pause, Play, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  videoUrl?: string;
  animationMode?: 'slide' | 'fade' | 'zoom';
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
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const { translatedContent: translatedSlides, isLoading: isTranslatingSlides } = useTranslatedContent(
    slides,
    ['title', 'subtitle', 'cta']
  );

  const displaySlides = (translatedSlides || slides) as Slide[];
  
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const parallaxX = useTransform(mouseX, [0, 1], [-15, 15]);
  const parallaxY = useTransform(mouseY, [0, 1], [-15, 15]);

  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    isMobile: false,
    isTablet: false,
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      setViewport({
        width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
      });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    if (viewport.isMobile) return;
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mouseX.set(e.clientX / window.innerWidth);
        mouseY.set(e.clientY / window.innerHeight);
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [viewport.isMobile, mouseX, mouseY]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, viewport.isMobile ? 8000 : 6000);
    return () => clearInterval(timer);
  }, [currentIndex, displaySlides.length, isPaused, viewport.isMobile]);

  useEffect(() => {
    const indices = [
      currentIndex,
      (currentIndex + 1) % displaySlides.length,
      (currentIndex - 1 + displaySlides.length) % displaySlides.length,
    ];
    indices.forEach(idx => {
      const slide = displaySlides[idx];
      if (slide?.image && !imageLoaded[slide.id]) {
        const img = new Image();
        img.onload = () => setImageLoaded(prev => ({ ...prev, [slide.id]: true }));
        img.onerror = () => setImageLoaded(prev => ({ ...prev, [slide.id]: true }));
        img.src = slide.image;
      }
    });
  }, [currentIndex, displaySlides, imageLoaded]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
  }, [displaySlides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  }, [displaySlides.length]);

  // 3 ANIMATIONS DIFFÉRENTES pour le contenu selon l'index
  const getContentAnimation = (slideIndex: number) => {
    const animationType = slideIndex % 3;
    
    if (animationType === 0) {
      // Animation 1: Slide vertical simple
      return {
        title: {
          initial: { opacity: 0, y: direction > 0 ? 100 : -100 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as any, delay: 0.2 }
        },
        subtitle: {
          initial: { opacity: 0, y: direction > 0 ? 80 : -80 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
        },
        cta: {
          initial: { opacity: 0, y: direction > 0 ? 60 : -60 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.6, duration: 0.8 }
        }
      };
    } else if (animationType === 1) {
      // Animation 2: Fade + Blur vertical
      return {
        title: {
          initial: { opacity: 0, y: direction > 0 ? 80 : -80, filter: 'blur(10px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as any, delay: 0.3 }
        },
        subtitle: {
          initial: { opacity: 0, y: direction > 0 ? 60 : -60, filter: 'blur(8px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] as any }
        },
        cta: {
          initial: { opacity: 0, y: direction > 0 ? 40 : -40, filter: 'blur(6px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { delay: 0.7, duration: 0.8 }
        }
      };
    } else {
      // Animation 3: Zoom + Rotate vertical
      return {
        title: {
          initial: { opacity: 0, y: direction > 0 ? 120 : -120, scale: 0.8, rotateX: direction > 0 ? 20 : -20 },
          animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
          transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any, delay: 0.25 }
        },
        subtitle: {
          initial: { opacity: 0, y: direction > 0 ? 100 : -100, scale: 0.85 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { delay: 0.45, duration: 0.85, ease: [0.16, 1, 0.3, 1] as any }
        },
        cta: {
          initial: { opacity: 0, y: direction > 0 ? 80 : -80, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { delay: 0.65, duration: 0.75 }
        }
      };
    }
  };

  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-[#1a1410] via-[#2a1f1c] to-black overflow-hidden">
      {/* Fond animé simple - INCHANGÉ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.08, 0.03] }} 
          transition={{ duration: 15, repeat: Infinity, ease: [0.4, 0, 0.6, 1] }} 
          className="absolute top-20 right-20 w-96 h-96 bg-[#2fb5a3]/20 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.08, 0.03] }} 
          transition={{ duration: 18, repeat: Infinity, ease: [0.4, 0, 0.6, 1], delay: 2 }} 
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#F0E7D5]/10 rounded-full blur-3xl" 
        />
      </div>

      <div className="relative w-full h-full">
        {isTranslatingSlides && (
          <div className="absolute top-6 left-6 z-50">
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="inline-flex items-center gap-2 text-xs text-white/90 bg-black/40 px-3 py-2 rounded-full backdrop-blur-md border border-white/20"
            >
              <Loader2 className="w-3 h-3 animate-spin" />
              {t('common.loading')}
            </motion.span>
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          {displaySlides.map((slide, index) => {
            if (index !== currentIndex) return null;

            const contentAnim = getContentAnimation(index);

            return (
              <motion.div 
                key={slide.id}
                initial={{ opacity: 0, y: direction > 0 ? 100 : -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction > 0 ? -100 : 100 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
                style={{ perspective: 1200 }}
              >
                {/* Image avec parallaxe - INCHANGÉ */}
                <div className="absolute inset-0">
                  {slide.image ? (
                    <>
                      <motion.div 
                        initial={{ scale: 1.15 }} 
                        animate={{ scale: 1 }} 
                        transition={{ duration: 18, ease: 'linear' }} 
                        className="absolute inset-0 will-change-transform"
                        style={!viewport.isMobile ? { x: parallaxX, y: parallaxY } : {}}
                      >
                        <img 
                          src={slide.image} 
                          alt={slide.title} 
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${imageLoaded[slide.id] ? 'opacity-100' : 'opacity-0'}`}
                          loading={currentIndex === 0 ? 'eager' : 'lazy'}
                          style={{ 
                            filter: 'brightness(0.75) contrast(1.15) saturate(1.2)',
                            transform: 'translate3d(0,0,0)',
                          }}
                          onLoad={() => setImageLoaded(prev => ({ ...prev, [slide.id]: true }))}
                        />
                      </motion.div>
                      
                      {!imageLoaded[slide.id] && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-[#4B3935] to-[#2a1f1c]" 
                          animate={{ opacity: [0.3, 0.5, 0.3] }} 
                          transition={{ duration: 2, repeat: Infinity }} 
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent md:from-black/80 md:via-black/40" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent md:from-black/60" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#4B3935] to-[#2a1f1c]">
                      <p className="text-[#F0E7D5]/50">Aucune image</p>
                    </div>
                  )}
                </div>

                {/* Contenu avec 3 ANIMATIONS DIFFÉRENTES */}
                <div className="absolute inset-0 flex items-center justify-center md:justify-start px-4 sm:px-6 md:px-12 lg:px-16">
                  <div className="w-full max-w-4xl">
                    {/* Titre avec animation variable */}
                    <motion.h2 
                      initial={contentAnim.title.initial}
                      animate={contentAnim.title.animate}
                      transition={contentAnim.title.transition}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight text-center md:text-left"
                      style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}
                    >
                      {slide.title}
                    </motion.h2>
                    
                    {/* Description avec animation variable */}
                    <motion.div 
                      initial={contentAnim.subtitle.initial}
                      animate={contentAnim.subtitle.animate}
                      transition={contentAnim.subtitle.transition}
                      className="mb-6 md:mb-8"
                    >
                      <div className="bg-black/40 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-2xl border border-white/10 shadow-xl">
                        <p className="text-[#F0E7D5]/95 text-sm sm:text-base md:text-lg leading-relaxed text-center md:text-left">
                          {slide.subtitle}
                        </p>
                      </div>
                    </motion.div>

                    {/* Boutons CTA avec animation variable */}
                    <motion.div 
                      initial={contentAnim.cta.initial}
                      animate={contentAnim.cta.animate}
                      transition={contentAnim.cta.transition}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start"
                    >
                      <motion.button 
                        onClick={onNavigateToTours}
                        className="group relative px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#2fb5a3] to-[#26a393] rounded-xl font-bold text-white text-sm sm:text-base shadow-lg shadow-[#2fb5a3]/30 overflow-hidden"
                        whileHover={!viewport.isMobile ? { scale: 1.05, y: -3 } : {}}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative uppercase tracking-wide">
                          {slide.cta}
                        </span>
                      </motion.button>

                      {onNavigateToContact && (
                        <motion.button 
                          onClick={onNavigateToContact}
                          className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border-2 border-white/40 text-sm sm:text-base font-semibold text-white bg-white/10 backdrop-blur-xl hover:bg-white/20 hover:border-white/60 transition-all duration-300"
                          whileHover={!viewport.isMobile ? { scale: 1.03 } : {}}
                          whileTap={{ scale: 0.95 }}
                        >
                          {t('contact.title')}
                        </motion.button>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Contrôles navigation VERTICAUX */}
        <motion.button 
          onClick={prevSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-1/2 -translate-x-1/2 top-6 md:top-8 z-40 p-3 md:p-4 bg-white/15 hover:bg-white/25 backdrop-blur-xl rounded-full border border-white/30 shadow-xl transition-colors"
        >
          <ChevronUp className="text-white w-5 md:w-6 h-5 md:h-6" strokeWidth={2.5} />
        </motion.button>

        <motion.button 
          onClick={nextSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-20 md:bottom-24 z-40 p-3 md:p-4 bg-white/15 hover:bg-white/25 backdrop-blur-xl rounded-full border border-white/30 shadow-xl transition-colors"
        >
          <ChevronDown className="text-white w-5 md:w-6 h-5 md:h-6" strokeWidth={2.5} />
        </motion.button>

        {/* <motion.button 
          onClick={() => setIsPaused(!isPaused)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 md:top-6 right-4 md:right-6 z-40 p-3 bg-white/15 hover:bg-white/25 backdrop-blur-xl rounded-full border border-white/30 shadow-xl transition-colors"
        >
          {isPaused ? 
            <Play className="text-white w-4 md:w-5 h-4 md:h-5" fill="white" /> : 
            <Pause className="text-white w-4 md:w-5 h-4 md:h-5" fill="white" />
          }
        </motion.button> */}

        {/* Indicateurs - Horizontaux sur mobile, verticaux sur desktop */}
        <div className="absolute z-40 
          bottom-6 left-1/2 -translate-x-1/2 flex-row gap-2.5 md:flex-col md:right-6 lg:right-8 md:top-1/2 md:-translate-y-1/2 md:left-auto md:bottom-auto md:translate-x-0
          flex bg-black/30 backdrop-blur-xl px-5 py-3 md:px-3 md:py-5 rounded-full border border-white/20">
                  {displaySlides.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-1" // Zone tactile plus grande
                    >
                      <div className={`rounded-full transition-all duration-500 ${index === currentIndex
                          ? 'w-10 h-2.5 md:w-2.5 md:h-10 bg-gradient-to-r md:bg-gradient-to-b from-[#2fb5a3] to-[#F0E7D5]'
                          : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
                        }`} />
                    </motion.button>
                  ))}
                </div>

        {/* Compteur */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="hidden md:block absolute bottom-8 left-8 z-40"
        >
          <div className="bg-white/15 backdrop-blur-xl px-5 py-3 rounded-xl border border-white/30 shadow-xl">
            <span className="text-white font-bold tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')}
              <span className="text-[#2fb5a3] mx-2">/</span>
              {String(displaySlides.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}