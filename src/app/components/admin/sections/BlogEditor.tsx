import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Eye, Calendar, User, Tag, X } from 'lucide-react';
import { db } from '../../../../firebase/config'; // ← ajuste le chemin selon ta structure
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

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
    const [editingId, setEditingId] = useState<number | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Chargement des articles depuis Firestore au montage
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsCollection = collection(db, 'blogPosts');
                const snapshot = await getDocs(postsCollection);
                const fetchedPosts: BlogPost[] = snapshot.docs.map((docSnap) => ({
                    id: parseInt(docSnap.id),
                    ...docSnap.data() as Omit<BlogPost, 'id'>
                }));

                // Tri par ID pour un ordre stable
                fetchedPosts.sort((a, b) => a.id - b.id);

                setPosts(fetchedPosts.length > 0 ? fetchedPosts : initialPosts);
            } catch (err) {
                console.error('Erreur chargement articles blog:', err);
                alert('Impossible de charger les articles depuis Firebase.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [initialPosts]);

    const handleChange = (id: number, field: keyof BlogPost, value: any) => {
        setPosts(posts.map(post =>
            post.id === id ? { ...post, [field]: value } : post
        ));
        setHasChanges(true);
    };

    const handleAddPost = () => {
        const newId = Math.max(...posts.map(p => p.id), 0) + 1;
        const newPost: BlogPost = {
            id: newId,
            title: 'Nouvel Article de Blog',
            slug: 'nouvel-article',
            excerpt: 'Court résumé de l’article...',
            content: 'Contenu complet de l’article ici...',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
            author: 'Auteur Nom',
            authorAvatar: `https://ui-avatars.com/api/?name=Auteur+Nom&background=6D4C41&color=fff`,
            authorBio: 'Biographie de l’auteur...',
            date: new Date().toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' }),
            category: 'Voyage',
            readTime: '8 min de lecture',
            tags: ['madagascar', 'aventure'],
            featured: false,
            views: 0,
        };
        setPosts([...posts, newPost]);
        setEditingId(newId);
        setHasChanges(true);
    };

    const handleDeletePost = async (id: number) => {
        if (confirm('Supprimer définitivement cet article ? Cette action est irréversible.')) {
            try {
                // Suppression dans Firestore
                await deleteDoc(doc(db, 'blogPosts', id.toString()));

                // Suppression locale
                setPosts(posts.filter(p => p.id !== id));
                setHasChanges(true);
            } catch (err) {
                console.error('Erreur suppression article:', err);
                alert('Erreur lors de la suppression – vérifiez la console.');
            }
        }
    };

    const addTag = (postId: number) => {
        if (newTag.trim()) {
            setPosts(posts.map(post =>
                post.id === postId
                    ? { ...post, tags: [...post.tags, newTag.trim()] }
                    : post
            ));
            setNewTag('');
            setHasChanges(true);
        }
    };

    const removeTag = (postId: number, tagIndex: number) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, tags: post.tags.filter((_, i) => i !== tagIndex) }
                : post
        ));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            // Sauvegarde de chaque article dans Firestore
            for (const post of posts) {
                const postDoc = doc(db, 'blogPosts', post.id.toString());
                await setDoc(postDoc, post);
            }

            onSave(posts);
            setHasChanges(false);
            alert('✅ Articles de blog sauvegardés dans Firestore !');
        } catch (err) {
            console.error('Erreur sauvegarde blog:', err);
            alert('Erreur lors de la sauvegarde – vérifiez la console.');
        }
    };

    const generateAuthorAvatar = (name: string) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6D4C41&color=fff`;
    };

    if (isLoading) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Chargement des articles de blog depuis Firebase...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Articles de Blog</h2>
                    <p className="text-muted-foreground">Gérez vos articles et publications</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
                            Non sauvegardé
                        </span>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddPost}
                        className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium transition-colors"
                    >
                        <Plus size={18} />
                        Nouvel Article
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                        className="bg-muted/30 rounded-xl border border-border overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-foreground text-lg">{post.title}</h3>
                                        {post.featured && (
                                            <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-medium rounded">
                                                En vedette
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} /> {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User size={14} /> {post.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye size={14} /> {post.views} vues
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Tag size={14} /> {post.tags.length} tag{post.tags.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingId(editingId === post.id ? null : post.id)}
                                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                                >
                                    {editingId === post.id ? 'Fermer' : 'Modifier'}
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} className="text-destructive" />
                                </button>
                            </div>
                        </div>

                        {/* Formulaire d'édition */}
                        <AnimatePresence>
                            {editingId === post.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Titre */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">Titre de l'article</label>
                                                <input
                                                    type="text"
                                                    value={post.title}
                                                    onChange={(e) => handleChange(post.id, 'title', e.target.value)}
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Slug */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">Slug (URL)</label>
                                                <input
                                                    type="text"
                                                    value={post.slug}
                                                    onChange={(e) => handleChange(post.id, 'slug', e.target.value)}
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Image */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">Image principale (URL)</label>
                                                <input
                                                    type="text"
                                                    value={post.image}
                                                    onChange={(e) => handleChange(post.id, 'image', e.target.value)}
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Extrait */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">Extrait (meta description)</label>
                                                <textarea
                                                    value={post.excerpt}
                                                    onChange={(e) => handleChange(post.id, 'excerpt', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                                                />
                                            </div>

                                            {/* Contenu complet */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">Contenu complet de l'article</label>
                                                <textarea
                                                    value={post.content}
                                                    onChange={(e) => handleChange(post.id, 'content', e.target.value)}
                                                    rows={10}
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                                                />
                                            </div>

                                            {/* Auteur */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Auteur</label>
                                                <input
                                                    type="text"
                                                    value={post.author}
                                                    onChange={(e) => {
                                                        handleChange(post.id, 'author', e.target.value);
                                                        handleChange(post.id, 'authorAvatar', generateAuthorAvatar(e.target.value));
                                                    }}
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Bio auteur */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Biographie de l'auteur</label>
                                                <textarea
                                                    value={post.authorBio}
                                                    onChange={(e) => handleChange(post.id, 'authorBio', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary resize-none"
                                                />
                                            </div>

                                            {/* Catégorie */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Catégorie</label>
                                                <input
                                                    type="text"
                                                    value={post.category}
                                                    onChange={(e) => handleChange(post.id, 'category', e.target.value)}
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Temps de lecture */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Temps de lecture</label>
                                                <input
                                                    type="text"
                                                    value={post.readTime}
                                                    onChange={(e) => handleChange(post.id, 'readTime', e.target.value)}
                                                    placeholder="8 min de lecture"
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* Date */}
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Date de publication</label>
                                                <input
                                                    type="text"
                                                    value={post.date}
                                                    onChange={(e) => handleChange(post.id, 'date', e.target.value)}
                                                    placeholder="Décembre 2025"
                                                    className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary"
                                                />
                                            </div>

                                            {/* En vedette */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`featured-${post.id}`}
                                                    checked={post.featured}
                                                    onChange={(e) => handleChange(post.id, 'featured', e.target.checked)}
                                                    className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                                                />
                                                <label htmlFor={`featured-${post.id}`} className="text-sm font-medium text-foreground">
                                                    Article en vedette
                                                </label>
                                            </div>

                                            {/* Tags */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium mb-2">Tags</label>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {post.tags.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm font-medium"
                                                        >
                                                            <Tag size={12} />
                                                            {tag}
                                                            <button
                                                                onClick={() => removeTag(post.id, idx)}
                                                                className="ml-1 hover:text-destructive"
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
                                                        onKeyPress={(e) => e.key === 'Enter' && addTag(post.id)}
                                                        placeholder="Nouveau tag..."
                                                        className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                    <button
                                                        onClick={() => addTag(post.id)}
                                                        className="px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium"
                                                    >
                                                        Ajouter
                                                    </button>
                                                </div>
                                            </div>
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
}