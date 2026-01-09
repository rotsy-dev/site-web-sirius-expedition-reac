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
            <div className="p-20 text-center">
                <div className="text-lg text-gray-600">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4 pb-20">
            {/* En-tête avec sélecteur de langue */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-3">
                    <FileText className="text-[#443C34]" />
                    <h1 className="text-xl font-bold">Configuration Conditions Générales</h1>
                </div>
                <div className="flex gap-2">
                    {(Object.keys(LANGUAGES) as Lang[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${lang === l
                                    ? 'bg-[#443C34] text-[#F0E7D5]'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {LANGUAGES[l]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne gauche - Métadonnées */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-400">En-tête de page</label>
                        <input
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#443C34]"
                            value={data.title}
                            onChange={e => setData({ ...data, title: e.target.value })}
                            placeholder="Titre principal (ex: Terms & Conditions)"
                        />
                        <textarea
                            className="w-full p-3 bg-gray-50 rounded-xl border-none h-24 focus:ring-2 focus:ring-[#443C34]"
                            value={data.subtitle}
                            onChange={e => setData({ ...data, subtitle: e.target.value })}
                            placeholder="Sous-titre descriptif"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-400">Date de mise à jour</label>
                        <input
                            type="date"
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-[#443C34]"
                            value={data.lastUpdated}
                            onChange={e => setData({ ...data, lastUpdated: e.target.value })}
                        />
                    </div>
                </div>

                {/* Colonne droite - Sections */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center text-[#443C34]">
                        <h3 className="font-bold text-lg">Sections du document</h3>
                        <button
                            onClick={addSection}
                            className="bg-[#443C34] text-[#F0E7D5] px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-[#443C34]/90 transition-colors"
                        >
                            <Plus size={16} /> Ajouter une section
                        </button>
                    </div>

                    <Reorder.Group
                        axis="y"
                        values={data.sections}
                        onReorder={(newOrder) => setData({ ...data, sections: newOrder })}
                        className="space-y-6"
                    >
                        {data.sections.map((section) => (
                            <Reorder.Item
                                key={section.id}
                                value={section}
                                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                                        <GripVertical className="text-gray-300 cursor-grab active:cursor-grabbing" />
                                        <Heading size={18} className="text-gray-400" />
                                        <input
                                            className="flex-1 font-bold text-[#443C34] bg-transparent border-none focus:ring-0"
                                            value={section.subtitle}
                                            onChange={e => updateSection(section.id, 'subtitle', e.target.value)}
                                            placeholder="Titre de la section (ex: Service Agreement, Payment Terms...)"
                                        />
                                        <button
                                            onClick={() => deleteSection(section.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <ReactQuill
                                        theme="snow"
                                        modules={quillModules}
                                        value={section.content}
                                        onChange={(val) => updateSection(section.id, 'content', val)}
                                        placeholder="Rédigez le contenu de cette section..."
                                        className="bg-white"
                                    />
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    {data.sections.length === 0 && (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
                            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-500 mb-4">Aucune section pour le moment</p>
                            <button
                                onClick={addSection}
                                className="bg-[#443C34] text-[#F0E7D5] px-6 py-2 rounded-xl hover:bg-[#443C34]/90 transition-colors"
                            >
                                Créer la première section
                            </button>
                        </div>
                    )}

                    {/* Zone de publication */}
                    <div className="bg-white p-6 rounded-2xl border shadow-lg space-y-4 border-t-4 border-t-[#443C34]">
                        <label className="text-sm font-bold text-gray-700">Raison de la mise à jour *</label>
                        <input
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#443C34]"
                            placeholder="Ex: Mise à jour des conditions de paiement..."
                            value={changeReason}
                            onChange={e => setChangeReason(e.target.value)}
                        />
                        <button
                            onClick={saveTerms}
                            disabled={saving || !changeReason.trim()}
                            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${saving || !changeReason.trim()
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#443C34] text-[#F0E7D5] hover:bg-[#443C34]/90'
                                }`}
                        >
                            <Save size={20} />
                            {saving ? 'Publication en cours...' : 'Enregistrer et Publier'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}