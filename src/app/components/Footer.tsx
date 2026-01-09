import { motion } from 'framer-motion'
import { Facebook, Youtube, Mail, MapPin, ArrowUpRight, Linkedin, Instagram } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

interface FooterProps {
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
      instagram?: string;
      tiktok?: string;
    };
    services: {
      hosting: string[];
      domain: string;
      email: string;
    };
  };
}

export function Footer({ config }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()
  const { lang } = useParams()
  
  // Langue par défaut si non définie dans l'URL
  const currentLang = lang || 'en'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const bottomVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
      },
    }),
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    }),
  };

  const pageLinks = [
    { path: `/${currentLang}`, label: t('nav.home') },
    { path: `/${currentLang}/tours`, label: t('nav.tours') },
    { path: `/${currentLang}/blog`, label: t('nav.blog') },
    { path: `/${currentLang}/about`, label: t('nav.about') },
  ]

  const corporateLinks = [
    { label: t('footer.termsOfUse'), path: `/${currentLang}/terms` },
    { label: t('footer.privacyPolicy'), path: `/${currentLang}/privacy` },
    { label: t('footer.cookieManagement'), path: `/${currentLang}/cookies` },
  ]

  return (
    <footer className="relative bg-[#443C34] text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
        >
          {/* Section gauche */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {config.siteName}
              </h1>
              <p className="text-sm text-white/60 mt-1">{t('footer.description')}</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/70 text-base sm:text-lg leading-relaxed max-w-md"
            >
              {t('footer.description')}
            </motion.p>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#F5E6D3]" />
                {t('footer.newsletter')}
              </h3>
              <p className="text-white/60 text-sm mb-4">{t('footer.newsletterText')}</p>
              <div className="flex gap-2">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-3 text-sm outline-none placeholder-white/40 focus:border-[#F5E6D3] transition-colors text-white"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer flex-shrink-0 bg-[#F5E6D3] hover:bg-[#EBD8C0] px-4 sm:px-5 py-3 rounded-xl font-medium transition-all flex items-center justify-center text-[#443C34]"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Section navigation */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">
                {t('footer.quickLinks')}
              </h3>
              <nav className="space-y-4">
                {pageLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    custom={i}
                    variants={linkVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.path}
                      className="block text-white/80 hover:text-white transition-all duration-200"
                    >
                      <motion.span
                        whileHover={{ x: 5, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block"
                      >
                        {link.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Section Corporate + Réseaux */}
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">
                CORPORATE
              </h3>
              <nav className="space-y-4 mb-8">
                {corporateLinks.map((link, idx) => (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={linkVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Link
                      to={link.path}
                      className="block text-white/80 hover:text-white transition-all duration-200"
                    >
                      <motion.span
                        whileHover={{ x: 5, scale: 1.05 }}
                        className="inline-block"
                      >
                        {link.label}
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Réseaux sociaux */}
              <div>
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                  {t('footer.followUs')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { href: config.social.facebook, icon: Facebook, index: 0 },
                    { href: config.social.youtube, icon: Youtube, index: 1 },
                    { href: '#', icon: Linkedin, index: 2 },
                    { href: config.social.instagram || '#', icon: Instagram, index: 3 },
                    { href: config.social.tiktok || '#', icon: TikTokIcon, index: 4 },
                  ].map(({ href, icon: Icon, index }) => (
                    <motion.a
                      key={index}
                      custom={index}
                      variants={socialVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      href={href}
                      target={href !== '#' ? "_blank" : undefined}
                      rel={href !== '#' ? "noopener noreferrer" : undefined}
                      className="group w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-white/80 group-hover:text-[#443C34] transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Séparateur */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-px bg-white/10 my-10 origin-left"
        />

        {/* Copyright */}
        <motion.div
          variants={bottomVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-white/60 text-sm text-center md:text-left">
            © {currentYear} {config.siteName}. {t('footer.rights')}
          </p>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-white/70 text-sm"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${config.contact.email}`}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="break-all">{config.contact.email}</span>
            </motion.a>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-center sm:text-left">{config.contact.address}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}