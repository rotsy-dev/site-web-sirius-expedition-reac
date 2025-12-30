import * as React from 'react';
import { useState } from 'react';
import { Save, Plus, Trash2, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../../../components/shared/Toast'; // Import du système de notification

interface AboutEditorProps {
    story: {
        title?: string;
        paragraphs?: string[];
    };
    onSave: (data: any) => void;
}

export function AboutEditor({ story, onSave }: AboutEditorProps) {
    const [title, setTitle] = useState(story?.title || 'Our Story');
    const [paragraphs, setParagraphs] = useState<string[]>(story?.paragraphs || []);
    const [hasChanges, setHasChanges] = useState(false); // État pour suivre les modifs
    const { showToast } = useToast(); // Hook pour les notifications

    const handleAddParagraph = () => {
        setParagraphs([...paragraphs, '']);
        setHasChanges(true);
    };

    const handleRemoveParagraph = (index: number) => {
        setParagraphs(paragraphs.filter((_, i) => i !== index));
        setHasChanges(true);
    };

    const handleParagraphChange = (index: number, value: string) => {
        const newParagraphs = [...paragraphs];
        newParagraphs[index] = value;
        setParagraphs(newParagraphs);
        setHasChanges(true);
    };

    const handleInternalSave = async () => {
        try {
            await onSave({ title, paragraphs });
            setHasChanges(false);
            // Notification de succès
            showToast('success', '✓ Histoire mise à jour avec succès !');
        } catch (error) {
            showToast('error', 'Erreur lors de la sauvegarde');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <History className="text-primary" size={24} />
                    <h3 className="text-lg font-bold">Éditer Notre Histoire</h3>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Indicateur visuel de modification */}
                    {hasChanges && (
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-primary font-medium"
                        >
                            ● Modifications non enregistrées
                        </motion.span>
                    )}
                    <button
                        onClick={handleInternalSave}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Save size={18} />
                        Enregistrer les modifications
                    </button>
                </div>
            </div>

            <div className="space-y-4 bg-muted/30 p-6 rounded-xl border border-border">
                <div>
                    <label className="block text-sm font-medium mb-2">Titre de la section</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setHasChanges(true);
                        }}
                        className="w-full px-4 py-2 rounded-md border border-border bg-background"
                        placeholder="Ex: Our Story"
                    />
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium">Paragraphes de l'histoire</label>
                    {paragraphs.map((p, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                        >
                            <textarea
                                value={p}
                                onChange={(e) => handleParagraphChange(index, e.target.value)}
                                className="flex-1 px-4 py-2 rounded-md border border-border bg-background min-h-[100px]"
                                placeholder={`Paragraphe ${index + 1}`}
                            />
                            <button
                                onClick={() => handleRemoveParagraph(index)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-md self-start"
                            >
                                <Trash2 size={20} />
                            </button>
                        </motion.div>
                    ))}
                    
                    <button
                        onClick={handleAddParagraph}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary hover:text-primary transition-all w-full justify-center"
                    >
                        <Plus size={18} />
                        Ajouter un paragraphe
                    </button>
                </div>
            </div>
        </div>
    );
}