import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Loader2, Calendar, Bookmark } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

interface BlogProps {
    content?: any;
    isDetail?: boolean;
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1659944984855-776187144baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW9iYWIlMjB0cmVlcyUyME1hZGFnYXNjYXIlMjBzdW5zZXR8ZW58MXx8fHwxNzY0NTkxODc5fDA&ixlib=rb-4.1.0&q=80&w=1080";

export function Blogs({ content = {}, isDetail = false }: BlogProps) {
    const { t } = useTranslation();
    const { slug, lang } = useParams();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [remoteContent, setRemoteContent] = useState<any>(content);
    const [heroImageLoaded, setHeroImageLoaded] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const postsSnap = await getDocs(collection(db, 'blogPosts'));
                const freshPosts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setPosts(freshPosts);
                const settingsSnap = await getDoc(doc(db, 'settings', 'blogPage'));
                if (settingsSnap.exists()) setRemoteContent(settingsSnap.data());
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (posts.length > 0) {
            if (isDetail && slug) {
                const found = posts.find(p => p.slug === slug || p.id === slug);
                setSelectedPost(found || null);
            } else {
                setSelectedPost(null);
            }
        }
    }, [slug, posts, isDetail]);

    const openPost = (post: any) => {
        const target = post.slug || post.id;
        navigate(`/${lang}/blog/${target}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        navigate(`/${lang}/blog`);
    };

    // --- RE-VÉRIFICATION DE LA TRADUCTION ---
    const { translatedContent: translatedPosts, isLoading: isTranslatingPosts } = useTranslatedContent(
        posts,
        ['title', 'excerpt', 'content', 'author']
    );

    const { translatedContent: translatedBlogHeader } = useTranslatedContent(
        remoteContent?.pageHeaders?.blog ?? content?.pageHeaders?.blog ?? null,
        ['badge', 'title', 'subtitle']
    );

    const displayPosts = (translatedPosts || posts) as any[];
    const header = (translatedBlogHeader as any) || remoteContent?.pageHeaders?.blog || content?.pageHeaders?.blog || {};
    // ----------------------------------------

    if (loading && posts.length === 0) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#D4A574]" /></div>;

    const featuredPost = displayPosts[0];

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen font-sans">
            <AnimatePresence mode="wait">
                {!selectedPost ? (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {/* HERO D'ORIGINE */}
                        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0">
                                <img src={HERO_IMAGE} className="w-full h-full object-cover" alt="Hero" onLoad={() => setHeroImageLoaded(true)} />
                                <div className="absolute inset-0 bg-black/50" />
                            </div>
                            <div className="relative z-10 text-center px-4">
                                <span className="inline-block px-5 py-1.5 bg-[#D4A574] text-white rounded-full text-sm font-bold mb-4">{header.badge || t('sections.blogs')}</span>
                                <h1 className="text-4xl md:text-7xl font-black text-white mb-4">{header.title || t('sections.blogs')}</h1>
                                {isTranslatingPosts && <div className="flex items-center justify-center gap-2 text-white/80 text-sm"><Loader2 className="w-4 h-4 animate-spin" /><span>Translating...</span></div>}
                            </div>
                        </section>

                        <section className="py-20 bg-[#F0E7D5] dark:bg-gray-900">
                            <div className="max-w-7xl mx-auto px-4">
                                {/* FEATURED POST D'ORIGINE */}
                                {featuredPost && (
                                    <div onClick={() => openPost(featuredPost)} className="group cursor-pointer bg-white dark:bg-[#443C34] rounded-[40px] mb-20 border-4 border-[#443C34] overflow-hidden hover:border-[#D4A574] transition-all shadow-xl">
                                        <div className="grid md:grid-cols-2">
                                            <div className="p-12 flex flex-col justify-center gap-6">
                                                <h2 className="text-3xl md:text-5xl font-bold dark:text-white group-hover:text-[#D4A574] transition-colors">{featuredPost.title}</h2>
                                                <p className="text-gray-500 dark:text-gray-300 line-clamp-3">{featuredPost.excerpt}</p>
                                                <button className="flex items-center gap-3 px-6 py-2 bg-[#443C34] text-white rounded-full w-fit">Read More <ArrowRight size={18} /></button>
                                            </div>
                                            <img src={featuredPost.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Featured" />
                                        </div>
                                    </div>
                                )}

                                {/* GRILLE AVEC CARD AMÉLIORÉE */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    {displayPosts.slice(1).map((post, idx) => (
                                        <article
                                            key={post.id}
                                            onClick={() => openPost(post)}
                                            className="group cursor-pointer bg-white dark:bg-gray-800 rounded-[2.5rem] p-3 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                                        >
                                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden">
                                                <img src={post.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={post.title} />
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full">
                                                    <span className="text-[10px] font-black text-[#443C34] uppercase tracking-tighter">{post.category || 'Expedition'}</span>
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="flex items-center gap-1.5 text-[#D4A574] text-xs font-bold"><Calendar size={14} /><span>{post.date || '2024'}</span></div>
                                                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium"><Clock size={14} /><span>5 min read</span></div>
                                                </div>
                                                <h3 className="text-xl lg:text-2xl font-bold text-[#443C34] dark:text-white mb-3 line-clamp-2 group-hover:text-[#D4A574] transition-colors">{post.title}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6">{post.excerpt}</p>
                                                <div className="mt-auto pt-5 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                                    <span className="text-xs font-bold text-[#443C34] dark:text-gray-300 italic">{post.author}</span>
                                                    <div className="w-10 h-10 rounded-full bg-[#443C34] text-white flex items-center justify-center transform group-hover:scale-110 group-hover:bg-[#D4A574] transition-all duration-300 shadow-md">
                                                        <ArrowRight size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    /* DÉTAIL D'ORIGINE TRADUIT */
                    <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-32 pb-20 px-6">
                        <div className="max-w-4xl mx-auto">
                            <button onClick={handleBack} className="flex items-center gap-2 mb-8 font-bold text-[#443C34] dark:text-white hover:text-[#D4A574] transition-colors group">
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> BACK TO BLOG
                            </button>
                            <h1 className="text-4xl md:text-6xl font-black text-[#443C34] dark:text-white mb-8 text-center">{(translatedPosts?.find((p: any) => p.id === selectedPost.id)?.title) || selectedPost.title}</h1>
                            <img src={selectedPost.image} className="w-full h-[400px] object-cover rounded-[40px] mb-12 shadow-2xl border-4 border-[#D4A574]" alt="Detail" />
                            <div className="bg-white dark:bg-[#443C34] p-8 md:p-12 rounded-[32px] shadow-xl">
                                {((translatedPosts?.find((p: any) => p.id === selectedPost.id)?.content) || selectedPost.content)?.split('\n\n').map((paragraph: string, i: number) => (
                                    <p key={i} className="text-lg leading-relaxed mb-6 text-gray-700 dark:text-gray-200">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}