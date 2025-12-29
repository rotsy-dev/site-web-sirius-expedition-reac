import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Eye, Calendar, User, Tag, X, FileText, Image as ImageIcon, Settings, Edit2 } from 'lucide-react';
import { db } from '../../../../firebase/config';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '../../../../components/shared/Toast';
import { ImageUploader } from '../../../../components/shared/ImageUploader';
import { RichTextEditor } from '../../../../components/blog/RichTextEditor';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    authorAvatar: string;
    authorBio: string;
    date: string;
    category: string;
    readTime: string;
    tags: string[];
    featured: boolean;
    views: number;
}

interface BlogEditorProps {
    posts: BlogPost[];
    onSave: (posts: BlogPost[]) => void;
}

export function BlogEditor({ posts: initialPosts, onSave }: BlogEditorProps) {
    const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newTag, setNewTag] = useState('');
    const [activeTab, setActiveTab] = useState<'content' | 'media' | 'settings'>('content');
    const { showToast } = useToast();

    // États pour la modale
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    // Chargement depuis Firestore
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsCollection = collection(db, 'blogPosts');
                const snapshot = await getDocs(postsCollection);
                const fetchedPosts: BlogPost[] = snapshot.docs.map((docSnap) => ({
                    id: parseInt(docSnap.id),
                    ...docSnap.data() as Omit<BlogPost, 'id'>
                }));

                fetchedPosts.sort((a, b) => a.id - b.id);
                setPosts(fetchedPosts.length > 0 ? fetchedPosts : initialPosts);
            } catch (err) {
                console.error('Erreur chargement articles:', err);
                showToast('error', 'Impossible de charger les articles depuis Firebase');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [initialPosts]);

    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleChange = (id: number, field: keyof BlogPost, value: any) => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                const updated = { ...post, [field]: value };
                if (field === 'title') {
                    updated.slug = generateSlug(value);
                }
                return updated;
            }
            return post;
        }));
        setHasChanges(true);

        // Mise à jour en temps réel dans la modale
        if (editingPost && editingPost.id === id) {
            setEditingPost(prev => prev ? { ...prev, [field]: value } : null);
        }
    };

    const generateAuthorAvatar = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6D4C41&color=fff`;
    };

    const handleAuthorChange = (id: number, name: string) => {
        const newAvatar = generateAuthorAvatar(name);
        handleChange(id, 'author', name);
        handleChange(id, 'authorAvatar', newAvatar);

        if (editingPost && editingPost.id === id) {
            setEditingPost({ ...editingPost, author: name, authorAvatar: newAvatar });
        }
    };

    const addTag = (postId: number) => {
        if (newTag.trim()) {
            setPosts(posts.map(post =>
                post.id === postId
                    ? { ...post, tags: [...post.tags, newTag.trim().toLowerCase()] }
                    : post
            ));
            setNewTag('');
            setHasChanges(true);

            if (editingPost && editingPost.id === postId) {
                setEditingPost({
                    ...editingPost,
                    tags: [...editingPost.tags, newTag.trim().toLowerCase()]
                });
            }
        }
    };

    const removeTag = (postId: number, tagIndex: number) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, tags: post.tags.filter((_, i) => i !== tagIndex) }
                : post
        ));
        setHasChanges(true);

        if (editingPost && editingPost.id === postId) {
            setEditingPost({
                ...editingPost,
                tags: editingPost.tags.filter((_, i) => i !== tagIndex)
            });
        }
    };

    const handleAddPost = () => {
        const newId = Math.max(...posts.map(p => p.id), 0) + 1;
        const newPost: BlogPost = {
            id: newId,
            title: 'Nouvel Article',
            slug: 'nouvel-article',
            excerpt: 'Un résumé captivant de votre article...',
            content: '## Introduction\n\nCommencez à écrire votre article ici...\n\n## Développement\n\nDéveloppez vos idées...',
            image: '',
            author: 'Auteur',
            authorAvatar: generateAuthorAvatar('Auteur'),
            authorBio: 'Passionné par Madagascar et ses merveilles...',
            date: new Date().toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' }),
            category: 'Voyage',
            readTime: '5 min de lecture',
            tags: [],
            featured: false,
            views: 0,
        };
        setPosts([...posts, newPost]);
        setEditingPost(newPost);
        setIsEditModalOpen(true);
        setHasChanges(true);
        showToast('info', 'Nouvel article créé');
    };

    const openEditModal = (post: BlogPost) => {
        setEditingPost(post);
        setActiveTab('content'); // Reset tab à "Contenu"
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingPost(null);
        setNewTag('');
    };

    const handleDeletePost = async (id: number) => {
        if (confirm('⚠️ Supprimer définitivement cet article ?')) {
            try {
                await deleteDoc(doc(db, 'blogPosts', id.toString()));
                setPosts(posts.filter(p => p.id !== id));
                setHasChanges(true);
                showToast('success', 'Article supprimé');
            } catch (err) {
                console.error('Erreur suppression:', err);
                showToast('error', 'Erreur lors de la suppression');
            }
        }
    };

    const handleSave = async () => {
        const invalidPosts = posts.filter(p => !p.title || p.title.length < 3 || !p.image);
        if (invalidPosts.length > 0) {
            showToast('warning', 'Certains articles ont un titre trop court ou pas d\'image');
            return;
        }

        try {
            for (const post of posts) {
                const postDoc = doc(db, 'blogPosts', post.id.toString());
                await setDoc(postDoc, post);
            }

            onSave(posts);
            setHasChanges(false);
            showToast('success', '✓ Tous les articles ont été sauvegardés !');
        } catch (err) {
            console.error('Erreur sauvegarde:', err);
            showToast('error', 'Erreur lors de la sauvegarde');
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-12 text-[#634832]/60">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A373]"></div>
                <p className="mt-4">Chargement des articles...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#1A120B]">Articles de Blog</h2>
                    <p className="text-[#634832]/60">Gérez vos articles et publications</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-sm text-[#D4A373] bg-[#D4A373]/10 px-3 py-1 rounded-lg font-medium"
                        >
                            ● Non sauvegardé
                        </motion.span>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddPost}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#FAF7F2] rounded-xl text-[#634832] font-medium transition-colors border border-[#634832]/10"
                    >
                        <Plus size={18} />
                        Nouvel Article
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#D4A373] to-[#634832] text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Save size={18} />
                        Sauvegarder
                    </motion.button>
                </div>
            </div>

            {/* Liste des posts */}
            <div className="grid gap-6">
                {posts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl border border-[#634832]/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-[#634832]/10">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF7F2] flex-shrink-0 border border-[#634832]/10">
                                    {post.image ? (
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#634832]/30">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-[#1A120B] text-lg">{post.title}</h3>
                                        {post.featured && (
                                            <span className="px-2 py-1 bg-[#D4A373]/20 text-[#D4A373] text-xs font-medium rounded">
                                                ★ Vedette
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#634832]/60">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={14} /> {post.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye size={14} /> {post.views} vues
                                        </span>
                                        {post.tags.length > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Tag size={14} /> {post.tags.length} tag{post.tags.length > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEditModal(post)}
                                    className="flex items-center gap-1 px-4 py-2 bg-[#D4A373]/10 hover:bg-[#D4A373]/20 text-[#D4A373] rounded-xl text-sm font-medium transition-colors"
                                >
                                    <Edit2 size={16} />
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} className="text-red-500" />
                                </button>
                            </div>
                        </div>

                        {/* Aperçu rapide */}
                        <div className="p-4 bg-[#FAF7F2]/30 text-[#634832] text-sm italic line-clamp-2">
                            {post.excerpt}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modale d'édition / ajout */}
            <AnimatePresence>
                {isEditModalOpen && editingPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={closeEditModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white border-b border-[#634832]/10 p-5 flex items-center justify-between z-10">
                                <h3 className="text-2xl font-bold text-[#1A120B]">
                                    {editingPost.id > Math.max(...initialPosts.map(p => p.id), 0)
                                        ? 'Nouvel Article'
                                        : 'Modifier l’article'}
                                </h3>
                                <button
                                    onClick={closeEditModal}
                                    className="p-2 hover:bg-[#FAF7F2] rounded-xl transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Tabs */}
                                <div className="flex items-center gap-2 border-b border-[#634832]/10 pb-4">
                                    {[
                                        { key: 'content', icon: FileText, label: 'Contenu' },
                                        { key: 'media', icon: ImageIcon, label: 'Médias' },
                                        { key: 'settings', icon: Settings, label: 'Paramètres' }
                                    ].map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key as any)}
                                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
                                                activeTab === tab.key
                                                    ? 'bg-[#D4A373] text-white shadow-sm'
                                                    : 'text-[#634832]/60 hover:bg-[#FAF7F2]'
                                            }`}
                                        >
                                            <tab.icon size={18} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Content Tab */}
                                {activeTab === 'content' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-[#634832]">Titre</label>
                                            <input
                                                type="text"
                                                value={editingPost.title}
                                                onChange={(e) => handleChange(editingPost.id, 'title', e.target.value)}
                                                placeholder="Un titre accrocheur..."
                                                className="w-full px-4 py-3 bg-white border border-[#634832]/20 rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-transparent transition-all"
                                            />
                                            <div className="mt-1 text-xs text-[#634832]/40">
                                                Slug auto : <span className="font-mono text-[#D4A373]">{editingPost.slug}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-[#634832]">Extrait (résumé)</label>
                                            <textarea
                                                value={editingPost.excerpt}
                                                onChange={(e) => handleChange(editingPost.id, 'excerpt', e.target.value)}
                                                rows={2}
                                                placeholder="Un résumé captivant en 1-2 phrases..."
                                                className="w-full px-4 py-3 bg-white border border-[#634832]/20 rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-transparent resize-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-[#634832]">Contenu de l'article</label>
                                            <RichTextEditor
                                                value={editingPost.content}
                                                onChange={(val) => handleChange(editingPost.id, 'content', val)}
                                                minHeight="500px"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Media Tab */}
                                {activeTab === 'media' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-3 text-[#634832]">Image principale</label>
                                            <ImageUploader
                                                value={editingPost.image}
                                                onChange={(url) => handleChange(editingPost.id, 'image', url)}
                                                folder="blog-images"
                                                aspectRatio="4/5"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Settings Tab */}
                                {activeTab === 'settings' && (
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[#634832]">Auteur</label>
                                                <input
                                                    type="text"
                                                    value={editingPost.author}
                                                    onChange={(e) => handleAuthorChange(editingPost.id, e.target.value)}
                                                    className="w-full px-4 py-3 bg-white border border-[#634832]/20 rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[#634832]">Catégorie</label>
                                                <input
                                                    type="text"
                                                    value={editingPost.category}
                                                    onChange={(e) => handleChange(editingPost.id, 'category', e.target.value)}
                                                    className="w-full px-4 py-3 bg-white border border-[#634832]/20 rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[#634832]">Temps de lecture</label>
                                                <input
                                                    type="text"
                                                    value={editingPost.readTime}
                                                    onChange={(e) => handleChange(editingPost.id, 'readTime', e.target.value)}
                                                    placeholder="5 min de lecture"
                                                    className="w-full px-4 py-3 bg-white border border-[#634832]/20 rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[#634832]">Date</label>
                                                <input
                                                    type="text"
                                                    value={editingPost.date}
                                                    onChange={(e) => handleChange(editingPost.id, 'date', e.target.value)}
                                                    placeholder="Décembre 2025"
                                                    className="w-full px-4 py-3 bg-white border border-[#634832]/20 rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-[#634832]">Biographie de l'auteur</label>
                                            <textarea
                                                value={editingPost.authorBio}
                                                onChange={(e) => handleChange(editingPost.id, 'authorBio', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white border border-[#634832]/20 rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-transparent resize-none"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-[#FAF7F2] rounded-xl">
                                            <input
                                                type="checkbox"
                                                id="featured-modal"
                                                checked={editingPost.featured}
                                                onChange={(e) => handleChange(editingPost.id, 'featured', e.target.checked)}
                                                className="w-5 h-5 rounded border-[#634832]/20 text-[#D4A373] focus:ring-2 focus:ring-[#D4A373]"
                                            />
                                            <label htmlFor="featured-modal" className="text-sm font-medium text-[#634832]">
                                                ⭐ Mettre en vedette sur la page d'accueil
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-3 text-[#634832]">Tags</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {editingPost.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-[#D4A373]/10 text-[#634832] rounded-full text-sm font-medium"
                                                    >
                                                        {tag}
                                                        <button
                                                            onClick={() => removeTag(editingPost.id, idx)}
                                                            className="ml-1 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addTag(editingPost.id)}
                                                    placeholder="Nouveau tag..."
                                                    className="flex-1 px-4 py-3 bg-white border border-[#634832]/20 rounded-xl focus:ring-2 focus:ring-[#D4A373] focus:border-transparent"
                                                />
                                                <button
                                                    onClick={() => addTag(editingPost.id)}
                                                    className="px-6 py-3 bg-[#D4A373]/10 hover:bg-[#D4A373]/20 text-[#D4A373] rounded-xl font-medium transition-colors"
                                                >
                                                    Ajouter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end pt-6 border-t border-[#634832]/10">
                                    <button
                                        onClick={closeEditModal}
                                        className="px-8 py-3 bg-[#FAF7F2] hover:bg-[#D4A373]/10 text-[#634832] rounded-xl font-medium transition-colors"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}