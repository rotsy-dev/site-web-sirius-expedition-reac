import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Clock, MapPin, ArrowLeft, Users, Calendar, Check, CheckCircle, XCircle, Car, TrendingUp } from "lucide-react"
import { useTranslation } from "react-i18next"

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

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable'

export interface AvailabilityEntry {
  date: string // YYYY-MM-DD
  status: AvailabilityStatus
  note?: string
}

export interface TourTestimonial {
  name: string
  text: string
  rating?: number
  date?: string
}

// Extension pour la modal (optionnel)
export interface ExtendedTourSpecialty extends TourSpecialty {
  gallery?: string[]
  availability?: AvailabilityEntry[]
  groupSize?: string
  season?: string
  included?: string[]
  excluded?: string[]
  itineraryMapEmbedUrl?: string
  packingList?: string[]
  testimonials?: TourTestimonial[]
  similarTourSlugs?: string[]
  enableShare?: boolean
}

// Helper pour convertir les données Firebase en format modal
export const getDetailedTour = (base: TourSpecialty): ExtendedTourSpecialty => {
  return {
    ...base,
    // Ajouter des valeurs par défaut si elles n'existent pas
    gallery: (base as any).gallery?.length ? (base as any).gallery : (base.image ? [base.image] : []),
    availability: (base as any).availability || [],
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
    ],
    itineraryMapEmbedUrl: (base as any).itineraryMapEmbedUrl || '',
    packingList: (base as any).packingList || [],
    testimonials: (base as any).testimonials || [],
    similarTourSlugs: (base as any).similarTourSlugs || [],
    enableShare: (base as any).enableShare ?? true,
  };
};

