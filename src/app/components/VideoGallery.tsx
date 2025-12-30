"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, X, Film, Sparkles, Monitor, Award } from "lucide-react"
import type { Video } from "../../types/content"
import { SectionHeader } from "@/components/common/SectionHeader"

interface VideoGalleryProps {
  videos: Video[]
  config: {
    videos: {
      mainYouTubeId: string
      channelUrl: string
    }
  }
  content?: {
    pageHeaders?: {
      videos?: {
        badge?: string;
        title?: string;
        subtitle?: string;
      };
    };
  };
}

export function VideoGallery({ videos, config, content = {} }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)

  return (
    <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#443C34] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* En-tête */}
        <SectionHeader
          badge={content.pageHeaders?.videos?.badge || 'Video Gallery'}
          title={content.pageHeaders?.videos?.title || 'See Madagascar Come Alive'}
          subtitle={content.pageHeaders?.videos?.subtitle || 'Immerse yourself in breathtaking adventures captured on film'}
          badgeColor="text-white border-white"
          titleColor="text-white"
          subtitleColor="text-white/80"
        />

        {/* Featured Video Principal */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="relative group/main">
            {/* Container */}
            <motion.div
              whileHover={{ y: -12 }}
              className="relative bg-white/5 backdrop-blur-xl rounded-[3rem] overflow-hidden border border-white/10"
            >
              {/* Video embed */}
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${config.videos.mainYouTubeId}`}
                  title="Sirius Expedition - Main Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Badge Featured premium */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute top-8 left-8"
              >
                <div className="relative group/badge-main">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute inset-0 bg-red-500 rounded-full blur-lg"
                  />
                  <div className="relative bg-red-500 px-6 py-3 rounded-2xl shadow-2xl overflow-hidden border border-red-200/50">
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                    <span className="relative text-white font-black text-base flex items-center gap-2">
                      <Award size={20} className="fill-white" />
                      Featured Video
                    </span>
                  </div>
                </div>
              </motion.div>

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
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="absolute w-8 h-8 border-t-4 border-l-4 border-red-400"
                  style={{ ...pos, transform: `rotate(${pos.rotate}deg)` }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Grid de vidéos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="group/card cursor-pointer"
              onClick={() => setSelectedVideo(video.youtubeId)}
              onMouseEnter={() => setHoveredVideo(String(video.id))}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className="relative h-full">
                {/* Card */}
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group-hover/card:border-red-500/50 transition-all duration-500 h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    {/* Image */}
                    <motion.img
                      animate={hoveredVideo === String(video.id) ? { scale: 1.15 } : { scale: 1 }}
                      transition={{ duration: 0.7 }}
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={hoveredVideo === String(video.id) ? { opacity: 0.4 } : { opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-red-500/50 via-purple-500/50 to-red-500/50"
                    />

                    {/* Play Button spectaculaire */}
                    <motion.div
                      animate={{
                        scale: hoveredVideo === String(video.id) ? 1.3 : 1,
                        rotate: hoveredVideo === String(video.id) ? 360 : 0,
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
                          className="absolute inset-0 bg-white rounded-full"
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
                          className="absolute inset-0 bg-red-500 rounded-full"
                        />

                        {/* Button principal */}
                        <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-red-500 overflow-hidden">
                          <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-red-200/50 to-transparent skew-x-12"
                          />
                          <Play size={32} className="text-red-600 ml-1 relative z-10" fill="currentColor" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Contenu */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block bg-gradient-to-r from-red-500/90 to-purple-500/90 backdrop-blur-xl px-4 py-2 rounded-full text-sm text-white font-bold mb-3 border border-white/20 shadow-lg"
                      >
                        {video.category}
                      </motion.div>
                      <h3 className="text-white font-black text-xl leading-tight drop-shadow-lg">{video.title}</h3>
                    </div>

                    {/* Particules explosives */}
                    <AnimatePresence>
                      {hoveredVideo === String(video.id) && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(16)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0],
                                x: Math.cos((i / 16) * Math.PI * 2) * 120,
                                y: Math.sin((i / 16) * Math.PI * 2) * 120,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 1.5,
                                delay: (i % 4) * 0.1,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 0.5,
                              }}
                              className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-400 rounded-full shadow-lg"
                            />
                          ))}
                        </div>
                      )}
                    </AnimatePresence>

                    {/* Frame corners */}
                    {hoveredVideo === String(video.id) && (
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
                            className="absolute w-6 h-6 border-t-3 border-l-3 border-red-400"
                            style={{ ...pos, transform: `rotate(${pos.rotate}deg)` }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* YouTube CTA */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.a
            href={config.videos.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <div className="bg-[#F5E6D3] text-[#443C34] px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#EBD8C0] transition-colors">
              Visit Our YouTube Channel
            </div>
          </motion.a>
        </motion.div>
      </div>

      {/* Modal Video */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/97 backdrop-blur-2xl"
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-20 right-0 z-10"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 border-4 border-red-500">
                  <X size={32} strokeWidth={3} />
                </div>
              </motion.button>

              {/* Video container */}
              <div className="relative">
                <div className="relative bg-black rounded-3xl overflow-hidden border-4 border-red-500/50">
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                      title="Video Player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
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
                    className="absolute w-12 h-12 border-t-4 border-l-4 border-red-400"
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
