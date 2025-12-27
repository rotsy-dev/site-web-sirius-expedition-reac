import * as React from 'react';
import { motion } from 'framer-motion';

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="group cursor-wait flex flex-col h-full">
      {/* Image skeleton */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] mb-6 bg-gradient-to-br from-[#634832]/5 to-[#D4A373]/10 animate-pulse">
        <div className="absolute top-6 left-6">
          <div className="bg-white/40 backdrop-blur-sm px-4 py-1.5 rounded-full h-6 w-20"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col flex-grow px-2 space-y-4">
        {/* Meta info */}
        <div className="flex items-center gap-4">
          <div className="h-3 bg-[#D4A373]/20 rounded-full w-16 animate-pulse"></div>
          <div className="w-1 h-1 bg-[#D4A373]/20 rounded-full"></div>
          <div className="h-3 bg-[#D4A373]/20 rounded-full w-24 animate-pulse"></div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-8 bg-[#634832]/10 rounded-lg w-full animate-pulse"></div>
          <div className="h-8 bg-[#634832]/10 rounded-lg w-3/4 animate-pulse"></div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 bg-[#1A120B]/5 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-[#1A120B]/5 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-[#1A120B]/5 rounded w-4/6 animate-pulse"></div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[#634832]/5 flex items-center justify-between">
          <div className="h-3 bg-[#634832]/10 rounded w-20 animate-pulse"></div>
          <div className="w-10 h-10 rounded-full bg-[#634832]/5 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const BlogDetailSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-6 pt-40 pb-40"
    >
      {/* Back button */}
      <div className="h-4 bg-[#1A120B]/10 rounded w-32 mb-12 animate-pulse"></div>

      {/* Header */}
      <div className="text-center mb-16 space-y-6">
        <div className="h-12 bg-[#634832]/10 rounded-xl w-3/4 mx-auto animate-pulse"></div>
        <div className="h-12 bg-[#634832]/10 rounded-xl w-2/3 mx-auto animate-pulse"></div>
        <div className="flex items-center justify-center gap-6">
          <div className="h-3 bg-[#D4A373]/20 rounded w-24 animate-pulse"></div>
          <div className="w-1.5 h-1.5 bg-[#D4A373]/20 rounded-full"></div>
          <div className="h-3 bg-[#D4A373]/20 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Featured image */}
      <div className="rounded-[30px] overflow-hidden mb-16 aspect-video bg-gradient-to-br from-[#634832]/5 to-[#D4A373]/10 animate-pulse"></div>

      {/* Content */}
      <div className="space-y-6 px-4 md:px-12">
        <div className="h-6 bg-[#634832]/10 rounded w-full animate-pulse"></div>
        <div className="h-6 bg-[#634832]/10 rounded w-5/6 animate-pulse"></div>
        <div className="h-6 bg-[#634832]/10 rounded w-4/5 animate-pulse"></div>
        <div className="h-6 bg-[#634832]/10 rounded w-full animate-pulse"></div>
        <div className="h-6 bg-[#634832]/10 rounded w-3/4 animate-pulse"></div>
      </div>
    </motion.div>
  );
};

export const BlogGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
      {Array.from({ length: count }).map((_, idx) => (
        <BlogCardSkeleton key={idx} />
      ))}
    </div>
  );
};