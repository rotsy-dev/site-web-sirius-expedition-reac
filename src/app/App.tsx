import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageCircle } from 'lucide-react';

// Providers
import { ToastProvider } from '../components/shared/Toast';
import { ContactModal } from './components/ContactModal';

// Composants Publics
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { BestSellers } from './components/BestSellers';
import { VideoGallery } from './components/VideoGallery';
import { Blogs } from './components/Blogs'; // Votre composant existant
import { Contact } from './components/Contact';
import { AboutUs } from './components/AboutUs';
import { Footer } from './components/Footer'; // Votre footer existant
import { QuoteRequest } from './components/QuoteRequest';
import { MadagascarGallery } from './components/MadagascarGallery';
import { TourSpecialties } from './components/TourSpecialties';
import { Reviews } from './components/Reviews';

// Composants Admin
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Hooks et Constantes
import { useContentManager } from '../hooks/useContentManager';

const GlobalLoader = () => (
  <motion.div
    key="loader"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.3 } }}
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
  >
    <motion.div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071)' }}
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
    <div className="relative z-10 flex flex-col items-center text-center">
      <h2 className="text-white font-bold tracking-[0.3em] text-4xl mb-4">SIRIUS EXPEDITION</h2>
      <p className="text-[#D4A373] text-base tracking-[0.3em] font-light">LOADING...</p>
    </div>
  </motion.div>
);

/**
 * Layout pour le site public
 */
const PublicLayout = ({ content }: { content: any }) => {
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header siteConfig={content.siteConfig} />

      <main className="flex-grow">
        <Routes>
          {/* Accueil */}
          <Route path="/" element={
            <>
              <HeroCarousel slides={content.heroSlides} />
              <BestSellers tours={content.tourSpecialties?.filter((t: any) => t.isBestSeller)} content={content} />
              <VideoGallery videos={content.videoGallery || []} config={content.siteConfig} content={content} />
              <MadagascarGallery content={content} />
              <Reviews reviews={content.reviews} config={content.siteConfig} content={content} />
            </>
          } />

          {/* Page Liste des Blogs */}
          <Route path="/blog" element={<Blogs content={content} />} />

          {/* Page Détail du Blog (Slug) - Utilise le même composant avec isDetail */}
          <Route path="/blog/:slug" element={<Blogs content={content} isDetail={true} />} />

          {/* Autres Pages */}
          <Route path="/tours" element={<TourSpecialties specialties={content.tourSpecialties} content={content} />} />
          <Route path="/about-us" element={<AboutUs config={content.siteConfig} content={content} />} />
          <Route path="/contact" element={<Contact config={content.siteConfig} content={content} />} />
          <Route path="/ask-a-quote" element={<QuoteRequest config={content.siteConfig} content={content} />} />
        </Routes>
      </main>

      {/* Votre Footer existant sans changement de props */}
      <Footer
        config={content.siteConfig}
        setActiveSection={(id) => console.log('Nav to:', id)}
      />

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#A68966] text-white rounded-full shadow-2xl flex items-center justify-center"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsContactModalOpen(true)}
        className={`fixed right-8 z-50 w-14 h-14 bg-[#443C34] text-white rounded-full shadow-2xl flex items-center justify-center ${showScrollTop ? 'bottom-24' : 'bottom-8'}`}
      >
        <MessageCircle size={24} />
      </motion.button>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} config={content.siteConfig} />
    </div>
  );
};

function App() {
  const { content, loading, isAuthenticated, logout, updateSection, exportContent, importContent, resetToDefaults } = useContentManager();

  return (
    <ToastProvider>
      {/* BrowserRouter supprimé ici car présent dans main.tsx */}
      <AnimatePresence mode="wait">
        {loading ? (
          <GlobalLoader key="loader" />
        ) : (
          <Routes>
            <Route path="/admin" element={
              !isAuthenticated ? (
                <AdminLogin onBack={() => window.location.href = '/'} />
              ) : (
                <AdminDashboard
                  onLogout={logout}
                  onExport={exportContent}
                  onImport={importContent}
                  onReset={resetToDefaults}
                  content={content}
                  onUpdateSection={updateSection}
                />
              )
            } />

            <Route path="/" element={<Navigate to="/fr" replace />} />
            <Route path="/:lang/*" element={<PublicLayout content={content} />} />
            <Route path="*" element={<Navigate to="/fr" replace />} />
          </Routes>
        )}
      </AnimatePresence>
    </ToastProvider>
  );
}

export default App;