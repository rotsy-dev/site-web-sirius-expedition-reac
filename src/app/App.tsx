import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
import {Contact} from './components/Contact';
import { AboutUs } from './components/AboutUs';
import { Footer } from './components/Footer';

// Composants Admin
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useContentManager } from '../hooks/useContentManager';

function App() {
  const [activeSection, setActiveSection] = useState('home');

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

  // UseEffect pour croller en haut à chaque changement de section
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);


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
                <AdminLogin onBack={() => setActiveSection('home')}/>
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
                    <HeroCarousel slides={content.heroSlides} />
                    <BestSellers tours={content.bestSellers} />
                    <TourSpecialties specialties={content.tourSpecialties} />
                    <VideoGallery
                      videos={content.videoGallery || []}
                      config={content.siteConfig}
                    />
                    <Reviews
                      reviews={content.reviews}
                      config={content.siteConfig}
                    />
                  </>
                )}

                {activeSection === 'tours' && (
                  <div className="pt-20">
                    <TourSpecialties specialties={content.tourSpecialties} />
                    <BestSellers tours={content.bestSellers} />
                  </div>
                )}

                {activeSection === 'blogs' && (
                  <div className="pt-20">
                   <Blogs />
                  </div>
                )}

                {activeSection === 'contact' && (
                  <div className="pt-20">
                    <Contact config={content.siteConfig} />
                  </div>
                )}

                {activeSection === 'about' && (
                  <div className="pt-20">
                    <AboutUs config={content.siteConfig} />
                  </div>
                )}
              </main>

              <Footer
                setActiveSection={setActiveSection}
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