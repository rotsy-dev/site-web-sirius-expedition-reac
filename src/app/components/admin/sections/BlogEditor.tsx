import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, FileText, ImageIcon, Settings, Layout, Loader2, X } from 'lucide-react';
import { db } from '../../../../firebase/config';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useToast } from '../../../../components/shared/Toast';
import { ImageUploader } from '../../../../components/shared/ImageUploader';
import { RichTextEditor } from '../../../../components/blog/RichTextEditor';

export function BlogEditor() {
    const [posts, setPosts] = useState<any[]>([]);
    const [pageSettings, setPageSettings] = useState({
        title: 'Our Blog',
        subtitle: 'Expert insights, travel tips and stories from Madagascar',
        badge: 'Latest Story'
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'content' | 'media' | 'settings'>('content');
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsSnap = await getDocs(collection(db, 'blogPosts'));
                const settingsSnap = await getDoc(doc(db, 'settings', 'blogPage'));
                if (settingsSnap.exists()) setPageSettings(settingsSnap.data() as any);
                setPosts(postsSnap.docs.map(d => d.data()).sort((a,b) => b.id - a.id));
            } catch (err) {
                showToast('error', 'Erreur de chargement');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            for (const post of posts) {
                await setDoc(doc(db, 'blogPosts', post.id.toString()), post);
            }
            await setDoc(doc(db, 'settings', 'blogPage'), pageSettings);
            setHasChanges(false);
            showToast('success', 'Modifications enregistrées');
        } catch (err) {
            showToast('error', 'Erreur de sauvegarde');
        }
    };

    if (isLoading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* Header Admin */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-4 z-30">
                <div>
                    <h2 className="text-xl font-bold">Configuration du Blog</h2>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">{hasChanges ? '● Modifications non enregistrées' : 'Synchronisé'}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleSave} disabled={!hasChanges} className="flex items-center gap-2 px-6 py-2.5 bg-[#1A120B] text-white rounded-xl font-bold disabled:opacity-20 transition-all">
                        <Save size={18} /> Enregistrer tout
                    </button>
                </div>
            </div>

            {/* MODIFIER LES TEXTES DE LA PAGE PUBLIQUE */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6 font-bold text-xs uppercase tracking-[0.2em] text-gray-400">
                    <Layout size={16} /> Textes de l'en-tête (Page Publique)
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Petit Badge</label>
                        <input type="text" value={pageSettings.badge} onChange={e => {setPageSettings({...pageSettings, badge: e.target.value}); setHasChanges(true)}} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Titre Principal</label>
                        <input type="text" value={pageSettings.title} onChange={e => {setPageSettings({...pageSettings, title: e.target.value}); setHasChanges(true)}} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Sous-titre</label>
                        <input type="text" value={pageSettings.subtitle} onChange={e => {setPageSettings({...pageSettings, subtitle: e.target.value}); setHasChanges(true)}} className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black" />
                    </div>
                </div>
            </section>

            {/* LISTE DES ARTICLES */}
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img src={post.image} className="w-16 h-16 rounded-2xl object-cover" />
                                <div>
                                    <h4 className="font-bold text-lg">{post.title}</h4>
                                    <p className="text-xs text-gray-400">{post.category} • {post.date}</p>
                                </div>
                            </div>
                            <button onClick={() => setEditingId(editingId === post.id ? null : post.id)} className="px-6 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-sm transition-colors">
                                {editingId === post.id ? 'Fermer' : 'Modifier'}
                            </button>
                        </div>
                        
                        <AnimatePresence>
                            {editingId === post.id && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="border-t border-gray-50 bg-gray-50/30">
                                    <div className="p-8 space-y-6">
                                        <RichTextEditor value={post.content} onChange={(v) => {
                                            setPosts(posts.map(p => p.id === post.id ? {...p, content: v} : p));
                                            setHasChanges(true);
                                        }} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}