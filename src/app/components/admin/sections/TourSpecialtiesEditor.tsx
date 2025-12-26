import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, MapPin, X } from 'lucide-react';
import { db } from '../../../../firebase/config'; // Ajuste le chemin selon ta structure
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

interface TourSpecialty {
    id: number;
    icon: string;
    title: string;
    description: string;
    image: string;
    link: string;
}

interface TourSpecialtiesEditorProps {
    specialties: TourSpecialty[];
    onSave: (specialties: TourSpecialty[]) => void;
}

export function TourSpecialtiesEditor({ specialties: initialSpecialties, onSave }: TourSpecialtiesEditorProps) {
    const [specialties, setSpecialties] = useState<TourSpecialty[]>(initialSpecialties);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Chargement depuis Firestore au montage
    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const specialtiesCollection = collection(db, 'tourSpecialties');
                const snapshot = await getDocs(specialtiesCollection);
                const fetchedSpecialties: TourSpecialty[] = snapshot.docs.map((docSnap) => ({
                    id: parseInt(docSnap.id),
                    ...docSnap.data() as Omit<TourSpecialty, 'id'>
                }));

                // Tri par ID pour un ordre stable
                fetchedSpecialties.sort((a, b) => a.id - b.id);

                setSpecialties(fetchedSpecialties.length > 0 ? fetchedSpecialties : initialSpecialties);
            } catch (err) {
                console.error('Erreur lors du chargement des spécialités de tours :', err);
                alert('Impossible de charger les données depuis Firebase.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpecialties();
    }, [initialSpecialties]);

    const handleChange = (id: number, field: keyof TourSpecialty, value: string) => {
        setSpecialties(prev => prev.map(specialty =>
            specialty.id === id ? { ...specialty, [field]: value } : specialty
        ));
        setHasChanges(true);
    };

    const handleAddSpecialty = () => {
        const newId = Math.max(...specialties.map(s => s.id), 0) + 1;
        const newSpecialty: TourSpecialty = {
            id: newId,
            icon: '🌟',
            title: 'Nouvelle Spécialité',
            description: 'Description détaillée de cette spécialité de voyage...',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
            link: '/tours/nouvelle-specialite',
        };
        setSpecialties(prev => [...prev, newSpecialty]);
        setEditingId(newId);
        setHasChanges(true);
    };

    const handleDeleteSpecialty = async (id: number) => {
        if (confirm('Supprimer définitivement cette spécialité ? Cette action est irréversible.')) {
            try {
                // Suppression immédiate dans Firestore
                await deleteDoc(doc(db, 'tourSpecialties', id.toString()));

                // Suppression locale
                setSpecialties(prev => prev.filter(s => s.id !== id));
                setHasChanges(true);
            } catch (err) {
                console.error('Erreur lors de la suppression dans Firebase :', err);
                alert('Impossible de supprimer la spécialité. Vérifiez votre connexion ou les permissions.');
            }
        }
    };

    const handleSave = async () => {
        try {
            // Sauvegarde de chaque spécialité dans Firestore
            for (const specialty of specialties) {
                const specialtyDoc = doc(db, 'tourSpecialties', specialty.id.toString());
                await setDoc(specialtyDoc, specialty);
            }

            onSave(specialties);
            setHasChanges(false);
            alert('✅ Spécialités de tours sauvegardées avec succès dans Firebase !');
        } catch (err) {
            console.error('Erreur lors de la sauvegarde dans Firebase :', err);
            alert('Erreur lors de la sauvegarde. Vérifiez votre connexion internet et les règles Firestore.');
        }
    };

    const emojiOptions = ['🦜', '📷', '🏖️', '🚣', '🏛️', '🌿', '🦎', '🌋', '🏞️', '🐋', '🌊', '🎨', '🎭', '⛰️', '🌺', '🦋', '🌟', '✨', '🎯', '🔥'];

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <p className="text-lg text-foreground">Chargement des spécialités de tours depuis Firebase...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Tour Specialties</h2>
                    <p className="text-muted-foreground">Gérez les spécialités de tours affichées sur le site</p>
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
                        onClick={handleAddSpecialty}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Ajouter Spécialité
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

            {/* Grille des spécialités */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialties.map((specialty, index) => (
                    <motion.div
                        key={specialty.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-muted/30 rounded-xl border border-border overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    >
                        {/* Preview Card */}
                        <div className="relative">
                            <div className="aspect-video overflow-hidden bg-muted">
                                <img
                                    src={specialty.image}
                                    alt={specialty.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute top-4 left-4 w-14 h-14 bg-card/90 backdrop-blur-md rounded-xl flex items-center justify-center text-3xl shadow-xl">
                                {specialty.icon}
                            </div>
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <button
                                    onClick={() => setEditingId(editingId === specialty.id ? null : specialty.id)}
                                    className="px-4 py-2 bg-card/90 backdrop-blur-md hover:bg-card rounded-lg text-sm font-medium text-foreground transition-all"
                                >
                                    {editingId === specialty.id ? 'Fermer' : 'Modifier'}
                                </button>
                                <button
                                    onClick={() => handleDeleteSpecialty(specialty.id)}
                                    className="p-2 bg-card/90 backdrop-blur-md hover:bg-destructive/20 rounded-lg transition-all"
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} className="text-destructive" />
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="font-bold text-xl text-foreground mb-2">{specialty.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{specialty.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin size={16} />
                                <span className="truncate">{specialty.link}</span>
                            </div>
                        </div>

                        {/* Formulaire d'édition */}
                        <AnimatePresence>
                            {editingId === specialty.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden border-t border-border bg-card/50"
                                >
                                    <div className="p-6 space-y-5">
                                        {/* Icône */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-3">
                                                Icône (emoji)
                                            </label>
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                {emojiOptions.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => handleChange(specialty.id, 'icon', emoji)}
                                                        className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl transition-all shadow-md ${specialty.icon === emoji
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
                                                value={specialty.icon}
                                                onChange={(e) => handleChange(specialty.id, 'icon', e.target.value)}
                                                placeholder="Ou entrez un emoji personnalisé"
                                                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        {/* Titre */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Titre</label>
                                            <input
                                                type="text"
                                                value={specialty.title}
                                                onChange={(e) => handleChange(specialty.id, 'title', e.target.value)}
                                                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                                            <textarea
                                                value={specialty.description}
                                                onChange={(e) => handleChange(specialty.id, 'description', e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                            />
                                        </div>

                                        {/* Image URL */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Image de fond (URL)</label>
                                            <input
                                                type="text"
                                                value={specialty.image}
                                                onChange={(e) => handleChange(specialty.id, 'image', e.target.value)}
                                                placeholder="https://images.unsplash.com/..."
                                                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        {/* Lien */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">Lien vers la catégorie</label>
                                            <input
                                                type="text"
                                                value={specialty.link}
                                                onChange={(e) => handleChange(specialty.id, 'link', e.target.value)}
                                                placeholder="/tours/ornithologie"
                                                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Empty state */}
            {specialties.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-muted/30 rounded-2xl border border-border border-dashed">
                    <div className="text-6xl mb-6">🎯</div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                        Aucune spécialité de tour
                    </h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Ajoutez vos premières spécialités pour mettre en avant les expériences uniques que vous proposez
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddSpecialty}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all"
                    >
                        Ajouter la première spécialité
                    </motion.button>
                </div>
            )}
        </div>
    );
}