"use client"
import { useState, useEffect } from "react"
import { Menu, X, Phone, LogIn, Sparkles, Languages, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SITE_SECTIONS } from "../../constants"
import { LanguageSwitcher } from "./shared/LanguageSwitcher"
import { useTranslation } from "react-i18next"

interface HeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
  siteConfig: {
    siteName: string
    tagline: string
    logo: string
  }
}

export function Header({ activeSection, setActiveSection, siteConfig }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { id: SITE_SECTIONS.HOME, label: t("nav.home") },
    { id: SITE_SECTIONS.TOURS, label: t("nav.tours") },
    { id: SITE_SECTIONS.BLOGS, label: t("nav.blog") },
    { id: SITE_SECTIONS.ABOUT, label: t("nav.about") },
    { id: SITE_SECTIONS.CONTACT, label: t("nav.contact") },
  ]

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

          {/* Logo Desktop - caché sur mobile */}
          <motion.div
            className="hidden lg:flex items-center gap-3 cursor-pointer group -ml-2"
            onClick={() => setActiveSection(SITE_SECTIONS.HOME)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative h-12 w-12 rounded-2xl overflow-hidden border-2 border-zinc-200/80 dark:border-zinc-700/80 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:border-[#4B3935]/30 dark:group-hover:border-[#A68966]/30">
              <img src={siteConfig.logo} alt="Logo" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-none tracking-tight group-hover:text-[#4B3935] dark:group-hover:text-[#A68966] transition-colors">
                {siteConfig.siteName}
              </span>
              <span className="text-[10px] text-[#4B3935]/70 dark:text-[#A68966]/80 font-semibold uppercase tracking-[0.2em] mt-1.5 opacity-90">
                {siteConfig.tagline}
              </span>
            </div>
          </motion.div>

          {/* Logo Mobile - visible uniquement sur mobile/tablette */}
          <motion.div
            className="flex lg:hidden items-center gap-2 cursor-pointer group"
            onClick={() => setActiveSection(SITE_SECTIONS.HOME)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl overflow-hidden border-2 border-zinc-200/80 dark:border-zinc-700/80 shadow-md transition-all duration-300">
              <img src={siteConfig.logo} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                {siteConfig.siteName}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#4B3935]/70 dark:text-[#A68966]/80 font-medium uppercase tracking-wider mt-0.5">
                {siteConfig.tagline}
              </span>
            </div>
          </motion.div>

          {/* Navigation Desktop - au centre */}
          <div className="hidden lg:flex items-center gap-5 absolute left-1/2 transform -translate-x-1/2">
            <nav className="flex items-center gap-1 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-800 px-2.5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
              {menuItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                )
              })}
            </nav>
          </div>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center gap-0 ml-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveSection(SITE_SECTIONS.QUOTE)}
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
              onClick={() => setActiveSection(SITE_SECTIONS.ADMIN)}
              className="p-2.5 rounded-full border-2 border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-[#4B3935] dark:hover:border-[#A68966] shadow-sm hover:shadow-md transition-all"
              title={t("nav.login")}
            >
              <LogIn size={18} />
            </motion.button>
          </div>

          {/* Boutons Mobile - Langue + quote + Menu */}
          <div className="flex lg:hidden items-center gap-2">

            {/* Bouton Devis Mobile - version compacte */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveSection(SITE_SECTIONS.QUOTE)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#D4A574] hover:bg-[#C4965F] text-[#4B3935] shadow-md transition-all"
            >
              <Calendar size={14} strokeWidth={2.5} />
              {/* <span className="relative z-10">{t("nav.quote")}</span> */}
            </motion.button>

            {/* Bouton Langue Mobile - icône uniquement */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>

            {/* Bouton Menu Hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 sm:p-2.5 text-zinc-900 dark:text-white bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 rounded-xl shadow-md hover:shadow-lg transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="lg:hidden absolute left-3 right-3 sm:left-4 sm:right-4 mt-3 bg-white dark:bg-zinc-900 border-2 border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl max-h-[calc(100vh-6rem)] overflow-y-auto"
            >
              <div className="flex flex-col gap-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setActiveSection(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm font-medium transition-all ${activeSection === item.id
                        ? "bg-gradient-to-r from-[#4B3935] to-[#3d2f2b] text-[#F0E7D5] font-bold shadow-md scale-[1.02]"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:scale-[1.01]"
                      }`}
                  >
                    {item.label}
                  </motion.button>
                ))}

                <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent my-2 sm:my-3" />

                {/* Actions Mobile */}
                <div className="px-1 py-2 flex flex-col gap-3">
                  {/* Language Switcher Mobile avec icône */}
                  <div className="flex items-center justify-center gap-2 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                    <Languages size={18} className="text-zinc-600 dark:text-zinc-400" />
                    <LanguageSwitcher />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveSection(SITE_SECTIONS.QUOTE)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm font-bold flex items-center justify-center gap-2 bg-[#D4A574] hover:bg-[#C4965F] text-[#4B3935] shadow-lg hover:shadow-xl transition-all"
                  >
                    <Calendar size={18} strokeWidth={2.5} />
                    <span>{t("nav.quote")}</span>
                    <Sparkles size={16} className="opacity-70" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveSection(SITE_SECTIONS.ADMIN)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-100 text-white dark:text-zinc-900 rounded-xl sm:rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
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