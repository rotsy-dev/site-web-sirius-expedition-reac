import * as React from 'react';
import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    { id: 'home', label: 'Home' },
    { id: 'tours', label: 'Tours' },
    { id: 'blogs', label: 'Blog' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-card/80 backdrop-blur-xl shadow-lg border-b border-border/50'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveSection('home')}
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: scrolled
                    ? '0 4px 20px rgba(109, 76, 65, 0.25)'
                    : '0 4px 15px rgba(109, 76, 65, 0.15)'
                }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300"
              >
                <span className="text-2xl">{siteConfig.logo}</span>
              </motion.div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                {siteConfig.siteName}
              </h1>
              <p className="text-xs text-muted-foreground">{siteConfig.tagline}</p>
            </div>
          </motion.div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="relative px-5 py-2 rounded-lg group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  className={`relative z-10 text-sm font-medium transition-colors duration-300 ${activeSection === item.id
                    ? 'text-primary-foreground'
                    : 'text-foreground group-hover:text-primary'
                    }`}
                >
                  {item.label}
                </span>
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* CTA Buttons Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection('contact')}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Book Now
              <ArrowRight size={16} />
            </motion.button>

            {/* Bouton Admin - discret */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection('admin')}
              className="px-4 py-2.5 bg-muted/50 hover:bg-muted text-foreground rounded-lg font-medium transition-colors duration-300"
              title="Admin Dashboard"
            >
              🔐
            </motion.button>
          </div>

          {/* Menu Mobile Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2.5 rounded-lg bg-card/80 backdrop-blur-md border border-border/50 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden pb-4"
            >
              <div className="space-y-1 bg-card/95 backdrop-blur-xl rounded-xl p-3 border border-border/50 mt-3 shadow-xl">
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
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${activeSection === item.id
                      ? 'text-primary-foreground bg-gradient-to-r from-primary to-accent'
                      : 'text-foreground hover:bg-muted'
                      }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: menuItems.length * 0.05 }}
                  onClick={() => {
                    setActiveSection('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold mt-2"
                >
                  Book Now
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}