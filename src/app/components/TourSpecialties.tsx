import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bird, Search, ChevronDown } from "lucide-react"
import { TourModal, getDetailedTour, ExtendedTourSpecialty } from "./TourModal"
import { SectionHeader } from "@/components/common/SectionHeader"

// Types
interface TourSpecialty {
  id: number
  title: string
  description: string
  image: string
  category?: string
}

interface TourSpecialtiesProps {
  specialties: TourSpecialty[]
  initialSelectedTour?: ExtendedTourSpecialty | null
  content?: any
}

const IMAGES = [
  "https://images.unsplash.com/photo-1659944975073-453265ccf3a6?w=800&q=80", // Baobab
  "https://images.unsplash.com/photo-1700146606640-0202e6463425?w=800&q=80", // Lemur
  "https://images.unsplash.com/photo-1679053806925-7f0f595fab31?w=800&q=80", // Beach
  "https://images.unsplash.com/photo-1611611835759-e7d32033c6dc?w=800&q=80", // Bird
  "https://images.unsplash.com/photo-1764933268558-3411b587f1e3?w=800&q=80", // Culture
  "https://images.unsplash.com/photo-1677667495307-10e01bd9530f?w=800&q=80"  // Nature
];

const DEMO_SPECIALTIES = Array(6).fill(null).map((_, i) => ({
  id: i + 1,
  title: "Birdwatching",
  description: "Discover over 250 endemic bird species in their natural habitats",
  image: IMAGES[i % IMAGES.length],
}));

export function TourSpecialties({ specialties: _, initialSelectedTour, content }: TourSpecialtiesProps) {
  const specialties = DEMO_SPECIALTIES;
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  // Modal State
  const [selectedTour, setSelectedTour] = useState<ExtendedTourSpecialty | null>(initialSelectedTour || null);

  // Auto-open modal if initialSelectedTour is provided
  useEffect(() => {
    if (initialSelectedTour) {
      setSelectedTour(initialSelectedTour);
    }
  }, [initialSelectedTour]);

  // Filtering Logic
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const categories = ["Tous", "Nature", "Culture", "Aventure", "Photography"];

  const smartSpecialties = specialties.map((s, i) => {
    const titles = ["Birdwatching", "Lemur Safari", "Island Escape", "Birdwatching", "Cultural Tour", "Nature Trek"];
    const cats = ["Nature", "Nature", "Aventure", "Nature", "Culture", "Aventure"];
    return { ...s, title: titles[i], category: cats[i] };
  });

  const filteredSpecialties = smartSpecialties.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "Tous" || s.category === selectedCategory || (selectedCategory === "Photography" && s.title.includes("Photo"));
    return matchSearch && matchCat;
  });

  const handleOpenModal = (specialty: any) => {
    // Determine title for 'specific' content or random
    const extended = getDetailedTour(specialty);
    setSelectedTour(extended);
  };

  return (
    <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge={content.pageHeaders?.specialties?.badge || 'Our Expertise'}
          title={content.pageHeaders?.specialties?.title || 'Curated Experiences'}
          subtitle={content.pageHeaders?.specialties?.subtitle || 'Bespoke adventures...'}
        />

        {/* Filter UI */}
        <div className="max-w-4xl mx-auto mb-16 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#443C34]/20 focus:border-[#443C34] transition-all text-lg"
              placeholder="Recherche un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative min-w-[200px]">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-6 pr-10 py-4 bg-white border border-gray-100 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#443C34]/20 focus:border-[#443C34] appearance-none cursor-pointer transition-all text-lg font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
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
                <div className="bg-white rounded-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 h-full flex flex-col border border-gray-100/50 overflow-hidden">
                  <div className="relative h-60">
                    <motion.img
                      animate={hoveredId === specialty.id ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ duration: 0.6 }}
                      src={specialty.image}
                      alt={specialty.title}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute -bottom-8 left-8 z-20 ">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-50 transition-transform duration-300 group-hover:scale-110">
                        <Bird className="w-8 h-8 text-[#332C26]" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-14 p-8 md:p-10 flex-1 flex flex-col items-start bg-white mt-5">
                    <h3 className="text-3xl font-black text-[#332C26] mb-4 tracking-tight leading-tight">
                      {specialty.title}
                    </h3>

                    <p className="text-gray-500 leading-relaxed text-base font-medium mb-10 flex-1">
                      {specialty.description}
                    </p>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOpenModal(specialty)}
                      className="w-auto px-8 py-3 bg-[#443C34] text-white rounded-xl font-black text-lg transition-all duration-300 hover:w-full hover:bg-[#332C26] shadow-lg shadow-black/10 whitespace-nowrap overflow-hidden flex items-center justify-center cursor-pointer"
                    >
                      Discover More
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
            <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
          )}
        </AnimatePresence>

        {filteredSpecialties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-gray-500 mb-4">No experiences found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory("Tous"); }}
              className="text-[#443C34] font-bold underline text-lg hover:text-[#332C26]"
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}