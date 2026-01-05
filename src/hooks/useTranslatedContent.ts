/**
 * Hook pour traduire automatiquement le contenu dynamique (tours, blogs, etc.)
 * Utilise le service de traduction automatique pour traduire les champs texte
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { autoTranslationService, SupportedLanguage } from '../services/autoTranslation';

interface TranslationCache {
  [key: string]: string;
}

// Cache local pour éviter les traductions répétées pendant le rendu
const translationCache: TranslationCache = {};

/**
 * Traduit un texte si nécessaire (si la langue n'est pas l'anglais)
 */
async function translateIfNeeded(
  text: string,
  currentLang: SupportedLanguage,
  sourceLang: SupportedLanguage = 'en'
): Promise<string> {
  if (!text || currentLang === 'en' || currentLang === sourceLang) {
    return text;
  }

  // Vérifier le cache local d'abord
  const cacheKey = `${text}_${currentLang}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const translated = await autoTranslationService.translate(text, sourceLang, currentLang);
    translationCache[cacheKey] = translated;
    return translated;
  } catch (error) {
    console.warn('Erreur lors de la traduction:', error);
    return text; // Retourner le texte original en cas d'erreur
  }
}

/**
 * Traduit un objet de contenu récursivement
 */
async function translateContentObject<T extends Record<string, any>>(
  obj: T,
  currentLang: SupportedLanguage,
  fieldsToTranslate: string[] = ['title', 'subtitle', 'description', 'longDescription', 'location', 'name', 'text', 'content']
): Promise<T> {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const translated: any = { ...obj };

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Si c'est un champ texte à traduire
      if (fieldsToTranslate.includes(key) && typeof value === 'string' && value.trim()) {
        translated[key] = await translateIfNeeded(value, currentLang);
      }
      // Si c'est un tableau de chaînes
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
        translated[key] = await Promise.all(
          value.map((item: string) => translateIfNeeded(item, currentLang))
        );
      }
      // Si c'est un tableau d'objets (comme itinerary)
      else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        translated[key] = await Promise.all(
          value.map((item: Record<string, any>) => translateContentObject(item, currentLang, fieldsToTranslate))
        );
      }
      // Si c'est un objet imbriqué
      else if (value && typeof value === 'object' && !Array.isArray(value)) {
        translated[key] = await translateContentObject(value, currentLang, fieldsToTranslate);
      }
    }
  }

  return translated as T;
}

/**
 * Hook pour traduire automatiquement le contenu dynamique
 * 
 * @param content - Le contenu à traduire (tour, blog, etc.)
 * @param fieldsToTranslate - Liste des champs à traduire (par défaut: title, subtitle, description, etc.)
 * @returns Le contenu traduit et un état de chargement
 */
export function useTranslatedContent<T extends Record<string, any>>(
  content: T | T[] | null | undefined,
  fieldsToTranslate: string[] = ['title', 'subtitle', 'description', 'longDescription', 'location', 'name', 'text', 'content']
): {
  translatedContent: T | T[] | null;
  isLoading: boolean;
} {
  const { i18n } = useTranslation();
  // Normaliser la langue (gérer les valeurs du type "fr-FR")
  const rawLang = i18n.language || 'en';
  const baseLang = rawLang.split('-')[0] as SupportedLanguage;
  const currentLang: SupportedLanguage =
    baseLang === 'en' || baseLang === 'fr' || baseLang === 'de' || baseLang === 'it'
      ? baseLang
      : 'en';
  const [translatedContent, setTranslatedContent] = useState<T | T[] | null>(content || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!content) {
      setTranslatedContent(null);
      return;
    }

    // Si c'est l'anglais, pas besoin de traduction
    if (currentLang === 'en') {
      setTranslatedContent(content);
      return;
    }

    setIsLoading(true);

    const translate = async () => {
      try {
        if (Array.isArray(content)) {
          // Traduire chaque élément du tableau
          const translated = await Promise.all(
            content.map(item => translateContentObject(item, currentLang, fieldsToTranslate))
          );
          setTranslatedContent(translated as T[]);
        } else {
          // Traduire un objet unique
          const translated = await translateContentObject(content, currentLang, fieldsToTranslate);
          setTranslatedContent(translated);
        }
      } catch (error) {
        console.error('Erreur lors de la traduction du contenu:', error);
        setTranslatedContent(content); // Fallback au contenu original
      } finally {
        setIsLoading(false);
      }
    };

    translate();
  }, [content, currentLang, JSON.stringify(fieldsToTranslate)]);

  return {
    translatedContent: translatedContent || content || null,
    isLoading,
  };
}

