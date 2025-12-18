import * as React from 'react';
import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star, Quote, ChevronLeft, ChevronRight, Award, TrendingUp } from 'lucide-react';
import { motion } from "framer-motion"

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
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted to-background" />

      {/* Bulles décoratives */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-full blur-lg opacity-30"
              />
              <div className="relative bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 px-6 py-3 rounded-full border border-accent/20">
                <span className="text-accent font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                  <Award size={18} />
                  Testimonials
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
            className="text-5xl md:text-6xl lg:text-7xl mb-6 font-black leading-tight"
          >
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Loved By
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Travelers
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed"
          >
            Real stories from adventurers who explored Madagascar with us
          </motion.p>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-end gap-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => sliderRef.current?.slickPrev()}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
            <div className="relative p-4 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all">
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
            <div className="relative p-4 bg-card border border-border rounded-full shadow-lg hover:shadow-xl transition-all">
              <ChevronRight size={24} className="text-foreground" strokeWidth={2.5} />
            </div>
          </motion.button>
        </div>

        {/* Carousel */}
        <Slider ref={sliderRef} {...settings}>
          {reviews.map((review, index) => (
            <div key={review.id} className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <div className="bg-card rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 relative h-full flex flex-col border border-border">
                  {/* Quote icon décoratif */}
                  <div className="absolute top-8 right-8 opacity-10">
                    <Quote size={80} fill="currentColor" className="text-primary" />
                  </div>

                  {/* Rating stars avec animation */}
                  <div className="flex items-center gap-1 mb-6 relative z-10">
                    {[...Array(review.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                      >
                        <Star size={20} fill="#6D4C41" className="text-primary" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-foreground mb-6 italic text-lg leading-relaxed relative z-10 flex-1">
                    "{review.text}"
                  </p>

                  {/* Tour Name Badge */}
                  <div className="inline-block bg-primary/5 border border-primary/10 px-4 py-2 rounded-full text-sm text-primary font-medium mb-6 relative z-10">
                    {review.tour}
                  </div>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-border relative z-10">
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-primary/30 rounded-full blur-md"
                      />
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="relative w-16 h-16 rounded-full border-3 border-card shadow-lg object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-lg">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.country}</p>
                      <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>

        {/* Review Platforms Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-muted-foreground text-lg mb-6"
            >
              <TrendingUp size={24} className="text-primary" />
              <span className="font-semibold">Read more reviews on</span>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.a
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={config.social.tripadvisor}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-card border-2 border-border group-hover:border-primary rounded-2xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-primary-foreground font-black text-3xl">T</span>
                    </div>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-foreground text-xl mb-1">TripAdvisor</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="#6D4C41" className="text-primary" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">156 reviews</span>
                    </div>
                  </div>
                  <ChevronRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={24} />
                </div>
              </div>
            </motion.a>

            <motion.a
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={config.social.google}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-card border-2 border-border group-hover:border-primary rounded-2xl p-8 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-primary-foreground font-black text-3xl">G</span>
                    </div>
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-foreground text-xl mb-1">Google Reviews</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="#6D4C41" className="text-primary" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">203 reviews</span>
                    </div>
                  </div>
                  <ChevronRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={24} />
                </div>
              </div>
            </motion.a>
          </div>
        </motion.div>
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