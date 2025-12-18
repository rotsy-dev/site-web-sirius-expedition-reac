import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Eye, X, MapPin, Clock, DollarSign, Star } from 'lucide-react';

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

    const handleChange = (id: number, field: keyof Tour, value: any) => {
        setTours(tours.map(tour =>
            tour.id === id ? { ...tour, [field]: value } : tour
        ));
        setHasChanges(true);
    };

    const handleHighlightChange = (tourId: number, index: number, value: string) => {
        setTours(tours.map(tour => {
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
        setTours(tours.map(tour =>
            tour.id === tourId
                ? { ...tour, highlights: [...tour.highlights, 'New highlight'] }
                : tour
        ));
        setHasChanges(true);
    };

    const removeHighlight = (tourId: number, index: number) => {
        setTours(tours.map(tour =>
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
            title: 'New Tour',
            slug: 'new-tour',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            duration: '5 days',
            location: 'Madagascar',
            price: '€999',
            pricePerPerson: true,
            rating: 4.5,
            reviews: 0,
            description: 'Short description',
            longDescription: 'Detailed description here...',
            highlights: ['Highlight 1', 'Highlight 2'],
            difficulty: 'Moderate',
            groupSize: '2-8 people',
            bestTime: 'Year-round',
        };
        setTours([...tours, newTour]);
        setEditingId(newId);
        setHasChanges(true);
    };

    const handleDeleteTour = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce tour ?')) {
            setTours(tours.filter(t => t.id !== id));
            setHasChanges(true);
        }
    };

    const handleSave = () => {
        onSave(tours);
        setHasChanges(false);
        alert('✅ Tours sauvegardés !');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Best Sellers Tours</h2>
                    <p className="text-muted-foreground">Gérez vos tours populaires</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
                            Non sauvegardé
                        </span>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddTour}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium"
                    >
                        <Plus size={18} />
                        Ajouter Tour
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        Sauvegarder
                    </motion.button>
                </div>
            </div>

            {/* Liste des tours */}
            <div className="grid gap-4">
                {tours.map((tour, index) => (
                    <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{tour.title}</h3>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {tour.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign size={14} />
                                            {tour.price}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star size={14} className="fill-accent text-accent" />
                                            {tour.rating}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingId(editingId === tour.id ? null : tour.id)}
                                    className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium"
                                >
                                    {editingId === tour.id ? 'Fermer' : 'Modifier'}
                                </button>
                                <button
                                    onClick={() => handleDeleteTour(tour.id)}
                                    className="p-2 hover:bg-destructive/10 rounded-lg"
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
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {/* Titre */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Titre</label>
                                                <input
                                                    type="text"
                                                    value={tour.title}
                                                    onChange={(e) => handleChange(tour.id, 'title', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Slug */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Slug (URL)</label>
                                                <input
                                                    type="text"
                                                    value={tour.slug}
                                                    onChange={(e) => handleChange(tour.id, 'slug', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Image URL */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                                                <input
                                                    type="text"
                                                    value={tour.image}
                                                    onChange={(e) => handleChange(tour.id, 'image', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Durée, Location, Prix */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Durée</label>
                                                <input
                                                    type="text"
                                                    value={tour.duration}
                                                    onChange={(e) => handleChange(tour.id, 'duration', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    value={tour.location}
                                                    onChange={(e) => handleChange(tour.id, 'location', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Prix</label>
                                                <input
                                                    type="text"
                                                    value={tour.price}
                                                    onChange={(e) => handleChange(tour.id, 'price', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={tour.rating}
                                                    onChange={(e) => handleChange(tour.id, 'rating', parseFloat(e.target.value))}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Description courte */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-foreground mb-2">Description courte</label>
                                                <textarea
                                                    value={tour.description}
                                                    onChange={(e) => handleChange(tour.id, 'description', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                                />
                                            </div>

                                            {/* Description longue */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-foreground mb-2">Description longue</label>
                                                <textarea
                                                    value={tour.longDescription}
                                                    onChange={(e) => handleChange(tour.id, 'longDescription', e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                                />
                                            </div>

                                            {/* Highlights */}
                                            <div className="md:col-span-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-sm font-medium text-foreground">Points forts</label>
                                                    <button
                                                        onClick={() => addHighlight(tour.id)}
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        + Ajouter
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    {tour.highlights.map((highlight, idx) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={highlight}
                                                                onChange={(e) => handleHighlightChange(tour.id, idx, e.target.value)}
                                                                className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                            />
                                                            <button
                                                                onClick={() => removeHighlight(tour.id, idx)}
                                                                className="p-2 hover:bg-destructive/10 rounded-lg"
                                                            >
                                                                <X size={18} className="text-destructive" />
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