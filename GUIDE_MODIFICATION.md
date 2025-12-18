# 📚 GUIDE COMPLET DE MODIFICATION - SIRIUS EXPEDITION

## 🎯 Table des Matières

1. [Fichier Principal de Contenu](#fichier-principal)
2. [Comment Modifier Chaque Section](#modifications)
3. [Ajouter/Supprimer du Contenu](#ajouter-supprimer)
4. [Préparation pour CMS (Strapi)](#cms-preparation)
5. [Checklist des Fonctionnalités](#checklist)

---

## 📝 Fichier Principal de Contenu {#fichier-principal}

**TOUT le contenu se trouve dans :**
```
/src/app/data/content.ts
```

### Structure du Fichier

```typescript
/src/app/data/content.ts
├── siteConfig           // Infos générales du site
├── heroSlides          // Carrousel page d'accueil (3 slides)
├── bestSellers         // Tours populaires (cards carousel)
├── tourSpecialties     // Spécialités (6 catégories)
├── reviews             // Témoignages clients
├── blogPosts           // Articles de blog
├── videoGallery        // Vidéos YouTube
└── faqs               // Questions fréquentes
```

---

## ✏️ Comment Modifier Chaque Section {#modifications}

### 1. Informations du Site

```typescript
export const siteConfig = {
  siteName: "Sirius Expedition",     // ← Changez ici
  tagline: "Discover Madagascar",     // ← Changez ici
  logo: "🐭",                         // ← Emoji ou URL d'image
  
  contact: {
    email: "contact@siriusexpedition.mg",    // ← Votre email
    phone: "+261 34 00 000 00",              // ← Votre téléphone
    address: "Antananarivo, Madagascar",     // ← Votre adresse
  },
  
  social: {
    facebook: "https://www.facebook.com/...",      // ← Votre page FB
    youtube: "https://www.youtube.com/@...",       // ← Votre chaîne
    tripadvisor: "https://www.tripadvisor.com/...", // ← Votre page
    google: "https://www.google.com/maps/...",     // ← Votre Google
  },
  
  videos: {
    mainYouTubeId: "dQw4w9WgXcQ",  // ← ID de votre vidéo principale
    // Pour obtenir l'ID : https://youtube.com/watch?v=ID_ICI
  },
};
```

### 2. Carrousel Hero (Page d'accueil)

```typescript
export const heroSlides = [
  {
    id: 1,                    // Numéro unique
    image: "URL_IMAGE",       // Lien de l'image
    title: "Titre",           // Titre principal
    subtitle: "Sous-titre",   // Description
    cta: "Texte bouton",      // Texte du bouton
  },
  // Ajoutez d'autres slides ici...
];
```

**Pour modifier :**
- Changez l'URL de l'image
- Changez le titre et le sous-titre
- Le carrousel défile automatiquement

### 3. Tours Best Sellers

```typescript
export const bestSellers = [
  {
    id: 1,
    title: "Nom du Tour",
    image: "URL_IMAGE",
    duration: "7 days",
    location: "Lieu",
    price: "€1,299",
    rating: 4.9,
    reviews: 156,
    description: "Description courte",
    highlights: [
      "Point fort 1",
      "Point fort 2",
      "Point fort 3",
      "Point fort 4",
    ],
    // Infos détaillées pour page tour
    longDescription: "Description complète...",
    included: ["Item 1", "Item 2"],
    notIncluded: ["Item 1", "Item 2"],
    videoId: "ID_YOUTUBE",  // Vidéo du tour
  },
  // Ajoutez d'autres tours...
];
```

### 4. Spécialités de Tours

```typescript
export const tourSpecialties = [
  {
    id: 1,
    icon: "🦜",              // Emoji
    title: "Nom",
    description: "Description",
    image: "URL_IMAGE",
    link: "/tours/url",
  },
];
```

**Les 6 spécialités requises :**
✅ Birdwatching & Photography
✅ Fort Dauphin Circuit
✅ Baobab & Tsingy Safari
✅ Discovery East (Pangalane - Tamatave - Sainte Marie)
✅ Culture & History
✅ Nature

### 5. Témoignages (Reviews)

```typescript
export const reviews = [
  {
    id: 1,
    name: "Nom Client",
    country: "Pays",
    avatar: "URL_AVATAR",    // Généré automatiquement
    rating: 5,               // 1 à 5
    text: "Témoignage complet...",
    date: "Novembre 2024",
    tour: "Nom du tour",
    verified: true,          // Badge vérifié
    platform: "TripAdvisor", // D'où vient le review
  },
];
```

**Note :** Les avatars sont générés automatiquement via UI Avatars.
Format : `https://ui-avatars.com/api/?name=Nom+Prenom&background=6D4C41&color=fff`

### 6. Articles de Blog

```typescript
export const blogPosts = [
  {
    id: 1,
    title: "Titre de l'article",
    slug: "url-article",
    excerpt: "Extrait court",
    content: "Contenu complet...",  // Pour page détaillée
    image: "URL_IMAGE",
    author: "Auteur",
    authorAvatar: "URL_AVATAR",
    date: "Date",
    category: "Catégorie",
    readTime: "5 min read",
    tags: ["tag1", "tag2"],
    featured: true,  // Article en vedette
  },
];
```

### 7. Galerie Vidéos

```typescript
export const videoGallery = [
  {
    id: 1,
    title: "Titre vidéo",
    youtubeId: "ID_YOUTUBE",  // ID YouTube
    thumbnail: "URL_THUMBNAIL",
    category: "Catégorie",
  },
];
```

**Pour obtenir l'ID YouTube :**
- URL : `https://youtube.com/watch?v=dQw4w9WgXcQ`
- ID : `dQw4w9WgXcQ`

---

## ➕ Ajouter/Supprimer du Contenu {#ajouter-supprimer}

### ➕ Ajouter un Nouveau Tour

1. Ouvrez `/src/app/data/content.ts`
2. Trouvez `export const bestSellers = [`
3. Copiez un tour existant
4. Changez les informations :

```typescript
{
  id: 5,  // ← Nouveau ID (suivant)
  title: "Mon Nouveau Tour",
  image: "https://images.unsplash.com/...",
  duration: "10 days",
  location: "Nord Madagascar",
  price: "€1,599",
  rating: 4.8,
  reviews: 0,
  description: "Description de mon tour",
  highlights: [
    "Point fort 1",
    "Point fort 2",
    "Point fort 3",
  ],
},
```

5. Sauvegardez → Le tour apparaît automatiquement ! ✅

### ➖ Supprimer un Tour

1. Ouvrez `/src/app/data/content.ts`
2. Trouvez le tour dans `bestSellers`
3. Supprimez l'objet complet (de `{` à `},`)
4. Sauvegardez ✅

### ➕ Ajouter un Témoignage

```typescript
// Dans reviews array
{
  id: 5,  // Nouveau ID
  name: "Nouveau Client",
  country: "France",
  avatar: "https://ui-avatars.com/api/?name=Nouveau+Client&background=6D4C41&color=fff",
  rating: 5,
  text: "Super expérience !",
  date: "Décembre 2024",
  tour: "Nom du tour",
  verified: true,
  platform: "Google",
},
```

### ➕ Ajouter une Vidéo

```typescript
// Dans videoGallery
{
  id: 4,  // Nouveau ID
  title: "Ma Nouvelle Vidéo",
  youtubeId: "VOTRE_ID",
  thumbnail: "https://img.youtube.com/vi/VOTRE_ID/maxresdefault.jpg",
  category: "Wildlife",
},
```

---

## 🔮 Préparation pour CMS (Strapi/autres) {#cms-preparation}

### Structure Actuelle vs Future CMS

**Actuellement :**
```typescript
import { bestSellers } from '../data/content';
```

**Avec CMS (futur) :**
```typescript
// Récupération depuis Strapi
const response = await fetch('https://votre-strapi.com/api/best-sellers');
const bestSellers = await response.json();
```

### Avantages d'utiliser Strapi

✅ Interface graphique pour modifier le contenu
✅ Pas besoin de toucher au code
✅ Gestion d'images intégrée
✅ Multi-langues facile
✅ API automatique
✅ Prévisualisation

### Migration vers Strapi - Plan

1. **Installer Strapi**
```bash
npx create-strapi-app@latest my-strapi-cms
```

2. **Créer les Content Types dans Strapi**
   - Tours
   - Reviews
   - Blog Posts
   - Videos
   - etc.

3. **Importer les données existantes**
   - Copier le contenu de `content.ts`
   - Importer dans Strapi

4. **Modifier les composants React**
```typescript
// Exemple avec Best Sellers
export function BestSellers() {
  const [tours, setTours] = useState([]);
  
  useEffect(() => {
    fetch('https://votre-strapi.com/api/best-sellers')
      .then(res => res.json())
      .then(data => setTours(data));
  }, []);
  
  // Reste du code identique...
}
```

### Alternative : Sanity CMS

Autre option populaire :
- Interface moderne
- Real-time collaboration
- Excellent pour les médias
- Plan gratuit généreux

---

## ✅ Checklist des Fonctionnalités {#checklist}

### Fonctionnalités Incluses

#### Page d'Accueil
- [x] Hero avec 3 carousels (images)
- [x] Best sellers tours (cards carousel)
- [x] Spécialités tours (6 catégories)
- [x] Galerie vidéos YouTube
- [x] Reviews/témoignages (carousel)

#### Navigation
- [x] Menu : Home
- [x] Menu : Tours
- [x] Menu : Blogs
- [x] Menu : Contact
- [x] Menu : About Us

#### Tours & Spécialités
- [x] Birdwatching & Photography
- [x] Circuit Fort Dauphin
- [x] Baobab & Tsingy Safari
- [x] Discovery East (Pangalane - Tamatave - Sainte Marie)
- [x] Culture & History
- [x] Nature tours

#### Contenu
- [x] Logo : Lemurs mouse (🐭)
- [x] Nom agence : Sirius Expedition
- [x] Blogs (articles détaillés)
- [x] Reviews avec Elfsight mention
- [x] Vidéos YouTube intégrées

#### Liens & Intégrations
- [x] TripAdvisor (liens + reviews)
- [x] Google Reviews (liens + reviews)
- [x] Chaîne YouTube (intégration vidéos)
- [x] Facebook (lien)

#### Services
- [x] Hébergement : GoDaddy + Netlify (mentionné)
- [x] Nom de domaine : GoDaddy (mentionné)
- [x] Mail Pro : Zoho (mentionné)

#### Design
- [x] Thème mocha & crème
- [x] Style WordPress professionnel
- [x] Carousels fluides et modernes
- [x] Menu professionnel avec animations
- [x] Responsive 100%
- [x] Animations Motion (Framer Motion)

#### Pages Détaillées
- [x] About Us complète
- [x] Contact avec formulaire
- [x] Blog avec articles
- [x] Tours avec d��tails
- [x] Reviews avec avatars

---

## 🎨 Personnalisation Couleurs

Fichier : `/src/styles/theme.css`

```css
:root {
  --background: #FFF8F0;   /* Crème clair */
  --primary: #6D4C41;      /* Mocha */
  --accent: #A1887F;       /* Mocha clair */
  --secondary: #D7CCC8;    /* Crème rose */
}
```

---

## 📞 Support & Questions

Pour modifier le contenu :
1. ✅ Ouvrez `/src/app/data/content.ts`
2. ✅ Trouvez la section à modifier
3. ✅ Changez les valeurs
4. ✅ Sauvegardez

**Le site se met à jour automatiquement !**

---

## 🚀 Prochaines Étapes Recommandées

1. **Remplacez les vidéos YouTube**
   - Uploadez vos propres vidéos
   - Copiez les IDs YouTube
   - Mettez à jour dans `content.ts`

2. **Ajoutez vos vraies photos**
   - Utilisez vos propres photos de tours
   - Uploadez sur Unsplash ou hébergez-les
   - Mettez à jour les URLs

3. **Personnalisez les textes**
   - Descriptions de tours
   - Témoignages clients
   - Articles de blog

4. **Connectez les réseaux sociaux**
   - Créez vos pages FB, YouTube, etc.
   - Mettez à jour les URLs dans `siteConfig.social`

5. **Préparez Strapi**
   - Pour gestion facile du contenu
   - Interface graphique
   - Pas besoin de coder

---

**Fait avec ❤️ pour Sirius Expedition**
