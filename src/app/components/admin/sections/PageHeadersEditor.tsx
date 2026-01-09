import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Type, Tag, FileText } from 'lucide-react';

interface PageHeader {
  badge: string;
  title: string;
  subtitle: string;
}

interface PageHeadersEditorProps {
  headers: Record<string, PageHeader>;
  onSave: (headers: Record<string, PageHeader>) => void;
}

const PAGES = [
  { key: 'hero', label: 'Hero Section', icon: '🏠' },
  { key: 'bestSellers', label: 'Best Sellers', icon: '⭐' },
  { key: 'specialties', label: 'Tour Specialties', icon: '🎯' },
  { key: 'reviews', label: 'Reviews', icon: '💬' },
  { key: 'videos', label: 'Video Gallery', icon: '🎬' },
  { key: 'blog', label: 'Blog', icon: '📝' },
  { key: 'about', label: 'About Us', icon: 'ℹ️' },
  { key: 'quote', label: 'Ask a quote', icon: '💼' },
  { key: 'contact', label: 'Contact', icon: '📧' }
];

export function PageHeadersEditor({ headers, onSave }: PageHeadersEditorProps) {
  const [localHeaders, setLocalHeaders] = useState(headers);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (page: string, field: keyof PageHeader, value: string) => {
    setLocalHeaders(prev => ({
      ...prev,
      [page]: { ...prev[page], [field]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localHeaders);
    setHasChanges(false);
    alert('✅ Headers sauvegardés !');
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec responsivité */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Page Headers</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            Gérez les titres, badges et sous-titres de chaque section
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-lg disabled:opacity-50 text-sm sm:text-base"
        >
          <Save size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span>Sauvegarder</span>
        </motion.button>
      </div>

      {/* Grille responsive pour les sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
        {PAGES.map((page, index) => (
          <motion.div
            key={page.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-5 md:p-6"
          >
            {/* En-tête de la section */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
              <span className="text-2xl sm:text-3xl">{page.icon}</span>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground truncate">
                {page.label}
              </h3>
            </div>

            {/* Champs de formulaire */}
            <div className="space-y-3 sm:space-y-4">
              {/* Champ Badge */}
              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                  <Tag size={14} className="sm:w-4 sm:h-4 text-accent" />
                  <span>Badge</span>
                </label>
                <input
                  type="text"
                  value={localHeaders[page.key]?.badge || ''}
                  onChange={(e) => handleChange(page.key, 'badge', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-muted border border-border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder="Featured Destinations"
                />
              </div>

              {/* Champ Titre Principal */}
              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                  <Type size={14} className="sm:w-4 sm:h-4 text-accent" />
                  <span>Titre Principal</span>
                </label>
                <input
                  type="text"
                  value={localHeaders[page.key]?.title || ''}
                  onChange={(e) => handleChange(page.key, 'title', e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-muted border border-border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  placeholder="Your Next Adventure Awaits"
                />
              </div>

              {/* Champ Sous-titre */}
              <div>
                <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                  <FileText size={14} className="sm:w-4 sm:h-4 text-accent" />
                  <span>Sous-titre</span>
                </label>
                <textarea
                  value={localHeaders[page.key]?.subtitle || ''}
                  onChange={(e) => handleChange(page.key, 'subtitle', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-muted border border-border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary resize-none text-sm sm:text-base"
                  placeholder="Handpicked experiences loved by thousands of travelers"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}