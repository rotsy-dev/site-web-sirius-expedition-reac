import * as React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowLeft, Clock, Eye, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../../types/content';
import { SearchBar } from '../../components/blog/SearchBar';
import { RelatedPosts } from '../../components/blog/RelatedPosts';
import { BlogGridSkeleton, BlogDetailSkeleton } from '../../components/shared/SkeletonLoader';
import { useToast } from '../../components/shared/Toast';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase/config';

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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [showShareMenu, setShowShareMenu] = React.useState(false);
  const { showToast } = useToast();

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Increment view count when post is opened
  React.useEffect(() => {
    if (selectedPost) {
      const incrementViews = async () => {
        try {
          const postRef = doc(db, 'blogPosts', selectedPost.id.toString());
          await updateDoc(postRef, {
            views: increment(1)
          });
        } catch (error) {
          console.error('Error incrementing views:', error);
        }
      };
      incrementViews();
    }
  }, [selectedPost?.id]);

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  // Filtrage avancé
  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handlePostClick = (post: BlogPostType) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (platform: string) => {
    if (!selectedPost) return;

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(selectedPost.title);
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(window.location.href);
      showToast('success', 'Lien copié dans le presse-papier !');
      setShowShareMenu(false);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    }
  };

  // Render markdown-like content
  const renderContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-3xl font-serif font-bold text-[#634832] mt-12 mb-6">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={idx} className="text-2xl font-serif font-semibold text-[#634832] mt-8 mb-4">{line.replace('### ', '')}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-6 mb-2">{line.replace('- ', '')}</li>;
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      return <p key={idx} className="mb-6 leading-relaxed">{line}</p>;
    });
  };

  return (
    <React.Fragment>
      <div className="bg-[#FAF7F2] min-h-screen font-sans text-[#1A120B]">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            <motion.div 
              key="list" 
              initial="hidden" 
              animate="visible" 
              exit={{ opacity: 0 }}
              className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-40"
            >
              {/* Header */}
              <header className="mb-20 text-center max-w-3xl mx-auto">
                <motion.span 
                  variants={itemVariants} 
                  className="text-[#D4A373] text-xs font-bold uppercase tracking-[0.3em] mb-4 block"
                >
                  Insights & Stories
                </motion.span>
                <motion.h1 
                  variants={itemVariants} 
                  className="font-serif text-5xl md:text-7xl mb-8 leading-tight"
                >
                  Notre <span className="italic">Blog</span>
                </motion.h1>
                <motion.div variants={itemVariants}>
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    resultsCount={filteredPosts.length}
                  />
                </motion.div>
              </header>

              {/* Categories */}
              <motion.div 
                variants={itemVariants} 
                className="flex flex-wrap justify-center gap-3 mb-16"
              >
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setSearchQuery('');
                    }}
                    className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      activeCategory === cat 
                      ? 'bg-[#634832] text-white shadow-lg scale-105' 
                      : 'bg-white text-[#634832]/60 hover:bg-[#634832]/5 hover:scale-105'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>

              {/* Grid with loading */}
              {isLoading ? (
                <BlogGridSkeleton count={6} />
              ) : filteredPosts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-serif text-[#634832] mb-2">Aucun article trouvé</h3>
                  <p className="text-[#634832]/60">
                    Essayez de modifier vos critères de recherche
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                  {filteredPosts.map((post, idx) => (
                    <motion.article
                      key={post.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: idx * 0.1 }}
                      layoutId={`post-${post.id}`}
                      onClick={() => handlePostClick(post)}
                      className="group cursor-pointer flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                        <motion.img 
                          layoutId={`img-${post.id}`}
                          src={post.image} 
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-6 left-6">
                          <span className="bg-white/90 backdrop-blur-sm text-[#1A120B] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow px-2">
                        <div className="flex items-center gap-4 text-[10px] font-bold text-[#D4A373] uppercase tracking-[0.15em] mb-4">
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} /> {post.readTime}
                          </span>
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
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#634832]">
                            Lire l'article
                          </span>
                          <div className="w-10 h-10 rounded-full border border-[#634832]/10 flex items-center justify-center group-hover:bg-[#634832] group-hover:text-white transition-all duration-300">
                            <ArrowRightIcon />
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* Article Detail View */
            <motion.article 
              key="details" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto px-6 pt-40 pb-40"
            >
              {isLoading ? (
                <BlogDetailSkeleton />
              ) : (
                <>
                  {/* Back button */}
                  <button 
                    onClick={() => setSelectedPost(null)} 
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1A120B]/40 hover:text-[#D4A373] transition-colors mb-12"
                  >
                    <ArrowLeft size={16} /> Retour au blog
                  </button>
                  
                  {/* Header */}
                  <div className="text-center mb-16">
                    <div className="inline-block bg-[#D4A373]/10 text-[#D4A373] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                      {selectedPost.category}
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl leading-tight mb-8">
                      {selectedPost.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest text-[#D4A373]">
                      <span className="flex items-center gap-2">
                        <img 
                          src={selectedPost.authorAvatar} 
                          alt={selectedPost.author}
                          className="w-6 h-6 rounded-full"
                        />
                        {selectedPost.author}
                      </span>
                      <span className="w-1.5 h-1.5 bg-[#D4A373]/20 rounded-full"></span>
                      <span>{selectedPost.date}</span>
                      <span className="w-1.5 h-1.5 bg-[#D4A373]/20 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {selectedPost.views} vues
                      </span>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <motion.div 
                    layoutId={`img-${selectedPost.id}`} 
                    className="rounded-[30px] overflow-hidden shadow-3xl mb-16"
                  >
                    <img 
                      src={selectedPost.image} 
                      alt={selectedPost.title}
                      className="w-full aspect-video object-cover" 
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="prose prose-stone max-w-none px-4 md:px-12">
                    <p className="text-2xl font-serif italic text-[#634832] leading-relaxed mb-10">
                      {selectedPost.excerpt}
                    </p>
                    <div className="text-[#1A120B]/70 text-lg leading-loose space-y-8">
                      {renderContent(selectedPost.content || 'Notre voyage à travers Madagascar nous a révélé des secrets que seul le vent connaît...')}
                    </div>
                  </div>

                  {/* Author Bio */}
                  <div className="mt-16 p-8 bg-gradient-to-br from-[#FAF7F2] to-white rounded-3xl border border-[#634832]/10">
                    <div className="flex items-center gap-6">
                      <img
                        src={selectedPost.authorAvatar}
                        alt={selectedPost.author}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#D4A373] uppercase tracking-widest mb-1">
                          À propos de l'auteur
                        </div>
                        <h3 className="text-2xl font-serif text-[#634832] mb-2">
                          {selectedPost.author}
                        </h3>
                        <p className="text-[#1A120B]/60 text-sm leading-relaxed">
                          {selectedPost.authorBio}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedPost.tags && selectedPost.tags.length > 0 && (
                    <div className="mt-12 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold text-[#634832]/60 uppercase tracking-widest">
                        Tags :
                      </span>
                      {selectedPost.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 bg-white border border-[#634832]/10 rounded-full text-xs text-[#634832] hover:bg-[#D4A373]/10 hover:border-[#D4A373] transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Share buttons */}
                  <div className="mt-12 pt-8 border-t border-[#634832]/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#634832] uppercase tracking-widest">
                        Partager cet article
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-10 h-10 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300"
                          title="Partager sur Facebook"
                        >
                          <Facebook size={18} />
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2] text-[#1DA1F2] hover:text-white flex items-center justify-center transition-all duration-300"
                          title="Partager sur Twitter"
                        >
                          <Twitter size={18} />
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="w-10 h-10 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white flex items-center justify-center transition-all duration-300"
                          title="Partager sur LinkedIn"
                        >
                          <Linkedin size={18} />
                        </button>
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-10 h-10 rounded-full bg-[#634832]/10 hover:bg-[#634832] text-[#634832] hover:text-white flex items-center justify-center transition-all duration-300"
                          title="Copier le lien"
                        >
                          <LinkIcon size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Related Posts */}
                  <RelatedPosts
                    currentPost={selectedPost}
                    allPosts={posts}
                    onPostClick={handlePostClick}
                  />
                </>
              )}
            </motion.article>
          )}
        </AnimatePresence>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
          .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
          .font-serif { font-family: 'DM Serif Display', serif; }
        `}</style>
      </div>
    </React.Fragment>
  );
}

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);