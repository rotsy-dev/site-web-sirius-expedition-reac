import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, Loader2, ArrowRight, Bird } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { TourModal, getDetailedTour, ExtendedTourSpecialty } from "./TourModal"
import { useTranslatedContent } from "../../hooks/useTranslatedContent"
import { useTranslation } from "react-i18next"

interface TourSpecialty {
  id: number
  title: string
  description: string
  image: string
  category?: string
  isBestSeller?: boolean
}

interface TourSpecialtiesProps {
  specialties: TourSpecialty[]
  initialSelectedTour?: ExtendedTourSpecialty | null
  content?: any
  onNavigateToQuote?: () => void
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1600&q=80";

export function TourSpecialties({ specialties, initialSelectedTour, content, onNavigateToQuote }: TourSpecialtiesProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang, slug } = useParams<{ lang: string; slug?: string }>();
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [selectedTour, setSelectedTour] = useState<ExtendedTourSpecialty | null>(initialSelectedTour || null);

  useEffect(() => {
    if (HERO_IMAGE) {
      const img = new Image();
      img.onload = () => setHeroImageLoaded(true);
      img.onerror = () => setHeroImageLoaded(true);
      img.src = HERO_IMAGE;
      const timeout = setTimeout(() => setHeroImageLoaded(true), 100);
      return () => clearTimeout(timeout);
    } else {
      setHeroImageLoaded(true);
    }
  }, []);

  const { translatedContent: translatedSpecialties, isLoading: isTranslatingSpecialties } = useTranslatedContent(
    specialties,
    ['title', 'description', 'category']
  );

  const { translatedContent: translatedSpecialtiesHeader } = useTranslatedContent(
    content?.pageHeaders?.specialties ?? null,
    ['badge', 'title', 'subtitle']
  );

  const displaySpecialties = (translatedSpecialties || specialties) as TourSpecialty[];
  const header = translatedSpecialtiesHeader || content?.pageHeaders?.specialties || {};

  useEffect(() => {
    if (initialSelectedTour) {
      setSelectedTour(initialSelectedTour);
    }
  }, [initialSelectedTour]);

  useEffect(() => {
    if (!slug) return;
    const found: any = (displaySpecialties as any[]).find((x) => String((x as any).slug || (x as any).id) === String(slug));
    if (found) {
      setSelectedTour(getDetailedTour(found));
    }
  }, [slug, displaySpecialties]);

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const categories = ["Tous", "Nature", "Culture", "Aventure", "Photography"];

  const categoryLabelMap: Record<string, string> = {
    "Tous": t('tourSpecialties.categories.all'),
    "Nature": t('tourSpecialties.categories.nature'),
    "Culture": t('tourSpecialties.categories.culture'),
    "Aventure": t('tourSpecialties.categories.adventure'),
    "Photography": t('tourSpecialties.categories.photography'),
  };

  const smartSpecialties = displaySpecialties.map((specialty) => ({
    ...specialty,
    category: specialty.category || "Nature"
  }));

