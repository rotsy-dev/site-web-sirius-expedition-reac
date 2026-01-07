"use client"
import { useState, useEffect } from "react"
import { Menu, X, LogIn, Sparkles, Languages, Calendar } from "lucide-react"
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
  const { lang } = useParams() // Récupère 'fr', 'en', etc. depuis l'URL

  // Langue par défaut si non définie dans l'URL
  const currentLang = lang || 'en'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Définition des routes avec les slugs demandés
  const menuItems = [
    { path: `/${currentLang}`, label: t("nav.home"), id: "home" },
    { path: `/${currentLang}/tours`, label: t("nav.tours"), id: "tours" },
    { path: `/${currentLang}/blog`, label: t("nav.blog"), id: "blog" },
    { path: `/${currentLang}/about`, label: t("nav.about"), id: "about" },
    { path: `/${currentLang}/contact`, label: t("nav.contact"), id: "contact" },
  ]

  // Déterminer quelle section est active en fonction de l'URL
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white dark:bg-zinc-900 shadow-lg border-b border-zinc-200 dark:border-zinc-800 py-2"
        : "bg-white dark:bg-zinc-900 py-3 md:py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">

          {/* Logo Desktop */}
          <Link
            to={`/${currentLang}`}
            className="hidden lg:flex items-center gap-3 cursor-pointer group -ml-2"
          >
            <div className="relative h-12 w-12 rounded-2xl overflow-hidden border-2 border-zinc-200/80 dark:border-zinc-700/80 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:border-[#4B3935]/30 dark:group-hover:border-[#A68966]/30">
              <img src={siteConfig.logo} alt="Logo" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-none tracking-tight group-hover:text-[#4B3935] dark:group-hover:text-[#A68966] transition-colors">
                {siteConfig.siteName}
              </span>
              <span className="text-[10px] text-[#4B3935]/70 dark:text-[#A68966]/80 font-semibold uppercase tracking-[0.2em] mt-1.5 opacity-90">
                {siteConfig.tagline}
              </span>
            </div>
          </Link>

          {/* Logo Mobile */}
          <Link
            to={`/${currentLang}`}
            className="flex lg:hidden items-center gap-2 cursor-pointer group"
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl overflow-hidden border-2 border-zinc-200/80 dark:border-zinc-700/80 shadow-md">
              <img src={siteConfig.logo} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                {siteConfig.siteName}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#4B3935]/70 dark:text-[#A68966]/80 font-medium uppercase tracking-wider mt-0.5">
                {siteConfig.tagline}
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center gap-5 absolute left-1/2 transform -translate-x-1/2">
            <nav className="flex items-center gap-1 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800 px-2.5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
              {menuItems.map((item) => {
                const isActive = getIsActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive
                      ? "text-[#F0E7D5]"
                      : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-gradient-to-r from-[#4B3935] to-[#3d2f2b] shadow-md"
                        style={{ borderRadius: 9999 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center gap-0 ml-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/${currentLang}/quote`)}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg bg-[#D4A574] hover:bg-[#C4965F] text-[#4B3935] transition-all overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Calendar size={15} strokeWidth={2.5} className="relative z-10" />
              <span className="relative z-10">{t("nav.quote")}</span>
            </motion.button>

            <span className="mx-2 text-zinc-300 dark:text-zinc-600 text-lg">|</span>
            <LanguageSwitcher />
            <span className="mx-2 text-zinc-300 dark:text-zinc-600 text-lg">|</span>

            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin')}
              className="p-2.5 rounded-full border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition-all"
            >
              <LogIn size={18} />
            </motion.button>
          </div>

          {/* Boutons Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(`/${currentLang}/quote`)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#D4A574] text-[#4B3935] shadow-md"
            >
              <Calendar size={14} strokeWidth={2.5} />
            </motion.button>

            <LanguageSwitcher />

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 rounded-xl shadow-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute left-3 right-3 mt-3 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-2xl"
            >
              <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-left px-5 py-3 rounded-xl text-sm font-medium transition-all ${getIsActive(item.path)
                      ? "bg-gradient-to-r from-[#4B3935] to-[#3d2f2b] text-[#F0E7D5] font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-center gap-2 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <Languages size={18} className="text-zinc-600" />
                    <LanguageSwitcher />
                  </div>

                  <button
                    onClick={() => { navigate(`/${currentLang}/quote`); setMobileMenuOpen(false); }}
                    className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-[#D4A574] text-[#4B3935]"
                  >
                    <Calendar size={18} strokeWidth={2.5} />
                    <span>{t("nav.quote")}</span>
                  </button>

                  <button
                    onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                    className="w-full py-4 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <LogIn size={18} />
                    <span>{t("nav.login")}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}