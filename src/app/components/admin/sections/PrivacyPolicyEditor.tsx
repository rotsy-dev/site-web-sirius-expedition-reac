import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import { motion, Reorder } from 'framer-motion';
import { Save, ShieldCheck, Plus, Trash2, GripVertical, Heading } from 'lucide-react';

type Lang = 'en' | 'fr' | 'de' | 'it';

interface Section {
  id: string;
  title: string;    // Ce champ sera masqué sur la page publique (utilisé pour l'admin)
  subtitle: string; // LE NOUVEAU CHAMP : Titre stylisé affiché sur la page
  content: string;
}

export default function PrivacyPolicyEditor() {
  const [lang, setLang] = useState<Lang>('en');
  const [data, setData] = useState({
    title: 'Privacy Policy',
    subtitle: 'How we protect your personal data at Sirius Expedition',
    lastUpdated: new Date().toISOString().split('T')[0],
    sections: [] as Section[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadPrivacy(lang); }, [lang]);

  const loadPrivacy = async (language: Lang) => {
    setLoading(true);
    const snap = await getDoc(doc(db, 'privacy_policies', language));
    if (snap.exists()) {
      setData(snap.data() as any);
    } else {
      setData({
        title: 'Privacy Policy',
        subtitle: 'We value your privacy.',
        lastUpdated: new Date().toISOString().split('T')[0],
        sections: [{ id: '1', title: 'Admin Note', subtitle: 'Data Collection', content: '<p>Information we collect...</p>' }]
      });
    }
    setLoading(false);
  };

  const savePrivacy = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'privacy_policies', lang), { 
        ...data, 
        updatedAt: serverTimestamp() 
      });
      alert('Privacy Policy updated!');
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const updateSection = (id: string, field: keyof Section, value: string) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={32} />
          <h2 className="text-xl font-bold">Privacy Policy Editor</h2>
        </div>
        <div className="flex gap-2">
          {(['en', 'fr', 'de', 'it'] as Lang[]).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`px-4 py-2 rounded-lg transition-colors ${lang === l ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Header Config */}
        <div className="bg-white p-6 rounded-2xl border space-y-4 shadow-sm">
          <label className="text-xs font-bold text-gray-400 uppercase">Page Header</label>
          <input 
            className="w-full text-2xl font-bold border-b border-gray-100 focus:ring-0 focus:border-blue-500" 
            value={data.title} 
            onChange={e => setData({...data, title: e.target.value})} 
            placeholder="Main Title"
          />
          <textarea 
            className="w-full text-gray-500 border-none focus:ring-0 bg-gray-50 rounded-xl p-3 h-20" 
            value={data.subtitle} 
            onChange={e => setData({...data, subtitle: e.target.value})} 
            placeholder="Hero Subtitle"
          />
        </div>

        {/* Sections List */}
        <Reorder.Group axis="y" values={data.sections} onReorder={(newOrder) => setData({...data, sections: newOrder})} className="space-y-6">
          {data.sections.map((section) => (
            <Reorder.Item key={section.id} value={section} className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                  <GripVertical className="text-gray-400 cursor-grab" />
                  <div className="flex-1 flex items-center gap-2 bg-white border rounded-lg px-3 py-1">
                     <Heading size={14} className="text-gray-400" />
                     <input 
                        className="w-full font-bold text-[#443C34] border-none p-0 focus:ring-0" 
                        value={section.subtitle} 
                        onChange={e => updateSection(section.id, 'subtitle', e.target.value)}
                        placeholder="Article Title (Displayed on page)"
                     />
                  </div>
                  <input 
                    className="w-24 text-xs text-gray-400 bg-transparent border-none focus:ring-0 italic" 
                    value={section.title} 
                    onChange={e => updateSection(section.id, 'title', e.target.value)}
                    placeholder="Admin note"
                  />
                  <button onClick={() => setData({...data, sections: data.sections.filter(s => s.id !== section.id)})} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>

                <textarea 
                  className="w-full p-4 bg-white border border-gray-100 rounded-xl min-h-[150px] text-sm leading-relaxed" 
                  value={section.content}
                  onChange={e => updateSection(section.id, 'content', e.target.value)}
                  placeholder="Content (HTML supported)..."
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <button 
            onClick={() => setData({...data, sections: [...data.sections, {id: Date.now().toString(), title: 'Note', subtitle: 'New Article', content: ''}]})} 
            className="w-full py-6 border-2 border-dashed rounded-2xl text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-all font-medium"
        >
          + Add New Privacy Section
        </button>

        <button onClick={savePrivacy} disabled={saving} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all">
          <Save size={20} /> {saving ? 'Saving Changes...' : 'Publish Privacy Policy'}
        </button>
      </div>
    </div>
  );
}