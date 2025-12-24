# 🔧 Solution : Erreur "Cannot find module 'react'"

## ❌ Problème

L'erreur `Cannot find module 'react' or its corresponding type declarations` apparaît car **les dépendances npm ne sont pas installées**.

## ✅ Solution

### Étape 1 : Installer Node.js (si pas déjà fait)

1. Installez **NVM-Windows** (voir `INSTALLATION_NVM.md`)
2. Installez Node.js :
   ```powershell
   nvm install lts
   nvm use lts
   ```

### Étape 2 : Installer les dépendances du projet

Dans le dossier du projet, exécutez :

```powershell
npm install
```

Ou si vous utilisez yarn (présence de `yarn.lock`) :

```powershell
yarn install
```

### Étape 3 : Redémarrer le serveur TypeScript

Dans Cursor/VS Code :
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Étape 4 : Vérifier

L'erreur devrait disparaître une fois que `node_modules` est créé avec toutes les dépendances.

## 📝 Fichiers créés/corrigés

- ✅ `tsconfig.json` - Configuration TypeScript optimisée
- ✅ `tsconfig.node.json` - Configuration pour les fichiers Node.js

## ⚠️ Note

Les erreurs TypeScript disparaîtront **automatiquement** une fois que :
1. Les dépendances sont installées (`npm install`)
2. Le serveur TypeScript est redémarré

Le code lui-même est **correct** - c'est juste que TypeScript ne peut pas trouver les types car `node_modules` n'existe pas encore.

