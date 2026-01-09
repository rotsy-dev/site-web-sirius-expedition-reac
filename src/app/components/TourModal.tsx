import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, X, Clock, MapPin, Users, Calendar, Check, CheckCircle, XCircle, Car, TrendingUp } from "lucide-react"
import { useTranslation } from "react-i18next"
import { SITE_SECTIONS } from "../../constants"

// Types compatibles avec Firebase
export interface TourSpecialty {
  id: number
  icon: string
  title: string
  slug: string
  description: string
  image: string // Base64
  link: string
  duration: string
  location: string
  price: string
  rating: number
  reviews: number
  highlights: string[]
  isBestSeller: boolean
  transport: string
  difficulty: string
  whyUs: string
  itinerary: ItineraryStep[]
  category?: string
}

export interface ItineraryStep {
  day: string
  title: string
  description: string
}

// Extension pour la modal (optionnel)
export interface ExtendedTourSpecialty extends TourSpecialty {
  gallery?: string[]
  groupSize?: string
  season?: string
  included?: string[]
  excluded?: string[]
}

// Helper pour convertir les données Firebase en format modal
export const getDetailedTour = (base: TourSpecialty): ExtendedTourSpecialty => {
  return {
    ...base,
    // Ajouter des valeurs par défaut si elles n'existent pas
    gallery: base.image ? [base.image] : [],
    groupSize: "4-8 personnes", // Valeur par défaut
    season: "Toute l'année",     // Valeur par défaut
    included: [
      "Guide francophone expert",
      "Tous les transports en " + (base.transport || "4x4"),
      "Hébergement inclus",
      "Tous les repas",
      "Droits d'entrée aux parcs"
    ],
    excluded: [
      "Vols internationaux",
      "Assurance voyage",
      "Boissons alcoolisées",
      "Dépenses personnelles"
    ]
  };
};