// Modal Component
export function TourModal({ tour, onClose, onNavigateToQuote }: { tour: ExtendedTourSpecialty; onClose: () => void; onNavigateToQuote?: () => void }) {
  const { t } = useTranslation();
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [isItineraryOpen, setIsItineraryOpen] = useState(true);
  const gallery = tour.gallery && tour.gallery.length > 0 ? tour.gallery : (tour.image ? [tour.image] : []);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const handleAskQuote = () => {
    onClose();
    if (onNavigateToQuote) {
      onNavigateToQuote();
    }
  };

  const tr = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const displaySlug = useMemo(() => {
    const slugify = (input: string) =>
      input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if ((tour as any)?.slug) return String((tour as any).slug);
    const link = (tour as any)?.link;
    if (typeof link === 'string' && link.length > 0) {
      const parts = link.split('/').filter(Boolean);
      return parts[parts.length - 1] || '';
    }
    if (typeof (tour as any)?.id !== 'undefined') return String((tour as any).id);
    if (typeof (tour as any)?.title === 'string' && (tour as any).title.trim()) return slugify((tour as any).title);
    return '';
  }, [tour]);

  const normalizedAvailability = useMemo<AvailabilityEntry[]>(() => {
    const raw: any = (tour as any).availability;

    if (Array.isArray(raw)) {
      return raw
        .filter(Boolean)
        .filter((e: any) => typeof e?.date === 'string' && typeof e?.status === 'string')
        .map((e: any) => ({ date: e.date, status: e.status, note: e.note }));
    }

    if (raw && typeof raw === 'object') {
      // Support ancien format éventuel: { "YYYY-MM-DD": { status, note } }
      return Object.entries(raw)
        .map(([date, v]: any) => ({ date, status: v?.status, note: v?.note }))
        .filter((e: any) => typeof e?.date === 'string' && typeof e?.status === 'string');
    }

    return [];
  }, [tour]);

  const availabilityByDate = useMemo(() => {
    const map = new Map<string, AvailabilityEntry>();
    normalizedAvailability.forEach((e) => {
      if (e?.date) map.set(e.date, e);
    });
    return map;
  }, [normalizedAvailability]);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startWeekday = (first.getDay() + 6) % 7; // Monday=0
    const daysInMonth = last.getDate();
    const cells: Array<{ date: Date; inMonth: boolean }> = [];

    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(year, month, 1 - (startWeekday - i));
      cells.push({ date: d, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({ date: new Date(year, month, day), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
      const lastCell = cells[cells.length - 1].date;
      const d = new Date(lastCell);
      d.setDate(d.getDate() + 1);
      cells.push({ date: d, inMonth: false });
    }
    return cells;
  }, [calendarMonth]);

  const formatYmd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      style={{ willChange: 'opacity' }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-gradient-to-br from-white via-[#FAF7F2] to-white w-full max-w-7xl max-h-[95vh] sm:max-h-[98vh] overflow-y-auto rounded-xl sm:rounded-2xl md:rounded-[2.5rem] shadow-2xl border-2 sm:border-4 border-[#D4A574]/20 my-4 sm:my-0"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D4A574 #F0E7D5',
          willChange: 'transform, opacity'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 left-3 sm:top-6 sm:left-6 z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-white/90 backdrop-blur-xl rounded-full hover:bg-white transition-all border-2 border-[#D4A574]/30 shadow-xl hover:shadow-2xl hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#4B3935]" />
          <span className="font-bold text-xs sm:text-sm text-[#4B3935] hidden sm:inline">{tr('common.back', 'Retour')}</span>
        </button>

        <div className="flex flex-col">
         {/* Image en haut - Toutes les tailles */}
        <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] relative overflow-hidden rounded-t-2xl sm:rounded-t-[2.5rem]">
          <img
            src={gallery[activeImageIndex] || tour.image || 'https://via.placeholder.com/800x600?text=No+Image'}
            alt={tour.title}
            className="w-full h-full object-cover blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          {tour.isBestSeller && (
            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-gradient-to-r from-amber-400 to-yellow-600 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-1.5 sm:gap-2 z-10">
              🏆 <span className="hidden sm:inline">{tr('tourSpecialties.bestSeller', 'Best Seller')}</span>
            </div>
          )}
          {/* Titre sur l'image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
            <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-[#D4A574] to-[#C4965F] rounded-xl sm:rounded-2xl shadow-xl flex-shrink-0">
                <span className="text-2xl sm:text-3xl md:text-4xl">{tour.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-black text-white mb-1 sm:mb-2 leading-tight drop-shadow-2xl">
                  {tour.title}
                </h2>
                {displaySlug && (
                  <div className="mb-1 sm:mb-2">
                    <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border border-white/25">
                      <span className="opacity-80">slug</span>
                      <span className="font-black">{displaySlug}</span>
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-xl text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold border border-white/30">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D4A574]"></span>
                    <span className="whitespace-nowrap">{tour.difficulty || 'Modéré'}</span>
                  </span>
                  {tour.rating && (
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-xl px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
                      <span className="text-yellow-300 text-sm sm:text-base">⭐</span>
                      <span className="text-white font-bold text-xs sm:text-sm">{tour.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Content Column - Centré */}
          <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-10 lg:p-12">
            {/* Galerie d'images */}
            {gallery.length > 1 && (
              <div className="mb-6 sm:mb-8 md:mb-10">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-[#332C26]">{tr('tourSpecialties.modal.gallery', 'Galerie')}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((v) => (v - 1 + gallery.length) % gallery.length)}
                      className="cursor-pointer px-3 py-2 rounded-xl bg-white border border-[#D4A574]/20 hover:border-[#D4A574]/50 transition-all text-sm font-bold text-[#4B3935]"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((v) => (v + 1) % gallery.length)}
                      className="cursor-pointer px-3 py-2 rounded-xl bg-white border border-[#D4A574]/20 hover:border-[#D4A574]/50 transition-all text-sm font-bold text-[#4B3935]"
                    >
                      →
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {gallery.map((src, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`cursor-pointer relative h-20 w-28 sm:h-24 sm:w-36 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${idx === activeImageIndex ? 'border-[#D4A574] shadow-lg' : 'border-transparent hover:border-[#D4A574]/40'}`}
                      aria-label={`gallery-${idx + 1}`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/10" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed pl-3 sm:pl-4 md:pl-6 border-l-2 sm:border-l-4 border-[#D4A574] bg-[#F0E7D5]/30 p-4 sm:p-6 rounded-r-xl">
                {tour.description}
              </p>
            </div>

            {/* Calendrier de disponibilités */}
            {/* <div className="mb-6 sm:mb-8 md:mb-10 bg-white rounded-2xl border-2 border-[#F0E7D5] p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#332C26]">{tr('tourSpecialties.modal.availability', 'Disponibilités')}</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                    className="cursor-pointer px-3 py-2 rounded-xl bg-[#F0E7D5]/40 hover:bg-[#F0E7D5]/60 transition-all text-sm font-bold text-[#4B3935]"
                  >
                    ←
                  </button>
                  <div className="text-sm sm:text-base font-black text-[#332C26]">
                    {calendarMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCalendarMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                    className="cursor-pointer px-3 py-2 rounded-xl bg-[#F0E7D5]/40 hover:bg-[#F0E7D5]/60 transition-all text-sm font-bold text-[#4B3935]"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-xs font-bold text-[#8B7355] mb-2">
                {[
                  tr('common.weekdays.mon', 'Lun'),
                  tr('common.weekdays.tue', 'Mar'),
                  tr('common.weekdays.wed', 'Mer'),
                  tr('common.weekdays.thu', 'Jeu'),
                  tr('common.weekdays.fri', 'Ven'),
                  tr('common.weekdays.sat', 'Sam'),
                  tr('common.weekdays.sun', 'Dim'),
                ].map((d) => (
                  <div key={d} className="text-center">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map(({ date, inMonth }, idx) => {
                  const key = formatYmd(date);
                  const entry = availabilityByDate.get(key);
                  const status = entry?.status;
                  const dot =
                    status === 'available'
                      ? 'bg-green-500'
                      : status === 'limited'
                      ? 'bg-amber-500'
                      : status === 'unavailable'
                      ? 'bg-red-500'
                      : 'bg-transparent';

                  return (
                    <div
                      key={idx}
                      title={entry?.note || ''}
                      className={`relative rounded-xl border p-2 sm:p-2.5 text-center ${inMonth ? 'bg-[#FAF7F2]' : 'bg-white/50'} ${inMonth ? 'border-[#F0E7D5]' : 'border-transparent'} ${inMonth ? 'text-[#332C26]' : 'text-[#332C26]/35'}`}
                    >
                      <div className="text-xs sm:text-sm font-black">{date.getDate()}</div>
                      <div className={`mx-auto mt-1 h-2 w-2 rounded-full ${dot}`} />
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3 mt-4 text-xs font-semibold text-[#4B3935]">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> {tr('tourSpecialties.modal.available', 'Disponible')}</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> {tr('tourSpecialties.modal.limited', 'Limité')}</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" /> {tr('tourSpecialties.modal.unavailable', 'Complet')}</div>
              </div>
            </div> */}

            {/* Info Bar amélioré */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-gradient-to-br from-[#F0E7D5]/40 to-[#E5D8C0]/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 md:mb-10 border border-[#D4A574]/20">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#8B7355] mb-1 sm:mb-2">
                  <Clock size={14} className="sm:w-[18px] sm:h-[18px] text-[#D4A574]" />
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">{t('tourSpecialties.modal.duration')}</span>
                </div>
                <span className="font-bold text-[#332C26] text-sm sm:text-base break-words">{tour.duration}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#8B7355] mb-1 sm:mb-2">
                  <MapPin size={14} className="sm:w-[18px] sm:h-[18px] text-[#D4A574]" />
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">{t('tourSpecialties.modal.location')}</span>
                </div>
                <span className="font-bold text-[#332C26] text-sm sm:text-base break-words">{tour.location}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#8B7355] mb-1 sm:mb-2">
                  <Users size={14} className="sm:w-[18px] sm:h-[18px] text-[#D4A574]" />
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">{t('tourSpecialties.modal.group')}</span>
                </div>
                <span className="font-bold text-[#332C26] text-sm sm:text-base break-words">{tour.groupSize || '4-8 pers.'}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[#8B7355] mb-1 sm:mb-2">
                  <Car size={14} className="sm:w-[18px] sm:h-[18px] text-[#D4A574]" />
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">{t('tourSpecialties.modal.transport')}</span>
                </div>
                <span className="font-bold text-[#332C26] text-sm sm:text-base break-words">{tour.transport || '4x4'}</span>
              </div>
            </div>

            {/* Dates et Saison */}
            {(tour.season || (tour as any).startDate || (tour as any).endDate) && (
              <div className="mb-6 sm:mb-8 md:mb-10 bg-gradient-to-br from-[#D4A574]/10 to-[#F0E7D5]/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#D4A574]/20">
                <h3 className="text-base sm:text-lg font-bold text-[#332C26] mb-3 sm:mb-4 flex items-center gap-2">
                  <Calendar className="text-[#D4A574] w-[18px] h-[18px] sm:w-5 sm:h-5" />
                  <span>Dates & Saison</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {(tour as any).startDate && (tour as any).endDate && (
                    <div className="flex flex-col">
                      <span className="text-xs text-[#8B7355] uppercase font-bold tracking-wider mb-1">{t('tours.periode')}</span>
                      <span className="font-semibold text-[#332C26]">
                        {(tour as any).startDate} - {(tour as any).endDate}
                      </span>
                    </div>
                  )}
                  {tour.season && (
                    <div className="flex flex-col">
                      <span className="text-xs text-[#8B7355] uppercase font-bold tracking-wider mb-1">{t('tours.meilleursaison')}</span>
                      <span className="font-semibold text-[#332C26]">{tour.season}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Why Us amélioré */}
            {tour.whyUs && (
              <div className="mb-6 sm:mb-8 md:mb-10 bg-gradient-to-br from-[#D4A574]/15 via-[#F0E7D5]/40 to-[#E5D8C0]/30 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border-2 border-[#D4A574]/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A574]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <h3 className="text-xl sm:text-2xl font-black text-[#332C26] mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 relative z-10">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#D4A574] to-[#C4965F] rounded-xl shadow-lg flex-shrink-0">
                    <TrendingUp size={20} className="sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span className="break-words">{t('tourSpecialties.modal.whyUs')}</span>
                </h3>
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg relative z-10">{tour.whyUs}</p>
              </div>
            )}

            {/* Highlights amélioré */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h3 className="text-xl sm:text-2xl font-black text-[#332C26] mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl">✨</span>
                  <span>{t('tourSpecialties.modal.highlights')}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {tour.highlights.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 sm:gap-3 md:gap-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-[#F0E7D5] hover:border-[#D4A574] hover:shadow-lg transition-all"
                    >
                      <div className="mt-0.5 p-1.5 sm:p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-md flex-shrink-0">
                        <Check size={14} className="sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed break-words">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary avec Timeline */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="mb-6 sm:mb-8 md:mb-10">
                <div
                  className="flex items-center justify-between mb-4 sm:mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setIsItineraryOpen(!isItineraryOpen)}
                >
                  <h3 className="text-lg sm:text-xl font-bold text-[#332C26] flex items-center gap-2">
                    <Calendar className="text-[#D4A574] w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" />
                    <span>{t('tourSpecialties.modal.itinerary')}</span>
                  </h3>
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
                      <div className="relative">
                        {/* Timeline verticale améliorée */}
                        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-[#D4A574] via-[#C4965F] to-[#D4A574] rounded-full shadow-lg" />

                        <div className="space-y-6 sm:space-y-8 pl-12 sm:pl-16">
                          {tour.itinerary.map((day, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                              className="relative"
                            >
                              {/* Point sur la timeline amélioré */}
                              <div className="absolute -left-[2.75rem] sm:-left-[3.25rem] top-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#D4A574] to-[#C4965F] border-2 sm:border-4 border-white shadow-xl flex items-center justify-center ring-2 sm:ring-4 ring-[#F0E7D5]">
                                {openDay === i && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white"
                                  />
                                )}
                                <span className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-black text-[#D4A574] whitespace-nowrap">
                                  {tr('tourSpecialties.modal.day', 'Jour')} {i + 1}
                                </span>
                              </div>

                              {/* Carte du jour améliorée */}
                              <motion.div
                                whileHover={{ scale: 1.02, x: 2 }}
                                className={`bg-white border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all cursor-pointer shadow-lg ${openDay === i
                                    ? 'border-[#D4A574] shadow-2xl bg-gradient-to-br from-[#F0E7D5]/40 via-white to-[#F0E7D5]/20'
                                    : 'border-gray-200 hover:border-[#D4A574]/60 hover:shadow-xl'
                                  }`}
                                onClick={() => setOpenDay(openDay === i ? null : i)}
                              >
                                <div className="flex items-start justify-between gap-2 sm:gap-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 flex-wrap">
                                      <span className="text-sm sm:text-base font-black text-white bg-gradient-to-r from-[#D4A574] to-[#C4965F] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-md whitespace-nowrap">
                                        {day.day}
                                      </span>
                                      <h4 className="font-black text-[#332C26] text-base sm:text-lg md:text-xl break-words">{day.title}</h4>
                                    </div>
                                    <AnimatePresence>
                                      {openDay === i && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0, y: -10 }}
                                          animate={{ height: "auto", opacity: 1, y: 0 }}
                                          exit={{ height: 0, opacity: 0, y: -10 }}
                                          transition={{ duration: 0.3 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-[#F0E7D5]/50 to-transparent rounded-lg sm:rounded-xl border-l-2 sm:border-l-4 border-[#D4A574]">
                                            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                              {day.description}
                                            </p>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                  <motion.div
                                    animate={{ rotate: openDay === i ? 180 : 0, scale: openDay === i ? 1.1 : 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0 p-1.5 sm:p-2 rounded-full bg-[#F0E7D5]"
                                  >
                                    {openDay === i ?
                                      <ChevronUp size={18} className="sm:w-[22px] sm:h-[22px] text-[#D4A574]" /> :
                                      <ChevronDown size={18} className="sm:w-[22px] sm:h-[22px] text-gray-500" />
                                    }
                                  </motion.div>
                                </div>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Inclusions */}
            {((tour.included && tour.included.length > 0) || (tour.excluded && tour.excluded.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8 border-t border-gray-100 pt-6 sm:pt-8">
                {tour.included && tour.included.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#332C26] mb-3 sm:mb-4">{t('tourSpecialties.modal.included')}</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {tour.included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                          <CheckCircle size={14} className="sm:w-4 sm:h-4 text-green-500 mt-0.5 min-w-[14px] sm:min-w-[16px] flex-shrink-0" />
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excluded && tour.excluded.length > 0 && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#332C26] mb-3 sm:mb-4">{t('tourSpecialties.modal.excluded')}</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {tour.excluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                          <XCircle size={14} className="sm:w-4 sm:h-4 text-red-400 mt-0.5 min-w-[14px] sm:min-w-[16px] flex-shrink-0" />
                          <span className="break-words">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Carte interactive de l'itinéraire */}
            {tour.itineraryMapEmbedUrl && (
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h3 className="text-lg sm:text-xl font-bold text-[#332C26] mb-4">{tr('tourSpecialties.modal.map', "Carte de l'itinéraire")}</h3>
                <div className="overflow-hidden rounded-2xl border-2 border-[#F0E7D5] bg-white">
                  <iframe
                    src={tour.itineraryMapEmbedUrl}
                    className="w-full h-[320px] md:h-[420px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="map"
                  />
                </div>
              </div>
            )}

            {/* Témoignages clients détaillés */}
            {tour.testimonials && tour.testimonials.length > 0 && (
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h3 className="text-lg sm:text-xl font-bold text-[#332C26] mb-4">{tr('tourSpecialties.modal.testimonials', 'Témoignages')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.testimonials.map((r, i) => (
                    <div key={i} className="bg-white border-2 border-[#F0E7D5] rounded-2xl p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-black text-[#332C26]">{r.name}</p>
                        {r.rating ? <p className="text-sm font-bold text-[#8B7355]">⭐ {r.rating}/5</p> : null}
                      </div>
                      {r.date ? <p className="text-xs text-[#8B7355] mt-1">{r.date}</p> : null}
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mt-3">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ce qu'il faut apporter */}
            {tour.packingList && tour.packingList.length > 0 && (
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h3 className="text-lg sm:text-xl font-bold text-[#332C26] mb-4">{tr('tourSpecialties.modal.packingList', "Ce qu'il faut apporter")}</h3>
                <div className="bg-white border-2 border-[#F0E7D5] rounded-2xl p-4 sm:p-6">
                  <ul className="space-y-2">
                    {tour.packingList.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#D4A574]" />
                        <span className="break-words">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tours similaires */}
            {tour.similarTourSlugs && tour.similarTourSlugs.length > 0 && (
              <div className="mb-6 sm:mb-8 md:mb-10">
                <h3 className="text-lg sm:text-xl font-bold text-[#332C26] mb-4">{tr('tourSpecialties.modal.similarTours', 'Tours similaires')}</h3>
                <div className="flex flex-wrap gap-2">
                  {tour.similarTourSlugs.map((s, i) => (
                    <span key={i} className="px-3 py-2 rounded-full bg-[#F0E7D5]/60 border border-[#D4A574]/25 text-sm font-bold text-[#4B3935]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Partage social */}
            {tour.enableShare !== false && (
              <div className="mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#332C26] mb-4">{tr('tourSpecialties.modal.share', 'Partager')}</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                    className="cursor-pointer px-4 py-3 rounded-xl bg-white border-2 border-[#F0E7D5] hover:border-[#D4A574]/60 transition-all text-sm font-bold text-[#4B3935]"
                  >
                    {tr('common.copyLink', 'Copier le lien')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer sticky avec prix amélioré */}
        <div className="sticky bottom-0 bg-gradient-to-r from-white via-[#FAF7F2] to-white border-t-2 sm:border-t-4 border-[#D4A574] p-4 sm:p-6 md:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 rounded-b-2xl sm:rounded-b-[2.5rem] z-20 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <p className="text-[10px] sm:text-xs text-[#8B7355] uppercase tracking-wider mb-0.5 sm:mb-1 font-bold">{tr('tourSpecialties.modal.from', 'À partir de')}</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#332C26] bg-gradient-to-r from-[#4B3935] to-[#332C26] bg-clip-text text-transparent">
                {tour.price}
                <span className="text-sm sm:text-base md:text-lg font-normal text-gray-600"> {tr('tourSpecialties.modal.perPerson', 'par personne')}</span>
              </p>
            </div>
            {tour.rating && (
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#F0E7D5]/50 rounded-xl border border-[#D4A574]/30">
                <span className="text-lg sm:text-2xl">⭐</span>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#332C26]">{tour.rating}/5</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{tour.reviews} {tr('tourSpecialties.modal.reviewsLabel', 'avis')}</p>
                </div>
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAskQuote}
            className="cursor-pointer w-full sm:w-auto bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base md:text-lg hover:shadow-2xl transition-all shadow-xl border-2 border-white/20"
          >
            {tr('tourSpecialties.modal.askQuote', 'Demander un devis')}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}