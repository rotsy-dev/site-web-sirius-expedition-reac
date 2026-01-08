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

interface PrivacyData {
    title: string;
    heroSubtitle: string;
    lastUpdated: string;
    version: string;
    sections: Section[];
    contactEmail: string;
    jurisdiction: string;
}

const LANGUAGES: Record<Lang, string> = {
    en: 'English', fr: 'Français', de: 'Deutsch', it: 'Italiano'
};

const quillModules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
    ],
};

export default function TermsConditionsEditor() {
    const [lang, setLang] = useState<Lang>('en');
    const [data, setData] = useState<PrivacyData>({
        title: '',
        heroSubtitle: '',
        lastUpdated: new Date().toISOString().split('T')[0],
        version: '1.0',
        sections: [],
        contactEmail: '',
        jurisdiction: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changeReason, setChangeReason] = useState('');

    useEffect(() => { loadPrivacy(lang); }, [lang]);

    const loadPrivacy = async (language: Lang) => {
        setLoading(true);
        try {
            const ref = doc(db, 'privacy_policy', language);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setData(snap.data() as PrivacyData);
            } else {
                // Données par défaut si rien n'existe
                setData({
                    title: language === 'fr' ? 'Politique de Confidentialité' : 
                           language === 'de' ? 'Datenschutzrichtlinie' :
                           language === 'it' ? 'Informativa sulla Privacy' : 'Privacy Policy',
                    heroSubtitle: language === 'fr' ? 'Comment nous protégeons vos données personnelles' :
                                  language === 'de' ? 'Wie wir Ihre persönlichen Daten schützen' :
                                  language === 'it' ? 'Come proteggiamo i tuoi dati personali' :
                                  'How we protect your personal data',
                    lastUpdated: new Date().toISOString().split('T')[0],
                    version: '1.0',
                    sections: [],
                    contactEmail: '',
                    jurisdiction: ''
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

    const savePrivacy = async () => {
        if (!changeReason.trim()) {
            alert('Veuillez indiquer une raison pour cette mise à jour');
            return;
        }
        
        setSaving(true);
        try {
            // Sauvegarder dans privacy_policy/{lang}
            await setDoc(doc(db, 'privacy_policy', lang), {
                ...data,
                updatedAt: serverTimestamp()
            });
            
            // Archiver dans l'historique
            await addDoc(collection(db, 'privacy_policy_history'), {
                ...data,
                language: lang,
                changeReason,
                timestamp: serverTimestamp()
            });
            
            alert('✅ Politique de confidentialité publiée avec succès !');
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
                    <FileText className="text-blue-600" />
                    <h1 className="text-xl font-bold">Configuration Politique de Confidentialité</h1>
                </div>
                <div className="flex gap-2">
                    {(Object.keys(LANGUAGES) as Lang[]).map((l) => (
                        <button
                            key={l}
                            onClick={() => setLang(l)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                lang === l
                                    ? 'bg-blue-600 text-white'
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
                        <label className="text-xs font-bold uppercase text-gray-400">En-tête</label>
                        <input
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                            value={data.title}
                            onChange={e => setData({ ...data, title: e.target.value })}
                            placeholder="Titre de la page"
                        />
                        <textarea
                            className="w-full p-3 bg-gray-50 rounded-xl border-none h-24 focus:ring-2 focus:ring-blue-500"
                            value={data.heroSubtitle}
                            onChange={e => setData({ ...data, heroSubtitle: e.target.value })}
                            placeholder="Description"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-400">Informations</label>
                        <input
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                            value={data.contactEmail}
                            onChange={e => setData({ ...data, contactEmail: e.target.value })}
                            placeholder="Email de contact"
                        />
                        <input
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                            value={data.jurisdiction}
                            onChange={e => setData({ ...data, jurisdiction: e.target.value })}
                            placeholder="Juridiction"
                        />
                        <input
                            className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                            value={data.version}
                            onChange={e => setData({ ...data, version: e.target.value })}
                            placeholder="Version"
                        />
                    </div>
                </div>

                {/* Colonne droite - Sections */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center text-[#443C34]">
                        <h3 className="font-bold text-lg">Sections</h3>
                        <button
                            onClick={addSection}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-blue-700 transition-colors"
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
                                            placeholder="Titre de la section (ex: Data Collection, Cookies...)"
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
                                className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                Créer la première section
                            </button>
                        </div>
                    )}

                    {/* Zone de publication */}
                    <div className="bg-white p-6 rounded-2xl border shadow-lg space-y-4 border-t-4 border-t-blue-600">
                        <label className="text-sm font-bold text-gray-700">Raison de la mise à jour *</label>
                        <input
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                            placeholder="Ex: Mise à jour RGPD, Ajout politique cookies..."
                            value={changeReason}
                            onChange={e => setChangeReason(e.target.value)}
                        />
                        <button
                            onClick={savePrivacy}
                            disabled={saving || !changeReason.trim()}
                            className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors ${
                                saving || !changeReason.trim()
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
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