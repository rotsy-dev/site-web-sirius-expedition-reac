import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';

export function Blogs() {
    const [posts, setPosts] = useState<any[]>([]);
    const [pageSettings, setPageSettings] = useState({
        title: 'Our Blog',
        subtitle: 'Expert insights, travel tips and stories from Madagascar',
        badge: 'Latest Story'
    });
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const cachedPosts = localStorage.getItem('blog_posts_cache');
            const cachedSettings = localStorage.getItem('blog_settings_cache');
            if (cachedPosts && cachedSettings) {
                setPosts(JSON.parse(cachedPosts));
                setPageSettings(JSON.parse(cachedSettings));
                setLoading(false);
            }
            try {
                const postsSnap = await getDocs(collection(db, 'blogPosts'));
                const settingsSnap = await getDoc(doc(db, 'settings', 'blogPage'));
                const freshPosts = postsSnap.docs.map(d => d.data());
                setPosts(freshPosts);
                const freshSettings = settingsSnap.exists() ? (settingsSnap.data() as any) : null;
                if (freshSettings) setPageSettings(freshSettings);
                localStorage.setItem('blog_posts_cache', JSON.stringify(freshPosts));
                if (freshSettings) localStorage.setItem('blog_settings_cache', JSON.stringify(freshSettings));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const featuredPost = posts[0];

    return (
        <div className="bg-white min-h-screen font-sans">
            <AnimatePresence mode="wait">
                {!selectedPost ? (
                    <motion.div 
                        key="list" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0, y: -20 }}
                        className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto"
                    >
                        {/* HEADER - DESIGN ORIGINAL */}
                        <header className="text-center mb-16 space-y-4">
                            <motion.span 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="inline-block px-3 py-1 bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-gray-500 rounded-md border border-gray-100"
                            >
                                {pageSettings.badge}
                            </motion.span>
                            <motion.h1 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-bold text-[#1A120B] tracking-tight"
                            >
                                {pageSettings.title}
                            </motion.h1>
                            <motion.p 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-400 text-sm max-w-xl mx-auto"
                            >
                                {pageSettings.subtitle}
                            </motion.p>
                        </header>

                        {/* FEATURED POST - DESIGN ORIGINAL */}
                        {featuredPost && (
                            <motion.section 
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => setSelectedPost(featuredPost)} 
                                className="group cursor-pointer grid md:grid-cols-2 gap-12 items-center bg-white border border-gray-100 rounded-[2.5rem] p-8 mb-20 hover:shadow-xl transition-all duration-500"
                            >
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-bold leading-tight group-hover:text-gray-600 transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-gray-500 leading-relaxed line-clamp-3">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                        <div className="w-8 h-8 rounded-full bg-gray-100" />
                                        <span>{featuredPost.author} , {featuredPost.date}</span>
                                    </div>
                                    <button className="flex items-center gap-2 px-8 py-3 rounded-full border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                        Read Full Article <ArrowRight size={14} />
                                    </button>
                                </div>
                                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden">
                                    <motion.img 
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.8 }}
                                        src={featuredPost.image} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            </motion.section>
                        )}

                        {/* GRID - DESIGN ORIGINAL */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {posts.slice(1).map((post, idx) => (
                                <motion.article 
                                    key={post.id} 
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 * idx }}
                                    onClick={() => setSelectedPost(post)} 
                                    className="group cursor-pointer space-y-6"
                                >
                                    <div className="aspect-[1.4/1] rounded-[2rem] overflow-hidden">
                                        <motion.img 
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                            src={post.image} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="px-2 space-y-4">
                                        <h3 className="text-xl font-bold leading-snug group-hover:text-gray-600 transition-colors">{post.title}</h3>
                                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 font-medium">
                                            {post.excerpt}
                                        </p>
                                        <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-[10px] font-bold uppercase tracking-widest">
                                            Read More <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    /* DÉTAIL DE L'ARTICLE - DESIGN ORIGINAL */
                    <motion.div 
                        key="detail" 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0 }}
                        className="max-w-4xl mx-auto px-6 py-32"
                    >
                        <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-12 hover:gap-4 transition-all">
                            <ArrowLeft size={16} /> Back to Blog
                        </button>
                        <h1 className="text-5xl font-bold mb-8 leading-tight">{selectedPost.title}</h1>
                        <motion.img 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={selectedPost.image} 
                            className="w-full h-[500px] object-cover rounded-[3rem] mb-12" 
                        />
                        <div className="prose prose-lg max-w-none prose-p:text-gray-600" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}