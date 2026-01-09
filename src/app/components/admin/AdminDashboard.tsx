import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    RotateCcw,
    Film,
    Type,
    HistoryIcon,
    Menu,
    X,
    FileText,
    ShieldCheck
    
} from 'lucide-react';
import { HeroEditor } from './sections/HeroEditor';
import { ToursEditor } from './sections/ToursEditor';
import { TourSpecialtiesEditor } from './sections/TourSpecialtiesEditor';
import { ReviewsEditor } from './sections/ReviewsEditor';
import { BlogEditor } from './sections/BlogEditor';
import TermsConditionsEditor from './sections/TermsConditionsEditor';
import { FAQEditor } from './sections/FAQEditor';
import { ConfigEditor } from './sections/ConfigEditor';
import VideoConfigEditor from './sections/VideoConfigEditor';
import { PageHeadersEditor } from './sections/PageHeadersEditor';
import { AboutEditor } from './sections/AboutEditor';
import { GalleryEditor } from './sections/GalleryEditor';
import  PrivacyPolicyEditor  from './sections/PrivacyPolicyEditor';


interface AdminDashboardProps {
    onLogout: () => void;
    onExport: () => void;
    onImport: (file: File) => Promise<void>;
    onReset: () => void;
    content: any;
    onUpdateSection: (section: string, data: any) => void;
}

export function AdminDashboard({
    onLogout,
    onExport,
    onImport,
    onReset,
    content,
    onUpdateSection
}: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState('hero');
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuItems = [
        { id: 'hero', label: 'Hero Carousel', icon: Image },
        { id: 'tours', label: 'Best Sellers', icon: Package },
        { id: 'specialties', label: 'Tour Specialties', icon: Target },
        { id: 'reviews', label: 'Témoignages', icon: Star },
        { id: 'blog', label: 'Articles Blog', icon: BookOpen },
        { id: 'faq', label: 'FAQ', icon: HelpCircle },
        { id: 'config', label: 'Configuration', icon: Settings },
        { id: 'videos', label: 'Videos', icon: Film },
        { id: 'gallery', label: 'Image Gallery', icon: Image },
        { id: 'headers', label: 'Page Headers', icon: Type },
        { id: 'about', label: 'Our Story', icon: HistoryIcon },
        { id: 'terms', label: 'Terms & Conditions', icon: FileText},
        { id : 'Privacy', label: 'Privacy Policy', icon: ShieldCheck}
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
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Overlay sombre pour mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                    fixed md:static
                    top-0 left-0 bottom-0
                    w-64
                    bg-card border-r border-border
                    z-50
                    transition-transform duration-300 ease-in-out
                    flex flex-col
                `}
            >
                <div className="p-4 h-full flex flex-col">
                    {/* Header sidebar */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                                <LayoutDashboard className="text-primary-foreground" size={20} />
                            </div>
                            <div>
                                <h1 className="text-sm font-bold text-foreground">Admin Dashboard</h1>
                                <p className="text-xs text-muted-foreground">Sirius Expedition</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="md:hidden p-1 rounded-lg hover:bg-muted"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1 flex-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ x: 4 }}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsSidebarOpen(false);
                                    }}
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

                    {/* Déconnexion */}
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

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-card border-b border-border sticky top-0 z-30 backdrop-blur-xl bg-card/80">
                    <div className="px-4 sm:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="md:hidden p-2 rounded-lg hover:bg-muted"
                            >
                                <Menu size={24} />
                            </button>

                            <div>
                                <h2 className="text-xl font-bold text-foreground">
                                    {menuItems.find((item) => item.id === activeTab)?.label}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Gérez le contenu de cette section
                                </p>
                            </div>
                        </div>

                        {/* Boutons d'action - version desktop/tablette */}
                        <div className="hidden sm:flex items-center gap-2">
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

                        {/* Boutons d'action - version mobile (icônes uniquement) */}
                        <div className="flex sm:hidden items-center gap-2">
                            <motion.button whileTap={{ scale: 0.9 }} onClick={onExport} className="p-2 bg-muted rounded-lg">
                                <Download size={18} />
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={handleImport} className="p-2 bg-muted rounded-lg">
                                <Upload size={18} />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleReset}
                                className={`p-2 rounded-lg ${showResetConfirm ? 'bg-destructive text-destructive-foreground' : 'bg-muted'}`}
                            >
                                <RotateCcw size={18} />
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 min-h-[600px]">
                        {activeTab === 'headers' && (
                            <PageHeadersEditor
                                headers={content.pageHeaders}
                                onSave={(headers) => onUpdateSection('pageHeaders', headers)}
                            />
                        )}
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
                        {activeTab === 'videos' && (
                            <VideoConfigEditor
                                videos={content.videoGallery}
                                config={content.siteConfig.videos}
                                onSaveVideos={(videos) => onUpdateSection('videoGallery', videos)}
                                onSaveConfig={(config) =>
                                    onUpdateSection('siteConfig', {
                                        ...content.siteConfig,
                                        videos: config
                                    })
                                }
                            />
                        )}
                        {activeTab === 'gallery' && (
                            <GalleryEditor
                                images={content.imageGallery || []}
                                onSave={(images) => onUpdateSection('imageGallery', images)}
                            />
                        )}
                        {activeTab === 'about' && (
                            <AboutEditor
                                story={content.ourStory}
                                onSave={(story) => onUpdateSection('ourStory', story)}
                            />
                        )}
                        {activeTab === 'config' && (
                            <ConfigEditor
                                config={content.siteConfig}
                                onSave={(config) => onUpdateSection('siteConfig', config)}
                            />
                        )}

                        {activeTab === 'terms' && <TermsConditionsEditor />}
                        {activeTab === 'Privacy' && <PrivacyPolicyEditor />}
                    </div>
                </main>
            </div>
        </div>
    );
}