import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, easeOut, easeInOut } from 'framer-motion';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  videoUrl?: string;
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

export function HeroCarousel({ slides, onNavigateToTours }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});
  const [direction, setDirection] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, slides.length]);

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
  }, [slides, imageLoaded]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Animations différentes pour chaque slide
  const getTextAnimation = (index: number) => {
    const animations = [
      {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1, ease: easeOut }
      },
      {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 1.2, ease: easeOut }
      },
      {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, ease: easeOut }
      }
    ];
    return animations[index % animations.length];
  };

  const getBoxAnimation = (index: number) => {
    const animations = [
      {
        initial: { opacity: 0, y: 50, rotateX: -15 },
        animate: { opacity: 1, y: 0, rotateX: 0 },
        transition: { delay: 0.3, duration: 0.8, ease: easeOut }
      },
      {
        initial: { opacity: 0, scale: 0.9, rotate: -5 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
        transition: { delay: 0.4, duration: 1, ease: easeOut }
      },
      {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: 0.3, duration: 0.9, ease: easeOut }
      }
    ];
    return animations[index % animations.length];
  };

  const getButtonAnimation = (index: number) => {
    const animations = [
      {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.6, duration: 0.6, type: "spring" as const, bounce: 0.4 }
      },
      {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.7, duration: 0.8, type: "spring" as const, stiffness: 200 }
      },
      {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.6, duration: 0.7, ease: easeOut }
      }
    ];
    return animations[index % animations.length];
  };

  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-[#1a1410] via-[#2a1f1c] to-black overflow-hidden">
      {/* Particules animées subtiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: easeInOut
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-[#F0E7D5]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: easeInOut,
            delay: 2
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#2fb5a3]/10 rounded-full blur-3xl"
        />
      </div>

      {/* Carousel */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" custom={direction}>
          {slides.map((slide, index) => {
            if (index !== currentIndex) return null;

            const textAnim = getTextAnimation(index);
            const boxAnim = getBoxAnimation(index);
            const buttonAnim = getButtonAnimation(index);

            return (
              <motion.div
                key={slide.id}
                custom={direction}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Image de fond */}
                <div className="absolute inset-0">
                  {slide.image ? (
                    <>
                      {/* Image avec zoom Ken Burns */}
                      <motion.div
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 12, ease: "linear" }}
                        className="absolute inset-0"
                      >
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            imageLoaded[slide.id] ? 'opacity-100' : 'opacity-0'
                          }`}
                          loading="eager"
                          style={{
                            filter: 'brightness(0.92) contrast(1.12) saturate(1.15)',
                            WebkitFilter: 'brightness(0.92) contrast(1.12) saturate(1.15)',
                          }}
                        />
                      </motion.div>
                      
                      {/* Skeleton loader élégant */}
                      {!imageLoaded[slide.id] && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-[#4B3935] via-[#3a2f2b] to-[#2a1f1c]"
                          animate={{
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}

                      {/* Overlays artistiques */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                      
                      {/* Vignette douce */}
                      <div className="absolute inset-0" style={{
                        boxShadow: 'inset 0 0 120px rgba(0,0,0,0.4)'
                      }} />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#4B3935] to-[#2a1f1c]">
                      <p className="text-[#F0E7D5]/50 font-medium">Aucune image</p>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
                    <div className="max-w-2xl">
                     <motion.h2
                      {...textAnim}
                      className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.2] drop-shadow-2xl max-w-[90%]"
                    >
                      {slide.title}
                    </motion.h2>

                      <motion.div
                        {...boxAnim}
                        className="relative group"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#2fb5a3]/20 to-[#4B3935]/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
                        
                        <div className="relative bg-[#4B3935]/80 backdrop-blur-xl p-6 md:p-8 rounded-xl border border-[#F0E7D5]/15 shadow-2xl">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '60px' }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="absolute top-0 left-6 h-1 bg-gradient-to-r from-[#2fb5a3] to-transparent rounded-full"
                          />
                          
                          <p className="text-[#F0E7D5] text-base md:text-lg leading-relaxed">
                            {slide.subtitle}
                          </p>
                        </div>
                      </motion.div>

                      <motion.button
                        {...buttonAnim}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToTours?.();
                        }}
                        className="relative group mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#2fb5a3] to-[#26a393] rounded-lg font-semibold text-white shadow-2xl overflow-hidden"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                          animate={{
                            x: ['-200%', '200%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                        />
                        
                        <span className="relative uppercase text-sm tracking-wider">{slide.cta}</span>
                        
                        <motion.svg
                          className="relative w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation */}
        <motion.button
          onClick={prevSlide}
          whileHover={{ scale: 1.1, x: -4, backgroundColor: 'rgba(255,255,255,0.25)' }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-3.5 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300"
          aria-label="Slide précédente"
        >
          <ChevronLeft className="text-white w-7 h-7" strokeWidth={2.5} />
        </motion.button>
        
        <motion.button
          onClick={nextSlide}
          whileHover={{ scale: 1.1, x: 4, backgroundColor: 'rgba(255,255,255,0.25)' }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-3.5 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300"
          aria-label="Slide suivante"
        >
          <ChevronRight className="text-white w-7 h-7" strokeWidth={2.5} />
        </motion.button>

        {/* Indicateurs */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              className="relative group"
              aria-label={`Slide ${index + 1}`}
            >
              <motion.div
                className={`transition-all duration-500 rounded-full ${
                  index === currentIndex 
                    ? 'w-11 h-2.5 bg-gradient-to-r from-[#2fb5a3] via-[#F0E7D5] to-[#2fb5a3]' 
                    : 'w-2.5 h-2.5 bg-white/40 group-hover:bg-white/70'
                }`}
                animate={index === currentIndex ? {
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
            </motion.button>
          ))}
        </div>

        {/* Compteur stylisé */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 right-8 z-40"
        >
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl px-5 py-2.5 rounded-xl border border-white/20 shadow-xl">
            <span className="text-white font-semibold text-base tabular-nums">
              {String(currentIndex + 1).padStart(2, '0')} 
              <span className="text-[#2fb5a3] mx-1.5">/</span> 
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}