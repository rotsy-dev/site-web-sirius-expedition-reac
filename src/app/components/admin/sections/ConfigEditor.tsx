import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Phone, MapPin, Facebook, Youtube, Globe } from 'lucide-react';

interface SiteConfig {
    siteName: string;
    tagline: string;
    logo: string;
    contact: {
        email: string;
        phone: string;
        address: string;
        whatsapp: string;
    };
    social: {
        facebook: string;
        youtube: string;
        tripadvisor: string;
        google: string;
        instagram: string;
    };
}

interface ConfigEditorProps {
    config: SiteConfig;
    onSave: (config: SiteConfig) => void;
}

export function ConfigEditor({ config: initialConfig, onSave }: ConfigEditorProps) {
    const [config, setConfig] = useState<SiteConfig>(initialConfig);
    const [hasChanges, setHasChanges] = useState(false);

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Configuration du Site</h2>
                    <p className="text-muted-foreground">Paramètres généraux et informations de contact</p>
                </div>
                <div className="flex items-center gap-3">
                    {hasChanges && (
                        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
                            Non sauvegardé
                        </span>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        Sauvegarder
                    </motion.button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Informations Générales */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Globe size={16} className="text-primary" />
                        </div>
                        Informations Générales
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Nom du site</label>
                        <input
                            type="text"
                            value={config.siteName}
                            onChange={(e) => handleChange('siteName', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Slogan (Tagline)</label>
                        <input
                            type="text"
                            value={config.tagline}
                            onChange={(e) => handleChange('tagline', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Logo (Emoji ou URL)</label>
                        <input
                            type="text"
                            value={config.logo}
                            onChange={(e) => handleChange('logo', e.target.value)}
                            placeholder="🐭 ou https://..."
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Utilisez un emoji ou une URL d'image
                        </p>
                    </div>
                </div>

                {/* Informations de Contact */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Mail size={16} className="text-primary" />
                        </div>
                        Contact
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                        <input
                            type="email"
                            value={config.contact.email}
                            onChange={(e) => handleContactChange('email', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                        <input
                            type="tel"
                            value={config.contact.phone}
                            onChange={(e) => handleContactChange('phone', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
                        <input
                            type="tel"
                            value={config.contact.whatsapp}
                            onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
                        <textarea
                            value={config.contact.address}
                            onChange={(e) => handleContactChange('address', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                    </div>
                </div>

                {/* Réseaux Sociaux */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Facebook size={16} className="text-primary" />
                        </div>
                        Réseaux Sociaux
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Facebook</label>
                            <input
                                type="url"
                                value={config.social.facebook}
                                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                placeholder="https://facebook.com/..."
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">YouTube</label>
                            <input
                                type="url"
                                value={config.social.youtube}
                                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                                placeholder="https://youtube.com/@..."
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Instagram</label>
                            <input
                                type="url"
                                value={config.social.instagram}
                                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">TripAdvisor</label>
                            <input
                                type="url"
                                value={config.social.tripadvisor}
                                onChange={(e) => handleSocialChange('tripadvisor', e.target.value)}
                                placeholder="https://tripadvisor.com/..."
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-foreground mb-2">Google Business</label>
                            <input
                                type="url"
                                value={config.social.google}
                                onChange={(e) => handleSocialChange('google', e.target.value)}
                                placeholder="https://maps.google.com/..."
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info box */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm text-foreground">
                    💡 <strong>Astuce :</strong> Ces informations seront utilisées dans le footer, la page de contact et les métadonnées du site.
                </p>
            </div>
        </div>
    );
}