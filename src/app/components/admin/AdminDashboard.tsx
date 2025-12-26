import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Image,
    Package,
    Target,
    Star,
    BookOpen,
    HelpCircle,
    Settings,
    LogOut,
    Download,
    Upload,
    RotateCcw
} from 'lucide-react';
import { HeroEditor } from './sections/HeroEditor';
import { ToursEditor } from './sections/ToursEditor';
import { TourSpecialtiesEditor } from './sections/TourSpecialtiesEditor';
import { ReviewsEditor } from './sections/ReviewsEditor';
import { BlogEditor } from './sections/BlogEditor';
import { FAQEditor } from './sections/FAQEditor';
import { ConfigEditor } from './sections/ConfigEditor';

interface AdminDashboardProps {
    onLogout: () => void;
    onExport: () => void;
    onImport: (file: File) => Promise<void>;
    onReset: () => void;
    content: any;
    onUpdateSection: (section: string, data: any) => void;
}

export function AdminDashboard({ onLogout, onExport, onImport, onReset, content, onUpdateSection }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState('hero');
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const menuItems = [
        { id: 'hero', label: 'Hero Carousel', icon: Image },
        { id: 'tours', label: 'Best Sellers', icon: Package },
        { id: 'specialties', label: 'Tour Specialties', icon: Target },
        { id: 'reviews', label: 'Témoignages', icon: Star },
        { id: 'blog', label: 'Articles Blog', icon: BookOpen },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
        { id: 'config', label: 'Configuration', icon: Settings },
    ];

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                try {
                    await onImport(file);
                    alert('Contenu importé avec succès !');
                } catch (error) {
                    alert('Erreur lors de l\'importation');
                }
            }
        };
        input.click();
    };

    const handleReset = () => {
        if (showResetConfirm) {
            onReset();
            setShowResetConfirm(false);
            alert('Contenu réinitialisé !');
        } else {
            setShowResetConfirm(true);
            setTimeout(() => setShowResetConfirm(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* ========== LEFT SIDEBAR - COLLÉE À GAUCHE ========== */}
            <aside className="w-64 min-h-screen bg-card border-r border-border fixed left-0 top-0 bottom-0 z-40">
                <div className="p-4 h-full flex flex-col">
                    {/* Logo / Header de la sidebar */}
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                            <LayoutDashboard className="text-primary-foreground" size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-foreground">Admin Dashboard</h1>
                            <p className="text-xs text-muted-foreground">Sirius Expedition</p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1 flex-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ x: 4 }}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === item.id
                                            ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg'
                                            : 'text-foreground hover:bg-muted'
                                    }`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </motion.button>
                            );
                        })}
                    </nav>

                    {/* Bouton de déconnexion en bas */}
                    <div className="pt-4 border-t border-border">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onLogout}
                            className="w-full px-4 py-2.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <LogOut size={16} />
                            Déconnexion
                        </motion.button>
                    </div>
                </div>
            </aside>

            {/* ========== CONTENU PRINCIPAL AVEC MARGIN LEFT ========== */}
            <div className="flex-1 ml-64 w-full">
                {/* Header - AVEC PADDING ÉGAL DES DEUX CÔTÉS */}
                <header className="bg-card border-b border-border sticky top-0 z-30 backdrop-blur-xl bg-card/80 w-full">
                    <div className="w-full px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">
                                    {menuItems.find(item => item.id === activeTab)?.label}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Gérez le contenu de cette section
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onExport}
                                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2 text-sm font-medium text-foreground transition-colors"
                                >
                                    <Download size={16} />
                                    Exporter
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleImport}
                                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg flex items-center gap-2 text-sm font-medium text-foreground transition-colors"
                                >
                                    <Upload size={16} />
                                    Importer
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleReset}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                                        showResetConfirm
                                            ? 'bg-destructive text-destructive-foreground'
                                            : 'bg-muted hover:bg-muted/80 text-foreground'
                                    }`}
                                >
                                    <RotateCcw size={16} />
                                    {showResetConfirm ? 'Confirmer ?' : 'Reset'}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenu principal - AVEC PADDING ÉGAL */}
                <main className="w-full p-8">
                    <div className="bg-card rounded-2xl border border-border p-6 min-h-[600px]">
                        {activeTab === 'hero' && (
                            <HeroEditor
                                slides={content.heroSlides}
                                onSave={(slides) => onUpdateSection('heroSlides', slides)}
                            />
                        )}

                        {activeTab === 'tours' && (
                            <ToursEditor
                                tours={content.bestSellers}
                                onSave={(tours) => onUpdateSection('bestSellers', tours)}
                            />
                        )}

                        {activeTab === 'specialties' && (
                            <TourSpecialtiesEditor
                                specialties={content.tourSpecialties}
                                onSave={(specialties) => onUpdateSection('tourSpecialties', specialties)}
                            />
                        )}

                        {activeTab === 'reviews' && (
                            <ReviewsEditor
                                reviews={content.reviews}
                                onSave={(reviews) => onUpdateSection('reviews', reviews)}
                            />
                        )}

                        {activeTab === 'blog' && (
                            <BlogEditor
                                posts={content.blogPosts}
                                onSave={(posts) => onUpdateSection('blogPosts', posts)}
                            />
                        )}

                        {activeTab === 'faq' && (
                            <FAQEditor
                                faqs={content.faqs}
                                onSave={(faqs) => onUpdateSection('faqs', faqs)}
                            />
                        )}

                        {activeTab === 'config' && (
                            <ConfigEditor
                                config={content.siteConfig}
                                onSave={(config) => onUpdateSection('siteConfig', config)}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}