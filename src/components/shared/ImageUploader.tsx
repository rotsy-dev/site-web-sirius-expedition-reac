import * as React from 'react';
import { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploaderProps {
  value: string; // Sera la chaîne Base64
  onChange: (url: string) => void;
  folder?: string; // Gardé pour la compatibilité, mais non utilisé en Base64
  aspectRatio?: string;
}

export function ImageUploader({ value, onChange, aspectRatio = "16/9" }: ImageUploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ta logique de compression optimisée
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Limite à 800px pour le blog (un peu plus que le logo)
          const maxSize = 800; 
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = Math.round((height / width) * maxSize);
              width = maxSize;
            } else {
              width = Math.round((width / height) * maxSize);
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('Erreur canvas');

          ctx.drawImage(img, 0, 0, width, height);
          
          // Compression à 0.8 pour un bon ratio qualité/poids
          const compressed = canvas.toDataURL('image/jpeg', 0.8);

          // Vérification du poids pour Firestore (Limite 1Mo par document)
          const sizeKB = Math.round((compressed.length * 3) / 4 / 1024);
          if (sizeKB > 800) {
            alert(`⚠️ L'image est encore trop lourde (${sizeKB} KB). Essayez une image plus simple.`);
            return reject('Too large');
          }

          resolve(compressed);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez choisir une image');
      return;
    }

    try {
      setIsCompressing(true);
      const base64 = await compressImage(file);
      onChange(base64);
    } catch (error) {
      console.error("Erreur upload:", error);
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div 
        style={{ aspectRatio }}
        className="relative group rounded-2xl border-2 border-dashed border-border overflow-hidden bg-muted/30 hover:border-primary/50 transition-colors"
      >
        <AnimatePresence mode="wait">
          {value ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <img 
                src={value} 
                alt="Upload" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                >
                  <Upload size={24} />
                </button>
                <button
                  onClick={() => onChange('')}
                  className="p-3 bg-red-500/50 backdrop-blur-md rounded-full text-white hover:bg-red-500/70 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary transition-colors"
            >
              {isCompressing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-primary" size={40} />
                  <span className="text-sm font-medium">Traitement de l'image...</span>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-primary/10">
                    <ImageIcon size={32} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">Cliquez pour uploader</p>
                    <p className="text-sm">PNG, JPG ou WebP (max 800KB)</p>
                  </div>
                </>
              )}
            </button>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}