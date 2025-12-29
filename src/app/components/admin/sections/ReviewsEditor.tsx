import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Star, CheckCircle, X, Edit2 } from 'lucide-react';
import { db } from '../../../../firebase/config';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

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
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // États pour la modale
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);

    // Chargement depuis Firestore
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsCollection = collection(db, 'reviews');
                const snapshot = await getDocs(reviewsCollection);
                const fetchedReviews: Review[] = snapshot.docs.map((docSnap) => ({
                    id: parseInt(docSnap.id),
                    ...docSnap.data() as Omit<Review, 'id'>
                }));

                fetchedReviews.sort((a, b) => a.id - b.id);
                setReviews(fetchedReviews.length > 0 ? fetchedReviews : initialReviews);
            } catch (err) {
                console.error('Erreur chargement avis:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [initialReviews]);

    const handleChange = (id: number, field: keyof Review, value: any) => {
        setReviews(reviews.map(review =>
            review.id === id ? { ...review, [field]: value } : review
        ));
        setHasChanges(true);

        // Mise à jour dans la modale
        if (editingReview && editingReview.id === id) {
            setEditingReview({ ...editingReview, [field]: value });
        }
    };

    const generateAvatar = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6D4C41&color=fff`;
    };

    const handleNameChange = (id: number, name: string) => {
        const newAvatar = generateAvatar(name);
        handleChange(id, 'name', name);
        handleChange(id, 'avatar', newAvatar);

        if (editingReview && editingReview.id === id) {
            setEditingReview({ ...editingReview, name, avatar: newAvatar });
        }
    };

    const handleAddReview = () => {
        const newId = Math.max(...reviews.map(r => r.id), 0) + 1;
        const newReview: Review = {
            id: newId,
            name: 'Nouveau Client',
            country: 'France',
            avatar: generateAvatar('Nouveau Client'),
            rating: 5,
            text: 'Expérience incroyable, je recommande vivement !',
            date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            tour: 'Tour de votre choix',
            verified: true,
            platform: 'Google',
        };
        setReviews([...reviews, newReview]);
        setEditingReview(newReview);
        setIsEditModalOpen(true);
        setHasChanges(true);
    };

    const openEditModal = (review: Review) => {
        setEditingReview(review);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingReview(null);
    };

    const handleDeleteReview = async (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
            try {
                await deleteDoc(doc(db, 'reviews', id.toString()));
                setReviews(reviews.filter(r => r.id !== id));
                setHasChanges(true);
                alert('Témoignage supprimé avec succès !');
            } catch (err) {
                console.error('Erreur suppression avis:', err);
                alert('Erreur lors de la suppression – vérifiez la console');
            }
        }
    };

    const handleSave = async () => {
        try {
            for (const review of reviews) {
                const reviewDoc = doc(db, 'reviews', review.id.toString());
                await setDoc(reviewDoc, review);
            }

            onSave(reviews);
            setHasChanges(false);
            alert('✅ Témoignages sauvegardés dans Firestore !');
        } catch (err) {
            console.error('Erreur sauvegarde avis:', err);
            alert('Erreur lors de la sauvegarde – vérifiez la console');
        }
    };

    if (isLoading) {
        return <div className="text-center py-12 text-muted-foreground">Chargement des avis depuis Firestore…</div>;
    }

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

            {/* Liste des témoignages (cartes compactes) */}
            <div className="grid gap-4">
                {reviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
                            <div className="flex items-center gap-3">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                    loading="lazy"
                                />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-foreground">{review.name}</h3>
                                        {review.verified && (
                                            <CheckCircle size={16} className="text-accent fill-accent" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
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
                                        <span>• {review.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEditModal(review)}
                                    className="flex items-center gap-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium"
                                >
                                    <Edit2 size={16} />
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="p-2 hover:bg-destructive/10 rounded-lg"
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} className="text-destructive" />
                                </button>
                            </div>
                        </div>

                        {/* Aperçu du texte */}
                        <div className="p-4 bg-muted/20 text-foreground text-sm italic">
                            "{review.text}"
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modale d'édition / ajout */}
            <AnimatePresence>
                {isEditModalOpen && editingReview && (
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
                            className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-foreground">
                                    {editingReview.id > Math.max(...initialReviews.map(r => r.id), 0)
                                        ? 'Ajouter un témoignage'
                                        : 'Modifier le témoignage'}
                                </h3>
                                <button
                                    onClick={closeEditModal}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    {/* Nom */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
                                        <input
                                            type="text"
                                            value={editingReview.name}
                                            onChange={(e) => handleNameChange(editingReview.id, e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Pays */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Pays</label>
                                        <input
                                            type="text"
                                            value={editingReview.country}
                                            onChange={(e) => handleChange(editingReview.id, 'country', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Note */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Note (1-5)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="5"
                                            step="0.5"
                                            value={editingReview.rating}
                                            onChange={(e) => handleChange(editingReview.id, 'rating', parseFloat(e.target.value) || 1)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                                        <input
                                            type="text"
                                            value={editingReview.date}
                                            onChange={(e) => handleChange(editingReview.id, 'date', e.target.value)}
                                            placeholder="Décembre 2024"
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Tour */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Nom du tour</label>
                                        <input
                                            type="text"
                                            value={editingReview.tour}
                                            onChange={(e) => handleChange(editingReview.id, 'tour', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Plateforme */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Plateforme</label>
                                        <select
                                            value={editingReview.platform}
                                            onChange={(e) => handleChange(editingReview.id, 'platform', e.target.value)}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="Google">Google</option>
                                            <option value="TripAdvisor">TripAdvisor</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="Direct">Direct</option>
                                        </select>
                                    </div>

                                    {/* Vérifié */}
                                    <div className="md:col-span-2 flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="verified-modal"
                                            checked={editingReview.verified}
                                            onChange={(e) => handleChange(editingReview.id, 'verified', e.target.checked)}
                                            className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                                        />
                                        <label htmlFor="verified-modal" className="text-sm font-medium text-foreground">
                                            Témoignage vérifié
                                        </label>
                                    </div>

                                    {/* Témoignage */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-foreground mb-2">Témoignage</label>
                                        <textarea
                                            value={editingReview.text}
                                            onChange={(e) => handleChange(editingReview.id, 'text', e.target.value)}
                                            rows={5}
                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
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