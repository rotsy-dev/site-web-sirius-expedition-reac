// src/app/App.tsx
import * as React from 'react';
import { useState } from 'react';
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

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

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
  if (activeSection === 'admin') {
    // Si pas authentifié, afficher la page de login
    if (!isAuthenticated) {
      return <AdminLogin onLogin={login} />;
    }

    // Si authentifié, afficher le dashboard
    return (
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
    );
  }

  // Site normal - passer le contenu géré en props
  return (
    <div className="min-h-screen">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        siteConfig={content.siteConfig}
      />

      {activeSection === 'home' && (
        <>
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
        </>
      )}

      {activeSection === 'tours' && (
        <>
          <TourSpecialties specialties={content.tourSpecialties} />
          <BestSellers tours={content.bestSellers} />
        </>
      )}

      {activeSection === 'blogs' && (
        <Blogs posts={content.blogPosts} />
      )}

      {activeSection === 'contact' && (
        <Contact config={content.siteConfig} />
      )}

      {activeSection === 'about' && (
        <AboutUs config={content.siteConfig} />
      )}

      <Footer
        setActiveSection={setActiveSection}
        config={content.siteConfig}
      />
    </div>
  );
}