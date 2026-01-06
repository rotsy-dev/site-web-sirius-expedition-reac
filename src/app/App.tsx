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
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
            >
              {/* Image de fond - Avenue des Baobabs */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071)',
                }}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />

              {/* Flash blanc - effet de prise de photo */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.5, delay: 0.8 }}
              />

              {/* Overlay sombre progressif */}
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 2, delay: 1.5 }}
              />

              {/* Icône appareil photo avec effet de clic */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{
                  scale: [1.5, 1, 1.05, 1],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 2.5,
                  times: [0, 0.3, 0.5, 1],
                  delay: 0.5
                }}
              >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </motion.div>

              {/* Son effet "clic" visuel - cercles concentriques */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 2.5],
                  opacity: [0.6, 0]
                }}
                transition={{ duration: 1.2, delay: 0.6 }}
              >
                <div className="w-40 h-40 border-2 border-white rounded-full" />
              </motion.div>

              {/* Contenu principal */}
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1.2 }}
              >
                {/* Nom de la marque */}
                <div className="text-center mb-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 1.2 }}
                    className="text-white font-bold tracking-[0.3em] text-4xl mb-4 drop-shadow-2xl"
                  >
                    SIRIUS EXPEDITION
                  </motion.h2>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 4, duration: 1 }}
                    className="h-px w-48 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent mx-auto mb-4"
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 5.2, duration: 1 }}
                    className="text-[#D4A373] text-base tracking-[0.3em] font-light"
                  >
                    DISCOVER MADAGASCAR
                  </motion.p>
                </div>

                {/* Barre de progression simple et élégante */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 6.5, duration: 0.8 }}
                  className="w-64 h-0.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-[#D4A373] to-transparent"
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>

                {/* Texte de chargement simple */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.9, 0.4] }}
                  transition={{ delay: 6.8, duration: 2, repeat: Infinity }}
                  className="text-white/60 text-sm mt-6 tracking-[0.2em] font-light"
                >
                  LOADING...
                </motion.p>
              </motion.div>

              {/* Cadres photo minimalistes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 3.5, duration: 1.5 }}
              >
                <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-white/50" />
                <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-white/50" />
                <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-white/50" />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-white/50" />
              </motion.div>
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