import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, X, Clock, MapPin, Users, Calendar, Check, CheckCircle, XCircle } from "lucide-react"

// Types
export interface TourSpecialty {
    id: number
    title: string
    description: string
    image: string
    category?: string
}

export interface ExtendedTourSpecialty extends TourSpecialty {
    gallery: string[];
    duration: string;
    location: string;
    groupSize: string;
    season: string;
    highlights: string[];
    itinerary: { day: string; title: string; desc: string }[];
    included: string[];
    excluded: string[];
    price: string;
}

// Mock Data Extension helper
export const getDetailedTour = (base: any): ExtendedTourSpecialty => {
    return {
        ...base,
        gallery: [
            base.image,
            "https://images.unsplash.com/photo-1547406980-6064f7b64082?w=800&q=80",
            "https://images.unsplash.com/photo-1516713926831-2917d29ac4c4?w=800&q=80"
        ],
        duration: "10 jours / 9 nuits",
        location: "Ouest de Madagascar",
        groupSize: "4-6 personnes",
        season: "Mai - Octobre",
        highlights: [
            "Allée des Baobabs au lever et coucher du soleil",
            "Forêt de Kirindy et observation des fossas",
            "Petits groupes pour une expérience premium",
            "Tsingy de Bemaraha classés UNESCO",
            "Traversée du Tsiribihina",
            "Hébergement en lodges de qualité"
        ],
        itinerary: [
            { day: "Jour 1", title: "Antananarivo - Morondava", desc: "Vol vers Morondava. Installation et première session photo à l'Allée des Baobabs au coucher du soleil." },
            { day: "Jour 2", title: "Morondava - Bekopaka", desc: "Départ matinal pour les Tsingy de Bemaraha. Traversée de paysages uniques et villages traditionnels." },
            { day: "Jour 3", title: "Grands Tsingy", desc: "Exploration des Grands Tsingy, pont suspendu et grottes. Observation des lémuriens Decken." },
            { day: "Jour 4", title: "Retour Morondava", desc: "Retour vers la côte, arrêt à la Forêt sacrée et coucher de soleil sur les Baobabs amoureux." }
        ],
        included: ["Vols domestiques aller-retour", "Guide francophone expert", "Tous les transports en 4x4", "Hébergement en lodges", "Tous les repas", "Droits d'entrée aux parcs", "Traversée en bac"],
        excluded: ["Vols internationaux", "Assurance voyage", "Boissons alcoolisées"],
        price: "1 299 €"
    };
};

// Modal Component
export function TourModal({ tour, onClose }: { tour: ExtendedTourSpecialty; onClose: () => void }) {
    const [openDay, setOpenDay] = useState<number | null>(0);
    const [isItineraryOpen, setIsItineraryOpen] = useState(true);

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
                className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl custom-scrollbar"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors border border-gray-100 shadow-sm"
                >
                    <X className="w-5 h-5 text-gray-800" />
                </button>

                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-0">

                    {/* Mobile Gallery (Top) - Visible ONLY on mobile */}
                    <div className="lg:hidden h-64 w-full relative">
                        <img src={tour.gallery[0] || tour.image} alt={tour.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Content Column */}
                    <div className="p-6 md:p-10 lg:order-2 h-full overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                            <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-[#332C26] mb-2">{tour.title}</h2>
                            <span className="hidden sm:inline-block bg-[#F7EBD5] text-[#443C34] px-4 py-1.5 rounded-full text-sm font-bold ml-4 whitespace-nowrap">
                                Modéré
                            </span>
                        </div>
                        <p className="text-gray-500 mb-8">{tour.description}</p>

                        {/* Info Bar */}
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl mb-10">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-gray-400 mb-1"><Clock size={16} /> <span className="text-[10px] uppercase font-bold tracking-wider">Durée</span></div>
                                <span className="font-bold text-[#332C26] text-sm">{tour.duration}</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-gray-400 mb-1"><MapPin size={16} /> <span className="text-[10px] uppercase font-bold tracking-wider">Localisation</span></div>
                                <span className="font-bold text-[#332C26] text-sm">{tour.location}</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-gray-400 mb-1"><Users size={16} /> <span className="text-[10px] uppercase font-bold tracking-wider">Groupe</span></div>
                                <span className="font-bold text-[#332C26] text-sm">{tour.groupSize}</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-gray-400 mb-1"><Calendar size={16} /> <span className="text-[10px] uppercase font-bold tracking-wider">Saison</span></div>
                                <span className="font-bold text-[#332C26] text-sm">{tour.season}</span>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-[#332C26] mb-6">Points forts</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {tour.highlights.map((point, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="mt-1 bg-green-100 p-1 rounded-full"><Check size={10} className="text-green-600" /></div>
                                        <span className="text-gray-600 text-sm md:text-base">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div className="mb-10">
                            <div
                                className="flex items-center justify-between mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setIsItineraryOpen(!isItineraryOpen)}
                            >
                                <h3 className="text-xl font-bold text-[#332C26]">Itinéraire jour par jour</h3>
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
                                                <div key={i} className="border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer" onClick={() => setOpenDay(openDay === i ? null : i)}>
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-bold text-[#332C26]">{day.day}: {day.title}</h4>
                                                        {openDay === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                                    </div>
                                                    <AnimatePresence>
                                                        {openDay === i && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{day.desc}</p>
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

                        {/* Inclusions */}
                        <div className="grid grid-cols-1 gap-8 mb-8 border-t border-gray-100 pt-8">
                            <div>
                                <h3 className="text-lg font-bold text-[#332C26] mb-4">Inclus</h3>
                                <ul className="space-y-3">
                                    {tour.included.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                            <CheckCircle size={16} className="text-green-500 mt-0.5 min-w-[16px]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#332C26] mb-4">Non inclus</h3>
                                <ul className="space-y-3">
                                    {tour.excluded.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                            <XCircle size={16} className="text-red-400 mt-0.5 min-w-[16px]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* Desktop Gallery */}
                    <div className="hidden lg:block lg:order-1 p-6 h-full sticky top-0 overflow-y-auto custom-scrollbar md:pr-2">
                        <div className="flex flex-col gap-4">
                            {(tour.gallery && tour.gallery.length > 0 ? tour.gallery : [tour.image]).map((image, index) => (
                                <div key={index} className="rounded-2xl overflow-hidden shadow-sm h-[300px] flex-shrink-0">
                                    <img
                                        src={image}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Footer sticky */}
                {/* <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 md:px-10 flex items-center justify-between rounded-b-[2rem] z-20">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">À partir de</p>
                        <p className="text-3xl font-black text-[#332C26]">{tour.price} <span className="text-sm font-normal text-gray-500">/ personne</span></p>
                    </div>
                    <button className="bg-[#443C34] text-white px-6 py-2 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-base hover:bg-[#332C26] transition-colors shadow-lg shadow-[#443C34]/20">
                        Demander un devis
                    </button>
                </div> */}

            </motion.div>
        </motion.div>
    );
}
