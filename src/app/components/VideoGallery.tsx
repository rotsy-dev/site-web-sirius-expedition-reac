import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Youtube, Film, Sparkles, Monitor, Award, Zap } from 'lucide-react';
import type { Video } from '../../types/content';

interface VideoGalleryProps {
  videos: Video[];
  config: {
    videos: {
      mainYouTubeId: string;
      channelUrl: string;
    };
  };
}

export function VideoGallery({ videos, config }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background cinématique */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

      {/* Grille luminescente */}
      <motion.div
        animate={{
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      {/* Projecteurs lumineux */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [-100, 100, -100],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-gradient-to-br from-red-500/30 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.15, 0.3, 0.15],
          x: [100, -100, 100],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 right-1/4 w-[55rem] h-[55rem] bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header cinématique */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          {/* Badge premium */}
          <motion.div
            initial={{ scale: 0, rotate: -180, y: -50 }}
            whileInView={{ scale: 1, rotate: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-8"
          >
            <div className="relative group/badge">
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 360],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute -inset-3 bg-gradient-to-r from-red-500 via-purple-500 to-red-500 rounded-full blur-2xl"
              />
              
              <div className="relative bg-gradient-to-r from-red-50 via-purple-50 to-red-50 dark:from-red-950 dark:via-purple-950 dark:to-red-950 px-10 py-4 rounded-full border-2 border-red-300/50 dark:border-red-700/50 shadow-2xl backdrop-blur-xl overflow-hidden">
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                />
                
                <span className="relative text-red-900 dark:text-red-100 font-black text-base tracking-widest uppercase flex items-center gap-3">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Film size={22} className="text-red-600" />
                  </motion.span>
                  Video Gallery
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Monitor size={22} className="text-purple-600" />
                  </motion.span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Titre spectaculaire */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-8 font-black leading-[0.9]"
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="bg-gradient-to-r from-white via-gray-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent block mb-3"
            >
              See Madagascar
            </motion.span>
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
              className="bg-gradient-to-r from-red-400 via-purple-400 to-red-400 bg-[length:200%_100%] bg-clip-text text-transparent block"
            >
              Come Alive
            </motion.span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 text-gray-400 max-w-3xl mx-auto text-xl font-medium"
          >
            <Sparkles className="w-6 h-6 text-red-400" />
            <p>Immerse yourself in breathtaking adventures captured on film</p>
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
        </motion.div>

        {/* Featured Video Principal */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <div className="relative group/main">
            {/* Glow massif */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute -inset-8 bg-gradient-to-r from-red-500 via-purple-500 to-red-500 rounded-[3rem] blur-3xl"
            />

            {/* Container */}
            <motion.div
              whileHover={{ y: -12 }}
              className="relative bg-gray-900/50 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden border border-gray-700/50 shadow-2xl"
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
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg"
                  />
                  <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 rounded-2xl shadow-2xl overflow-hidden border border-amber-200/50">
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
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
                { top: '2rem', left: '2rem', rotate: 0 },
                { top: '2rem', right: '2rem', rotate: 90 },
                { bottom: '2rem', left: '2rem', rotate: -90 },
                { bottom: '2rem', right: '2rem', rotate: 180 }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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
                {/* Glow animé au hover */}
                <motion.div
                  animate={{
                    opacity: hoveredVideo === String(video.id) ? 0.6 : 0,
                    scale: hoveredVideo === String(video.id) ? 1.1 : 0.8
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute -inset-3 bg-gradient-to-r from-red-500 via-purple-500 to-red-500 rounded-3xl blur-2xl"
                />

                {/* Card */}
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="relative bg-gray-900/70 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl group-hover/card:border-red-500/50 transition-all duration-500 h-full"
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
                        rotate: { duration: 0.6 }
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
                            repeat: Infinity,
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
                            repeat: Infinity,
                            delay: 0.5,
                          }}
                          className="absolute inset-0 bg-red-500 rounded-full"
                        />
                        
                        {/* Button principal */}
                        <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-red-500 overflow-hidden">
                          <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
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
                      <h3 className="text-white font-black text-xl leading-tight drop-shadow-lg">
                        {video.title}
                      </h3>
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
                                repeat: Infinity,
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
                          { top: '1rem', left: '1rem', rotate: 0 },
                          { top: '1rem', right: '1rem', rotate: 90 },
                          { bottom: '1rem', left: '1rem', rotate: -90 },
                          { bottom: '1rem', right: '1rem', rotate: 180 }
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

        {/* YouTube CTA spectaculaire */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.a
            href={config.videos.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.08, y: -8 }}
            whileTap={{ scale: 0.95 }}
            className="group/yt inline-block relative"
          >
            {/* Glow externe */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute -inset-4 bg-red-600 rounded-full blur-2xl"
            />
            
            <div className="relative bg-red-600 px-12 py-6 rounded-full shadow-2xl flex items-center gap-4 overflow-hidden border-2 border-red-400">
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
              
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Youtube size={32} className="text-white relative z-10" />
              </motion.div>
              <span className="text-white font-black text-xl relative z-10">Visit Our YouTube Channel</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10"
              >
                <Zap size={24} className="text-white fill-white" />
              </motion.div>
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
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Close button spectaculaire */}
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-20 right-0 z-10 group/close"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 bg-red-500 rounded-full blur-xl"
                  />
                  <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center text-red-600 border-4 border-red-500 shadow-2xl">
                    <X size={32} strokeWidth={3} />
                  </div>
                </div>
              </motion.button>

              {/* Video container */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="absolute -inset-8 bg-gradient-to-r from-red-500 via-purple-500 to-red-500 rounded-[3rem] blur-3xl"
                />
                
                <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-red-500/50">
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
                  { top: '-1rem', left: '-1rem', rotate: 0 },
                  { top: '-1rem', right: '-1rem', rotate: 90 },
                  { bottom: '-1rem', left: '-1rem', rotate: -90 },
                  { bottom: '-1rem', right: '-1rem', rotate: 180 }
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
  );
}