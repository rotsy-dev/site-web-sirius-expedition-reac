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
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background décoratif */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge avec animation */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 px-6 py-3 rounded-full border border-primary/20">
                <span className="text-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2">
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
            className="text-5xl md:text-6xl lg:text-7xl mb-6 font-black"
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
            className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-light"
          >
            Handpicked experiences loved by thousands of travelers
          </motion.p>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="relative mb-8">
          <div className="flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => sliderRef.current?.slickPrev()}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative p-4 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <ChevronLeft size={24} className="text-foreground" strokeWidth={2.5} />
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => sliderRef.current?.slickNext()}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative p-4 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <ChevronRight size={24} className="text-foreground" strokeWidth={2.5} />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Carousel */}
        <Slider ref={sliderRef} {...settings}>
          {tours.map((tour, index) => (
            <div key={tour.id} className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group h-full"
              >
                <div className="bg-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-border">
                  {/* Image Section */}
                  <div className="relative h-80 overflow-hidden">
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
                      className="absolute top-4 left-4 p-3 bg-card/90 backdrop-blur-md rounded-full shadow-lg hover:bg-card transition-all"
                    >
                      <Heart size={20} className="text-foreground" />
                    </motion.button>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl">
                      <div className="flex items-center gap-2">
                        <Star size={18} fill="#6D4C41" className="text-primary" />
                        <span className="font-bold text-foreground">{tour.rating}</span>
                        <span className="text-xs text-muted-foreground">({tour.reviews})</span>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-md opacity-70" />
                        <div className="relative bg-gradient-to-r from-primary to-accent px-6 py-3 rounded-2xl">
                          <span className="text-primary-foreground font-bold text-2xl">{tour.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl mb-3 font-bold text-foreground group-hover:text-primary transition-colors">
                      {tour.title}
                    </h3>
                    <p className="text-muted-foreground mb-5 line-clamp-2 flex-shrink-0">
                      {tour.description}
                    </p>

                    {/* Highlights */}
                    <div className="mb-5 space-y-2.5 flex-shrink-0">
                      {tour.highlights.slice(0, 3).map((highlight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * idx }}
                          className="flex items-start gap-3 text-sm text-muted-foreground"
                        >
                          <div className="mt-0.5 p-1 bg-accent/10 rounded-full">
                            <Check size={14} className="text-accent" strokeWidth={3} />
                          </div>
                          <span>{highlight}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Info Row */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-t border-border pt-6 flex-shrink-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin size={16} className="text-primary" />
                        </div>
                        <span className="font-medium">{tour.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Clock size={16} className="text-accent" />
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
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-md opacity-0 group-hover/btn:opacity-50 transition-opacity" />
                      <div className="relative bg-gradient-to-r from-primary to-accent text-primary-foreground py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                        Explore Tour
                        <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" strokeWidth={2.5} />
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
          bottom: -60px;
        }
        .slick-dots li {
          margin: 0 6px;
        }
        .slick-dots li button:before {
          font-size: 12px;
          color: #6D4C41;
          opacity: 0.3;
          transition: all 0.3s ease;
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