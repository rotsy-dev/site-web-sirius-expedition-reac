import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, ChevronUp, ChevronDown, MapPin, Upload, Link as LinkIcon } from 'lucide-react';
import { db } from '../../../../firebase/config'; // Firestore reste utilisé (plan Spark gratuit OK)
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { uploadImageToImgBB } from '@/utils/uploadImage'; // Ta fonction ImgBB

interface ItineraryStep {
    day: string;
    title: string;
    description: string;
}

interface TourSpecialty {
    id: number;
    icon: string;
    title: string;
    slug: string;
    description: string;
    image: string;
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

export function TourSpecialtiesEditor({ specialties: initialSpecialties, onSave }: TourSpecialtiesEditorProps) {
    const [specialties, setSpecialties] = useState<TourSpecialty[]>(initialSpecialties);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Modale
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSpecialty, setCurrentSpecialty] = useState<TourSpecialty | null>(null);

    // Gestion image
    const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
    const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'tourSpecialties'));
                const fetched = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data();
                    return {
                        id: parseInt(docSnap.id),
                        icon: data.icon || '🌟',
                        title: data.title || '',
                        slug: data.slug || '',
                        description: data.description || '',
                        image: data.image || '',
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
                }).sort((a, b) => a.id - b.id);

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
        const newId = Math.max(...specialties.map(s => s.id), 0) + 1;
        const newSpecialty: TourSpecialty = {
            id: newId,
            icon: '🌟',
            title: 'Nouvelle Spécialité',
            slug: 'nouvelle-specialite',
            description: 'Description détaillée de cette expérience unique...',
            image: '',
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
        setImageInputMode('url');
        setUploadedImageFile(null);
        setImagePreview('');
        setIsModalOpen(true);
    };

    const openEditModal = (specialty: TourSpecialty) => {
        setCurrentSpecialty({ ...specialty });
        setImageInputMode(specialty.image ? 'url' : 'upload');
        setUploadedImageFile(null);
        setImagePreview(specialty.image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentSpecialty(null);
        setUploadedImageFile(null);
        setImagePreview('');
        setImageInputMode('url');
    };

    // Gestion fichier image avec validation
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024; // 5MB (ImgBB accepte jusqu'à 32MB, mais on reste prudent)
        if (file.size > maxSize) {
            alert('❌ Le fichier est trop volumineux. Taille maximale : 5MB');
            e.target.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('❌ Veuillez sélectionner une image valide (JPG, PNG, WebP, etc.)');
            e.target.value = '';
            return;
        }

        setUploadedImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.onerror = () => {
            alert('❌ Erreur lors de la lecture du fichier');
            setUploadedImageFile(null);
            setImagePreview('');
        };
        reader.readAsDataURL(file);
    };

    // Sauvegarde avec upload ImgBB si nécessaire
    const saveCurrentSpecialty = async () => {
        if (!currentSpecialty) return;

        setIsUploading(true);
        let finalImageUrl = currentSpecialty.image;

        if (uploadedImageFile) {
            try {
                console.log('🔄 Upload de l\'image vers ImgBB en cours...');
                finalImageUrl = await uploadImageToImgBB(uploadedImageFile);
                console.log('✅ Upload réussi ! URL ImgBB :', finalImageUrl);
            } catch (err: any) {
                console.error('❌ Erreur upload ImgBB:', err);
                alert(`❌ Échec de l'upload sur ImgBB :\n${err.message || 'Vérifiez votre clé API ou votre connexion internet.'}`);
                setIsUploading(false);
                return;
            }
        }

        const specialtyToSave = { ...currentSpecialty, image: finalImageUrl };

        try {
            await setDoc(doc(db, 'tourSpecialties', specialtyToSave.id.toString()), specialtyToSave);

            const updated = specialties.some(s => s.id === specialtyToSave.id)
                ? specialties.map(s => s.id === specialtyToSave.id ? specialtyToSave : s)
                : [...specialties, specialtyToSave];

            setSpecialties(updated);
            onSave(updated);
            closeModal();
            alert('✅ Spécialité sauvegardée avec succès !');
        } catch (err: any) {
            console.error('❌ Erreur Firestore:', err);
            alert(`❌ Erreur lors de la sauvegarde :\n${err.message || err}`);
        } finally {
            setIsUploading(false);
        }
    };

    const deleteSpecialty = async (id: number) => {
        if (!confirm('⚠️ Supprimer définitivement cette spécialité ?')) return;
        try {
            await deleteDoc(doc(db, 'tourSpecialties', id.toString()));
            const updated = specialties.filter(s => s.id !== id);
            setSpecialties(updated);
            onSave(updated);
            alert('✅ Spécialité supprimée avec succès');
        } catch (err) {
            console.error('Erreur suppression:', err);
            alert('❌ Erreur lors de la suppression');
        }
    };

    const emojiOptions = ['🦜', '📷', '🏖️', '🚣', '🏛️', '🌿', '🦎', '🌋', '🏞️', '🐋', '🌊', '🎨', '🎭', '⛰️', '🌺', '🦋', '🌟', '✨', '🎯', '🔥'];

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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Gestion des Spécialités de Tours</h2>
                    <p className="text-muted-foreground mt-2">Upload d'images via ImgBB (100% gratuit)</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openAddModal}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold shadow-xl"
                >
                    <Plus size={20} /> Ajouter une spécialité
                </motion.button>
            </div>

            {/* Cartes preview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-foreground mb-3">{specialty.title}</h3>
                            <p className="text-muted-foreground line-clamp-3 mb-6">{specialty.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
                                <span className="flex items-center gap-2"><MapPin size={16} /> {specialty.location}</span>
                                <span>{specialty.duration}</span>
                                <span className="font-bold text-foreground">{specialty.price}</span>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => openEditModal(specialty)}
                                    className="flex items-center gap-2 px-5 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-colors"
                                >
                                    <Edit2 size={18} /> Modifier
                                </button>
                                <button
                                    onClick={() => deleteSpecialty(specialty.id)}
                                    className="p-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* MODALE */}
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
                            <div className="sticky top-0 bg-card border-b border-border px-8 py-6 flex justify-between items-center z-10">
                                <h2 className="text-3xl font-bold text-foreground">
                                    {specialties.some(s => s.id === currentSpecialty.id) ? 'Modifier' : 'Ajouter'} une spécialité
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-3 hover:bg-muted rounded-xl transition-colors"
                                    disabled={isUploading}
                                >
                                    <X size={28} />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Icône */}
                                <div>
                                    <label className="block text-lg font-medium text-foreground mb-4">Icône (emoji)</label>
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        {emojiOptions.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setCurrentSpecialty(prev => prev ? { ...prev, icon: emoji } : null)}
                                                className={`w-14 h-14 text-3xl rounded-2xl transition-all shadow-lg ${
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
                                        onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, icon: e.target.value } : null)}
                                        placeholder="Ou entrez un emoji personnalisé"
                                        className="w-full px-5 py-4 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Titre & Slug */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-medium mb-2">Titre</label>
                                        <input
                                            type="text"
                                            value={currentSpecialty.title}
                                            onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, title: e.target.value } : null)}
                                            className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-2">Slug (URL)</label>
                                        <input
                                            type="text"
                                            value={currentSpecialty.slug}
                                            onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, slug: e.target.value } : null)}
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
                                        onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, description: e.target.value } : null)}
                                        className="w-full px-5 py-4 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Image avec URL ou Upload */}
                                <div>
                                    <label className="block text-lg font-medium mb-4">Image de fond</label>

                                    <div className="flex gap-8 mb-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="imageMode"
                                                checked={imageInputMode === 'url'}
                                                onChange={() => {
                                                    setImageInputMode('url');
                                                    setUploadedImageFile(null);
                                                }}
                                                className="w-5 h-5 text-primary"
                                            />
                                            <LinkIcon size={22} />
                                            <span className="font-medium">Par URL</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="imageMode"
                                                checked={imageInputMode === 'upload'}
                                                onChange={() => {
                                                    setImageInputMode('upload');
                                                    setCurrentSpecialty(prev => prev ? { ...prev, image: '' } : null);
                                                }}
                                                className="w-5 h-5 text-primary"
                                            />
                                            <Upload size={22} />
                                            <span className="font-medium">Par upload local (ImgBB)</span>
                                        </label>
                                    </div>

                                    {imageInputMode === 'url' ? (
                                        <input
                                            type="text"
                                            value={currentSpecialty.image}
                                            onChange={(e) => {
                                                setCurrentSpecialty(prev => prev ? { ...prev, image: e.target.value } : null);
                                                setImagePreview(e.target.value);
                                                setUploadedImageFile(null);
                                            }}
                                            placeholder="https://images.unsplash.com/..."
                                            className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    ) : (
                                        <div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageFileChange}
                                                className="block w-full text-sm text-muted-foreground file:mr-6 file:py-4 file:px-8 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                                            />
                                            {uploadedImageFile && (
                                                <p className="mt-3 text-sm text-green-600 font-medium flex items-center gap-2">
                                                    ✓ {uploadedImageFile.name} ({(uploadedImageFile.size / 1024 / 1024).toFixed(2)} MB)
                                                    <span className="text-muted-foreground">- sera uploadée sur ImgBB à l'enregistrement</span>
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {(imagePreview || currentSpecialty.image) && (
                                        <div className="mt-8">
                                            <p className="text-sm font-medium text-muted-foreground mb-3">Prévisualisation</p>
                                            <img
                                                src={imagePreview || currentSpecialty.image}
                                                alt="Prévisualisation"
                                                className="w-full max-h-96 object-cover rounded-2xl shadow-xl border border-border"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = 'https://via.placeholder.com/600x400?text=Erreur+de+chargement';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Lien */}
                                <div>
                                    <label className="block font-medium mb-2">Lien vers la page détaillée</label>
                                    <input
                                        type="text"
                                        value={currentSpecialty.link}
                                        onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, link: e.target.value } : null)}
                                        className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Infos principales */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block font-medium mb-2">Durée</label>
                                        <input
                                            type="text"
                                            value={currentSpecialty.duration}
                                            onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, duration: e.target.value } : null)}
                                            className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-2">Localisation</label>
                                        <input
                                            type="text"
                                            value={currentSpecialty.location}
                                            onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, location: e.target.value } : null)}
                                            className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-2">Prix</label>
                                        <input
                                            type="text"
                                            value={currentSpecialty.price}
                                            onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, price: e.target.value } : null)}
                                            className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                {/* Transport et Difficulté */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block font-medium mb-2">Transport</label>
                                        <input
                                            type="text"
                                            value={currentSpecialty.transport}
                                            onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, transport: e.target.value } : null)}
                                            placeholder="ex: 4x4 Toyota Land Cruiser"
                                            className="w-full px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-medium mb-2">Difficulté</label>
                                        <input
                                            type="text"
                                            value={currentSpecialty.difficulty}
                                            onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, difficulty: e.target.value } : null)}
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
                                        onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, whyUs: e.target.value } : null)}
                                        className="w-full px-5 py-4 border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {/* Best Seller */}
                                <div className="flex items-center gap-4 py-4">
                                    <input
                                        type="checkbox"
                                        id="bestseller"
                                        checked={currentSpecialty.isBestSeller}
                                        onChange={(e) => setCurrentSpecialty(prev => prev ? { ...prev, isBestSeller: e.target.checked } : null)}
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
                                            onClick={() => setCurrentSpecialty(prev => prev ? { ...prev, highlights: [...prev.highlights, 'Nouveau point fort'] } : null)}
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
                                                        setCurrentSpecialty(prev => prev ? { ...prev, highlights: newH } : null);
                                                    }}
                                                    className="flex-1 px-5 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentSpecialty(prev => prev ? { ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) } : null)}
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
                                            onClick={() => setCurrentSpecialty(prev => prev ? {
                                                ...prev,
                                                itinerary: [...prev.itinerary, { day: `Jour ${prev.itinerary.length + 1}`, title: 'Nouvelle étape', description: '' }]
                                            } : null)}
                                            className="flex items-center gap-2 text-primary hover:underline text-sm"
                                        >
                                            <Plus size={18} /> Ajouter une étape
                                        </button>
                                    </div>
                                    <div className="space-y-6">
                                        {currentSpecialty.itinerary.map((step, idx) => (
                                            <div key={idx} className="border border-border rounded-2xl p-6 bg-muted/20">
                                                <div className="flex justify-between items-start mb-4">
                                                    <input
                                                        type="text"
                                                        value={step.day}
                                                        onChange={(e) => {
                                                            const newIt = [...currentSpecialty.itinerary];
                                                            newIt[idx].day = e.target.value;
                                                            setCurrentSpecialty(prev => prev ? { ...prev, itinerary: newIt } : null);
                                                        }}
                                                        className="font-bold text-lg px-4 py-2 border border-border rounded-xl w-40"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (idx === 0) return;
                                                                const newIt = [...currentSpecialty.itinerary];
                                                                [newIt[idx], newIt[idx - 1]] = [newIt[idx - 1], newIt[idx]];
                                                                setCurrentSpecialty(prev => prev ? { ...prev, itinerary: newIt } : null);
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
                                                                setCurrentSpecialty(prev => prev ? { ...prev, itinerary: newIt } : null);
                                                            }}
                                                            disabled={idx === currentSpecialty.itinerary.length - 1}
                                                            className="p-2 disabled:opacity-50 hover:bg-muted rounded-lg transition-colors"
                                                        >
                                                            <ChevronDown size={20} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentSpecialty(prev => prev ? { ...prev, itinerary: prev.itinerary.filter((_, i) => i !== idx) } : null)}
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
                                                        setCurrentSpecialty(prev => prev ? { ...prev, itinerary: newIt } : null);
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
                                                        setCurrentSpecialty(prev => prev ? { ...prev, itinerary: newIt } : null);
                                                    }}
                                                    placeholder="Description détaillée de cette étape..."
                                                    className="w-full px-5 py-4 border border-border rounded-xl resize-none"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Boutons finaux */}
                                <div className="flex justify-end gap-4 pt-8 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={isUploading}
                                        className="px-8 py-4 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="button"
                                        onClick={saveCurrentSpecialty}
                                        disabled={isUploading}
                                        className="px-10 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Upload en cours...
                                            </>
                                        ) : (
                                            'Enregistrer la spécialité'
                                        )}
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