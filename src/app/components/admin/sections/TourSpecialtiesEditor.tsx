import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit2,
  X,
  ChevronUp,
  ChevronDown,
  MapPin,
  Upload as UploadIcon,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { db } from '../../../../firebase/config';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

// ==================== IMAGEUPLOADER (Base64) ====================
interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
  aspectRatio?: string;
}

function ImageUploader({
  value,
  onChange,
  aspectRatio = '3/2',
}: ImageUploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxSize = 800;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height / width) * maxSize);
              width = maxSize;
            } else {
              width = Math.round((width / height) * maxSize);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Erreur canvas');

          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.8);

          const sizeKB = Math.round((compressed.length * 3) / 4 / 1024);
          if (sizeKB > 800) {
            alert(`⚠️ L'image compressée fait encore ${sizeKB} KB. Essayez une image plus légère.`);
            return reject('Too large');
          }

          resolve(compressed);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide.');
      return;
    }

    try {
      setIsCompressing(true);
      const base64 = await compressImage(file);
      onChange(base64);
    } catch (error) {
      console.error('Erreur compression:', error);
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        style={{ aspectRatio }}
        className="relative group rounded-2xl border-2 border-dashed border-border overflow-hidden bg-muted/30 hover:border-primary/50 transition-colors cursor-pointer"
      >
        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <img
                src={value}
                alt="Aperçu"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                >
                  <UploadIcon size={28} />
                </button>
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-4 bg-red-500/60 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center gap-5 text-muted-foreground hover:text-primary transition-colors"
            >
              {isCompressing ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin text-primary" size={48} />
                  <span className="text-lg font-medium">Compression en cours...</span>
                </div>
              ) : (
                <>
                  <div className="p-5 rounded-full bg-primary/10">
                    <ImageIcon size={40} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground text-lg">Cliquez pour ajouter une image</p>
                    <p className="text-sm mt-1">JPG, PNG, WebP • Compressée automatiquement (max ~800 KB)</p>
                  </div>
                </>
              )}
            </button>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
// ==========================================================================

interface ItineraryStep {
  day: string;
  title: string;
  description: string;
}

type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

interface AvailabilityEntry {
  date: string;
  status: AvailabilityStatus;
  note?: string;
}

interface TourTestimonial {
  name: string;
  text: string;
  rating?: number;
  date?: string;
}

interface TourSpecialty {
  id: number;
  icon: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  gallery?: string[];
  availability?: AvailabilityEntry[];
  itineraryMapEmbedUrl?: string;
  testimonials?: TourTestimonial[];
  packingList?: string[];
  similarTourSlugs?: string[];
  enableShare?: boolean;
  link: string;
  duration: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  highlights: string[];
  isBestSeller: boolean;
  transport: string;
  difficulty: string;
  whyUs: string;
  itinerary: ItineraryStep[];
}

interface TourSpecialtiesEditorProps {
  specialties: TourSpecialty[];
  onSave: (specialties: TourSpecialty[]) => void;
}

