# Contribuer à Sirius Expedition Website

Merci de votre intérêt pour contribuer à ce projet ! 🎉

## 🚀 Comment contribuer

### 1. Fork le projet
Cliquez sur le bouton "Fork" en haut à droite de la page.

### 2. Clonez votre fork
```bash
git clone https://github.com/rotsy-dev/sirius-expedition-website.git
cd sirius-expedition-website
```

### 3. Créez une branche
```bash
git checkout -b feature/nom-de-votre-feature
```

### 4. Faites vos modifications
- Suivez les conventions de code existantes
- Testez vos modifications localement
- Assurez-vous que le code compile sans erreurs

### 5. Committez vos changements
```bash
git add .
git commit -m "feat: description de votre modification"
```

**Convention de commits :**
- `feat:` pour une nouvelle fonctionnalité
- `fix:` pour une correction de bug
- `docs:` pour la documentation
- `style:` pour le formatage, sans changement de code
- `refactor:` pour la refactorisation de code
- `test:` pour l'ajout de tests
- `chore:` pour les tâches de maintenance

### 6. Poussez vers votre fork
```bash
git push origin feature/nom-de-votre-feature
```

### 7. Créez une Pull Request
Allez sur GitHub et créez une Pull Request vers la branche `main` du projet original.

## 📋 Lignes directrices

### Code Style
- Utilisez TypeScript pour tous les nouveaux fichiers
- Suivez les règles ESLint configurées
- Utilisez Tailwind CSS pour le styling
- Nommez les composants en PascalCase
- Nommez les fichiers en camelCase ou kebab-case

### Structure des composants
```tsx
import React from 'react';

interface Props {
  // Props typées
}

export const MonComposant: React.FC<Props> = ({ props }) => {
  // Logique du composant
  
  return (
    // JSX
  );
};
```

### Tests
- Ajoutez des tests pour les nouvelles fonctionnalités si possible
- Assurez-vous que tous les tests passent avant de soumettre

## 🐛 Signaler un bug

Utilisez les GitHub Issues pour signaler des bugs. Incluez :
- Description du bug
- Étapes pour reproduire
- Comportement attendu vs comportement actuel
- Captures d'écran si applicable
- Environnement (navigateur, OS, etc.)

## 💡 Proposer une fonctionnalité

Ouvrez une issue avec le tag `enhancement` et décrivez :
- La fonctionnalité proposée
- Pourquoi elle serait utile
- Comment elle pourrait être implémentée

## 📞 Questions ?

N'hésitez pas à ouvrir une issue pour poser des questions !

Merci de contribuer ! 🙏