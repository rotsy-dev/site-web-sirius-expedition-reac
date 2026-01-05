/**
 * Service de traduction automatique hybride
 * Utilise d'abord les traductions manuelles, puis complète avec des traductions automatiques
 */

export type SupportedLanguage = 'en' | 'fr' | 'de' | 'it';

interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
    timestamp: number;
  };
}

const CACHE_KEY = 'auto_translation_cache';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours

/**
 * Récupère le cache des traductions depuis localStorage
 */
function getCache(): TranslationCache {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Erreur lors de la lecture du cache de traduction:', error);
  }
  return {};
}

/**
 * Sauvegarde le cache des traductions dans localStorage
 */
function saveCache(cache: TranslationCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Erreur lors de la sauvegarde du cache de traduction:', error);
  }
}

/**
 * Nettoie le cache des traductions expirées
 */
function cleanCache(): void {
  const cache = getCache();
  const now = Date.now();
  const cleaned: TranslationCache = {};

  Object.keys(cache).forEach(key => {
    if (cache[key].timestamp && now - cache[key].timestamp < CACHE_DURATION) {
      cleaned[key] = cache[key];
    }
  });

  if (Object.keys(cleaned).length !== Object.keys(cache).length) {
    saveCache(cleaned);
  }
}

/**
 * Vérifie si une traduction existe dans le cache
 */
function getCachedTranslation(
  text: string,
  targetLang: SupportedLanguage
): string | null {
  const cache = getCache();
  const cacheKey = `${text}_${targetLang}`;
  const cached = cache[cacheKey];

  if (cached && cached[targetLang]) {
    const age = Date.now() - (cached.timestamp || 0);
    if (age < CACHE_DURATION) {
      return cached[targetLang];
    }
  }

  return null;
}

/**
 * Sauvegarde une traduction dans le cache
 */
function cacheTranslation(
  text: string,
  targetLang: SupportedLanguage,
  translation: string
): void {
  const cache = getCache();
  const cacheKey = `${text}_${targetLang}`;
  cache[cacheKey] = {
    [targetLang]: translation,
    timestamp: Date.now(),
  };
  saveCache(cache);
}

/**
 * Traduit un texte en utilisant l'API Google Translate (via proxy gratuit)
 * Utilise un proxy public pour éviter les restrictions CORS
 */
async function translateText(
  text: string,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage
): Promise<string> {
  // Si la langue source et cible sont identiques, retourner le texte original
  if (sourceLang === targetLang) {
    return text;
  }

  // Vérifier le cache d'abord
  const cached = getCachedTranslation(text, targetLang);
  if (cached) {
    return cached;
  }

  try {
    // Utiliser l'API Google Translate via un proxy CORS
    // Note: Pour la production, vous devriez utiliser votre propre backend
    const proxyUrl = 'https://api.mymemory.translated.net/get';
    const params = new URLSearchParams({
      q: text,
      langpair: `${sourceLang}|${targetLang}`,
    });

    const response = await fetch(`${proxyUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translation = data.responseData.translatedText;
      
      // Sauvegarder dans le cache
      cacheTranslation(text, targetLang, translation);
      
      return translation;
    } else {
      throw new Error('Réponse invalide de l\'API de traduction');
    }
  } catch (error) {
    console.warn('Erreur lors de la traduction automatique:', error);
    
    // Fallback: utiliser une traduction basique ou retourner le texte original
    // Pour les clés i18n, on peut essayer de traduire les mots-clés communs
    return text;
  }
}

/**
 * Traduit un objet de traductions récursivement
 */
async function translateObject(
  obj: any,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage
): Promise<any> {
  if (typeof obj === 'string') {
    return await translateText(obj, sourceLang, targetLang);
  }

  if (Array.isArray(obj)) {
    return Promise.all(
      obj.map(item => translateObject(item, sourceLang, targetLang))
    );
  }

  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = await translateObject(obj[key], sourceLang, targetLang);
      }
    }
    return result;
  }

  return obj;
}

/**
 * Service principal de traduction automatique
 */
export class AutoTranslationService {
  private static instance: AutoTranslationService;
  private isInitialized = false;

  private constructor() {
    // Nettoyer le cache au démarrage
    cleanCache();
  }

  static getInstance(): AutoTranslationService {
    if (!AutoTranslationService.instance) {
      AutoTranslationService.instance = new AutoTranslationService();
    }
    return AutoTranslationService.instance;
  }

  /**
   * Initialise le service
   */
  initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;
    cleanCache();
  }

  /**
   * Traduit un texte
   */
  async translate(
    text: string,
    sourceLang: SupportedLanguage = 'en',
    targetLang: SupportedLanguage = 'fr'
  ): Promise<string> {
    return translateText(text, sourceLang, targetLang);
  }

  /**
   * Traduit un objet de traductions
   */
  async translateObject(
    obj: any,
    sourceLang: SupportedLanguage = 'en',
    targetLang: SupportedLanguage = 'fr'
  ): Promise<any> {
    return translateObject(obj, sourceLang, targetLang);
  }

  /**
   * Complète les traductions manquantes dans un objet de ressources
   */
  async completeTranslations(
    baseTranslations: any,
    targetLang: SupportedLanguage,
    sourceLang: SupportedLanguage = 'en'
  ): Promise<any> {
    const result: any = {};

    for (const key in baseTranslations) {
      if (baseTranslations.hasOwnProperty(key)) {
        const baseValue = baseTranslations[key];
        const targetValue = result[key];

        if (typeof baseValue === 'string') {
          // Si la traduction cible n'existe pas, traduire depuis la source
          if (!targetValue) {
            result[key] = await this.translate(baseValue, sourceLang, targetLang);
          } else {
            result[key] = targetValue;
          }
        } else if (typeof baseValue === 'object' && baseValue !== null) {
          // Récursion pour les objets imbriqués
          result[key] = await this.completeTranslations(
            baseValue,
            targetLang,
            sourceLang
          );
        } else {
          result[key] = baseValue;
        }
      }
    }

    return result;
  }

  /**
   * Nettoie le cache
   */
  clearCache(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn('Erreur lors du nettoyage du cache:', error);
    }
  }
}

export const autoTranslationService = AutoTranslationService.getInstance();

