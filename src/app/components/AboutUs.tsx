import * as React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Compass, Leaf, Shield, ArrowRight } from 'lucide-react';

interface AboutUsProps {
  config: {
    siteName: string;
    videos: {
      aboutUsVideoId: string;
    };
  };
}

export function AboutUs({ config }: AboutUsProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Images Haute Qualité (Stables)
  const heroImg = "https://images.pexels.com/photos/33545/sunrise-phu-quoc-island-ocean.jpg?auto=compress&cs=tinysrgb&w=1920";
  const makiImg = "https://images.pexels.com/photos/2096431/pexels-photo-2096431.jpeg?auto=compress&cs=tinysrgb&w=1000";

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#080808] font-sans text-[#1A120B] dark:text-[#FAF7F2]">
      
      {/* --- HERO : ALTAIR MINIMALIST --- */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url('${heroImg}')` }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[#D4A373] text-[10px] font-black uppercase tracking-[0.6em] mb-4 block"
          >
            L'Expérience
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="text-white text-5xl md:text-7xl font-light uppercase tracking-tighter"
          >
            Pure <span className="font-black italic text-[#D4A373]">Madagascar</span>
          </motion.h1>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsPlaying(true)}
            className="mt-12 w-20 h-20 rounded-full border border-white/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 mx-auto"
          >
            <Play fill="currentColor" size={24} className="ml-1" />
          </motion.button>
        </div>
      </section>

      {/* --- CONTENT : ÉDITORIAL COURT --- */}
      <section className="py-32 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-none tracking-tighter">
              L'exception <br /> <span className="text-[#D4A373]">est notre norme.</span>
            </h2>
            <p className="text-xl text-zinc-500 font-serif italic">
              "Voyager n'est pas seulement voir, c'est ressentir l'âme d'une terre."
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Depuis 15 ans, {config.siteName} sculpte des moments rares. Sécurité absolue, immersion totale et respect sacré de la nature.
            </p>
            <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#D4A373] group">
              Notre Vision <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <img src={makiImg} className="w-full h-[500px] object-cover rounded-2xl shadow-2xl" alt="Nature" />
            <div className="absolute -bottom-10 -left-10 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl hidden lg:block">
              <p className="text-4xl font-black text-[#D4A373]">15</p>
              <p className="text-[8px] font-black uppercase tracking-widest">Ans d'Expertise</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES : ICONES ÉLÉGANTES --- */}
      <section className="pb-32 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-100 dark:border-zinc-800 pt-16">
          <div className="text-center space-y-4">
            <Compass className="mx-auto text-[#D4A373]" size={32} strokeWidth={1} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Sur Mesure</h4>
            <p className="text-xs text-zinc-400">Chaque itinéraire est unique.</p>
          </div>
          <div className="text-center space-y-4">
            <Leaf className="mx-auto text-[#D4A373]" size={32} strokeWidth={1} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Eco-Luxe</h4>
            <p className="text-xs text-zinc-400">Préserver pour l'avenir.</p>
          </div>
          <div className="text-center space-y-4">
            <Shield className="mx-auto text-[#D4A373]" size={32} strokeWidth={1} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Confiance</h4>
            <p className="text-xs text-zinc-400">Assistance 24/7 partout.</p>
          </div>
        </div>
      </section>

      {/* --- MODAL VIDÉO --- */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
          >
            <button onClick={() => setIsPlaying(false)} className="absolute top-8 right-8 text-white"><X size={32} /></button>
            <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${config.videos.aboutUsVideoId}?autoplay=1`} allowFullScreen />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:italic,wght@400;700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        @media (max-width: 1024px) { .bg-fixed { background-attachment: scroll !important; } }
      `}</style>
    </div>
  );
}