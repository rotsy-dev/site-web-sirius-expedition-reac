import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import { Reorder } from 'framer-motion';
import { Save, FileText, Plus, Trash2, GripVertical, AlertCircle, Heading } from 'lucide-react';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Lang = 'en' | 'fr' | 'de' | 'it';

interface Section {
    id: string;
    subtitle: string; // Titre du paragraphe personnalisable
    content: string;  // Corps du texte
}

interface TermsData {
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
    const [data, setData] = useState<TermsData>({
        title: '', heroSubtitle: '',
        lastUpdated: new Date().toISOString().split('T')[0],
        version: '1.0', sections: [], contactEmail: '', jurisdiction: ''
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
            if (snap.exists()) setData(snap.data() as TermsData);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    const addSection = () => {
        const newSection: Section = { id: Date.now().toString(), subtitle: '', content: '' };
        setData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    };

    const updateSection = (id: string, field: keyof Section, value: string) => {
        setData(prev => ({
            ...prev,
            sections: prev.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
        }));
    };

    const saveTerms = async () => {
        if (!changeReason.trim()) return alert('Raison requise');
        setSaving(true);
        try {
            await setDoc(doc(db, 'terms_conditions', lang), { ...data, updatedAt: serverTimestamp() });
            await addDoc(collection(db, 'terms_conditions_history'), { ...data, changeReason, timestamp: serverTimestamp() });
            alert('Publié !');
            setChangeReason('');
        } catch (e) { alert('Erreur'); }
        setSaving(false);
    };

    if (loading) return <div className="p-20 text-center">Chargement...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4 pb-20">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
                <div className="flex items-center gap-3">
                    <FileText className="text-blue-600" />
                    <h1 className="text-xl font-bold">Configuration des Conditions</h1>
                </div>
                <div className="flex gap-2">
                    {(Object.keys(LANGUAGES) as Lang[]).map((l) => (
                        <button key={l} onClick={() => setLang(l as Lang)} 
                            className={`px-4 py-2 rounded-lg text-sm ${lang === l ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                            {LANGUAGES[l]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                        <label className="text-xs font-bold uppercase text-gray-400">En-tête</label>
                        <input className="w-full p-3 bg-gray-50 rounded-xl border-none" value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="Titre de la page" />
                        <textarea className="w-full p-3 bg-gray-50 rounded-xl border-none h-24" value={data.heroSubtitle} onChange={e => setData({...data, heroSubtitle: e.target.value})} placeholder="Description" />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center text-[#443C34]">
                        <h3 className="font-bold text-lg">Paragraphes</h3>
                        <button onClick={addSection} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm">
                            <Plus size={16} /> Ajouter un paragraphe
                        </button>
                    </div>

                    <Reorder.Group axis="y" values={data.sections} onReorder={(newOrder) => setData({ ...data, sections: newOrder })} className="space-y-6">
                        {data.sections.map((section) => (
                            <Reorder.Item key={section.id} value={section} className="bg-white border rounded-2xl p-6 shadow-sm">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                                        <GripVertical className="text-gray-300 cursor-grab" />
                                        <Heading size={18} className="text-gray-400" />
                                        <input 
                                            className="flex-1 font-bold text-[#443C34] bg-transparent border-none focus:ring-0" 
                                            value={section.subtitle} 
                                            onChange={e => updateSection(section.id, 'subtitle', e.target.value)}
                                            placeholder="Titre personnalisé (ex: Payment, Deposit...)"
                                        />
                                        <button onClick={() => setData(prev => ({...prev, sections: prev.sections.filter(s => s.id !== section.id)}))} className="text-red-400">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <ReactQuill theme="snow" modules={quillModules} value={section.content} onChange={(val) => updateSection(section.id, 'content', val)} placeholder="Rédigez le texte ici..." />
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    <div className="bg-white p-6 rounded-2xl border shadow-lg space-y-4 border-t-4 border-t-blue-600">
                        <input className="w-full p-3 border rounded-xl" placeholder="Raison de la mise à jour..." value={changeReason} onChange={e => setChangeReason(e.target.value)} />
                        <button onClick={saveTerms} disabled={saving || !changeReason.trim()} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex justify-center items-center gap-2">
                            <Save size={20} /> Enregistrer et Publier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}