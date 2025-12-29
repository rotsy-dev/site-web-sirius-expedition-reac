import * as React from 'react';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8  ">
        <div className="relative flex justify-between items-center h-20">
          {/* Logo à gauche */}
          <motion.a
            href="#home"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection(SITE_SECTIONS.HOME);
            }}
            aria-label="Retour à l'accueil"
          >
            <h1 className="text-3xl font-bold text-[#443C34] dark:text-white tracking-tight">
              {siteConfig.siteName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {siteConfig.tagline}
            </p>
          </motion.a>

          {/* Navigation au centre - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-white backdrop-blur-sm rounded-full px-4 py-2 absolute left-1/2 -translate-x-1/2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-5 py-2 rounded-full text-md transition-all duration-300 ${activeSection === item.id
                  ? 'font-bold text-gray-900 dark:text-white'
                  : 'font-normal text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                aria-label={`Aller à ${item.label}`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Login à droite - Desktop */}
          <div className="hidden lg:flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(SITE_SECTIONS.ADMIN)}
              className="px-8 py-2.5 bg-[#443C34] dark:bg-gray-700 text-white rounded-full text-md font-semibold hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
              aria-label="Se connecter"
            >
              Login
            </motion.button>
          </div>

          {/* Menu Mobile Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 rounded-lg text-gray-900 dark:text-white"
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

        {/* Menu Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden pb-4"
              aria-label="Navigation mobile"
            >
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 mt-2">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${activeSection === item.id
                        ? 'font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800'
                        : 'font-normal text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveSection(SITE_SECTIONS.ADMIN);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg text-sm font-medium mt-3 hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Se connecter"
                >
                  Login
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}