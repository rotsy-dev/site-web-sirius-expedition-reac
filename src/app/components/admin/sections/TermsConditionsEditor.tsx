import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import { Reorder } from 'framer-motion';
import { Save, FileText, Plus, Trash2, GripVertical, Heading } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Lang = 'en' | 'fr' | 'de' | 'it';

interface Section {
    id: string;
    subtitle: string;
    content: string;
}

interface TermsData {
    title: string;
    subtitle: string;
    lastUpdated: string;
    sections: Section[];
}

const LANGUAGES: Record<Lang, string> = {
    en: 'English', fr: 'Français', de: 'Deutsch', it: 'Italiano'
};

const quillModules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
    ],
};

export default function TermsConditionsEditor() {
    const [lang, setLang] = useState<Lang>('en');
    const [data, setData] = useState<TermsData>({
        title: '',
        subtitle: '',
        lastUpdated: new Date().toISOString().split('T')[0],
        sections: [],
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changeReason, setChangeReason] = useState('');

    useEffect(() => { loadTerms(lang); }, [lang]);

    const loadTerms = async (language: Lang) => {
        setLoading(true);
        try {
            const ref = doc(db, 'terms_conditions', language);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setData(snap.data() as TermsData);
            } else {
                // Données par défaut
                setData({
                    title: language === 'fr' ? 'Conditions Générales' :
                        language === 'de' ? 'Allgemeine Geschäftsbedingungen' :
                            language === 'it' ? 'Termini e Condizioni' : 'Terms & Conditions',
                    subtitle: language === 'fr' ? 'Conditions régissant l\'utilisation de nos services' :
                        language === 'de' ? 'Bedingungen für die Nutzung unserer Dienste' :
                            language === 'it' ? 'Condizioni che regolano l\'uso dei nostri servizi' :
                                'Terms governing the use of our services',
                    lastUpdated: new Date().toISOString().split('T')[0],
                    sections: [],
                });
            }
        } catch (error) {
            console.error('Erreur de chargement:', error);
        }
        setLoading(false);
    };

    const addSection = () => {
        const newSection: Section = {
            id: Date.now().toString(),
            subtitle: '',
            content: ''
        };
        setData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    };

    const updateSection = (id: string, field: keyof Section, value: string) => {
        setData(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    const deleteSection = (id: string) => {
        setData(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== id)
        }));
    };

    const saveTerms = async () => {
        if (!changeReason.trim()) {
            alert('Veuillez indiquer une raison pour cette mise à jour');
            return;
        }

        setSaving(true);
        try {
            // Sauvegarder dans terms_conditions/{lang}
            await setDoc(doc(db, 'terms_conditions', lang), {
                ...data,
                updatedAt: serverTimestamp()
            });

            // Archiver dans l'historique
            await addDoc(collection(db, 'terms_conditions_history'), {
                ...data,
                language: lang,
                changeReason,
                timestamp: serverTimestamp()
            });

            alert('✅ Conditions générales publiées avec succès !');
            setChangeReason('');
        } catch (e) {
            console.error('Erreur de sauvegarde:', e);
            alert('❌ Erreur lors de la sauvegarde');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="p-8 sm:p-12 md:p-20 text-center">
                <div className="text-base sm:text-lg text-gray-600">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6 pb-12 sm:pb-16 md:pb-20">
            {/* En-tête avec sélecteur de langue - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <FileText className="text-[#443C34] w-5 h-5 sm:w-6 sm:h-6" />
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Configuration Conditions Générales</h1>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto justify-center sm:justify-end">
                    {(Object.keys(LANGUAGES) as Lang[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${lang === l
                                    ? 'bg-[#443C34] text-[#F0E7D5]'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <span className="hidden xs:inline">{LANGUAGES[l]}</span>
                            <span className="xs:hidden">{l.toUpperCase()}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenu principal avec grille responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {/* Colonne gauche - Métadonnées */}
                <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border shadow-sm space-y-3 sm:space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-400">En-tête de page</label>
                        <input
                            className="w-full p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border-none focus:ring-2 focus:ring-[#443C34] text-sm sm:text-base"
                            value={data.title}
                            onChange={e => setData({ ...data, title: e.target.value })}
                            placeholder="Titre principal (ex: Terms & Conditions)"
                        />
                        <textarea
                            className="w-full p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border-none h-20 sm:h-24 focus:ring-2 focus:ring-[#443C34] text-sm sm:text-base"
                            value={data.subtitle}
                            onChange={e => setData({ ...data, subtitle: e.target.value })}
                            placeholder="Sous-titre descriptif"
                        />
                    </div>

                    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border shadow-sm space-y-3 sm:space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-400">Date de mise à jour</label>
                        <input
                            type="date"
                            className="w-full p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border-none focus:ring-2 focus:ring-[#443C34] text-sm sm:text-base"
                            value={data.lastUpdated}
                            onChange={e => setData({ ...data, lastUpdated: e.target.value })}
                        />
                    </div>
                </div>

                {/* Colonne droite - Sections */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 sm:gap-0 text-[#443C34]">
                        <h3 className="font-bold text-base sm:text-lg md:text-xl">Sections du document</h3>
                        <button
                            onClick={addSection}
                            className="bg-[#443C34] text-[#F0E7D5] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:bg-[#443C34]/90 transition-colors"
                        >
                            <Plus size={14} className="sm:w-4 sm:h-4" /> 
                            <span>Ajouter une section</span>
                        </button>
                    </div>

                    <Reorder.Group
                        axis="y"
                        values={data.sections}
                        onReorder={(newOrder) => setData({ ...data, sections: newOrder })}
                        className="space-y-4 sm:space-y-6"
                    >
                        {data.sections.map((section) => (
                            <Reorder.Item
                                key={section.id}
                                value={section}
                                className="bg-white border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 p-1.5 sm:p-2 rounded-lg">
                                        <GripVertical className="text-gray-300 cursor-grab active:cursor-grabbing w-4 h-4 sm:w-5 sm:h-5" />
                                        <Heading size={16} className="sm:w-4.5 sm:h-4.5 text-gray-400" />
                                        <input
                                            className="flex-1 font-bold text-[#443C34] bg-transparent border-none focus:ring-0 text-sm sm:text-base"
                                            value={section.subtitle}
                                            onChange={e => updateSection(section.id, 'subtitle', e.target.value)}
                                            placeholder="Titre de la section (ex: Service Agreement, Payment Terms...)"
                                        />
                                        <button
                                            onClick={() => deleteSection(section.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={16} className="sm:w-4.5 sm:h-4.5" />
                                        </button>
                                    </div>
                                    <div className="react-quill-responsive">
                                        <ReactQuill
                                            theme="snow"
                                            modules={quillModules}
                                            value={section.content}
                                            onChange={(val) => updateSection(section.id, 'content', val)}
                                            placeholder="Rédigez le contenu de cette section..."
                                            className="bg-white"
                                        />
                                        <style jsx>{`
                                            .react-quill-responsive :global(.ql-toolbar) {
                                                padding: 8px 12px;
                                            }
                                            .react-quill-responsive :global(.ql-container) {
                                                min-height: 150px;
                                                font-size: 14px;
                                            }
                                            @media (min-width: 640px) {
                                                .react-quill-responsive :global(.ql-toolbar) {
                                                    padding: 12px 16px;
                                                }
                                                .react-quill-responsive :global(.ql-container) {
                                                    min-height: 200px;
                                                    font-size: 16px;
                                                }
                                            }
                                        `}</style>
                                    </div>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    {data.sections.length === 0 && (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
                            <FileText className="mx-auto mb-3 sm:mb-4 text-gray-400 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" />
                            <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">Aucune section pour le moment</p>
                            <button
                                onClick={addSection}
                                className="bg-[#443C34] text-[#F0E7D5] px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-[#443C34]/90 transition-colors text-sm sm:text-base"
                            >
                                Créer la première section
                            </button>
                        </div>
                    )}

                    {/* Zone de publication */}
                    <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border shadow-lg space-y-3 sm:space-y-4 border-t-4 border-t-[#443C34]">
                        <label className="text-xs sm:text-sm font-bold text-gray-700">Raison de la mise à jour *</label>
                        <input
                            className="w-full p-2.5 sm:p-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-[#443C34] text-sm sm:text-base"
                            placeholder="Ex: Mise à jour des conditions de paiement..."
                            value={changeReason}
                            onChange={e => setChangeReason(e.target.value)}
                        />
                        <button
                            onClick={saveTerms}
                            disabled={saving || !changeReason.trim()}
                            className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold flex justify-center items-center gap-2 transition-colors text-sm sm:text-base ${saving || !changeReason.trim()
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#443C34] text-[#F0E7D5] hover:bg-[#443C34]/90'
                                }`}
                        >
                            <Save size={16} className="sm:w-5 sm:h-5" />
                            {saving ? 'Publication en cours...' : 'Enregistrer et Publier'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}