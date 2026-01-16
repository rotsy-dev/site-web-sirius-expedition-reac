import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category?: string;
}

interface MadagascarGalleryProps {
  content?: {
    pageHeaders?: {
      gallery?: {
        badge?: string;
        title?: string;
        subtitle?: string;
      };
    };
    imageGallery?: GalleryImage[];
  };
}

const DEFAULT_IMAGES: GalleryImage[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80', alt: 'Black-and-white Ruffed Lemur', category: 'wildlife' },
  { id: 2, src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80', alt: 'Rice terraces Madagascar', category: 'landscape' },
  { id: 3, src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80', alt: 'Safari Madagascar', category: 'safari' },
  { id: 4, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', alt: 'Baobab trees sunset', category: 'landscape' },
  { id: 5, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', alt: 'Beach with traditional boats', category: 'beach' },
  { id: 6, src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80', alt: 'Traditional sailboat', category: 'beach' },
  { id: 7, src: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80', alt: 'Madagascar landscape', category: 'landscape' },
  { id: 8, src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80', alt: 'Tour guide with travelers', category: 'guides' },
  { id: 9, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', alt: 'Travel agency tour', category: 'tours' }
];

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function MadagascarGallery({ content = {} }: MadagascarGalleryProps) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [imagesToShow, setImagesToShow] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
    if (!isMobile()) {
      setImagesToShow(999);
    }
  }, []);

  const header = content?.pageHeaders?.gallery || {};
  const imageGallery = content?.imageGallery;
  const allImages = (imageGallery && Array.isArray(imageGallery) && imageGallery.length > 0)
    ? imageGallery
    : DEFAULT_IMAGES;

  const images = allImages.slice(0, imagesToShow);
  const hasMore = imagesToShow < allImages.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setImagesToShow(prev => Math.min(prev + 3, allImages.length));
      setIsLoadingMore(false);
    }, 300);
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: mobile ? 0.95 : 0.8, y: mobile ? 10 : 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: mobile ? 0.3 : 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % allImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(allImages[nextIndex]);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(allImages[prevIndex]);
  };

  return (
    <>
      <section className="min-h-screen w-full py-20 md:py-32 relative overflow-hidden bg-[#F5EFE6]">

        {/* Pattern baobab subtil */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 10 L55 40 L50 35 L45 45 L60 50 L75 45 L70 35 L65 40 Z M60 50 L60 90 M50 70 L40 75 M70 70 L80 75 M55 95 Q60 100 65 95' stroke='%234B3935' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px'
          }}
        />

        {/* Grain photographique */}
        <div
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-white text-xs md:text-sm font-bold tracking-wider mb-4 shadow-lg"
            >
              {header.badge || t('gallery.badge')}
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#4B3935] mb-4 tracking-tight">
              {header.title || t('gallery.title')}
            </h2>
            <p className="text-lg md:text-xl text-[#8B7355] max-w-2xl mx-auto font-medium">
              {header.subtitle || t('gallery.subtitle')}
            </p>
          </motion.div>

          {/* Photo Grid - Style Masonry comme Pexels */}
          <div
            className="masonry-grid"
            style={{
              columnCount: 2,
              columnGap: '1rem'
            }}
          >
            <style>{`
              @media (min-width: 768px) {
                .masonry-grid {
                  column-count: 3 !important;
                  column-gap: 1.5rem !important;
                }
              }
              @media (min-width: 1024px) {
                .masonry-grid {
                  column-count: 4 !important;
                  column-gap: 1.5rem !important;
                }
              }
              @media (min-width: 1280px) {
                .masonry-grid {
                  column-count: 5 !important;
                  column-gap: 1.5rem !important;
                }
              }
              .masonry-item {
                break-inside: avoid;
                margin-bottom: 1rem;
              }
              @media (min-width: 768px) {
                .masonry-item {
                  margin-bottom: 1.5rem;
                }
              }
            `}</style>

            {images.map((photo, index) => (
              <motion.div
                key={photo.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={mobile ? {} : { scale: 1.05, zIndex: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleImageClick(photo, index)}
                className="masonry-item relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                <div className="relative w-full">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ display: 'block' }}
                    loading={index < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icône zoom - seulement sur desktop */}
                  {!mobile && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                        <ZoomIn className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Titre de l'image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-bold drop-shadow-lg">{photo.alt}</p>
                    {photo.category && (
                      <span className="text-xs text-white/80 mt-1 inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                        {photo.category}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bouton "Charger plus" sur mobile */}
          {mobile && hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-12"
            >
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    {t('gallery.loadMore')}
                    <span className="text-sm opacity-80">({allImages.length - imagesToShow})</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Modal plein écran */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <X size={24} />
            </motion.button>

            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <ChevronLeft size={28} />
            </motion.button>

            <motion.button
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
            >
              <ChevronRight size={28} />
            </motion.button>

            <div className="flex items-center justify-center h-full p-8 md:p-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-7xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg"
                >
                  <h3 className="text-white text-2xl font-bold mb-2">{selectedImage.alt}</h3>
                  {selectedImage.category && (
                    <span className="text-white/80 text-sm px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                      {selectedImage.category}
                    </span>
                  )}
                  <p className="text-white/60 text-sm mt-2">
                    {currentIndex + 1} / {allImages.length}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}