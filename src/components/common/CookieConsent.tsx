import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookie_consent';
const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'en';
  
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
    
    // Initialiser les scripts selon les préférences
    if (prefs.analytics) {
      // Initialiser Google Analytics ou autre
      console.log('Analytics enabled');
    }
    if (prefs.marketing) {
      // Initialiser les scripts marketing
      console.log('Marketing enabled');
    }
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Ne peut pas être désactivé
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            key="cookie-banner"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
          >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/95 dark:bg-[#1a1410]/95 backdrop-blur-2xl border-2 border-[#4B3935]/20 dark:border-[#F0E7D5]/20 rounded-3xl shadow-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Icône et contenu */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-gradient-to-r from-[#D4A574] to-[#C4965F] rounded-2xl">
                    <Cookie className="w-6 h-6 text-[#4B3935]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#4B3935] dark:text-[#F0E7D5] mb-2">
                      {t('cookies.title') || 'Gestion des Cookies'}
                    </h3>
                    <p className="text-sm text-[#4B3935]/70 dark:text-[#F0E7D5]/70 mb-3">
                      {t('cookies.description') || 'Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez personnaliser vos préférences.'}
                    </p>
                    <Link
                      to={`/${currentLang}/cookies`}
                      className="text-sm text-[#D4A574] hover:text-[#C4965F] font-semibold underline"
                    >
                      {t('cookies.learnMore') || 'En savoir plus'}
                    </Link>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSettings(true)}
                    className="px-6 py-3 rounded-xl border-2 border-[#4B3935]/20 dark:border-[#F0E7D5]/20 text-[#4B3935] dark:text-[#F0E7D5] font-semibold hover:bg-[#F0E7D5]/50 dark:hover:bg-[#4B3935]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    {t('cookies.settings') || 'Paramètres'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={acceptNecessary}
                    className="px-6 py-3 rounded-xl bg-[#4B3935] dark:bg-[#F0E7D5] text-[#F0E7D5] dark:text-[#4B3935] font-bold hover:opacity-90 transition-all"
                  >
                    {t('cookies.acceptNecessary') || 'Accepter uniquement les essentiels'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={acceptAll}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-[#4B3935] font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('cookies.acceptAll') || 'Tout accepter'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Modal des paramètres */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            key="cookie-settings-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1a1410] rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-8 border-2 border-[#4B3935]/20 dark:border-[#F0E7D5]/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#4B3935] dark:text-[#F0E7D5]">
                  {t('cookies.settings') || 'Paramètres des Cookies'}
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-xl hover:bg-[#F0E7D5]/50 dark:hover:bg-[#4B3935]/20 transition-all"
                >
                  <X className="w-5 h-5 text-[#4B3935] dark:text-[#F0E7D5]" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Cookies nécessaires */}
                <div className="p-4 rounded-2xl border-2 border-[#4B3935]/10 dark:border-[#F0E7D5]/10">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-[#4B3935] dark:text-[#F0E7D5]">
                        {t('cookies.necessary') || 'Cookies nécessaires'}
                      </h4>
                      <p className="text-sm text-[#4B3935]/70 dark:text-[#F0E7D5]/70">
                        {t('cookies.necessaryDesc') || 'Ces cookies sont essentiels au fonctionnement du site.'}
                      </p>
                    </div>
                    <div className="p-2 bg-gradient-to-r from-[#D4A574] to-[#C4965F] rounded-xl">
                      <Check className="w-5 h-5 text-[#4B3935]" />
                    </div>
                  </div>
                </div>

                {/* Cookies analytiques */}
                <div className="p-4 rounded-2xl border-2 border-[#4B3935]/10 dark:border-[#F0E7D5]/10">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-[#4B3935] dark:text-[#F0E7D5]">
                        {t('cookies.analytics') || 'Cookies analytiques'}
                      </h4>
                      <p className="text-sm text-[#4B3935]/70 dark:text-[#F0E7D5]/70">
                        {t('cookies.analyticsDesc') || 'Ces cookies nous aident à comprendre comment les visiteurs utilisent le site.'}
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference('analytics')}
                      className={`p-2 rounded-xl transition-all ${
                        preferences.analytics
                          ? 'bg-gradient-to-r from-[#D4A574] to-[#C4965F]'
                          : 'bg-[#4B3935]/10 dark:bg-[#F0E7D5]/10'
                      }`}
                    >
                      <Check className={`w-5 h-5 ${preferences.analytics ? 'text-[#4B3935]' : 'text-[#4B3935]/30 dark:text-[#F0E7D5]/30'}`} />
                    </button>
                  </div>
                </div>

                {/* Cookies marketing */}
                <div className="p-4 rounded-2xl border-2 border-[#4B3935]/10 dark:border-[#F0E7D5]/10">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-[#4B3935] dark:text-[#F0E7D5]">
                        {t('cookies.marketing') || 'Cookies marketing'}
                      </h4>
                      <p className="text-sm text-[#4B3935]/70 dark:text-[#F0E7D5]/70">
                        {t('cookies.marketingDesc') || 'Ces cookies sont utilisés pour vous proposer des publicités personnalisées.'}
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference('marketing')}
                      className={`p-2 rounded-xl transition-all ${
                        preferences.marketing
                          ? 'bg-gradient-to-r from-[#D4A574] to-[#C4965F]'
                          : 'bg-[#4B3935]/10 dark:bg-[#F0E7D5]/10'
                      }`}
                    >
                      <Check className={`w-5 h-5 ${preferences.marketing ? 'text-[#4B3935]' : 'text-[#4B3935]/30 dark:text-[#F0E7D5]/30'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-[#4B3935]/20 dark:border-[#F0E7D5]/20 text-[#4B3935] dark:text-[#F0E7D5] font-semibold hover:bg-[#F0E7D5]/50 dark:hover:bg-[#4B3935]/20 transition-all"
                >
                  {t('common.cancel') || 'Annuler'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => savePreferences(preferences)}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4A574] to-[#C4965F] text-[#4B3935] font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  {t('common.save') || 'Enregistrer'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
