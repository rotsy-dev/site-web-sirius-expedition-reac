import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HybridPlugin from './hybridPlugin';

// Import des fichiers de traduction manuels (utilisés comme base)
import translationEN from '../locales/en.json';
import translationFR from '../locales/fr.json';
import translationDE from '../locales/de.json';
import translationIT from '../locales/it.json';
import { autoTranslationService } from '../services/autoTranslation';

// Les ressources de traduction manuelles (base)
const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  de: {
    translation: translationDE
  },
  it: {
    translation: translationIT
  }
};

// Initialiser le service de traduction automatique
autoTranslationService.initialize();

// Configuration i18n avec système hybride
i18n
  .use(HybridPlugin) // Plugin pour compléter automatiquement les traductions manquantes
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: ['en', 'fr', 'de', 'it'],
    defaultNS: 'translation',
    ns: ['translation'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    // Gérer les traductions manquantes avec traduction automatique
    saveMissing: false,
    missingKeyHandler: async (lng, ns, key, fallbackValue) => {
      // Si ce n'est pas la langue de base et qu'il y a une valeur de fallback
      if (lng !== 'en' && fallbackValue) {
        try {
          // Traduire automatiquement depuis l'anglais
          const translated = await autoTranslationService.translate(
            fallbackValue,
            'en',
            lng as 'fr' | 'de' | 'it'
          );
          
          // Ajouter la traduction aux ressources
          if (!i18n.hasResourceBundle(lng, ns)) {
            i18n.addResourceBundle(lng, ns, {}, true, true);
          }
          i18n.addResource(lng, ns, key, translated, { silent: true });
          
          console.debug(`Traduction automatique ajoutée: ${key} (${lng}) = ${translated}`);
        } catch (error) {
          console.warn(`Erreur lors de la traduction automatique de ${key}:`, error);
        }
      }
    }
  });

export default i18n;