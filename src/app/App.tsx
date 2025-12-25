// src/app/App.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {loading ? (
          /* --- 1. ÉCRAN DE CHARGEMENT ÉLÉGANT --- */
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-foreground"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                borderRadius: ["20%", "50%", "20%"]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-accent mb-6"
            />
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary-foreground font-bold tracking-[0.3em] text-2xl"
            >
              SIRIUS EXPEDITION
            </motion.h2>
            <div className="w-48 h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-accent"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        ) : activeSection === 'admin' ? (
          /* --- 2. LOGIQUE ADMIN --- */
          <motion.div 
            key="admin" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="min-h-screen bg-muted/30"
          >
            {!isAuthenticated ? (
              <AdminLogin />
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
                  <Blogs posts={content.blogPosts} />
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
  );
}

// ✅ EXPORT PAR DÉFAUT (obligatoire)
export default App;