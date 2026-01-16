"use client"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Play, X, Loader2, Film } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useTranslatedContent } from "@/hooks/useTranslatedContent"

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

export function VideoGallery({ videos, config, onNavigateToContact, content = {} }: VideoGalleryProps) {
  const { t } = useTranslation()
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)
  const [showAllVideos, setShowAllVideos] = useState(false)

  const { translatedContent: translatedVideos, isLoading: isTranslatingVideos } = useTranslatedContent(
    videos,
    ['title', 'category']
  )

  const { translatedContent: translatedVideosHeader } = useTranslatedContent(
    content?.pageHeaders?.videos ?? null,
    ['badge', 'title', 'subtitle']
  )

  const displayVideos = (translatedVideos || videos) as Video[]
  const videosToShow = showAllVideos ? displayVideos : displayVideos.slice(0, 4)
  const header = (translatedVideosHeader as { badge?: string; title?: string; subtitle?: string } | null)
    || content?.pageHeaders?.videos
    || {}

  return (
    <section className="relative overflow-hidden">

      {/* HERO VIDEO - Plein écran SANS bordure */}
      <div className="relative h-screen w-full overflow-hidden bg-black">
        {/* Vidéo en fond - wrapper pour forcer le cover */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto"
            src={`https://www.youtube.com/embed/${config.videos.mainYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${config.videos.mainYouTubeId}&controls=0&rel=0&modestbranding=1&showinfo=0`}
            allow="autoplay; encrypted-media"
            title="Hero Video"
            frameBorder="0"
            style={{
              pointerEvents: 'none',
              border: 'none',
              transform: 'translate(-50%, -50%)',
              aspectRatio: '16/9'
            }}
          />
        </div>

        {/* Overlay sombre pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />

        {/* Contenu centré */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">

          {/* Badge avec icône film */}
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-[#D4A574]/30 mb-8">
            <Film className="text-[#D4A574]" size={20} />
            <span className="text-sm font-bold text-white uppercase tracking-widest">
              {header.badge}
            </span>
          </div>

          {/* Titre principal */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter">
            {header.title?.split(' ')[0]}
          </h1>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#D4A574] mb-8 italic">
            {header.title?.split(' ').slice(1).join(' ')}
          </h2>

          {/* Sous-titre */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-12 font-light">
            {header.subtitle}
          </p>

          {/* Bouton scroll down */}
          <div className="flex flex-col items-center gap-3 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
            </div>
            <span className="text-white/60 text-xs uppercase tracking-wider">Scroll</span>
          </div>
        </div>

        {/* Indicateur de chargement */}
        {isTranslatingVideos && (
          <div className="absolute top-8 right-8 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white z-20">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t('common.loading')}</span>
          </div>
        )}
      </div>

      {/* SECTION VIDÉOS - Style Safari Madagascar */}
      <div className="relative bg-[#F5EFE6]">

        {/* Pattern baobab subtil en background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 10 L55 40 L50 35 L45 45 L60 50 L75 45 L70 35 L65 40 Z M60 50 L60 90 M50 70 L40 75 M70 70 L80 75 M55 95 Q60 100 65 95' stroke='%234B3935' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px'
          }}
        />

        {/* Grain photographique subtil */}
        <div
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        <div className="relative py-20 lg:py-32">

          {/* Titre de section style safari */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-16">
            <div className="flex items-center gap-6 mb-8">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-[#C17A4A]/30 to-[#C17A4A]/30" />
              <h3 className="text-4xl lg:text-6xl font-black text-[#4B3935] tracking-tight">
                {t('sections.videos')}
              </h3>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-[#C17A4A]/30 to-[#C17A4A]/30" />
            </div>
            <p className="text-center text-[#4B3935]/70 text-lg font-light italic">
              {t('sections.videosSubtitle')}
            </p>
          </div>

          {/* Grid Polaroid asymétrique */}
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 auto-rows-[400px]">

              {videosToShow.map((video, index) => {
                const isHovered = hoveredVideo === video.id

                // Rotation aléatoire subtile pour effet polaroid authentique
                const rotation = [1, -1.5, 0.5, -0.5][index % 4]

                return (
                  <div
                    key={video.id}
                    className="group"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={() => setHoveredVideo(video.id)}
                    onMouseLeave={() => setHoveredVideo(null)}
                  >
                    {/* Polaroid wrapper */}
                    <div
                      className="relative h-full bg-white p-3 pb-16 cursor-pointer"
                      style={{
                        boxShadow: isHovered
                          ? '0 20px 60px rgba(75, 57, 53, 0.25), 0 10px 25px rgba(75, 57, 53, 0.15)'
                          : '0 10px 30px rgba(75, 57, 53, 0.15), 0 5px 15px rgba(75, 57, 53, 0.1)',
                        transform: isHovered ? 'scale(1.02) rotate(0deg)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setSelectedVideo(video.youtubeId)}
                    >
                      {/* Image container */}
                      <div className="relative w-full h-[calc(100%-4rem)] overflow-hidden bg-gray-100">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{
                            filter: 'contrast(1.05) saturate(1.1) brightness(0.95)',
                            transition: 'filter 0.3s ease'
                          }}
                        />

                        {/* Overlay hover avec play button */}
                        <div
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100"
                          style={{ transition: 'opacity 0.3s ease' }}
                        >
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                            <Play size={24} className="text-[#4B3935] ml-1" fill="currentColor" />
                          </div>
                        </div>

                        {/* Badge catégorie style timbre */}
                        <div className="absolute top-2 right-2">
                          <div
                            className="bg-[#C17A4A] text-white px-3 py-1 text-[10px] font-black uppercase tracking-wider"
                            style={{
                              clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                            }}
                          >
                            {video.category}
                          </div>
                        </div>
                      </div>

                      {/* Titre manuscrit en bas du polaroid */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p
                          className="text-[#4B3935] text-sm font-medium leading-tight line-clamp-2 text-center"
                          style={{ fontFamily: 'Georgia, serif' }}
                        >
                          {video.title}
                        </p>
                      </div>

                      {/* Effet coin décollé sur hover */}
                      {isHovered && (
                        <div
                          className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#E8DCC4]"
                          style={{
                            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                            boxShadow: '-2px -2px 5px rgba(0,0,0,0.1)'
                          }}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bouton "Voir plus" */}
            {displayVideos.length > 4 && !showAllVideos && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAllVideos(true)}
                  className="inline-flex items-center gap-2 bg-[#4B3935] hover:bg-[#3A2B28] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  <Play size={20} fill="currentColor" />
                  <span>{t('videos.seeMore')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Espace final */}
          {/* <div className="-mt-1" /> */}
        </div>

        
      </div>

      {/* Modal "Toutes les vidéos" */}
      <AnimatePresence>
        {showAllVideos && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowAllVideos(false)}
          >
            <div className="relative w-full max-w-6xl my-8" onClick={(e) => e.stopPropagation()}>
              {/* Header modal */}
              <div className="bg-[#F5EFE6] rounded-t-3xl p-6 flex items-center justify-between sticky top-0 z-10">
                <h3 className="text-2xl font-black text-[#4B3935]">
                  {t('videos.allVideos')}
                </h3>
                <button
                  onClick={() => setShowAllVideos(false)}
                  className="w-10 h-10 bg-[#4B3935] hover:bg-[#3A2B28] rounded-full flex items-center justify-center text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grid dans modal */}
              <div className="bg-[#F5EFE6] rounded-b-3xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2">
                  {displayVideos.map((video) => (
                    <div
                      key={video.id}
                      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                      onClick={() => {
                        setSelectedVideo(video.youtubeId)
                        setShowAllVideos(false)
                      }}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                            <Play size={20} className="text-[#4B3935] ml-1" fill="currentColor" />
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <span className="bg-[#C17A4A] text-white px-2 py-1 text-xs font-bold uppercase rounded">
                            {video.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="text-[#4B3935] font-bold line-clamp-2">
                          {video.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal vidéo fullscreen */}
      <AnimatePresence>
        {selectedVideo && (
          <div
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={() => setSelectedVideo(null)}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-8 right-8 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20 z-50"
            >
              <X size={28} strokeWidth={2.5} />
            </button>

            <div
              className="w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
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