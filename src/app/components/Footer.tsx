// src/app/components/Footer.tsx
import * as React from 'react';
import { Facebook, Youtube, Mail, Phone, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface FooterProps {
  setActiveSection: (section: string) => void;
  config: {
    siteName: string;
    logo: string;
    contact: {
      email: string;
      phone: string;
      address: string;
      whatsapp?: string;
    };
    social: {
      facebook: string;
      youtube: string;
      tripadvisor: string;
      google: string;
    };
    services?: {
      hosting?: string[];
      email?: string;
    };
  };
}

export function Footer({ setActiveSection, config }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tours', label: 'Tours' },
    { id: 'blogs', label: 'Blog' },
    { id: 'about', label: 'About Us' },
  ];

  // Fallback sécurisé pour services
  const hosting = Array.isArray(config.services?.hosting) ? config.services.hosting : [];
  const emailProvider = config.services?.email || '';

  return (
    <footer className="relative overflow-hidden mt-24">
      {/* Background avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-primary to-foreground" />

      {/* Motif de grille */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, #FFF8F0 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Bulles lumineuses */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-primary-foreground/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <Sparkles size={48} className="text-accent" />
              </motion.div>

              <h3 className="text-3xl md:text-4xl text-primary-foreground mb-4 font-bold">
                Stay Updated on Adventures
              </h3>
              <p className="text-muted mb-8 text-lg">
                Subscribe to our newsletter for exclusive deals and travel inspiration
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-card/10 backdrop-blur-md border border-primary-foreground/20 rounded-2xl text-primary-foreground placeholder-muted focus:outline-none focus:border-accent/50 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-gradient-to-r from-accent to-primary px-8 py-4 rounded-2xl text-primary-foreground font-bold flex items-center gap-2 shadow-xl">
                    Subscribe
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* About Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute inset-0 bg-accent/30 rounded-2xl blur-md"
                  />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-xl overflow-hidden">
                    {(config.logo.startsWith('data:') || config.logo.startsWith('http')) ? (
                      <img
                        src={config.logo}
                        alt={config.siteName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">{config.logo}</span>
                    )}
                  </div>
                </div>
                <h3 className="text-xl text-primary-foreground font-bold">{config.siteName}</h3>
              </div>
              <p className="text-muted leading-relaxed mb-6">
                Your trusted partner for discovering the wonders of Madagascar.
                Expert guides, unforgettable experiences, lifetime memories.
              </p>

              {/* Social Icons */}
              <div className="flex gap-3">
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={config.social.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-accent rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-12 h-12 bg-card/10 backdrop-blur-md border border-primary-foreground/20 rounded-xl flex items-center justify-center hover:bg-card/20 transition-all">
                    <Facebook size={20} className="text-primary-foreground" />
                  </div>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  href={config.social.youtube || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-destructive rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-12 h-12 bg-card/10 backdrop-blur-md border border-primary-foreground/20 rounded-xl flex items-center justify-center hover:bg-card/20 transition-all">
                    <Youtube size={20} className="text-primary-foreground" />
                  </div>
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-primary-foreground mb-6 font-bold text-lg">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <button
                      onClick={() => setActiveSection(link.id)}
                      className="group flex items-center gap-2 text-muted hover:text-primary-foreground transition-colors"
                    >
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      <span>{link.label}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-primary-foreground mb-6 font-bold text-lg">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <div className="p-2 bg-card/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <Mail size={18} className="text-primary-foreground flex-shrink-0" />
                  </div>
                  <a href={`mailto:${config.contact.email}`} className="text-muted hover:text-primary-foreground transition-colors">
                    {config.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="p-2 bg-card/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <Phone size={18} className="text-primary-foreground flex-shrink-0" />
                  </div>
                  <a href={`tel:${config.contact.phone}`} className="text-muted hover:text-primary-foreground transition-colors">
                    {config.contact.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3 group">
                  <div className="p-2 bg-card/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <MapPin size={18} className="text-primary-foreground flex-shrink-0" />
                  </div>
                  <span className="text-muted">
                    {config.contact.address}
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Reviews Platforms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-primary-foreground mb-6 font-bold text-lg">Reviews</h4>
              <div className="space-y-3">
                <motion.a
                  whileHover={{ x: 5 }}
                  href={config.social.tripadvisor || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 bg-card/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl hover:bg-card/10 hover:border-primary-foreground/20 transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                    T
                  </div>
                  <div>
                    <p className="text-primary-foreground font-medium text-sm">TripAdvisor</p>
                    <p className="text-muted text-xs">156 reviews</p>
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ x: 5 }}
                  href={config.social.google || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-3 bg-card/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl hover:bg-card/10 hover:border-primary-foreground/20 transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                    G
                  </div>
                  <div>
                    <p className="text-primary-foreground font-medium text-sm">Google</p>
                    <p className="text-muted text-xs">203 reviews</p>
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-primary-foreground/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-muted text-sm text-center md:text-left"
              >
                © {currentYear} {config.siteName}. All rights reserved.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-xs text-muted"
              >
                {hosting.length > 0 && (
                  <>
                    <span>Powered by</span>
                    {hosting.map((host, idx) => (
                      <React.Fragment key={host}>
                        {idx > 0 && <span>•</span>}
                        <span className="text-accent font-semibold">{host}</span>
                      </React.Fragment>
                    ))}
                  </>
                )}
                {emailProvider && (
                  <>
                    {(hosting.length > 0 ? ' • ' : '')}
                    <span className="text-primary-foreground font-semibold">{emailProvider}</span>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}