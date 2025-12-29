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
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen font-sans">
            <AnimatePresence mode="wait">
                {!selectedPost ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto"
                    >
                        {/* HEADER - STANDARDIZED DESIGN */}
                        <header className="text-center mb-16 space-y-4">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="mb-6 mt-10 md:mt-20"
                            >
                                <span className="text-xl text-[#443C34] dark:text-gray-400 font-semibold border-2 border-[#443C34] px-6 py-3 rounded-full">
                                    {pageSettings.badge}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#443C34] dark:text-white leading-tight"
                            >
                                {pageSettings.title}
                            </motion.h1>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                            >
                                {pageSettings.subtitle}
                            </motion.p>
                        </header>

                        {/* FEATURED POST - REDESIGNED */}
                        {featuredPost && (
                            <motion.section
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => setSelectedPost(featuredPost)}
                                className="group cursor-pointer bg-white rounded-[40px] mb-20 border-4 border-[#443C34] hover:shadow-xl transition-all duration-500 overflow-hidden"
                            >
                                <div className="grid md:grid-cols-2 items-stretch">
                                    {/* Content - Left */}
                                    <div className="p-8 md:p-12 space-y-8 flex flex-col justify-center">
                                        <div className="space-y-4">
                                            <h2 className="text-3xl md:text-5xl font-bold text-[#443C34] leading-[1.15]">
                                                {featuredPost.title}
                                            </h2>
                                            <p className="text-gray-500 leading-relaxed text-lg line-clamp-3">
                                                {featuredPost.excerpt}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-200" />
                                            <div className="text-sm font-bold text-[#1A1A1A]">
                                                {featuredPost.author} <span className="text-gray-300 mx-2">,</span> {featuredPost.date} <span className="text-gray-300 mx-2">,</span> 5 min read
                                            </div>
                                        </div>

                                        <button className="flex items-center gap-3 pl-6 pr-2 py-2 rounded-full border border-gray-200 text-[#1A1A1A] font-bold text-sm bg-white hover:bg-gray-50 transition-all group-hover:border-[#443C34] w-fit">
                                            Read Full Article
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#443C34] group-hover:text-white transition-colors">
                                                <ArrowRight size={16} />
                                            </div>
                                        </button>
                                    </div>

                                    {/* Image - Right */}
                                    <div className="relative h-full min-h-[400px]">
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.8 }}
                                            src={featuredPost.image}
                                            className="w-full h-full object-cover"
                                            alt={featuredPost.title}
                                        />

                                        {/* Date Badge - Fixed Top Right */}
                                        <div className="absolute top-0 right-10 bg-white rounded-b-[24px] w-24 h-24 flex items-center justify-center z-10">
                                            <span className="text-5xl font-bold text-[#443C34] translate-y-2">
                                                {featuredPost.date ? featuredPost.date.split(' ')[0] : '10'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* GRID - REDESIGNED */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {posts.slice(1).map((post, idx) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ y: 40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 * idx }}
                                    onClick={() => setSelectedPost(post)}
                                    className="group cursor-pointer bg-white rounded-[32px] p-4 flex flex-col gap-6 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
                                >
                                    {/* Image Container */}
                                    <div className="aspect-[4/3] rounded-[24px] overflow-hidden">
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.6 }}
                                            src={post.image}
                                            className="w-full h-full object-cover"
                                            alt={post.title}
                                        />
                                    </div>

                                    {/* Content Container */}
                                    <div className="px-2 flex flex-col flex-1 pb-2">
                                        <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 line-clamp-2 leading-tight group-hover:text-[#443C34] transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto space-y-6">
                                            {/* Author Meta */}
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
                                                <div className="text-xs font-bold text-[#1A1A1A]">
                                                    {post.author} <span className="text-gray-300 mx-1">,</span> {post.date}
                                                </div>
                                            </div>

                                            {/* Button */}
                                            <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-sm font-bold text-[#1A1A1A] bg-transparent group-hover:bg-[#443C34] group-hover:text-white group-hover:border-[#443C34] transition-all w-fit">
                                                Read More
                                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                                                    <ArrowRight size={12} />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    /* DÉTAIL DE L'ARTICLE - REDESIGNED */
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="max-w-[1400px] mx-auto px-6 pt-32 pb-20"
                    >
                        {/* Back Button */}
                        <div className="mb-12">
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="group flex items-center gap-3 px-6 py-3 rounded-full border border-[#443C34]/20 hover:border-[#443C34] text-[#443C34] hover:bg-[#443C34] hover:text-white transition-all duration-300"
                            >
                                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                                <span className="font-bold text-sm tracking-wide uppercase">Back to Blog</span>
                            </button>
                        </div>

                        {/* Article Header */}
                        <header className="max-w-5xl mx-auto text-center mb-16">
                            <div className="flex items-center justify-center gap-4 text-sm font-bold text-[#443C34]/60 uppercase tracking-widest mb-6">
                                <span>{selectedPost.date}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#443C34]/40" />
                                <span>5 min read</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#443C34] leading-[1.1] mb-8">
                                {selectedPost.title}
                            </h1>

                            <div className="flex items-center justify-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-sm" />
                                <span className="font-bold text-[#1A1A1A]">By {selectedPost.author}</span>
                            </div>
                        </header>

                        {/* Featured Image */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative w-full aspect-[21/9] rounded-[48px] overflow-hidden shadow-2xl mb-20"
                        >
                            <img
                                src={selectedPost.image}
                                alt={selectedPost.title}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Content Body */}
                        <div className="max-w-3xl mx-auto">
                            <div
                                className="prose prose-xl prose-stone prose-headings:font-bold prose-headings:text-[#443C34] prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#443C34] hover:prose-a:underline"
                                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                            />

                            {/* Share / Tags Placeholder */}
                            <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-gray-400 font-medium">Share this article</span>
                                <div className="flex gap-4">
                                    {/* Social icons placeholders */}
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#443C34] hover:text-white transition-colors cursor-pointer">
                                        <ArrowRight size={16} className="-rotate-45" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}