export function TourSpecialtiesEditor({
  specialties: initialSpecialties,
  onSave,
}: TourSpecialtiesEditorProps) {
  const [specialties, setSpecialties] = useState<TourSpecialty[]>(initialSpecialties);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState<TourSpecialty | null>(null);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'tourSpecialties'));
        const fetched = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();

            const normalizeAvailability = (raw: any): AvailabilityEntry[] => {
              if (Array.isArray(raw)) return raw as AvailabilityEntry[];
              if (raw && typeof raw === 'object') {
                return Object.entries(raw)
                  .map(([date, v]: any) => ({ date, status: v?.status, note: v?.note }))
                  .filter((e: any) => typeof e?.date === 'string' && typeof e?.status === 'string');
              }
              return [];
            };

            return {
              id: parseInt(docSnap.id),
              icon: data.icon || '🌟',
              title: data.title || '',
              slug: data.slug || '',
              description: data.description || '',
              image: data.image || '',
              gallery: data.gallery || [],
              availability: normalizeAvailability(data.availability),
              itineraryMapEmbedUrl: data.itineraryMapEmbedUrl || '',
              testimonials: data.testimonials || [],
              packingList: data.packingList || [],
              similarTourSlugs: data.similarTourSlugs || [],
              enableShare: data.enableShare ?? true,
              link: data.link || '',
              duration: data.duration || '',
              location: data.location || '',
              price: data.price || '',
              rating: data.rating ?? 4.9,
              reviews: data.reviews ?? 0,
              highlights: data.highlights || [],
              isBestSeller: data.isBestSeller || false,
              transport: data.transport || '',
              difficulty: data.difficulty || '',
              whyUs: data.whyUs || '',
              itinerary: data.itinerary || [],
            };
          })
          .sort((a, b) => a.id - b.id);

        setSpecialties(fetched.length > 0 ? fetched : initialSpecialties);
      } catch (err) {
        console.error('Erreur chargement Firebase:', err);
        alert('Impossible de charger les données depuis Firebase.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecialties();
  }, [initialSpecialties]);

  const openAddModal = () => {
    const newId = Math.max(...specialties.map((s) => s.id), 0) + 1;
    const newSpecialty: TourSpecialty = {
      id: newId,
      icon: '🌟',
      title: 'Nouvelle Spécialité',
      slug: 'nouvelle-specialite',
      description: 'Description détaillée de cette expérience unique...',
      image: '',
      gallery: [],
      availability: [],
      itineraryMapEmbedUrl: '',
      testimonials: [],
      packingList: [],
      similarTourSlugs: [],
      enableShare: true,
      link: '/tours/nouvelle-specialite',
      duration: '7-10 jours',
      location: 'Destination à définir',
      price: 'À partir de 3 900€',
      rating: 4.9,
      reviews: 0,
      highlights: ['Guide privé', 'Hébergement de luxe', 'Expériences exclusives'],
      isBestSeller: false,
      transport: '4x4 Toyota Land Cruiser',
      difficulty: 'Modéré',
      whyUs: 'Accès exclusif, expertise locale inégalée et service personnalisé.',
      itinerary: [],
    };
    setCurrentSpecialty(newSpecialty);
    setIsModalOpen(true);
  };

  const openEditModal = (specialty: TourSpecialty) => {
    setCurrentSpecialty({ ...specialty });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSpecialty(null);
  };

  const saveCurrentSpecialty = async () => {
    if (!currentSpecialty) return;

    try {
      await setDoc(doc(db, 'tourSpecialties', currentSpecialty.id.toString()), currentSpecialty);

      const updated = specialties.some((s) => s.id === currentSpecialty.id)
        ? specialties.map((s) => (s.id === currentSpecialty.id ? currentSpecialty : s))
        : [...specialties, currentSpecialty];

      setSpecialties(updated);
      onSave(updated);
      closeModal();
      alert('✅ Spécialité sauvegardée avec succès !');
    } catch (err: any) {
      console.error('Erreur Firestore:', err);
      alert(`❌ Erreur lors de la sauvegarde :\n${err.message || err}`);
    }
  };

  const deleteSpecialty = async (id: number) => {
    if (!confirm('⚠️ Supprimer définitivement cette spécialité ?')) return;
    try {
      await deleteDoc(doc(db, 'tourSpecialties', id.toString()));
      const updated = specialties.filter((s) => s.id !== id);
      setSpecialties(updated);
      onSave(updated);
      alert('✅ Spécialité supprimée avec succès');
    } catch (err) {
      console.error('Erreur suppression:', err);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const emojiOptions = [
    '🦜', '📷', '🏖️', '🚣', '🏛️', '🌿', '🦎', '🌋', '🏞️', '🐋',
    '🌊', '🎨', '🎭', '⛰️', '🌺', '🦋', '🌟', '✨', '🎯', '🔥',
  ];

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="text-lg text-foreground mb-4">Chargement des spécialités depuis Firebase...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ==================== HEADER RESPONSIVE ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gestion des Spécialités de Tours</h2>
          <p className="text-muted-foreground mt-2">Images stockées directement en Base64 dans Firestore (plan Spark gratuit)</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold shadow-xl transition-all"
        >
          <Plus size={22} /> Ajouter une spécialité
        </motion.button>
      </div>

      {/* ==================== CARTES PREVIEW ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {specialties.map((specialty) => (
          <motion.div
            key={specialty.id}
            layout
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="relative h-64">
              <img
                src={specialty.image || 'https://via.placeholder.com/600x400?text=Pas+d%27image'}
                alt={specialty.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=Image+non+disponible';
                }}
              />
              <div className="absolute top-6 left-6 text-4xl bg-white/90 backdrop-blur rounded-2xl w-16 h-16 flex items-center justify-center shadow-2xl">
                {specialty.icon}
              </div>
              {specialty.isBestSeller && (
                <div className="absolute top-6 left-28 bg-gradient-to-r from-amber-400 to-yellow-600 text-white px-5 py-2 rounded-full font-bold text-sm shadow-xl">
                  🏆 Best Seller
                </div>
              )}
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">{specialty.title}</h3>
              <p className="text-muted-foreground line-clamp-3 mb-6">{specialty.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-2">
                  <MapPin size={16} /> {specialty.location}
                </span>
                <span>{specialty.duration}</span>
                <span className="font-bold text-foreground">{specialty.price}</span>
              </div>

              {/* Boutons en colonne sur mobile */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openEditModal(specialty)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-colors"
                >
                  <Edit2 size={18} /> Modifier
                </button>
                <button
                  onClick={() => deleteSpecialty(specialty.id)}
                  className="flex-shrink-0 p-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ==================== MODALE ==================== */}
      <AnimatePresence>
        {isModalOpen && currentSpecialty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-card border-b border-border px-6 sm:px-8 py-6 flex justify-between items-center z-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {specialties.some((s) => s.id === currentSpecialty.id) ? 'Modifier' : 'Ajouter'} une spécialité
                </h2>
                <button onClick={closeModal} className="p-3 hover:bg-muted rounded-xl transition-colors">
                  <X size={28} />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {/* Icône */}
                <div>
                  <label className="block text-lg font-medium text-foreground mb-4">Icône (emoji)</label>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-4 mb-6">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCurrentSpecialty((prev) => (prev ? { ...prev, icon: emoji } : null))}
                        className={`aspect-square text-3xl rounded-2xl transition-all shadow-lg flex items-center justify-center ${
                          currentSpecialty.icon === emoji
                            ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground ring-4 ring-primary/30 scale-110'
                            : 'bg-muted hover:bg-muted/80 hover:scale-105'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={currentSpecialty.icon}
                    onChange={(e) =>
                      setCurrentSpecialty((prev) => (prev ? { ...prev, icon: e.target.value } : null))
                    }
                    placeholder="Ou entrez un emoji personnalisé"
                    className="w-full px-5 py-4 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Titre & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2">Titre</label>
                    <input
                      type="text"
                      value={currentSpecialty.title}
                      onChange={(e) =>
                        setCurrentSpecialty((prev) => (prev ? { ...prev, title: e.target.value } : null))
                      }
                      className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={currentSpecialty.slug}
                      onChange={(e) =>
                        setCurrentSpecialty((prev) => (prev ? { ...prev, slug: e.target.value } : null))
                      }
                      className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium mb-2">Description courte</label>
                  <textarea
                    rows={4}
                    value={currentSpecialty.description}
                    onChange={(e) =>
                      setCurrentSpecialty((prev) => (prev ? { ...prev, description: e.target.value } : null))
                    }
                    className="w-full px-5 py-4 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-lg font-medium mb-4">Image de couverture</label>
                  <ImageUploader
                    value={currentSpecialty.image}
                    onChange={(base64) =>
                      setCurrentSpecialty((prev) => (prev ? { ...prev, image: base64 } : null))
                    }
                    aspectRatio="3/2"
                  />
                </div>

                {/* Lien */}
                <div>
                  <label className="block font-medium mb-2">Lien vers la page détaillée</label>
                  <input
                    type="text"
                    value={currentSpecialty.link}
                    onChange={(e) =>
                      setCurrentSpecialty((prev) => (prev ? { ...prev, link: e.target.value } : null))
                    }
                    className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Infos principales */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-medium mb-2">Durée</label>
                    <input
                      type="text"
                      value={currentSpecialty.duration}
                      onChange={(e) =>
                        setCurrentSpecialty((prev) => (prev ? { ...prev, duration: e.target.value } : null))
                      }
                      className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Localisation</label>
                    <input
                      type="text"
                      value={currentSpecialty.location}
                      onChange={(e) =>
                        setCurrentSpecialty((prev) => (prev ? { ...prev, location: e.target.value } : null))
                      }
                      className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Prix</label>
                    <input
                      type="text"
                      value={currentSpecialty.price}
                      onChange={(e) =>
                        setCurrentSpecialty((prev) => (prev ? { ...prev, price: e.target.value } : null))
                      }
                      className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Transport et Difficulté */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2">Transport</label>
                    <input
                      type="text"
                      value={currentSpecialty.transport}
                      onChange={(e) =>
                        setCurrentSpecialty((prev) => (prev ? { ...prev, transport: e.target.value } : null))
                      }
                      placeholder="ex: 4x4 Toyota Land Cruiser"
                      className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Difficulté</label>
                    <input
                      type="text"
                      value={currentSpecialty.difficulty}
                      onChange={(e) =>
                        setCurrentSpecialty((prev) => (prev ? { ...prev, difficulty: e.target.value } : null))
                      }
                      placeholder="ex: Modéré"
                      className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Why Us */}
                <div>
                  <label className="block font-medium mb-2">Pourquoi nous choisir ? (Why Us)</label>
                  <textarea
                    rows={5}
                    value={currentSpecialty.whyUs}
                    onChange={(e) =>
                      setCurrentSpecialty((prev) => (prev ? { ...prev, whyUs: e.target.value } : null))
                    }
                    className="w-full px-5 py-4 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Best Seller */}
                <div className="flex items-center gap-4 py-4">
                  <input
                    type="checkbox"
                    id="bestseller"
                    checked={currentSpecialty.isBestSeller}
                    onChange={(e) =>
                      setCurrentSpecialty((prev) => (prev ? { ...prev, isBestSeller: e.target.checked } : null))
                    }
                    className="w-6 h-6 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="bestseller" className="text-xl font-medium cursor-pointer flex items-center gap-3">
                    <span className="text-3xl">🏆</span> Marquer comme Best Seller
                  </label>
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Points forts</label>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSpecialty((prev) =>
                          prev ? { ...prev, highlights: [...prev.highlights, 'Nouveau point fort'] } : null
                        )
                      }
                      className="flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <Plus size={18} /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-3">
                    {currentSpecialty.highlights.map((h, i) => (
                      <div key={i} className="flex gap-3">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => {
                            const newH = [...currentSpecialty.highlights];
                            newH[i] = e.target.value;
                            setCurrentSpecialty((prev) => (prev ? { ...prev, highlights: newH } : null));
                          }}
                          className="flex-1 px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentSpecialty((prev) =>
                              prev ? { ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) } : null
                            )
                          }
                          className="p-4 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Itinéraire */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Itinéraire détaillé</label>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSpecialty((prev) =>
                          prev
                            ? {
                                ...prev,
                                itinerary: [
                                  ...prev.itinerary,
                                  {
                                    day: `Jour ${prev.itinerary.length + 1}`,
                                    title: 'Nouvelle étape',
                                    description: '',
                                  },
                                ],
                              }
                            : null
                        )
                      }
                      className="flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <Plus size={18} /> Ajouter une étape
                    </button>
                  </div>
                  <div className="space-y-6">
                    {currentSpecialty.itinerary.map((step, idx) => (
                      <div key={idx} className="border border-border rounded-2xl p-6 bg-muted/20">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                          <input
                            type="text"
                            value={step.day}
                            onChange={(e) => {
                              const newIt = [...currentSpecialty.itinerary];
                              newIt[idx].day = e.target.value;
                              setCurrentSpecialty((prev) => (prev ? { ...prev, itinerary: newIt } : null));
                            }}
                            className="font-bold text-lg px-4 py-2 border border-border rounded-xl w-full sm:w-48"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (idx === 0) return;
                                const newIt = [...currentSpecialty.itinerary];
                                [newIt[idx], newIt[idx - 1]] = [newIt[idx - 1], newIt[idx]];
                                setCurrentSpecialty((prev) => (prev ? { ...prev, itinerary: newIt } : null));
                              }}
                              disabled={idx === 0}
                              className="p-2 disabled:opacity-50 hover:bg-muted rounded-lg transition-colors"
                            >
                              <ChevronUp size={20} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (idx === currentSpecialty.itinerary.length - 1) return;
                                const newIt = [...currentSpecialty.itinerary];
                                [newIt[idx], newIt[idx + 1]] = [newIt[idx + 1], newIt[idx]];
                                setCurrentSpecialty((prev) => (prev ? { ...prev, itinerary: newIt } : null));
                              }}
                              disabled={idx === currentSpecialty.itinerary.length - 1}
                              className="p-2 disabled:opacity-50 hover:bg-muted rounded-lg transition-colors"
                            >
                              <ChevronDown size={20} />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentSpecialty((prev) =>
                                  prev ? { ...prev, itinerary: prev.itinerary.filter((_, i) => i !== idx) } : null
                                )
                              }
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const newIt = [...currentSpecialty.itinerary];
                            newIt[idx].title = e.target.value;
                            setCurrentSpecialty((prev) => (prev ? { ...prev, itinerary: newIt } : null));
                          }}
                          placeholder="Titre de l'étape"
                          className="text-xl font-semibold w-full mb-4 px-5 py-3 border border-border rounded-xl"
                        />
                        <textarea
                          rows={4}
                          value={step.description}
                          onChange={(e) => {
                            const newIt = [...currentSpecialty.itinerary];
                            newIt[idx].description = e.target.value;
                            setCurrentSpecialty((prev) => (prev ? { ...prev, itinerary: newIt } : null));
                          }}
                          placeholder="Description détaillée de cette étape..."
                          className="w-full px-5 py-4 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Galerie d'images */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Galerie d'images (upload)</label>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSpecialty((prev) =>
                          prev ? { ...prev, gallery: [...(prev.gallery || []), ''] } : null
                        )
                      }
                      className="flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <Plus size={18} /> Ajouter une image
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(currentSpecialty.gallery || []).map((g, i) => (
                      <div key={i} className="border border-border rounded-2xl p-4 bg-muted/20">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="text-sm font-semibold text-muted-foreground">Image #{i + 1}</div>
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentSpecialty((prev) =>
                                prev ? { ...prev, gallery: (prev.gallery || []).filter((_, idx) => idx !== i) } : null
                              )
                            }
                            className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <ImageUploader
                          value={g}
                          onChange={(base64) =>
                            setCurrentSpecialty((prev) => {
                              if (!prev) return null;
                              const next = [...(prev.gallery || [])];
                              next[i] = base64;
                              return { ...prev, gallery: next };
                            })
                          }
                          aspectRatio="3/2"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendrier de disponibilités */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Calendrier de disponibilités</label>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSpecialty((prev) =>
                          prev
                            ? {
                                ...prev,
                                availability: [
                                  ...(Array.isArray(prev.availability) ? prev.availability : []),
                                  { date: '', status: 'available', note: '' },
                                ],
                              }
                            : null
                        )
                      }
                      className="flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <Plus size={18} /> Ajouter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(Array.isArray(currentSpecialty.availability)
                      ? currentSpecialty.availability
                      : currentSpecialty.availability && typeof currentSpecialty.availability === 'object'
                      ? (Object.entries(currentSpecialty.availability as any)
                          .map(([date, v]: any) => ({ date, status: v?.status, note: v?.note }))
                          .filter((e: any) => typeof e?.date === 'string' && typeof e?.status === 'string') as AvailabilityEntry[])
                      : []
                    ).map((a, i) => (
                      <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 border border-border rounded-2xl p-4 bg-muted/20">
                        <div>
                          <label className="block text-sm font-medium mb-2">Date (YYYY-MM-DD)</label>
                          <input
                            type="text"
                            value={a.date}
                            onChange={(e) => {
                              const next = [...(Array.isArray(currentSpecialty.availability) ? currentSpecialty.availability : [])];
                              next[i] = { ...next[i], date: e.target.value };
                              setCurrentSpecialty((prev) => (prev ? { ...prev, availability: next } : null));
                            }}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="2026-05-14"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Statut</label>
                          <select
                            value={a.status}
                            onChange={(e) => {
                              const next = [...(Array.isArray(currentSpecialty.availability) ? currentSpecialty.availability : [])];
                              next[i] = { ...next[i], status: e.target.value as AvailabilityStatus };
                              setCurrentSpecialty((prev) => (prev ? { ...prev, availability: next } : null));
                            }}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="available">Disponible</option>
                            <option value="limited">Limité</option>
                            <option value="unavailable">Complet</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Note</label>
                          <input
                            type="text"
                            value={a.note || ''}
                            onChange={(e) => {
                              const next = [...(Array.isArray(currentSpecialty.availability) ? currentSpecialty.availability : [])];
                              next[i] = { ...next[i], note: e.target.value };
                              setCurrentSpecialty((prev) => (prev ? { ...prev, availability: next } : null));
                            }}
                            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="ex: départ garanti"
                          />
                        </div>

                        <div className="md:col-span-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentSpecialty((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      availability: (Array.isArray(prev.availability) ? prev.availability : []).filter(
                                        (_, idx) => idx !== i
                                      ),
                                    }
                                  : null
                              )
                            }
                            className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carte interactive */}
                <div>
                  <label className="block font-medium mb-2">Carte itinéraire (Embed URL)</label>
                  <input
                    type="text"
                    value={currentSpecialty.itineraryMapEmbedUrl || ''}
                    onChange={(e) =>
                      setCurrentSpecialty((prev) => (prev ? { ...prev, itineraryMapEmbedUrl: e.target.value } : null))
                    }
                    placeholder="https://www.google.com/maps/embed?..."
                    className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Témoignages */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Témoignages clients</label>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSpecialty((prev) =>
                          prev
                            ? {
                                ...prev,
                                testimonials: [
                                  ...(prev.testimonials || []),
                                  { name: '', text: '', rating: 5, date: '' },
                                ],
                              }
                            : null
                        )
                      }
                      className="flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <Plus size={18} /> Ajouter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(currentSpecialty.testimonials || []).map((r, i) => (
                      <div key={i} className="border border-border rounded-2xl p-6 bg-muted/20 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Nom</label>
                            <input
                              type="text"
                              value={r.name}
                              onChange={(e) => {
                                const next = [...(currentSpecialty.testimonials || [])];
                                next[i] = { ...next[i], name: e.target.value };
                                setCurrentSpecialty((prev) => (prev ? { ...prev, testimonials: next } : null));
                              }}
                              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Note (1-5)</label>
                            <input
                              type="number"
                              min={1}
                              max={5}
                              value={r.rating ?? 5}
                              onChange={(e) => {
                                const next = [...(currentSpecialty.testimonials || [])];
                                next[i] = { ...next[i], rating: Number(e.target.value) };
                                setCurrentSpecialty((prev) => (prev ? { ...prev, testimonials: next } : null));
                              }}
                              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Date (optionnel)</label>
                            <input
                              type="text"
                              value={r.date || ''}
                              onChange={(e) => {
                                const next = [...(currentSpecialty.testimonials || [])];
                                next[i] = { ...next[i], date: e.target.value };
                                setCurrentSpecialty((prev) => (prev ? { ...prev, testimonials: next } : null));
                              }}
                              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Texte</label>
                          <textarea
                            rows={4}
                            value={r.text}
                            onChange={(e) => {
                              const next = [...(currentSpecialty.testimonials || [])];
                              next[i] = { ...next[i], text: e.target.value };
                              setCurrentSpecialty((prev) => (prev ? { ...prev, testimonials: next } : null));
                            }}
                            className="w-full px-5 py-4 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentSpecialty((prev) =>
                                prev ? { ...prev, testimonials: (prev.testimonials || []).filter((_, idx) => idx !== i) } : null
                              )
                            }
                            className="p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ce qu'il faut apporter */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Ce qu'il faut apporter</label>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSpecialty((prev) =>
                          prev ? { ...prev, packingList: [...(prev.packingList || []), ''] } : null
                        )
                      }
                      className="flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <Plus size={18} /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(currentSpecialty.packingList || []).map((p, i) => (
                      <div key={i} className="flex gap-3">
                        <input
                          type="text"
                          value={p}
                          onChange={(e) => {
                            const next = [...(currentSpecialty.packingList || [])];
                            next[i] = e.target.value;
                            setCurrentSpecialty((prev) => (prev ? { ...prev, packingList: next } : null));
                          }}
                          className="flex-1 px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentSpecialty((prev) =>
                              prev ? { ...prev, packingList: (prev.packingList || []).filter((_, idx) => idx !== i) } : null
                            )
                          }
                          className="p-4 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tours similaires */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-lg font-medium">Tours similaires (slugs)</label>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSpecialty((prev) =>
                          prev ? { ...prev, similarTourSlugs: [...(prev.similarTourSlugs || []), ''] } : null
                        )
                      }
                      className="flex items-center gap-2 text-primary hover:underline text-sm"
                    >
                      <Plus size={18} /> Ajouter
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(currentSpecialty.similarTourSlugs || []).map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <input
                          type="text"
                          value={s}
                          onChange={(e) => {
                            const next = [...(currentSpecialty.similarTourSlugs || [])];
                            next[i] = e.target.value;
                            setCurrentSpecialty((prev) => (prev ? { ...prev, similarTourSlugs: next } : null));
                          }}
                          placeholder="ex: grand-tour-sud"
                          className="flex-1 px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentSpecialty((prev) =>
                              prev ? { ...prev, similarTourSlugs: (prev.similarTourSlugs || []).filter((_, idx) => idx !== i) } : null
                            )
                          }
                          className="p-4 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partage social */}
                <div className="flex items-center gap-4 py-4">
                  <input
                    type="checkbox"
                    id="enableShare"
                    checked={currentSpecialty.enableShare ?? true}
                    onChange={(e) =>
                      setCurrentSpecialty((prev) => (prev ? { ...prev, enableShare: e.target.checked } : null))
                    }
                    className="w-6 h-6 rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="enableShare" className="text-lg font-medium cursor-pointer">
                    Activer le partage social
                  </label>
                </div>

                {/* Boutons finaux - empilés sur mobile */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-border">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:w-auto px-8 py-4 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors order-2 sm:order-1"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={saveCurrentSpecialty}
                    className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all order-1 sm:order-2"
                  >
                    Enregistrer la spécialité
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}