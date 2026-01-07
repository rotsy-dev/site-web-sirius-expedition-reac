"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import { Play, X, ArrowRight, Clapperboard, Award, Loader2 } from "lucide-react"
import { useTranslatedContent } from "../../hooks/useTranslatedContent"
import { useTranslation } from "react-i18next"

// Types
interface Video {
  id: string
  youtubeId: string
  thumbnail: string
  title: string
  category: string
}

interface VideoGalleryProps {
  videos: Video[]
  // On accepte la structure réelle de siteConfig (config est peu typé ici)
  config: any
  content?: {
    pageHeaders?: {
      videos?: {
        badge?: string
        title?: string
        subtitle?: string
      }
    }
  }
}

export function VideoGallery({ videos, config, content = {} }: VideoGalleryProps) {
  const { t } = useTranslation();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Traduire automatiquement les vidéos
  const { translatedContent: translatedVideos, isLoading: isTranslatingVideos } = useTranslatedContent(
    videos,
    ['title', 'category']
  );

  // Traduire automatiquement les headers de la section
  const { translatedContent: translatedVideosHeader } = useTranslatedContent(
    content?.pageHeaders?.videos ?? null,
    ['badge', 'title', 'subtitle']
  );

  const displayVideos = (translatedVideos || videos) as Video[];
  const header = (translatedVideosHeader as { badge?: string; title?: string; subtitle?: string } | null)
    || content?.pageHeaders?.videos
    || {};

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const videoScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1])
  const smoothScale = useSpring(videoScale, { stiffness: 100, damping: 30 })

  return (
    <section 
      ref={containerRef} 
      className="relative py-24 overflow-hidden min-h-screen flex flex-col items-center bg-[#3D2F2B]"
    >
      {/* TITRE DE LA SECTION */}
      <div className="z-10 text-center mb-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4"
        >
          <div className="p-3 bg-[#EBE3D5]/10 rounded-full">
            <Clapperboard className="text-[#EBE3D5]" size={32} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-[#EBE3D5]">
            SIRIUS <span className="text-[#A68966]">GALLERY</span>
          </h2>
          <div className="h-1 w-20 bg-[#A68966] rounded-full" />
          <p className="text-[10px] font-bold tracking-[0.6em] uppercase text-[#EBE3D5]/40 mt-2">
            {header.subtitle || t('sections.videosSubtitle')}
          </p>
          
          {/* Indicateur de chargement de traduction */}
          {isTranslatingVideos && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[#EBE3D5]/80">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full z-10">
        
        {/* BLOC PRINCIPAL (VIDÉO YOUTUBE + CARTE VANILLA) */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center mb-40">
          
          {/* ZONE VIDÉO : YouTube Iframe en mode Background */}
          <motion.div 
            style={{ scale: smoothScale }}
            className="relative w-full lg:w-3/4 aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-10 border border-white/10 bg-black"
          >
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <iframe
                className="w-full h-full scale-[1.35]" 
                src={`https://www.youtube.com/embed/${config.videos.mainYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${config.videos.mainYouTubeId}&controls=0&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
                allow="autoplay; encrypted-media"
                title="Background Video"
              />
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3D2F2B]/60 via-transparent to-transparent" />

            {/* Badge Featured avec animations spectaculaires */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute top-8 left-8 z-30"
            >
              <div className="relative group/badge">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="absolute inset-0 bg-[#A68966] rounded-full blur-lg"
                />
                <div className="relative bg-[#A68966] px-6 py-3 rounded-2xl shadow-2xl overflow-hidden border border-[#EBE3D5]/50">
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                  <span className="relative text-[#EBE3D5] font-black text-base flex items-center gap-2">
                    <Award size={20} className="fill-[#EBE3D5]" />
                    Featured Video
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Bouton Play Sirius avec animations */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedVideo(config.videos.mainYouTubeId)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
            >
              <div className="relative">
                {/* Rings pulsants */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                  className="absolute inset-0 bg-[#EBE3D5] rounded-full"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 0, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                  className="absolute inset-0 bg-[#A68966] rounded-full"
                />
                
                {/* Button principal */}
                <div className="relative w-24 h-24 bg-[#EBE3D5] text-[#3D2F2B] rounded-full flex items-center justify-center shadow-2xl border-4 border-[#A68966] overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#A68966]/30 to-transparent skew-x-12"
                  />
                  <Play fill="currentColor" size={32} className="ml-1 relative z-10" />
                </div>
              </div>
            </motion.button>

            {/* Corners décoratifs */}
            {[
              { top: "2rem", left: "2rem", rotate: 0 },
              { top: "2rem", right: "2rem", rotate: 90 },
              { bottom: "2rem", left: "2rem", rotate: -90 },
              { bottom: "2rem", right: "2rem", rotate: 180 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="absolute w-8 h-8 border-t-4 border-l-4 border-[#A68966]"
                style={{ ...pos, transform: `rotate(${pos.rotate}deg)` }}
              />
            ))}
          </motion.div>

          {/* CARTE TEXTE VANILLA (Chevauche la vidéo à droite) */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full lg:w-[480px] lg:-ml-32 mt-[-50px] lg:mt-0 bg-[#EBE3D5] p-10 md:p-14 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-20"
          >
            <span className="text-[#A68966] font-bold uppercase tracking-widest text-xs mb-6 block">
              {t('contact.experienceSirius')}
            </span>
            <h3 className="text-[#3D2F2B] text-3xl md:text-5xl font-black leading-tight mb-8">
              {t('contact.anAuthentic')} <br /> <span className="italic font-serif font-medium">  {t('contact.immersion')}.</span>
            </h3>
            <p className="text-[#3D2F2B]/70 text-lg leading-relaxed mb-10">
              {t('contact.dscrVideo')}
            </p>
            {/* <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 bg-[#3D2F2B] text-[#EBE3D5] px-10 py-5 rounded-full font-bold text-lg hover:bg-[#2A201D] transition-all group w-full justify-center lg:w-auto"
            >
              {t('contact.title')}
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </motion.button> */}
          </motion.div>
        </div>

        {/* CAROUSEL DES VIDÉOS YOUTUBE */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-8"
              animate={{
                x: [0, -((displayVideos.length * 400) + (displayVideos.length * 32))],
              }}
              transition={{
                x: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: displayVideos.length * 8,
                  ease: "linear",
                },
              }}
            >
              {[...displayVideos, ...displayVideos, ...displayVideos].map((v, index) => (
                <motion.div 
                  key={`${v.id}-${index}`}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % displayVideos.length) * 0.15, duration: 0.6 }}
                  whileHover={{ y: -12, scale: 1.05 }}
                  className="cursor-pointer group flex-shrink-0 w-[400px]" 
                  onClick={() => setSelectedVideo(v.youtubeId)}
                  onMouseEnter={() => setHoveredVideo(`${v.id}-${index}`)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-xl border border-white/5 bg-black/20">
                    <motion.img 
                      animate={hoveredVideo === `${v.id}-${index}` ? { scale: 1.15 } : { scale: 1 }}
                      transition={{ duration: 0.7 }}
                      src={v.thumbnail} 
                      alt={v.title} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={hoveredVideo === `${v.id}-${index}` ? { opacity: 0.4 } : { opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-[#A68966]/50 via-[#8B7355]/50 to-[#A68966]/50"
                    />
                    
                    {/* Play Button spectaculaire */}
                    <motion.div
                      animate={{
                        scale: hoveredVideo === `${v.id}-${index}` ? 1.3 : 1,
                        rotate: hoveredVideo === `${v.id}-${index}` ? 360 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        rotate: { duration: 0.6 },
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                      <div className="relative">
                        {/* Rings pulsants */}
                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          className="absolute inset-0 bg-[#EBE3D5] rounded-full"
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 0, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: 0.5,
                          }}
                          className="absolute inset-0 bg-[#A68966] rounded-full"
                        />

                        {/* Button principal */}
                        <div className="relative w-16 h-16 bg-[#EBE3D5] rounded-full flex items-center justify-center shadow-2xl border-4 border-[#A68966] overflow-hidden">
                          <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#A68966]/50 to-transparent skew-x-12"
                          />
                          <Play size={24} className="text-[#3D2F2B] ml-1 relative z-10" fill="currentColor" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Particules explosives */}
                    <AnimatePresence>
                      {hoveredVideo === `${v.id}-${index}` && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                                x: Math.cos((i / 12) * Math.PI * 2) * 100,
                                y: Math.sin((i / 12) * Math.PI * 2) * 100,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 1.5,
                                delay: (i % 4) * 0.1,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 0.5,
                              }}
                              className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#A68966] rounded-full shadow-lg"
                            />
                          ))}
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Frame corners */}
                    {hoveredVideo === `${v.id}-${index}` && (
                      <>
                        {[
                          { top: "1rem", left: "1rem", rotate: 0 },
                          { top: "1rem", right: "1rem", rotate: 90 },
                          { bottom: "1rem", left: "1rem", rotate: -90 },
                          { bottom: "1rem", right: "1rem", rotate: 180 },
                        ].map((pos, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute w-6 h-6 border-t-3 border-l-3 border-[#A68966]"
                            style={{ ...pos, transform: `rotate(${pos.rotate}deg)` }}
                          />
                        ))}
                      </>
                    )}
                  </div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="inline-block bg-gradient-to-r from-[#A68966]/90 to-[#8B7355]/90 backdrop-blur-xl px-4 py-2 rounded-full text-sm text-[#EBE3D5] font-bold mb-3 border border-white/20 shadow-lg"
                  >
                    {v.category}
                  </motion.div>
                  <h4 className="font-bold text-2xl text-[#EBE3D5] mb-2">{v.title}</h4>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* MODAL LECTEUR VIDÉO */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedVideo(null)}
          >
            {/* Vignette effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-50" />

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 100, rotateX: 45 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 100, rotateX: -45 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Close button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-20 right-0 z-10 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#EBE3D5] rounded-full flex items-center justify-center text-[#3D2F2B] border-4 border-[#A68966]">
                  <X size={32} strokeWidth={3} />
                </div>
              </motion.button>

              {/* Video container */}
              <div className="relative">
                <div className="relative bg-black rounded-[2rem] overflow-hidden border-4 border-[#A68966]/50 shadow-2xl">
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                      title="Video Player"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Decorative corners */}
                {[
                  { top: "-1rem", left: "-1rem", rotate: 0 },
                  { top: "-1rem", right: "-1rem", rotate: 90 },
                  { bottom: "-1rem", left: "-1rem", rotate: -90 },
                  { bottom: "-1rem", right: "-1rem", rotate: 180 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="absolute w-12 h-12 border-t-4 border-l-4 border-[#A68966]"
                    style={{ ...pos, transform: `rotate(${pos.rotate}deg)` }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
