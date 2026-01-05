import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import { useTranslation } from 'react-i18next';

interface BlogProps {
    content?: {
        pageHeaders?: {
            blog?: {
                badge?: string;
                title?: string;
                subtitle?: string;
            };
        };
    };
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1659944984855-776187144baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW9iYWIlMjB0cmVlcyUyME1hZGFnYXNjYXIlMjBzdW5zZXR8ZW58MXx8fHwxNzY0NTkxODc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function Blogs({ content = {} }: BlogProps) {
    const { t } = useTranslation();
    const [posts, setPosts] = useState<any[]>([]);
    const [_loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [_remoteContent, setRemoteContent] = useState<any>(content);
    const [heroImageLoaded, setHeroImageLoaded] = useState(false);

    // Préchargement de l'image hero
    useEffect(() => {
        if (HERO_IMAGE) {
            const img = new Image();
            img.onload = () => setHeroImageLoaded(true);
            img.onerror = () => setHeroImageLoaded(true);
            img.src = HERO_IMAGE;
        } else {
            setHeroImageLoaded(true);
        }
    }, []);

    // Traduire automatiquement les posts de blog
    const { translatedContent: translatedPosts, isLoading: isTranslatingPosts } = useTranslatedContent(
        posts,
        ['title', 'excerpt', 'content', 'author']
    );

    // Traduire automatiquement les headers de la section
    const { translatedContent: translatedBlogHeader } = useTranslatedContent(
        content?.pageHeaders?.blog ?? null,
        ['badge', 'title', 'subtitle']
    );

    const displayPosts = (translatedPosts || posts) as any[];
    const header = (translatedBlogHeader as { badge?: string; title?: string; subtitle?: string } | null)
        || content?.pageHeaders?.blog
        || {};

    useEffect(() => {
        const load = async () => {
            const cachedPosts = localStorage.getItem('blog_posts_cache');
            const cachedSettings = localStorage.getItem('blog_settings_cache');

            if (cachedPosts) setPosts(JSON.parse(cachedPosts));
            if (cachedSettings) setRemoteContent(JSON.parse(cachedSettings));

            try {
                const postsSnap = await getDocs(collection(db, 'blogPosts'));
                const freshPosts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setPosts(freshPosts);
                localStorage.setItem('blog_posts_cache', JSON.stringify(freshPosts));

                const settingsSnap = await getDoc(doc(db, 'settings', 'blogPage'));
                if (settingsSnap.exists()) {
                    const freshContent = settingsSnap.data();
                    setRemoteContent(freshContent);
                    localStorage.setItem('blog_settings_cache', JSON.stringify(freshContent));
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Scroll to top when opening or closing a post
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [selectedPost]);

    const featuredPost = displayPosts[0];

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen font-sans">
            <AnimatePresence mode="wait">
                {!selectedPost ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Hero Section avec Background Image */}
                        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
                            <motion.div
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="absolute inset-0 overflow-hidden"
                            >
                                {HERO_IMAGE ? (
                                    <>
                                        <img
                                            src={HERO_IMAGE}
                                            alt="Madagascar Blog"
                                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                                                heroImageLoaded ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            loading="eager"
                                            fetchPriority="high"
                                        />
                                        {!heroImageLoaded && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#4B3935] to-[#3d2f2b]" />
                                        )}
                                    </>
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4B3935] to-[#3d2f2b]" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
                            </motion.div>

                            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="mb-4"
                                >
                                    <span className="inline-block px-5 py-1.5 bg-[#D4A574] text-white rounded-full text-xs md:text-sm font-bold tracking-wider">
                                        {header.badge || t('sections.blogs')}
                                    </span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-black text-white mb-4 tracking-tight"
                                >
                                    {header.title || t('sections.blogs')}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="text-sm md:text-base lg:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed"
                                >
                                    {header.subtitle || t('sections.blogsSubtitle')}
                                </motion.p>
                                
                                {/* Indicateur de chargement de traduction */}
                                {isTranslatingPosts && (
                                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/80">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{t('common.loading')}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section Articles avec thème mocha & vanilla */}
                        <section className="py-20 sm:py-24 md:py-32 bg-[#F0E7D5]">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                                {featuredPost && (
                                    <motion.section
                                        initial={{ y: 40, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setSelectedPost(featuredPost); }}
                                        className="group cursor-pointer bg-white dark:bg-[#443C34] rounded-[40px] mb-20 border-4 border-[#443C34] hover:shadow-2xl transition-all duration-500 overflow-hidden hover:border-[#D4A574]"
                                    >
                                        <div className="grid md:grid-cols-2 items-stretch">
                                            <div className="p-8 md:p-12 space-y-8 flex flex-col justify-center bg-gradient-to-br from-white to-[#F8F5F0] dark:from-[#443C34] dark:to-[#332C26]">
                                                <div className="space-y-4">
                                                    <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-[#443C34] dark:text-white leading-[1.15] group-hover:text-[#8B7355] dark:group-hover:text-[#D4A574] transition-colors">
                                                        {featuredPost.title}
                                                    </h2>
                                                    <p className="text-gray-500 dark:text-gray-300 leading-relaxed text-base md:text-lg line-clamp-3">
                                                        {featuredPost.excerpt}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-[#D4A574] dark:bg-[#8B7355]" />
                                                    <div className="text-sm font-bold text-[#443C34] dark:text-gray-200">
                                                        {featuredPost.author} <span className="text-[#8B7355] dark:text-[#D4A574] mx-2">,</span> {featuredPost.date}
                                                    </div>
                                                </div>
                                                <button className="flex items-center gap-3 pl-6 pr-2 py-2 rounded-full border-2 border-[#D4A574] text-[#443C34] dark:text-white font-bold text-sm bg-white dark:bg-[#332C26] hover:bg-[#F0E7D5] dark:hover:bg-[#8B7355] transition-all group-hover:border-[#8B7355] w-fit shadow-md">
                                                    Read Full Article
                                                    <div className="w-10 h-10 rounded-full bg-[#F0E7D5] dark:bg-[#8B7355] flex items-center justify-center group-hover:bg-[#443C34] dark:group-hover:bg-[#D4A574] group-hover:text-white transition-colors">
                                                        <ArrowRight size={16} />
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="relative h-full min-h-[400px]">
                                                <img src={featuredPost.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={featuredPost.title} />
                                                <div className="absolute top-0 right-10 bg-[#D4A574] dark:bg-[#8B7355] rounded-b-[24px] w-24 h-24 flex items-center justify-center z-10 shadow-lg">
                                                    <span className="text-5xl font-bold text-white translate-y-2">
                                                        {featuredPost.date ? featuredPost.date.split(' ')[0] : '10'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.section>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {displayPosts.slice(1).map((post, idx) => (
                                        <motion.article
                                            key={post.id}
                                            initial={{ y: 40, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 * idx }}
                                            onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setSelectedPost(post); }}
                                            className="group cursor-pointer bg-white dark:bg-[#443C34] rounded-[32px] p-4 flex flex-col gap-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#D4A574] shadow-md overflow-hidden"
                                        >
                                            <div className="aspect-[4/3] rounded-[24px] overflow-hidden">
                                                <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={post.title} />
                                            </div>
                                            <div className="px-2 flex flex-col flex-1 bg-gradient-to-b from-transparent to-[#F8F5F0] dark:to-[#332C26] rounded-2xl p-4">
                                                <h3 className="text-lg md:text-xl font-bold text-[#443C34] dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-[#8B7355] dark:group-hover:text-[#D4A574] transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6">
                                                    {post.excerpt}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-[#D4A574]/30">
                                                    <span className="text-xs font-bold text-[#8B7355] dark:text-[#D4A574]">{post.author}</span>
                                                    <div className="w-8 h-8 rounded-full bg-[#F0E7D5] dark:bg-[#8B7355] flex items-center justify-center group-hover:bg-[#443C34] dark:group-hover:bg-[#D4A574] group-hover:text-white transition-all shadow-sm">
                                                        <ArrowRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </motion.div>
                ) : (
                    /* DÉTAIL DE L'ARTICLE */
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[1400px] mx-auto px-6 pt-32 pb-20"
                    >
                        <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setSelectedPost(null); }} className="group mb-12 flex items-center gap-3 px-6 py-3 rounded-full border-2 border-[#443C34] text-[#443C34] dark:text-white hover:bg-[#443C34] hover:text-white dark:hover:bg-[#D4A574] dark:hover:border-[#D4A574] transition-all shadow-md">
                            <ArrowLeft size={18} />
                            <span className="font-bold text-sm uppercase">Back to Blog</span>
                        </button>
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-[#443C34] dark:text-white mb-8 text-center">{selectedPost.title}</h1>
                            <img src={selectedPost.image} className="w-full h-[500px] object-cover rounded-[48px] mb-12 shadow-2xl border-4 border-[#D4A574]" alt="" />
                            <div className="prose prose-xl dark:prose-invert mx-auto bg-white dark:bg-[#443C34] p-8 md:p-12 rounded-[32px] shadow-xl" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}