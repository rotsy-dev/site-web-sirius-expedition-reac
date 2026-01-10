"use client"
import { useState, useEffect } from "react"
import { Menu, X, LogIn, Calendar, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate, useLocation, useParams } from "react-router-dom"
import { LanguageSwitcher } from "./shared/LanguageSwitcher"
import { useTranslation } from "react-i18next"

interface HeaderProps {
  siteConfig: {
    siteName: string
    tagline: string
    logo: string
  }
}

export function Header({ siteConfig }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useParams()
  const currentLang = lang || 'en'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { path: `/${currentLang}`, label: t("nav.home"), id: "home" },
    { path: `/${currentLang}/tours`, label: t("nav.tours"), id: "tours" },
    { path: `/${currentLang}/blog`, label: t("nav.blog"), id: "blog" },
    { path: `/${currentLang}/about`, label: t("nav.about"), id: "about" },
    { path: `/${currentLang}/contact`, label: t("nav.contact"), id: "contact" },
  ]

  const getIsActive = (path: string) => {
    if (path === `/${currentLang}`) {
      return location.pathname === path || location.pathname === `/${currentLang}/`
    }
    return location.pathname.startsWith(path)
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-white/95 dark:bg-[#1a1410]/95 backdrop-blur-xl shadow-2xl border-b border-[#4B3935]/10 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          
          {/* Logo - Image unique avec logo et nom */}
          <Link
            to={`/${currentLang}`}
            className="flex items-center cursor-pointer group relative z-10 -ml-2 lg:-ml-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative h-16 w-auto lg:h-20 transition-all duration-300"
            >
              {siteConfig.logo ? (
                <div className="relative h-full w-auto flex items-center">
                  <div 
                    className="h-full w-auto max-w-[200px] lg:max-w-[250px] flex items-center"
                    style={{
                      backgroundColor: 'transparent',
                      backgroundImage: 'none'
                    }}
                  >
                    <img 
                      src={siteConfig.logo} 
                      alt={siteConfig.siteName || "Logo"} 
                      className="h-full w-auto object-contain transition-all duration-500 group-hover:brightness-110"
                      style={{
                        imageRendering: 'auto',
                        objectFit: 'contain',
                        mixBlendMode: scrolled ? 'normal' : 'multiply',
                        filter: scrolled 
                          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1)) brightness(1)' 
                          : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3)) brightness(1.1)',
                        backgroundColor: 'transparent',
                        WebkitFilter: scrolled 
                          ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1)) brightness(1)' 
                          : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3)) brightness(1.1)',
                        WebkitMixBlendMode: scrolled ? 'normal' : 'multiply'
                      }}
                      onError={(e) => {
                        // Si l'image ne charge pas, on cache l'image et on affiche le fallback
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 h-full">
                  <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-xl bg-gradient-to-br from-[#D4A574] to-[#C4965F] flex items-center justify-center text-white font-bold text-lg lg:text-xl shadow-xl">
                    SE
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xl lg:text-2xl font-bold leading-none ${
                      scrolled 
                        ? "text-[#4B3935] dark:text-[#F0E7D5]" 
                        : "text-white drop-shadow-2xl"
                    }`}>
                      {siteConfig.siteName}
                    </span>
                    <span className={`text-[9px] lg:text-[10px] font-medium uppercase tracking-[0.25em] ${
                      scrolled 
                        ? "text-[#4B3935]/70 dark:text-[#F0E7D5]/70" 
                        : "text-white/80 drop-shadow-lg"
                    }`}>
                      {siteConfig.tagline}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </Link>

          {/* Navigation Desktop - Design Moderne */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8 ml-auto absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-[#1a1410]/80 backdrop-blur-2xl px-4 py-2.5 rounded-2xl border border-[#4B3935]/10 shadow-xl">
              {menuItems.map((item) => {
                const isActive = getIsActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-gradient-to-r from-[#D4A574] to-[#C4965F] rounded-xl shadow-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors duration-300 ${
                      isActive 
                        ? "text-white" 
                        : "text-[#4B3935] dark:text-[#F0E7D5] hover:text-[#D4A574]"
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/${currentLang}/quote`)}
              className="relative flex items-center gap-1 px-5 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-[#4B3935] shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group whitespace-nowrap"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Calendar size={16} strokeWidth={2.5} className="relative z-10" />
              <span className="relative z-10">{t("nav.quote")}</span>
            </motion.button>

            <LanguageSwitcher />

            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/admin')}
              className="p-3 rounded-xl border-2 border-[#4B3935]/20 dark:border-[#F0E7D5]/20 bg-white/50 dark:bg-[#1a1410]/50 backdrop-blur-xl text-[#4B3935] dark:text-[#F0E7D5] hover:bg-[#4B3935] hover:text-white dark:hover:bg-[#F0E7D5] dark:hover:text-[#4B3935] transition-all duration-300 shadow-lg"
            >
              <LogIn size={18} />
            </motion.button>
          </div>

          {/* Menu Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(`/${currentLang}/quote`)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-[#4B3935] shadow-lg"
            >
              <Calendar size={18} strokeWidth={2.5} />
            </motion.button>

            <LanguageSwitcher />

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-white/80 dark:bg-[#1a1410]/80 backdrop-blur-xl border border-[#4B3935]/10 text-[#4B3935] dark:text-[#F0E7D5] shadow-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="lg:hidden absolute left-4 right-4 mt-4 bg-white/95 dark:bg-[#1a1410]/95 backdrop-blur-2xl border-2 border-[#4B3935]/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block w-full text-left px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        getIsActive(item.path)
                          ? "bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-white shadow-lg"
                          : "text-[#4B3935] dark:text-[#F0E7D5] hover:bg-[#F0E7D5]/50 dark:hover:bg-[#4B3935]/20"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="h-px bg-[#4B3935]/10 dark:bg-[#F0E7D5]/10 my-4" />

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-2 py-3 bg-[#F0E7D5]/30 dark:bg-[#4B3935]/20 rounded-xl">
                    <LanguageSwitcher />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { navigate(`/${currentLang}/quote`); setMobileMenuOpen(false); }}
                    className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-[#4B3935] shadow-lg"
                  >
                    <Calendar size={18} strokeWidth={2.5} />
                    <span>{t("nav.quote")}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                    className="w-full py-4 bg-[#4B3935] dark:bg-[#F0E7D5] text-white dark:text-[#4B3935] rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <LogIn size={18} />
                    <span>{t("nav.login")}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}