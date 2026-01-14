"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import { Play, X, Clapperboard, Loader2, Sparkles } from "lucide-react"
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
  config: any
  onNavigateToContact?: () => void
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
  const { t } = useTranslation()
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Traduire automatiquement les vidéos
  const { translatedContent: translatedVideos, isLoading: isTranslatingVideos } = useTranslatedContent(
    videos,
    ['title', 'category']
  )

  // Traduire automatiquement les headers de la section
  const { translatedContent: translatedVideosHeader } = useTranslatedContent(
    content?.pageHeaders?.videos ?? null,
    ['badge', 'title', 'subtitle']
  )

  const displayVideos = (translatedVideos || videos) as Video[]
  const header = (translatedVideosHeader as { badge?: string; title?: string; subtitle?: string } | null)
    || content?.pageHeaders?.videos
    || {}

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const videoScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1])
  const smoothScale = useSpring(videoScale, { stiffness: 100, damping: 30 })

  return (
    <section
      ref={containerRef}
      className="relative py-16 md:py-32 overflow-hidden min-h-screen flex flex-col items-center bg-gradient-to-b from-[#2A201D] via-[#3D2F2B] to-[#443C34]"
    >
      {/* Texture de fond subtile */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      {/* Effet de lumière douce */}
      <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#D4A373]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-[#8B7355]/10 rounded-full blur-3xl" />

      {/* TITRE DE LA SECTION */}
      <div className="z-10 text-center mb-12 md:mb-24 relative px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 md:gap-6"
        >
          {/* Badge avec icône */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-full border border-[#D4A373]/30"
          >
            <Clapperboard className="text-[#D4A373]" size={20} />
            <span className="text-xs md:text-sm font-bold text-[#EBE3D5] uppercase tracking-wider">
              {header.badge || 'Video Gallery'}
            </span>
          </motion.div>

          {/* Titre principal avec effet dégradé */}
          <h2 className="text-4xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#EBE3D5] via-[#D4A373] to-[#EBE3D5]">
            {header.title || 'SIRIUS GALLERY'}
          </h2>

          {/* Ligne décorative animée */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 w-20 md:w-32 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent rounded-full"
          />

          {/* Sous-titre */}
          <p className="text-xs md:text-sm font-semibold tracking-[0.3em] md:tracking-[0.5em] uppercase text-[#EBE3D5]/60 mt-2">
            {header.subtitle || t('sections.videosSubtitle')}
          </p>

          {/* Indicateur de chargement */}
          {isTranslatingVideos && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-2 mt-4 text-sm text-[#D4A373] bg-[#D4A373]/10 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-medium">{t('common.loading')}</span>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full z-10">

        {/* BLOC PRINCIPAL (VIDÉO YOUTUBE + CARTE VANILLA) - SIDE BY SIDE */}
        <div className="relative flex flex-col lg:flex-row items-stretch justify-center mb-20 md:mb-40 gap-6 md:gap-8">

          {/* ZONE VIDÉO : YouTube Iframe */}
          <motion.div
            style={{ scale: smoothScale }}
            className="relative w-full lg:w-[60%] aspect-video rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] md:shadow-[0_40px_80px_rgba(0,0,0,0.7)] z-10 border-2 border-[#D4A373]/20 bg-black"
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${config.videos.mainYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${config.videos.mainYouTubeId}&controls=1&rel=0&modestbranding=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Main Video"
            />

            {/* Badge Featured */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute top-4 md:top-8 left-4 md:left-8 z-30 pointer-events-none"
            >
              <div className="relative group/badge">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 bg-[#D4A373] rounded-xl md:rounded-2xl blur-xl"
                />
                <div className="relative bg-gradient-to-r from-[#D4A373] to-[#A68966] px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                  <span className="relative text-white font-black text-xs md:text-base flex items-center gap-1 md:gap-2">
                    <Sparkles size={16} className="fill-white" />
                    {t('hero.featured')}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Corners décoratifs dorés */}
            {[
              { top: "1rem", left: "1rem", rotate: 0 },
              { top: "1rem", right: "1rem", rotate: 90 },
              { bottom: "1rem", left: "1rem", rotate: -90 },
              { bottom: "1rem", right: "1rem", rotate: 180 },
            ].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="hidden md:block absolute w-8 md:w-10 h-8 md:h-10 border-t-4 border-l-4 border-[#D4A373] pointer-events-none"
                style={{ ...pos, transform: `rotate(${pos.rotate}deg)` }}
              />
            ))}
          </motion.div>

          {/* CARTE TEXTE VANILLA - À CÔTÉ */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full lg:w-[40%] bg-gradient-to-br from-[#EBE3D5] to-[#F5EFE7] p-8 md:p-12 rounded-2xl md:rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] md:shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-20 border border-[#D4A373]/20 flex flex-col justify-center"
          >
            {/* Badge décoratif */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4A373] to-[#A68966] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 md:mb-6 shadow-lg self-start">
              <Sparkles size={14} />
              {t('contact.experienceSirius')}
            </div>

            <h3 className="text-[#3D2F2B] text-2xl md:text-3xl lg:text-4xl font-black leading-tight mb-4 md:mb-6">
              {t('contact.anAuthentic')} <br />
              <span className="italic font-serif font-medium text-[#8B7355]">
                {t('contact.immersion')}
              </span>
            </h3>

            {/* Ligne décorative */}
            <div className="h-1 w-16 md:w-20 bg-gradient-to-r from-[#D4A373] to-transparent rounded-full mb-6 md:mb-8" />

            <p className="text-[#3D2F2B]/75 text-sm md:text-base leading-relaxed">
              {t('contact.dscrVideo')}
            </p>

            {/* Coins décoratifs */}
            <div className="absolute top-3 md:top-4 right-3 md:right-4 w-6 md:w-8 h-6 md:h-8 border-t-2 border-r-2 border-[#D4A373]/30" />
            <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 w-6 md:w-8 h-6 md:h-8 border-b-2 border-l-2 border-[#D4A373]/30" />
          </motion.div>
        </div>

        {/* CAROUSEL DES VIDÉOS */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6 md:gap-10"
              animate={{
                x: [0, -((displayVideos.length * 320) + (displayVideos.length * 24))],
              }}
              transition={{
                x: {
                  repeat: Infinity,
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
                  className="cursor-pointer group flex-shrink-0 w-[280px] md:w-[420px]"
                  onClick={() => setSelectedVideo(v.youtubeId)}
                  onMouseEnter={() => setHoveredVideo(`${v.id}-${index}`)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  <div className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden mb-4 md:mb-6 shadow-xl md:shadow-2xl border-2 border-[#D4A373]/20 bg-black">
                    <motion.img
                      animate={hoveredVideo === `${v.id}-${index}` ? { scale: 1.2 } : { scale: 1 }}
                      transition={{ duration: 0.7 }}
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={hoveredVideo === `${v.id}-${index}` ? { opacity: 0.5 } : { opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-[#D4A373]/60 via-[#A68966]/50 to-[#8B7355]/60"
                    />

                    {/* Play Button */}
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
                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className="absolute inset-0 bg-gradient-to-br from-[#D4A373] to-[#A68966] rounded-full"
                        />

                        <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#EBE3D5] to-[#F5EFE7] rounded-full flex items-center justify-center shadow-2xl border-3 md:border-4 border-[#D4A373] overflow-hidden">
                          <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#D4A373]/50 to-transparent skew-x-12"
                          />
                          <Play size={20} className="text-[#3D2F2B] ml-1 relative z-10 md:w-6 md:h-6" fill="currentColor" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Frame corners */}
                    {hoveredVideo === `${v.id}-${index}` && (
                      <>
                        {[
                          { top: "0.5rem", left: "0.5rem", rotate: 0 },
                          { top: "0.5rem", right: "0.5rem", rotate: 90 },
                          { bottom: "0.5rem", left: "0.5rem", rotate: -90 },
                          { bottom: "0.5rem", right: "0.5rem", rotate: 180 },
                        ].map((pos, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="hidden md:block absolute w-5 md:w-6 h-5 md:h-6 border-t-3 border-l-3 border-[#D4A373]"
                            style={{ ...pos, transform: `rotate(${pos.rotate}deg)` }}
                          />
                        ))}
                      </>
                    )}
                  </div>

                  {/* Badge catégorie */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="inline-block bg-gradient-to-r from-[#D4A373] to-[#A68966] backdrop-blur-xl px-3 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm text-white font-bold mb-3 md:mb-4 border border-white/20 shadow-lg"
                  >
                    {v.category}
                  </motion.div>
                  <h4 className="font-bold text-lg md:text-2xl text-[#EBE3D5] leading-tight line-clamp-2">{v.title}</h4>
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,163,115,0.1)_0%,transparent_70%)]" />

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 md:-top-20 right-0 z-10"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#EBE3D5] to-[#F5EFE7] rounded-full flex items-center justify-center text-[#3D2F2B] border-3 md:border-4 border-[#D4A373] shadow-2xl">
                  <X size={24} strokeWidth={3} className="md:w-8 md:h-8" />
                </div>
              </motion.button>

              {/* Video container */}
              <div className="relative">
                <div className="relative bg-black rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-[#D4A373]/50 shadow-[0_20px_60px_rgba(0,0,0,0.8)] md:shadow-[0_40px_80px_rgba(0,0,0,0.8)]">
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
                  { top: "-0.5rem", left: "-0.5rem", rotate: 0 },
                  { top: "-0.5rem", right: "-0.5rem", rotate: 90 },
                  { bottom: "-0.5rem", left: "-0.5rem", rotate: -90 },
                  { bottom: "-0.5rem", right: "-0.5rem", rotate: 180 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="hidden md:block absolute w-10 md:w-12 h-10 md:h-12 border-t-4 border-l-4 border-[#D4A373]"
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