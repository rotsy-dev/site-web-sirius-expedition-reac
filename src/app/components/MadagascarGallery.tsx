// ============================================
// MADAGASCAR GALLERY - Style Wilderness Mocha Premium
// ============================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GalleryImage { id: number; src: string; alt: string; category?: string; }
interface MadagascarGalleryProps {
  content?: {
    pageHeaders?: { gallery?: { badge?: string; title?: string; subtitle?: string; }; };
    imageGallery?: GalleryImage[];
  };
}

const DEFAULT_IMAGES: GalleryImage[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80', alt: 'Black-and-white Ruffed Lemur', category: 'wildlife' },
  { id: 2, src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=80', alt: 'Rice terraces', category: 'landscape' },
  { id: 3, src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80', alt: 'Safari', category: 'safari' },
  { id: 4, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', alt: 'Baobab sunset', category: 'landscape' },
  { id: 5, src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', alt: 'Beach boats', category: 'beach' },
  { id: 6, src: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80', alt: 'Sailboat', category: 'beach' },
];

const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export function MadagascarGallery({ content = {} }: MadagascarGalleryProps) {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [imagesToShow, setImagesToShow] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
    if (!isMobile()) setImagesToShow(999);
  }, []);

  const header = content?.pageHeaders?.gallery || {};
  const imageGallery = content?.imageGallery;
  const allImages = (imageGallery && Array.isArray(imageGallery) && imageGallery.length > 0) ? imageGallery : DEFAULT_IMAGES;
  const images = allImages.slice(0, imagesToShow);
  const hasMore = imagesToShow < allImages.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setImagesToShow(prev => Math.min(prev + 6, allImages.length));
      setIsLoadingMore(false);
    }, 300);
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
      <section className="min-h-screen w-full py-32 relative overflow-hidden bg-[#E5D8C0]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="mb-6">
              <span className="text-[10px] font-light text-[#5d4a42]/60 uppercase tracking-[0.3em]">
                {header.badge || t('gallery.badge')}
              </span>
              <div className="h-px w-12 bg-[#5d4a42]/20 mt-2" />
            </div>

            <h2 className="text-5xl lg:text-7xl font-light text-[#5d4a42] mb-6 leading-[1.1] tracking-tight max-w-4xl">
              {header.title || t('gallery.title')}
            </h2>

            <p className="text-lg text-[#5d4a42]/70 max-w-2xl font-light leading-relaxed">
              {header.subtitle || t('gallery.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
            {images.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onClick={() => handleImageClick(photo, index)}
                className="relative overflow-hidden cursor-pointer group aspect-[4/5]"
              >
                <motion.img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.85) contrast(1.05)', display: 'block' }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  loading={index < 6 ? "eager" : "lazy"}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#3d2f2b]/90 via-[#3d2f2b]/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  {photo.category && (
                    <div className="mb-2">
                      <span className="text-[9px] font-light text-[#E5D8C0]/60 uppercase tracking-[0.25em]">
                        {photo.category}
                      </span>
                    </div>
                  )}
                  <p className="text-[#E5D8C0] text-base lg:text-lg font-light leading-tight line-clamp-2">
                    {photo.alt}
                  </p>
                </div>

                <div className="absolute inset-0 border border-[#E5D8C0]/0 group-hover:border-[#E5D8C0]/30 transition-all duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {mobile && hasMore && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-16">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="flex items-center gap-3 text-[#5d4a42] text-sm font-light uppercase tracking-[0.2em] border-b border-[#5d4a42]/30 hover:border-[#5d4a42] pb-2 transition-all duration-300 disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <span>{t('gallery.loadMore')}</span>
                    <span className="text-xs opacity-60">({allImages.length - imagesToShow})</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-[#3d2f2b]/98"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 z-50 w-12 h-12 border border-[#E5D8C0]/30 hover:bg-[#E5D8C0]/10 flex items-center justify-center text-[#E5D8C0] transition-all"
            >
              <X size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 border border-[#E5D8C0]/30 hover:bg-[#E5D8C0]/10 flex items-center justify-center text-[#E5D8C0] transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 border border-[#E5D8C0]/30 hover:bg-[#E5D8C0]/10 flex items-center justify-center text-[#E5D8C0] transition-all"
            >
              <ChevronRight size={20} />
            </button>

            <div className="flex items-center justify-center h-full p-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-7xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={selectedImage.src} alt={selectedImage.alt} className="max-w-full max-h-[85vh] object-contain" />

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 p-8"
                >
                  {selectedImage.category && (
                    <span className="text-[9px] font-light text-[#E5D8C0]/60 uppercase tracking-[0.25em] block mb-2">
                      {selectedImage.category}
                    </span>
                  )}
                  <h3 className="text-[#E5D8C0] text-xl font-light mb-2">{selectedImage.alt}</h3>
                  <p className="text-[#E5D8C0]/60 text-sm font-light">{currentIndex + 1} / {allImages.length}</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}