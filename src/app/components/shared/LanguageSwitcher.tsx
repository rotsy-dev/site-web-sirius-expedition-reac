import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAutoTranslation } from '../../../hooks/useAutoTranslation';

// Composants SVG pour les drapeaux
const FlagIcon = ({ country }: { country: 'gb' | 'fr' | 'de' | 'it' }) => {
  const flags = {
    gb: (
      <svg viewBox="0 0 640 480" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
        <rect width="640" height="480" fill="#012169" />
        <path d="M0 0l640 480M640 0L0 480" stroke="#fff" strokeWidth="60" />
        <path d="M0 0l640 480M640 0L0 480" stroke="#C8102E" strokeWidth="40" />
        <path d="M320 0v480M0 240h640" stroke="#fff" strokeWidth="100" />
        <path d="M320 0v480M0 240h640" stroke="#C8102E" strokeWidth="60" />
      </svg>
    ),
    fr: (
      <svg viewBox="0 0 640 480" className="w-6 h-6">
        <path fill="#fff" d="M0 0h640v480H0z" />
        <path fill="#00267f" d="M0 0h213.3v480H0z" />
        <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
      </svg>
    ),
    de: (
      <svg viewBox="0 0 640 480" className="w-6 h-6">
        <path fill="#000" d="M0 0h640v160H0z" />
        <path fill="#dd0000" d="M0 160h640v160H0z" />
        <path fill="#ffce00" d="M0 320h640v160H0z" />
      </svg>
    ),
    it: (
      <svg viewBox="0 0 640 480" className="w-6 h-6">
        <path fill="#fff" d="M0 0h640v480H0z" />
        <path fill="#009246" d="M0 0h213.3v480H0z" />
        <path fill="#ce2b37" d="M426.7 0H640v480H426.7z" />
      </svg>
    )
  };
  return flags[country];
};

const languages = [
  { code: 'en', name: 'English', flag: 'gb' as const },
  { code: 'fr', name: 'Français', flag: 'fr' as const },
  { code: 'de', name: 'Deutsch', flag: 'de' as const },
  { code: 'it', name: 'Italiano', flag: 'it' as const }
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: currentLangParam } = useParams(); // Récupère la langue actuelle depuis l'URL

  const { changeLanguage: changeLanguageWithAuto, isTranslating } = useAutoTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normaliser le code de langue pour l'affichage (priorité à l'URL)
  const displayLangCode = currentLangParam || i18n.language.split('-')[0].toLowerCase();
  const currentLanguage = languages.find(lang => lang.code === displayLangCode) || languages.find(lang => lang.code === 'en') || languages[0];

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (newLangCode: string) => {
    setIsOpen(false);

    // 1. Calculer le nouveau chemin URL
    // On récupère tous les segments (ex: ['fr', 'blog', 'mon-article'])
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // On remplace le premier segment (la langue) par la nouvelle
    if (pathSegments.length > 0) {
      pathSegments[0] = newLangCode;
    } else {
      pathSegments.push(newLangCode);
    }

    const newPath = `/${pathSegments.join('/')}`;

    // 2. Exécuter le changement de langue (i18next + auto-traduction)
    await changeLanguageWithAuto(newLangCode as 'en' | 'fr' | 'de' | 'it');

    // 3. Naviguer vers la nouvelle URL
    navigate(newPath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
        className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
        aria-label="Change language"
      >
        {isTranslating ? (
          <Loader2 className="w-5 h-5 animate-spin text-zinc-600 dark:text-zinc-400" />
        ) : (
          <>
            <FlagIcon country={currentLanguage.flag} />
            <ChevronDown className="absolute -bottom-1 -right-1 w-3 h-3 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-700" />
          </>
        )}
      </button>

      {/* Menu Déroulant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50"
          >
            {languages.map((language) => {
              const isActive = displayLangCode === language.code;
              return (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  disabled={isTranslating}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? 'bg-zinc-100 dark:bg-zinc-800' : ''
                    }`}
                >
                  <FlagIcon country={language.flag} />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {language.name}
                  </span>

                  {isActive && (
                    <span className="ml-auto text-[#4B3935] dark:text-[#A68966] font-bold">✓</span>
                  )}

                  {isTranslating && !isActive && (
                    <Loader2 className="ml-auto w-4 h-4 animate-spin text-zinc-400" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};