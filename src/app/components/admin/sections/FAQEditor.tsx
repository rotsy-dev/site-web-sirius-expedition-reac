import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, HelpCircle } from 'lucide-react';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
}

interface FAQEditorProps {
    faqs: FAQ[];
    onSave: (faqs: FAQ[]) => void;
}

export function FAQEditor({ faqs: initialFaqs, onSave }: FAQEditorProps) {
    const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const categories = ['General', 'Tours', 'Pricing', 'Travel Info', 'Booking'];

    const handleChange = (id: number, field: keyof FAQ, value: string) => {
        setFaqs(faqs.map(faq =>
            faq.id === id ? { ...faq, [field]: value } : faq
        ));
        setHasChanges(true);
    };

    const handleAddFAQ = () => {
        const newId = Math.max(...faqs.map(f => f.id), 0) + 1;
        const newFAQ: FAQ = {
            id: newId,
            question: 'New question?',
            answer: 'Answer here...',
            category: 'General',
        };
        setFaqs([...faqs, newFAQ]);
        setEditingId(newId);
        setHasChanges(true);
    };

    const handleDeleteFAQ = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette FAQ ?')) {
            setFaqs(faqs.filter(f => f.id !== id));
            setHasChanges(true);
        }
    };

    const handleSave = () => {
        onSave(faqs);
        setHasChanges(false);
        alert('✅ FAQ sauvegardées !');
    };

    const groupedFaqs = faqs.reduce((acc, faq) => {
        if (!acc[faq.category]) acc[faq.category] = [];
        acc[faq.category].push(faq);
        return acc;
    }, {} as Record<string, FAQ[]>);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Questions Fréquentes (FAQ)</h2>
                    <p className="text-muted-foreground">Gérez les questions et réponses</p>
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
                        onClick={handleAddFAQ}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium"
                    >
                        <Plus size={18} />
                        Ajouter FAQ
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

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map(category => (
                    <div key={category} className="bg-card border border-border rounded-xl p-4">
                        <p className="text-sm text-muted-foreground mb-1">{category}</p>
                        <p className="text-2xl font-bold text-foreground">
                            {groupedFaqs[category]?.length || 0}
                        </p>
                    </div>
                ))}
            </div>

            {/* Liste des FAQs par catégorie */}
            {categories.map(category => {
                const categoryFaqs = groupedFaqs[category] || [];
                if (categoryFaqs.length === 0) return null;

                return (
                    <div key={category} className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <HelpCircle size={16} className="text-primary" />
                            </div>
                            {category}
                        </h3>
                        <div className="grid gap-3">
                            {categoryFaqs.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-muted/30 rounded-xl border border-border overflow-hidden"
                                >
                                    <div className="flex items-center justify-between p-4 bg-card border-b border-border">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-foreground">{faq.question}</h4>
                                            {editingId !== faq.id && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                    {faq.answer}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => setEditingId(editingId === faq.id ? null : faq.id)}
                                                className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium"
                                            >
                                                {editingId === faq.id ? 'Fermer' : 'Modifier'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFAQ(faq.id)}
                                                className="p-2 hover:bg-destructive/10 rounded-lg"
                                            >
                                                <Trash2 size={18} className="text-destructive" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Formulaire d'édition */}
                                    <AnimatePresence>
                                        {editingId === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 space-y-4">
                                                    {/* Catégorie */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
                                                        <select
                                                            value={faq.category}
                                                            onChange={(e) => handleChange(faq.id, 'category', e.target.value)}
                                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                        >
                                                            {categories.map(cat => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Question */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-2">Question</label>
                                                        <input
                                                            type="text"
                                                            value={faq.question}
                                                            onChange={(e) => handleChange(faq.id, 'question', e.target.value)}
                                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                        />
                                                    </div>

                                                    {/* Réponse */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-2">Réponse</label>
                                                        <textarea
                                                            value={faq.answer}
                                                            onChange={(e) => handleChange(faq.id, 'answer', e.target.value)}
                                                            rows={4}
                                                            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                                        />
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
            })}

            {faqs.length === 0 && (
                <div className="bg-muted/30 rounded-xl p-12 text-center">
                    <HelpCircle size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-2">Aucune FAQ</p>
                    <p className="text-muted-foreground text-sm">Cliquez sur "Ajouter FAQ" pour commencer</p>
                </div>
            )}
        </div>
    );
}