import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Star, MapPin, Calendar, CheckCircle } from 'lucide-react';

interface Review {
    id: number;
    name: string;
    country: string;
    avatar: string;
    rating: number;
    text: string;
    date: string;
    tour: string;
    verified: boolean;
    platform: string;
}

interface ReviewsEditorProps {
    reviews: Review[];
    onSave: (reviews: Review[]) => void;
}

export function ReviewsEditor({ reviews: initialReviews, onSave }: ReviewsEditorProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (id: number, field: keyof Review, value: any) => {
        setReviews(reviews.map(review =>
            review.id === id ? { ...review, [field]: value } : review
        ));
        setHasChanges(true);
    };

    const handleAddReview = () => {
        const newId = Math.max(...reviews.map(r => r.id), 0) + 1;
        const newReview: Review = {
            id: newId,
            name: 'John Doe',
            country: 'United States',
            avatar: `https://ui-avatars.com/api/?name=John+Doe&background=6D4C41&color=fff`,
            rating: 5,
            text: 'Amazing experience! Highly recommended.',
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            tour: 'Tour Name',
            verified: true,
            platform: 'Google',
        };
        setReviews([...reviews, newReview]);
        setEditingId(newId);
        setHasChanges(true);
    };

    const handleDeleteReview = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
            setReviews(reviews.filter(r => r.id !== id));
            setHasChanges(true);
        }
    };

    const handleSave = () => {
        onSave(reviews);
        setHasChanges(false);
        alert('✅ Témoignages sauvegardés !');
    };

    const generateAvatar = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6D4C41&color=fff`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Témoignages Clients</h2>
                    <p className="text-muted-foreground">Gérez les avis de vos clients</p>
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
                        onClick={handleAddReview}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium"
                    >
                        <Plus size={18} />
                        Ajouter Témoignage
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

            {/* Liste des reviews */}
            <div className="grid gap-4">
                {reviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
                            <div className="flex items-center gap-3">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-foreground">{review.name}</h3>
                                        {review.verified && (
                                            <CheckCircle size={16} className="text-accent fill-accent" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}
                                                />
                                            ))}
                                        </span>
                                        <span>• {review.country}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingId(editingId === review.id ? null : review.id)}
                                    className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium"
                                >
                                    {editingId === review.id ? 'Fermer' : 'Modifier'}
                                </button>
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="p-2 hover:bg-destructive/10 rounded-lg"
                                >
                                    <Trash2 size={18} className="text-destructive" />
                                </button>
                            </div>
                        </div>

                        {/* Formulaire d'édition */}
                        <AnimatePresence>
                            {editingId === review.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {/* Nom */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
                                                <input
                                                    type="text"
                                                    value={review.name}
                                                    onChange={(e) => {
                                                        handleChange(review.id, 'name', e.target.value);
                                                        handleChange(review.id, 'avatar', generateAvatar(e.target.value));
                                                    }}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Pays */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Pays</label>
                                                <input
                                                    type="text"
                                                    value={review.country}
                                                    onChange={(e) => handleChange(review.id, 'country', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Rating */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Note (1-5)</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={review.rating}
                                                    onChange={(e) => handleChange(review.id, 'rating', parseInt(e.target.value))}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Date */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                                                <input
                                                    type="text"
                                                    value={review.date}
                                                    onChange={(e) => handleChange(review.id, 'date', e.target.value)}
                                                    placeholder="December 2024"
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Tour */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Nom du tour</label>
                                                <input
                                                    type="text"
                                                    value={review.tour}
                                                    onChange={(e) => handleChange(review.id, 'tour', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Platform */}
                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Plateforme</label>
                                                <select
                                                    value={review.platform}
                                                    onChange={(e) => handleChange(review.id, 'platform', e.target.value)}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="Google">Google</option>
                                                    <option value="TripAdvisor">TripAdvisor</option>
                                                    <option value="Facebook">Facebook</option>
                                                    <option value="Direct">Direct</option>
                                                </select>
                                            </div>

                                            {/* Vérifié */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`verified-${review.id}`}
                                                    checked={review.verified}
                                                    onChange={(e) => handleChange(review.id, 'verified', e.target.checked)}
                                                    className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                                                />
                                                <label htmlFor={`verified-${review.id}`} className="text-sm font-medium text-foreground">
                                                    Témoignage vérifié
                                                </label>
                                            </div>

                                            {/* Texte du témoignage */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-foreground mb-2">Témoignage</label>
                                                <textarea
                                                    value={review.text}
                                                    onChange={(e) => handleChange(review.id, 'text', e.target.value)}
                                                    rows={4}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                                />
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