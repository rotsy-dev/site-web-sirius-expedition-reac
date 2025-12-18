import * as React from 'react'
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { motion } from "framer-motion"

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  authorAvatar: string;
  date: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

interface BlogsProps {
  posts: BlogPost[];
}

export function Blogs({ posts }: BlogsProps) {
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
          📝 Latest Stories
        </span>
        <h2 className="text-4xl md:text-5xl mb-4 text-primary font-bold">
          Our Blog
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Expert insights, travel tips, and stories from Madagascar
        </p>
      </motion.div>

      {/* Featured Post */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="bg-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 mb-12 group cursor-pointer"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-96 md:h-auto overflow-hidden">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute top-6 left-6 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              ✨ Featured Article
            </div>
          </div>

          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit">
              {featuredPost.category}
            </div>

            <h3 className="text-3xl md:text-4xl mb-4 font-bold text-foreground group-hover:text-primary transition-colors">
              {featuredPost.title}
            </h3>

            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              {featuredPost.excerpt}
            </p>

            <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <img
                  src={featuredPost.authorAvatar}
                  alt={featuredPost.author}
                  className="w-8 h-8 rounded-full"
                  loading="lazy"
                />
                <span>{featuredPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{featuredPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-primary font-bold text-lg group/btn"
            >
              Read Full Article
              <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={20} />
            </motion.button>
          </div>
        </div>
      </motion.article>

      {/* Other Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-white/80 text-xs">
                  <Clock size={14} />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl mb-3 font-bold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-6 h-6 rounded-full"
                    loading="lazy"
                  />
                  <span className="text-xs">{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span className="text-xs">{post.date}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-accent font-medium group/btn"
              >
                Read More
                <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={16} />
              </motion.button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Load More Articles
        </motion.button>
      </motion.div>
    </section>
  );
}