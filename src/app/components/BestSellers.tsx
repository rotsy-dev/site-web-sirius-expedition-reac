"use client"

import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { ChevronLeft, ChevronRight, Loader2, MapPin, Clock } from 'lucide-react'
import * as React from "react"
import { AnimatePresence, motion } from 'framer-motion'
import { TourModal, getDetailedTour, ExtendedTourSpecialty } from './TourModal'
import ScrollReveal from 'scrollreveal'
import { useTranslatedContent } from '../../hooks/useTranslatedContent'
import { useTranslation } from 'react-i18next'

const { useRef, useState, useEffect } = React

interface BestSellersProps {
  tours: {
    id: number;
    image: string;
    title: string;
    location: string;
    duration: string;
    price?: number;
    description?: string;
  }[]
  onNavigateToTour?: (tour: any) => void
  content?: {
    pageHeaders?: {
      bestSellers?: {
        badge?: string
        title?: string
        subtitle?: string
      }
    }
  }
}

const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 4,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "0px",
  arrows: false,
  responsive: [
    {
      breakpoint: 1280,
      settings: { slidesToShow: 3 }
    },
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 }
    },
    {
      breakpoint: 640,
      settings: { slidesToShow: 1 }
    }
  ]
}

export function BestSellers({ tours, onNavigateToTour, content = {} }: BestSellersProps) {
  const { t } = useTranslation()
  const sliderRef = useRef<Slider>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [selectedTour, setSelectedTour] = useState<ExtendedTourSpecialty | null>(null)
  
  // Traduire automatiquement le contenu des tours
  const { translatedContent: translatedTours, isLoading: isTranslatingTours } = useTranslatedContent(
    tours,
    ['title', 'description', 'location', 'longDescription']
  )

  // Traduire automatiquement les headers de la section Best Sellers (badge, titre, sous-titre)
  const { translatedContent: translatedBestSellersHeader } = useTranslatedContent(
    content.pageHeaders?.bestSellers ?? null,
    ['badge', 'title', 'subtitle']
  )

  const header = (translatedBestSellersHeader as { badge?: string; title?: string; subtitle?: string } | null)
    || content.pageHeaders?.bestSellers
    || {}
  
  // Utiliser les tours traduits ou les tours originaux
  const displayTours = (translatedTours || tours) as typeof tours

  useEffect(() => {
    if (typeof ScrollReveal === 'undefined') return;
    
    let sr: any = null;
    let isMounted = true;

    try {
      sr = ScrollReveal({
        reset: false,
        distance: '60px',
        duration: 800,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
      });

      if (isMounted && sr) {
        sr.reveal('.section-header', { origin: 'top' })
        sr.reveal('.animate-card', { origin: 'bottom', interval: 200 })
      }
    } catch (error) {
      console.warn('ScrollReveal initialization error:', error);
    }

    return () => {
      isMounted = false;
      if (sr && typeof sr.destroy === 'function') {
        try {
          sr.destroy();
        } catch (error) {
          console.warn('ScrollReveal cleanup error:', error);
        }
      }
    };
  }, [])

  const handleOpenModal = (tour: any) => {
    if (onNavigateToTour) {
      onNavigateToTour(tour)
    } else {
      setSelectedTour(getDetailedTour(tour))
    }
  }

  const Card = ({ tour, index }: { tour: any, index: number }) => {
    const isHovered = hoveredCard === tour.id

    return (
      <div
        onMouseEnter={() => setHoveredCard(tour.id)}
        onMouseLeave={() => setHoveredCard(null)}
        className="animate-card h-full"
      >
        <div className={`
          relative bg-[#F5EFE6] rounded-[2.5rem] overflow-hidden h-full flex flex-col
          shadow-[0_10px_40px_rgba(75,57,53,0.15)]
          transition-shadow duration-300
          ${isHovered ? 'shadow-[0_20px_60px_rgba(75,57,53,0.25)]' : ''}
        `}>

          {/* Image sans effet parallaxe */}
          <div className="relative h-72 overflow-hidden">
            <ImageWithFallback
              src={tour.image || "/placeholder.svg"}
              alt={tour.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />

            {/* Overlay gradient safari */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#4B3935]/60 via-[#4B3935]/20 to-transparent" />

            {/* Motif décoratif safari */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <pattern id={`pattern-${tour.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#D4A574" opacity="0.3" />
                </pattern>
                <rect width="100%" height="100%" fill={`url(#pattern-${tour.id})`} />
              </svg>
            </div>

            {/* Prix badge en bas de l'image */}
            <div className="absolute bottom-6 right-6 bg-[#D4A574] text-[#4B3935] px-5 py-3 rounded-2xl shadow-2xl">
              <span className="text-xl font-black">
                {tour.price ? `${tour.price.toLocaleString()}€` : '1 299 €'}
              </span>
            </div>
          </div>

          {/* Contenu de la carte */}
          <div className="p-6 flex flex-col flex-1 relative">

            {/* Titre stylé avec effet */}
            <h3 className="text-2xl font-black text-[#4B3935] mb-3 line-clamp-2 min-h-[3.5rem] leading-tight">
              <span className="bg-gradient-to-r from-[#4B3935] to-[#6B5955] bg-clip-text text-transparent">
                {tour.title}
              </span>
            </h3>

            {/* Description avec style safari */}
            <p className="text-[#4B3935]/70 mb-6 text-sm leading-relaxed line-clamp-3 min-h-[4rem] font-light">
              {tour.description || 'Explore the iconic Avenue of the Baobabs and the unique Tsingy formations'}
            </p>

            {/* Infos avec icônes safari */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-[#4B3935]">
                <div className="w-9 h-9 rounded-full bg-[#D4A574]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-[#D4A574]" />
                </div>
                <span className="line-clamp-1 text-sm font-semibold">{tour.location}</span>
              </div>
              <div className="flex items-center gap-3 text-[#4B3935]">
                <div className="w-9 h-9 rounded-full bg-[#D4A574]/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-[#D4A574]" />
                </div>
                <span className="line-clamp-1 text-sm font-semibold">{tour.duration}</span>
              </div>
            </div>

            {/* Séparateur décoratif */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#4B3935]/20 to-transparent mb-6" />

            {/* Bouton CTA avec style safari premium */}
            <button
              onClick={() => handleOpenModal(tour)}
              className={`
                mt-auto py-4 px-6 rounded-2xl font-bold text-center transition-all duration-300
                ${isHovered
                  ? "bg-[#D4A574] text-[#4B3935] shadow-xl"
                  : "bg-[#4B3935] text-[#F0E7D5]"
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                {t('common.learnMore')}
                <span>→</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-b from-[#F0E7D5] via-[#EDE3CF] to-[#EADEC9]">
        {/* Motif décoratif d'arrière-plan */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#4B3935]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header stylé Safari */}
          <div
            className="section-header text-center mb-20 pt-16"
          >
            {/* Badge avec style safari */}
            <div className="inline-block mb-6">
              <span className="bg-[#4B3935] text-[#D4A574] px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-xl">
                {header.badge || t('sections.bestSellers')}
              </span>
            </div>

            {/* Titre avec effet gradient */}
            <h2 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-[#4B3935] via-[#6B5955] to-[#4B3935] bg-clip-text text-transparent">
                {header.title || t('sections.bestSellers')}
              </span>
            </h2>

            {/* Sous-titre avec style */}
            <p className="text-lg lg:text-xl text-[#4B3935]/70 max-w-3xl mx-auto font-light leading-relaxed">
              {header.subtitle || t('sections.bestSellersSubtitle')}
            </p>

            {/* Ligne décorative */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent to-[#D4A574] rounded-full" />
              <div className="w-3 h-3 rounded-full bg-[#D4A574]" />
              <div className="w-16 h-1 bg-gradient-to-l from-transparent to-[#D4A574] rounded-full" />
            </div>
          </div>

          {/* Indicateur de chargement */}
          {isTranslatingTours && (
            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-[#4B3935]/60">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          )}

          {/* MOBILE / TABLET - Grid */}
          <div className="grid gap-8 lg:hidden">
            {displayTours.slice(0, 4).map((tour, index) => (
              <Card key={tour.id} tour={tour} index={index} />
            ))}
          </div>

          {/* DESKTOP - Slider avec 4 cartes décalées */}
          <div className="hidden lg:block">
            <Slider ref={sliderRef} {...settings} className="best-sellers-slider">
              {displayTours.slice(0, 4).map((tour, index) => (
                <div key={tour.id} className="px-4 pb-8">
                  {/* Décalage alternant */}
                  <div className={index % 2 === 0 ? 'mt-0' : 'mt-12'}>
                    <Card tour={tour} index={index} />
                  </div>
                </div>
              ))}
            </Slider>

            {/* Navigation stylée Safari */}
            <div className="flex justify-center items-center gap-6 mt-16">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="w-16 h-16 border-3 border-[#4B3935] rounded-full text-[#4B3935] hover:bg-[#4B3935] hover:text-[#F0E7D5] transition-all duration-300 shadow-xl flex items-center justify-center bg-[#F0E7D5]"
              >
                <ChevronLeft size={28} strokeWidth={2.5} />
              </button>

              {/* Dots décoratifs */}
              <div className="flex gap-3">
                {[...Array(Math.min(4, displayTours.length))].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#4B3935]/20"
                  />
                ))}
              </div>

              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="w-16 h-16 border-3 border-[#4B3935] rounded-full text-[#4B3935] hover:bg-[#4B3935] hover:text-[#F0E7D5] transition-all duration-300 shadow-xl flex items-center justify-center bg-[#F0E7D5]"
              >
                <ChevronRight size={28} strokeWidth={2.5} />
              </button>
            </div>
          </div>

        </div>
      </section>

      <AnimatePresence>
        {selectedTour && (
          <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
        )}
      </AnimatePresence>

      <style>{`
        .best-sellers-slider .slick-list {
          overflow: visible !important;
        }
        .best-sellers-slider .slick-track {
          display: flex !important;
        }
        .best-sellers-slider .slick-slide {
          height: inherit !important;
        }
        .best-sellers-slider .slick-slide > div {
          height: 100%;
        }
        .best-sellers-slider .slick-dots {
          display: none !important;
        }
      `}</style>
    </>
  )
}