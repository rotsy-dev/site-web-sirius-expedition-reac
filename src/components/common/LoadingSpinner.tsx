// ═══════════════════════════════════════════════════════════════════════════
// ⏳ LOADING SPINNER - SIRIUS EXPEDITION
// ═══════════════════════════════════════════════════════════════════════════

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner amélioré avec animation de pulsation */}
      <motion.div
        className="relative"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`${sizeClasses[size]} relative`}
        >
          {/* Cercle extérieur */}
          <div className="absolute inset-0 rounded-full border-4 border-[#D4A574]/20" />
          {/* Cercle animé */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#D4A574] border-r-[#D4A574]"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          {/* Cercle intérieur */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#4B3935] border-l-[#4B3935]"
            animate={{ rotate: -360 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-[#8B7355] font-medium animate-pulse"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-white/95 dark:bg-zinc-900/95 z-50"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      {content}
    </div>
  );
}
