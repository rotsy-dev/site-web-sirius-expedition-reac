import * as React from 'react'
import { Facebook, Youtube, Mail, Phone, MapPin, ArrowRight, Sparkles, Send, Star, Globe, Heart } from 'lucide-react';
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
    };
    social: {
      facebook: string;
      youtube: string;
      tripadvisor: string;
      google: string;
    };
    services: {
      hosting: string[];
      domain: string;
      email: string;
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

  return (
    <footer className="relative overflow-hidden mt-32">
      {/* Background sophistiqué */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

      {/* Grille animée */}
      <motion.div
        animate={{
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"
      />

      {/* Projecteurs lumineux */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [-100, 100, -100],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.15, 0.25, 0.15],
          x: [100, -100, 100],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-0 right-1/4 w-[55rem] h-[55rem] bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"
      />

      <div className="relative z-10">
        {/* Newsletter Section spectaculaire */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Icon central animé */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-block mb-8"
              >
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.4, 1],
                      rotate: [0, 180, 360],
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-accent rounded-full blur-2xl"
                  />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                    <Sparkles size={48} className="text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-black leading-tight"
              >
                Stay Updated on{' '}
                <motion.span
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_100%] bg-clip-text text-transparent"
                >
                  Adventures
                </motion.span>
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 mb-10 text-xl font-medium"
              >
                Subscribe to our newsletter for exclusive deals and travel inspiration
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
              >
                <div className="flex-1 relative group">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="relative w-full px-8 py-5 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-accent/50 transition-all shadow-xl font-medium"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-2xl blur-xl"
                  />
                  <div className="relative bg-gradient-to-r from-accent to-primary px-10 py-5 rounded-2xl text-white font-black text-lg flex items-center gap-3 shadow-2xl overflow-hidden">
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                    <span className="relative z-10">Subscribe</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="relative z-10"
                    >
                      <Send size={22} />
                    </motion.div>
                  </div>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* About Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-2xl blur-lg opacity-50"
                  />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden border-2 border-white/20">
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                    {(config.logo.startsWith('data:') || config.logo.startsWith('http')) ? (
                      <img
                        src={config.logo}
                        alt={config.siteName}
                        className="w-full h-full object-cover relative z-10"
                      />
                    ) : (
                      <span className="text-4xl relative z-10">{config.logo}</span>
                    )}
                  </div>
                </div>
                <h3 className="text-2xl text-white font-black">{config.siteName}</h3>
              </div>

              <p className="text-gray-400 leading-relaxed mb-8 text-base font-medium">
                Your trusted partner for discovering the wonders of Madagascar.
                Expert guides, unforgettable experiences, lifetime memories.
              </p>

              {/* Social Icons premium */}
              <div className="flex gap-4">
                {[
                  { icon: Facebook, url: config.social.facebook, color: 'from-blue-600 to-blue-800' },
                  { icon: Youtube, url: config.social.youtube, color: 'from-red-600 to-red-800' }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: idx * 0.5,
                      }}
                      className={`absolute inset-0 bg-gradient-to-br ${social.color} rounded-xl blur-lg`}
                    />
                    <div className="relative w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all shadow-xl">
                      <social.icon size={24} className="text-white" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-white mb-8 font-black text-xl flex items-center gap-2">
                <Globe size={24} className="text-accent" />
                Quick Links
              </h4>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => setActiveSection(link.id)}
                      className="group flex items-center gap-3 text-gray-400 hover:text-white transition-colors font-medium text-base"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        className="w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                      <span>{link.label}</span>
                    </motion.button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-white mb-8 font-black text-xl flex items-center gap-2">
                <Phone size={24} className="text-accent" />
                Contact
              </h4>
              <ul className="space-y-5">
                {[
                  { icon: Mail, text: config.contact.email, href: `mailto:${config.contact.email}`, gradient: 'from-blue-500 to-cyan-500' },
                  { icon: Phone, text: config.contact.phone, href: `tel:${config.contact.phone}`, gradient: 'from-green-500 to-emerald-500' },
                  { icon: MapPin, text: config.contact.address, gradient: 'from-purple-500 to-pink-500' }
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex items-start gap-4 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity`} />
                      <div className="relative p-3 bg-white/5 backdrop-blur-xl rounded-lg group-hover:bg-white/10 transition-all shadow-lg border border-white/10">
                        <item.icon size={20} className="text-white" />
                      </div>
                    </motion.div>
                    {item.href ? (
                      <a href={item.href} className="text-gray-400 hover:text-white transition-colors font-medium pt-2">
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-gray-400 font-medium pt-2">
                        {item.text}
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Reviews Platforms */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="text-white mb-8 font-black text-xl flex items-center gap-2">
                <Star size={24} className="text-accent fill-accent" />
                Reviews
              </h4>
              <div className="space-y-4">
                {[
                  { name: 'TripAdvisor', letter: 'T', reviews: '156', url: config.social.tripadvisor, gradient: 'from-green-500 to-emerald-600' },
                  { name: 'Google', letter: 'G', reviews: '203', url: config.social.google, gradient: 'from-blue-500 to-cyan-600' }
                ].map((platform, idx) => (
                  <motion.a
                    key={idx}
                    whileHover={{ x: 8, scale: 1.02 }}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: idx * 0.5,
                        }}
                        className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} rounded-xl blur opacity-50`}
                      />
                      <div className={`relative w-12 h-12 bg-gradient-to-br ${platform.gradient} rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/20`}>
                        {platform.letter}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-base">{platform.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill="#f59e0b" className="text-amber-500" />
                          ))}
                        </div>
                        <p className="text-gray-400 text-xs font-semibold">{platform.reviews} reviews</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                    </motion.div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar premium */}
          <div className="border-t border-white/10 pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-gray-400 text-sm text-center md:text-left"
              >
                <span>© {currentYear} {config.siteName}.</span>
                <span className="hidden sm:inline">All rights reserved.</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart size={16} className="text-red-500 fill-red-500 inline" />
                </motion.span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400"
              >
                <span className="font-medium">Powered by</span>
                {config.services.hosting.map((host, idx) => (
                  <React.Fragment key={host}>
                    {idx > 0 && <span className="text-gray-600">•</span>}
                    <span className="text-accent font-bold">{host}</span>
                  </React.Fragment>
                ))}
                <span className="text-gray-600">•</span>
                <span className="text-primary font-bold">{config.services.email}</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles pour animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </footer>
  );
}