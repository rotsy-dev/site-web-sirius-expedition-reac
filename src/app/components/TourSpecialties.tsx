import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Zap, Award, Star, MapPin, Clock, Check, Heart } from 'lucide-react';

interface TourSpecialty {
  id: number;
  icon: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  link: string;
  duration: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  highlights: string[];
  isBestSeller: boolean; // Nouveau champ
}

interface TourSpecialtiesProps {
  specialties: TourSpecialty[];
}

export function TourSpecialties({ specialties }: TourSpecialtiesProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-28 sm:py-32 md:py-40 px-6 lg:px-12 relative overflow-hidden bg-[#FAF7F2]">
      {/* Background sophistiqué Sirius */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#F3E5AB_0%,transparent_40%)] opacity-30" />

      {/* Grille de fond subtile */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="text-center mb-28"
        >
          {/* Badge Sirius */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-[#F3E5AB] text-[#6F4E37] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] mb-12 shadow-sm border border-[#6F4E37]/10"
          >
            Our Expertise
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-serif text-[#3D2B1F] mb-8 leading-tight">
            Curated <span className="italic text-[#6F4E37] font-normal">Experiences</span>
          </h2>

          <div className="flex items-center justify-center gap-4 text-[#6F4E37]/60 max-w-2xl mx-auto">
            <div className="h-[1px] w-12 bg-[#6F4E37]/20" />
            <p className="font-light italic text-lg">Bespoke adventures for the discerning explorer</p>
            <div className="h-[1px] w-12 bg-[#6F4E37]/20" />
          </div>
        </motion.div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 1 }}
              onHoverStart={() => setHoveredId(specialty.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-[#3D2B1F]/5 border border-[#6F4E37]/5 transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-4">
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    animate={hoveredId === specialty.id ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 2 }}
                    src={specialty.image}
                    alt={specialty.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1F]/80 via-transparent to-transparent" />

                  {/* Icon flottant */}
                  <div className="absolute top-6 left-6 w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white">
                    {specialty.icon}
                  </div>

                  {/* Badge Best Seller */}
                  {specialty.isBestSeller && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="absolute top-6 right-6"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#F3E5AB] to-[#6F4E37] rounded-full blur-md opacity-70" />
                        <div className="relative bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] px-4 py-2 rounded-full border border-[#6F4E37]/20 shadow-xl">
                          <span className="text-[#3D2B1F] font-bold text-xs tracking-wider uppercase flex items-center gap-1.5">
                            🏆 Best Seller
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Favorite button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-6 left-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <Heart size={18} className="text-[#3D2B1F]" />
                  </motion.button>

                  {/* Rating Badge */}
                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white">
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-[#F3E5AB]" fill="#F3E5AB" />
                      <span className="font-bold text-sm text-[#3D2B1F]">{specialty.rating}</span>
                      <span className="text-xs text-[#6F4E37]/60">({specialty.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-10">
                  <h3 className="text-2xl font-serif text-[#3D2B1F] mb-3 group-hover:text-[#6F4E37] transition-colors">
                    {specialty.title}
                  </h3>

                  <p className="text-[#6F4E37]/70 font-light leading-relaxed mb-5 line-clamp-2 text-sm">
                    {specialty.description}
                  </p>

                  {/* Highlights */}
                  <div className="mb-6 space-y-2.5">
                    {(specialty.highlights || []).slice(0, 3).map((highlight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx }}
                        className="flex items-start gap-2.5 text-xs text-[#6F4E37]/70"
                      >
                        <div className="mt-0.5 p-1 bg-[#F3E5AB]/30 rounded-full flex-shrink-0">
                          <Check size={12} className="text-[#6F4E37]" strokeWidth={3} />
                        </div>
                        <span className="line-clamp-2">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-t border-[#6F4E37]/10 pt-6">
                    <div className="flex items-center gap-2 text-xs text-[#6F4E37]/70">
                      <div className="p-1.5 bg-[#F3E5AB]/20 rounded-lg">
                        <MapPin size={14} className="text-[#6F4E37]" />
                      </div>
                      <span className="font-medium">{specialty.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6F4E37]/70">
                      <div className="p-1.5 bg-[#F3E5AB]/20 rounded-lg">
                        <Clock size={14} className="text-[#6F4E37]" />
                      </div>
                      <span className="font-medium">{specialty.duration}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="inline-block relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#F3E5AB] to-[#6F4E37] rounded-xl blur-sm opacity-50" />
                      <div className="relative bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] px-5 py-2.5 rounded-xl">
                        <span className="text-[#3D2B1F] font-bold text-xl">{specialty.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group/btn relative w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6F4E37] to-[#3D2B1F] rounded-2xl blur-md opacity-0 group-hover/btn:opacity-50 transition-opacity" />
                    <div className="relative bg-[#6F4E37] text-[#F3E5AB] py-4 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#3D2B1F]">
                      Explore Tour
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" strokeWidth={2.5} />
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>


        {/* --- BESPOKE CTA --- */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-32 relative rounded-[3.5rem] bg-[#6F4E37] p-12 md:p-20 overflow-hidden text-center text-[#F3E5AB]"
        >
          {/* Décoration de fond */}
          <div className="absolute top-0 right-0 opacity-5 -translate-y-1/4 translate-x-1/4">
            <Star size={400} />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <Award size={48} strokeWidth={1} className="mx-auto mb-8 opacity-50" />
            <h3 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Tailor-Made <span className="italic font-normal">Privilege</span>
            </h3>
            <p className="text-white/70 text-lg font-light mb-12 leading-relaxed">
              If your perfect journey isn't listed, our concierge team will design a bespoke expedition
              exclusively for your desires.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#F3E5AB] text-[#6F4E37] px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl hover:bg-white transition-colors"
            >
              Request Custom Design
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}