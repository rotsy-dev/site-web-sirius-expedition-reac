import * as React from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultsCount?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher des articles...',
  resultsCount
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative max-w-md mx-auto">
      <motion.div
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? '0 10px 40px -10px rgba(212, 163, 115, 0.3)' 
            : '0 0 0 0 rgba(212, 163, 115, 0)'
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          <Search 
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#634832]/30 transition-colors"
            size={18}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full bg-white border border-[#634832]/10 rounded-full py-4 pl-12 pr-12 text-sm text-[#1A120B] placeholder:text-[#634832]/30 focus:outline-none focus:border-[#D4A373] transition-colors"
          />
          <AnimatePresence>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                type="button"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#634832]/40 hover:text-[#D4A373] transition-colors"
              >
                <X size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results count */}
      <AnimatePresence>
        {value && resultsCount !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-3 left-0 right-0 text-center"
          >
            <span className="text-xs text-[#634832]/60 bg-white px-4 py-1.5 rounded-full shadow-sm border border-[#634832]/5">
              {resultsCount} résultat{resultsCount !== 1 ? 's' : ''} trouvé{resultsCount !== 1 ? 's' : ''}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};