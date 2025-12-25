import * as React from 'react';
import { useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star, Quote, ChevronLeft, ChevronRight, Award, TrendingUp, Sparkles, Heart, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion"

interface Review {
  id: number;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  tour: string;
}

interface ReviewsProps {
  reviews: Review[];
  config: {
    social: {
      tripadvisor: string;
      google: string;
    };
  };
}

export function Reviews({ reviews, config }: ReviewsProps) {
  const sliderRef = useRef<Slider>(null);
  const [hoveredReview, setHoveredReview] = useState<number | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
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
    <section className="py-28 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-950 dark:via-gray-900 dark:to-orange-950" />

      {/* Grille subtile */}
      <motion.div
        animate={{
          opacity: [0.02, 0.06, 0.02],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#f5970808_1px,transparent_1px),linear-gradient(to_bottom,#f5970808_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      {/* Gradients flottants dorés */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [-50, 50, -50],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 right-1/4 w-[45rem] h-[45rem] bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.15, 0.25, 0.15],
          x: [50, -50, 50],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 left-1/4 w-[50rem] h-[50rem] bg-gradient-to-br from-orange-400/20 to-transparent rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          {/* Badge trophée */}
          <motion.div
            initial={{ scale: 0, rotate: -180, y: -50 }}
            whileInView={{ scale: 1, rotate: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-8"
          >
            <div className="relative group/badge">
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 360],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute -inset-3 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-full blur-2xl"
              />
              
              <div className="relative bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950 dark:via-orange-950 dark:to-amber-950 px-10 py-4 rounded-full border-2 border-amber-300/50 dark:border-amber-700/50 shadow-2xl backdrop-blur-xl overflow-hidden">
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
                
                <span className="relative text-amber-900 dark:text-amber-100 font-black text-base tracking-widest uppercase flex items-center gap-3">
                  <motion.span
                    animate={{ 
                      rotate: [0, -15, 15, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Award size={22} className="text-amber-600 fill-amber-600" />
                  </motion.span>
                  Testimonials
                  <motion.span
                    animate={{ 
                      scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart size={22} className="text-orange-600 fill-orange-600" />
                  </motion.span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Titre spectaculaire */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 font-black leading-[0.9]"
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
              className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-[length:200%_100%] bg-clip-text text-transparent block mb-3"
            >
              Loved By
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
              className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-[length:200%_100%] bg-clip-text text-transparent block"
            >
              Travelers
            </motion.span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-xl font-medium"
          >
            <Sparkles className="w-6 h-6 text-amber-500" />
            <p>Real stories from adventurers who explored Madagascar with us</p>
            <Sparkles className="w-6 h-6 text-orange-500" />
          </motion.div>
        </motion.div>

        {/* Navigation élégante */}
        <div className="flex justify-end gap-4 mb-12">
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
                className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl"
              />
              <div className="relative p-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-amber-200/50 dark:border-amber-800/50 rounded-full shadow-2xl group-hover:shadow-amber-500/30 transition-all duration-300">
                <btn.icon size={26} className="text-gray-900 dark:text-white" strokeWidth={2.5} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Carousel avec cartes premium */}
        <Slider ref={sliderRef} {...settings}>
          {reviews.map((review, index) => (
            <div key={review.id} className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onHoverStart={() => setHoveredReview(review.id)}
                onHoverEnd={() => setHoveredReview(null)}
                className="h-full"
              >
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 p-8 relative h-full flex flex-col border border-amber-200/50 dark:border-amber-800/50 overflow-hidden"
                >
                  {/* Glow interne */}
                  <motion.div
                    animate={hoveredReview === review.id ? { opacity: 0.1 } : { opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-400 pointer-events-none"
                  />

                  {/* Quote icon décoratif animé */}
                  <motion.div
                    animate={hoveredReview === review.id ? { 
                      scale: 1.2, 
                      rotate: 15, 
                      opacity: 0.15 
                    } : { 
                      scale: 1, 
                      rotate: 0, 
                      opacity: 0.08 
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-8 right-8"
                  >
                    <Quote size={100} fill="currentColor" className="text-amber-500" />
                  </motion.div>

                  {/* Rating stars avec animation en cascade */}
                  <div className="flex items-center gap-1.5 mb-6 relative z-10">
                    {[...Array(review.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: 0.5 + i * 0.1, 
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        whileHover={{ scale: 1.3, rotate: 20 }}
                      >
                        <Star size={22} fill="#f59e0b" className="text-amber-500" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic text-lg leading-relaxed relative z-10 flex-1 font-medium">
                    "{review.text}"
                  </p>

                  {/* Tour Name Badge */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block relative mb-6 z-10 self-start"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-30" />
                    <div className="relative bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 border border-amber-300/50 dark:border-amber-700/50 px-5 py-2.5 rounded-2xl text-sm font-bold overflow-hidden">
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      />
                      <span className="relative flex items-center gap-2 text-amber-900 dark:text-amber-100">
                        <CheckCircle size={16} />
                        {review.tour}
                      </span>
                    </div>
                  </motion.div>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-amber-200/50 dark:border-amber-800/50 relative z-10">
                    <div className="relative">
                      {/* Glow pulsant autour de l'avatar */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 0.7, 0.4]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -inset-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-md"
                      />
                      
                      {/* Ring animé */}
                      <motion.div
                        animate={hoveredReview === review.id ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 2 }}
                        className="absolute -inset-1 rounded-full border-2 border-amber-400/50"
                      />
                      
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="relative w-16 h-16 rounded-full border-4 border-white dark:border-gray-900 shadow-xl object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 dark:text-white text-lg">{review.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>🌍</span>
                        <span className="font-semibold">{review.country}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-medium">{review.date}</p>
                    </div>
                  </div>

                  {/* Particules flottantes au hover */}
                  <AnimatePresence>
                    {hoveredReview === review.id && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              y: [0, -100],
                              x: [(i % 2 ? 20 : -20), (i % 2 ? 40 : -40)],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 2,
                              delay: i * 0.1,
                              repeat: Infinity,
                              repeatDelay: 1,
                            }}
                            className="absolute bottom-0 w-2 h-2 bg-amber-400 rounded-full shadow-lg"
                            style={{
                              left: `${20 + i * 10}%`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </Slider>

        {/* Review Platforms Section premium */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-28"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 text-gray-700 dark:text-gray-300 text-xl font-bold mb-2"
            >
              <TrendingUp size={28} className="text-amber-500" />
              <span>Read more reviews on</span>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { 
                name: 'TripAdvisor', 
                letter: 'T', 
                reviews: '156', 
                url: config.social.tripadvisor,
                gradient: 'from-green-500 to-emerald-600',
                delay: 0.2,
                xDir: -30
              },
              { 
                name: 'Google Reviews', 
                letter: 'G', 
                reviews: '203', 
                url: config.social.google,
                gradient: 'from-blue-500 to-cyan-600',
                delay: 0.3,
                xDir: 30
              }
            ].map((platform, idx) => (
              <motion.a
                key={idx}
                initial={{ opacity: 0, x: platform.xDir }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: platform.delay }}
                whileHover={{ y: -12, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                {/* Glow externe */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className={`absolute -inset-2 bg-gradient-to-r ${platform.gradient} rounded-3xl blur-xl`}
                />
                
                <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-2 border-amber-200/50 dark:border-amber-800/50 group-hover:border-amber-400 dark:group-hover:border-amber-600 rounded-3xl p-8 shadow-2xl group-hover:shadow-amber-500/20 transition-all duration-300 overflow-hidden">
                  {/* Shine effect */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '200%' }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />

                  <div className="flex items-center gap-5 relative z-10">
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} rounded-2xl blur-lg`}
                      />
                      <div className={`relative w-20 h-20 bg-gradient-to-br ${platform.gradient} rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20`}>
                        <span className="text-white font-black text-4xl">{platform.letter}</span>
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-black text-gray-900 dark:text-white text-2xl mb-2">{platform.name}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="#f59e0b" className="text-amber-500" />
                          ))}
                        </div>
                        <span className="text-base text-gray-600 dark:text-gray-400 font-bold">{platform.reviews} reviews</span>
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="text-gray-400 group-hover:text-amber-500 transition-colors" size={32} strokeWidth={3} />
                    </motion.div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Styles personnalisés */}
      <style>{`
        .slick-dots {
          bottom: -70px;
        }
        .slick-dots li {
          margin: 0 8px;
        }
        .slick-dots li button:before {
          font-size: 14px;
          color: #f59e0b;
          opacity: 0.3;
          transition: all 0.3s ease;
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