import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, MapPin, X } from 'lucide-react';

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

    const handleChange = (id: number, field: keyof TourSpecialty, value: any) => {
        setSpecialties(specialties.map(specialty =>
            specialty.id === id ? { ...specialty, [field]: value } : specialty
        ));
        setHasChanges(true);
    };

    const handleAddSpecialty = () => {
        const newId = Math.max(...specialties.map(s => s.id), 0) + 1;
        const newSpecialty: TourSpecialty = {
            id: newId,
            icon: '🌟',
            title: 'New Specialty',
            description: 'Description of this tour specialty...',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            link: '/tours/new-specialty',
        };
        setSpecialties([...specialties, newSpecialty]);
        setEditingId(newId);
        setHasChanges(true);
    };

    const handleDeleteSpecialty = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette spécialité ?')) {
            setSpecialties(specialties.filter(s => s.id !== id));
            setHasChanges(true);
        }
    };

    const handleSave = () => {
        onSave(specialties);
        setHasChanges(false);
        alert('✅ Spécialités sauvegardées !');
    };

    const emojiOptions = ['🦜', '📷', '🏖️', '🚣', '🏛️', '🌿', '🦎', '🌋', '🏞️', '🐋', '🌊', '🎨', '🎭', '⛰️', '🌺', '🦋'];

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
                            Non sauvegardé
                        </span>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddSpecialty}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium"
                    >
                        <Plus size={18} />
                        Ajouter Spécialité
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

            {/* Grille des spécialités */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialties.map((specialty) => (
                    <motion.div
                        key={specialty.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                    >
                        {/* Preview Card */}
                        <div className="relative">
                            <div className="aspect-video overflow-hidden bg-muted">
                                <img
                                    src={specialty.image}
                                    alt={specialty.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute top-3 left-3 w-12 h-12 bg-card/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl shadow-lg">
                                {specialty.icon}
                            </div>
                            <div className="absolute top-3 right-3 flex items-center gap-2">
                                <button
                                    onClick={() => setEditingId(editingId === specialty.id ? null : specialty.id)}
                                    className="px-3 py-1 bg-card/90 backdrop-blur-sm hover:bg-card rounded-lg text-sm font-medium text-foreground"
                                >
                                    {editingId === specialty.id ? 'Fermer' : 'Modifier'}
                                </button>
                                <button
                                    onClick={() => handleDeleteSpecialty(specialty.id)}
                                    className="p-2 bg-card/90 backdrop-blur-sm hover:bg-destructive/20 rounded-lg"
                                >
                                    <Trash2 size={16} className="text-destructive" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-foreground mb-1">{specialty.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{specialty.description}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                                <MapPin size={12} />
                                {specialty.link}
                            </div>
                        </div>

                        {/* Formulaire d'édition */}
                        <AnimatePresence>
                            {editingId === specialty.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden border-t border-border"
                                >
                                    <div className="p-4 space-y-3 bg-card/50">
                                        {/* Icône */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Icône
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {emojiOptions.map((emoji) => (
                                                    <button
                                                        key={emoji}
                                                        onClick={() => handleChange(specialty.id, 'icon', emoji)}
                                                        className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all ${specialty.icon === emoji
                                                                ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                                                                : 'bg-muted hover:bg-muted/80'
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
                                                className="mt-2 w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        {/* Titre */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Titre
                                            </label>
                                            <input
                                                type="text"
                                                value={specialty.title}
                                                onChange={(e) => handleChange(specialty.id, 'title', e.target.value)}
                                                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={specialty.description}
                                                onChange={(e) => handleChange(specialty.id, 'description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                            />
                                        </div>

                                        {/* Image URL */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Image URL
                                            </label>
                                            <input
                                                type="text"
                                                value={specialty.image}
                                                onChange={(e) => handleChange(specialty.id, 'image', e.target.value)}
                                                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>

                                        {/* Link */}
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Lien (URL)
                                            </label>
                                            <input
                                                type="text"
                                                value={specialty.link}
                                                onChange={(e) => handleChange(specialty.id, 'link', e.target.value)}
                                                placeholder="/tours/category"
                                                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            {specialties.length === 0 && (
                <div className="text-center py-16 bg-muted/30 rounded-xl border border-border border-dashed">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        Aucune spécialité
                    </h3>
                    <p className="text-muted-foreground mb-6">
                        Commencez par ajouter votre première spécialité de tour
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddSpecialty}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-lg"
                    >
                        Ajouter la première spécialité
                    </motion.button>
                </div>
            )}
        </div>
    );
}