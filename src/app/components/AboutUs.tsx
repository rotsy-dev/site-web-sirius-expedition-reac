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
    { 
      title: 'Expert Local Guides', 
      description: 'All our guides are certified professionals with extensive knowledge of Madagascar\'s ecosystems and culture' 
    },
    { 
      title: 'Customized Itineraries', 
      description: 'Every tour is tailored to your interests, budget, and schedule for a unique experience' 
    },
    { 
      title: 'Small Group Sizes', 
      description: 'We keep groups small (max 8 people) for a more personalized and intimate experience' 
    },
    { 
      title: '24/7 Support', 
      description: 'We\'re always available to assist you before, during, and after your trip' 
    },
    { 
      title: 'Best Price Guarantee', 
      description: 'We offer competitive prices without compromising on quality or safety' 
    },
    { 
      title: 'Safety First', 
      description: 'Your safety is our priority with comprehensive insurance and safety protocols' 
    },
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

      {/* --- SECTION STATISTIQUES AVEC ALTERNANCE DE COULEURS --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {stats.map((stat, i) => {
          // Alternance: indices pairs (0,2) = beige clair, indices impairs (1,3) = marron foncé
          const isLightCard = i % 2 === 0;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 * i, duration: 1 }}
              className={`p-10 rounded-[2.5rem] text-center shadow-lg ${
                isLightCard 
                  ? 'bg-[#F5E6D3]' // Beige clair pour cartes paires
                  : 'bg-[#6F4E37]' // Marron foncé pour cartes impaires
              }`}
            >
              <div className={`mb-4 flex justify-center ${
                isLightCard ? 'text-[#6F4E37]' : 'text-[#F3E5AB]'
              }`}>
                {stat.icon}
              </div>
              <div className={`text-3xl font-serif mb-2 ${
                isLightCard ? 'text-[#3D2B1F]' : 'text-[#F3E5AB]'
              }`}>
                {stat.number}
              </div>
              <div className={`text-[10px] uppercase tracking-widest font-bold ${
                isLightCard ? 'text-[#6F4E37]/60' : 'text-white/50'
              }`}>
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* --- SECTION OUR STORY / THE SPIRIT OF EXPLORATION --- */}
      <div className="max-w-7xl mx-auto mb-32">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-[#3D2B1F] mb-12"
        >
          Our Story
        </motion.h3>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Colonne gauche - Texte */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-[#3D2B1F] text-base leading-relaxed">
              Sirius Expedition was founded with a simple mission: to share the incredible beauty and biodiversity of Madagascar with the world. Named after the brightest star in the night sky, we aim to be your guiding light in exploring this unique island nation.
            </p>
            <p className="text-[#3D2B1F] text-base leading-relaxed">
              With years of experience and deep local knowledge, we specialize in creating customized tours that showcase Madagascar's endemic wildlife, stunning landscapes, and rich cultural heritage.
            </p>
            <p className="text-[#3D2B1F] text-base leading-relaxed">
              From the iconic Avenue of the Baobabs to the pristine beaches of Sainte Marie, from lemur encounters to birdwatching expeditions, we ensure every journey is memorable and authentic.
            </p>

            {/* Image des lémuriens en bas à gauche */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-lg mt-8"
            >
              <img 
                src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop" 
                alt="Lemurs in Madagascar" 
                className="w-full h-64 object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Colonne droite - Vidéo et Citation */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Vidéo YouTube */}
            <div className="rounded-3xl overflow-hidden shadow-lg bg-gray-100 aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${config.videos.aboutUsVideoId}`}
                title="Sirius Expedition"
                frameBorder="0"
                allowFullScreen
              />
            </div>

            {/* Citation */}
            <div className="bg-[#F5E6D3] p-8 rounded-3xl border-l-4 border-[#6F4E37]">
              <p className="italic text-[#3D2B1F] text-base leading-relaxed">
                "From the iconic Avenue of the Baobabs to the pristine beaches of Sainte Marie, from lemur encounters to birdwatching expeditions, we ensure every journey is memorable and authentic."
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- SECTION WHY CHOOSE US --- */}
      <div className="max-w-7xl mx-auto bg-[#6F4E37] rounded-[4rem] p-12 md:p-20 relative overflow-hidden mb-32 shadow-2xl">
         <motion.h3 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           viewport={{ once: true }}
           className="text-4xl font-serif text-white text-center mb-16"
         >
           Why Choose Sirius Expedition ?
         </motion.h3>
         
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 relative shadow-lg"
              >
                {/* Icône circulaire en haut */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-4 shadow-lg border-4 border-[#6F4E37]">
                  <CheckCircle className="text-[#6F4E37]" size={28} strokeWidth={2.5} />
                </div>
                
                {/* Contenu de la carte */}
                <div className="mt-8 text-center">
                  <h4 className="font-bold text-[#3D2B1F] mb-3 text-lg">{item.title}</h4>
                  <p className="text-[#6F4E37]/70 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
         </div>
      </div>

      {/* --- SECTION LICENSED & CERTIFIED --- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="bg-white p-12 lg:p-20 rounded-[4rem] text-center max-w-7xl mx-auto shadow-lg"
      >
        <Shield className="mx-auto mb-8 text-[#6F4E37]" size={64} strokeWidth={1.5} />
        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[#3D2B1F]">Licensed & Certified</h3>
        <p className="text-[#6F4E37]/70 text-base md:text-lg mb-16 max-w-3xl mx-auto leading-relaxed">
          Sirius Expedition is officially registered with Madagascar Tourism Board and holds all necessary certifications for operating tours. We maintain partnerships with local conservation organizations and communities.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-16 pt-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#6F4E37]/50 mb-2">Hosted by</p>
            <p className="font-bold text-base text-[#3D2B1F]">{config.services.hosting.join(' & ')}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#6F4E37]/50 mb-2">Domain by</p>
            <p className="font-bold text-base text-[#3D2B1F]">{config.services.domain}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#6F4E37]/50 mb-2">Email by</p>
            <p className="font-bold text-base text-[#3D2B1F]">{config.services.email}</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Exemple d'utilisation avec configuration
export default function App() {
  const config = {
    siteName: "Sirius Expedition",
    videos: {
      aboutUsVideoId: "dQw4w9WgXcQ"
    },
    services: {
      hosting: ["GoDaddy", "Netlify"],
      domain: "GoDaddy",
      email: "Zoho Mail Pro"
    }
  };

  return <AboutUs config={config} />;
}