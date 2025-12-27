// src/app/App.tsx
import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';

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

// Admin
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useContentManager } from '../hooks/useContentManager';

// (si ces constantes existent déjà chez toi)
import { SITE_SECTIONS } from '../constants/index';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

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
    login,
  } = useContentManager();

  // Scroll automatique lors du changement de section
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [activeSection]);

  // 🔐 SECTION ADMIN
  if (activeSection === SITE_SECTIONS.ADMIN) {
    if (!isAuthenticated) {
      return (
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <AdminLogin onLogin={login} />
          </Suspense>
        </ErrorBoundary>
      );
    }

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

  // 🌍 SITE PUBLIC
  return (
    <div className="min-h-screen bg-background">
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
    </div>
  );
}

export default App;
