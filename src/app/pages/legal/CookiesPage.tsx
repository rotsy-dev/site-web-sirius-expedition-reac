import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cookie, Check, X, Settings, ArrowLeft, ShieldCheck, Lock, BarChart3, Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface CookiesPageProps {
  currentLang?: string;
}

const COOKIE_PREFERENCES_KEY = 'cookie_preferences';
// Image de Baobabs pour le côté Safari/Voyage Madagascar
const SAFARI_IMAGE = "https://images.unsplash.com/photo-1659944984855-776187144baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW9iYWIlMjB0cmVlcyUyME1hZGFnYXNjYXIlMjBzdW5zZXR8ZW58MXx8fHwxNzY0NTkxODc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export default function CookiesPage({ currentLang }: CookiesPageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedPrefs = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));

    const img = new Image();
    img.onload = () => setHeroImageLoaded(true);
    img.src = SAFARI_IMAGE;
  }, []);

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const savePreferences = () => {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
    alert('Préférences enregistrées !');
  };

  return (
    <div className="min-h-screen bg-[#F0E7D5] dark:bg-[#1a1410] font-sans overflow-x-hidden">

      {/* --- HERO SECTION AVEC VAGUE --- */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={SAFARI_IMAGE}
            alt="Madagascar Safari Baobab"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Overlay sombre pour la lisibilité */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1 bg-[#D4A574] text-white rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              Cookies & Privacy
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg"
          >
            Politique des Cookies
          </motion.h1>
        </div>

        {/* --- DESSIN DE LA VAGUE (SVG) --- */}
        <div className="absolute bottom-0 left-0 w-full leading-[0] z-20">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.83C0,95.83,161,122.35,321.39,56.44Z"
              className="fill-[#F0E7D5] dark:fill-[#1a1410]"
            ></path>
          </svg>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="relative z-30 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#2a201d] rounded-[40px] shadow-2xl border-b-8 border-r-8 border-[#4B3935] overflow-hidden"
          >
            <div className="p-8 md:p-12">

              <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                <div className="w-16 h-16 bg-[#F0E7D5] rounded-2xl flex items-center justify-center shrink-0">
                  <Cookie className="text-[#4B3935]" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#4B3935] dark:text-white mb-3">Votre voyage commence ici</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Pour vous garantir une expérience de réservation fluide et personnalisée, nous utilisons des cookies.
                    Certains sont nécessaires pour sécuriser votre voyage sur notre site, d'autres nous aident à vous proposer
                    les meilleurs safaris à Madagascar.
                  </p>
                </div>
              </div>

              {/* LISTE DES OPTIONS */}
              <div className="grid grid-cols-1 gap-4">
                <CookieOption
                  icon={<Lock />}
                  title="Essentiels"
                  desc="Sécurité, langues et préférences de navigation."
                  status="Toujours actif"
                  isActive={true}
                  required={true}
                />
                <CookieOption
                  icon={<BarChart3 />}
                  title="Analyse du parcours"
                  desc="Comprendre quelles destinations vous font rêver pour améliorer notre site."
                  isActive={preferences.analytics}
                  onToggle={() => togglePreference('analytics')}
                />
                <CookieOption
                  icon={<Megaphone />}
                  title="Marketing"
                  desc="Recevoir nos offres spéciales safari et excursions en priorité."
                  isActive={preferences.marketing}
                  onToggle={() => togglePreference('marketing')}
                />
              </div>

              {/* ACTIONS */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t-2 border-[#F0E7D5] dark:border-white/5">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-[#4B3935] dark:text-gray-400 font-bold hover:underline"
                >
                  <ArrowLeft size={18} />
                  Retour à la navigation
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={savePreferences}
                  className="w-full sm:w-auto px-10 py-4 bg-[#4B3935] dark:bg-[#D4A574] text-white dark:text-[#4B3935] rounded-full font-black shadow-xl flex items-center justify-center gap-3 transition-colors"
                >
                  <Check size={20} />
                  CONFIRMER MES CHOIX
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="mt-10 text-center">
            <p className="text-[#4B3935]/40 dark:text-gray-500 text-sm italic">
              En continuant, vous acceptez notre politique de confidentialité liée aux voyages.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Sous-composant pour les options ---
function CookieOption({ icon, title, desc, isActive, onToggle, required = false, status }: any) {
  return (
    <div className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between gap-4 ${isActive ? 'border-[#D4A574] bg-[#F8F5F0] dark:bg-white/5' : 'border-[#4B3935]/5 bg-transparent opacity-60'
      }`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#D4A574] text-white' : 'bg-gray-200 text-gray-400'}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-[#4B3935] dark:text-white">{title}</h4>
          <p className="text-xs text-gray-500 max-w-xs">{desc}</p>
        </div>
      </div>

      {required ? (
        <span className="text-[10px] font-black text-[#D4A574] uppercase tracking-tighter">{status}</span>
      ) : (
        <button
          onClick={onToggle}
          className={`w-14 h-8 rounded-full relative transition-colors ${isActive ? 'bg-[#4B3935]' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          <motion.div
            animate={{ x: isActive ? 26 : 4 }}
            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
          />
        </button>
      )}
    </div>
  );
}