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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Galerie d'images</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez les images de la galerie Madagascar
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            Ajouter une image
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium transition-colors"
          >
            <Save size={18} />
            Enregistrer
          </motion.button>
        </div>
      </div>

      {/* Liste des images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <ImageIcon size={48} className="text-muted-foreground" />
                </div>
              )}
              {image.category && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-primary/80 text-primary-foreground text-xs font-semibold rounded">
                  {image.category}
                </span>
              )}
            </div>

            {/* Informations */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2 truncate">
                {image.alt}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(image)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit2 size={14} />
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
            </div>

            {/* Formulaire d'édition inline */}
            {editingId === image.id && (
              <div className="p-4 border-t border-border bg-muted/30 space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Image
                  </label>
                  <ImageUploader
                    value={editForm.src || ''}
                    onChange={(url) => setEditForm({ ...editForm, src: url })}
                    aspectRatio="16/10"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Ou entrez une URL directement
                  </p>
                  <input
                    type="text"
                    value={editForm.src || ''}
                    onChange={(e) => setEditForm({ ...editForm, src: e.target.value })}
                    placeholder="https://..."
                    className="w-full mt-2 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editForm.alt || ''}
                    onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                    placeholder="Description de l'image"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">
                    Catégorie
                  </label>
                  <select
                    value={editForm.category || 'wildlife'}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  >
                    <Save size={14} className="inline mr-1" />
                    Enregistrer
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg text-sm font-medium"
                  >
                    <X size={14} className="inline mr-1" />
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p>Aucune image dans la galerie</p>
          <p className="text-sm mt-2">Cliquez sur "Ajouter une image" pour commencer</p>
        </div>
      )}
    </div>
  );
}

