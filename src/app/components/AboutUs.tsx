import * as React from 'react';
import { Award, Users, Globe, Heart, Shield, Clock, Star, CheckCircle } from 'lucide-react';
import { motion, Variants } from "framer-motion";

interface AboutUsProps {
  config: {
    siteName: string;
    videos: {
      aboutUsVideoId: string;
    };
    services: {
      hosting: string[];
      domain: string;
      email: string;
    };
  };
}

export function AboutUs({ config }: AboutUsProps) {
  
  // Variantes d'animation ralenties pour plus d'élégance
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.25, // Plus d'espace entre l'apparition de chaque mot
        delayChildren: 0.5 
      }
    }
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 1.5, // Animation beaucoup plus lente (1.5s au lieu de 0.8s)
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };

  const stats = [
    { number: '500+', label: 'Happy Travelers', icon: <Users size={20} /> },
    { number: '50+', label: 'Tour Packages', icon: <Globe size={20} /> },
    { number: '15+', label: 'Years Experience', icon: <Clock size={20} /> },
    { number: '4.9', label: 'Average Rating', icon: <Star size={20} /> },
  ];

  const whyChooseUs = [
    { title: 'Expert Local Guides', description: 'Certified professionals with extensive knowledge.' },
    { title: 'Customized Itineraries', description: 'Tailored to your interests, budget, and schedule.' },
    { title: 'Small Group Sizes', description: 'Max 8 people for a personalized experience.' },
    { title: '24/7 Support', description: 'Always available to assist you during your trip.' },
    { title: 'Best Price Guarantee', description: 'Competitive prices without compromising quality.' },
    { title: 'Safety First', description: 'Priority with comprehensive safety protocols.' },
  ];

  return (
    <section className="bg-[#FAF7F2] text-[#3D2B1F] pt-40 pb-24 px-6 lg:px-12 overflow-hidden font-sans">
      
      {/* --- SECTION TITRE RÉDUIT ET LENT --- */}
      <div className="max-w-7xl mx-auto mb-24 text-center">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="inline-block bg-[#F3E5AB] text-[#6F4E37] px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] mb-8"
        >
          Discover Our Story
        </motion.span>

        <motion.h2 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          // Taille réduite : text-5xl au lieu de 6xl, text-7xl au lieu de 8xl
          className="text-5xl md:text-7xl font-serif text-[#3D2B1F] leading-tight mb-8 tracking-tight"
        >
          <motion.span variants={wordVariants} className="inline-block mr-3">About</motion.span>
          <motion.span variants={wordVariants} className="inline-block text-[#6F4E37] italic font-normal mr-3">Sirius</motion.span>
          <motion.span variants={wordVariants} className="inline-block">Expedition</motion.span>
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }} // Apparition très douce du texte
          viewport={{ once: true }}
          className="text-[#6F4E37]/70 text-lg max-w-xl mx-auto font-light leading-relaxed"
        >
          Your trusted partner for unforgettable Madagascar adventures where the aroma of Mocha meets the sweetness of Vanilla.
        </motion.p>
      </div>

      {/* --- LE RESTE DU CONTENU --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 * i, duration: 1 }}
            className="bg-[#6F4E37] p-10 rounded-[2.5rem] text-center shadow-2xl shadow-mocha/20"
          >
            <div className="text-[#F3E5AB] mb-4 flex justify-center">{stat.icon}</div>
            <div className="text-3xl font-serif text-[#F3E5AB] mb-2">{stat.number}</div>
            <div className="text-white/50 text-[10px] uppercase tracking-widest font-bold">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center mb-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
          className="rounded-[3rem] overflow-hidden shadow-2xl bg-white p-4"
        >
          <div className="relative pb-[56.25%] h-0 rounded-[2rem] overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${config.videos.aboutUsVideoId}`}
              title="Sirius Expedition"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </motion.div>

        <div className="space-y-8">
          <h3 className="text-3xl font-serif text-[#3D2B1F]">The Spirit of Exploration</h3>
          <p className="text-[#6F4E37]/80 text-base leading-relaxed">
            {config.siteName} was founded to share the incredible biodiversity of Madagascar. Named after the brightest star, we aim to be your guiding light in exploring the Red Island.
          </p>
          <div className="bg-[#F3E5AB]/50 p-8 rounded-[2rem] border-l-8 border-[#6F4E37]">
            <p className="italic font-serif text-lg text-[#3D2B1F]">
              "We believe in sustainable tourism that preserves Madagascar's natural heritage for future generations."
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-[#6F4E37] rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden mb-32 shadow-2xl">
         <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
            <Globe size={400} />
         </div>
         <h3 className="text-3xl font-serif text-[#F3E5AB] text-center mb-16 relative z-10">Why Choose Us</h3>
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <CheckCircle className="text-[#F3E5AB] shrink-0" size={24} />
                <div>
                  <h4 className="font-bold tracking-tight mb-1 text-sm uppercase">{item.title}</h4>
                  <p className="text-white/60 text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
         </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="bg-[#F3E5AB] p-12 lg:p-16 rounded-[3rem] text-center max-w-7xl mx-auto border border-[#6F4E37]/10"
      >
        <Shield className="mx-auto mb-8 text-[#6F4E37]" size={48} strokeWidth={1} />
        <h3 className="text-2xl font-serif mb-6 text-[#3D2B1F]">Licensed & Certified</h3>
        <p className="text-[#6F4E37]/80 text-base mb-12 max-w-2xl mx-auto leading-relaxed">
          Officially registered with the Madagascar Tourism Board. We maintain partnerships with local conservation organizations.
        </p>
        <div className="flex flex-wrap justify-center gap-12 pt-8 border-t border-[#6F4E37]/10">
          {[
            { label: 'Hosted by', val: config.services.hosting.join(' & ') },
            { label: 'Domain by', val: config.services.domain },
            { label: 'Email by', val: config.services.email }
          ].map((s, i) => (
            <div key={i}>
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#6F4E37]/50 mb-1">{s.label}</p>
              <p className="font-serif text-sm text-[#3D2B1F]">{s.val}</p>
            </div>
          ))}
        </div>
      </motion.div>

      
    </section>
  );
}