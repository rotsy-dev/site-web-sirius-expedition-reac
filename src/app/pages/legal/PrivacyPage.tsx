import React, { useEffect, useState, useMemo } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Clock, ShieldCheck, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslatedContent } from '../../../hooks/useTranslatedContent';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  title: string;    // Champ admin (ne doit PAS être traduit)
  subtitle: string; // Doit être traduit
  content: string;  // Doit être traduit
}

interface PrivacyData {
  title: string;        // Doit être traduit
  subtitle: string;     // Doit être traduit
  lastUpdated: string;  // Ne doit PAS être traduit (c'est une date)
  sections: Section[];  // Les sections doivent être traduites
}

interface PrivacyPageProps {
  currentLang: string;
}

export default function PrivacyPage({ currentLang }: PrivacyPageProps) {
  const { t } = useTranslation();

  // --- GESTION DU CACHE ---
  const [data, setData] = useState<PrivacyData | null>(() => {
    const cached = localStorage.getItem(`cache_privacy_${currentLang}`);
    return cached ? JSON.parse(cached) : null;
  });

  const [loading, setLoading] = useState(!data);
  const [activeSection, setActiveSection] = useState<string>('');

  // --- TRADUCTION MÉMOÏSÉE ---
  // Séparer la traduction des champs principaux et des sections
  const mainFields = useMemo(() => ['title', 'subtitle'], []);
  const sectionFields = useMemo(() => ['subtitle', 'content'], []);

  // Données principales à traduire
  const mainDataToTranslate = useMemo(() =>
    data ? { title: data.title, subtitle: data.subtitle } : null,
    [data?.title, data?.subtitle]
  );

  // Sections à traduire
  const sectionsToTranslate = useMemo(() =>
    data?.sections || null,
    [data?.sections]
  );

  const { translatedContent: translatedMainData, isLoading: isTranslatingMain } = useTranslatedContent(
    mainDataToTranslate,
    mainFields
  );

  const { translatedContent: translatedSections, isLoading: isTranslatingSections } = useTranslatedContent(
    sectionsToTranslate,
    sectionFields
  );

  const isTranslating = isTranslatingMain || isTranslatingSections;

  // Combiner les données traduites
  const displayData = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      title: (translatedMainData as any)?.title || data.title,
      subtitle: (translatedMainData as any)?.subtitle || data.subtitle,
      // Pour les sections, on garde le champ `title` admin non traduit
      // et on applique la traduction aux champs `subtitle` et `content`
      sections: (translatedSections as Section[] || data.sections).map((section, index) => ({
        ...section,
        // Si une traduction existe pour cette section, on l'utilise
        subtitle: translatedSections?.[index]?.subtitle || section.subtitle,
        content: translatedSections?.[index]?.content || section.content,
        // Le champ `title` (admin) reste inchangé
        title: section.title
      }))
    };
  }, [data, translatedMainData, translatedSections]);

  // --- EFFETS ---
  useEffect(() => {
    const fetchData = async () => {
      if (!data) setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'privacy_policies', currentLang));
        let finalData: PrivacyData | null = null;

        if (snap.exists()) {
          finalData = snap.data() as PrivacyData;
        } else {
          // Fallback sur l'anglais si la langue demandée n'existe pas
          const englishSnap = await getDoc(doc(db, 'privacy_policies', 'en'));
          if (englishSnap.exists()) finalData = englishSnap.data() as PrivacyData;
        }

        if (finalData) {
          setData(finalData);
          localStorage.setItem(`cache_privacy_${currentLang}`, JSON.stringify(finalData));
        }
      } catch (error) {
        console.error('Error loading privacy policy:', error);
      }
      setLoading(false);
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [currentLang]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section-id]');
      let current = '';
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          current = section.getAttribute('data-section-id') || '';
        }
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayData]);

  if (loading && !displayData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#F5EFE7] to-[#E8DCC8]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B7355]/20 border-t-[#8B7355] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#443C34] font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!displayData) return null;

  return (
    <div className="min-h-screen bg-[#F0E7D5] dark:bg-[#1a1410] font-sans overflow-x-hidden">
      {/* HEADER AVEC IMAGE DE FOND - Style comme CookiesPage */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1659944984855-776187144baf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW9iYWIlMjB0cmVlcyUyME1hZGFnYXNjYXIlMjBzdW5zZXR8ZW58MXx8fHwxNzY0NTkxODc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Madagascar Safari Baobab"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay sombre pour la lisibilité */}
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1 bg-[#D4A574] text-white rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              {t('common.legalDocument')}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-black text-white mb-4 drop-shadow-lg"
          >
            {displayData.title}
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

      {/* Indicateur de traduction */}
      {isTranslating && (
        <div className="bg-[#8B7355]/10 border-b border-[#D4A373]/20 py-3 sticky top-0 z-20 backdrop-blur-md flex justify-center items-center gap-2 text-sm text-[#443C34]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">{t('common.translating')}</span>
        </div>
      )}

      {/* --- CONTENT SECTION --- */}
      <section className="relative z-30 py-10 px-4">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-[320px_1fr] gap-12">
        {/* SIDEBAR - Table des matières */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#D4A373]/20 shadow-xl">
              <h3 className="font-bold text-[#443C34] text-lg mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#8B7355]" />
                {t('common.tableOfContents')}
              </h3>
              <nav className="space-y-1">
                {displayData.sections?.map((section, idx) => (
                  <a
                    key={section.id}
                    href={`#section-${section.id}`}
                    className={`block py-3 px-4 rounded-xl text-sm transition-all duration-200 ${activeSection === section.id
                      ? 'bg-gradient-to-r from-[#8B7355] to-[#A68966] text-white shadow-md transform scale-105'
                      : 'text-[#443C34]/70 hover:bg-[#F5EFE7] hover:text-[#443C34]'
                      }`}
                  >
                    <span className="font-semibold">{idx + 1}.</span> {section.subtitle}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* SECTIONS DE CONTENU */}
        <main className="space-y-12">
          {displayData.sections?.map((section, idx) => (
            <section
              key={section.id}
              id={`section-${section.id}`}
              data-section-id={section.id}
              className="scroll-mt-32"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#D4A373]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Numéro de section stylisé */}
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#8B7355] to-[#A68966] text-white rounded-full font-bold text-lg mb-6 shadow-md">
                  {idx + 1}
                </div>

                {/* Titre de section */}
                <h2 className="text-3xl md:text-4xl font-bold text-[#443C34] mb-6 leading-tight">
                  {section.subtitle}
                </h2>

                {/* Ligne décorative */}
                <div className="h-px w-20 bg-gradient-to-r from-[#D4A373] to-transparent mb-8" />

                {/* Contenu */}
                <div
                  className="prose prose-lg prose-stone max-w-none text-[#443C34]/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                  style={{
                    '--tw-prose-headings': '#443C34',
                    '--tw-prose-links': '#8B7355',
                    '--tw-prose-bold': '#443C34',
                  } as any}
                />
              </div>
            </section>
          ))}
        </main>
        </div>
      </section>
    </div>
  );
}