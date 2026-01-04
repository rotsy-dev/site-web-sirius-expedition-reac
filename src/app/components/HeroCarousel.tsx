import * as React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, easeOut, easeInOut } from "framer-motion";

// 👉 Assure-toi que ce composant existe
import { SectionHeader } from "@/app/components/SectionHeader";

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

export function HeroCarousel({
  slides,
  onNavigateToTours,
  onNavigateToContact,
  content,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  /* ================= AUTO PLAY ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  /* ================= IMAGE PRELOAD ================= */
  useEffect(() => {
    slides.forEach((slide) => {
      if (!imageLoaded[slide.id]) {
        const img = new Image();
        img.onload = () =>
          setImageLoaded((prev) => ({ ...prev, [slide.id]: true }));
        img.src = slide.image;
      }
    });
  }, [slides, imageLoaded]);

  /* ================= NAVIGATION ================= */
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  /* ================= ANIMATIONS ================= */
  const getTextAnimation = (index: number) => {
    const animations = [
      {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1, ease: easeOut },
      },
      {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 1.2, ease: easeOut },
      },
      {
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1, ease: easeOut },
      },
    ];
    return animations[index % animations.length];
  };

  const getBoxAnimation = (index: number) => {
    const animations = [
      {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3, duration: 0.8, ease: easeOut },
      },
      {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.4, duration: 1, ease: easeOut },
      },
      {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: 0.3, duration: 0.9, ease: easeOut },
      },
    ];
    return animations[index % animations.length];
  };

  const getButtonAnimation = (index: number) => {
    const animations = [
      {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: {
          delay: 0.6,
          duration: 0.6,
          type: "spring" as const,
          bounce: 0.4,
        },
      },
      {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1 },
        transition: {
          delay: 0.7,
          duration: 0.8,
          type: "spring" as const,
        },
      },
      {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.6, duration: 0.7, ease: easeOut },
      },
    ];
    return animations[index % animations.length];
  };

  /* ================= RENDER ================= */
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* ===== Header + CTA ===== */}
      <div className="absolute top-0 left-0 right-0 z-30 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <SectionHeader
            badge={
              content?.pageHeaders?.hero?.badge ||
              "Featured Destinations"
            }
            title={
              content?.pageHeaders?.hero?.title ||
              "Your Next Adventure Awaits"
            }
            subtitle={
              content?.pageHeaders?.hero?.subtitle ||
              "3€ offerts immédiatement..."
            }
          />

          <motion.button
            onClick={onNavigateToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 inline-flex items-center gap-4 bg-mocha text-white px-8 py-2 rounded-full font-semibold"
          >
            Planifier un appel avec nous
          </motion.button>
        </div>
      </div>

      {/* ===== Carousel ===== */}
      <AnimatePresence mode="wait" custom={direction}>
        {slides.map((slide, index) => {
          if (index !== currentIndex) return null;

          const textAnim = getTextAnimation(index);
          const boxAnim = getBoxAnimation(index);
          const buttonAnim = getButtonAnimation(index);

          return (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6">
                  <motion.h2
                    {...textAnim}
                    className="text-4xl md:text-5xl font-bold text-white mb-6"
                  >
                    {slide.title}
                  </motion.h2>

                  <motion.div
                    {...boxAnim}
                    className="bg-white/10 backdrop-blur-xl p-6 rounded-xl mb-6 max-w-xl"
                  >
                    <p className="text-white">{slide.subtitle}</p>
                  </motion.div>

                  <motion.button
                    {...buttonAnim}
                    onClick={onNavigateToTours}
                    className="px-8 py-3 bg-emerald-500 text-white rounded-lg font-semibold"
                  >
                    {slide.cta}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* ===== Navigation ===== */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 z-40 text-white"
