// ============================================
// HEADER.TSX - Style Wilderness Mocha Premium
// ============================================
"use client"
import { useState, useEffect, useRef } from "react"
import { Menu, X, LogIn, Calendar, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate, useLocation, useParams } from "react-router-dom"
import { LanguageSwitcher } from "./shared/LanguageSwitcher"
import { useTranslation } from "react-i18next"

interface HeaderProps {
  activeSection?: string
  setActiveSection?: (section: string) => void
  siteConfig: {
    siteName: string
    tagline: string
    logo: string
  }
}

export function Header({ siteConfig }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [discoverMoreOpen, setDiscoverMoreOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useParams()
  const currentLang = lang || 'en'

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      ticking = false;
    };
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDiscoverMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { path: `/${currentLang}`, label: t("nav.home"), id: "home" },
    { path: `/${currentLang}/tours`, label: t("nav.tours"), id: "tours" },
    { path: `/${currentLang}/blog`, label: t("nav.blog"), id: "blog" },
    { path: `/${currentLang}/contact`, label: t("nav.contact"), id: "contact" },
  ]

  const discoverMoreItems = [
    { path: `/${currentLang}/about`, label: t("nav.about"), id: "about", description: "Learn about our story" },
    { path: `/${currentLang}/faqs`, label: t("nav.faqs"), id: "faqs", description: "Get answers to common questions" },
  ]

  const getIsActive = (path: string) => {
    if (path === `/${currentLang}`) {
      return location.pathname === path || location.pathname === `/${currentLang}/`
    }
    return location.pathname.startsWith(path)
  }

  const isDiscoverMoreActive = discoverMoreItems.some(item => getIsActive(item.path))

  return (
    <motion.header
      initial={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
          ? "bg-[#3d2f2b]/97 backdrop-blur-2xl shadow-[0_8px_32px_rgba(61,47,43,0.4)] border-b border-[#E5D8C0]/8 py-3"
          : "bg-gradient-to-b from-[#3d2f2b]/70 via-[#3d2f2b]/30 to-transparent py-5"
        }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5D8C0]/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-20 lg:h-24">

          {/* Logo */}
          <Link to={`/${currentLang}`} className="flex items-center cursor-pointer group relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-14 lg:h-16"
            >
              {siteConfig.logo ? (
                <img
                  src={siteConfig.logo}
                  alt={`${siteConfig.siteName} Logo`}
                  className="h-full w-auto object-contain brightness-0 invert transition-all duration-500"
                  style={{
                    filter: scrolled
                      ? 'brightness(0) invert(1) drop-shadow(0 0 25px rgba(229,216,192,0.25))'
                      : 'brightness(0) invert(1) drop-shadow(0 0 35px rgba(229,216,192,0.4))',
                  }}
                />
              ) : (
                <div className="text-2xl lg:text-3xl font-extralight tracking-[0.35em] text-[#E5D8C0] uppercase">
                  {siteConfig.siteName}
                </div>
              )}
            </motion.div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-2 ml-auto mr-10">
            {menuItems.map((item) => {
              const isActive = getIsActive(item.path)
              return (
                <Link key={item.path} to={item.path} className="relative group px-6 py-3">
                  <span className={`text-[12px] font-light uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? "text-[#E5D8C0]" : "text-[#E5D8C0]/70 group-hover:text-[#E5D8C0]"
                    }`}>
                    {item.label}
                  </span>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5D8C0] to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="absolute inset-0 bg-[#E5D8C0]/0 group-hover:bg-[#E5D8C0]/5 rounded-sm transition-all duration-300" />
                </Link>
              )
            })}

            {/* Discover More Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDiscoverMoreOpen(!discoverMoreOpen)}
                className="relative group px-6 py-3 flex items-center gap-2 cursor-pointer"
              >
                <span className={`text-[12px] font-light uppercase tracking-[0.2em] transition-all duration-300 ${isDiscoverMoreActive || discoverMoreOpen ? "text-[#E5D8C0]" : "text-[#E5D8C0]/70 group-hover:text-[#E5D8C0]"
                  }`}>
                  {t("nav.discovermore")}
                </span>
                <motion.div animate={{ rotate: discoverMoreOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={14} className="text-[#E5D8C0]/70 group-hover:text-[#E5D8C0]" />
                </motion.div>
                <div className="absolute inset-0 bg-[#E5D8C0]/0 group-hover:bg-[#E5D8C0]/5 rounded-sm transition-all duration-300" />
              </button>

              <AnimatePresence>
                {discoverMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full mt-6 right-0 w-80 bg-[#3d2f2b]/98 backdrop-blur-3xl border border-[#E5D8C0]/10 overflow-hidden shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E5D8C0]/[0.03] via-transparent to-transparent pointer-events-none" />

                    {discoverMoreItems.map((item, index) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setDiscoverMoreOpen(false)}
                        className={`relative block px-7 py-6 transition-all duration-300 group ${getIsActive(item.path) ? "bg-[#E5D8C0]/10" : "hover:bg-[#E5D8C0]/5"
                          } ${index !== discoverMoreItems.length - 1 ? 'border-b border-[#E5D8C0]/5' : ''}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-[12px] font-light uppercase tracking-[0.2em] text-[#E5D8C0] mb-2">
                              {item.label}
                            </div>
                            <div className="text-xs text-[#E5D8C0]/60 font-light leading-relaxed">
                              {item.description}
                            </div>
                          </div>
                          <motion.div
                            className="text-[#E5D8C0]/40 group-hover:text-[#E5D8C0] transition-colors ml-4"
                            whileHover={{ x: 3 }}
                          >
                            →
                          </motion.div>
                        </div>
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#E5D8C0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/${currentLang}/quote`)}
              className="group relative flex items-center gap-3 px-8 py-4 border-2 border-[#E5D8C0]/30 text-[#E5D8C0] text-[11px] font-light uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:border-[#E5D8C0]/50 cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5D8C0]/10 to-transparent"
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Calendar size={16} className="relative z-10" />
              <span className="relative z-10">{t("nav.quote")}</span>
            </motion.button>

            <LanguageSwitcher />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin')}
              className="p-4 border-2 border-[#E5D8C0]/30 text-[#E5D8C0] hover:bg-[#E5D8C0]/5 hover:border-[#E5D8C0]/50 transition-all duration-300 cursor-pointer"
            >
              <LogIn size={18} />
            </motion.button>
          </div>

          {/* Menu Mobile */}
          <div className="flex lg:hidden items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(`/${currentLang}/quote`)}
              className="p-3 border-2 border-[#E5D8C0]/30 text-[#E5D8C0] hover:bg-[#E5D8C0]/5 transition-all cursor-pointer"
            >
              <Calendar size={18} />
            </motion.button>

            <LanguageSwitcher />

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-3 border-2 border-[#E5D8C0]/30 text-[#E5D8C0] hover:bg-[#E5D8C0]/5 transition-all cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden bg-[#3d2f2b]/98 backdrop-blur-3xl border-t border-[#E5D8C0]/10 mt-4 overflow-hidden"
            >
              <div className="py-8 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-6 py-5 text-[12px] font-light uppercase tracking-[0.2em] transition-all ${getIsActive(item.path)
                        ? "text-[#E5D8C0] bg-[#E5D8C0]/10 border-l-[3px] border-[#E5D8C0]"
                        : "text-[#E5D8C0]/70 hover:bg-[#E5D8C0]/5"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="h-px bg-gradient-to-r from-transparent via-[#E5D8C0]/20 to-transparent my-6" />

                {discoverMoreItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-6 py-5 text-[12px] font-light uppercase tracking-[0.2em] transition-all ${getIsActive(item.path)
                        ? "text-[#E5D8C0] bg-[#E5D8C0]/10 border-l-[3px] border-[#E5D8C0]"
                        : "text-[#E5D8C0]/70 hover:bg-[#E5D8C0]/5"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="px-6 pt-6">
                  <button
                    onClick={() => { navigate(`/${currentLang}/quote`); setMobileMenuOpen(false); }}
                    className="w-full py-5 border-2 border-[#E5D8C0]/30 text-[#E5D8C0] text-[12px] font-light uppercase tracking-[0.2em] hover:bg-[#E5D8C0]/5 transition-all cursor-pointer"
                  >
                    {t("nav.quote")}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E5D8C0]/20 to-transparent" />
      )}
    </motion.header>
  )
}