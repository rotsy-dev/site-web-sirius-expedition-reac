// src/app/App.tsx
import * as React from 'react';
import { useState, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { useContentManager } from '../hooks/useContentManager';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SITE_SECTIONS } from '../constants';

// Composants chargés de manière paresseuse pour optimiser les performances
const HeroCarousel = lazy(() => import('./components/HeroCarousel').then(m => ({ default: m.HeroCarousel })));
const BestSellers = lazy(() => import('./components/BestSellers').then(m => ({ default: m.BestSellers })));
const TourSpecialties = lazy(() => import('./components/TourSpecialties').then(m => ({ default: m.TourSpecialties })));
const Reviews = lazy(() => import('./components/Reviews').then(m => ({ default: m.Reviews })));
const VideoGallery = lazy(() => import('./components/VideoGallery').then(m => ({ default: m.VideoGallery })));
const Blogs = lazy(() => import('./components/Blogs').then(m => ({ default: m.Blogs })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const AboutUs = lazy(() => import('./components/AboutUs').then(m => ({ default: m.AboutUs })));

// Composants Admin
const AdminLogin = lazy(() => import('./components/admin/AdminLogin').then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

export default function App() {
  const [activeSection, setActiveSection] = useState(SITE_SECTIONS.HOME);

  // Hook de gestion du contenu et authentification
  const {
    content,
    updateSection,
    resetToDefaults,
    exportContent,
    importContent,
    isAuthenticated,
    login,
    logout,
  } = useContentManager();

  // Si on est sur la section admin
  if (activeSection === SITE_SECTIONS.ADMIN) {
    // Si pas authentifié, afficher la page de login
    if (!isAuthenticated) {
      return (
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <AdminLogin onLogin={login} />
          </Suspense>
        </ErrorBoundary>
      );
    }

    // Si authentifié, afficher le dashboard
    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <AdminDashboard
            onLogout={() => {
              logout();
              setActiveSection(SITE_SECTIONS.HOME);
            }}
            onExport={exportContent}
            onImport={importContent}
            onReset={resetToDefaults}
            content={content}
            onUpdateSection={updateSection}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Site normal - passer le contenu géré en props
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Header
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          siteConfig={content.siteConfig}
        />

        {activeSection === SITE_SECTIONS.HOME && (
          <Suspense fallback={<LoadingSpinner />}>
            <HeroCarousel slides={content.heroSlides} />
            <BestSellers tours={content.bestSellers} />
            <TourSpecialties specialties={content.tourSpecialties} />
            <VideoGallery
              videos={content.videoGallery}
              config={content.siteConfig}
            />
            <Reviews
              reviews={content.reviews}
              config={content.siteConfig}
            />
          </Suspense>
        )}

        {activeSection === SITE_SECTIONS.TOURS && (
          <Suspense fallback={<LoadingSpinner />}>
            <TourSpecialties specialties={content.tourSpecialties} />
            <BestSellers tours={content.bestSellers} />
          </Suspense>
        )}

        {activeSection === SITE_SECTIONS.BLOGS && (
          <Suspense fallback={<LoadingSpinner />}>
            <Blogs posts={content.blogPosts} />
          </Suspense>
        )}

        {activeSection === SITE_SECTIONS.CONTACT && (
          <Suspense fallback={<LoadingSpinner />}>
            <Contact config={content.siteConfig} />
          </Suspense>
        )}

        {activeSection === SITE_SECTIONS.ABOUT && (
          <Suspense fallback={<LoadingSpinner />}>
            <AboutUs config={content.siteConfig} />
          </Suspense>
        )}

        <Footer
          setActiveSection={setActiveSection}
          config={content.siteConfig}
        />
      </div>
    </ErrorBoundary>
  );
}