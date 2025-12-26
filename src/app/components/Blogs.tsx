import * as React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Search } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../../types/content';

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as const }
  }
};

export function Blogs({ posts = [] }: { posts: BlogPostType[] }) {
  const [selectedPost, setSelectedPost] = React.useState<BlogPostType | null>(null);
  const [activeCategory, setActiveCategory] = React.useState('All');

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const filteredPosts = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <React.Fragment>
      <div className="bg-[#FAF7F2] min-h-screen font-sans text-[#1A120B]">
        
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            <motion.div 
              key="list" 
              initial="hidden" animate="visible" exit={{ opacity: 0 }}
              className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-40"
            >
              {/* --- HEADER EDITORIAL --- */}
              <header className="mb-20 text-center max-w-3xl mx-auto">
                <motion.span variants={itemVariants} className="text-[#D4A373] text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                  Insights & Stories
                </motion.span>
                <motion.h1 variants={itemVariants} className="font-serif text-5xl md:text-7xl mb-8 leading-tight">
                  Our Latest <span className="italic">Articles</span>
                </motion.h1>
                <motion.div variants={itemVariants} className="relative max-w-md mx-auto">
                  <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="w-full bg-white border border-[#634832]/10 rounded-full py-4 px-6 text-sm focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#634832]/30" size={18} />
                </motion.div>
              </header>

              {/* --- CATEGORIES PILLS --- */}
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-16">
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      activeCategory === cat 
                      ? 'bg-[#634832] text-white shadow-lg' 
                      : 'bg-white text-[#634832]/60 hover:bg-[#634832]/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>

              {/* --- GRID INSPIRED BY ENVATO PREVIEW --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                {filteredPosts.map((post, idx) => (
                  <motion.article
                    key={post.id}
                    variants={itemVariants}
                    layoutId={`post-${post.id}`}
                    onClick={() => { setSelectedPost(post); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                    className="group cursor-pointer flex flex-col h-full"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                      <motion.img 
                        layoutId={`img-${post.id}`}
                        src={post.image} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-sm text-[#1A120B] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-grow px-2">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-[#D4A373] uppercase tracking-[0.15em] mb-4">
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                        <span className="w-1 h-1 bg-[#D4A373]/30 rounded-full"></span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="font-serif text-3xl mb-4 leading-snug group-hover:text-[#D4A373] transition-colors duration-300">
                        {post.title}
                      </h3>
                      <p className="text-[#1A120B]/50 text-sm leading-relaxed line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto pt-4 border-t border-[#634832]/5 flex items-center justify-between">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#634832]">Read Story</span>
                         <div className="w-10 h-10 rounded-full border border-[#634832]/10 flex items-center justify-center group-hover:bg-[#634832] group-hover:text-white transition-all duration-300">
                            <ArrowRightIcon />
                         </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          ) : (
            /* --- VUE ARTICLE (EDITORIAL VIEW) --- */
            <motion.article 
              key="details" 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto px-6 pt-40 pb-40"
            >
              <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1A120B]/40 hover:text-[#D4A373] transition-colors mb-12">
                <ArrowLeft size={16} /> Back to Blog
              </button>
              
              <div className="text-center mb-16">
                <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest text-[#D4A373]">
                  <span>{selectedPost.author}</span>
                  <span className="w-1.5 h-1.5 bg-[#D4A373]/20 rounded-full"></span>
                  <span>{selectedPost.date}</span>
                </div>
              </div>

              <motion.div layoutId={`img-${selectedPost.id}`} className="rounded-[30px] overflow-hidden shadow-3xl mb-16">
                <img src={selectedPost.image} className="w-full aspect-video object-cover" alt="" />
              </motion.div>

              <div className="prose prose-stone max-w-none px-4 md:px-12">
                <p className="text-2xl font-serif italic text-[#634832] leading-relaxed mb-10">
                  {selectedPost.excerpt}
                </p>
                <div className="text-[#1A120B]/70 text-lg leading-loose space-y-8">
                  <p>Our journey through the red lands of Madagascar revealed secrets only the wind knows...</p>
                </div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
          .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
          .font-serif { font-family: 'DM Serif Display', serif; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </React.Fragment>
  );
}

// Petit composant icône interne
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);