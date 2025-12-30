import * as React from "react"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '../components/shared/LanguageSwitcher'

interface HeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
  siteConfig: {
    siteName: string
    tagline: string
    logo: string
  }
}

export function Header({
  activeSection,
  setActiveSection,
  siteConfig,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { id: "home", label: t('nav.home') },
    { id: "tours", label: t('nav.tours') },
    { id: "blogs", label: t('nav.blog') },
    { id: "about", label: t('nav.about') },
    { id: "contact", label: t('nav.contact') },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.a
            href="#home"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              setActiveSection("home")
            }}
          >
            <h1 className="text-3xl font-bold text-[#443C34] tracking-tight">
              {siteConfig.siteName}
            </h1>
            <p className="text-sm text-gray-600">
              {siteConfig.tagline}
            </p>
          </motion.a>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-white rounded-full px-4 py-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-5 py-2 rounded-full text-md transition-all ${
                  activeSection === item.id
                    ? "font-bold text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Language Switcher + Login Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection("admin")}
              className="px-8 py-2.5 bg-[#443C34] text-white rounded-full font-semibold hover:bg-gray-900 transition-colors"
            >
              {t('nav.login')}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 rounded-lg text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden pb-4"
            >
              <div className="bg-white rounded-2xl p-4 mt-2 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm ${
                      activeSection === item.id
                        ? "font-bold bg-gray-100"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {/* Language Switcher Mobile */}
                <div className="pt-2 pb-1 flex justify-center">
                  <LanguageSwitcher />
                </div>

                <button
                  onClick={() => {
                    setActiveSection("admin")
                    setMobileMenuOpen(false)
                  }}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg text-sm font-medium mt-3 hover:bg-gray-900"
                >
                  {t('nav.login')}
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}