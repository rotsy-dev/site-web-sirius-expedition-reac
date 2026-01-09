import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Loader2, Calendar, Eye, Share2, Facebook, Twitter, Linkedin, Link2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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

const HERO_IMAGE = "https://images.unsplash.com/photo-1659944984855-776187144baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW9iYWIlMjB0cmVlcyUyME1hZGFnYXNjYXIlMjBzdW5zZXR8ZW58MXx8fHwxNzY0NTkxODc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const CACHE_VERSION = '2.0';
const CACHE_KEY = `blog_posts_cache_v${CACHE_VERSION}`;

// ============================================
// COMPOSANT : PARTAGE SUR LES RÉSEAUX SOCIAUX
// ============================================
const SocialShare = ({ post }: any) => {
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
            className="flex flex-wrap items-center gap-3 p-6 bg-gradient-to-r from-[#F0E7D5] to-[#E5D8C0] dark:from-[#443C34] dark:to-[#332C26] rounded-2xl shadow-lg border-2 border-[#D4A574]/20"
        >
            <div className="flex items-center gap-2 text-[#443C34] dark:text-white font-bold">
                <Share2 size={20} />
                <span className="text-sm">Partager :</span>
            </div>

            <div className="flex items-center gap-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare('facebook')}
                    className="cursor-pointer w-10 h-10 rounded-full bg-[#1877F2] hover:bg-[#0d5dbf] text-white flex items-center justify-center shadow-md transition-all"
                    aria-label="Partager sur Facebook"
                >
                    <Facebook size={18} fill="white" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare('twitter')}
                    className="cursor-pointer w-10 h-10 rounded-full bg-[#1DA1F2] hover:bg-[#0d8bd9] text-white flex items-center justify-center shadow-md transition-all"
                    aria-label="Partager sur Twitter"
                >
                    <Twitter size={18} fill="white" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare('linkedin')}
                    className="cursor-pointer w-10 h-10 rounded-full bg-[#0A66C2] hover:bg-[#084d94] text-white flex items-center justify-center shadow-md transition-all"
                    aria-label="Partager sur LinkedIn"
                >
                    <Linkedin size={18} fill="white" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyToClipboard}
                    className={` cursor-pointer w-10 h-10 rounded-full ${copied ? 'bg-green-500' : 'bg-[#8B7355] hover:bg-[#6B5535]'
                        } text-white flex items-center justify-center shadow-md transition-all`}
                    aria-label="Copier le lien"
                >
                    {copied ? <Check size={18} /> : <Link2 size={18} />}
                </motion.button>
            </div>

            {copied && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-medium text-green-600 dark:text-green-400"
                >
                    Lien copié !
                </motion.span>
            )}
        </motion.div>
    );
};

