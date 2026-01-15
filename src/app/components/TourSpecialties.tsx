import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bird, Search, ChevronDown, Loader2 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { TourModal, getDetailedTour, ExtendedTourSpecialty } from "./TourModal"
import { useTranslatedContent } from "../../hooks/useTranslatedContent"
import { useTranslation } from "react-i18next"

// Types
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

  // Modal State
  const [selectedTour, setSelectedTour] = useState<ExtendedTourSpecialty | null>(initialSelectedTour || null);

  // Préchargement immédiat de l'image hero
  useEffect(() => {
    if (HERO_IMAGE) {
      const img = new Image();
      img.onload = () => {
        setHeroImageLoaded(true);
      };
      img.onerror = () => {
        setHeroImageLoaded(true);
      };
      img.src = HERO_IMAGE;
      // Marquer comme chargé rapidement même si l'image n'est pas encore chargée
      const timeout = setTimeout(() => {
        setHeroImageLoaded(true);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setHeroImageLoaded(true);
    }
  }, []);

  // Traduire automatiquement les spécialités
  const { translatedContent: translatedSpecialties, isLoading: isTranslatingSpecialties } = useTranslatedContent(
    specialties,
    ['title', 'description', 'category']
  );

  // Traduire automatiquement les headers de la section
  const { translatedContent: translatedSpecialtiesHeader } = useTranslatedContent(
    content?.pageHeaders?.specialties ?? null,
    ['badge', 'title', 'subtitle']
  );

  const displaySpecialties = (translatedSpecialties || specialties) as TourSpecialty[];
  const header = translatedSpecialtiesHeader || content?.pageHeaders?.specialties || {};

  // Auto-open modal if initialSelectedTour is provided
  useEffect(() => {
    if (initialSelectedTour) {
      setSelectedTour(initialSelectedTour);
    }
  }, [initialSelectedTour]);

  // Auto-open modal when URL contains /tours/:slug
  useEffect(() => {
    if (!slug) return;
    const found: any = (displaySpecialties as any[]).find((x) => String((x as any).slug || (x as any).id) === String(slug));
    if (found) {
      setSelectedTour(getDetailedTour(found));
    }
  }, [slug, displaySpecialties]);

  // Filtering Logic
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  // Les catégories restent stockées avec leurs valeurs actuelles (venant potentiellement de Firebase),
  // mais les labels affichés sont traduits via i18n.
  const categories = ["Tous", "Nature", "Culture", "Aventure", "Photography"];

  const categoryLabelMap: Record<string, string> = {
    "Tous": t('tourSpecialties.categories.all'),
    "Nature": t('tourSpecialties.categories.nature'),
    "Culture": t('tourSpecialties.categories.culture'),
    "Aventure": t('tourSpecialties.categories.adventure'),
    "Photography": t('tourSpecialties.categories.photography'),
  };

  // Use Firebase data directly with fallback for category
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
      {/* Hero Section with Background Image */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {HERO_IMAGE ? (
            <>
              <img
                src={HERO_IMAGE}
                alt="Madagascar landscape"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ${
                  heroImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
                // fetchPriority="high"
              />
              {!heroImageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#4B3935] to-[#3d2f2b]" />
              )}
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#4B3935] to-[#3d2f2b]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="absolute bottom-0 left-0 w-full leading-[0] z-20">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.83C0,95.83,161,122.35,321.39,56.44Z"
              className="fill-[#F0E7D5] dark:fill-[#1a1410]"
            ></path>
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-4"
          >
            <span className="inline-block px-5 py-1.5 bg-[#D4A574] text-white rounded-full text-xs md:text-sm font-bold tracking-wider">
              {header.badge || t('sections.specialties')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black text-white mb-4 tracking-tight"
          >
            {header.title || t('sections.specialties')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm md:text-base lg:text-xl text-white/90 font-light max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            {header.subtitle || t('sections.specialtiesSubtitle')}
          </motion.p>
          
          {/* Indicateur de chargement de traduction */}
          {isTranslatingSpecialties && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/80">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          )}
        </div>
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