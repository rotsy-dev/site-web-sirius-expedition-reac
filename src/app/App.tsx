import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { ContactModal } from './components/ContactModal';

// Provider de notifications
import { ToastProvider } from '../components/shared/Toast';

// Composants Publics
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { BestSellers } from './components/BestSellers';
import { TourSpecialties } from './components/TourSpecialties';
import { Reviews } from './components/Reviews';
import { VideoGallery } from './components/VideoGallery';
import { Blogs } from './components/Blogs';
import { Contact } from './components/Contact';
import { AboutUs } from './components/AboutUs';
import { Footer } from './components/Footer';
import { QuoteRequest } from './components/QuoteRequest';
import { MadagascarGallery } from './components/MadagascarGallery';

// Composants Admin
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useContentManager } from '../hooks/useContentManager';
import { SITE_SECTIONS } from '../constants';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [pendingTour, _setPendingTour] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const {
    content,
    loading,
    updateSection,
    resetToDefaults,
    exportContent,
    importContent,
    isAuthenticated,
    logout,
  } = useContentManager();

  // Sélectionner les circuits marqués comme "Best Seller" dans les spécialités de tours
  const bestSellerTours = (content.tourSpecialties || []).filter(
    (tour: any) => tour.isBestSeller
  );

  // UseEffect pour scroller en haut à chaque changement de section
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  // UseEffect pour détecter le scroll et afficher/masquer le bouton
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour scroller en haut de la page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <AnimatePresence mode="wait">
          {loading ? (
            /* --- 1. ÉCRAN DE CHARGEMENT --- */
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1A1A1A]"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  borderRadius: ["20%", "50%", "20%"]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-br from-[#D4A373] to-[#A67C52] mb-6"
              />
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white font-bold tracking-[0.3em] text-2xl"
              >
                SIRIUS EXPEDITION
              </motion.h2>
            </motion.div>
          ) : activeSection === 'admin' ? (
            /* --- 2. LOGIQUE ADMIN --- */
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen bg-muted/30"
            >
              {!isAuthenticated ? (
                <AdminLogin onBack={() => setActiveSection('home')} />
              ) : (
                <AdminDashboard
                  onLogout={() => {
                    logout();
                    setActiveSection('home');
                  }}
                  onExport={exportContent}
                  onImport={importContent}
                  onReset={resetToDefaults}
                  content={content}
                  onUpdateSection={updateSection}
                />
              )}
            </motion.div>
          ) : (
            /* --- 3. SITE PUBLIC --- */
            <motion.div
              key="site"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Header
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                siteConfig={content.siteConfig}
              />

              <main>
                {activeSection === 'home' && (
                  <>
                    <HeroCarousel
                      slides={content.heroSlides}
                      content={content}
                      onNavigateToContact={() => setActiveSection('contact')}
                      onNavigateToTours={() => setActiveSection('tours')}
                    />
                    <BestSellers
                      tours={bestSellerTours}
                      content={content}
                      onNavigateToTour={() => {
                        setActiveSection('tours');
                      }}
                    />
                    <VideoGallery
                      videos={content.videoGallery || []}
                      config={content.siteConfig}
                      content={content}
                    />
                    <MadagascarGallery content={content} />
                    <Reviews
                      reviews={content.reviews}
                      config={content.siteConfig as any}
                      content={content}
                    />
                  </>
                )}

                {activeSection === 'tours' && (
                  <div className="min-h-screen bg-[#FAF7F2]">
                    <TourSpecialties
                      specialties={content.tourSpecialties}
                      initialSelectedTour={pendingTour}
                      content={content}
                      onNavigateToQuote={() => setActiveSection(SITE_SECTIONS.QUOTE)}
                    />
                    <BestSellers
                      tours={bestSellerTours}
                      content={content}
                    />
                  </div>
                )}

                {activeSection === 'blogs' && (
                  <Blogs content={content} />
                )}

                {activeSection === 'contact' && (
                  <Contact
                    config={content.siteConfig}
                    content={content}
                  />
                )}

                {activeSection === 'quote' && (
                  <QuoteRequest
                    config={content.siteConfig}
                    content={content}
                  />
                )}

                {activeSection === 'about' && (
                  <AboutUs
                    config={content.siteConfig}
                    content={content}
                  />
                )}
              </main>

              <Footer
                setActiveSection={setActiveSection}
                config={content.siteConfig as any}
              />

              {/* BOUTON SCROLL TO TOP */}
              <AnimatePresence>
                {showScrollTop && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#A68966] text-white rounded-full shadow-2xl hover:bg-[#8B7355] transition-all flex items-center justify-center group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* FLOATING CONTACT BUTTON */}
              <AnimatePresence>
                {!isContactModalOpen && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    onClick={() => setIsContactModalOpen(true)}
                    className={`fixed right-8 z-50 w-14 h-14 bg-[#443C34] text-white rounded-full shadow-2xl hover:bg-[#2c2620] transition-all flex items-center justify-center group ${showScrollTop ? 'bottom-24' : 'bottom-8'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                    {/* Pulse indicator */}
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                  </motion.button>
                )}
              </AnimatePresence>

              <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                config={content.siteConfig}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastProvider>
  );
}

export default App;