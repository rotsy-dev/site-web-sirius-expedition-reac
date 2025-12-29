import * as React from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../../types/content';

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPost,
  allPosts,
  onPostClick
}) => {
  // Logique pour trouver des articles similaires
  const getRelatedPosts = (): BlogPost[] => {
    const related = allPosts
      .filter(post => post.id !== currentPost.id)
      .filter(post => {
        // Même catégorie ou tags en commun
        const sameCategory = post.category === currentPost.category;
        const commonTags = post.tags?.some(tag => currentPost.tags?.includes(tag));
        return sameCategory || commonTags;
      })
      .slice(0, 3);

    // Si moins de 3, compléter avec d'autres articles
    if (related.length < 3) {
      const remaining = allPosts
        .filter(post => post.id !== currentPost.id && !related.includes(post))
        .slice(0, 3 - related.length);
      related.push(...remaining);
    }

    return related;
  };

  const relatedPosts = getRelatedPosts();

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-20 pt-16 border-t border-[#634832]/10">
      <div className="text-center mb-12">
        <h2 className="font-serif text-4xl text-[#1A120B] mb-3">
          Vous aimerez <span className="italic">aussi</span>
        </h2>
        <p className="text-[#634832]/60">Continuez votre lecture avec ces articles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => {
              onPostClick(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-[#1A120B] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[9px] font-bold text-[#D4A373] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {post.readTime}
                </span>
              </div>

              <h3 className="font-serif text-xl leading-snug group-hover:text-[#D4A373] transition-colors duration-300">
                {post.title}
              </h3>

              <p className="text-[#1A120B]/50 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              {/* Read more */}
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#634832] group-hover:text-[#D4A373] transition-colors pt-2">
                Lire l'article
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};