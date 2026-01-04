"use client"
import { useState, useEffect } from "react"
import { Menu, X, Phone, LogIn } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { SITE_SECTIONS } from "../../constants"

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { id: SITE_SECTIONS.HOME, label: "Home" },
    { id: SITE_SECTIONS.TOURS, label: "Tours" },
    { id: SITE_SECTIONS.BLOGS, label: "Blog" },
    { id: SITE_SECTIONS.ABOUT, label: "About" },
    { id: SITE_SECTIONS.CONTACT, label: "Contact" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-md py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveSection(SITE_SECTIONS.HOME)}
          >
            <div className="h-11 w-11 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm transition-transform group-hover:scale-105">
              <img src={siteConfig.logo} alt="Logo" className="h-full w-full object-cover" />
            </div>
           <div className="flex flex-col ml-1">
  {/* Nom du site : Un gris très foncé mais pas noir pur */}
  <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-none">
    {siteConfig.siteName}
  </span>
  
  {/* Tagline : On utilise le Mocha du menu pour la cohérence et la lisibilité */}
  <span className="text-[10px] text-[#4B3935]/80 dark:text-[#A68966] font-bold uppercase tracking-wider mt-1.5">
    {siteConfig.tagline}
  </span>
</div>
          </div>

          {/* Navigation Desktop - L'élément ACTIVE est MOCHA */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/50 p-1.5 rounded-full border border-zinc-200/50 dark:border-white/5">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 rounded-full ${
                    isActive 
                      ? "text-[#F0E7D5]" // Texte Crème
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-[#4B3935]" // Fond Mocha
                      style={{ borderRadius: 9999 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Boutons Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(SITE_SECTIONS.CONTACT)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2fb5a3] text-white rounded-full text-sm font-semibold hover:bg-[#26a393] transition-all shadow-sm"
            >
              <Phone size={14} strokeWidth={2.5} />
              Contact
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(SITE_SECTIONS.ADMIN)}
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-semibold transition-all shadow-sm"
            >
              <LogIn size={14} />
              Login
            </motion.button>
          </div>

          {/* Menu Mobile Button */}
          <button
            className="lg:hidden p-2 text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute left-6 right-6 mt-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-3 shadow-2xl"
            >
              <div className="flex flex-col gap-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm transition-all ${
                      activeSection === item.id
                        ? "bg-[#4B3935] text-[#F0E7D5] font-bold" // Active Mocha Mobile
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-2" />
                <button 
                  onClick={() => setActiveSection(SITE_SECTIONS.ADMIN)}
                  className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <LogIn size={16} /> Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}