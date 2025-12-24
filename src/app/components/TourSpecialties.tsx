import * as React from 'react'
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from 'lucide-react';

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
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background avec motifs */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-primary/5" />

      {/* Motifs décoratifs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      {/* Grid pattern subtil */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #6D4C41 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge animé */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-full blur-xl opacity-30"
              />
              <div className="relative bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 px-6 py-3 rounded-full border border-accent/30 backdrop-blur-sm">
                <span className="text-accent font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                  <Sparkles size={16} className="animate-pulse" />
                  Specialized Tours
                </span>
              </div>
            </div>
          </motion.div>

          {/* Titre principal */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl mb-6 font-black leading-tight"
          >
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Curated
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Experiences
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed"
          >
            Tailored adventures designed for every passion and explorer
          </motion.p>
        </motion.div>

        {/* Grid des spécialités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {specialties.map((specialty, index) => (
            <motion.div
              key={specialty.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -12 }}
              className="group cursor-pointer h-full"
            >
              <div className="bg-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-border">
                {/* Image avec overlays */}
                <div className="relative h-72 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.15, rotate: 2 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src={specialty.image}
                    alt={specialty.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlay multiple */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Icon flottant */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="absolute top-6 left-6 z-10"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-card rounded-2xl blur-md opacity-80" />
                      <div className="relative w-16 h-16 bg-card rounded-2xl flex items-center justify-center shadow-2xl">
                        <span className="text-4xl">{specialty.icon}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Arrow avec effet reveal */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                    whileHover={{ opacity: 1, scale: 1, rotate: 0 }}
                    className="absolute bottom-6 right-6 z-10"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-70" />
                      <div className="relative w-14 h-14 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-xl">
                        <ArrowRight size={24} className="text-primary-foreground" strokeWidth={2.5} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Particules décoratives */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-background/60 rounded-full"
                        style={{
                          left: `${20 + i * 10}%`,
                          top: `${30 + (i % 3) * 20}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl md:text-3xl mb-4 font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {specialty.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                    {specialty.description}
                  </p>

                  {/* Learn More avec animation */}
                  <motion.div
                    className="flex items-center gap-2 text-accent font-bold group-hover:gap-4 transition-all duration-300"
                  >
                    <span className="text-lg">Discover More</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={20} strokeWidth={2.5} />
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section Premium */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-[2.5rem] blur-2xl opacity-20" />

          {/* Card principale */}
          <div className="relative bg-gradient-to-br from-foreground via-primary to-foreground rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Motif décoratif */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle, #FFF8F0 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }}
            />

            {/* Gradient overlay animé */}
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
              style={{ backgroundSize: '200% 200%' }}
            />

            <div className="relative p-10 md:p-16 text-center">
              {/* Icon décoratif */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-card/10 backdrop-blur-md rounded-2xl mb-8 border border-primary-foreground/20"
              >
                <Sparkles size={40} className="text-accent" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 font-black leading-tight"
              >
                Dream It.<br />We'll Create It.
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-background/90 mb-10 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
              >
                Can't find your perfect adventure? Our expert team crafts bespoke journeys
                tailored to your wildest dreams and unique preferences.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-card via-background to-card rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-card text-foreground px-10 py-5 rounded-full font-bold text-lg shadow-2xl flex items-center gap-3">
                  Request Custom Tour
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} strokeWidth={2.5} />
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}