  const filteredSpecialties = smartSpecialties.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "Tous" || s.category === selectedCategory || (selectedCategory === "Photography" && s.title.includes("Photo"));
    return matchSearch && matchCat;
  });

  const handleOpenModal = (specialty: any) => {
    const extended = getDetailedTour(specialty);
    setSelectedTour(extended);
    const target = String((specialty as any).slug || (specialty as any).id);
    navigate(`/${lang || 'en'}/tours/${target}`);
  };

  const handleCloseModal = () => {
    setSelectedTour(null);
    navigate(`/${lang || 'en'}/tours`);
  };

  return (
    <>
      {/* Hero - Style Wilderness minimaliste */}
      <section className="relative h-screen flex items-end overflow-hidden bg-[#E5D8C0]">
        <div className="absolute inset-0">
          {HERO_IMAGE ? (
            <img
              src={HERO_IMAGE}
              alt="Madagascar landscape"
              className={`w-full h-full object-cover transition-opacity duration-500 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              style={{ filter: 'brightness(0.5) contrast(1.1)' }}
              loading="eager"
            />
          ) : (
            <div className="w-full h-full bg-[#0a0806]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 pb-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Badge */}
            <div className="mb-6">
              <span className="text-xs font-light text-[#F0E7D5]/60 uppercase tracking-[0.3em]">
                {header.badge || t('sections.specialties')}
              </span>
              <div className="h-px w-16 bg-[#F0E7D5]/30 mt-3" />
            </div>

            {/* Titre */}
            <h1 className="text-5xl lg:text-8xl xl:text-9xl font-light text-[#F0E7D5] mb-8 leading-[1.05] tracking-tight max-w-5xl">
              {header.title || t('sections.specialties')}
            </h1>

            {/* Sous-titre */}
            <p className="text-lg lg:text-xl text-[#F0E7D5]/70 max-w-2xl font-light leading-relaxed">
              {header.subtitle || t('sections.specialtiesSubtitle')}
            </p>

            {isTranslatingSpecialties && (
              <div className="flex items-center gap-2 mt-6 text-sm text-[#F0E7D5]/60 font-light">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="uppercase tracking-[0.15em] text-xs">{t('common.loading')}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 flex flex-col items-center lg:items-start gap-4"
        >
          <span className="text-[#F0E7D5]/40 text-[10px] font-light uppercase tracking-[0.3em] lg:-rotate-90">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-[#F0E7D5]/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* Original Section */}
      <section className="py-20 sm:py-24 md:py-32 glass-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Filter UI */}
          <div className="max-w-4xl mx-auto mb-16 p-4 sm:p-5 md:p-6 glass-panel glass-border rounded-3xl flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-[#8B7355]" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-5 py-5 bg-white/65 border border-[#4B3935]/15 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all text-lg font-medium shadow-md hover:shadow-lg"
                placeholder={t('tourSpecialties.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative min-w-[240px]">
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                <ChevronDown className="h-6 w-6 text-[#8B7355]" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-6 pr-12 py-5 bg-white/65 border border-[#4B3935]/15 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] appearance-none cursor-pointer transition-all text-lg font-bold shadow-md hover:shadow-lg"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabelMap[cat] || cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4B3935]/40 pointer-events-none" />
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-4"
          >
            <AnimatePresence>
              {filteredSpecialties.map((specialty) => (
                <motion.div
                  layout
                  key={specialty.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onHoverStart={() => setHoveredId(specialty.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="group h-full"
                >
                  <div className="journal-card relative transition-all duration-500 h-full flex flex-col hover:-translate-y-1">
                    <div className="absolute inset-3 rounded-[22px] border border-dashed border-[#4B3935]/20 pointer-events-none" />
                    <div className="relative p-4 pt-4">
                      <div className="relative h-60 overflow-hidden rounded-3xl border border-[#4B3935]/10">
                        <motion.img
                          animate={hoveredId === specialty.id ? { scale: 1.05 } : { scale: 1 }}
                          transition={{ duration: 0.6 }}
                          src={specialty.image}
                          alt={specialty.title}
                          className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/70 via-[#1a1410]/20 to-transparent" />

                        {/* Badge Best Seller */}
                        {specialty.isBestSeller && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="journal-stamp">
                              {t('tourSpecialties.bestSeller')}
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                          <div className="journal-ribbon">
                            <Bird className="w-4 h-4 text-[#D4A574]" />
                            <span className="text-[11px] font-black tracking-wide uppercase">
                              {specialty.category || 'Expedition'}
                            </span>
                          </div>
                        </div>

                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl" />
                      </div>
                    </div>

                    <div className="px-6 pb-6 md:px-7 md:pb-7 flex-1 flex flex-col items-start">
                      <h3 className="text-2xl md:text-2xl font-black text-[#332C26] mb-2 tracking-tight leading-tight">
                        {specialty.title}
                      </h3>

                      <p className="text-[#332C26]/70 leading-relaxed text-sm md:text-base font-medium mb-6 flex-1">
                        {specialty.description}
                      </p>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleOpenModal(specialty)}
                        className="w-auto px-6 py-2 md:px-8 md:py-3 bg-[#443C34] text-white rounded-xl font-black text-sm md:text-lg transition-all duration-300 hover:w-full hover:bg-[#332C26] shadow-lg shadow-black/10 whitespace-nowrap overflow-hidden flex items-center justify-center cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          {t('tourSpecialties.discoverMore')}
                          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Modal */}
          <AnimatePresence>
            {selectedTour && (
              <TourModal 
                tour={selectedTour} 
                onClose={handleCloseModal}
                onNavigateToQuote={onNavigateToQuote}
              />
            )}
          </AnimatePresence>

          {filteredSpecialties.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-gray-500 mb-4">
                {t('tourSpecialties.noResults')}
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("Tous"); }}
                className="text-[#443C34] font-bold underline text-lg hover:text-[#332C26]"
              >
                {t('tourSpecialties.resetFilters')}
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}