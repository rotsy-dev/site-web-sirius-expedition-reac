"use client"

import * as React from "react"
const { useRef, useState } = React

import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import { ImageWithFallback } from "../../components/common/ImageWithFallback"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"

interface BestSellersProps {
  tours: {
    id: number
    image: string
    title: string
    location: string
    duration: string
  }[]
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "0px",
}

export function BestSellers({ tours }: BestSellersProps) {
  const sliderRef = useRef<Slider>(null)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [hoveredButton, setHoveredButton] = useState<number | null>(null)

  return (
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="mb-6">
            <span className="text-xl text-[#443C34] font-semibold border-2 border-[#443C34] px-6 py-3 rounded-full">
              Best Sellers
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#443C34] leading-tight">
            Most Popular Adventures
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked experiences loved by thousands of travelers
          </p>
        </div>

        {/* Carousel */}
        <Slider ref={sliderRef} {...settings}>
          {tours.map((tour) => {
            const isHovered = hoveredButton === tour.id

            return (
              <div key={tour.id} className="px-3">
                <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 h-full flex flex-col transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden rounded-t-[32px]">
                    <ImageWithFallback
                      src={tour.image || "/placeholder.svg"}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                      {tour.title}
                    </h3>

                    <p className="text-gray-500 mb-6 text-lg">
                      Explore the iconic Avenue of the Baobabs and the unique Tsingy formations
                    </p>

                    <div className="text-5xl font-bold text-[#1A1A1A] mb-8">
                      1 299 €
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 font-bold">
                        <div className="w-2 h-2 rounded-full bg-black" />
                        {tour.location}
                      </div>
                      <div className="flex items-center gap-3 font-bold">
                        <div className="w-2 h-2 rounded-full bg-black" />
                        {tour.duration}
                      </div>
                    </div>

                    <div className="space-y-4 mb-10">
                      {[
                        "Expérience du coucher de soleil",
                        "Site du patrimoine mondial",
                        "Visite de villages malgaches locaux",
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                            <Check size={14} className="text-white" strokeWidth={4} />
                          </div>
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <button
                        onMouseEnter={() => setHoveredButton(tour.id)}
                        onMouseLeave={() => setHoveredButton(null)}
                        className={`w-full py-5 px-8 rounded-2xl text-xl font-bold text-left transition-all
                          ${
                            isHovered
                              ? "bg-[#443C34] text-white"
                              : "hover:bg-[#443C34] hover:text-white"
                          }`}
                      >
                        Explore tour
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </Slider>

        {/* Navigation */}
        <div className="flex justify-end mt-12">
          <div className="flex gap-3">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-4 rounded-full border border-black"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="p-4 rounded-full border border-black"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
