import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, ArrowUpRight, Clock, Calendar, Share2, Instagram, Facebook } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../../types/content';

export function Blogs({ posts = [], isLoading, onLoadMore, hasMore = true }: { 
  posts: BlogPostType[], 
  isLoading?: boolean, 
  onLoadMore?: () => void, 
  hasMore?: boolean 
}) {
  const [selectedPost, setSelectedPost] = React.useState<BlogPostType | null>(null);
  const [activeCategory, setActiveCategory] = React.useState('All');

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const filteredPosts = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div className="bg-[#FAF7F2] dark:bg-[#0C0B0A] min-h-screen font-sans selection:bg-[#D4A373] selection:text-white">
      
      <AnimatePresence mode="wait">
        {!selectedPost ? (
          /* --- VUE LISTE : BLOG PRINCIPAL --- */
          <motion.div 
            key="list" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, y: -20 }}
          >
            {/* SECTION TITRE AVEC ANIMATION REVEAL */}
            <section className="relative pt-48 pb-12 px-6 text-center">
              <div className="max-w-7xl mx-auto space-y-6">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#1A120B] dark:text-white flex flex-col items-center justify-center md:flex-row md:gap-4 overflow-hidden">
                  <motion.span
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Expedition
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="text-[#D4A373] font-serif italic font-medium relative"
                  >
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="inline-block"
                    >
                      Stories
                    </motion.span>
                    <motion.div 
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#D4A373]/30 origin-left rounded-full"
                    />
                  </motion.span>
                </h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="text-[#634832]/60 dark:text-zinc-400 text-lg md:text-xl max-w-xl mx-auto font-medium"
                >
                  Récits d'aventures et découvertes au cœur de Madagascar.
                </motion.p>
              </div>
            </section>

            {/* FILTRES */}
            <div className="max-w-7xl mx-auto px-6 mb-16">
              <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar p-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-[#D4A373] text-white shadow-lg shadow-[#D4A373]/20' : 'bg-white text-[#634832] border border-[#E7E0D7] hover:border-[#D4A373]'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* GRILLE BENTO */}
            <main className="max-w-7xl mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  layoutId={`post-${post.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { setSelectedPost(post); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                  className="group cursor-pointer bg-white dark:bg-[#141211] rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#E7E0D7]/50"
                >
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <motion.img 
                      layoutId={`img-${post.id}`} 
                      src={post.image} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#1A120B] text-[9px] font-black uppercase rounded-full shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3 text-[9px] font-bold text-[#D4A373] uppercase tracking-widest">
                       <Clock size={12} /> {post.readTime}
                    </div>
                    <h3 className="text-2xl font-black leading-tight group-hover:text-[#D4A373] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[#634832]/70 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-6 flex items-center justify-between border-t border-[#FAF7F2] dark:border-white/5">
                       <span className="text-[10px] font-bold uppercase opacity-40">{post.date}</span>
                       <div className="w-10 h-10 rounded-full bg-[#FAF7F2] dark:bg-black flex items-center justify-center group-hover:bg-[#D4A373] group-hover:text-white transition-colors">
                         <ArrowUpRight size={18} />
                       </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </main>
          </motion.div>
        ) : (
          /* --- VUE DÉTAILS : DESIGN ASYMÉTRIQUE AMÉLIORÉ --- */
          <motion.div 
            key="details" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="pt-40 pb-40"
          >
            <div className="max-w-7xl mx-auto px-6">
              
              <button 
                onClick={() => setSelectedPost(null)}
                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#D4A373] mb-16"
              >
                <div className="p-3 rounded-full border border-[#D4A373] group-hover:bg-[#D4A373] group-hover:text-white transition-all">
                  <ArrowLeft size={16} />
                </div>
                Retour aux récits
              </button>

              {/* HEADER ASYMÉTRIQUE */}
              <div className="grid lg:grid-cols-12 gap-16 items-center mb-32">
                <div className="lg:col-span-7 relative">
                  <motion.div 
                    layoutId={`img-${selectedPost.id}`}
                    className="relative aspect-[16/10] rounded-[3.5rem] overflow-hidden shadow-2xl z-10"
                  >
                    <img src={selectedPost.image} className="w-full h-full object-cover" alt={selectedPost.title} />
                  </motion.div>
                  <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#D4A373]/20 rounded-full -z-10 blur-3xl" />
                </div>

                <div className="lg:col-span-5 space-y-8">
                  <div className="space-y-6">
                    <motion.span 
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      className="inline-block px-5 py-2 bg-[#1A120B] text-[#D4A373] text-[10px] font-black uppercase rounded-full tracking-widest"
                    >
                      {selectedPost.category}
                    </motion.span>
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="text-5xl md:text-7xl font-black text-[#1A120B] dark:text-white leading-[0.95] tracking-tighter"
                    >
                      {selectedPost.title}
                    </motion.h1>
                  </div>

                  <div className="flex items-center gap-6 py-8 border-y border-[#E7E0D7] dark:border-white/10">
                    <img src={selectedPost.authorAvatar} className="w-16 h-16 rounded-full border-2 border-[#D4A373] object-cover p-0.5" alt={selectedPost.author} />
                    <div>
                      <p className="font-black text-sm uppercase tracking-wider">{selectedPost.author}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium mt-1">
                        <span className="flex items-center gap-1.5"><Calendar size={14}/> {selectedPost.date}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14}/> {selectedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CORPS DE L'ARTICLE */}
              <div className="max-w-3xl mx-auto">
                <div className="prose prose-stone lg:prose-xl dark:prose-invert">
                  <p className="text-2xl md:text-3xl font-serif italic text-[#634832] dark:text-[#D4A373] leading-relaxed mb-16 border-l-4 border-[#D4A373] pl-8">
                    {selectedPost.excerpt}
                  </p>
                  
                  <div className="space-y-10 text-xl leading-loose text-zinc-600 dark:text-zinc-400">
                    <p className="first-letter:text-8xl first-letter:font-black first-letter:text-[#1A120B] dark:first-letter:text-[#D4A373] first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8]">
                      L'exploration est une invitation à voir le monde autrement. À Madagascar, chaque forêt cache des secrets 
                      millénaires et une faune qui ne demande qu'à être respectée.
                    </p>
                    
                    <p>
                      Notre équipe s'efforce de capturer l'essence de ces moments pour vous offrir une immersion totale. 
                      Le design de nos expériences est pensé pour minimiser l'impact tout en maximisant l'émotion.
                    </p>

                    <blockquote className="my-20 p-12 bg-white dark:bg-[#141211] rounded-[3rem] border border-[#E7E0D7] dark:border-white/5 relative shadow-sm text-center">
                       <p className="text-2xl font-serif italic text-[#1A120B] dark:text-white leading-snug">
                         "La plus grande aventure que vous puissiez entreprendre est de vivre la vie de vos rêves au cœur de la nature."
                       </p>
                    </blockquote>
                  </div>
                </div>

                {/* FOOTER ARTICLE */}
                <div className="mt-24 pt-10 border-t border-[#E7E0D7] dark:border-white/10 flex flex-wrap items-center justify-between gap-8">
                  <div className="flex gap-2">
                    {['Aventure', 'Nature', 'Madagascar'].map(tag => (
                      <span key={tag} className="px-5 py-2 bg-white dark:bg-zinc-900 rounded-full text-[10px] font-black uppercase text-zinc-400 border border-[#E7E0D7] dark:border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="p-3 bg-[#1A120B] text-white rounded-full hover:bg-[#D4A373] transition-all hover:-translate-y-1"><Instagram size={18}/></button>
                    <button className="p-3 bg-[#1A120B] text-white rounded-full hover:bg-[#D4A373] transition-all hover:-translate-y-1"><Facebook size={18}/></button>
                    <button className="p-3 bg-[#1A120B] text-white rounded-full hover:bg-[#D4A373] transition-all hover:-translate-y-1"><Share2 size={18}/></button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:italic,wght@700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}