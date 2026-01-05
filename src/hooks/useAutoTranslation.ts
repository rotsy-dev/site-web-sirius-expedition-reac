/**
 * Hook React pour la traduction automatique hybride
 */

import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { autoTranslationService, SupportedLanguage } from '../services/autoTranslation';

interface UseAutoTranslationReturn {
  t: (key: string, options?: any) => string;
  translateText: (text: string, targetLang?: SupportedLanguage) => Promise<string>;
  isTranslating: boolean;
  currentLanguage: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => Promise<void>;
}

/**
 * Hook personnalisé pour la traduction hybride
 * Combine les traductions manuelles avec les traductions automatiques
 */
export function useAutoTranslation(): UseAutoTranslationReturn {
  const { t: i18nT, i18n } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);

  const currentLanguage = (i18n.language || 'en') as SupportedLanguage;

  /**
   * Fonction de traduction améliorée qui utilise d'abord i18next
   * puis complète avec la traduction automatique si nécessaire
   */
  const t = useCallback(
    (key: string, options?: any): string => {
      // Essayer d'abord la traduction i18next standard
      const translation = i18nT(key, options);
      
      // Si la traduction retourne la clé (pas de traduction trouvée)
      // ou si c'est identique à la clé, essayer la traduction automatique
      if (translation === key || (!translation && currentLanguage !== 'en')) {
        // Pour l'instant, retourner la traduction i18next
        // La traduction automatique sera gérée par le backend hybride
        return translation;
      }
      
      return translation;
    },
    [i18nT, currentLanguage]
  );

  /**
   * Traduit un texte directement (pas une clé i18n)
   */
  const translateText = useCallback(
    async (text: string, targetLang?: SupportedLanguage): Promise<string> => {
      if (!text) return '';
      
      const target = targetLang || currentLanguage;
      if (target === 'en') return text;

      setIsTranslating(true);
      try {
        const translation = await autoTranslationService.translate(
          text,
          'en',
          target
        );
        return translation;
      } catch (error) {
        console.warn('Erreur lors de la traduction:', error);
        return text;
      } finally {
        setIsTranslating(false);
      }
    },
    [currentLanguage]
  );

  /**
   * Change la langue avec support de la traduction automatique
   */
  const changeLanguage = useCallback(
    async (lang: SupportedLanguage): Promise<void> => {
      setIsTranslating(true);
      try {
        await i18n.changeLanguage(lang);
        // Le backend hybride complétera automatiquement les traductions manquantes
      } catch (error) {
        console.error('Erreur lors du changement de langue:', error);
      } finally {
        setIsTranslating(false);
      }
    },
    [i18n]
  );

  return {
    t,
    translateText,
    isTranslating,
    currentLanguage,
    changeLanguage,
  };
}

