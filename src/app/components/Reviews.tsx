"use client"
import * as React from 'react';
import { useRef, useState, useCallback } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle, Verified, Loader2 } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import { useTranslation } from 'react-i18next';

interface Review {
  id: number;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  tour: string;
  verified?: boolean;
}

interface ReviewsProps {
  reviews: Review[];
  config: any;
  content?: { pageHeaders?: { reviews?: { badge?: string; title?: string; subtitle?: string; }; }; };
}

// Composant étoile avec animation améliorée
function AnimatedStar({ index, rating, delay }: { index: number, rating: number, delay: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        delay,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      whileHover={{ scale: 1.2, rotate: 15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Star
        size={20}
        fill={index < rating ? "#A68966" : "none"}
        className={index < rating ? "text-[#A68966]" : "text-[#4B3935]/10"}
        strokeWidth={isHovered ? 2.5 : 2}
      />
    </motion.div>
  );
}

// Carte de review avec effet 3D amélioré
function ReviewCard({ review, index }: { review: Review, index: number }) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000
      }}
      className="relative px-4 py-10 h-full"
    >
      <div
        className="relative rounded-[3.5rem] overflow-hidden h-full flex flex-col transition-all duration-700 shadow-[0_20px_50px_rgba(61,47,43,0.1)] hover:shadow-[0_50px_100px_rgba(61,47,43,0.3)] border-t-2 border-l-2 border-white/50 bg-[#F0E7D5]"
      >
        {/* Effet de brillance animé au survol */}
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          animate={isHovered ? {
            opacity: [0, 0.3, 0],
            background: [
              'radial-gradient(circle at 0% 0%, rgba(166,137,102,0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(166,137,102,0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(166,137,102,0.2) 0%, transparent 50%)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Bordure interne décorative avec animation */}
        <motion.div
          className="absolute inset-4 rounded-[2.5rem] border pointer-events-none z-0"
          animate={{
            borderColor: isHovered ? 'rgba(166,137,102,0.15)' : 'rgba(75,57,53,0.05)'
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Quote décoratif avec parallaxe */}
        <motion.div
          style={{
            translateZ: isHovered ? 80 : 50,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
          className="absolute top-10 right-10 text-[#4B3935]/5"
        >
          <Quote size={100} fill="currentColor" />
        </motion.div>

        {/* Badge vérifié si applicable */}
        <AnimatePresence>
          {review.verified && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              // On remplace left-8 par right-4 (mobile) et right-8 (desktop)
              className="absolute top-4 right-4 md:top-8 md:right-8 z-20"
              style={{ translateZ: 70 }}
            >
              <div className="bg-[#A68966] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 shadow-xl">
                <Verified size={14} className="md:w-4 md:h-4" fill="white" />
                <span className="text-[10px] md:text-xs font-bold whitespace-nowrap">
                  {t('common.verify')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenu principal */}
        <div className="p-6 md:p-12 pb-4 md:pb-6 flex-1 relative z-10 bg-[#F0E7D5]" style={{ transform: "translateZ(30px)" }}>
          <div className="flex gap-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <AnimatedStar
                key={i}
                index={i}
                rating={review.rating}
                delay={0.5 + (i * 0.08)}
              />
            ))}
          </div>

          <motion.p
            className="text-[#4B3935] text-lg md:text-1xl leading-relaxed font-serif italic mb-6 md:mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            "{review.text}"
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="inline-flex items-center gap-2 md:gap-3 bg-white/50 backdrop-blur-md border border-[#4B3935]/10 px-4 md:px-6 py-2 md:py-3 rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#4B3935] shadow-lg"
          >
            <CheckCircle size={16} className="text-[#A68966]" />
            {review.tour}
          </motion.div>
        </div>

        {/* Section profil avec effet de survol amélioré */}
        <div className="p-6 md:p-12 pt-8 md:pt-14 relative z-10 bg-[#4B3935]" style={{ transform: "translateZ(60px)" }}>
          <div className="flex items-center gap-4 md:gap-6">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 bg-[#A68966] rounded-full blur-xl opacity-20"
                animate={isHovered ? { scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <img
                src={review.avatar}
                alt={review.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 md:border-[6px] border-[#F0E7D5]/20 shadow-2xl object-cover relative z-10"
                loading="lazy"
              />
            </motion.div>

            <div className="flex flex-col">
              <h4 className="text-[#F0E7D5] font-black text-lg md:text-xl tracking-tight mb-1">
                {review.name}
              </h4>
              <div className="flex items-center gap-2 md:gap-3 text-[#A68966] text-xs md:text-sm font-bold">
                <span className="flex items-center gap-1.5">🌍 {review.country}</span>
                <span className="w-1.5 h-1.5 bg-[#A68966]/30 rounded-full" />
                <span className="text-[#F0E7D5]/40 font-medium">{review.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Composant de statistiques - ✅ CORRECTION ICI
function ReviewStats({ reviews }: { reviews: Review[] }) {
  const { t } = useTranslation(); // ← Ajout de cette ligne

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const total = reviews.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex justify-center gap-12 mb-16"
    >
      <div className="text-center">
        <motion.div
          className="text-5xl font-black text-[#4B3935] mb-2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          {avgRating.toFixed(1)}
        </motion.div>
        <div className="flex gap-1 justify-center mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="#A68966" className="text-[#A68966]" />
          ))}
        </div>
        <div className="text-sm text-[#4B3935]/60 font-medium">{t('about.averageRating')}</div>
      </div>

      <div className="w-px bg-[#4B3935]/10" />

      <div className="text-center">
        <motion.div
          className="text-5xl font-black text-[#4B3935] mb-2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          {total}+
        </motion.div>
        <div className="text-sm text-[#4B3935]/60 font-medium"> {t('sections.reviews')}</div>
      </div>
    </motion.div>
  );
}

export function Reviews({ reviews, config, content = {} }: ReviewsProps) {
  const { t } = useTranslation();
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Traduire automatiquement les reviews
  const { translatedContent: translatedReviews, isLoading: isTranslatingReviews } = useTranslatedContent(
    reviews,
    ['text', 'tour']
  );

  // Traduire automatiquement les headers de la section
  const { translatedContent: translatedReviewsHeader } = useTranslatedContent(
    content?.pageHeaders?.reviews ?? null,
    ['badge', 'title', 'subtitle']
  );

  const displayReviews = (translatedReviews || reviews) as Review[];
  const header = (translatedReviewsHeader as { badge?: string; title?: string; subtitle?: string } | null)
    || content?.pageHeaders?.reviews
    || {};

  const settings = {
    dots: true,
    infinite: true,
    speed: 1200,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
    cssEase: 'cubic-bezier(0.16, 1, 0.3, 1)',
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden bg-[#FFFEFC]">
      {/* Effet de fond décoratif */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#A68966]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3D2F2B]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-gradient-to-r from-[#A68966] to-[#4B3935] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em]">
              {header.badge || t('sections.reviews')}
            </span>
          </motion.div>
          <h2 className="text-6xl font-black text-[#4B3935] mb-6 tracking-tight">
            {header.title || t('sections.reviews')}
          </h2>
          <p className="text-xl text-[#4B3935]/60 max-w-2xl mx-auto font-medium">
            {header.subtitle || t('sections.reviewsSubtitle')}
          </p>
        </motion.div>

        {/* Statistiques */}
        <ReviewStats reviews={displayReviews} />

        {/* Carousel */}
        <div className="mt-20">
          {/* Desktop/Tablet Slider */}
          <div className="hidden md:block">
            <Slider ref={sliderRef} {...settings} className="reviews-slider overflow-visible">
              {displayReviews.map((review, idx) => (
                <ReviewCard key={review.id} review={review} index={idx} />
              ))}
            </Slider>

            {/* Navigation améliorée avec indicateur de progression */}
            <div className="flex justify-center items-center gap-8 mt-20">
              <motion.button
                whileHover={{ x: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sliderRef.current?.slickPrev()}
                className="flex items-center gap-4 text-[#4B3935] font-black text-[11px] tracking-[0.4em] group"
                aria-label="Avis précédent"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#4B3935]/10 flex items-center justify-center group-hover:bg-[#4B3935] group-hover:text-[#F0E7D5] group-hover:border-[#4B3935] transition-all duration-300 shadow-xl bg-white">
                  <ChevronLeft size={24} />
                </div>
                <span className="hidden sm:inline">PREV</span>
              </motion.button>

              <div className="flex flex-col items-center gap-3">
                <div className="h-[3px] w-32 bg-[#4B3935]/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#A68966] to-[#4B3935]"
                    animate={{ width: `${((currentSlide % reviews.length) / reviews.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-[#4B3935]/40 text-xs font-bold">
                  {(currentSlide % reviews.length) + 1} / {reviews.length}
                </span>
              </div>

              <motion.button
                whileHover={{ x: 5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sliderRef.current?.slickNext()}
                className="flex items-center gap-4 text-[#4B3935] font-black text-[11px] tracking-[0.4em] group"
                aria-label="Avis suivant"
              >
                <span className="hidden sm:inline">NEXT</span>
                <div className="w-16 h-16 rounded-full border-2 border-[#4B3935]/10 flex items-center justify-center group-hover:bg-[#4B3935] group-hover:text-[#F0E7D5] group-hover:border-[#4B3935] transition-all duration-300 shadow-xl bg-white">
                  <ChevronRight size={24} />
                </div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Vertical Stack */}
          <div className="md:hidden flex flex-col gap-8">
            {displayReviews.map((review, idx) => (
              <div key={review.id} className="h-full">
                <ReviewCard review={review} index={idx} />
              </div>
            ))}
          </div>
          
          {/* Indicateur de chargement de traduction */}
          {isTranslatingReviews && (
            <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .reviews-slider .slick-list { overflow: visible !important; }
        .reviews-slider .slick-track { display: flex !important; align-items: stretch !important; }
        .reviews-slider .slick-slide { height: inherit !important; }
        .reviews-slider .slick-slide > div { height: 100%; }
        .reviews-slider .slick-dots { bottom: -70px; }
        .reviews-slider .slick-dots li { margin: 0 8px; }
        .reviews-slider .slick-dots li button:before { 
          color: #4B3935; 
          opacity: 0.15; 
          font-size: 10px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reviews-slider .slick-dots li.slick-active button:before { 
          color: #A68966; 
          opacity: 1; 
          transform: scale(1.8);
        }
        .reviews-slider .slick-dots li:hover button:before {
          opacity: 0.5;
          transform: scale(1.3);
        }
      `}</style>
    </section>
  );
}