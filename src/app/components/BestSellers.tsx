import * as React from 'react';
const { useRef } = React;
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star, MapPin, Clock, ChevronLeft, ChevronRight, Check, Heart } from 'lucide-react';
import { motion } from "framer-motion"

interface Tour {
  id: number;
  title: string;
  slug: string;
  image: string;
  duration: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  description: string;
  highlights: string[];
}

interface BestSellersProps {
  tours: Tour[];
}

export function BestSellers({ tours }: BestSellersProps) {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    cssEase: 'cubic-bezier(0.87, 0, 0.13, 1)',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background décoratif */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          {/* Badge avec animation */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 mb-4 sm:mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-primary/20">
                <span className="text-primary font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🏆
                  </motion.span>
                  Best Sellers
                </span>
              </div>
            </div>
          </motion.div>

          {/* Titre */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-6 font-black leading-tight px-4"
          >
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Most Popular
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Adventures
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl font-light px-4"
          >
            Handpicked experiences loved by thousands of travelers
          </motion.p>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="relative mb-6 sm:mb-8 hidden sm:block">
          <div className="flex justify-end gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => sliderRef.current?.slickPrev()}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative p-3 sm:p-4 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-foreground" strokeWidth={2.5} />
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => sliderRef.current?.slickNext()}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative p-3 sm:p-4 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <ChevronRight size={20} className="sm:w-6 sm:h-6 text-foreground" strokeWidth={2.5} />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Carousel */}
        <Slider ref={sliderRef} {...settings}>
          {tours.map((tour, index) => (
            <div key={tour.id} className="px-2 sm:px-3 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group h-full"
              >
                <div className="bg-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-border">
                  {/* Image Section */}
                  <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />

                    {/* Favorite button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 sm:p-3 bg-card/90 backdrop-blur-md rounded-full shadow-lg hover:bg-card transition-all"
                    >
                      <Heart size={16} className="sm:w-5 sm:h-5 text-foreground" />
                    </motion.button>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-card/95 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-xl">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Star size={14} className="sm:w-[18px] sm:h-[18px] text-primary" fill="#6D4C41" />
                        <span className="font-bold text-sm sm:text-base text-foreground">{tour.rating}</span>
                        <span className="text-xs text-muted-foreground">({tour.reviews})</span>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl sm:rounded-2xl blur-md opacity-70" />
                        <div className="relative bg-gradient-to-r from-primary to-accent px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl">
                          <span className="text-primary-foreground font-bold text-lg sm:text-xl md:text-2xl">{tour.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {tour.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-5 line-clamp-2 flex-shrink-0">
                      {tour.description}
                    </p>

                    {/* Highlights */}
                    <div className="mb-4 sm:mb-5 space-y-2 sm:space-y-2.5 flex-shrink-0">
                      {tour.highlights.slice(0, 3).map((highlight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                        >
                          <div className="mt-0.5 p-1 bg-accent/10 rounded-full flex-shrink-0">
                            <Check size={12} className="sm:w-[14px] sm:h-[14px] text-accent" strokeWidth={3} />
                          </div>
                          <span className="line-clamp-2">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Info Row */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-t border-border pt-4 sm:pt-6 flex-shrink-0">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                          <MapPin size={14} className="sm:w-4 sm:h-4 text-primary" />
                        </div>
                        <span className="font-medium">{tour.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <div className="p-1.5 sm:p-2 bg-accent/10 rounded-lg">
                          <Clock size={14} className="sm:w-4 sm:h-4 text-accent" />
                        </div>
                        <span className="font-medium">{tour.duration}</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group/btn relative w-full mt-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl sm:rounded-2xl blur-md opacity-0 group-hover/btn:opacity-50 transition-opacity" />
                      <div className="relative bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                        Explore Tour
                        <ChevronRight size={18} className="sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" strokeWidth={2.5} />
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Custom Dots Styling */}
      <style>{`
        .slick-dots {
          bottom: -40px;
        }
        @media (min-width: 640px) {
          .slick-dots {
            bottom: -60px;
          }
        }
        .slick-dots li {
          margin: 0 4px;
        }
        @media (min-width: 640px) {
          .slick-dots li {
            margin: 0 6px;
          }
        }
        .slick-dots li button:before {
          font-size: 10px;
          color: #6D4C41;
          opacity: 0.3;
          transition: all 0.3s ease;
        }
        @media (min-width: 640px) {
          .slick-dots li button:before {
            font-size: 12px;
          }
        }
        .slick-dots li.slick-active button:before {
          opacity: 1;
          transform: scale(1.3);
        }
        .slick-dots li:hover button:before {
          opacity: 0.6;
        }
      `}</style>
    </section>
  );
}