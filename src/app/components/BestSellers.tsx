import * as React from 'react';
const { useRef, useState } = React;
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star, MapPin, Clock, ChevronLeft, ChevronRight, Check, Heart, Sparkles, TrendingUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

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
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (tourId: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tourId)) {
        newSet.delete(tourId);
      } else {
        newSet.add(tourId);
      }
      return newSet;
    });
  };

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
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      
      {/* Grille de fond */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Gradients animés */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20 md:mb-24"
        >
          {/* Badge 3D avec effets */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-3 mb-6 sm:mb-8 relative"
          >
            {/* Glow animé */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-2xl"
            />
            
            <div className="relative bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50 dark:from-amber-950 dark:via-amber-900 dark:to-amber-950 px-8 py-4 rounded-full border-2 border-amber-300/50 dark:border-amber-700/50 shadow-2xl backdrop-blur-xl">
              {/* Shine effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              />
              
              <span className="relative flex items-center gap-3 text-amber-900 dark:text-amber-100 font-black text-sm sm:text-base tracking-widest uppercase">
                <motion.span
                  animate={{ 
                    rotate: [0, -15, 15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-500" />
                </motion.span>
                Best Sellers
                <motion.span
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </motion.span>
              </span>
            </div>
          </motion.div>

          {/* Titre spectaculaire */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 sm:mb-8 font-black leading-[0.95] px-4"
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent block"
            >
              Most Popular
            </motion.span>
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
              className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent block mt-2"
            >
              Adventures
            </motion.span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg md:text-xl font-medium px-4"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <p>Handpicked experiences loved by thousands of travelers</p>
            <Sparkles className="w-5 h-5 text-accent" />
          </motion.div>
        </motion.div>

        {/* Navigation élégante */}
        <div className="relative mb-8 sm:mb-12 hidden sm:block">
          <div className="flex justify-end gap-3 sm:gap-4">
            {[
              { onClick: () => sliderRef.current?.slickPrev(), icon: ChevronLeft, label: 'Précédent' },
              { onClick: () => sliderRef.current?.slickNext(), icon: ChevronRight, label: 'Suivant' }
            ].map((btn, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.15, x: idx === 0 ? -8 : 8 }}
                whileTap={{ scale: 0.9 }}
                onClick={btn.onClick}
                className="group relative"
                aria-label={btn.label}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl"
                />
                <div className="relative p-4 sm:p-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-800/50 rounded-full shadow-2xl group-hover:shadow-primary/30 transition-all duration-300">
                  <btn.icon size={24} className="sm:w-7 sm:h-7 text-gray-900 dark:text-white" strokeWidth={2.5} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Carousel avec cartes premium */}
        <Slider ref={sliderRef} {...settings}>
          {tours.map((tour, index) => {
            const isFavorite = favorites.has(tour.id);
            
            return (
              <div key={tour.id} className="px-2 sm:px-3 md:px-4">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group h-full"
                >
                  <motion.div 
                    whileHover={{ y: -12 }}
                    className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-500 h-full flex flex-col border border-gray-200/50 dark:border-gray-800/50"
                  >
                    {/* Image avec effets avancés */}
                    <div className="relative h-64 sm:h-72 md:h-80 lg:h-96 overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full"
                      >
                        <ImageWithFallback
                          src={tour.image}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>

                      {/* Gradient overlay sophistiqué */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      {/* Effet de lumière au hover */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-br from-primary/50 via-transparent to-accent/50"
                      />

                      {/* Bouton favori animé */}
                      <motion.button
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tour.id);
                        }}
                        className="absolute top-4 left-4 sm:top-5 sm:left-5 p-3 sm:p-3.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-full shadow-xl hover:shadow-2xl transition-all z-10 group/fav"
                        aria-label={`${isFavorite ? 'Retirer' : 'Ajouter'} ${tour.title} ${isFavorite ? 'des' : 'aux'} favoris`}
                      >
                        <AnimatePresence mode="wait">
                          {isFavorite ? (
                            <motion.div
                              key="filled"
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                            >
                              <Heart size={18} className="sm:w-5 sm:h-5 text-red-500 fill-red-500" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="outline"
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: -180 }}
                            >
                              <Heart size={18} className="sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 group-hover/fav:text-red-500 transition-colors" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>

                      {/* Rating badge premium */}
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-4 right-4 sm:top-5 sm:right-5"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl blur-md opacity-60" />
                          <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl border border-amber-200/50 dark:border-amber-800/50">
                            <div className="flex items-center gap-2">
                              <Star size={16} className="sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
                              <span className="font-black text-base sm:text-lg text-gray-900 dark:text-white">{tour.rating}</span>
                              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-semibold">({tour.reviews})</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Price tag spectaculaire */}
                      <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5"
                      >
                        <div className="relative group/price">
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur-lg opacity-70"
                          />
                          <div className="relative bg-gradient-to-r from-primary via-accent to-primary px-6 py-3 sm:px-8 sm:py-4 rounded-2xl shadow-2xl overflow-hidden">
                            <motion.div
                              animate={{
                                x: ['-100%', '200%'],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                              }}
                              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                            />
                            <span className="relative text-white font-black text-xl sm:text-2xl md:text-3xl drop-shadow-lg">
                              {tour.price}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Contenu de la carte */}
                    <div className="p-5 sm:p-6 md:p-7 flex-1 flex flex-col">
                      <h3 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {tour.title}
                      </h3>
                      
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-5 sm:mb-6 line-clamp-2 flex-shrink-0 font-medium">
                        {tour.description}
                      </p>

                      {/* Highlights avec icônes animées */}
                      <div className="mb-6 sm:mb-7 space-y-3 flex-shrink-0">
                        {tour.highlights.slice(0, 3).map((highlight, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * idx }}
                            className="flex items-start gap-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 group/item"
                          >
                            <motion.div 
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="mt-0.5 p-1.5 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-lg flex-shrink-0 shadow-md"
                            >
                              <Check size={14} className="sm:w-4 sm:h-4 text-green-600 dark:text-green-400" strokeWidth={3} />
                            </motion.div>
                            <span className="line-clamp-2 font-medium group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                              {highlight}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Info badges modernisés */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-t border-gray-200/50 dark:border-gray-800/50 pt-6 sm:pt-8 flex-shrink-0">
                        {[
                          { icon: MapPin, text: tour.location, gradient: 'from-blue-500 to-cyan-500' },
                          { icon: Clock, text: tour.duration, gradient: 'from-purple-500 to-pink-500' }
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="flex items-center gap-2.5 text-sm sm:text-base group/badge relative"
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl blur opacity-0 group-hover/badge:opacity-30 transition-opacity`} />
                            <div className="relative p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-md">
                              <item.icon size={16} className={`sm:w-[18px] sm:h-[18px] bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`} />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">{item.text}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* CTA Button ultra-premium */}
                      <motion.button
                        whileHover={{ scale: 1.03, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        className="group/btn relative w-full mt-auto overflow-hidden"
                        aria-label={`Explorer le tour ${tour.title}`}
                      >
                        {/* Glow extérieur */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] rounded-2xl blur-lg opacity-60 group-hover/btn:opacity-100 transition-all duration-500 animate-gradient" />
                        
                        {/* Button principal */}
                        <div className="relative bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] text-white py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg shadow-2xl flex items-center justify-center gap-3 overflow-hidden animate-gradient">
                          {/* Shine effect */}
                          <motion.div
                            animate={{
                              x: ['-100%', '200%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                          />
                          
                          <span className="relative z-10">Explore Tour</span>
                          <motion.div
                            className="relative z-10"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ChevronRight size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
                          </motion.div>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </Slider>
      </div>

      {/* Styles personnalisés */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .slick-dots {
          bottom: -50px;
        }
        @media (min-width: 640px) {
          .slick-dots {
            bottom: -70px;
          }
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
        @media (min-width: 640px) {
          .slick-dots li button:before {
            font-size: 14px;
          }
        }
        .slick-dots li.slick-active button:before {
          opacity: 1;
          transform: scale(1.5);
        }
        .slick-dots li:hover button:before {
          opacity: 0.7;
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
}