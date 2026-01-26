// ============================================
// VIDEO GALLERY - Style Wilderness Mocha Premium
// ============================================
"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Play, X, Loader2, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useTranslatedContent } from "@/hooks/useTranslatedContent"

interface Video { id: string; youtubeId: string; thumbnail: string; title: string; category: string; }
interface VideoGalleryProps {
  videos: Video[]
  config: any
  onNavigateToContact?: () => void
  content?: { pageHeaders?: { videos?: { badge?: string; title?: string; subtitle?: string; } } }
}

export function VideoGallery({ videos, config, onNavigateToContact, content = {} }: VideoGalleryProps) {
  const { t } = useTranslation()
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const [showAllVideos, setShowAllVideos] = useState(false)

  const { translatedContent: translatedVideos, isLoading: isTranslatingVideos } = useTranslatedContent(videos, ['title', 'category'])
  const { translatedContent: translatedVideosHeader } = useTranslatedContent(content?.pageHeaders?.videos ?? null, ['badge', 'title', 'subtitle'])

  const displayVideos = (translatedVideos || videos) as Video[]
  const videosToShow = showAllVideos ? displayVideos : displayVideos.slice(0, 4)
  const header = (translatedVideosHeader as { badge?: string; title?: string; subtitle?: string } | null) || content?.pageHeaders?.videos || {}

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-screen w-full overflow-hidden bg-[#3d2f2b]">
        <div className="absolute inset-0 w-full h-full">
          <iframe
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto"
            src={`https://www.youtube.com/embed/${config.videos.mainYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${config.videos.mainYouTubeId}&controls=0&rel=0&modestbranding=1&showinfo=0`}
            allow="autoplay; encrypted-media"
            title="Hero Video"
            frameBorder="0"
            style={{ pointerEvents: 'none', border: 'none', transform: 'translate(-50%, -50%)', aspectRatio: '16/9', filter: 'brightness(0.6) contrast(1.1)' }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#3d2f2b]/80 via-[#3d2f2b]/40 to-[#3d2f2b]/90" />

        <div className="relative z-10 h-full flex items-end pb-40 px-6 lg:px-12">
          <div className="max-w-[1600px] mx-auto w-full">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <div className="mb-6">
                <span className="text-xs font-light text-[#E5D8C0]/60 uppercase tracking-[0.3em]">{header.badge}</span>
                <div className="h-px w-16 bg-[#E5D8C0]/30 mt-3" />
              </div>

              <h1 className="text-5xl lg:text-8xl xl:text-9xl font-light text-[#E5D8C0] mb-8 leading-[1.05] tracking-tight max-w-5xl">
                {header.title}
              </h1>

              <p className="text-lg lg:text-xl text-[#E5D8C0]/70 max-w-2xl font-light leading-relaxed mb-12">{header.subtitle}</p>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 flex flex-col items-center lg:items-start gap-4"
        >
          <span className="text-[#E5D8C0]/40 text-[10px] font-light uppercase tracking-[0.3em] lg:-rotate-90">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-[#E5D8C0]/60 to-transparent"
          />
        </motion.div>

        {isTranslatingVideos && (
          <div className="absolute top-8 right-8 flex items-center gap-2 text-sm text-[#E5D8C0]/60 font-light">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="uppercase tracking-[0.15em] text-xs">{t('common.loading')}</span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] bg-[#3d2f2b] flex items-center justify-center" onClick={() => setSelectedVideo(null)}>
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-8 right-8 w-12 h-12 border border-[#E5D8C0]/30 hover:bg-[#E5D8C0]/10 flex items-center justify-center text-[#E5D8C0] transition-all z-50"
            >
              <X size={20} />
            </button>

            <div className="w-full h-full" onClick={(e) => e.stopPropagation()}>
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="Video Player"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}