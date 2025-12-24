# Sirius Expedition Website

Site web pour Sirius Expedition - Agence de voyage spécialisée dans les expéditions d'aventure.

## 🚀 Technologies utilisées

- **React 18** - Framework JavaScript avec hooks modernes
- **TypeScript** - Typage statique complet
- **Tailwind CSS 4** - Framework CSS utility-first
- **Vite 6** - Build tool et dev server ultra-rapide
- **Framer Motion** - Animations fluides
- **Radix UI** - Composants UI accessibles

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/rotsy-dev/sirius-expedition-website.git

# Installer les dépendances
npm install
# ou
yarn install
```

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet (copiez `.env.example` si disponible) :

```env
# Mot de passe admin (changez-le en production !)
VITE_ADMIN_PASSWORD=votre_mot_de_passe_securise

# URL du site (pour les meta tags)
VITE_SITE_URL=https://siriusexpedition.mg
```

## 🛠️ Développement

```bash
# Lancer le serveur de développement
npm run dev
# ou
yarn dev
```

Le site sera accessible sur `http://localhost:5173`

## 🏗️ Build

```bash
# Créer une build de production
npm run build
# ou
yarn build

# Prévisualiser la build de production
npm run preview
# ou
yarn preview
```

## 🔍 Vérification du code

```bash
# Vérifier les types TypeScript
npm run lint
# ou
yarn lint
```

## 📁 Structure du projet

```
sirius-expedition-website/
├── src/
│   ├── app/
│   │   ├── components/     # Composants réutilisables
│   │   │   ├── admin/      # Section admin
│   │   │   └── ui/         # Composants UI (shadcn/ui)
│   │   ├── data/           # Données statiques
│   │   └── hooks/          # Custom hooks
│   ├── types/              # Types TypeScript
│   ├── styles/             # Fichiers CSS
│   └── App.tsx             # Composant principal
├── public/                 # Assets statiques
├── .env.example           # Exemple de variables d'environnement
└── index.html
```

## ✨ Fonctionnalités

- 🏔️ Galerie de destinations et expéditions
- 📝 Blog de voyage
- 💬 Système d'avis clients
- 📧 Formulaire de contact
- 🎥 Galerie vidéo
- 🎨 Carrousel de héros interactif
- 👨‍💼 Section admin pour la gestion de contenu
- 🔒 Authentification admin sécurisée
- 📤 Import/Export de contenu JSON
- 🎯 SEO optimisé (meta tags, Open Graph)
- ⚡ Code splitting pour performances optimales
- 🖼️ Lazy loading des images
- 📱 Design responsive

## 🎯 Améliorations récentes

- ✅ **Sécurité** : Mot de passe admin via variables d'environnement
- ✅ **SEO** : Meta tags complets (Open Graph, Twitter Cards)
- ✅ **Performance** : Code splitting avec React.lazy
- ✅ **TypeScript** : Types stricts pour tout le contenu
- ✅ **Images** : Lazy loading optimisé
- ✅ **Scripts** : Ajout du script `preview` et `lint`

## 📄 Licence

...

## 👥 Auteurs

Rotsy dotR

## 📞 Contact

