import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader } from '../../components/common/SectionHeader';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  videoUrl: string;
}

interface HeroCarouselProps {
  slides: Slide[];
  onNavigateToContact?: () => void;
  onNavigateToTours?: () => void;
  content?: {
    pageHeaders?: {
      hero?: {
        badge?: string;
        title?: string;
        subtitle?: string;
      };
    };
  };
}

export function HeroCarousel({ slides, onNavigateToContact, onNavigateToTours, content = {} }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  // Préchargement des images
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.image && !imageLoaded[slide.id]) {
        const img = new Image();
        img.onload = () => {
          setImageLoaded(prev => ({ ...prev, [slide.id]: true }));
        };
        img.src = slide.image;
      }
    });
  }, [slides]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getCardPosition = (index: number) => {
    const diff = index - currentIndex;
    if (diff === 0) return 'center';
    if (diff === 1 || diff === -(slides.length - 1)) return 'right';
    if (diff === -1 || diff === slides.length - 1) return 'left';
    return 'hidden';
  };

  const getCardStyle = (position: string) => {
    switch (position) {
      case 'center':
        return { x: 0, scale: 1, opacity: 1, zIndex: 3, rotateY: 0 };
      case 'left':
        return { x: '-90%', scale: 0.8, opacity: 0.4, zIndex: 2, rotateY: 25 };
      case 'right':
        return { x: '90%', scale: 0.8, opacity: 0.4, zIndex: 2, rotateY: -25 };
      default:
        return { x: 0, scale: 0.6, opacity: 0, zIndex: 1, rotateY: 0 };
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden pt-24 pb-12 md:pt-32 md:pb-20">
      {/* Background animé */}
      <div className="absolute inset-0">
        {/* Gradients flottants */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 mt-12">
        {/* En-tête */}
        <SectionHeader
          badge={content.pageHeaders?.hero?.badge || 'Featured Destinations'}
          title={content.pageHeaders?.hero?.title || 'Your Next Adventure Awaits'}
          subtitle={content.pageHeaders?.hero?.subtitle || '3€ offerts immédiatement...'}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-0"
        >
         {/* Bouton CTA avec avatar */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigateToContact}
            className="inline-flex items-center gap-4 bg-[#443C34] dark:bg-gray-700 text-white pl-1 pr-8 py-1 rounded-full font-medium hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden border-2 border-white/20 shrink-0">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dera"
                alt="Dera"
                className="w-full h-full object-cover"
              />
            </div>
            <span className='text-lg sm:text-xl font-semibold'>Planifier un appel avec Nous</span>
          </motion.button>
        </motion.div>

        {/* Carousel interactif de destinations */}
        <div className="relative py-20">
          <div className="relative w-full max-w-5xl mx-auto h-[350px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              {slides.map((slide, index) => {
                const position = getCardPosition(index);
                const style = getCardStyle(position);

                if (position === 'hidden') return null;

                return (
                  <motion.div
                    key={slide.id}
                    custom={direction}
                    initial={{ x: direction > 0 ? '100%' : '-100%', scale: 0.6, opacity: 0 }}
                    animate={style}
                    exit={{ x: direction > 0 ? '-100%' : '100%', scale: 0.6, opacity: 0, zIndex: 0 }}
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className={`absolute w-full h-full rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform-gpu transition-all duration-300 ease-out
                                ${position === 'center' ? 'z-30' : 'z-20'}
                                ${position === 'left' ? 'hover:translate-x-[-95%] hover:scale-[0.82]' : ''}
                                ${position === 'right' ? 'hover:translate-x-[95%] hover:scale-[0.82]' : ''}
                                `}
                    style={{
                      transformOrigin: position === 'left' ? 'right center' : position === 'right' ? 'left center' : 'center center',
                    }}
                    onClick={() => setCurrentIndex(index)}
                  >
                    {/* Container d'image optimisé */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
                      {slide.image ? (
                        <>
                          {/* Image avec loading state amélioré */}
                          <motion.img
                            src={slide.image}
                            alt={slide.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ 
                              opacity: imageLoaded[slide.id] ? 1 : 0,
                              scale: imageLoaded[slide.id] ? 1 : 1.1
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            loading="lazy"
                            style={{
                              imageRendering: '-webkit-optimize-contrast',
                              backfaceVisibility: 'hidden',
                              transform: 'translateZ(0)',
                            }}
                          />
                          
                          {/* Skeleton loader pendant le chargement */}
                          {!imageLoaded[slide.id] && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
                              animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                              style={{
                                backgroundSize: '200% 100%',
                              }}
                            />
                          )}

                          {/* Overlay amélioré avec meilleur gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          
                          {/* Effet de brillance subtile sur hover (center card) */}
                          {position === 'center' && (
                            <motion.div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 50%)',
                              }}
                            />
                          )}
                        </>
                      ) : (
                        // Fallback si pas d'image
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <div className="text-center text-gray-500 dark:text-gray-400">
                            <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="font-medium">Aucune image</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contenu textuel avec meilleure lisibilité */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: position === 'center' ? 1 : 0.7, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow-lg">{slide.title}</h3>
                        <p className="text-base md:text-lg mb-4 drop-shadow-md max-w-2xl">{slide.subtitle}</p>
                        
                        {position === 'center' && (
                          <motion.div 
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <motion.button
                              onClick={onNavigateToTours}
                              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold text-base md:text-lg shadow-xl transition-colors"
                            >
                              {slide.cta} <ArrowRight size={20} />
                            </motion.button>
                            {slide.videoUrl && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors shadow-lg"
                              >
                                <Play size={22} fill="currentColor" />
                              </motion.button>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Navigation Buttons - Design amélioré */}
            <motion.button
              onClick={prevSlide}
              className="absolute left-2 md:-left-16 z-40 p-3 md:p-4 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-2xl hover:bg-white dark:hover:bg-gray-700 transition-all backdrop-blur-md border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="text-gray-800 dark:text-white" size={28} />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              className="absolute right-2 md:-right-16 z-40 p-3 md:p-4 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-2xl hover:bg-white dark:hover:bg-gray-700 transition-all backdrop-blur-md border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.1, x: 4 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="text-gray-800 dark:text-white" size={28} />
            </motion.button>

            {/* Dots Indicator - Design amélioré */}
            <div className="absolute -bottom-10 flex space-x-3 z-40">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`relative transition-all duration-300 ${
                    index === currentIndex 
                      ? 'w-10 h-3' 
                      : 'w-3 h-3'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary' 
                      : 'bg-gray-400 dark:bg-gray-600'
                  }`} />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour animation gradient */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}