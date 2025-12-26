import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Eye, Image, X } from 'lucide-react';
import { db } from '../../../../firebase/config';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

interface HeroSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    cta: string;
    videoUrl: string;
}

interface HeroEditorProps {
    slides: HeroSlide[];
    onSave: (slides: HeroSlide[]) => void;
}

export function HeroEditor({ slides: initialSlides, onSave }: HeroEditorProps) {
    const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [previewSlide, setPreviewSlide] = useState<HeroSlide | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Chargement des slides depuis Firestore
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const slidesCollection = collection(db, 'heroSlides');
                const snapshot = await getDocs(slidesCollection);
                const fetchedSlides: HeroSlide[] = snapshot.docs.map((docSnap) => ({
                    id: parseInt(docSnap.id),
                    ...docSnap.data() as Omit<HeroSlide, 'id'>
                }));

                // Trie par ID pour garder un ordre stable
                fetchedSlides.sort((a, b) => a.id - b.id);

                setSlides(fetchedSlides.length > 0 ? fetchedSlides : initialSlides);
            } catch (err) {
                console.error('Erreur lors du chargement des slides:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSlides();
    }, [initialSlides]);

    const handleChange = (id: number, field: keyof HeroSlide, value: string) => {
        setSlides(slides.map(slide =>
            slide.id === id ? { ...slide, [field]: value } : slide
        ));
        setHasChanges(true);
    };

    const handleAddSlide = () => {
        const newId = Math.max(...slides.map(s => s.id), 0) + 1;
        const newSlide: HeroSlide = {
            id: newId,
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
            title: 'New Slide Title',
            subtitle: 'New description here',
            cta: 'Learn More',
            videoUrl: '',
        };
        setSlides([...slides, newSlide]);
        setEditingId(newId);
        setHasChanges(true);
    };

    // Suppression IMMÉDIATE dans Firestore + locale
    const handleDeleteSlide = async (id: number) => {
        if (slides.length <= 1) {
            alert('Vous devez garder au moins une slide !');
            return;
        }

        if (confirm('Êtes-vous sûr de vouloir supprimer cette slide ? Cette action est irréversible.')) {
            try {
                // 1. Suppression dans Firestore
                await deleteDoc(doc(db, 'heroSlides', id.toString()));

                // 2. Suppression locale
                setSlides(prev => prev.filter(s => s.id !== id));
                setHasChanges(true);

                // Optionnel : message de succès
                alert('Slide supprimée avec succès !');
            } catch (err) {
                console.error('Erreur lors de la suppression:', err);
                alert('Erreur lors de la suppression de la slide. Vérifiez votre connexion ou les règles Firestore.');
            }
        }
    };

    const handleSave = async () => {
        try {
            // Sauvegarde uniquement les slides actuelles (les nouvelles et modifiées)
            for (const slide of slides) {
                const slideDoc = doc(db, 'heroSlides', slide.id.toString());
                await setDoc(slideDoc, slide);
            }

            onSave(slides);
            setHasChanges(false);
            alert('✅ Modifications sauvegardées dans Firestore !');
        } catch (err) {
            console.error('Erreur lors de la sauvegarde:', err);
            alert('Erreur lors de la sauvegarde');
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Chargement des slides...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Hero Carousel</h2>
                    <p className="text-muted-foreground">Gérez les slides de votre page d'accueil</p>
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
                        onClick={handleAddSlide}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Ajouter Slide
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

            {/* Liste des slides */}
            <div className="grid gap-4">
                {slides.map((slide, index) => (
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                                    {index + 1}
                                </div>
                                <h3 className="font-semibold text-foreground">
                                    {slide.title || `Slide ${index + 1}`}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPreviewSlide(slide)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    title="Prévisualiser"
                                >
                                    <Eye size={18} className="text-muted-foreground" />
                                </button>
                                <button
                                    onClick={() => setEditingId(editingId === slide.id ? null : slide.id)}
                                    className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                                >
                                    {editingId === slide.id ? 'Fermer' : 'Modifier'}
                                </button>
                                <button
                                    onClick={() => handleDeleteSlide(slide.id)}
                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} className="text-destructive" />
                                </button>
                            </div>
                        </div>

                        {/* Formulaire d'édition (inchangé) */}
                        <AnimatePresence>
                            {editingId === slide.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    URL de l'image
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={slide.image}
                                                        onChange={(e) => handleChange(slide.id, 'image', e.target.value)}
                                                        placeholder="https://..."
                                                        className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                    {slide.image && (
                                                        <a
                                                            href={slide.image}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                                                            title="Voir l'image"
                                                        >
                                                            <Image size={20} className="text-foreground" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-foreground mb-2">Titre</label>
                                                <input
                                                    type="text"
                                                    value={slide.title}
                                                    onChange={(e) => handleChange(slide.id, 'title', e.target.value)}
                                                    placeholder="Découvrez Madagascar"
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-foreground mb-2">Sous-titre / Description</label>
                                                <textarea
                                                    value={slide.subtitle}
                                                    onChange={(e) => handleChange(slide.id, 'subtitle', e.target.value)}
                                                    placeholder="Une expérience unique..."
                                                    rows={3}
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">Texte du bouton (CTA)</label>
                                                <input
                                                    type="text"
                                                    value={slide.cta}
                                                    onChange={(e) => handleChange(slide.id, 'cta', e.target.value)}
                                                    placeholder="Explorer"
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-foreground mb-2">URL Vidéo (optionnel)</label>
                                                <input
                                                    type="text"
                                                    value={slide.videoUrl}
                                                    onChange={(e) => handleChange(slide.id, 'videoUrl', e.target.value)}
                                                    placeholder="https://..."
                                                    className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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

            {/* Modal preview (inchangé) */}
            <AnimatePresence>
                {previewSlide && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
                        onClick={() => setPreviewSlide(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setPreviewSlide(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-card/80 backdrop-blur-sm hover:bg-card rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative h-96">
                                <img
                                    src={previewSlide.image}
                                    alt={previewSlide.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-primary-foreground">
                                    <h3 className="text-4xl font-bold mb-3">{previewSlide.title}</h3>
                                    <p className="text-xl mb-4 opacity-90">{previewSlide.subtitle}</p>
                                    <button className="px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-xl font-semibold">
                                        {previewSlide.cta}
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