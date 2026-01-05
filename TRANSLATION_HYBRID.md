# Système de Traduction Hybride

## Vue d'ensemble

Le système de traduction hybride combine les traductions manuelles (dans les fichiers JSON) avec des traductions automatiques pour compléter les clés manquantes. Cela permet d'avoir une couverture complète des traductions tout en gardant la possibilité de personnaliser les traductions importantes.

## Langues supportées

- **Anglais (en)** - Langue de base
- **Français (fr)** - Traduction manuelle + automatique
- **Allemand (de)** - Traduction manuelle + automatique
- **Italien (it)** - Traduction manuelle + automatique

## Fonctionnement

### 1. Traductions manuelles (priorité)

Les traductions manuelles sont stockées dans les fichiers JSON :
- `src/locales/en.json` - Traductions anglaises (base)
- `src/locales/fr.json` - Traductions françaises
- `src/locales/de.json` - Traductions allemandes
- `src/locales/it.json` - Traductions italiennes

### 2. Traductions automatiques (complément)

Lorsqu'une clé de traduction manque dans une langue autre que l'anglais, le système :
1. Recherche la traduction anglaise correspondante
2. Utilise l'API MyMemory Translate pour traduire automatiquement
3. Met en cache la traduction pour éviter les appels répétés
4. Ajoute la traduction aux ressources i18next

### 3. Cache

Les traductions automatiques sont mises en cache dans le localStorage pour :
- Éviter les appels API répétés
- Améliorer les performances
- Réduire les coûts d'API

Le cache expire après 7 jours.

## Utilisation

### Hook standard i18next

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('nav.home')}</h1>;
}
```

### Hook de traduction hybride

```tsx
import { useAutoTranslation } from '../hooks/useAutoTranslation';

function MyComponent() {
  const { t, translateText, currentLanguage } = useAutoTranslation();
  
  // Utiliser les traductions i18n standard
  const title = t('hero.title');
  
  // Traduire un texte directement (pas une clé i18n)
  const translatedText = await translateText('Hello World', 'fr');
  
  return <div>{title}</div>;
}
```

### Changer de langue

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lang: 'en' | 'fr' | 'de' | 'it') => {
    i18n.changeLanguage(lang);
    // Le système complétera automatiquement les traductions manquantes
  };
  
  return (
    <button onClick={() => changeLanguage('fr')}>
      Français
    </button>
  );
}
```

## Architecture

### Services

- **`src/services/autoTranslation.ts`** - Service de traduction automatique avec cache
- **`src/i18n/hybridPlugin.ts`** - Plugin i18next pour compléter les traductions
- **`src/i18n/config.ts`** - Configuration i18n avec système hybride
- **`src/hooks/useAutoTranslation.ts`** - Hook React pour la traduction hybride

### Flux de traduction

1. L'utilisateur demande une traduction avec `t('key')`
2. i18next cherche d'abord dans les traductions manuelles
3. Si non trouvée et que la langue n'est pas l'anglais :
   - Le `missingKeyHandler` est déclenché
   - La traduction automatique est effectuée
   - La traduction est ajoutée aux ressources i18next
4. Le plugin hybride complète également les traductions manquantes lors du changement de langue

## Configuration

### API de traduction

Le système utilise l'API MyMemory Translate (gratuite) via :
```
https://api.mymemory.translated.net/get
```

**Note** : Pour la production, il est recommandé d'utiliser votre propre backend pour :
- Éviter les limitations CORS
- Contrôler les coûts
- Améliorer la sécurité

### Personnalisation

Pour utiliser une autre API de traduction, modifiez la fonction `translateText` dans `src/services/autoTranslation.ts` :

```typescript
async function translateText(
  text: string,
  sourceLang: SupportedLanguage,
  targetLang: SupportedLanguage
): Promise<string> {
  // Votre implémentation personnalisée
  // Exemple avec Google Translate API
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    body: JSON.stringify({ text, sourceLang, targetLang })
  });
  // ...
}
```

## Gestion du cache

### Vider le cache

```typescript
import { autoTranslationService } from '../services/autoTranslation';

// Vider tout le cache
autoTranslationService.clearCache();
```

### Durée du cache

Par défaut, le cache expire après 7 jours. Pour modifier cette durée, changez `CACHE_DURATION` dans `src/services/autoTranslation.ts`.

## Bonnes pratiques

1. **Traductions manuelles** : Utilisez les traductions manuelles pour :
   - Les textes importants (titres, CTA, etc.)
   - Les textes spécifiques au domaine
   - Les textes qui nécessitent un contexte culturel

2. **Traductions automatiques** : Laissez le système compléter automatiquement :
   - Les textes génériques
   - Les textes moins critiques
   - Les nouvelles clés ajoutées

3. **Performance** : Le système traduit par lots pour éviter de surcharger l'API

4. **Fallback** : Si la traduction automatique échoue, le texte anglais est utilisé

## Dépannage

### Les traductions automatiques ne fonctionnent pas

1. Vérifiez la console pour les erreurs
2. Vérifiez que l'API de traduction est accessible
3. Vérifiez le cache dans le localStorage (clé: `auto_translation_cache`)

### Traductions incorrectes

1. Ajoutez une traduction manuelle dans le fichier JSON correspondant
2. Les traductions manuelles ont toujours la priorité

### Performance lente

1. Le système traduit par lots de 5 clés
2. Les traductions sont mises en cache
3. Pour améliorer les performances, pré-traduisez les clés importantes manuellement

## Exemple complet

```tsx
import { useTranslation } from 'react-i18next';
import { useAutoTranslation } from '../hooks/useAutoTranslation';

function ExampleComponent() {
  const { t } = useTranslation();
  const { translateText, currentLanguage } = useAutoTranslation();
  
  // Traduction standard (manuelle ou automatique)
  const title = t('hero.title');
  
  // Traduction directe d'un texte
  const handleTranslate = async () => {
    const translated = await translateText('Hello World');
    console.log(translated);
  };
  
  return (
    <div>
      <h1>{title}</h1>
      <p>Langue actuelle: {currentLanguage}</p>
      <button onClick={handleTranslate}>Traduire</button>
    </div>
  );
}
```

## Notes importantes

- Le système fonctionne de manière asynchrone pour les traductions automatiques
- Les traductions manuelles sont toujours prioritaires
- Le cache est stocké dans le localStorage du navigateur
- Les traductions automatiques peuvent prendre quelques secondes lors du premier chargement

