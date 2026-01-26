import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Loader2, Calendar, Eye, Share2, Facebook, Twitter, Linkedin, Link2, Check, ChevronLeft, ChevronRight, Search, ChevronDown } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

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
    isDetail?: boolean;
}

const HERO_IMAGE = "https://images.unsplash.com/photo-1659944984855-776187144baf?w=1600&q=80";
const CACHE_VERSION = '2.0';
const CACHE_KEY = `blog_posts_cache_v${CACHE_VERSION}`;

// ============================================
// COMPOSANT : PARTAGE PREMIUM
// ============================================
const SocialShare = ({ post }: any) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const title = post.title;

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (platform: keyof typeof shareLinks) => {
        window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white border border-[#4B3935]/10"
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Share2 size={18} className="text-[#4B3935]" />
                    <span className="text-xs font-light text-[#4B3935] uppercase tracking-[0.25em]">
                        {t('blog.partager')}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare('facebook')}
                        className="w-10 h-10 bg-[#4B3935] hover:bg-[#3d2f2b] text-white flex items-center justify-center transition-all"
                        aria-label="Facebook"
                    >
                        <Facebook size={16} fill="white" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare('twitter')}
                        className="w-10 h-10 bg-[#4B3935] hover:bg-[#3d2f2b] text-white flex items-center justify-center transition-all"
                        aria-label="Twitter"
                    >
                        <Twitter size={16} fill="white" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShare('linkedin')}
                        className="w-10 h-10 bg-[#4B3935] hover:bg-[#3d2f2b] text-white flex items-center justify-center transition-all"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={16} fill="white" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className={`w-10 h-10 ${copied ? 'bg-green-600' : 'bg-[#4B3935] hover:bg-[#3d2f2b]'} text-white flex items-center justify-center transition-all`}
                        aria-label="Copy"
                    >
                        {copied ? <Check size={16} /> : <Link2 size={16} />}
                    </motion.button>
                </div>
            </div>

            {copied && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 text-xs font-light text-green-600 uppercase tracking-[0.2em]"
                >
                    {t('blog.liencopie')}
                </motion.p>
            )}
        </motion.div>
    );
};

