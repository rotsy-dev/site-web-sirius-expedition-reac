"use client"

import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import * as React from "react"
import { AnimatePresence } from 'framer-motion'
import { TourModal, getDetailedTour, ExtendedTourSpecialty } from './TourModal'
import { SectionHeader } from '@/components/common/SectionHeader'
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
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "0px",
  arrows: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 }
    }
  ]
}

export function BestSellers({ tours, onNavigateToTour, content = {} }: BestSellersProps) {
  const { t } = useTranslation()
  const sliderRef = useRef<Slider>(null)
  const [hoveredButton, setHoveredButton] = useState<number | null>(null)
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
    if (typeof ScrollReveal !== 'undefined') {
      const sr = ScrollReveal({
        reset: false,
        distance: '60px',
        duration: 800,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
      })

      sr.reveal('.section-header', { origin: 'top' })
      sr.reveal('.animate-card', { origin: 'bottom', interval: 200 })
    }
  }, [])

  const handleOpenModal = (tour: any) => {
    if (onNavigateToTour) {
      onNavigateToTour(tour)
    } else {
      setSelectedTour(getDetailedTour(tour))
    }
  }

  const Card = ({ tour }: { tour: any }) => {
    const isHovered = hoveredButton === tour.id

    return (
      <div className="bg-[#F0E7D5] rounded-[32px] overflow-hidden border border-[#4B3935]/10 flex flex-col h-full animate-card shadow-sm">
        {/* Image avec Overlay léger */}
        <div className="relative h-64 overflow-hidden rounded-t-[32px]">
          <ImageWithFallback
            src={tour.image || "/placeholder.svg"}
            alt={tour.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4B3935]/20 to-transparent" />
        </div>

        <div className="p-8 flex flex-col flex-1">
          {/* Titre avec hauteur fixe - 2 lignes max */}
          <h3 className="text-2xl font-bold text-[#4B3935] mb-2 line-clamp-2 min-h-[3.5rem]">
            {tour.title}
          </h3>

          {/* Description avec hauteur fixe - 3 lignes max */}
          <p className="text-[#4B3935]/70 mb-6 text-sm leading-relaxed line-clamp-3 min-h-[4rem]">
            {tour.description || 'Explore the iconic Avenue of the Baobabs and the unique Tsingy formations'}
          </p>

          {/* Prix dynamique */}
          <div className="text-2xl font-bold text-[#4B3935] mb-6">
            {tour.price ? `${tour.price.toLocaleString()}` : '1 299 €'}
          </div>

          {/* Location & Duration avec points Mocha */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 font-semibold text-[#4B3935]">
              <div className="w-2 h-2 rounded-full bg-[#2fb5a3]" />
              <span className="line-clamp-1">{tour.location}</span>
            </div>
            <div className="flex items-center gap-3 font-semibold text-[#4B3935]">
              <div className="w-2 h-2 rounded-full bg-[#2fb5a3]" />
              <span className="line-clamp-1">{tour.duration}</span>
            </div>
          </div>

          {/* Bouton style Mocha / Vanilla */}
          <button
            onMouseEnter={() => setHoveredButton(tour.id)}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => handleOpenModal(tour)}
            className={`
              cursor-pointer mt-auto py-4 px-6 rounded-2xl font-bold text-center transition-all duration-300
              ${isHovered
                ? "bg-[#2fb5a3] text-white shadow-lg"
                : "bg-[#4B3935] text-[#F0E7D5]"
              }
            `}
          >
            {t('common.learnMore')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Background de la section en Vanilla clair pour faire ressortir les cartes */}
      <section className="py-24 px-4 bg-[#F0E7D5]/30">
        <div className="max-w-7xl mx-auto">

          <div className="section-header mb-12">
            <SectionHeader
              badge={header.badge || t('sections.bestSellers')}
              title={header.title || t('sections.bestSellers')}
              subtitle={header.subtitle || t('sections.bestSellersSubtitle')}
            />
          </div>
          
          {/* Indicateur de chargement de traduction */}
          {isTranslatingTours && (
            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          )}

          {/* MOBILE / TABLET */}
          <div className="grid gap-8 lg:hidden">
            {displayTours.map(tour => (
              <Card key={tour.id} tour={tour} />
            ))}
          </div>

          {/* DESKTOP → SLIDER */}
          <div className="hidden lg:block">
            <Slider ref={sliderRef} {...settings} className="best-sellers-slider">
              {displayTours.map(tour => (
                <div key={tour.id} className="px-4 py-4 h-full">
                  <Card tour={tour} />
                </div>
              ))}
            </Slider>

            {/* Navigation Arrows avec couleurs Mocha */}
            <div className="flex justify-center lg:justify-end mt-12 gap-4">
              <button 
                onClick={() => sliderRef.current?.slickPrev()} 
                className="p-4 border-2 border-[#4B3935]/20 rounded-full text-[#4B3935] hover:bg-[#4B3935] hover:text-[#F0E7D5] transition-all duration-300"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => sliderRef.current?.slickNext()} 
                className="p-4 border-2 border-[#4B3935]/20 rounded-full text-[#4B3935] hover:bg-[#4B3935] hover:text-[#F0E7D5] transition-all duration-300"
              >
                <ChevronRight size={24} />
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
    </>
  )
}