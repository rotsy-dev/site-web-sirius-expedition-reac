import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Youtube, Link, Tag } from 'lucide-react';

interface Video {
  id: number;
  youtubeId: string;
  title: string;
  category: string;
  thumbnail: string;
}

interface VideoConfig {
  mainYouTubeId: string;
  channelUrl: string;
  aboutUsVideoId: string;
}

interface VideoConfigEditorProps {
  videos: Video[];
  config: VideoConfig;
  onSaveVideos: (videos: Video[]) => void;
  onSaveConfig: (config: VideoConfig) => void;
}

// Fix TypeScript errors
const isVideo = (v: any): v is Video => {
  return v && typeof v.id === 'number' && typeof v.youtubeId === 'string';
};

export default function VideoConfigEditor({ videos, config, onSaveVideos, onSaveConfig }: VideoConfigEditorProps) {
  const [localVideos, setLocalVideos] = useState<Video[]>(videos || []);
  const [localConfig, setLocalConfig] = useState<VideoConfig>(config || {
    mainYouTubeId: '',
    channelUrl: '',
    aboutUsVideoId: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Video>>({});
  const [activeTab, setActiveTab] = useState<'gallery' | 'config'>('gallery');

  // Ajouter une nouvelle vidéo
  const handleAdd = () => {
    const newVideo: Video = {
      id: Date.now(),
      youtubeId: '',
      title: 'Nouvelle vidéo',
      category: 'Adventure',
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`
    };
    setLocalVideos([...localVideos, newVideo]);
    setEditingId(newVideo.id);
    setEditForm(newVideo);
  };

  // Supprimer une vidéo
  const handleDelete = (id: number) => {
    if (confirm('Supprimer cette vidéo ?')) {
      setLocalVideos(localVideos.filter((v: Video) => v.id !== id));
    }
  };

  // Commencer l'édition
  const startEdit = (video: Video) => {
    setEditingId(video.id);
    setEditForm({ ...video });
  };

  // Sauvegarder l'édition
  const saveEdit = () => {
    if (editingId) {
      setLocalVideos(localVideos.map((v: Video) => 
        v.id === editingId ? { ...v, ...editForm } as Video : v
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

  // Générer thumbnail URL depuis YouTube ID
  const generateThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  // Extraire YouTube ID depuis URL
  const extractYoutubeId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return url;
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('gallery')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'gallery'
              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          <Youtube className="inline-block mr-2" size={18} />
          Galerie Vidéos
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('config')}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'config'
              ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          <Link className="inline-block mr-2" size={18} />
          Configuration
        </motion.button>
      </div>

      {/* Galerie Vidéos Tab */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Galerie Vidéos</h3>
              <p className="text-muted-foreground">Gérez les vidéos affichées dans la galerie</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium flex items-center gap-2"
            >
              <Plus size={18} />
              Ajouter une vidéo
            </motion.button>
          </div>

          {/* Liste des vidéos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {localVideos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-muted/50 rounded-xl overflow-hidden border border-border"
                >
                  {editingId === video.id ? (
                    // Mode édition
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          <Youtube size={16} className="inline mr-1" />
                          YouTube ID ou URL
                        </label>
                        <input
                          type="text"
                          value={editForm.youtubeId || ''}
                          onChange={(e) => {
                            const id = extractYoutubeId(e.target.value);
                            setEditForm({ 
                              ...editForm, 
                              youtubeId: id,
                              thumbnail: generateThumbnail(id)
                            });
                          }}
                          placeholder="dQw4w9WgXcQ ou URL complète"
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          <Edit2 size={16} className="inline mr-1" />
                          Titre
                        </label>
                        <input
                          type="text"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          <Tag size={16} className="inline mr-1" />
                          Catégorie
                        </label>
                        <select
                          value={editForm.category || ''}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground"
                        >
                          <option value="Adventure">Adventure</option>
                          <option value="Wildlife">Wildlife</option>
                          <option value="Culture">Culture</option>
                          <option value="Landscape">Landscape</option>
                          <option value="Beach">Beach</option>
                        </select>
                      </div>

                      {editForm.youtubeId && (
                        <div>
                          <label className="block text-sm font-medium mb-2 text-foreground">Aperçu</label>
                          <img 
                            src={generateThumbnail(editForm.youtubeId)} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={saveEdit}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                        >
                          <Save size={16} />
                          Sauvegarder
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-muted text-foreground rounded-lg"
                        >
                          <X size={16} />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <>
                      <div className="relative h-48">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold">
                          {video.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-foreground mb-2">{video.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4 font-mono">
                          ID: {video.youtubeId}
                        </p>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => startEdit(video)}
                            className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                          >
                            <Edit2 size={14} />
                            Modifier
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(video.id)}
                            className="px-3 py-2 bg-destructive/10 text-destructive rounded-lg"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSaveVideos(localVideos)}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold text-lg shadow-lg"
          >
            💾 Sauvegarder la galerie
          </motion.button>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Configuration Vidéos</h3>
            <p className="text-muted-foreground">Paramètres généraux des vidéos YouTube</p>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 space-y-6 border border-border">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                <Youtube size={16} className="inline mr-1" />
                Vidéo principale (Featured)
              </label>
              <input
                type="text"
                value={localConfig.mainYouTubeId}
                onChange={(e) => setLocalConfig({ ...localConfig, mainYouTubeId: extractYoutubeId(e.target.value) })}
                placeholder="ID YouTube ou URL complète"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Cette vidéo sera affichée en grand format en haut de la galerie
              </p>
              {localConfig.mainYouTubeId && (
                <div className="mt-3">
                  <img 
                    src={generateThumbnail(localConfig.mainYouTubeId)} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                <Youtube size={16} className="inline mr-1" />
                Vidéo "À propos"
              </label>
              <input
                type="text"
                value={localConfig.aboutUsVideoId}
                onChange={(e) => setLocalConfig({ ...localConfig, aboutUsVideoId: extractYoutubeId(e.target.value) })}
                placeholder="ID YouTube ou URL complète"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Cette vidéo sera affichée dans la section "À propos"
              </p>
              {localConfig.aboutUsVideoId && (
                <div className="mt-3">
                  <img 
                    src={generateThumbnail(localConfig.aboutUsVideoId)} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                <Link size={16} className="inline mr-1" />
                URL Chaîne YouTube
              </label>
              <input
                type="text"
                value={localConfig.channelUrl}
                onChange={(e) => setLocalConfig({ ...localConfig, channelUrl: e.target.value })}
                placeholder="https://youtube.com/@votre-chaine"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lien vers votre chaîne YouTube complète
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSaveConfig(localConfig)}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold text-lg shadow-lg"
          >
            💾 Sauvegarder la configuration
          </motion.button>
        </div>
      )}
    </div>
  );
}