import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { ContactModal } from './components/ContactModal';

// SEO
import SEO from '../components/SEO';
import { getSEOForPage } from '../config/seoConfig';

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
import { FAQPage } from './components/FAQPage';
import { QuoteRequest } from './components/QuoteRequest';
import { MadagascarGallery } from './components/MadagascarGallery';
import { CookieConsent } from '../components/common/CookieConsent';

// Composants Admin
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useContentManager } from '../hooks/useContentManager';
import { SITE_SECTIONS } from '../constants';

// ============================================
// LAZY LOADING - Pages légales
// ============================================
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/legal/PrivacyPage'));
const CookiesPage = lazy(() => import('./pages/legal/CookiesPage'));

// ============================================
// LOADER POUR PAGES LAZY
// ============================================
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
    <div className="w-12 h-12 border-3 border-[#A68966] border-t-transparent rounded-full animate-spin" />
  </div>
);

// Cache keys
const CACHE_VERSION = '1.0';
const CACHE_KEYS = {
  heroSlides: `hero_slides_v${CACHE_VERSION}`,
  bestSellers: `best_sellers_v${CACHE_VERSION}`,
  videoGallery: `video_gallery_v${CACHE_VERSION}`,
  reviews: `reviews_v${CACHE_VERSION}`,
  tourSpecialties: `tour_specialties_v${CACHE_VERSION}`,
};

// ============================================
// COMPOSANT POUR GÉRER LE SEO PAR PAGE
// ============================================
const PageSEO = ({ page }: { page: string }) => {
  const { lang } = useParams<{ lang: string }>();
  const seoData = getSEOForPage(page, (lang || 'en') as any);

  return (
    <SEO
      title={seoData.title}
      description={seoData.description}
      keywords={seoData.keywords}
      image={seoData.image}
      type={seoData.type}
      schema={seoData.schema}
      lang={lang || 'en'}
      noindex={seoData.noindex}
    />
  );
}

