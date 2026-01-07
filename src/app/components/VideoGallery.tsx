"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, X, ArrowRight, Clapperboard, Award, Loader2 } from "lucide-react"
import { useTranslatedContent } from "../../hooks/useTranslatedContent"
import { useTranslation } from "react-i18next"

// Détection mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

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
  const [videoLoaded, setVideoLoaded] = useState(false) // Pour lazy load de la vidéo
  const containerRef = useRef<HTMLDivElement>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(isMobile())
  }, [])

  const { translatedContent: translatedVideos, isLoading: isTranslatingVideos } = useTranslatedContent(
    videos,
    ['title', 'category']
  )

  const { translatedContent: translatedVideosHeader } = useTranslatedContent(
    content?.pageHeaders?.videos ?? null,
    ['badge', 'title', 'subtitle']
  )

  const displayVideos = (translatedVideos || videos) as Video[]
  const header = (translatedVideosHeader as { badge?: string; title?: string; subtitle?: string } | null)
    || content?.pageHeaders?.videos
    || {}

  // Réduire les animations sur mobile
  const animationConfig = mobile ? {
    scale: { duration: 0.3 },
    opacity: { duration: 0.3 }
  } : {
    scale: { duration: 0.7 },
    opacity: { duration: 0.7 }
  }

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
          transition={{ duration: 0.5 }}
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

          {isTranslatingVideos && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[#EBE3D5]/80">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          )}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full z-10">

        {/* BLOC PRINCIPAL - IMAGE PLACEHOLDER AU LIEU DE VIDÉO AUTOPLAY */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center mb-40">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative w-full lg:w-3/4 aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-10 border border-white/10 bg-black"
            onClick={() => setVideoLoaded(true)}
          >
            {!videoLoaded ? (
              <>
                {/* THUMBNAIL YOUTUBE - Beaucoup plus léger qu'une iframe */}
                <img
                  src={`https://img.youtube.com/vi/${config.videos.mainYouTubeId}/maxresdefault.jpg`}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3D2F2B]/60 via-transparent to-transparent" />

                {/* Badge Featured */}
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="absolute top-8 left-8 z-30"
                >
                  <div className="bg-[#A68966] px-6 py-3 rounded-2xl shadow-2xl border border-[#EBE3D5]/50">
                    <span className="text-[#EBE3D5] font-black text-base flex items-center gap-2">
                      <Award size={20} className="fill-[#EBE3D5]" />
                      Featured Video
                    </span>
                  </div>
                </motion.div>

                {/* Bouton Play */}
                <motion.button
                  whileHover={{ scale: mobile ? 1 : 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                >
                  <div className="w-24 h-24 bg-[#EBE3D5] text-[#3D2F2B] rounded-full flex items-center justify-center shadow-2xl border-4 border-[#A68966]">
                    <Play fill="currentColor" size={32} className="ml-1" />
                  </div>
                </motion.button>
              </>
            ) : (
              // Charger la vidéo seulement au clic
              <div className="absolute inset-0 w-full h-full">
                <iframe
                  className="w-full h-full scale-[1.35]"
                  src={`https://www.youtube.com/embed/${config.videos.mainYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${config.videos.mainYouTubeId}&controls=0&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
                  allow="autoplay; encrypted-media"
                  title="Background Video"
                />
              </div>
            )}
          </motion.div>

          {/* CARTE TEXTE */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative w-full lg:w-[480px] lg:-ml-32 mt-[-50px] lg:mt-0 bg-[#EBE3D5] p-10 md:p-14 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.3)] z-20"
          >
            <span className="text-[#A68966] font-bold uppercase tracking-widest text-xs mb-6 block">
              Sirius Experience
            </span>
            <h3 className="text-[#3D2F2B] text-3xl md:text-5xl font-black leading-tight mb-8">
              An authentic <br /> <span className="italic font-serif font-medium">immersion.</span>
            </h3>
            <p className="text-[#3D2F2B]/70 text-lg leading-relaxed mb-10">
              Our circuits are designed for those seeking the soul of Madagascar. A real connection with the land and its inhabitants.
            </p>
            <motion.button
              whileHover={{ scale: mobile ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-4 bg-[#3D2F2B] text-[#EBE3D5] px-10 py-5 rounded-full font-bold text-lg hover:bg-[#2A201D] transition-all group w-full justify-center lg:w-auto"
            >
              Contact us
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>
        </div>

        {/* CAROUSEL - Simplifié sur mobile */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={mobile ? {} : {
                x: [0, -((displayVideos.length * 400) + (displayVideos.length * 32))],
              }}
              transition={mobile ? {} : {
                x: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: displayVideos.length * 8,
                  ease: "linear",
                },
              }}
            >
              {(mobile ? displayVideos : [...displayVideos, ...displayVideos, ...displayVideos]).map((v, index) => (
                <motion.div
                  key={`${v.id}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: mobile ? 0 : (index % displayVideos.length) * 0.1, duration: 0.4 }}
                  whileHover={mobile ? {} : { y: -12, scale: 1.05 }}
                  className="cursor-pointer group flex-shrink-0 w-[400px]"
                  onClick={() => setSelectedVideo(v.youtubeId)}
                  onMouseEnter={() => !mobile && setHoveredVideo(`${v.id}-${index}`)}
                  onMouseLeave={() => setHoveredVideo(null)}
                >
                  <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-xl border border-white/5 bg-black/20">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Play Button simplifié sur mobile */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="w-16 h-16 bg-[#EBE3D5] rounded-full flex items-center justify-center shadow-2xl border-4 border-[#A68966]">
                        <Play size={24} className="text-[#3D2F2B] ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  <div className="inline-block bg-gradient-to-r from-[#A68966]/90 to-[#8B7355]/90 backdrop-blur-xl px-4 py-2 rounded-full text-sm text-[#EBE3D5] font-bold mb-3 border border-white/20 shadow-lg">
                    {v.category}
                  </div>
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
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-20 right-0 z-10 w-16 h-16 bg-[#EBE3D5] rounded-full flex items-center justify-center text-[#3D2F2B] border-4 border-[#A68966]"
              >
                <X size={32} strokeWidth={3} />
              </motion.button>

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}