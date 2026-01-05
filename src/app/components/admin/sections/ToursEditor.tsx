import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, X, MapPin, Clock, DollarSign, Star, Edit2 } from 'lucide-react';
import { db } from '../../../../firebase/config';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { ImageUploader } from '@/components/shared/ImageUploader';

interface Tour {
    id: number;
    title: string;
    slug: string;
    image: string;
    duration: string;
    location: string;
    price: string;
    pricePerPerson: boolean;
    rating: number;
    reviews: number;
    description: string;
    longDescription: string;
    highlights: string[];
    difficulty: string;
    groupSize: string;
    bestTime: string;
}

interface ToursEditorProps {
    tours: Tour[];
    onSave: (tours: Tour[]) => void;
}

export function ToursEditor({ tours: initialTours, onSave }: ToursEditorProps) {
    const [tours, setTours] = useState<Tour[]>(initialTours);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTour, setEditingTour] = useState<Tour | null>(null);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const toursCollection = collection(db, 'bestSellers');
                const snapshot = await getDocs(toursCollection);
                const fetchedTours: Tour[] = snapshot.docs.map((docSnap) => ({
                    id: parseInt(docSnap.id),
                    ...docSnap.data() as Omit<Tour, 'id'>
                }));

                fetchedTours.sort((a, b) => a.id - b.id);
                setTours(fetchedTours.length > 0 ? fetchedTours : initialTours);
            } catch (err) {
                console.error('Erreur lors du chargement des tours (Best Sellers) :', err);
                alert('Impossible de charger les données depuis Firebase. Vérifiez votre connexion.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTours();
    }, [initialTours]);

    const handleChange = (id: number, field: keyof Tour, value: any) => {
        setTours(prev => prev.map(tour =>
            tour.id === id ? { ...tour, [field]: value } : tour
        ));
        setHasChanges(true);

        if (editingTour && editingTour.id === id) {
            setEditingTour(prev => prev ? { ...prev, [field]: value } : null);
        }
    };

    const handleHighlightChange = (tourId: number, index: number, value: string) => {
        setTours(prev => prev.map(tour => {
            if (tour.id === tourId) {
                const newHighlights = [...tour.highlights];
                newHighlights[index] = value;
                return { ...tour, highlights: newHighlights };
            }
            return tour;
        }));
        setHasChanges(true);

        if (editingTour && editingTour.id === tourId) {
            const newHighlights = [...editingTour.highlights];
            newHighlights[index] = value;
            setEditingTour({ ...editingTour, highlights: newHighlights });
        }
    };

    const addHighlight = (tourId: number) => {
        setTours(prev => prev.map(tour =>
            tour.id === tourId
                ? { ...tour, highlights: [...tour.highlights, 'Nouvelle caractéristique'] }
                : tour
        ));
        setHasChanges(true);

        if (editingTour && editingTour.id === tourId) {
            setEditingTour({
                ...editingTour,
                highlights: [...editingTour.highlights, 'Nouvelle caractéristique']
            });
        }
    };

    const removeHighlight = (tourId: number, index: number) => {
        setTours(prev => prev.map(tour =>
            tour.id === tourId
                ? { ...tour, highlights: tour.highlights.filter((_, i) => i !== index) }
                : tour
        ));
        setHasChanges(true);

        if (editingTour && editingTour.id === tourId) {
            setEditingTour({
                ...editingTour,
                highlights: editingTour.highlights.filter((_, i) => i !== index)
            });
        }
    };

    const handleAddTour = () => {
        const newId = Math.max(...tours.map(t => t.id), 0) + 1;
        const newTour: Tour = {
            id: newId,
            title: 'Nouveau Tour Incroyable',
            slug: 'nouveau-tour',
            image: '',
            duration: '7 jours',
            location: 'Madagascar',
            price: 'À partir de 2 500€',
            pricePerPerson: true,
            rating: 4.8,
            reviews: 42,
            description: 'Une aventure exceptionnelle à travers les paysages uniques...',
            longDescription: 'Description détaillée du tour ici...',
            highlights: ['Guide expert', 'Hébergement premium', 'Repas inclus', 'Transport privé'],
            difficulty: 'Modérée',
            groupSize: '4-12 personnes',
            bestTime: 'Mai à Novembre',
        };
        setTours(prev => [...prev, newTour]);
        setEditingTour(newTour);
        setIsEditModalOpen(true);
        setHasChanges(true);
    };

    const openEditModal = (tour: Tour) => {
        setEditingTour(tour);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingTour(null);
    };

    const handleDeleteTour = async (id: number) => {
        if (tours.length <= 1) {
            alert('Vous devez garder au moins un tour dans les Best Sellers !');
            return;
        }

        if (confirm('Supprimer définitivement ce tour ? Cette action est irréversible.')) {
            try {
                await deleteDoc(doc(db, 'bestSellers', id.toString()));
                setTours(prev => prev.filter(t => t.id !== id));
                setHasChanges(true);
                alert('Tour supprimé avec succès !');
            } catch (err) {
                console.error('Erreur lors de la suppression dans Firebase :', err);
                alert('Impossible de supprimer le tour.');
            }
        }
    };

    const handleSave = async () => {
        try {
            for (const tour of tours) {
                const tourDoc = doc(db, 'bestSellers', tour.id.toString());
                await setDoc(tourDoc, tour);
            }

            onSave(tours);
            setHasChanges(false);
            alert('✅ Tous les tours Best Sellers ont été sauvegardés avec succès dans Firebase !');
        } catch (err) {
            console.error('Erreur lors de la sauvegarde dans Firebase :', err);
            alert('Erreur lors de la sauvegarde.');
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-lg text-foreground">Chargement des tours Best Sellers depuis Firebase...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* ==================== HEADER RESPONSIVE ==================== */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Best Sellers Tours</h2>
                    <p className="text-muted-foreground">Gérez vos tours populaires affichés sur la page d'accueil</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {hasChanges && (
                        <div className="self-start sm:self-center">
                            <span className="text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-lg font-medium">
                                Modifications non sauvegardées
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddTour}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Ajouter Tour
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Save size={18} />
                            Sauvegarder
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* ==================== LISTE DES TOURS ==================== */}
            <div className="grid gap-6">
                {tours.map((tour, index) => (
                    <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                    >
                        {/* Header de la carte - responsive */}
                        <div className="p-4 bg-card border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    {tour.image ? (
                                        <img
                                            src={tour.image}
                                            alt={tour.title}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                            <MapPin size={24} className="text-gray-400 dark:text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-foreground text-lg">{tour.title}</h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} /> {tour.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} /> {tour.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign size={14} /> {tour.price}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star size={14} fill="currentColor" className="text-primary" />
                                            {tour.rating} ({tour.reviews} avis)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex items-center gap-2 self-start sm:self-center">
                                <button
                                    onClick={() => openEditModal(tour)}
                                    className="flex items-center gap-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Edit2 size={16} />
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDeleteTour(tour.id)}
                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} className="text-destructive" />
                                </button>
                            </div>
                        </div>

                        {/* Aperçu image grande (optionnel) */}
                        {tour.image && (
                            <div className="p-4 bg-muted/50 flex justify-center">
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="max-h-48 rounded-lg object-cover shadow-md max-w-full"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* ==================== MODALE D'ÉDITION ==================== */}
            <AnimatePresence>
                {isEditModalOpen && editingTour && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={closeEditModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between z-10">
                                <h3 className="text-2xl font-bold text-foreground">
                                    {editingTour.id > Math.max(...initialTours.map(t => t.id), 0)
                                        ? 'Ajouter un nouveau tour'
                                        : 'Modifier le tour'}
                                </h3>
                                <button
                                    onClick={closeEditModal}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Image principale du tour
                                    </label>
                                    <ImageUploader
                                        value={editingTour.image}
                                        onChange={(url: any) => handleChange(editingTour.id, 'image', url)}
                                        aspectRatio="16/10"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        L'image sera automatiquement compressée et optimisée
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Titre du tour</label>
                                        <input
                                            type="text"
                                            value={editingTour.title}
                                            onChange={(e) => handleChange(editingTour.id, 'title', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                                        <input
                                            type="text"
                                            value={editingTour.slug}
                                            onChange={(e) => handleChange(editingTour.id, 'slug', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Durée</label>
                                        <input
                                            type="text"
                                            value={editingTour.duration}
                                            onChange={(e) => handleChange(editingTour.id, 'duration', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Localisation</label>
                                        <input
                                            type="text"
                                            value={editingTour.location}
                                            onChange={(e) => handleChange(editingTour.id, 'location', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Prix</label>
                                        <input
                                            type="text"
                                            value={editingTour.price}
                                            onChange={(e) => handleChange(editingTour.id, 'price', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Note (sur 5)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="5"
                                            value={editingTour.rating}
                                            onChange={(e) => handleChange(editingTour.id, 'rating', parseFloat(e.target.value) || 0)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2">Description courte</label>
                                        <textarea
                                            value={editingTour.description}
                                            onChange={(e) => handleChange(editingTour.id, 'description', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2">Description longue</label>
                                        <textarea
                                            value={editingTour.longDescription}
                                            onChange={(e) => handleChange(editingTour.id, 'longDescription', e.target.value)}
                                            rows={6}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Difficulté</label>
                                        <input
                                            type="text"
                                            value={editingTour.difficulty}
                                            onChange={(e) => handleChange(editingTour.id, 'difficulty', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Taille du groupe</label>
                                        <input
                                            type="text"
                                            value={editingTour.groupSize}
                                            onChange={(e) => handleChange(editingTour.id, 'groupSize', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Meilleure période</label>
                                        <input
                                            type="text"
                                            value={editingTour.bestTime}
                                            onChange={(e) => handleChange(editingTour.id, 'bestTime', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Points forts */}
                                    <div className="md:col-span-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-lg font-medium">Points forts</label>
                                            <button
                                                onClick={() => addHighlight(editingTour.id)}
                                                className="text-sm text-primary hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Ajouter un point fort
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {editingTour.highlights.map((highlight, idx) => (
                                                <div key={idx} className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={highlight}
                                                        onChange={(e) => handleHighlightChange(editingTour.id, idx, e.target.value)}
                                                        className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                    />
                                                    <button
                                                        onClick={() => removeHighlight(editingTour.id, idx)}
                                                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-border">
                                    <button
                                        onClick={closeEditModal}
                                        className="px-8 py-3 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
                                    >
                                        Fermer
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