// Wrapper pour les routes avec langue
const LanguageRoutes = () => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingTour, _setPendingTour] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const {
    content,
    updateSection,
    resetToDefaults,
    exportContent,
    importContent,
  } = useContentManager();

  // ============= CACHE POUR HERO SLIDES =============
  const [cachedHeroSlides, setCachedHeroSlides] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEYS.heroSlides);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Erreur cache heroSlides:', e);
      }
    }
    return content.heroSlides || [];
  });

  useEffect(() => {
    if (content.heroSlides && content.heroSlides.length > 0) {
      setCachedHeroSlides(content.heroSlides);
      localStorage.setItem(CACHE_KEYS.heroSlides, JSON.stringify(content.heroSlides));
    }
  }, [content.heroSlides]);

  // ============= CACHE POUR BEST SELLERS =============
  const [cachedBestSellers, setCachedBestSellers] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEYS.bestSellers);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Erreur cache bestSellers:', e);
      }
    }
    return [];
  });

  useEffect(() => {
    const bestSellerTours = (content.tourSpecialties || []).filter(
      (tour: any) => tour.isBestSeller
    );
    if (bestSellerTours.length > 0) {
      setCachedBestSellers(bestSellerTours);
      localStorage.setItem(CACHE_KEYS.bestSellers, JSON.stringify(bestSellerTours));
    }
  }, [content.tourSpecialties]);

  // ============= CACHE POUR VIDEO GALLERY =============
  const [cachedVideoGallery, setCachedVideoGallery] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEYS.videoGallery);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Erreur cache videoGallery:', e);
      }
    }
    return content.videoGallery || [];
  });

  useEffect(() => {
    if (content.videoGallery && content.videoGallery.length > 0) {
      setCachedVideoGallery(content.videoGallery);
      localStorage.setItem(CACHE_KEYS.videoGallery, JSON.stringify(content.videoGallery));
    }
  }, [content.videoGallery]);

  // ============= CACHE POUR REVIEWS =============
  const [cachedReviews, setCachedReviews] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEYS.reviews);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Erreur cache reviews:', e);
      }
    }
    return content.reviews || [];
  });

  useEffect(() => {
    if (content.reviews && content.reviews.length > 0) {
      setCachedReviews(content.reviews);
      localStorage.setItem(CACHE_KEYS.reviews, JSON.stringify(content.reviews));
    }
  }, [content.reviews]);

  // ============= CACHE POUR TOUR SPECIALTIES =============
  const [cachedTourSpecialties, setCachedTourSpecialties] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEYS.tourSpecialties);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Erreur cache tourSpecialties:', e);
      }
    }
    return content.tourSpecialties || [];
  });

  useEffect(() => {
    if (content.tourSpecialties && content.tourSpecialties.length > 0) {
      setCachedTourSpecialties(content.tourSpecialties);
      localStorage.setItem(CACHE_KEYS.tourSpecialties, JSON.stringify(content.tourSpecialties));
    }
  }, [content.tourSpecialties]);

  // Fonction pour naviguer avec la langue
  const setActiveSection = (section: string) => {
    const routes: Record<string, string> = {
      'home': `/${lang}`,
      'tours': `/${lang}/tours`,
      'blogs': `/${lang}/blog`,
      'contact': `/${lang}/contact`,
      'quote': `/${lang}/quote`,
      'about': `/${lang}/about`,
    };
    navigate(routes[section] || `/${lang}`);
  };

  // Déterminer la section active basée sur l'URL
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === `/${lang}` || path === `/${lang}/`) return 'home';
    if (path.startsWith(`/${lang}/tours`)) return 'tours';
    if (path.startsWith(`/${lang}/blog`)) return 'blogs';
    if (path === `/${lang}/contact`) return 'contact';
    if (path === `/${lang}/quote`) return 'quote';
    if (path === `/${lang}/about`) return 'about';
    return 'home';
  };

  const activeSection = getActiveSection();

  // UseEffect pour scroller en haut à chaque changement de route (sauf changement de langue)
  const prevPathRef = useRef<string>('');
  const scrollPositionRef = useRef<number>(0);
  
  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;
    
    // Extraire les chemins sans la langue (ex: /fr/blog -> /blog, /en/blog -> /blog)
    const getPathWithoutLang = (path: string) => {
      const segments = path.split('/').filter(Boolean);
      if (segments.length > 0 && ['en', 'fr', 'de', 'it'].includes(segments[0])) {
        return '/' + segments.slice(1).join('/');
      }
      return path;
    };
    
    const currentPathWithoutLang = getPathWithoutLang(currentPath);
    const prevPathWithoutLang = getPathWithoutLang(prevPath);
    
    // Si c'est juste un changement de langue (même chemin sans langue), restaurer la position
    if (currentPathWithoutLang === prevPathWithoutLang && prevPath !== '') {
      // C'est un changement de langue, restaurer la position de scroll
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 100);
    } else {
      // C'est un vrai changement de route, scroller en haut
      window.scrollTo(0, 0);
    }
    
    // Sauvegarder la position actuelle avant le changement
    scrollPositionRef.current = window.scrollY;
    prevPathRef.current = currentPath;
  }, [location.pathname]);

  // UseEffect pour détecter le scroll (optimisé avec requestAnimationFrame)
  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 500);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      ticking = false;
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      key="site"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ willChange: 'opacity' }}
    >
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        siteConfig={content.siteConfig}
      />

      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Page d'accueil */}
            <Route index element={
              <>
                <PageSEO page="home" />
                <HeroCarousel
                  slides={cachedHeroSlides}
                  onNavigateToContact={() => setActiveSection('contact')}
                  onNavigateToTours={() => setActiveSection('tours')}
                />
                <BestSellers
                  tours={cachedBestSellers}
                  content={content}
                  onNavigateToTour={() => {
                    setActiveSection('tours');
                  }}
                />
                <VideoGallery
                  videos={cachedVideoGallery}
                  config={content.siteConfig}
                  onNavigateToContact={() => setActiveSection('contact')}
                  content={content}
                />
                <MadagascarGallery content={content} />
                <Reviews
                  reviews={cachedReviews}
                  config={content.siteConfig as any}
                  content={content}
                />
              </>
            } />

            {/* Page Tours */}
            <Route path="tours" element={
              <div className="min-h-screen bg-[#FAF7F2]">
                <PageSEO page="tours" />
                <TourSpecialties
                  specialties={cachedTourSpecialties}
                  initialSelectedTour={pendingTour}
                  content={content}
                  onNavigateToQuote={() => setActiveSection(SITE_SECTIONS.QUOTE)}
                />
              </div>
            } />

            {/* Page Tours (avec slug dans l'URL) - ouvre la modal automatiquement */}
            <Route path="tours/:slug" element={
              <div className="min-h-screen bg-[#FAF7F2]">
                <PageSEO page="tours" />
                <TourSpecialties
                  specialties={cachedTourSpecialties}
                  initialSelectedTour={pendingTour}
                  content={content}
                  onNavigateToQuote={() => setActiveSection(SITE_SECTIONS.QUOTE)}
                />
              </div>
            } />

            {/* Page Liste des Blogs */}
            <Route path="blog" element={
              <>
                <PageSEO page="blog" />
                <Blogs content={content} />
              </>
            } />

            {/* Page Détail du Blog (Slug) */}
            <Route path="blog/:slug" element={<Blogs content={content} isDetail={true} />} />

            {/* Page Contact */}
            <Route path="contact" element={
              <>
                <PageSEO page="contact" />
                <Contact
                  config={content.siteConfig}
                  content={content}
                />
              </>
            } />

            {/* Page Devis */}
            <Route path="quote" element={
              <>
                <PageSEO page="quote" />
                <QuoteRequest
                  config={content.siteConfig}
                  content={content}
                />
              </>
            } />

            {/* Page À propos */}
            <Route path="about" element={
              <>
                <PageSEO page="about" />
                <AboutUs
                  config={content.siteConfig}
                  content={content}
                />
              </>
            } />

            <Route path="faqs" element={
              <>
                <PageSEO page="faq" />
                <FAQPage
                  onNavigateToContact={() => setActiveSection('contact')}
                  content={content}
                />
              </>
            } />

            {/* ========== PAGES LÉGALES (LAZY) ========== */}
            <Route path="terms" element={
              <>
                <PageSEO page="terms" />
                <TermsPage currentLang={lang || 'en'} />
              </>
            } />
            <Route path="privacy" element={
              <>
                <PageSEO page="privacy" />
                <PrivacyPage currentLang={lang || 'en'} />
              </>
            } />
            <Route path="cookies" element={
              <>
                <PageSEO page="cookies" />
                <CookiesPage currentLang={lang || 'en'} />
              </>
            } />
          </Routes>
        </Suspense>
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
            className="cursor-pointer fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#A68966] text-white rounded-full shadow-2xl hover:bg-[#8B7355] transition-all flex items-center justify-center group"
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
            className={`cursor-pointer fixed right-8 z-50 w-14 h-14 bg-[#443C34] text-white rounded-full shadow-2xl hover:bg-[#2c2620] transition-all flex items-center justify-center group ${showScrollTop ? 'bottom-24' : 'bottom-8'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
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
  );
};

function App() {
  const {
    loading,
    isAuthenticated,
    logout,
    updateSection,
    exportContent,
    importContent,
    resetToDefaults,
    content,
  } = useContentManager();

  // État pour contrôler l'affichage du contenu après le loader
  const [contentReady, setContentReady] = useState(false);

  // Délai avant d'afficher le contenu pour éviter le flash du footer
  useEffect(() => {
    if (!loading && !contentReady) {
      const timer = setTimeout(() => {
        setContentReady(true);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [loading, contentReady]);

  // Reset contentReady quand loading recommence
  useEffect(() => {
    if (loading) {
      setContentReady(false);
    }
  }, [loading]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black"
            >
              {/* Image de fond - Avenue des Baobabs */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=2071)',
                }}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />

              {/* Flash blanc - effet de prise de photo */}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.3, delay: 0.4 }}
              />

              {/* Overlay sombre progressif */}
              <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Icône appareil photo avec effet de clic */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{
                  scale: [1.3, 1, 1.05, 1],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 1.2,
                  times: [0, 0.3, 0.5, 1],
                  delay: 0.3
                }}
              >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </motion.div>

              {/* Cercles concentriques */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 2],
                  opacity: [0.6, 0]
                }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="w-40 h-40 border-2 border-white rounded-full" />
              </motion.div>

              {/* Contenu principal */}
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {/* Nom de la marque */}
                <div className="text-center mb-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-white font-bold tracking-[0.3em] text-4xl mb-4 drop-shadow-2xl"
                  >
                    SIRIUS EXPEDITION
                  </motion.h2>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.8, duration: 0.6 }}
                    className="h-px w-48 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent mx-auto mb-4"
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.2, duration: 0.8 }}
                    className="text-[#D4A373] text-base tracking-[0.3em] font-light"
                  >
                    DISCOVER MADAGASCAR
                  </motion.p>
                </div>

                {/* Barre de progression simple */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.8, duration: 0.5 }}
                  className="w-64 h-0.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-[#D4A373] to-transparent"
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>

                {/* Texte de chargement */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.9, 0.4] }}
                  transition={{ delay: 3, duration: 1.5, repeat: Infinity }}
                  className="text-white/60 text-sm mt-6 tracking-[0.2em] font-light"
                >
                  LOADING...
                </motion.p>
              </motion.div>

              {/* Cadres photo minimalistes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-white/50" />
                <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-white/50" />
                <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-white/50" />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-white/50" />
              </motion.div>
            </motion.div>
          ) : contentReady ? (
            <Routes>
              {/* Route Admin */}
              <Route path="/admin" element={
                <motion.div
                  key="admin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-screen bg-muted/30"
                >
                  {!isAuthenticated ? (
                    <AdminLogin onBack={() => window.location.href = '/en'} />
                  ) : (
                    <AdminDashboard
                      onLogout={() => {
                        logout();
                        window.location.href = '/en';
                      }}
                      onExport={exportContent}
                      onImport={importContent}
                      onReset={resetToDefaults}
                      content={content}
                      onUpdateSection={updateSection}
                    />
                  )}
                </motion.div>
              } />

              {/* Redirection de la racine vers /en */}
              <Route path="/" element={<Navigate to="/en" replace />} />

              {/* Routes avec langue */}
              <Route path="/:lang/*" element={<LanguageRoutes />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/en" replace />} />
            </Routes>
          ) : null}
        </AnimatePresence>
      </div>
      <CookieConsent />
    </ToastProvider>
  );
}

export default App;