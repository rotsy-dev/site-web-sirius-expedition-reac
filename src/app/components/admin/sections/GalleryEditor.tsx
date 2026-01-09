import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Upload } from 'lucide-react';
import { ImageUploader } from '../../../../components/shared/ImageUploader';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category?: string;
}

interface GalleryEditorProps {
  images: GalleryImage[];
  onSave: (images: GalleryImage[]) => void;
}

export function GalleryEditor({ images: initialImages, onSave }: GalleryEditorProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages || []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryImage>>({});

  // Ajouter une nouvelle image
  const handleAdd = () => {
    const newImage: GalleryImage = {
      id: Date.now(),
      src: '',
      alt: 'Nouvelle image',
      category: 'wildlife'
    };
    setImages([...images, newImage]);
    setEditingId(newImage.id);
    setEditForm(newImage);
  };

  // Supprimer une image
  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette image ?')) {
      setImages(images.filter((img) => img.id !== id));
    }
  };

  // Commencer l'édition
  const startEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setEditForm({ ...image });
  };

  // Sauvegarder l'édition
  const saveEdit = () => {
    if (editingId) {
      setImages(images.map((img) => 
        img.id === editingId ? { ...img, ...editForm } as GalleryImage : img
      ));
      setEditingId(null);
      setEditForm({});
    }
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Sauvegarder toutes les modifications
  const handleSave = () => {
    onSave(images);
  };

  const categories = ['wildlife', 'landscape', 'beach', 'culture', 'safari', 'guides', 'tours'];

  return (
    <div className="space-y-6">
      {/* En-tête avec responsivité améliorée */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Galerie d'images</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Gérez les images de la galerie Madagascar
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-4 sm:h-4" />
            <span>Ajouter une image</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-accent text-accent-foreground rounded-lg font-medium transition-colors text-sm sm:text-base"
          >
            <Save size={16} className="sm:w-4 sm:h-4" />
            <span>Enregistrer</span>
          </motion.button>
        </div>
      </div>

      {/* Liste des images avec responsivité améliorée */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
        {images.map((image) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl overflow-hidden shadow-md"
          >
            {/* Aperçu de l'image */}
            <div className="relative aspect-video bg-muted">
              {image.src ? (
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={32} className="sm:w-10 sm:h-10 text-muted-foreground" />
                </div>
              )}
              {image.category && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-primary/80 text-primary-foreground text-xs font-semibold rounded">
                  {image.category}
                </span>
              )}
            </div>

            {/* Informations */}
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2 truncate">
                {image.alt}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(image)}
                  className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  <Edit2 size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden xs:inline">Modifier</span>
                  <span className="xs:hidden">Modif</span>
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-1 sm:p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4 text-destructive" />
                </button>
              </div>
            </div>

            {/* Formulaire d'édition inline avec responsivité améliorée */}
            <AnimatePresence>
              {editingId === image.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 sm:p-4 border-t border-border bg-muted/30 space-y-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2 text-foreground">
                        Image
                      </label>
                      <div className="w-full">
                        <ImageUploader
                          value={editForm.src || ''}
                          onChange={(url) => setEditForm({ ...editForm, src: url })}
                          aspectRatio="16/10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Ou entrez une URL directement
                      </p>
                      <input
                        type="text"
                        value={editForm.src || ''}
                        onChange={(e) => setEditForm({ ...editForm, src: e.target.value })}
                        placeholder="https://..."
                        className="w-full mt-2 px-3 py-2 bg-background border border-border rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                        Description
                      </label>
                      <input
                        type="text"
                        value={editForm.alt || ''}
                        onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                        placeholder="Description de l'image"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 text-foreground">
                        Catégorie
                      </label>
                      <select
                        value={editForm.category || 'wildlife'}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs sm:text-sm"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col xs:flex-row gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs sm:text-sm font-medium"
                      >
                        <Save size={12} className="inline mr-1 sm:w-3.5 sm:h-3.5" />
                        Enregistrer
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg text-xs sm:text-sm font-medium"
                      >
                        <X size={12} className="inline mr-1 sm:w-3.5 sm:h-3.5" />
                        Annuler
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-muted-foreground">
          <ImageIcon size={32} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
          <p className="text-sm sm:text-base">Aucune image dans la galerie</p>
          <p className="text-xs sm:text-sm mt-2">Cliquez sur "Ajouter une image" pour commencer</p>
        </div>
      )}
    </div>
  );
}