// Modal Component
export function TourModal({ tour, onClose, onNavigateToQuote }: { tour: ExtendedTourSpecialty; onClose: () => void; onNavigateToQuote?: () => void }) {
  const { t } = useTranslation();
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [isItineraryOpen, setIsItineraryOpen] = useState(true);

  const handleAskQuote = () => {
    onClose();
    if (onNavigateToQuote) {
      onNavigateToQuote();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D4A574 #F0E7D5'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors border border-gray-100 shadow-sm"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-0">
          {/* Mobile Gallery (Top) - Visible ONLY on mobile */}
          <div className="lg:hidden h-64 w-full relative">
            <img 
              src={tour.image || 'https://via.placeholder.com/800x600?text=No+Image'} 
              alt={tour.title} 
              className="w-full h-full object-cover" 
            />
                {tour.isBestSeller && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-600 text-white px-4 py-2 rounded-full font-bold text-xs shadow-xl flex items-center gap-2">
                    🏆 {t('tourSpecialties.bestSeller')}
                  </div>
                )}
          </div>

          {/* Content Column */}
          <div className="p-6 md:p-10 lg:order-2 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{tour.icon}</span>
                <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-[#332C26]">{tour.title}</h2>
              </div>
              <span className="hidden sm:inline-block bg-[#F7EBD5] text-[#443C34] px-4 py-1.5 rounded-full text-sm font-bold ml-4 whitespace-nowrap">
                {tour.difficulty || 'Modéré'}
              </span>
            </div>
            <p className="text-gray-500 mb-8">{tour.description}</p>

            {/* Info Bar */}
            <div className="grid grid-cols-2 gap-4 bg-[#F0E7D5]/30 p-5 rounded-2xl mb-10">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Clock size={16} /> 
                  <span className="text-[10px] uppercase font-bold tracking-wider">{t('tourSpecialties.modal.duration')}</span>
                </div>
                <span className="font-bold text-[#332C26] text-sm">{tour.duration}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <MapPin size={16} /> 
                  <span className="text-[10px] uppercase font-bold tracking-wider">{t('tourSpecialties.modal.location')}</span>
                </div>
                <span className="font-bold text-[#332C26] text-sm">{tour.location}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Users size={16} /> 
                  <span className="text-[10px] uppercase font-bold tracking-wider">{t('tourSpecialties.modal.group')}</span>
                </div>
                <span className="font-bold text-[#332C26] text-sm">{tour.groupSize || '4-8 pers.'}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Car size={16} /> 
                  <span className="text-[10px] uppercase font-bold tracking-wider">{t('tourSpecialties.modal.transport')}</span>
                </div>
                <span className="font-bold text-[#332C26] text-sm">{tour.transport || '4x4'}</span>
              </div>
            </div>

            {/* Why Us */}
            {tour.whyUs && (
              <div className="mb-10 bg-gradient-to-br from-[#D4A574]/10 to-[#F0E7D5]/30 p-6 rounded-2xl border border-[#D4A574]/20">
                <h3 className="text-xl font-bold text-[#332C26] mb-3 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#D4A574]" />
                  {t('tourSpecialties.modal.whyUs')}
                </h3>
                <p className="text-gray-600 leading-relaxed">{tour.whyUs}</p>
              </div>
            )}

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-bold text-[#332C26] mb-6">{t('tourSpecialties.modal.highlights')}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {tour.highlights.map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-green-100 p-1 rounded-full">
                        <Check size={10} className="text-green-600" />
                      </div>
                      <span className="text-gray-600 text-sm md:text-base">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="mb-10">
                <div
                  className="flex items-center justify-between mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setIsItineraryOpen(!isItineraryOpen)}
                >
                  <h3 className="text-xl font-bold text-[#332C26]">{t('tourSpecialties.modal.itinerary')}</h3>
                  <motion.div
                    animate={{ rotate: isItineraryOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="text-gray-400" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isItineraryOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4">
                        {tour.itinerary.map((day, i) => (
                          <div 
                            key={i} 
                            className="border-b border-gray-100 pb-4 last:border-0 hover:bg-[#F0E7D5]/20 p-3 rounded-lg transition-colors cursor-pointer" 
                            onClick={() => setOpenDay(openDay === i ? null : i)}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-[#332C26]">{day.day}: {day.title}</h4>
                              {openDay === i ? 
                                <ChevronUp size={16} className="text-gray-400" /> : 
                                <ChevronDown size={16} className="text-gray-400" />
                              }
                            </div>
                            <AnimatePresence>
                              {openDay === i && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                                    {day.description}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Inclusions */}
            {((tour.included && tour.included.length > 0) || (tour.excluded && tour.excluded.length > 0)) && (
              <div className="grid grid-cols-1 gap-8 mb-8 border-t border-gray-100 pt-8">
                {tour.included && tour.included.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-[#332C26] mb-4">{t('tourSpecialties.modal.included')}</h3>
                    <ul className="space-y-3">
                      {tour.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                          <CheckCircle size={16} className="text-green-500 mt-0.5 min-w-[16px]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excluded && tour.excluded.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-[#332C26] mb-4">{t('tourSpecialties.modal.excluded')}</h3>
                    <ul className="space-y-3">
                      {tour.excluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                          <XCircle size={16} className="text-red-400 mt-0.5 min-w-[16px]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Gallery */}
          <div className="hidden lg:block lg:order-1 p-6 h-full sticky top-0 overflow-y-auto md:pr-2" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#D4A574 #F0E7D5'
          }}>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden shadow-sm h-[300px] flex-shrink-0 relative">
                <img
                  src={tour.image || 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={tour.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                {tour.isBestSeller && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-xl flex items-center gap-2">
                    🏆 {t('tourSpecialties.bestSeller')}
                  </div>
                )}
              </div>
              
              {/* Rating & Reviews */}
              {tour.rating && (
                <div className="bg-[#F0E7D5]/30 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-[#332C26]">{tour.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                  {tour.reviews > 0 && (
                    <p className="text-sm text-gray-600">{tour.reviews} {t('tourSpecialties.modal.reviews')}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer sticky avec prix */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 md:px-10 flex items-center justify-between rounded-b-[2rem] z-20">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('tourSpecialties.modal.from')}</p>
            <p className="text-3xl font-black text-[#332C26]">
              {tour.price} 
              <span className="text-sm font-normal text-gray-500"> {t('tourSpecialties.modal.perPerson')}</span>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAskQuote}
            className="cursor-pointer bg-gradient-to-r from-[#8B7355] to-[#6B5744] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-base hover:shadow-xl transition-all shadow-lg"
          >
            {t('tourSpecialties.modal.askQuote')}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}