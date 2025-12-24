import * as React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles, Zap, Award, Star } from 'lucide-react';

interface TourSpecialty {
  id: number;
  icon: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface TourSpecialtiesProps {
  specialties: TourSpecialty[];
}

export function TourSpecialties({ specialties }: TourSpecialtiesProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-28 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ultra-sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

      {/* Grille animée */}
      <motion.div
        animate={{
          opacity: [0.02, 0.05, 0.02],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      {/* Gradients flottants massifs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.15, 0.25, 0.15],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 right-1/4 w-[45rem] h-[45rem] bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header spectaculaire */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24 sm:mb-28"
        >
          {/* Badge 3D ultra-premium */}
          <motion.div
            initial={{ scale: 0, rotate: -180, y: -50 }}
            whileInView={{ scale: 1, rotate: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-8"
          >
            <div className="relative group/badge">
              {/* Glow rotatif */}
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 bg-gradient-to-r from-accent via-primary to-accent rounded-full blur-2xl opacity-40"
              />
              
              <div className="relative bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 dark:from-purple-950 dark:via-blue-950 dark:to-purple-950 px-8 py-4 rounded-full border-2 border-purple-300/50 dark:border-purple-700/50 shadow-2xl backdrop-blur-xl overflow-hidden">
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
                
                <span className="relative text-purple-900 dark:text-purple-100 font-black text-sm sm:text-base tracking-widest uppercase flex items-center gap-3">
                  <motion.span
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles size={20} className="text-purple-600 fill-purple-600" />
                  </motion.span>
                  Specialized Tours
                  <motion.span
                    animate={{ 
                      scale: [1, 1.3, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap size={20} className="text-purple-600 fill-purple-600" />
                  </motion.span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Titre monumental */}
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
              Curated
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
              className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent block"
            >
              Experiences
            </motion.span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg md:text-xl font-medium"
          >
            <Star className="w-6 h-6 text-primary fill-primary" />
            <p>Tailored adventures designed for every passion and explorer</p>
            <Star className="w-6 h-6 text-accent fill-accent" />
          </motion.div>
        </motion.div>

        {/* Grid des spécialités avec effets 3D */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-28">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              onHoverStart={() => setHoveredId(specialty.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="group cursor-pointer h-full perspective-[1000px]"
            >
              <motion.div
                whileHover={{ y: -16, rotateX: 5 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-500 h-full flex flex-col border border-gray-200/50 dark:border-gray-800/50 transform-gpu"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Image avec effets avancés */}
                <div className="relative h-80 overflow-hidden">
                  <motion.img
                    animate={hoveredId === specialty.id ? { scale: 1.2, rotate: 3 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={specialty.image}
                    alt={specialty.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlay sophistiqué */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  {/* Overlay coloré au hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={hoveredId === specialty.id ? { opacity: 0.3 } : { opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary"
                  />

                  {/* Icon flottant avec glow */}
                  <motion.div
                    animate={hoveredId === specialty.id ? { scale: 1.15, rotate: 10, y: -5 } : { scale: 1, rotate: 0, y: 0 }}
                    className="absolute top-6 left-6 z-10"
                  >
                    <div className="relative group/icon">
                      {/* Glow pulsant */}
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl"
                      />
                      
                      <div className="relative w-20 h-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
                        {/* Shine effect */}
                        <motion.div
                          animate={{
                            x: ['-100%', '200%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        />
                        <span className="text-5xl relative z-10">{specialty.icon}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Arrow reveal élégant */}
                  <AnimatePresence>
                    {hoveredId === specialty.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute bottom-6 right-6 z-10"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{
                              scale: [1, 1.3, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-80"
                          />
                          <div className="relative w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                            <motion.div
                              animate={{
                                x: ['-100%', '200%'],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                              }}
                              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                            />
                            <ArrowRight size={28} className="text-white relative z-10" strokeWidth={3} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Particules magiques */}
                  <AnimatePresence>
                    {hoveredId === specialty.id && (
                      <div className="absolute inset-0">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              y: [0, -40, -80],
                              x: [0, (i % 2 ? 20 : -20), (i % 2 ? 40 : -40)],
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.1,
                              repeat: Infinity,
                            }}
                            className="absolute w-2 h-2 bg-white rounded-full shadow-lg"
                            style={{
                              left: `${20 + (i * 6)}%`,
                              top: `${50 + (i % 4) * 10}%`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Contenu */}
                <div className="p-8 md:p-9 flex-1 flex flex-col">
                  <motion.h3
                    animate={hoveredId === specialty.id ? { x: 5 } : { x: 0 }}
                    className="text-2xl md:text-3xl lg:text-4xl mb-5 font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300 leading-tight"
                  >
                    {specialty.title}
                  </motion.h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg mb-8 flex-1 font-medium">
                    {specialty.description}
                  </p>

                  {/* Learn More avec animation fluide */}
                  <motion.div
                    animate={hoveredId === specialty.id ? { x: 10 } : { x: 0 }}
                    className="flex items-center gap-3 text-accent font-black text-lg group-hover:gap-5 transition-all duration-300"
                  >
                    <span>Discover More</span>
                    <motion.div
                      animate={{ x: [0, 6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={22} strokeWidth={3} />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section ultra-premium */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative perspective-[1000px]"
        >
          {/* Glow massif */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute -inset-8 bg-gradient-to-r from-primary via-accent to-primary rounded-[3rem] blur-3xl"
          />

          {/* Card principale */}
          <motion.div
            whileHover={{ y: -8, rotateX: 2 }}
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-50 dark:to-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-800/50 dark:border-gray-300/50"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Grille animée */}
            <motion.div
              animate={{
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:3rem_3rem]"
            />

            {/* Gradient overlay animé */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
              style={{ backgroundSize: '200% 200%' }}
            />

            <div className="relative p-12 md:p-20 text-center">
              {/* Icon premium */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center mb-10"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-2xl blur-2xl opacity-50"
                  />
                  <div className="relative w-24 h-24 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 dark:border-gray-800/20 shadow-2xl">
                    <Award size={48} className="text-accent" />
                  </div>
                </div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-7xl text-white dark:text-gray-900 mb-8 font-black leading-[0.95]"
              >
                Dream It.<br />We'll Create It.
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-gray-300 dark:text-gray-600 mb-12 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed"
              >
                Can't find your perfect adventure? Our expert team crafts bespoke journeys
                tailored to your wildest dreams and unique preferences.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="group/cta relative"
              >
                {/* Glow externe */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute -inset-2 bg-gradient-to-r from-white via-gray-200 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-full blur-xl"
                />
                
                <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-12 py-6 rounded-full font-black text-xl shadow-2xl flex items-center gap-4 overflow-hidden border border-gray-200/50 dark:border-gray-800/50">
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
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-gray-300/30 dark:via-white/10 to-transparent skew-x-12"
                  />
                  
                  <span className="relative z-10">Request Custom Tour</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={28} strokeWidth={3} />
                  </motion.div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Styles pour animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}