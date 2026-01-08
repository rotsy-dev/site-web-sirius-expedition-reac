import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase/config';
import { motion, Reorder } from 'framer-motion';
import { Save, ShieldCheck, Plus, Trash2, GripVertical, FileLock } from 'lucide-react';

type Lang = 'en' | 'fr' | 'de' | 'it';

export default function PrivacyPolicyEditor() {
  const [lang, setLang] = useState<Lang>('en');
  const [data, setData] = useState({
    title: 'Privacy Policy',
    subtitle: 'How we protect your personal data at Sirius Expedition',
    lastUpdated: new Date().toISOString().split('T')[0],
    sections: [] as any[]
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
        sections: [{ id: '1', title: 'Data Collection', content: '<p>Information we collect...</p>' }]
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

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-600" size={32} />
          <h2 className="text-xl font-bold">Privacy Policy Editor</h2>
        </div>
        <div className="flex gap-2">
          {['en', 'fr', 'de', 'it'].map((l) => (
            <button key={l} onClick={() => setLang(l as Lang)} className={`px-4 py-2 rounded-lg ${lang === l ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-2xl border space-y-4">
          <input 
            className="w-full text-2xl font-bold border-none focus:ring-0" 
            value={data.title} 
            onChange={e => setData({...data, title: e.target.value})} 
          />
          <textarea 
            className="w-full text-gray-500 border-none focus:ring-0 bg-gray-50 rounded-xl p-3" 
            value={data.subtitle} 
            onChange={e => setData({...data, subtitle: e.target.value})} 
          />
        </div>

        <Reorder.Group axis="y" values={data.sections} onReorder={(newOrder) => setData({...data, sections: newOrder})} className="space-y-4">
          {data.sections.map((section: any) => (
            <Reorder.Item key={section.id} value={section} className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <GripVertical className="text-gray-400 cursor-grab" />
                <input 
                  className="flex-1 font-bold bg-transparent border-none focus:ring-0" 
                  value={section.title} 
                  onChange={e => {
                    const newSections = data.sections.map(s => s.id === section.id ? {...s, title: e.target.value} : s);
                    setData({...data, sections: newSections});
                  }}
                />
                <button onClick={() => setData({...data, sections: data.sections.filter(s => s.id !== section.id)})} className="text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
              <textarea 
                className="w-full p-4 bg-gray-50 rounded-xl border-none min-h-[100px] font-mono text-sm" 
                value={section.content}
                onChange={e => {
                  const newSections = data.sections.map(s => s.id === section.id ? {...s, content: e.target.value} : s);
                  setData({...data, sections: newSections});
                }}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <button onClick={() => setData({...data, sections: [...data.sections, {id: Date.now().toString(), title: 'New Article', content: ''}]})} className="w-full py-4 border-2 border-dashed rounded-2xl text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-all">
          + Add Privacy Article
        </button>

        <button onClick={savePrivacy} disabled={saving} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
          <Save size={20} /> {saving ? 'Saving...' : 'Publish Privacy Policy'}
        </button>
      </div>
    </div>
  );
}