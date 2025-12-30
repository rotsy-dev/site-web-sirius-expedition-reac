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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Page Headers</h2>
          <p className="text-muted-foreground">Gérez les titres, badges et sous-titres de chaque section</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-lg disabled:opacity-50"
        >
          <Save size={18} />
          Sauvegarder
        </motion.button>
      </div>

      <div className="grid gap-8">
        {PAGES.map((page, index) => (
          <motion.div
            key={page.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{page.icon}</span>
              <h3 className="text-xl font-bold text-foreground">{page.label}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Tag size={16} className="text-accent" />
                  Badge
                </label>
                <input
                  type="text"
                  value={localHeaders[page.key]?.badge || ''}
                  onChange={(e) => handleChange(page.key, 'badge', e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary"
                  placeholder="Featured Destinations"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Type size={16} className="text-accent" />
                  Titre Principal
                </label>
                <input
                  type="text"
                  value={localHeaders[page.key]?.title || ''}
                  onChange={(e) => handleChange(page.key, 'title', e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary"
                  placeholder="Your Next Adventure Awaits"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FileText size={16} className="text-accent" />
                  Sous-titre
                </label>
                <textarea
                  value={localHeaders[page.key]?.subtitle || ''}
                  onChange={(e) => handleChange(page.key, 'subtitle', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-primary resize-none"
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