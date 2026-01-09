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

  if (loading) return (
    <div className="p-6 sm:p-8 md:p-10 text-center">
      <div className="text-base sm:text-lg text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header avec sélecteur de langue - Responsive */}
      <div className="flex flex-col xs:flex-row justify-between items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 w-full xs:w-auto">
          <ShieldCheck className="text-blue-600 w-6 h-6 sm:w-8 sm:h-8" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Privacy Policy Editor</h2>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 w-full xs:w-auto justify-center xs:justify-end">
          {(['en', 'fr', 'de', 'it'] as Lang[]).map((l) => (
            <button 
              key={l} 
              onClick={() => setLang(l)} 
              className={`px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg transition-colors text-xs sm:text-sm ${lang === l ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              <span className="hidden xs:inline">{l.toUpperCase()}</span>
              <span className="xs:hidden">{l.charAt(0).toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Header Config - Responsive */}
        <div className="bg-white p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border space-y-3 sm:space-y-4 shadow-sm">
          <label className="text-xs font-bold text-gray-400 uppercase">Page Header</label>
          <input 
            className="w-full text-lg sm:text-xl md:text-2xl font-bold border-b border-gray-100 focus:ring-0 focus:border-blue-500 p-1 sm:p-2" 
            value={data.title} 
            onChange={e => setData({...data, title: e.target.value})} 
            placeholder="Main Title"
          />
          <textarea 
            className="w-full text-sm sm:text-base text-gray-500 border-none focus:ring-0 bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 h-16 sm:h-20" 
            value={data.subtitle} 
            onChange={e => setData({...data, subtitle: e.target.value})} 
            placeholder="Hero Subtitle"
          />
        </div>

        {/* Sections List - Responsive */}
        <Reorder.Group 
          axis="y" 
          values={data.sections} 
          onReorder={(newOrder) => setData({...data, sections: newOrder})} 
          className="space-y-4 sm:space-y-6"
        >
          {data.sections.map((section) => (
            <Reorder.Item 
              key={section.id} 
              value={section} 
              className="bg-white border rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm space-y-3 sm:space-y-4"
            >
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl">
                  <GripVertical className="text-gray-400 cursor-grab w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="flex-1 flex items-center gap-1.5 sm:gap-2 bg-white border rounded-lg px-2 py-1 sm:px-3 sm:py-1.5">
                     <Heading size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
                     <input 
                        className="w-full font-bold text-[#443C34] border-none p-0 focus:ring-0 text-sm sm:text-base" 
                        value={section.subtitle} 
                        onChange={e => updateSection(section.id, 'subtitle', e.target.value)}
                        placeholder="Article Title (Displayed on page)"
                     />
                  </div>
                  <input 
                    className="w-16 sm:w-20 md:w-24 text-xs text-gray-400 bg-transparent border-none focus:ring-0 italic" 
                    value={section.title} 
                    onChange={e => updateSection(section.id, 'title', e.target.value)}
                    placeholder="Admin note"
                  />
                  <button 
                    onClick={() => setData({...data, sections: data.sections.filter(s => s.id !== section.id)})} 
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 size={14} className="sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>

                <textarea 
                  className="w-full p-3 sm:p-4 bg-white border border-gray-100 rounded-lg sm:rounded-xl min-h-[100px] sm:min-h-[150px] text-xs sm:text-sm leading-relaxed" 
                  value={section.content}
                  onChange={e => updateSection(section.id, 'content', e.target.value)}
                  placeholder="Content (HTML supported)..."
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Bouton Add New Section - Responsive */}
        <button 
          onClick={() => setData({...data, sections: [...data.sections, {id: Date.now().toString(), title: 'Note', subtitle: 'New Article', content: ''}]})} 
          className="w-full py-4 sm:py-5 md:py-6 border-2 border-dashed rounded-xl sm:rounded-2xl text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-all font-medium text-sm sm:text-base"
        >
          + Add New Privacy Section
        </button>

        {/* Bouton de publication - Responsive */}
        <button 
          onClick={savePrivacy} 
          disabled={saving} 
          className="w-full py-3 sm:py-3.5 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 transition-all text-sm sm:text-base"
        >
          <Save size={16} className="sm:w-5 sm:h-5" /> 
          {saving ? 'Saving Changes...' : 'Publish Privacy Policy'}
        </button>
      </div>
    </div>
  );
}