// ============================================
// COMPOSANT : NAVIGATION ENTRE ARTICLES
// ============================================
const BlogNavigation = ({ posts, currentPost, onNavigate }: any) => {
    const currentIndex = posts.findIndex((p: any) => p.id === currentPost.id);
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    const NavCard = ({ post, direction, onClick }: any) => (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(post)}
            className={`cursor-pointer group flex-1 p-4 md:p-6 rounded-2xl bg-white dark:bg-[#443C34] border-2 border-[#D4A574]/20 hover:border-[#D4A574] shadow-lg hover:shadow-xl transition-all ${direction === 'prev' ? 'text-left' : 'text-right'
                }`}
        >
            <div className={`cursor-pointer flex items-center gap-3 mb-3 text-xs font-bold text-[#8B7355] dark:text-[#D4A574] ${direction === 'next' ? 'flex-row-reverse' : ''
                }`}>
                {direction === 'prev' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                <span className="uppercase tracking-wider">
                    {direction === 'prev' ? 'Prev' : 'Next'}
                </span>
            </div>

            <h3 className="text-base md:text-lg font-bold text-[#443C34] dark:text-white line-clamp-2 group-hover:text-[#8B7355] dark:group-hover:text-[#D4A574] transition-colors">
                {post.title}
            </h3>

            {post.excerpt && (
                <p className="cursor-pointer mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {post.excerpt}
                </p>
            )}
        </motion.button>
    );

    if (!prevPost && !nextPost) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-4 mt-12"
        >
            {prevPost ? (
                <NavCard post={prevPost} direction="prev" onClick={onNavigate} />
            ) : (
                <div className="flex-1 hidden md:block" />
            )}

            {nextPost ? (
                <NavCard post={nextPost} direction="next" onClick={onNavigate} />
            ) : (
                <div className="flex-1 hidden md:block" />
            )}
        </motion.div>
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

    // Précharger les images des posts
    useEffect(() => {
        if (posts.length > 0) {
            posts.forEach((post) => {
                if (post.image) {
                    const img = new Image();
                    img.onload = () => {
                        setImagesLoaded(prev => ({ ...prev, [post.id]: true }));
                    };
                    img.onerror = () => {
                        setImagesLoaded(prev => ({ ...prev, [post.id]: true }));
                    };
                    img.src = post.image;
                }
            });
        }
    }, [posts]);

    // Charger les posts depuis Firestore avec CACHE IMMÉDIAT
    useEffect(() => {
        const loadPosts = async () => {
            try {
                // 1. Charger IMMÉDIATEMENT depuis le cache si disponible
                const cachedPosts = localStorage.getItem(CACHE_KEY);
                if (cachedPosts) {
                    const parsedCache = JSON.parse(cachedPosts);
                    console.log('⚡ Chargement instantané depuis le cache:', parsedCache.length, 'posts');
                    setPosts(parsedCache);
                }

                // 2. Puis charger depuis Firestore en arrière-plan
                console.log('🔄 Mise à jour depuis Firestore...');
                const postsSnap = await getDocs(collection(db, 'blogPosts'));
                const freshPosts = postsSnap.docs.map(d => {
                    const data = d.data();
                    return {
                        id: d.id,
                        ...data,
                        slug: data.slug || d.id
                    };
                });

                // Trier par ID
                freshPosts.sort((a: any, b: any) => {
                    const idA = parseInt(a.id) || 0;
                    const idB = parseInt(b.id) || 0;
                    return idA - idB;
                });

                console.log(`✅ ${freshPosts.length} posts mis à jour depuis Firestore`);

                // Mettre à jour les posts ET le cache
                setPosts(freshPosts);
                localStorage.setItem(CACHE_KEY, JSON.stringify(freshPosts));

                // Nettoyer les anciens caches
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('blog_posts_cache') && key !== CACHE_KEY) {
                        localStorage.removeItem(key);
                    }
                });

            } catch (error) {
                console.error("❌ Erreur lors du chargement des posts:", error);
            }
        };

        loadPosts();
    }, []);

    // Gestion de la sélection du post en mode détail
    useEffect(() => {
        if (posts.length > 0 && isDetail && slug) {
            const found = posts.find(p => p.slug === slug) || posts.find(p => p.id === slug);

            if (found) {
                console.log('✅ Post trouvé:', { id: found.id, slug: found.slug });
                setSelectedPost(found);
            } else {
                console.log('❌ Post non trouvé avec slug:', slug);
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
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {/* Hero Section */}
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
                                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'
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

                                {isTranslatingPosts && (
                                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/80">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{t('common.loading')}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section Articles */}
                        <section className="py-20 sm:py-24 md:py-32 bg-[#F0E7D5]">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                                {displayPosts.length === 0 ? (
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
                                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
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
                                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
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
                                                            <div className="absolute top-4 left-4 bg-[#D4A574] backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                                                {post.category}
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
                                                                    {post.readTime || '5 min'}
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
                                                                    <span className="text-xs font-bold text-[#443C34] dark:text-white">
                                                                        {post.author}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                                                        {t('blog.author')}
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[1400px] mx-auto px-6 pt-32 pb-20"
                    >
                        <button onClick={handleBack} className="cursor-pointer group mb-12 flex items-center gap-3 px-6 py-3 rounded-full border-2 border-[#443C34] text-[#443C34] dark:text-white hover:bg-[#443C34] hover:text-white dark:hover:bg-[#D4A574] dark:hover:border-[#D4A574] transition-all shadow-md">
                            <ArrowLeft size={18} />
                            <span className="font-bold text-sm uppercase">{t('common.back')}</span>
                        </button>

                        <div className="max-w-4xl mx-auto px-4 md:px-6">
                            <h1 className="text-3xl md:text-4xl lg:text-4xl font-black text-[#443C34] dark:text-white mb-8 text-center">
                                {(translatedPosts?.find((p: any) => p.id === selectedPost.id)?.title) || selectedPost.title}
                            </h1>

                            <img
                                src={selectedPost.image}
                                className="w-full h-64 md:h-96 lg:h-[500px] object-cover rounded-3xl md:rounded-[48px] mb-12 shadow-2xl border-4 border-[#D4A574]"
                                alt={selectedPost.title}
                            />

                            <div className="bg-white dark:bg-[#443C34] p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-[32px] shadow-xl mb-8">
                                {((translatedPosts?.find((p: any) => p.id === selectedPost.id)?.content) || selectedPost.content || '').split('\n\n').map((paragraph: string, index: number) => (
                                    <p
                                        key={index}
                                        className={`text-base md:text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed text-justify ${index === 0 ? 'first-letter:text-6xl md:first-letter:text-7xl first-letter:font-bold first-letter:text-[#F0E7D5] first-letter:mr-3 first-letter:float-left first-letter:leading-none' : ''}`}
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* NOUVEAU : Partage sur les réseaux sociaux */}
                            <SocialShare post={selectedPost} />

                            {/* NOUVEAU : Navigation entre articles */}
                            <BlogNavigation
                                posts={displayPosts}
                                currentPost={selectedPost}
                                onNavigate={openPost}
                            />
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
                        <h1 className="text-4xl font-bold text-[#443C34] dark:text-white mb-4">Article non trouvé</h1>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-8 text-left">
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                <strong>Slug recherché :</strong> <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded">{slug}</code>
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                <strong>Slugs disponibles :</strong>
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