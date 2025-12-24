import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, MapPin, Calendar, Users, Star, Sparkles, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

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
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

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
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden pt-32 pb-20">
      {/* Background animé */}
      <div className="absolute inset-0">
        {/* Grille subtile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
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

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* En-tête premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge animé */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.3, 
              type: "spring", 
              stiffness: 200,
              damping: 15
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-8 py-3 rounded-full border border-primary/30 mb-8 backdrop-blur-xl shadow-lg relative overflow-hidden group"
          >
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            <Sparkles className="text-accent w-5 h-5 fill-accent animate-pulse" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Featured Destinations</span>
            <Star className="text-accent w-5 h-5 fill-accent animate-pulse" />
          </motion.div>

          {/* Titre principal */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Your Next{' '}
            </span>
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent inline-block"
            >
              Adventure
            </motion.span>
            <br />
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Awaits
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Explore curated experiences across Madagascar's most{' '}
            <span className="text-primary font-semibold">breathtaking</span> locations
          </p>
        </motion.div>

        {/* Carousel de cartes avec perspective 3D */}
        <div className="relative h-[650px] flex items-center justify-center perspective-[2000px]">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            {slides.map((slide, index) => {
              const position = getCardPosition(index);
              const style = getCardStyle(position);
              const isCenter = position === 'center';

              return (
                <motion.div
                  key={slide.id}
                  custom={direction}
                  initial={{ opacity: 0, scale: 0.8, rotateY: direction > 0 ? 45 : -45 }}
                  animate={style}
                  exit={{ opacity: 0, scale: 0.8, rotateY: direction > 0 ? -45 : 45 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.32, 0.72, 0, 1],
                    rotateY: { duration: 0.8 }
                  }}
                  className="absolute w-full max-w-3xl"
                  style={{ 
                    pointerEvents: isCenter ? 'auto' : 'none',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <motion.div 
                    className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-800/50 ${isCenter ? 'hover:shadow-primary/20' : 'cursor-pointer'} transition-all duration-500`}
                    onClick={() => !isCenter && setCurrentIndex(index)}
                    whileHover={isCenter ? { y: -8 } : {}}
                  >
                    {/* Image avec overlay gradient */}
                    <div className="relative h-96 overflow-hidden">
                      <motion.div
                        animate={{ scale: isCenter ? 1 : 1.15 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full"
                      >
                        <ImageWithFallback
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      {/* Overlay gradient sophistiqué */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      
                      {/* Effet de lumière */}
                      {isCenter && (
                        <motion.div
                          animate={{
                            opacity: [0, 0.3, 0],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                          className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-accent/40"
                        />
                      )}

                      {/* Badges flottants */}
                      <div className="absolute top-6 left-6 flex gap-2">
                        <motion.div
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50"
                        >
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-bold text-gray-900 dark:text-white">Premium</span>
                        </motion.div>

                        {isCenter && (
                          <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 group"
                          >
                            <Play className="w-4 h-4 text-primary fill-primary group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">Watch Tour</span>
                          </motion.button>
                        )}
                      </div>

                      {/* Titre en superposition */}
                      {isCenter && (
                        <motion.div
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute bottom-8 left-8 right-8"
                        >
                          <h3 className="text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-2xl">
                            {slide.title}
                          </h3>
                        </motion.div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="p-8">
                      <motion.p 
                        className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isCenter ? 1 : 0.5 }}
                      >
                        {slide.subtitle}
                      </motion.p>

                      {/* Info badges modernisés */}
                      <div className="flex flex-wrap gap-3 mb-8">
                        {[
                          { icon: MapPin, text: 'Madagascar', color: 'from-blue-500 to-cyan-500' },
                          { icon: Calendar, text: 'Year Round', color: 'from-purple-500 to-pink-500' },
                          { icon: Users, text: 'Guided Tours', color: 'from-orange-500 to-red-500' }
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: isCenter ? 1 : 0.9, rotate: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative group"
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                            <div className="relative flex items-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                              <item.icon className={`w-4 h-4 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} />
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{item.text}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA Button Premium */}
                      {isCenter && (
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          whileHover={{ scale: 1.02, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full group relative overflow-hidden"
                        >
                          {/* Glow effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] rounded-[1.75rem] blur-lg opacity-60 group-hover:opacity-100 transition-all duration-500 animate-gradient" />
                          
                          {/* Button content */}
                          <div className="relative px-8 py-5 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] rounded-3xl flex items-center justify-center gap-3 text-white font-bold text-xl shadow-2xl overflow-hidden animate-gradient">
                            {/* Shine effect */}
                            <motion.div
                              animate={{
                                x: ['-100%', '200%'],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                              }}
                              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                            />
                            
                            <span className="relative z-10">{slide.cta}</span>
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="relative z-10"
                            >
                              <ArrowRight className="w-6 h-6" />
                            </motion.div>
                          </div>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation buttons élégants */}
          {[
            { onClick: prevSlide, icon: ChevronLeft, position: 'left-8', label: 'Précédent' },
            { onClick: nextSlide, icon: ChevronRight, position: 'right-8', label: 'Suivant' }
          ].map((btn, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.15, x: idx === 0 ? -8 : 8 }}
              whileTap={{ scale: 0.9 }}
              onClick={btn.onClick}
              className={`absolute ${btn.position} z-50 group`}
              aria-label={btn.label}
            >
              <div className="relative">
                {/* Glow animé */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl"
                />
                
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-800/50 p-5 rounded-full shadow-2xl group-hover:shadow-primary/30 transition-all duration-300">
                  <btn.icon size={28} className="text-gray-900 dark:text-white" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Indicateurs premium avec barre de progression */}
        <div className="flex justify-center items-center gap-3 mt-16">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative group"
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Aller au slide ${index + 1}`}
            >
              {/* Glow pour l'indicateur actif */}
              {index === currentIndex && (
                <motion.div
                  layoutId="indicatorGlow"
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className={`relative w-12 h-3 rounded-full transition-all duration-500 overflow-hidden ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30'
                  : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
              }`}>
                {/* Barre de progression pour slide actif */}
                {index === currentIndex && (
                  <motion.div
                    key={currentIndex}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-full bg-white/30"
                  />
                )}
              </div>

              {/* Border animé */}
              {index === currentIndex && (
                <motion.div
                  layoutId="activeIndicatorBorder"
                  className="absolute -inset-1 rounded-full border-2 border-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
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