import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, HelpCircle } from 'lucide-react';
import { db } from '../../../../firebase/config';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

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
    const [isLoading, setIsLoading] = useState(true);

    const categories = ['General', 'Tours', 'Pricing', 'Travel Info', 'Booking'];

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const faqsCollection = collection(db, 'faqs');
                const snapshot = await getDocs(faqsCollection);
                const fetchedFaqs: FAQ[] = snapshot.docs.map((docSnap) => ({
                    id: parseInt(docSnap.id),
                    ...docSnap.data() as Omit<FAQ, 'id'>
                }));

                fetchedFaqs.sort((a, b) => a.id - b.id);
                setFaqs(fetchedFaqs.length > 0 ? fetchedFaqs : initialFaqs);
            } catch (err) {
                console.error('Erreur lors du chargement des FAQ :', err);
                alert('Impossible de charger les FAQ depuis Firebase.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaqs();
    }, [initialFaqs]);

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
            question: 'Nouvelle question ?',
            answer: 'Réponse détaillée ici...',
            category: 'General',
        };
        setFaqs([...faqs, newFAQ]);
        setEditingId(newId);
        setHasChanges(true);
    };

    const handleDeleteFAQ = async (id: number) => {
        if (confirm('Supprimer définitivement cette FAQ ? Cette action est irréversible.')) {
            try {
                await deleteDoc(doc(db, 'faqs', id.toString()));
                setFaqs(faqs.filter(f => f.id !== id));
                setHasChanges(true);
            } catch (err) {
                console.error('Erreur lors de la suppression de la FAQ :', err);
                alert('Impossible de supprimer la FAQ. Vérifiez votre connexion ou les permissions.');
            }
        }
    };

    const handleSave = async () => {
        try {
            for (const faq of faqs) {
                const faqDoc = doc(db, 'faqs', faq.id.toString());
                await setDoc(faqDoc, faq);
            }

            onSave(faqs);
            setHasChanges(false);
            alert('✅ FAQ sauvegardées avec succès dans Firestore !');
        } catch (err) {
            console.error('Erreur lors de la sauvegarde des FAQ :', err);
            alert('Erreur lors de la sauvegarde. Vérifiez votre connexion et les règles Firestore.');
        }
    };

    const groupedFaqs = faqs.reduce((acc, faq) => {
        if (!acc[faq.category]) acc[faq.category] = [];
        acc[faq.category].push(faq);
        return acc;
    }, {} as Record<string, FAQ[]>);

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">Chargement des FAQ depuis Firebase...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* ==================== HEADER RESPONSIVE ==================== */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Questions Fréquentes (FAQ)</h2>
                    <p className="text-muted-foreground">Gérez les questions et réponses</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {hasChanges && (
                        <div className="self-start sm:self-center">
                            <span className="text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-lg font-medium">
                                Non sauvegardé
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddFAQ}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Ajouter FAQ
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

            {/* ==================== STATS ==================== */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {categories.map(category => (
                    <div key={category} className="bg-card border border-border rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">{category}</p>
                        <p className="text-2xl font-bold text-foreground">
                            {groupedFaqs[category]?.length || 0}
                        </p>
                    </div>
                ))}
            </div>

            {/* ==================== LISTE DES FAQ PAR CATÉGORIE ==================== */}
            {categories.map(category => {
                const categoryFaqs = groupedFaqs[category] || [];
                if (categoryFaqs.length === 0) return null;

                return (
                    <div key={category} className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <HelpCircle size={16} className="text-primary" />
                            </div>
                            {category} ({categoryFaqs.length})
                        </h3>

                        <div className="grid gap-4">
                            {categoryFaqs.map((faq) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-muted/30 rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Header de la FAQ - responsive */}
                                    <div className="p-4 bg-card border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-foreground text-lg">{faq.question}</h4>
                                            {editingId !== faq.id && (
                                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                    {faq.answer}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 self-start sm:self-center">
                                            <button
                                                onClick={() => setEditingId(editingId === faq.id ? null : faq.id)}
                                                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                                            >
                                                {editingId === faq.id ? 'Fermer' : 'Modifier'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteFAQ(faq.id)}
                                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} className="text-destructive" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Zone d'édition */}
                                    <AnimatePresence>
                                        {editingId === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-4 sm:p-6 space-y-5">
                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
                                                        <select
                                                            value={faq.category}
                                                            onChange={(e) => handleChange(faq.id, 'category', e.target.value)}
                                                            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                        >
                                                            {categories.map(cat => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-2">Question</label>
                                                        <input
                                                            type="text"
                                                            value={faq.question}
                                                            onChange={(e) => handleChange(faq.id, 'question', e.target.value)}
                                                            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-foreground mb-2">Réponse</label>
                                                        <textarea
                                                            value={faq.answer}
                                                            onChange={(e) => handleChange(faq.id, 'answer', e.target.value)}
                                                            rows={6}
                                                            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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

            {/* ==================== EMPTY STATE ==================== */}
            {faqs.length === 0 && !isLoading && (
                <div className="bg-muted/30 rounded-2xl p-12 sm:p-16 text-center border border-border border-dashed">
                    <HelpCircle size={64} className="text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-foreground mb-3">Aucune FAQ pour le moment</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        Ajoutez vos premières questions fréquentes pour aider vos visiteurs
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddFAQ}
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all"
                    >
                        Ajouter la première FAQ
                    </motion.button>
                </div>
            )}
        </div>
    );
}