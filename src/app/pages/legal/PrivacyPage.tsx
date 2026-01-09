import React, { useEffect, useState, useMemo } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Clock, ShieldCheck, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslatedContent } from '../../../hooks/useTranslatedContent';
import { useTranslation } from 'react-i18next';

interface Section {
  id: string;
  title: string;
  subtitle: string;
  content: string;
}

interface PrivacyData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
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
  const translationFields = useMemo(() => ['title', 'subtitle', 'content'], []);
  const { translatedContent: translatedData, isLoading: isTranslating } = useTranslatedContent(data, translationFields);

  const displayData = useMemo(() => {
    return (translatedData as PrivacyData | null) || data;
  }, [translatedData, data]);

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
    <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F5EFE7] min-h-screen">
      {/* HEADER AVEC IMAGE DE FOND */}
      <header className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden pt-32">
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1505778276668-26b3ff7af103?q=80&w=2070)',
          }}
        />

        {/* Overlay gradient mocha/vanilla */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#443C34]/85 via-[#6B5744]/80 to-[#8B7355]/75" />

        {/* Texture subtile */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        {/* Contenu du header */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full border border-[#D4A373]/30 shadow-lg mb-8">
            <ShieldCheck className="w-5 h-5 text-[#8B7355]" />
            <span className="text-sm font-semibold text-[#443C34] uppercase tracking-wider">
              {t('common.legalDocument')}
            </span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl leading-tight">
            {displayData.title}
          </h1>

          {/* Ligne décorative */}
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent mx-auto mb-6" />

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-[#F5EFE7] max-w-3xl mx-auto leading-relaxed font-light mb-8">
            {displayData.subtitle}
          </p>

          {/* Date de mise à jour */}
          <div className="inline-flex items-center gap-2 bg-[#443C34]/50 backdrop-blur-md text-[#F5EFE7] px-5 py-2.5 rounded-full border border-white/20">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t('common.updated')}: {displayData.lastUpdated}
            </span>
          </div>
        </div>

        {/* Effet de vague en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FAF7F2" />
          </svg>
        </div>
      </header>

      {/* Indicateur de traduction */}
      {isTranslating && (
        <div className="bg-[#8B7355]/10 border-b border-[#D4A373]/20 py-3 sticky top-0 z-20 backdrop-blur-md flex justify-center items-center gap-2 text-sm text-[#443C34]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-medium">{t('common.translating')}</span>
        </div>
      )}

      {/* CONTENU PRINCIPAL */}
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

      {/* Footer décoratif */}
      <div className="h-20 bg-gradient-to-b from-transparent to-[#443C34]/5" />
    </div>
  );
}