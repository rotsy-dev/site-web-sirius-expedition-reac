import * as React from 'react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, MapPin, Calendar, Users, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
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
        return { x: 0, scale: 1, opacity: 1, zIndex: 3 };
      case 'left':
        return { x: '-85%', scale: 0.85, opacity: 0.5, zIndex: 2 };
      case 'right':
        return { x: '85%', scale: 0.85, opacity: 0.5, zIndex: 2 };
      default:
        return { x: 0, scale: 0.7, opacity: 0, zIndex: 1 };
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden pt-32 pb-20">
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-2 rounded-full border border-primary/20 mb-6"
          >
            <Star className="text-accent w-4 h-4 fill-accent" />
            <span className="text-sm font-semibold text-primary">Featured Destinations</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Your Next <span className="text-primary">Adventure</span> Awaits
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore curated experiences across Madagascar's most breathtaking locations
          </p>
        </motion.div>

        {/* Carousel de cartes */}
        <div className="relative h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {slides.map((slide, index) => {
              const position = getCardPosition(index);
              const style = getCardStyle(position);
              const isCenter = position === 'center';

              return (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={style}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.32, 0.72, 0, 1]
                  }}
                  className="absolute w-full max-w-2xl"
                  style={{ pointerEvents: isCenter ? 'auto' : 'none' }}
                >
                  <div className={`bg-card rounded-3xl overflow-hidden shadow-2xl border border-border/50 ${isCenter ? '' : 'cursor-pointer'}`}
                    onClick={() => !isCenter && setCurrentIndex(index)}
                  >
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden">
                      <motion.img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        animate={{ scale: isCenter ? 1 : 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                      {/* Badge premium */}
                      <div className="absolute top-6 right-6 flex items-center gap-2 bg-card/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-bold text-foreground">Premium</span>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-8">
                      <h3 className="text-3xl font-bold text-foreground mb-3">
                        {slide.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-lg">
                        {slide.subtitle}
                      </p>

                      {/* Info badges */}
                      <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Madagascar</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Year Round</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Guided Tours</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      {isCenter && (
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full group relative"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                          <div className="relative px-8 py-4 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center gap-2 text-primary-foreground font-bold text-lg shadow-xl">
                            {slide.cta}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation buttons */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-4 z-50 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-card backdrop-blur-xl border border-border p-4 rounded-full shadow-2xl group-hover:bg-card/90 transition-all duration-300">
                <ChevronLeft size={24} className="text-foreground" />
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-4 z-50 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-card backdrop-blur-xl border border-border p-4 rounded-full shadow-2xl group-hover:bg-card/90 transition-all duration-300">
                <ChevronRight size={24} className="text-foreground" />
              </div>
            </div>
          </motion.button>
        </div>

        {/* Indicateurs de slides */}
        <div className="flex justify-center gap-2 mt-12">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="relative"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-primary scale-125'
                : 'bg-muted hover:bg-muted-foreground/50'
                }`} />
              {index === currentIndex && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}