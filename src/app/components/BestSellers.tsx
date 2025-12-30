"use client"

import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { ImageWithFallback } from '../../components/common/ImageWithFallback'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from "react"
import { AnimatePresence } from 'framer-motion'
import { TourModal, getDetailedTour, ExtendedTourSpecialty } from './TourModal'
import { SectionHeader } from '@/components/common/SectionHeader'
import ScrollReveal from 'scrollreveal'

const { useRef, useState, useEffect } = React

interface BestSellersProps {
  tours: { id: number; image: string; title: string; location: string; duration: string }[]
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
  responsive: []
}

export function BestSellers({ tours, onNavigateToTour, content = {} }: BestSellersProps) {
  const sliderRef = useRef<Slider>(null)
  const [hoveredButton, setHoveredButton] = useState<number | null>(null)
  const [selectedTour, setSelectedTour] = useState<ExtendedTourSpecialty | null>(null)

  useEffect(() => {
    if (typeof ScrollReveal !== 'undefined') {
      const sr = ScrollReveal({
        reset: false,
        distance: '60px',
        duration: 800,
        delay: 0,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        mobile: true
      })

      // Section Header Animation
      sr.reveal('.section-header', {
        origin: 'top',
        distance: '40px',
        interval: 100
      })

      // Cards Content Animation
      sr.reveal('.animate-card', {
        origin: 'bottom',
        distance: '60px',
        interval: 200,
        delay: 200
      })
    }
  }, [])

  const handleOpenModal = (tour: any) => {
    if (onNavigateToTour) {
      onNavigateToTour(tour)
      return
    }
    setSelectedTour(getDetailedTour(tour))
  }

  const Card = ({ tour }: { tour: any }) => {
    const isHovered = hoveredButton === tour.id

    return (
      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 flex flex-col h-full animate-card">
        <div className="relative h-56 overflow-hidden rounded-t-[32px]">
          <ImageWithFallback
            src={tour.image || "/placeholder.svg"}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold mb-2">{tour.title}</h3>

          <p className="text-gray-500 mb-6">
            Explore the iconic Avenue of the Baobabs and the unique Tsingy formations
          </p>

          <div className="text-3xl font-bold mb-6">1 299 €</div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 font-bold">
              <div className="w-2 h-2 rounded-full bg-black" />
              {tour.location}
            </div>
            <div className="flex items-center gap-3 font-bold">
              <div className="w-2 h-2 rounded-full bg-black" />
              {tour.duration}
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {[
              "Expérience du coucher de soleil",
              "Site du patrimoine mondial",
              "Visite de villages malgaches locaux",
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <Check size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <button
            onMouseEnter={() => setHoveredButton(tour.id)}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => handleOpenModal(tour)}
            className={`
              mt-auto py-4 px-6 rounded-2xl font-bold text-left transition
              ${isHovered
                ? "bg-[#443C34] text-white"
                : "hover:bg-[#443C34] hover:text-white"
              }
            `}
          >
            Explore tour
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">

          <div className="section-header">
            <SectionHeader
              badge={content.pageHeaders?.bestSellers?.badge || 'Best Sellers'}
              title={content.pageHeaders?.bestSellers?.title || 'Most Popular Adventures'}
              subtitle={content.pageHeaders?.bestSellers?.subtitle || 'Handpicked experiences...'}
            />
          </div>

          {/* ✅ MOBILE / TABLET → LISTE */}
          <div className="grid gap-8 lg:hidden mt-8">
            {tours.map(tour => (
              <Card key={tour.id} tour={tour} />
            ))}
          </div>

          {/* ✅ DESKTOP → SLIDER */}
          <div className="hidden lg:block mt-8">
            <Slider ref={sliderRef} {...settings}>
              {tours.map(tour => (
                <div key={tour.id} className="px-4 h-full">
                  <Card tour={tour} />
                </div>
              ))}
            </Slider>

            <div className="flex justify-end mt-10 gap-3">
              <button onClick={() => sliderRef.current?.slickPrev()} className="p-4 border rounded-full hover:bg-gray-50 transition">
                <ChevronLeft />
              </button>
              <button onClick={() => sliderRef.current?.slickNext()} className="p-4 border rounded-full hover:bg-gray-50 transition">
                <ChevronRight />
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