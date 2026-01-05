# Guide de Traduction Automatique - Contenu Dynamique

## Vue d'ensemble

Le système de traduction hybride fonctionne maintenant avec :
- **Traductions manuelles** pour les menus, boutons et champs de contact (via i18next)
- **Traductions automatiques** pour le contenu dynamique (tours, blogs, etc.) venant de Firebase

## Comment ça fonctionne

### 1. Traductions manuelles (menus, boutons, etc.)

Tous les textes de l'interface utilisent les fichiers de traduction dans `src/locales/` :
- `en.json` - Anglais (langue de base)
- `fr.json` - Français
- `de.json` - Allemand
- `it.json` - Italien

**Exemple dans le Header :**
```tsx
const { t } = useTranslation();
const menuItems = [
  { id: 'home', label: t('nav.home') },  // "Home" en EN, "Accueil" en FR
  { id: 'tours', label: t('nav.tours') }, // "Tours" en EN, "Circuits" en FR
];
```

### 2. Traductions automatiques (contenu Firebase)

Pour le contenu dynamique (tours, blogs, etc.), utilisez le hook `useTranslatedContent` :

```tsx
import { useTranslatedContent } from '../../hooks/useTranslatedContent';

function BestSellers({ tours }) {
  // Traduire automatiquement les tours
  const { translatedContent: translatedTours, isLoading } = useTranslatedContent(
    tours,
    ['title', 'description', 'location', 'longDescription'] // Champs à traduire
  );
  
  // Utiliser translatedTours au lieu de tours
  return (
    <div>
      {translatedTours?.map(tour => (
        <div key={tour.id}>
          <h3>{tour.title}</h3> {/* Traduit automatiquement */}
          <p>{tour.description}</p> {/* Traduit automatiquement */}
        </div>
      ))}
    </div>
  );
}
```

## Champs traduits automatiquement

Par défaut, le hook traduit ces champs :
- `title`
- `subtitle`
- `description`
- `longDescription`
- `location`
- `name`
- `text`
- `content`

Vous pouvez spécifier d'autres champs :
```tsx
useTranslatedContent(content, ['title', 'customField', 'anotherField'])
```

## Structure des données Firebase

**Important :** Le contenu dans Firebase doit être en **anglais** (langue de base).

### Exemple de tour dans Firebase :

```json
{
  "id": 1,
  "title": "Baobab & Tsingy Safari",
  "description": "Explore the iconic Avenue of the Baobabs",
  "location": "West Madagascar",
  "duration": "7 days",
  "longDescription": "Embark on an unforgettable journey...",
  "highlights": [
    "Avenue of Baobabs sunset experience",
    "Tsingy UNESCO World Heritage Site"
  ]
}
```

Quand l'utilisateur sélectionne le français :
- `title` → "Safari Baobab et Tsingy" (traduit automatiquement)
- `description` → "Explorez l'emblématique Avenue des Baobabs" (traduit automatiquement)
- `location` → "Ouest de Madagascar" (traduit automatiquement)

## Implémentation dans BestSellers

Le composant `BestSellers` utilise maintenant la traduction automatique :

```tsx
// Traduire les tours automatiquement
const { translatedContent: translatedTours, isLoading } = useTranslatedContent(
  tours,
  ['title', 'description', 'location', 'longDescription']
);

// Afficher les tours traduits
{translatedTours?.map(tour => (
  <Card key={tour.id} tour={tour} />
))}
```

## Indicateur de chargement

Le hook retourne `isLoading` pour afficher un indicateur pendant la traduction :

```tsx
{isLoading && (
  <div className="flex items-center gap-2">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span>{t('common.loading')}</span>
  </div>
)}
```

## Cache

Les traductions automatiques sont mises en cache dans le localStorage pour :
- Éviter les appels API répétés
- Améliorer les performances
- Réduire les coûts

Le cache expire après 7 jours.

## Étendre à d'autres composants

Pour ajouter la traduction automatique à d'autres composants (Blogs, HeroCarousel, etc.) :

1. Importez le hook :
```tsx
import { useTranslatedContent } from '../../hooks/useTranslatedContent';
```

2. Utilisez-le avec votre contenu :
```tsx
const { translatedContent, isLoading } = useTranslatedContent(
  blogPosts,
  ['title', 'content', 'excerpt']
);
```

3. Utilisez `translatedContent` au lieu du contenu original :
```tsx
{translatedContent?.map(post => (
  <BlogPost key={post.id} post={post} />
))}
```

## Bonnes pratiques

1. **Contenu Firebase en anglais** : Assurez-vous que tout le contenu dans Firebase est en anglais
2. **Champs spécifiques** : Spécifiez uniquement les champs texte à traduire (pas les IDs, URLs, etc.)
3. **Gestion du chargement** : Affichez un indicateur pendant la traduction pour une meilleure UX
4. **Fallback** : Le système retourne le texte original en cas d'erreur de traduction

## Dépannage

### Les traductions ne fonctionnent pas

1. Vérifiez que le contenu Firebase est bien en anglais
2. Vérifiez la console pour les erreurs
3. Vérifiez que l'API de traduction est accessible
4. Vérifiez le cache dans localStorage (`auto_translation_cache`)

### Traductions incorrectes

1. Vérifiez que le contenu source est bien en anglais
2. Les traductions automatiques peuvent parfois être approximatives
3. Pour des textes critiques, considérez des traductions manuelles dans Firebase

### Performance lente

1. Les traductions sont mises en cache après la première traduction
2. Le système traduit par lots pour optimiser les performances
3. Pour améliorer les performances, pré-traduisez les contenus importants manuellement

