import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Mail, Phone, MapPin, Facebook, Youtube, Globe, X, Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { db } from '../../../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface TourDate {
    id: string;
    date: string;
    time: string;
}

interface Tour {
    id: string;
    name: string;
    description: string;
    dates: TourDate[];
}

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
    tours: Tour[];
}

interface ConfigEditorProps {
    config: SiteConfig;
    onSave: (config: SiteConfig) => void;
}

const defaultConfig: SiteConfig = {
    siteName: 'Sirius Expedition',
    tagline: 'Aventures inoubliables à Madagascar',
    logo: '',
    contact: {
        email: '',
        phone: '',
        address: '',
        whatsapp: '',
    },
    social: {
        facebook: '',
        youtube: '',
        tripadvisor: '',
        google: '',
        instagram: '',
    },
    tours: [],
};

export function ConfigEditor({ config: initialConfig, onSave }: ConfigEditorProps) {
    const [config, setConfig] = useState<SiteConfig>({ ...defaultConfig });
    const [hasChanges, setHasChanges] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const configDoc = doc(db, 'siteConfig', 'main');
                const docSnap = await getDoc(configDoc);

                if (docSnap.exists()) {
                    const data = docSnap.data() as Partial<SiteConfig>;
                    setConfig({
                        ...defaultConfig,
                        ...data,
                        contact: { ...defaultConfig.contact, ...data.contact },
                        social: { ...defaultConfig.social, ...data.social },
                        tours: data.tours || [],
                    });
                } else {
                    setConfig(defaultConfig);
                }
            } catch (err) {
                console.error('Erreur chargement configuration Firebase :', err);
                setConfig(defaultConfig);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleChange = (field: keyof SiteConfig, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleContactChange = (field: keyof SiteConfig['contact'], value: string) => {
        setConfig(prev => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }));
        setHasChanges(true);
    };

    const handleSocialChange = (field: keyof SiteConfig['social'], value: string) => {
        setConfig(prev => ({
            ...prev,
            social: { ...prev.social, [field]: value }
        }));
        setHasChanges(true);
    };

    const addTour = () => {
        const newTour: Tour = {
            id: `tour_${Date.now()}`,
            name: '',
            description: '',
            dates: [],
        };
        setConfig(prev => ({
            ...prev,
            tours: [...prev.tours, newTour],
        }));
        setHasChanges(true);
    };

    const removeTour = (tourId: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce tour ?')) {
            setConfig(prev => ({
                ...prev,
                tours: prev.tours.filter(tour => tour.id !== tourId),
            }));
            setHasChanges(true);
        }
    };

    const updateTour = (tourId: string, field: keyof Tour, value: any) => {
        setConfig(prev => ({
            ...prev,
            tours: prev.tours.map(tour =>
                tour.id === tourId ? { ...tour, [field]: value } : tour
            ),
        }));
        setHasChanges(true);
    };

    const addDateToTour = (tourId: string) => {
        const newDate: TourDate = {
            id: `date_${Date.now()}`,
            date: '',
            time: '',
        };
        setConfig(prev => ({
            ...prev,
            tours: prev.tours.map(tour =>
                tour.id === tourId
                    ? { ...tour, dates: [...tour.dates, newDate] }
                    : tour
            ),
        }));
        setHasChanges(true);
    };

    const removeDateFromTour = (tourId: string, dateId: string) => {
        setConfig(prev => ({
            ...prev,
            tours: prev.tours.map(tour =>
                tour.id === tourId
                    ? { ...tour, dates: tour.dates.filter(d => d.id !== dateId) }
                    : tour
            ),
        }));
        setHasChanges(true);
    };

    const updateTourDate = (tourId: string, dateId: string, field: keyof TourDate, value: string) => {
        setConfig(prev => ({
            ...prev,
            tours: prev.tours.map(tour =>
                tour.id === tourId
                    ? {
                          ...tour,
                          dates: tour.dates.map(d =>
                              d.id === dateId ? { ...d, [field]: value } : d
                          ),
                      }
                    : tour
            ),
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            const configDoc = doc(db, 'siteConfig', 'main');
            await setDoc(configDoc, config);

            onSave(config);
            setHasChanges(false);
            alert('✅ Configuration sauvegardée avec succès !');
        } catch (err) {
            console.error('Erreur sauvegarde Firebase :', err);
            alert('❌ Erreur lors de la sauvegarde. Vérifiez votre connexion.');
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const maxSize = 400;
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
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    if (!ctx) return reject('Erreur canvas');

                    // Pour les logos, préserver la transparence en utilisant PNG
                    // Détecter si c'est un PNG ou si l'image a de la transparence
                    const isPNG = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
                    
                    if (isPNG) {
                        // Remplir le canvas avec un fond transparent avant de dessiner
                        ctx.clearRect(0, 0, width, height);
                    } else {
                        // Pour JPEG, remplir avec blanc pour éviter les fonds noirs
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, width, height);
                    }

                    // Dessiner l'image
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Utiliser PNG pour préserver la transparence, sinon JPEG avec qualité réduite
                    const compressed = isPNG 
                        ? canvas.toDataURL('image/png', 1.0) // PNG avec qualité maximale pour préserver la transparence
                        : canvas.toDataURL('image/jpeg', 0.85);

                    const sizeKB = Math.round((compressed.length * 3) / 4 / 1024);
                    if (sizeKB > 500) {
                        alert(`⚠️ Image finale trop lourde (${sizeKB} KB). Essayez une image plus petite.`);
                        return reject('Too large');
                    }

                    resolve(compressed);
                };
                img.onerror = () => reject('Erreur chargement image');
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject('Erreur lecture fichier');
            reader.readAsDataURL(file);
        });
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('❌ Veuillez sélectionner une image valide.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('❌ Fichier trop volumineux (max 5 Mo).');
            return;
        }

        try {
            setIsCompressing(true);
            const compressed = await compressImage(file);
            handleChange('logo', compressed);
            const sizeKB = Math.round((compressed.length * 3) / 4 / 1024);
            alert(`✅ Logo mis à jour ! (${sizeKB} KB)`);
        } catch (err) {
            alert('❌ Erreur lors du traitement de l\'image.');
        } finally {
            setIsCompressing(false);
            e.target.value = '';
        }
    };

    const handleRemoveLogo = () => {
        handleChange('logo', '');
        alert('Logo supprimé');
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground text-lg">Chargement de la configuration...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* ==================== HEADER RESPONSIVE ==================== */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Configuration du Site</h2>
                    <p className="text-muted-foreground mt-1">Personnalisez les informations globales de Sirius Expedition</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    {hasChanges && (
                        <div className="self-start sm:self-center">
                            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium">
                                Modifications en attente
                            </span>
                        </div>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Save size={20} />
                        Sauvegarder
                    </motion.button>
                </div>
            </div>

            {/* ==================== GRILLE PRINCIPALE ==================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Informations Générales */}
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <Globe size={24} className="text-primary" />
                        Informations Générales
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Nom du site</label>
                            <input
                                type="text"
                                value={config.siteName}
                                onChange={(e) => handleChange('siteName', e.target.value)}
                                placeholder="Sirius Expedition"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Slogan</label>
                            <input
                                type="text"
                                value={config.tagline}
                                onChange={(e) => handleChange('tagline', e.target.value)}
                                placeholder="Aventures inoubliables à Madagascar"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">Logo du site</label>
                            <div className="space-y-4">
                                {config.logo ? (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-background rounded-xl border border-border">
                                        <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shadow-md flex items-center justify-center flex-shrink-0">
                                            {config.logo.startsWith('data:') || config.logo.startsWith('http') ? (
                                                <img src={config.logo} alt="Logo" className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-4xl">{config.logo}</span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-foreground">Logo actuel</p>
                                            <p className="text-sm text-muted-foreground">Utilisé dans le header et footer</p>
                                        </div>
                                        <button
                                            onClick={handleRemoveLogo}
                                            className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-10 bg-background/50 border-2 border-dashed border-border rounded-xl text-center">
                                        <div className="text-6xl mb-4">🖼️</div>
                                        <p className="text-muted-foreground">Aucun logo défini</p>
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        disabled={isCompressing}
                                        className="w-full px-5 py-4 bg-background border border-border rounded-xl text-foreground file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-medium file:cursor-pointer hover:file:bg-primary/90 disabled:opacity-50"
                                    />
                                    {isCompressing && (
                                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <div className="flex items-center gap-3 text-foreground">
                                                <div className="w-5 h-5 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                Compression en cours...
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
                                    <p className="font-medium text-foreground mb-2">Recommandations :</p>
                                    <ul className="space-y-1 text-muted-foreground text-xs">
                                        <li>• Formats : PNG (transparent), JPG, SVG</li>
                                        <li>• Taille max : 5 Mo → compressé automatiquement</li>
                                        <li>• Dimensions idéales : 300–400 px de largeur</li>
                                        <li>• Taille finale cible : ≤ 500 KB</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <Mail size={24} className="text-primary" />
                        Coordonnées
                    </h3>

                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                            <input
                                type="email"
                                value={config.contact.email}
                                onChange={(e) => handleContactChange('email', e.target.value)}
                                placeholder="contact@siriusexpedition.com"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                            <input
                                type="tel"
                                value={config.contact.phone}
                                onChange={(e) => handleContactChange('phone', e.target.value)}
                                placeholder="+261 34 00 000 00"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">WhatsApp</label>
                            <input
                                type="tel"
                                value={config.contact.whatsapp}
                                onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                                placeholder="+261 34 00 000 00"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
                            <textarea
                                value={config.contact.address}
                                onChange={(e) => handleContactChange('address', e.target.value)}
                                rows={3}
                                placeholder="Lot II Y 456, Antananarivo, Madagascar"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Réseaux sociaux - pleine largeur sur mobile */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                        <Facebook size={24} className="text-primary" />
                        Réseaux Sociaux
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Facebook</label>
                            <input
                                type="url"
                                value={config.social.facebook}
                                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                placeholder="https://facebook.com/siriusexpedition"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">YouTube</label>
                            <input
                                type="url"
                                value={config.social.youtube}
                                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                                placeholder="https://youtube.com/@siriusexpedition"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Instagram</label>
                            <input
                                type="url"
                                value={config.social.instagram}
                                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                placeholder="https://instagram.com/siriusexpedition"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">TripAdvisor</label>
                            <input
                                type="url"
                                value={config.social.tripadvisor}
                                onChange={(e) => handleSocialChange('tripadvisor', e.target.value)}
                                placeholder="https://tripadvisor.com/..."
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Google Business</label>
                            <input
                                type="url"
                                value={config.social.google}
                                onChange={(e) => handleSocialChange('google', e.target.value)}
                                placeholder="https://g.page/siriusexpedition"
                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== SECTION TOURS ET DATES ==================== */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
                            <MapPin size={24} className="text-primary" />
                            Gestion des Tours et Dates
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                            Configurez vos circuits touristiques avec leurs dates et horaires
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addTour}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus size={20} />
                        Nouveau Tour
                    </motion.button>
                </div>

                {config.tours.length === 0 ? (
                    <div className="text-center py-16 bg-background/50 border-2 border-dashed border-border rounded-xl">
                        <MapPin size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                        <h4 className="text-xl font-bold text-foreground mb-2">Aucun tour configuré</h4>
                        <p className="text-muted-foreground mb-6">
                            Commencez par ajouter votre premier circuit touristique
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {config.tours.map((tour, tourIndex) => (
                            <motion.div
                                key={tour.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border-2 border-border rounded-xl p-6 bg-background/50"
                            >
                                {/* En-tête du Tour - responsive */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                            <span className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary font-bold rounded-lg flex-shrink-0">
                                                {tourIndex + 1}
                                            </span>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-foreground mb-2">
                                                    Nom du Tour
                                                </label>
                                                <input
                                                    type="text"
                                                    value={tour.name}
                                                    onChange={(e) => updateTour(tour.id, 'name', e.target.value)}
                                                    placeholder="Ex: Circuit des Baobabs, Tsingy de Bemaraha..."
                                                    className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Description du Circuit
                                            </label>
                                            <textarea
                                                value={tour.description}
                                                onChange={(e) => updateTour(tour.id, 'description', e.target.value)}
                                                placeholder="Décrivez les points forts de ce circuit touristique..."
                                                rows={2}
                                                className="w-full px-5 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary resize-none"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => removeTour(tour.id)}
                                        className="self-start p-3 text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                        title="Supprimer ce tour"
                                    >
                                        <Trash2 size={20} />
                                    </motion.button>
                                </div>

                                {/* Section Dates */}
                                <div className="bg-card border border-border rounded-xl p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                        <div className="flex items-center gap-3">
                                            <Calendar size={20} className="text-primary" />
                                            <h4 className="font-bold text-foreground">
                                                Dates et Horaires
                                                <span className="ml-2 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                                                    {tour.dates.length} {tour.dates.length > 1 ? 'dates' : 'date'}
                                                </span>
                                            </h4>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addDateToTour(tour.id)}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md"
                                        >
                                            <Plus size={18} />
                                            Ajouter une date
                                        </motion.button>
                                    </div>

                                    {tour.dates.length === 0 ? (
                                        <div className="text-center py-10 bg-background/50 border-2 border-dashed border-border rounded-lg">
                                            <Clock size={40} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                                            <p className="text-muted-foreground text-sm">
                                                Aucune date configurée pour ce tour
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {tour.dates.map((tourDate, dateIndex) => (
                                                <motion.div
                                                    key={tourDate.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-all"
                                                >
                                                    <span className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary text-sm font-bold rounded-lg flex-shrink-0">
                                                        {dateIndex + 1}
                                                    </span>

                                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                                        <div>
                                                            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                                                                <Calendar size={14} />
                                                                Date du départ
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={tourDate.date}
                                                                onChange={(e) => updateTourDate(tour.id, tourDate.id, 'date', e.target.value)}
                                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary font-medium"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                                                                <Clock size={14} />
                                                                Heure de départ
                                                            </label>
                                                            <input
                                                                type="time"
                                                                value={tourDate.time}
                                                                onChange={(e) => updateTourDate(tour.id, tourDate.id, 'time', e.target.value)}
                                                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary font-medium"
                                                            />
                                                        </div>
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeDateFromTour(tour.id, tourDate.id)}
                                                        className="self-start sm:self-center p-2.5 text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                                        title="Supprimer cette date"
                                                    >
                                                        <Trash2 size={18} />
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground">
                                            💡 <strong>Astuce :</strong> Vous pouvez ajouter plusieurs dates pour le même tour.
                                            Chaque date peut avoir un horaire différent.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 text-center">
                <p className="text-foreground font-medium">
                    💡 Ces informations apparaissent dans le footer, les pages de contact et les métadonnées SEO du site.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                    Les tours configurés seront disponibles pour la réservation sur le site public.
                </p>
            </div>
        </div>
    );
}