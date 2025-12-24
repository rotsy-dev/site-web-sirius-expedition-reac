import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Youtube, Film, Sparkles } from 'lucide-react';
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
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background décoratif */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-foreground to-primary" />

      {/* Grille de points */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, #FFF8F0 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Bulles lumineuses */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge avec animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-full blur-xl"
              />
              <div className="relative bg-card/10 backdrop-blur-xl px-6 py-3 rounded-full border border-primary-foreground/20">
                <span className="text-primary-foreground font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                  <Film size={18} className="animate-pulse" />
                  Video Gallery
                </span>
              </div>
            </div>
          </motion.div>

          {/* Titre */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl lg:text-7xl mb-6 font-black leading-tight"
          >
            <span className="bg-gradient-to-r from-primary-foreground to-background bg-clip-text text-transparent">
              See Madagascar
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-primary-foreground to-accent bg-clip-text text-transparent">
              Come Alive
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed"
          >
            Immerse yourself in breathtaking adventures captured on film
          </motion.p>
        </motion.div>

        {/* Main Featured Video */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent via-primary to-accent rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

            {/* Video container */}
            <div className="relative bg-card/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-primary-foreground/10 shadow-2xl">
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

              {/* Badge "Featured" */}
              <div className="absolute top-6 left-6 bg-gradient-to-r from-primary to-accent px-4 py-2 rounded-full">
                <span className="text-primary-foreground font-bold text-sm flex items-center gap-2">
                  <Sparkles size={16} />
                  Featured Video
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => setSelectedVideo(video.youtubeId)}
              onMouseEnter={() => setHoveredVideo(String(video.id))}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className="relative">
                {/* Glow sur hover */}
                <motion.div
                  animate={{
                    opacity: hoveredVideo === String(video.id) ? 0.4 : 0,
                    scale: hoveredVideo === String(video.id) ? 1 : 0.8
                  }}
                  className="absolute -inset-2 bg-gradient-to-r from-accent to-primary rounded-2xl blur-xl"
                />

                {/* Card principale */}
                <div className="relative bg-card/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-primary-foreground/10 shadow-xl group-hover:border-primary-foreground/30 transition-all duration-500">
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />

                    {/* Play Button */}
                    <motion.div
                      animate={{
                        scale: hoveredVideo === String(video.id) ? 1.2 : 1,
                        rotate: hoveredVideo === String(video.id) ? 90 : 0
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-card rounded-full blur-md opacity-50" />
                        <div className="relative w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-2xl">
                          <Play size={28} className="text-primary ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </motion.div>

                    {/* Contenu */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="inline-block bg-accent/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-primary-foreground mb-3 border border-primary-foreground/20">
                        {video.category}
                      </div>
                      <h3 className="text-primary-foreground font-bold text-lg leading-tight">
                        {video.title}
                      </h3>
                    </div>

                    {/* Effet de particules au hover */}
                    <AnimatePresence>
                      {hoveredVideo === String(video.id) && (
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                x: Math.random() * 200 - 100,
                                y: Math.random() * 200 - 100
                              }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 1.5,
                                delay: i * 0.1,
                                repeat: Infinity
                              }}
                              className="absolute top-1/2 left-1/2 w-1 h-1 bg-primary-foreground rounded-full"
                            />
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* YouTube Channel CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.a
            href={config.videos.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-block relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-destructive via-destructive to-destructive rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="relative bg-destructive px-10 py-5 rounded-full shadow-2xl flex items-center gap-3">
              <Youtube size={28} className="text-destructive-foreground" />
              <span className="text-destructive-foreground font-bold text-lg">Visit Our YouTube Channel</span>
            </div>
          </motion.a>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/95 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-16 right-0 z-10 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-card rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-12 h-12 bg-card/10 backdrop-blur-md border border-primary-foreground/20 rounded-full flex items-center justify-center text-primary-foreground hover:bg-card/20 transition-all">
                    <X size={28} strokeWidth={2.5} />
                  </div>
                </div>
              </motion.button>

              {/* Video container */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent via-primary to-accent rounded-3xl blur-2xl opacity-30" />
                <div className="relative bg-foreground rounded-2xl overflow-hidden shadow-2xl border border-primary-foreground/10">
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}