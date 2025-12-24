import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Phone, MapPin, Facebook, Youtube, Globe } from 'lucide-react';
import type { SiteConfig } from '../../../types/content';

interface ConfigEditorProps {
    config: SiteConfig;
    onSave: (config: SiteConfig) => void;
}

export function ConfigEditor({ config: initialConfig, onSave }: ConfigEditorProps) {
    const [config, setConfig] = useState<SiteConfig>(initialConfig);
    const [hasChanges, setHasChanges] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleChange = (field: keyof SiteConfig, value: any) => {
        setConfig({ ...config, [field]: value });
        setHasChanges(true);
    };

    const handleContactChange = (field: keyof SiteConfig['contact'], value: string) => {
        setConfig({
            ...config,
            contact: { ...config.contact, [field]: value }
        });
        setHasChanges(true);
    };

    const handleSocialChange = (field: keyof SiteConfig['social'], value: string) => {
        setConfig({
            ...config,
            social: { ...config.social, [field]: value }
        });
        setHasChanges(true);
    };

    const handleSave = () => {
        onSave(config);
        setHasChanges(false);
        alert('✅ Configuration sauvegardée !');
    };

    // Compresser et redimensionner l'image
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Redimensionner si trop grand (max 400px)
                    const maxSize = 400;
                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = (height / width) * maxSize;
                            width = maxSize;
                        } else {
                            width = (width / height) * maxSize;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Cannot get canvas context'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    // Convertir en base64 avec compression
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

                    // Vérifier la taille finale
                    const sizeInKB = (compressedDataUrl.length * 3) / 4 / 1024;
                    if (sizeInKB > 500) {
                        alert(`⚠️ L'image est encore trop volumineuse (${Math.round(sizeInKB)} KB). Essayez une image plus petite.`);
                        reject(new Error('Image too large'));
                        return;
                    }

                    resolve(compressedDataUrl);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            alert('❌ Veuillez sélectionner une image valide.');
            return;
        }

        // Vérifier la taille du fichier (max 5MB avant compression)
        if (file.size > 5 * 1024 * 1024) {
            alert('❌ L\'image est trop volumineuse. Maximum 5 MB.');
            return;
        }

        try {
            setIsCompressing(true);
            const compressedImage = await compressImage(file);
            handleChange('logo', compressedImage);

            // Calculer la taille finale
            const finalSizeKB = Math.round((compressedImage.length * 3) / 4 / 1024);
            alert(`✅ Logo uploadé avec succès ! (${finalSizeKB} KB)`);
        } catch (error) {
            console.error('Error compressing image:', error);
            alert('❌ Erreur lors du traitement de l\'image.');
        } finally {
            setIsCompressing(false);
            // Réinitialiser l'input pour permettre le même fichier
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Configuration du Site</h2>
                    <p className="text-gray-600">Paramètres généraux et informations de contact</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                            Non sauvegardé
                        </span>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        Sauvegarder
                    </motion.button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Informations Générales */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Globe size={16} className="text-blue-600" />
                        </div>
                        Informations Générales
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Nom du site</label>
                        <input
                            type="text"
                            value={config.siteName}
                            onChange={(e) => handleChange('siteName', e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Slogan (Tagline)</label>
                        <input
                            type="text"
                            value={config.tagline}
                            onChange={(e) => handleChange('tagline', e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Logo</label>
                        <div className="space-y-3">
                            {config.logo && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                                        {config.logo.startsWith('data:') || config.logo.startsWith('http') ? (
                                            <img src={config.logo} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-3xl">{config.logo}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Logo actuel</p>
                                        <p className="text-xs text-gray-600">Cliquez sur "Choisir une image" pour changer</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChange('logo', '🐭')}
                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-900 transition-colors"
                                    >
                                        Supprimer
                                    </motion.button>
                                </div>
                            )}
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    disabled={isCompressing}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                {isCompressing && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Compression en cours...
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs text-gray-900 leading-relaxed">
                                    📸 <strong>Formats acceptés :</strong> JPG, PNG, SVG, GIF<br />
                                    📏 <strong>Taille max :</strong> 5 MB (sera compressé automatiquement)<br />
                                    🎯 <strong>Dimensions recommandées :</strong> 400x400px ou moins<br />
                                    💾 <strong>Taille finale :</strong> Maximum 500 KB après compression
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Informations de Contact */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Mail size={16} className="text-blue-600" />
                        </div>
                        Contact
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                        <input
                            type="email"
                            value={config.contact.email}
                            onChange={(e) => handleContactChange('email', e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Téléphone</label>
                        <input
                            type="tel"
                            value={config.contact.phone}
                            onChange={(e) => handleContactChange('phone', e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">WhatsApp</label>
                        <input
                            type="tel"
                            value={config.contact.whatsapp}
                            onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Adresse</label>
                        <textarea
                            value={config.contact.address}
                            onChange={(e) => handleContactChange('address', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>

                {/* Réseaux Sociaux */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Facebook size={16} className="text-blue-600" />
                        </div>
                        Réseaux Sociaux
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Facebook</label>
                            <input
                                type="url"
                                value={config.social.facebook}
                                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                placeholder="https://facebook.com/..."
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">YouTube</label>
                            <input
                                type="url"
                                value={config.social.youtube}
                                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                                placeholder="https://youtube.com/@..."
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Instagram</label>
                            <input
                                type="url"
                                value={config.social.instagram}
                                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">TripAdvisor</label>
                            <input
                                type="url"
                                value={config.social.tripadvisor}
                                onChange={(e) => handleSocialChange('tripadvisor', e.target.value)}
                                placeholder="https://tripadvisor.com/..."
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-900 mb-2">Google Business</label>
                            <input
                                type="url"
                                value={config.social.google}
                                onChange={(e) => handleSocialChange('google', e.target.value)}
                                placeholder="https://maps.google.com/..."
                                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-900">
                    💡 <strong>Astuce :</strong> Ces informations seront utilisées dans le footer, la page de contact et les métadonnées du site.
                </p>
            </div>
        </div>
    );
}