import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Eye, X, MapPin, Clock, DollarSign, Star } from 'lucide-react';
import { db } from '../../../../firebase/config'; // Ajuste le chemin selon ta structure
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

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
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Chargement des tours depuis Firestore au montage
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const toursCollection = collection(db, 'bestSellers');
                const snapshot = await getDocs(toursCollection);
                const fetchedTours: Tour[] = snapshot.docs.map((docSnap) => ({
                    id: parseInt(docSnap.id),
                    ...docSnap.data() as Omit<Tour, 'id'>
                }));

                // Tri par ID pour un ordre stable
                fetchedTours.sort((a, b) => a.id - b.id);

                // Si Firestore a des données, on les utilise, sinon on garde les initiales
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
    };

    const addHighlight = (tourId: number) => {
        setTours(prev => prev.map(tour =>
            tour.id === tourId
                ? { ...tour, highlights: [...tour.highlights, 'Nouvelle caractéristique'] }
                : tour
        ));
        setHasChanges(true);
    };

    const removeHighlight = (tourId: number, index: number) => {
        setTours(prev => prev.map(tour =>
            tour.id === tourId
                ? { ...tour, highlights: tour.highlights.filter((_, i) => i !== index) }
                : tour
        ));
        setHasChanges(true);
    };

    const handleAddTour = () => {
        const newId = Math.max(...tours.map(t => t.id), 0) + 1;
        const newTour: Tour = {
            id: newId,
            title: 'Nouveau Tour Incroyable',
            slug: 'nouveau-tour',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
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
        setEditingId(newId);
        setHasChanges(true);
    };

    const handleDeleteTour = async (id: number) => {
        if (tours.length <= 1) {
            alert('Vous devez garder au moins un tour dans les Best Sellers !');
            return;
        }

        if (confirm('Supprimer définitivement ce tour ? Cette action est irréversible.')) {
            try {
                // Suppression immédiate dans Firestore
                await deleteDoc(doc(db, 'bestSellers', id.toString()));

                // Suppression locale
                setTours(prev => prev.filter(t => t.id !== id));
                setHasChanges(true);
            } catch (err) {
                console.error('Erreur lors de la suppression dans Firebase :', err);
                alert('Impossible de supprimer le tour. Vérifiez votre connexion ou les permissions.');
            }
        }
    };

    const handleSave = async () => {
        try {
            // Sauvegarde de chaque tour dans Firestore
            for (const tour of tours) {
                const tourDoc = doc(db, 'bestSellers', tour.id.toString());
                await setDoc(tourDoc, tour);
            }

            onSave(tours); // Pour compatibilité avec ton système existant
            setHasChanges(false);
            alert('✅ Tous les tours Best Sellers ont été sauvegardés avec succès dans Firebase !');
        } catch (err) {
            console.error('Erreur lors de la sauvegarde dans Firebase :', err);
            alert('Erreur lors de la sauvegarde. Vérifiez votre connexion internet et les règles Firestore.');
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Best Sellers Tours</h2>
                    <p className="text-muted-foreground">Gérez vos tours populaires affichés sur la page d'accueil</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
                            Modifications non sauvegardées
                        </span>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddTour}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Ajouter Tour
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Save size={18} />
                        Sauvegarder
                    </motion.button>
                </div>
            </div>

            {/* Liste des tours */}
            <div className="grid gap-6">
                {tours.map((tour, index) => (
                    <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground text-lg">{tour.title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
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
                                            <Star size={14} fill="currentColor" className="text-primary" /> {tour.rating} ({tour.reviews} avis)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingId(editingId === tour.id ? null : tour.id)}
                                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                                >
                                    {editingId === tour.id ? 'Fermer' : 'Modifier'}
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

                        {/* Formulaire d'édition */}
                        <AnimatePresence>
                            {editingId === tour.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Titre du tour</label>
                                                <input
                                                    type="text"
                                                    value={tour.title}
                                                    onChange={(e) => handleChange(tour.id, 'title', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                                                <input
                                                    type="text"
                                                    value={tour.slug}
                                                    onChange={(e) => handleChange(tour.id, 'slug', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">Image principale (URL)</label>
                                                <input
                                                    type="text"
                                                    value={tour.image}
                                                    onChange={(e) => handleChange(tour.id, 'image', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">Durée</label>
                                                <input
                                                    type="text"
                                                    value={tour.duration}
                                                    onChange={(e) => handleChange(tour.id, 'duration', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Localisation</label>
                                                <input
                                                    type="text"
                                                    value={tour.location}
                                                    onChange={(e) => handleChange(tour.id, 'location', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Prix</label>
                                                <input
                                                    type="text"
                                                    value={tour.price}
                                                    onChange={(e) => handleChange(tour.id, 'price', e.target.value)}
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
                                                    value={tour.rating}
                                                    onChange={(e) => handleChange(tour.id, 'rating', parseFloat(e.target.value) || 0)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">Description courte (affichée dans le carousel)</label>
                                                <textarea
                                                    value={tour.description}
                                                    onChange={(e) => handleChange(tour.id, 'description', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">Description longue (pour la page détail)</label>
                                                <textarea
                                                    value={tour.longDescription}
                                                    onChange={(e) => handleChange(tour.id, 'longDescription', e.target.value)}
                                                    rows={6}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2">Difficulté</label>
                                                <input
                                                    type="text"
                                                    value={tour.difficulty}
                                                    onChange={(e) => handleChange(tour.id, 'difficulty', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Taille du groupe</label>
                                                <input
                                                    type="text"
                                                    value={tour.groupSize}
                                                    onChange={(e) => handleChange(tour.id, 'groupSize', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Meilleure période</label>
                                                <input
                                                    type="text"
                                                    value={tour.bestTime}
                                                    onChange={(e) => handleChange(tour.id, 'bestTime', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Highlights */}
                                            <div className="md:col-span-2">
                                                <div className="flex items-center justify-between mb-3">
                                                    <label className="block text-sm font-medium">Points forts</label>
                                                    <button
                                                        onClick={() => addHighlight(tour.id)}
                                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        <Plus size={16} /> Ajouter un point fort
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {tour.highlights.map((highlight, idx) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={highlight}
                                                                onChange={(e) => handleHighlightChange(tour.id, idx, e.target.value)}
                                                                className="flex-1 px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                            />
                                                            <button
                                                                onClick={() => removeHighlight(tour.id, idx)}
                                                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}