// ============================================
// COMPOSANT : NAVIGATION PREMIUM
// ============================================
const BlogNavigation = ({ posts, currentPost, onNavigate }: any) => {
    const currentIndex = posts.findIndex((p: any) => p.id === currentPost.id);
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    const NavCard = ({ post, direction, onClick }: any) => (
        <motion.button
            whileHover={{ y: -4 }}
            onClick={() => onClick(post)}
            className={`group flex-1 p-8 bg-white border border-[#4B3935]/10 hover:border-[#4B3935]/30 transition-all cursor-pointer ${direction === 'prev' ? 'text-left' : 'text-right'
                }`}
        >
            <div className={`flex items-center gap-2 mb-4 ${direction === 'next' ? 'flex-row-reverse' : ''}`}>
                {direction === 'prev' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                <span className="text-[10px] font-light text-[#4B3935]/60 uppercase tracking-[0.3em]">
                    {direction === 'prev' ? 'Previous' : 'Next'}
                </span>
            </div>

            <h3 className="text-xl font-light text-[#4B3935] line-clamp-2 mb-3 group-hover:text-[#8B7355] transition-colors">
                {post.title}
            </h3>

            {post.excerpt && (
                <p className="text-sm text-[#4B3935]/60 font-light line-clamp-2">
                    {post.excerpt}
                </p>
            )}
        </motion.button>
    );

    if (!prevPost && !nextPost) return null;

    return (
        <div className="grid md:grid-cols-2 gap-4 mt-16">
            {prevPost && <NavCard post={prevPost} direction="prev" onClick={onNavigate} />}
            {!prevPost && <div className="hidden md:block" />}
            {nextPost && <NavCard post={nextPost} direction="next" onClick={onNavigate} />}
        </div>
    );
};

export function Blogs({ content = {}, isDetail = false }: BlogProps) {
    const { t } = useTranslation();
    const { slug, lang } = useParams();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<any[]>([]);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [heroImageLoaded, setHeroImageLoaded] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tous");

    useEffect(() => {
        if (HERO_IMAGE) {
            const img = new Image();
            img.onload = () => setHeroImageLoaded(true);
            img.onerror = () => setHeroImageLoaded(true);
            img.src = HERO_IMAGE;
            const timeout = setTimeout(() => setHeroImageLoaded(true), 100);
            return () => clearTimeout(timeout);
        } else {
            setHeroImageLoaded(true);
        }
    }, []);

    const { translatedContent: translatedPosts, isLoading: isTranslatingPosts } = useTranslatedContent(
        posts,
        ['title', 'excerpt', 'content', 'author', 'category']
    );

    const { translatedContent: translatedBlogHeader } = useTranslatedContent(
        content?.pageHeaders?.blog ?? null,
        ['badge', 'title', 'subtitle']
    );

    const displayPosts = (translatedPosts || posts) as any[];
    const header = (translatedBlogHeader as { badge?: string; title?: string; subtitle?: string } | null)
        || content?.pageHeaders?.blog
        || {};

    useEffect(() => {
        if (posts.length > 0) {
            posts.forEach((post) => {
                if (post.image) {
                    const img = new Image();
                    img.onload = () => setImagesLoaded(prev => ({ ...prev, [post.id]: true }));
                    img.onerror = () => setImagesLoaded(prev => ({ ...prev, [post.id]: true }));
                    img.src = post.image;
                }
            });
        }
    }, [posts]);

    useEffect(() => {
        const loadPosts = async () => {
            setIsLoadingPosts(true);
            try {
                const cachedPosts = localStorage.getItem(CACHE_KEY);
                if (cachedPosts) {
                    const parsedCache = JSON.parse(cachedPosts);
                    setPosts(parsedCache);
                    setIsLoadingPosts(false);
                }

                const postsSnap = await getDocs(collection(db, 'blogPosts'));
                const freshPosts = postsSnap.docs.map(d => {
                    const data = d.data();
                    return { id: d.id, ...data, slug: data.slug || d.id };
                });

                freshPosts.sort((a: any, b: any) => {
                    const idA = parseInt(a.id) || 0;
                    const idB = parseInt(b.id) || 0;
                    return idA - idB;
                });

                setPosts(freshPosts);
                localStorage.setItem(CACHE_KEY, JSON.stringify(freshPosts));
                setIsLoadingPosts(false);

                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('blog_posts_cache') && key !== CACHE_KEY) {
                        localStorage.removeItem(key);
                    }
                });

            } catch (error) {
                console.error("❌ Erreur lors du chargement des posts:", error);
                setIsLoadingPosts(false);
            }
        };

        loadPosts();
    }, []);

    // Gestion de la sélection du post en mode détail
    useEffect(() => {
        if (posts.length > 0 && isDetail && slug) {
            const found = posts.find(p => p.slug === slug) || posts.find(p => p.id === slug);

            if (found) {
                setSelectedPost(found);
            } else {
                setSelectedPost(null);
            }
        } else if (!isDetail) {
            setSelectedPost(null);
        }
    }, [slug, posts, isDetail]);

    // Scroll to top when opening or closing a post
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [selectedPost]);

    // Ouvrir un post via navigation
    const openPost = (post: any) => {
        const target = post.slug || post.id;
        navigate(`/${lang}/blog/${target}`);
    };

    // Retour à la liste
    const handleBack = () => {
        navigate(`/${lang}/blog`);
    };

    const featuredPost = displayPosts[0];

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen font-sans">
            <AnimatePresence mode="wait">
                {!selectedPost ? (
                    <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {/* Hero Minimaliste Premium */}
                        <section className="relative h-screen flex items-end overflow-hidden bg-[#0a0806]">
                            <div className="absolute inset-0">
                                {HERO_IMAGE ? (
                                    <img
                                        src={HERO_IMAGE}
                                        alt="Blog"
                                        className={`w-full h-full object-cover transition-opacity duration-500 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        style={{ filter: 'brightness(0.5) contrast(1.1)' }}
                                        loading="eager"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#0a0806]" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/50 to-transparent" />
                            </div>

                            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 pb-40">
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1 }}
                                >
                                    <div className="mb-6">
                                        <span className="text-xs font-light text-[#F0E7D5]/60 uppercase tracking-[0.3em]">
                                            {header.badge || t('sections.blogs')}
                                        </span>
                                        <div className="h-px w-16 bg-[#F0E7D5]/30 mt-3" />
                                    </div>

                                    <h1 className="text-5xl lg:text-8xl xl:text-9xl font-light text-[#F0E7D5] mb-8 leading-[1.05] tracking-tight max-w-5xl">
                                        {header.title || t('sections.blogs')}
                                    </h1>

                                    <p className="text-lg lg:text-xl text-[#F0E7D5]/70 max-w-2xl font-light leading-relaxed">
                                        {header.subtitle || t('sections.blogsSubtitle')}
                                    </p>

                                    {isTranslatingPosts && (
                                        <div className="flex items-center gap-2 mt-6 text-sm text-[#F0E7D5]/60 font-light">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="uppercase tracking-[0.15em] text-xs">{t('common.loading')}</span>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-12 lg:translate-x-0 flex flex-col items-center lg:items-start gap-4"
                            >
                                <span className="text-[#F0E7D5]/40 text-[10px] font-light uppercase tracking-[0.3em] lg:-rotate-90">
                                    Scroll
                                </span>
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-px h-12 bg-gradient-to-b from-[#F0E7D5]/60 to-transparent"
                                />
                            </motion.div>
                        </section>

                        {/* Section Articles */}
                        <section className="py-20 sm:py-24 md:py-32 bg-[#F0E7D5]">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                                {isLoadingPosts ? (
                                    // Afficher un loader pendant le chargement
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="w-12 h-12 animate-spin text-[#8B7355]" />
                                        <p className="text-lg text-gray-600 dark:text-gray-400">
                                            {t('blog.loading') || 'Chargement des articles...'}
                                        </p>
                                    </div>
                                ) :
                                displayPosts.length === 0 ? (
                                    <div className="text-center py-20">
                                        <p className="text-xl text-gray-600 dark:text-gray-400">
                                            {t('blog.noPosts') || 'Aucun article disponible'}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Article Featured */}
                                        {featuredPost && (
                                            <motion.section
                                                initial={{ y: 40, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                onClick={() => openPost(featuredPost)}
                                                className="group cursor-pointer bg-white dark:bg-[#443C34] rounded-[40px] mb-20 border-4 border-[#443C34] hover:shadow-2xl transition-all duration-500 overflow-hidden hover:border-[#D4A574]"
                                            >
                                                <div className="grid md:grid-cols-2 items-stretch">
                                                    <div className="p-8 md:p-12 space-y-8 flex flex-col justify-center bg-gradient-to-br from-white to-[#F8F5F0] dark:from-[#443C34] dark:to-[#332C26]">
                                                        <div className="space-y-4">
                                                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#443C34] dark:text-white leading-[1.15] group-hover:text-[#8B7355] dark:group-hover:text-[#D4A574] transition-colors">
                                                                {featuredPost.title}
                                                            </h2>
                                                            <p className="text-gray-500 dark:text-gray-300 leading-relaxed text-base md:text-lg line-clamp-3">
                                                                {featuredPost.excerpt}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8B7355] to-[#D4A574] flex items-center justify-center text-white font-bold">
                                                                {featuredPost.author?.charAt(0) || 'A'}
                                                            </div>
                                                            <div className="text-sm font-bold text-[#443C34] dark:text-gray-200">
                                                                {featuredPost.author} <span className="text-[#8B7355] dark:text-[#D4A574] mx-2">•</span> {featuredPost.date}
                                                            </div>
                                                        </div>
                                                            <button className="cursor-pointer flex items-center gap-3 pl-6 pr-2 py-2 rounded-full border-2 border-[#D4A574] text-[#443C34] dark:text-white font-bold text-sm bg-white dark:bg-[#332C26] hover:bg-[#F0E7D5] dark:hover:bg-[#8B7355] transition-all group-hover:border-[#8B7355] w-fit shadow-md">
                                                            {t('blog.readArticle')}
                                                            <div className="w-10 h-10 rounded-full bg-[#F0E7D5] dark:bg-[#8B7355] flex items-center justify-center group-hover:bg-[#443C34] dark:group-hover:bg-[#D4A574] group-hover:text-white transition-colors">
                                                                <ArrowRight size={16} />
                                                            </div>
                                                        </button>
                                                    </div>
                                                    <div className="relative h-full min-h-[400px]">
                                                        {!imagesLoaded[featuredPost.id] && (
                                                            <div 
                                                                className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" 
                                                                style={{ 
                                                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                                                    willChange: 'opacity'
                                                                }}
                                                            />
                                                        )}
                                                        <img
                                                            src={featuredPost.image}
                                                            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${imagesLoaded[featuredPost.id] ? 'opacity-100' : 'opacity-0'
                                                                }`}
                                                            alt={featuredPost.title}
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute top-0 right-10 bg-[#D4A574] dark:bg-[#8B7355] rounded-b-[24px] w-24 h-24 flex items-center justify-center z-10 shadow-lg">
                                                            <span className="text-5xl font-bold text-white translate-y-2">
                                                                {featuredPost.date ? featuredPost.date.split(' ')[0] : '10'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.section>
                                        )}

                                        {/* Grille d'articles */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {displayPosts.slice(1).map((post, idx) => (
                                                <motion.article
                                                    key={post.id}
                                                    initial={{ y: 40, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1 * idx }}
                                                    onClick={() => openPost(post)}
                                                    className="group cursor-pointer bg-white dark:bg-[#443C34] rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-[#D4A574] shadow-lg hover:-translate-y-2"
                                                >
                                                    <div className="relative aspect-[16/10] overflow-hidden">
                                                        {!imagesLoaded[post.id] && (
                                                            <div 
                                                                className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" 
                                                                style={{ 
                                                                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                                                    willChange: 'opacity'
                                                                }}
                                                            />
                                                        )}
                                                        <img
                                                            src={post.image}
                                                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imagesLoaded[post.id] ? 'opacity-100' : 'opacity-0'
                                                                }`}
                                                            alt={post.title}
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                        {post.category && (
                                                            <div className="absolute top-6 right-6 bg-[#F0E7D5]/95 backdrop-blur-sm px-3 py-1.5 border border-[#4B3935]/10">
                                                                <span className="text-[9px] font-light text-[#4B3935] uppercase tracking-[0.25em]">
                                                                    {post.category}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/90 dark:bg-[#443C34]/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-xl">
                                                            <Eye size={20} className="text-[#443C34] dark:text-[#D4A574]" />
                                                        </div>
                                                    </div>

                                                    <div className="p-6 space-y-4">
                                                        <h3 className="text-xl font-bold text-[#443C34] dark:text-white line-clamp-2 leading-tight group-hover:text-[#8B7355] dark:group-hover:text-[#D4A574] transition-colors min-h-[3.5rem]">
                                                            {post.title}
                                                        </h3>

                                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                                                            {post.excerpt}
                                                        </p>

                                                        <div className="h-px bg-gradient-to-r from-transparent via-[#D4A574]/30 to-transparent" />

                                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex items-center gap-1.5 font-medium">
                                                                    <Clock size={14} className="text-[#8B7355] dark:text-[#D4A574]" />
                                                                    {post.readTime || '5 min'} {t('blog.delecture')}
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-gray-400" />
                                                                <span className="flex items-center gap-1.5 font-medium">
                                                                    <Calendar size={14} className="text-[#8B7355] dark:text-[#D4A574]" />
                                                                    {post.date || 'Jan 2024'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t-2 border-[#F0E7D5] dark:border-[#332C26]">
                                                            <div className="flex items-center gap-3">
                                                                {post.authorAvatar ? (
                                                                    <img
                                                                        src={post.authorAvatar}
                                                                        alt={post.author}
                                                                        className="w-10 h-10 rounded-full object-cover border-2 border-[#D4A574]/50"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B7355] to-[#D4A574] flex items-center justify-center text-white text-sm font-bold shadow-md">
                                                                        {post.author?.charAt(0) || 'A'}
                                                                    </div>
                                                                )}
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                                        {t('blog.author')}
                                                                    </span>
                                                                    <span className="text-xs font-bold text-[#443C34] dark:text-white">
                                                                        {post.author}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <motion.div
                                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F0E7D5] to-[#E5D8C0] dark:from-[#8B7355] dark:to-[#6B5535] flex items-center justify-center group-hover:from-[#D4A574] group-hover:to-[#C49564] transition-all shadow-md"
                                                            >
                                                                <ArrowRight size={18} className="text-[#443C34] dark:text-white group-hover:text-white transition-colors" />
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </motion.article>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>
                    </motion.div>
                ) : selectedPost ? (
                    /* DÉTAIL DE L'ARTICLE */
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-screen"
                    >
                        {/* Hero Section avec image en background */}
                        <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-0">
                            <motion.div
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="absolute inset-0 overflow-hidden"
                            >
                                {selectedPost.image && (
                                    <>
                                        <img
                                            src={selectedPost.image}
                                            alt={selectedPost.title}
                                            className="absolute inset-0 w-full h-full object-cover blur-sm"
                                            loading="eager"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
                                    </>
                                )}
                            </motion.div>

                            {/* Bouton Back - Positionné en haut à gauche pour éviter le menu */}
                            <motion.button
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleBack}
                                className="absolute top-26 sm:top-100 left-4 sm:left-6 z-[60] cursor-pointer group inline-flex  gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all shadow-lg text-xs sm:text-sm"
                            >
                                <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="font-bold uppercase hidden sm:inline">{t('common.back')}</span>
                            </motion.button>

                            {/* Contenu du hero */}
                            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-8 sm:pt-12 md:pt-28">

                                {/* <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-6"
                                >
                                    {selectedPost.category && (
                                        <span className="inline-block top px-5 py-2 bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-white rounded-full font-bold text-sm shadow-xl mb-4">
                                            {selectedPost.category}
                                        </span>
                                    )}
                                </motion.div> */}

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl sm:-mt-20 sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight drop-shadow-2xl px-2 sm:px-4"
                                >
                                    {(translatedPosts?.find((p: any) => p.id === selectedPost.id)?.title) || selectedPost.title}
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 text-white/90 text-xs sm:text-sm md:text-base"
                                >
                                    <span className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                                        <Calendar size={14} className="sm:w-[18px] sm:h-[18px]" />
                                        <span className="whitespace-nowrap">{selectedPost.date || new Date().toLocaleDateString()}</span>
                                    </span>
                                    <span className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                                        <Clock size={14} className="sm:w-[18px] sm:h-[18px]" />
                                        <span className="whitespace-nowrap">{selectedPost.readTime || '5 min'} {t('blog.delecture')}</span>
                                    </span>
                                    {selectedPost?.views != null && selectedPost.views > 0 && (
                                        <span className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                                            <Eye size={14} className="sm:w-[18px] sm:h-[18px]" />
                                        <span className="whitespace-nowrap">{selectedPost.views} {t('blog.vues')}</span>
                                        </span>
                                    )}
                                </motion.div>
                            </div>
                        </section>

                        {/* Contenu de l'article */}
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 md:-mt-20 relative z-10 pb-12 sm:pb-16 md:pb-20">
                            <div className="max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
                                {/* Auteur */}
                                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-[#F0E7D5] dark:border-[#332C26] bg-white dark:bg-[#443C34] p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl">
                                    {selectedPost.authorAvatar ? (
                                        <img
                                            src={selectedPost.authorAvatar}
                                            alt={selectedPost.author}
                                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-2 sm:border-3 border-[#D4A574] shadow-lg flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#8B7355] to-[#D4A574] flex items-center justify-center text-white text-base sm:text-lg md:text-xl font-bold shadow-lg flex-shrink-0">
                                            {selectedPost.author?.charAt(0) || 'A'}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                            {t('blog.author') || 'Auteur de l\'article'}
                                        </p>
                                        <p className="font-black text-[#443C34] dark:text-white text-base sm:text-lg md:text-xl truncate">
                                            {selectedPost.author || 'Auteur'}
                                        </p>
                                        
                                    </div>
                                </div>

                            {/* Excerpt si disponible */}
                            {selectedPost.excerpt && (
                                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-[#F0E7D5] to-[#E5D8C0] dark:from-[#443C34] dark:to-[#332C26] rounded-xl sm:rounded-2xl border-l-4 border-[#D4A574]">
                                    <p className="text-base sm:text-lg md:text-xl text-[#443C34] dark:text-white font-semibold italic leading-relaxed">
                                        {selectedPost.excerpt}
                                    </p>
                                </div>
                            )}

                            {/* Contenu */}
                            <div className="bg-white dark:bg-[#443C34] p-4 sm:p-6 md:p-10 lg:p-12 rounded-xl sm:rounded-2xl md:rounded-[32px] shadow-xl mb-6 sm:mb-8">
                                {((translatedPosts?.find((p: any) => p.id === selectedPost.id)?.content) || selectedPost.content || '').split('\n\n').map((paragraph: string, index: number) => (
                                    <p
                                        key={index}
                                        className={`text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-200 mb-4 sm:mb-6 leading-relaxed text-justify ${index === 0 ? 'first-letter:text-4xl sm:first-letter:text-5xl md:first-letter:text-6xl lg:first-letter:text-7xl first-letter:font-bold first-letter:text-[#D4A574] first-letter:mr-2 sm:first-letter:mr-3 first-letter:float-left first-letter:leading-none' : ''}`}
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Tags si disponibles */}
                            {selectedPost.tags && selectedPost.tags.length > 0 && (
                                <div className="mb-6 sm:mb-8 flex flex-wrap gap-2">
                                    <span className="text-xs sm:text-sm font-bold text-[#443C34] dark:text-white mr-2">{t('blog.tags')}</span>
                                    {selectedPost.tags.map((tag: string, idx: number) => (
                                        <span
                                            key={idx}
                                            className="px-3 sm:px-4 py-1 sm:py-1.5 bg-[#F0E7D5] dark:bg-[#332C26] text-[#8B7355] dark:text-[#D4A574] rounded-full text-xs font-semibold border border-[#D4A574]/30"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* NOUVEAU : Partage sur les réseaux sociaux */}
                            <div className="mb-6 sm:mb-8">
                                <SocialShare post={selectedPost} />
                            </div>

                            {/* NOUVEAU : Navigation entre articles */}
                            <BlogNavigation
                                posts={displayPosts}
                                currentPost={selectedPost}
                                onNavigate={openPost}
                            />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Post non trouvé */
                    <motion.div
                        key="notfound"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-center"
                    >
                        <h1 className="text-4xl font-bold text-[#443C34] dark:text-white mb-4">{t('blog.articleNotFound')}</h1>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-8 text-left">
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                <strong>{t('blog.slugfounded')}</strong> <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">{slug}</code>
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                <strong> {t('blog.slugdisponible')}</strong>
                            </p>
                            <ul className="mt-2 space-y-1">
                                {posts.slice(0, 5).map(p => (
                                    <li key={p.id} className="text-sm">
                                        <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">{p.slug}</code> - {p.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button onClick={handleBack} className="cursor-pointer px-6 py-3 bg-[#443C34] text-white rounded-full hover:bg-[#D4A574] transition-all">
                            {t('common.back')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}