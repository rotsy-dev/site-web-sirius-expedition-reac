import * as React from 'react';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_SECTIONS } from '../../constants';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  siteConfig: {
    siteName: string;
    tagline: string;
    logo: string;
  };
}

export function Header({ activeSection, setActiveSection, siteConfig }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: SITE_SECTIONS.HOME, label: 'Home' },
    { id: SITE_SECTIONS.TOURS, label: 'Tours' },
    { id: SITE_SECTIONS.BLOGS, label: 'Blog' },
    { id: SITE_SECTIONS.ABOUT, label: 'About' },
    { id: SITE_SECTIONS.CONTACT, label: 'Contact' },
  ];

  const isImageLogo = siteConfig.logo.startsWith('data:') || siteConfig.logo.startsWith('http');

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl shadow-2xl shadow-primary/5 border-b border-gray-200/50 dark:border-gray-800/50'
          : 'bg-transparent'
      }`}
    >
      {/* Gradient overlay subtil */}
      {scrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none"
        />
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="flex justify-between items-center h-24">
          {/* Logo amélioré */}
          <motion.a
            href="#home"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4 cursor-pointer group relative z-10"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection(SITE_SECTIONS.HOME);
            }}
            aria-label="Retour à l'accueil"
          >
            {/* Logo avec effet glassmorphism */}
            <div className="relative">
              {/* Glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-2 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-xl"
              />
              
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="relative w-16 h-16 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 overflow-hidden border-2 border-white/20 dark:border-white/10"
              >
                {/* Shine effect */}
                <motion.div
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
                
                {isImageLogo ? (
                  <img
                    src={siteConfig.logo}
                    alt={siteConfig.siteName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl relative z-10">{siteConfig.logo}</span>
                )}
              </motion.div>
            </div>

            {/* Texte du logo */}
            <div className="relative">
              <motion.h1 
                className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight"
                whileHover={{ scale: 1.02 }}
              >
                {siteConfig.siteName}
              </motion.h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium flex items-center gap-1">
                <Sparkles size={10} className="text-primary" />
                {siteConfig.tagline}
              </p>
            </div>
          </motion.a>

          {/* Navigation Desktop avec effet moderne */}
          <nav className="hidden lg:flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-2 border border-gray-200/50 dark:border-gray-700/50">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="relative px-6 py-2.5 rounded-xl group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Aller à ${item.label}`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {/* Background actif */}
                {activeSection === item.id && (
                  <>
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl shadow-lg shadow-primary/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-white/20 dark:bg-white/10 rounded-xl"
                      animate={{
                        opacity: [0, 0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </>
                )}
                
                {/* Hover effect pour items inactifs */}
                {activeSection !== item.id && (
                  <motion.div
                    className="absolute inset-0 bg-gray-200/50 dark:bg-gray-700/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}

                <span
                  className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${
                    activeSection === item.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300 group-hover:text-primary'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}
          </nav>

          {/* CTA Buttons Desktop modernisés */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(SITE_SECTIONS.CONTACT)}
              className="relative group overflow-hidden px-8 py-3 rounded-xl font-semibold shadow-xl"
              aria-label="Réserver maintenant"
            >
              {/* Gradient animé */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient" />
              
              {/* Shine effect */}
              <motion.div
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              />
              
              <span className="relative z-10 flex items-center gap-2 text-white">
                Book Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </span>
            </motion.button>

            {/* Bouton Admin élégant */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(SITE_SECTIONS.ADMIN)}
              className="relative p-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-primary/10 hover:to-accent/10 rounded-xl transition-all duration-300 shadow-lg border border-gray-300/50 dark:border-gray-600/50"
              title="Admin Dashboard"
              aria-label="Accéder au tableau de bord administrateur"
            >
              <span className="text-xl">🔐</span>
            </motion.button>
          </div>

          {/* Menu Mobile Button modernisé */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-white shadow-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Menu Mobile amélioré */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-menu"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:hidden overflow-hidden pb-6"
              aria-label="Navigation mobile"
            >
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl p-4 border border-gray-200/50 dark:border-gray-800/50 mt-4 shadow-2xl">
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left px-5 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                        activeSection === item.id
                          ? 'text-white bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: menuItems.length * 0.05 }}
                  onClick={() => {
                    setActiveSection(SITE_SECTIONS.CONTACT);
                    setMobileMenuOpen(false);
                  }}
                  className="relative overflow-hidden flex items-center justify-center gap-2 w-full px-5 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-bold mt-4 shadow-xl shadow-primary/30"
                  aria-label="Réserver maintenant"
                >
                  <motion.div
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Book Now
                    <ArrowRight size={18} />
                  </span>
                </motion.button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}