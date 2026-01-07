import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Loader2, Calendar } from 'lucide-react';
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

// Version du cache - incrémenter pour forcer le rechargement
const CACHE_VERSION = '2.0';
const CACHE_KEY = `blog_posts_cache_v${CACHE_VERSION}`;

export function Blogs({ content = {}, isDetail = false }: BlogProps) {
    const { t } = useTranslation();
    const { slug, lang } = useParams();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
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

    // Charger les posts depuis Firestore
    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            
            try {
                console.log('🔄 Chargement des posts depuis Firestore...');
                
                // Toujours charger depuis Firestore pour avoir les données les plus récentes
                const postsSnap = await getDocs(collection(db, 'blogPosts'));
                const freshPosts = postsSnap.docs.map(d => {
                    const data = d.data();
                    console.log('📄 Post chargé:', { 
                        id: d.id, 
                        slug: data.slug, 
                        title: data.title,
                        hasSlug: !!data.slug 
                    });
                    return { 
                        id: d.id, 
                        ...data,
                        // S'assurer que le slug existe, sinon le générer
                        slug: data.slug || d.id
                    };
                });
                
                // Trier par ID pour cohérence
                freshPosts.sort((a: any, b: any) => {
                    const idA = parseInt(a.id) || 0;
                    const idB = parseInt(b.id) || 0;
                    return idA - idB;
                });
                
                console.log(`✅ ${freshPosts.length} posts chargés avec succès`);
                console.log('📋 Slugs disponibles:', freshPosts.map(p => p.slug));
                
                setPosts(freshPosts);
                
                // Mettre à jour le cache avec la nouvelle version
                localStorage.setItem(CACHE_KEY, JSON.stringify(freshPosts));
                
                // Nettoyer les anciens caches
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('blog_posts_cache') && key !== CACHE_KEY) {
                        console.log('🗑️ Nettoyage ancien cache:', key);
                        localStorage.removeItem(key);
                    }
                });
                
            } catch (error) {
                console.error("❌ Erreur lors du chargement des posts:", error);
                
                // En cas d'erreur, essayer le cache
                const cachedPosts = localStorage.getItem(CACHE_KEY);
                if (cachedPosts) {
                    console.log('📦 Chargement depuis le cache...');
                    setPosts(JSON.parse(cachedPosts));
                } else {
                    console.log('⚠️ Aucun cache disponible');
                }
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []); // Se déclenche une seule fois au montage

    // Gestion de la sélection du post en mode détail
    useEffect(() => {
        if (posts.length > 0 && isDetail && slug) {
            console.log('🔍 Recherche du post avec slug:', slug);
            console.log('📋 Posts disponibles:', posts.map(p => ({ 
                id: p.id, 
                slug: p.slug,
                title: p.title 
            })));
            
            // Chercher par slug en priorité, puis par id
            const found = posts.find(p => p.slug === slug) || posts.find(p => p.id === slug);
            
            if (found) {
                console.log('✅ Post trouvé:', { 
                    id: found.id, 
                    slug: found.slug, 
                    title: found.title 
                });
                setSelectedPost(found);
            } else {
                console.log('❌ Post non trouvé avec slug:', slug);
                console.log('💡 Vérifiez que le slug existe dans Firestore');
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
        console.log('🔗 Navigation vers:', `/${lang}/blog/${target}`);
        navigate(`/${lang}/blog/${target}`);
    };

    // Retour à la liste
    const handleBack = () => {
        navigate(`/${lang}/blog`);
    };

    const featuredPost = displayPosts[0];

    // Affichage pendant le chargement
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#D4A574]" />
                    <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

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
                                                    onClick={() => openPost(post)}
                                                    className="group cursor-pointer bg-white dark:bg-[#443C34] rounded-[32px] p-4 flex flex-col gap-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#D4A574] shadow-md overflow-hidden"
                                                >
                                                    <div className="aspect-[4/3] rounded-[24px] overflow-hidden relative">
                                                        <img
                                                            src={post.image}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            alt={post.title}
                                                        />
                                                        {post.category && (
                                                            <div className="absolute top-4 left-4 bg-[#443C34]/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                                                                {post.category}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="px-2 flex flex-col flex-1 bg-gradient-to-b from-transparent to-[#F8F5F0] dark:to-[#332C26] rounded-2xl p-4">
                                                        <h3 className="text-lg md:text-xl font-bold text-[#443C34] dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-[#8B7355] dark:group-hover:text-[#D4A574] transition-colors">
                                                            {post.title}
                                                        </h3>

                                                        <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                                            {post.excerpt}
                                                        </p>

                                                        <div className="mt-auto space-y-4">
                                                            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                                                                <span className="flex items-center gap-1.5">
                                                                    <Clock size={14} className="text-[#8B7355] dark:text-[#D4A574]" />
                                                                    {post.readTime || '5 min'}
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                                                                <span className="flex items-center gap-1.5">
                                                                    <Calendar size={14} className="text-[#8B7355] dark:text-[#D4A574]" />
                                                                    {post.date || 'Jan 2024'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-4 border-t-2 border-[#D4A574]/30">
                                                                <div className="flex items-center gap-3">
                                                                    {post.authorAvatar ? (
                                                                        <img
                                                                            src={post.authorAvatar}
                                                                            alt={post.author}
                                                                            className="w-8 h-8 rounded-full object-cover border-2 border-[#D4A574]/50"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B7355] to-[#D4A574] flex items-center justify-center text-white text-xs font-bold">
                                                                            {post.author?.charAt(0) || 'A'}
                                                                        </div>
                                                                    )}
                                                                    <span className="text-xs font-bold text-[#8B7355] dark:text-[#D4A574]">
                                                                        {post.author}
                                                                    </span>
                                                                </div>

                                                                <div className="w-8 h-8 rounded-full bg-[#F0E7D5] dark:bg-[#8B7355] flex items-center justify-center group-hover:bg-[#443C34] dark:group-hover:bg-[#D4A574] group-hover:text-white transition-all shadow-sm">
                                                                    <ArrowRight size={14} />
                                                                </div>
                                                            </div>
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
                        <button onClick={handleBack} className="group mb-12 flex items-center gap-3 px-6 py-3 rounded-full border-2 border-[#443C34] text-[#443C34] dark:text-white hover:bg-[#443C34] hover:text-white dark:hover:bg-[#D4A574] dark:hover:border-[#D4A574] transition-all shadow-md">
                            <ArrowLeft size={18} />
                            <span className="font-bold text-sm uppercase">Back to Blog</span>
                        </button>
                        <div className="max-w-4xl mx-auto px-4 md:px-6">
                            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-[#443C34] dark:text-white mb-8 text-center">
                                {(translatedPosts?.find((p: any) => p.id === selectedPost.id)?.title) || selectedPost.title}
                            </h1>

                            <img
                                src={selectedPost.image}
                                className="w-full h-64 md:h-96 lg:h-[500px] object-cover rounded-3xl md:rounded-[48px] mb-12 shadow-2xl border-4 border-[#D4A574]"
                                alt={selectedPost.title}
                            />

                            <div className="bg-white dark:bg-[#443C34] p-6 md:p-10 lg:p-12 rounded-2xl md:rounded-[32px] shadow-xl">
                                {((translatedPosts?.find((p: any) => p.id === selectedPost.id)?.content) || selectedPost.content || '').split('\n\n').map((paragraph: string, index: number) => (
                                    <p
                                        key={index}
                                        className={`text-base md:text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed text-justify ${index === 0 ? 'first-letter:text-6xl md:first-letter:text-7xl first-letter:font-bold first-letter:text-[#F0E7D5] first-letter:mr-3 first-letter:float-left first-letter:leading-none' : ''
                                            }`}
                                    >
                                        {paragraph}
                                    </p>
                                ))}
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
                        <button onClick={handleBack} className="px-6 py-3 bg-[#443C34] text-white rounded-full hover:bg-[#D4A574] transition-all">
                            Retour aux blogs
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}