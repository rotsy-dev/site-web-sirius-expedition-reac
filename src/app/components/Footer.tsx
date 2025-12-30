import * as React from 'react'
import { Facebook, Youtube, Mail, Phone, MapPin, ArrowUpRight, Send, Linkedin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ScrollReveal from 'scrollreveal'

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
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  React.useEffect(() => {
    if (typeof ScrollReveal !== "undefined") {
      const sr = ScrollReveal({
        reset: false,
        distance: "60px",
        duration: 800,
        delay: 0,
        easing: "cubic-bezier(0.5, 0, 0, 1)",
        mobile: true,
      });

      sr.reveal(".section-gauche", {
        origin: "left",
        distance: "50px",
        delay: 300,
      });

      sr.reveal(".section-bas", {
        origin: "bottom",
        distance: "50px",
        delay: 300,
      });
    }
  }, []);

  const pageLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'tours', label: t('nav.tours') },
    { id: 'blogs', label: t('nav.blog') },
    { id: 'about', label: t('nav.about') },
  ]

  const corporateLinks = [
    { label: t('footer.legalNotice') || 'Mentions légales', href: '#' },
    { label: t('footer.termsOfUse') || "Conditions d'utilisation", href: '#' },
    { label: t('footer.privacyPolicy') || 'Politique de confidentialité', href: '#' },
    { label: t('footer.cookieManagement') || 'Gestion des cookies', href: '#' },
  ]

  return (
    <footer className="relative bg-[#443C34] text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 section-gauche">
          {/* Section gauche */}
          <div className="space-y-8">
            {/* Logo */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {config.siteName}
              </h1>
              <p className="text-sm text-white/60 mt-1">{t('hero.subtitle')}</p>
            </div>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-md">
              {t('footer.description')}
            </p>

            {/* Newsletter */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#F5E6D3]" />
                {t('footer.newsletter')}
              </h3>
              <p className="text-white/60 text-sm mb-4">{t('footer.newsletterText')}</p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none placeholder-white/40 focus:border-[#F5E6D3] transition-colors text-white"
                />
                <button className="bg-[#F5E6D3] hover:bg-[#EBD8C0] px-5 py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-[#443C34]">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Section navigation */}
          <div className="grid grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">
                {t('footer.quickLinks')}
              </h3>
              <nav className="space-y-4">
                {pageLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => setActiveSection(link.id)}
                    className="block text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200 text-left"
                  >
                    {link.label}
                  </button>
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
                  <a
                    key={idx}
                    href={link.href}
                    className="block text-white/80 hover:text-white hover:translate-x-1 transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Réseaux sociaux */}
              <div>
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                  {t('footer.followUs')}
                </h3>
                <div className="flex gap-3">
                  <a
                    href={config.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300"
                  >
                    <Facebook className="w-5 h-5 text-white/80 group-hover:text-[#443C34] transition-colors" />
                  </a>
                  <a
                    href={config.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300"
                  >
                    <Youtube className="w-5 h-5 text-white/80 group-hover:text-[#443C34] transition-colors" />
                  </a>
                  <a
                    href="#"
                    className="group w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5 text-white/80 group-hover:text-[#443C34] transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="h-px bg-white/10 my-10"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 section-bas">
          <p className="text-white/60 text-sm text-center md:text-left">
            © {currentYear} {config.siteName}. {t('footer.rights')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-white/70 text-sm">
            <a
              href={`mailto:${config.contact.email}`}
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{config.contact.email}</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{config.contact.address}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}