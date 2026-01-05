/**
 * Plugin i18next pour la traduction hybride
 * Complète automatiquement les traductions manquantes
 */

import i18next, { Module } from 'i18next';
import { autoTranslationService, SupportedLanguage } from '../services/autoTranslation';

interface HybridPluginOptions {
  enabled?: boolean;
}

class HybridPlugin implements Module {
  static type: 'module' = 'module';
  type: 'module' = 'module';
  private options: HybridPluginOptions = { enabled: true };

  init(instance: typeof i18next, options?: HybridPluginOptions): void {
    this.options = { enabled: true, ...options };
    autoTranslationService.initialize();

    // Écouter les changements de langue pour compléter les traductions
    instance.on('languageChanged', async (lng) => {
      if (this.options.enabled && lng !== 'en') {
        await this.completeMissingTranslations(lng as SupportedLanguage);
      }
    });
  }

  /**
   * Complète les traductions manquantes pour une langue donnée
   */
  private async completeMissingTranslations(targetLang: SupportedLanguage): Promise<void> {
    try {
      // Charger les ressources anglaises comme référence
      const englishResources = i18next.getResourceBundle('en', 'translation');
      const targetResources = i18next.getResourceBundle(targetLang, 'translation') || {};

      // Parcourir toutes les clés anglaises
      const missingKeys: Array<{ key: string; value: string }> = [];

      const findMissingKeys = (obj: any, prefix: string = ''): void => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const englishValue = obj[key];

            if (typeof englishValue === 'string') {
              // Vérifier si la traduction existe dans la langue cible
              const targetValue = this.getNestedValue(targetResources, fullKey.split('.'));
              
              if (!targetValue || targetValue === englishValue) {
                missingKeys.push({ key: fullKey, value: englishValue });
              }
            } else if (typeof englishValue === 'object' && englishValue !== null) {
              findMissingKeys(englishValue, fullKey);
            }
          }
        }
      };

      findMissingKeys(englishResources);

      // Traduire les clés manquantes par lots pour éviter trop d'appels API
      const batchSize = 5;
      for (let i = 0; i < missingKeys.length; i += batchSize) {
        const batch = missingKeys.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async ({ key, value }) => {
            try {
              const translated = await autoTranslationService.translate(
                value,
                'en',
                targetLang
              );

              // Ajouter la traduction aux ressources
              if (!i18next.hasResourceBundle(targetLang, 'translation')) {
                i18next.addResourceBundle(targetLang, 'translation', {}, true, true);
              }
              
              i18next.addResource(targetLang, 'translation', key, translated, { silent: true });
            } catch (error) {
              console.warn(`Erreur lors de la traduction de ${key}:`, error);
            }
          })
        );

        // Petite pause entre les lots pour éviter de surcharger l'API
        if (i + batchSize < missingKeys.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (missingKeys.length > 0) {
        console.debug(`Traductions automatiques complétées: ${missingKeys.length} clés pour ${targetLang}`);
      }
    } catch (error) {
      console.warn('Erreur lors de la complétion des traductions:', error);
    }
  }

  /**
   * Récupère une valeur imbriquée dans un objet
   */
  private getNestedValue(obj: any, path: string[]): any {
    let current = obj;
    for (const key of path) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    return current;
  }

}

export default HybridPlugin;

