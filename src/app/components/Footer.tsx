import { motion } from 'framer-motion'
import { Facebook, Youtube, Mail, MapPin, ArrowUpRight, Linkedin, Instagram, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { VisitorCounter } from '../../components/common/VisitorCounter'
import { useState } from 'react'

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
  setActiveSection?: (section: string) => void
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

  const currentLang = lang || 'en'

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('idle')
    setMessage('')

    if (!email.trim()) {
      setStatus('error')
      setMessage('Veuillez entrer votre email')
      return
    }

    if (!isValidEmail(email)) {
      setStatus('error')
      setMessage('Email invalide')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Inscription réussie ! Vérifiez votre boîte mail.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Une erreur est survenue')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Erreur de connexion. Veuillez réessayer.')
      console.error('Newsletter error:', error)
    }
  }

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
    <footer className="relative bg-[#3d2f2b] text-white overflow-hidden">
      {/* Accents décoratifs ultra-subtils */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FFF8E1] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#6D4C41] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-16 py-24 lg:py-32 z-10">
        {/* Section principale */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24"
        >
          {/* Colonne gauche - Branding & Newsletter */}
          <div className="space-y-12">
            {/* Logo et description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl sm:text-6xl font-extralight text-white tracking-tighter">
                {config.siteName}
              </h1>
              <div className="h-[1px] w-20 bg-white/20" />
              <p className="text-white/60 text-base leading-[1.8] max-w-lg font-light tracking-wide">
                {t('footer.description')}
              </p>
            </motion.div>

            {/* Newsletter Form - Design minimaliste */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 max-w-lg"
            >
              <h3 className="text-lg font-light mb-2 tracking-tight">
                {t('footer.newsletter')}
              </h3>
              <p className="text-white/50 text-sm mb-6 font-light tracking-wide">
                {t('footer.newsletterText')}
              </p>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('footer.emailPlaceholder')}
                    disabled={status === 'loading'}
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 px-5 py-4 text-sm outline-none placeholder-white/30 focus:border-white/30 focus:bg-white/10 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed font-light"
                  />
                  <motion.button
                    whileHover={{ scale: status === 'loading' ? 1 : 1.05 }}
                    whileTap={{ scale: status === 'loading' ? 1 : 0.95 }}
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex-shrink-0 bg-white text-[#3E2723] px-6 py-4 font-light transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF8E1] cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={1.5} />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
                    )}
                  </motion.button>
                </div>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-sm px-4 py-3 ${status === 'success'
                        ? 'bg-green-500/10 text-green-300 border border-green-500/20'
                        : 'bg-red-500/10 text-red-300 border border-red-500/20'
                      }`}
                  >
                    {status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                    )}
                    <span className="font-light">{message}</span>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>

          {/* Colonne droite - Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 gap-12 lg:gap-16"
          >
            <div>
              <h3 className="text-[10px] font-light text-white/40 uppercase tracking-[0.3em] mb-8">
                {t('footer.quickLinks')}
              </h3>
              <nav className="space-y-5">
                {pageLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className="group block text-white/60 hover:text-white transition-all duration-300"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="inline-flex items-center gap-2 text-sm font-light tracking-wide"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-[10px] font-light text-white/40 uppercase tracking-[0.3em] mb-8">
                CORPORATE
              </h3>
              <nav className="space-y-5 mb-12">
                {corporateLinks.map((link, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className="group block text-white/60 hover:text-white transition-all duration-300"
                    >
                      <motion.span
                        whileHover={{ x: 5 }}
                        className="inline-flex items-center gap-2 text-sm font-light tracking-wide"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Réseaux sociaux */}
              <div>
                <h3 className="text-[10px] font-light text-white/40 uppercase tracking-[0.3em] mb-6">
                  {t('footer.followUs')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { href: config.social.facebook, icon: Facebook },
                    { href: config.social.youtube, icon: Youtube },
                    { href: '#', icon: Linkedin },
                    { href: config.social.instagram || '#', icon: Instagram },
                    { href: config.social.tiktok || '#', icon: TikTokIcon },
                  ].map(({ href, icon: Icon }, index) => (
                    <motion.a
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      href={href}
                      target={href !== '#' ? "_blank" : undefined}
                      rel={href !== '#' ? "noopener noreferrer" : undefined}
                      className="w-11 h-11 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300 group"
                    >
                      <Icon className="w-4 h-4 text-white/70 group-hover:text-[#3E2723] transition-colors" strokeWidth={1.5} />
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
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-[1px] bg-white/10 mb-12 origin-left"
        />

        {/* Footer bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col xl:flex-row items-center justify-between gap-8"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
            <p className="text-white/40 text-xs text-center lg:text-left font-light tracking-wide">
              © {currentYear} {config.siteName}. {t('footer.rights')}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-white/50 text-xs">
              <motion.a
                whileHover={{ scale: 1.05 }}
                href={`mailto:${config.contact.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors font-light"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                <span>{config.contact.email}</span>
              </motion.a>
              <div className="flex items-center gap-2 font-light">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.5} />
                <span>{config.contact.address}</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <VisitorCounter />
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}