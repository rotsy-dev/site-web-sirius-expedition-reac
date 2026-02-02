// ============================================
// HERO CAROUSEL - Style Wilderness Mocha Premium  
// Version Améliorée avec Animations Avancées
// ============================================
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Transformations basées sur le scroll
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.7, 0]);
  const buttonY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const { translatedContent: translatedSlides } = useTranslatedContent(slides, ['title', 'subtitle', 'cta']);
  const displaySlides = (translatedSlides || slides) as Slide[];

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Auto-play timer
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

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
      } else if (e.key === 'ArrowRight') {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displaySlides.length]);

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % displaySlides.length;
    if (displaySlides[nextIndex]) {
      const img = new Image();
      img.src = displaySlides[nextIndex].image;
    }
  }, [currentIndex, displaySlides]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Animations différentes selon le slide
  const getTitleAnimation = (index: number) => {
    const animations = [
      // Slide 0: Glissement depuis la gauche avec blur
      {
        initial: { x: -100, opacity: 0, filter: 'blur(10px)' },
        animate: { x: 0, opacity: 1, filter: 'blur(0px)' },
        transition: { duration: 1.2, delay: 0.8, ease: "easeOut" }
      },
      // Slide 1: Zoom avec rotation subtile
      {
        initial: { scale: 0.8, opacity: 0, rotateX: -15 },
        animate: { scale: 1, opacity: 1, rotateX: 0 },
        transition: { duration: 1, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }
      },
      // Slide 2: Apparition lettre par lettre avec wave
      {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 1, delay: 0.8 }
      }
    ];
    return animations[index % 3];
  };

  const getSubtitleAnimation = (index: number) => {
    const animations = [
      // Slide 0: Fade in classique avec montée
      {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.9, delay: 1.1 }
      },
      // Slide 1: Apparition depuis la droite
      {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 1, delay: 1.1, ease: "easeOut" }
      },
      // Slide 2: Split reveal (ligne par ligne)
      {
        initial: { opacity: 0, scaleY: 0.5, y: 20 },
        animate: { opacity: 1, scaleY: 1, y: 0 },
        transition: { duration: 0.8, delay: 1.1, ease: "easeOut" }
      }
    ];
    return animations[index % 3];
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 1
    })
  };

  // Variations de gradient par slide
  const gradientVariations = [
    'from-[#3d2f2b]/90 via-[#3d2f2b]/50',
    'from-[#3d2f2b]/70 via-[#3d2f2b]/40',
    'from-[#3d2f2b]/80 via-[#3d2f2b]/60',
  ];

  const currentSlide = displaySlides[currentIndex];

  if (!currentSlide) return null;

  return (
    <section ref={sectionRef} className="relative w-full h-screen bg-[#3d2f2b] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 50, damping: 20 },
            opacity: { duration: 0.5 }
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            {/* Image avec parallaxe et scroll */}
            <motion.img
              src={currentSlide.image}
              alt={currentSlide.title}
              initial={{ scale: 1.1 }}
              animate={{
                scale: 1,
                x: mousePosition.x,
                y: mousePosition.y
              }}
              style={{
                scale: imageScale,
                filter: 'brightness(0.85) contrast(1.05)'
              }}
              transition={{
                scale: { duration: 7, ease: "linear" },
                x: { type: "spring", stiffness: 50, damping: 30 },
                y: { type: "spring", stiffness: 50, damping: 30 }
              }}
              onLoad={() => setImageLoaded(prev => ({ ...prev, [currentSlide.id]: true }))}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded[currentSlide.id] ? 'opacity-100' : 'opacity-0'
                }`}
              loading={currentIndex === 0 ? 'eager' : 'lazy'}
            />

            {/* Loading indicator */}
            {!imageLoaded[currentSlide.id] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#3d2f2b] flex items-center justify-center"
              >
                <motion.div
                  className="w-16 h-16 border-2 border-[#E5D8C0]/30 border-t-[#E5D8C0] rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}

            {/* Cinematic Gradient Overlays avec parallaxe scroll */}
            {/* 1. Base Darkening (Subtle) */}
            <motion.div
              className="absolute inset-0 bg-[#3d2f2b]/10 mix-blend-multiply"
              style={{ opacity: overlayOpacity }}
            />

            {/* 2. Text Protection Gradient (Bottom Up) - Variation dynamique */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-t ${gradientVariations[currentIndex % 3]} to-transparent opacity-90 transition-all duration-1000`}
              style={{ opacity: overlayOpacity }}
            />

            {/* 3. Side Vignette for Focus (Left to Right) */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#3d2f2b]/50 via-transparent to-transparent opacity-80"
              style={{ opacity: overlayOpacity }}
            />

            {/* 4. Top decoration (Subtle) */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-[#3d2f2b]/30 via-transparent to-transparent opacity-60"
              style={{ opacity: overlayOpacity }}
            />

            {/* 5. Lueur Subtile Animée (Edge Glow) */}
            <motion.div
              className="absolute inset-0 opacity-0 pointer-events-none"
              animate={{
                opacity: [0, 0.15, 0],
                background: [
                  'radial-gradient(circle at 20% 50%, #E5D8C0 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, #E5D8C0 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, #E5D8C0 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Particules Flottantes Subtiles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#E5D8C0]/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, -200],
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 8 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute inset-0 flex items-end pb-32 sm:pb-40 lg:pb-36 px-4 sm:px-6 lg:px-16">
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
                  className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-5"
                >
                  {/* Ligne Décorative avec Pulsation */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="h-[2px] w-12 sm:w-16 bg-gradient-to-r from-[#E5D8C0]/60 to-transparent origin-left relative"
                  >
                    <motion.div
                      className="absolute left-0 top-0 h-full w-2 bg-[#E5D8C0] blur-sm"
                      animate={{
                        x: [0, 48, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                    />
                  </motion.div>
                  <span className="text-[9px] sm:text-[10px] font-light text-[#E5D8C0]/80 uppercase tracking-[0.4em]">
                    {t('hero.featured')}
                  </span>
                </motion.div>

                {/* Titre avec animations variées selon le slide + scroll parallax */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="overflow-hidden mb-8 sm:mb-10 pb-2"
                  style={{
                    y: titleY,
                    opacity: titleOpacity
                  }}
                >
                  {currentIndex % 3 === 2 ? (
                    // Slide 2: Effet typing lettre par lettre avec wave
                    <motion.h1
                      initial={getTitleAnimation(currentIndex).initial as any}
                      animate={getTitleAnimation(currentIndex).animate as any}
                      transition={getTitleAnimation(currentIndex).transition as any}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-8xl font-extralight text-[#E5D8C0] leading-[1.1] sm:leading-[0.95] tracking-[-0.02em]"
                    >
                      {currentSlide.title.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.8 + (i * 0.05),
                            duration: 0.3,
                            ease: "easeOut"
                          }}
                          style={{ display: 'inline-block' }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </motion.h1>
                  ) : (
                    // Slides 0 et 1: Animations globales
                    <motion.h1
                      initial={getTitleAnimation(currentIndex).initial as any}
                      animate={getTitleAnimation(currentIndex).animate as any}
                      transition={getTitleAnimation(currentIndex).transition as any}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-8xl font-extralight text-[#E5D8C0] leading-[1.1] sm:leading-[0.95] tracking-[-0.02em]"
                    >
                      {currentSlide.title}
                    </motion.h1>
                  )}
                </motion.div>

                {/* Sous-titre avec animations variées + scroll parallax */}
                <motion.div
                  initial={getSubtitleAnimation(currentIndex).initial as any}
                  animate={getSubtitleAnimation(currentIndex).animate as any}
                  transition={getSubtitleAnimation(currentIndex).transition as any}
                  className="mb-8 sm:mb-12 max-w-3xl"
                  style={{
                    y: subtitleY,
                    opacity: subtitleOpacity
                  }}
                >
                  <p className="text-base sm:text-lg lg:text-2xl text-[#E5D8C0]/85 leading-relaxed font-light">
                    {currentSlide.subtitle}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.3 }}
                  className="flex flex-wrap gap-4 sm:gap-5"
                  style={{ y: buttonY }}
                >
                  {/* Bouton Principal avec Effet Shimmer */}
                  <motion.button
                    onClick={onNavigateToTours}
                    whileHover={{ scale: 1.03, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-8 sm:px-11 py-4 sm:py-5 bg-[#E5D8C0] text-[#3d2f2b] overflow-hidden cursor-pointer"
                  >
                    {/* Effet de brillance qui traverse */}
                    <motion.div
                      className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />

                    {/* Ondulation au hover */}
                    <motion.div
                      className="absolute inset-0 bg-[#3d2f2b]/0"
                      whileHover={{
                        backgroundColor: 'rgba(61, 47, 43, 0.1)',
                        scale: [1, 1.05, 1],
                        transition: { duration: 0.5 }
                      }}
                    />

                    <span className="relative z-10 flex items-center gap-3 text-[11px] sm:text-[13px] font-medium uppercase tracking-[0.25em]">
                      <span>{currentSlide.cta}</span>
                      <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        →
                      </motion.span>
                    </span>
                  </motion.button>

                  {/* Bouton Secondaire avec Bordure Visible et Effet Lueur */}
                  {onNavigateToContact && (
                    <motion.button
                      onClick={onNavigateToContact}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative px-8 sm:px-11 py-4 sm:py-5 border-2 border-[#E5D8C0]/70 overflow-hidden backdrop-blur-sm cursor-pointer"
                    >
                      {/* Effet de lueur animée qui court sur le contour */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #E5D8C0, transparent)',
                          backgroundSize: '200% 100%',
                        }}
                        animate={{
                          backgroundPosition: ['0% 0%', '200% 0%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />

                      {/* Fond au hover */}
                      <div className="absolute inset-0 bg-[#E5D8C0]/0 group-hover:bg-[#E5D8C0]/15 transition-all duration-500" />

                      <span className="relative z-10 text-[11px] sm:text-[13px] font-medium uppercase tracking-[0.25em] text-[#E5D8C0]">
                        {t('contact.title')}
                      </span>
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Desktop Navigation (Numbers + Lines) avec Preview */}
      <div className="hidden lg:block absolute z-40 bottom-36 right-16">
        <div className="flex flex-col items-end gap-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="flex items-baseline gap-2 text-[#E5D8C0]/80 font-light">
            <span className="text-3xl tabular-nums">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-sm opacity-60">/</span>
            <span className="text-sm opacity-60">{String(displaySlides.length).padStart(2, '0')}</span>
          </motion.div>

          <div className="flex flex-col gap-5">
            {displaySlides.map((slide, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredSlide(i)}
                onMouseLeave={() => setHoveredSlide(null)}
              >
                <div
                  className={`transition-all duration-500 ${i === currentIndex ? 'w-16 h-[3px] bg-[#E5D8C0]' : 'w-10 h-[2px] bg-[#E5D8C0]/25 hover:bg-[#E5D8C0]/60 hover:w-12'
                    }`}
                />

                {/* Tooltip avec titre du slide au hover */}
                <AnimatePresence>
                  {hoveredSlide === i && i !== currentIndex && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute right-20 top-1/2 -translate-y-1/2 bg-[#E5D8C0] text-[#3d2f2b] px-4 py-2 text-xs whitespace-nowrap font-light"
                    >
                      {slide.title}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Barre de progression */}
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

      {/* Mobile Navigation (Dots) avec effet de pulse */}
      <div className="lg:hidden absolute z-40 bottom-8 left-0 right-0 flex justify-center items-center gap-4">
        {displaySlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="group p-2 cursor-pointer relative"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`transition-all duration-500 rounded-full ${i === currentIndex
                  ? 'w-3 h-3 bg-[#E5D8C0] scale-110'
                  : 'w-2 h-2 bg-[#E5D8C0]/40 hover:bg-[#E5D8C0]/80'
                }`}
            >
              {i === currentIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#E5D8C0]/40"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Scroll indicator */}
      {isMounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="hidden lg:flex absolute bottom-10 left-16 flex-col items-start gap-5"
        >
          <span className="text-[#E5D8C0]/50 text-[9px] font-light uppercase tracking-[0.5em] -rotate-90">
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