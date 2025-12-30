import * as React from 'react';
import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { motion } from "framer-motion"
import { SectionHeader } from '@/components/common/SectionHeader';

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
 content?: {
    pageHeaders?: {
      reviews?: {
        badge?: string;
        title?: string;
        subtitle?: string;
      };
    };
  };
}

export function Reviews({ reviews, config, content = {} }: ReviewsProps) {
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
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header simple */}
         <SectionHeader
            badge={content.pageHeaders?.reviews?.badge || 'Testimonials'}
            title={content.pageHeaders?.reviews?.title || 'Loved By Travelers'}
            subtitle={content.pageHeaders?.reviews?.subtitle || 'Real stories from adventurers who explored Madagascar with us'}
        />

        {/* Navigation simple */}
        <div className="flex justify-end gap-4 mb-12">
          {[
            { onClick: () => sliderRef.current?.slickPrev(), icon: ChevronLeft, label: 'Précédent' },
            { onClick: () => sliderRef.current?.slickNext(), icon: ChevronRight, label: 'Suivant' }
          ].map((btn, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={btn.onClick}
              className="p-4 bg-white border-2 border-[#443C34] rounded-full hover:bg-gray-50 transition-colors"
              aria-label={btn.label}
            >
              <btn.icon size={24} className="text-[#443C34]" strokeWidth={2.5} />
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
                className="h-full"
              >
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="bg-white rounded-[2rem] transition-all duration-500 p-8 relative h-full flex flex-col border border-gray-200 overflow-hidden"
                >
                  {/* Quote icon décoratif */}
                  <div className="absolute top-8 right-8 opacity-10">
                    <Quote size={80} fill="currentColor" className="text-[#443C34]" />
                  </div>

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
                  <div className="inline-block relative mb-6 z-10 self-start">
                    <div className="bg-gray-100 border border-gray-300 px-5 py-2.5 rounded-2xl text-sm font-bold">
                      <span className="flex items-center gap-2 text-[#443C34]">
                        <CheckCircle size={16} />
                        {review.tour}
                      </span>
                    </div>
                  </div>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-200 relative z-10">
                    <div className="relative">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-16 h-16 rounded-full border-4 border-white object-cover"
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


                </motion.div>
              </motion.div>
            </div>
          ))}
        </Slider>

        {/* Review Platforms Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-28"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-[#443C34] mb-2">
              Read more reviews on
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                name: 'TripAdvisor',
                letter: 'T',
                reviews: '150 reviews',
                url: config.social.tripadvisor,
                bgColor: 'bg-[#F5E6D3]',
                textColor: 'text-[#443C34]'
              },
              {
                name: 'Google Reviews',
                letter: 'G',
                reviews: '203 reviews',
                url: config.social.google,
                bgColor: 'bg-[#F5E6D3]',
                textColor: 'text-[#443C34]'
              }
            ].map((platform, idx) => (
              <motion.a
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="flex flex-col items-center text-center p-14 bg-white px-0">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${platform.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                    <span className={`${platform.textColor} font-black text-3xl`}>{platform.letter}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={20} fill="#f59e0b" className="text-amber-500" />
                    ))}
                  </div>

                  {/* Platform Name */}
                  <p className="font-bold text-[#443C34] text-lg mb-2">{platform.name}</p>

                  {/* Reviews Count Button */}
                  <button className="flex items-center gap-2 border-2 border-gray-300 rounded-full px-6 py-2 text-sm text-gray-600 hover:border-[#443C34] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {platform.reviews}
                  </button>
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