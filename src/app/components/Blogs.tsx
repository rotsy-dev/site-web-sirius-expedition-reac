import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { SectionHeader } from '../../components/common/SectionHeader';

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

export function Blogs({ content = {} }: BlogProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [remoteContent, setRemoteContent] = useState<any>(content);

    useEffect(() => {
        const load = async () => {
            // Tentative de récupération du cache
            const cachedPosts = localStorage.getItem('blog_posts_cache');
            const cachedSettings = localStorage.getItem('blog_settings_cache');
            
            if (cachedPosts) setPosts(JSON.parse(cachedPosts));
            if (cachedSettings) setRemoteContent(JSON.parse(cachedSettings));

            try {
                // Articles
                const postsSnap = await getDocs(collection(db, 'blogPosts'));
                const freshPosts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setPosts(freshPosts);
                localStorage.setItem('blog_posts_cache', JSON.stringify(freshPosts));

                // Récupération du document settings/blogPage (contenant pageHeaders)
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

    const featuredPost = posts[0];

    return (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen font-sans">
            <AnimatePresence mode="wait">
                {!selectedPost ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto"
                    >
                        {/* 2. Utilisation de SectionHeader exactement comme dans HeroCarousel */}
                        <SectionHeader
                          badge={content?.pageHeaders?.blog?.badge || 'Latest Story'}
                          title={content?.pageHeaders?.blog?.title || 'Our Blog'}
                          subtitle={content?.pageHeaders?.blog?.subtitle || 'Expert insights and stories'}
                        />

                        {/* Reste du design (Featured Post & Grid) */}
                        <div className="mt-20">
                            {featuredPost && (
                                <motion.section
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    onClick={() => setSelectedPost(featuredPost)}
                                    className="group cursor-pointer bg-white dark:bg-gray-900 rounded-[40px] mb-20 border-4 border-[#443C34] hover:shadow-xl transition-all duration-500 overflow-hidden"
                                >
                                    <div className="grid md:grid-cols-2 items-stretch">
                                        <div className="p-8 md:p-12 space-y-8 flex flex-col justify-center">
                                            <div className="space-y-4">
                                                <h2 className="text-3xl md:text-5xl font-bold text-[#443C34] dark:text-white leading-[1.15]">
                                                    {featuredPost.title}
                                                </h2>
                                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg line-clamp-3">
                                                    {featuredPost.excerpt}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                                                <div className="text-sm font-bold text-[#1A1A1A] dark:text-gray-300">
                                                    {featuredPost.author} <span className="text-gray-300 mx-2">,</span> {featuredPost.date}
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-3 pl-6 pr-2 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-[#1A1A1A] dark:text-white font-bold text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 transition-all group-hover:border-[#443C34] w-fit">
                                                Read Full Article
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-[#443C34] group-hover:text-white transition-colors">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </button>
                                        </div>
                                        <div className="relative h-full min-h-[400px]">
                                            <img src={featuredPost.image} className="w-full h-full object-cover" alt={featuredPost.title} />
                                            <div className="absolute top-0 right-10 bg-white dark:bg-gray-900 rounded-b-[24px] w-24 h-24 flex items-center justify-center z-10 shadow-sm">
                                                <span className="text-5xl font-bold text-[#443C34] dark:text-primary translate-y-2">
                                                    {featuredPost.date ? featuredPost.date.split(' ')[0] : '10'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.section>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {posts.slice(1).map((post, idx) => (
                                    <motion.article
                                        key={post.id}
                                        initial={{ y: 40, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 * idx }}
                                        onClick={() => setSelectedPost(post)}
                                        className="group cursor-pointer bg-white dark:bg-gray-900 rounded-[32px] p-4 flex flex-col gap-6 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 shadow-sm"
                                    >
                                        <div className="aspect-[4/3] rounded-[24px] overflow-hidden">
                                            <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={post.title} />
                                        </div>
                                        <div className="px-2 flex flex-col flex-1">
                                            <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white mb-3 line-clamp-2 leading-tight">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
                                                {post.excerpt}
                                            </p>
                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                                <span className="text-xs font-bold dark:text-gray-400">{post.author}</span>
                                                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-[#443C34] group-hover:text-white transition-all">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* DÉTAIL DE L'ARTICLE */
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[1400px] mx-auto px-6 pt-32 pb-20"
                    >
                        <button onClick={() => setSelectedPost(null)} className="group mb-12 flex items-center gap-3 px-6 py-3 rounded-full border border-[#443C34]/20 text-[#443C34] dark:text-white hover:bg-[#443C34] hover:text-white transition-all">
                            <ArrowLeft size={18} />
                            <span className="font-bold text-sm uppercase">Back to Blog</span>
                        </button>
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-black text-[#443C34] dark:text-white mb-8 text-center">{selectedPost.title}</h1>
                            <img src={selectedPost.image} className="w-full h-[500px] object-cover rounded-[48px] mb-12 shadow-2xl" alt="" />
                            <div className="prose prose-xl dark:prose-invert mx-auto" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}