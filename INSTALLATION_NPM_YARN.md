# 📦 Installation de npm et yarn

## ℹ️ Information importante

**npm** est automatiquement inclus avec Node.js. Une fois Node.js installé via NVM, npm sera disponible.

**yarn** est un gestionnaire de paquets alternatif que vous pouvez installer en plus si vous le souhaitez.

## 🔧 Étapes d'installation

### 1️⃣ Vérifier que NVM fonctionne

**IMPORTANT** : Fermez complètement Cursor/PowerShell et rouvrez un nouveau terminal PowerShell en tant qu'administrateur.

Ensuite, testez :

```powershell
nvm version
```

Si vous voyez une erreur "nvm n'est pas reconnu", cela signifie que :
- Soit NVM n'est pas encore installé
- Soit vous n'avez pas fermé/rouvert le terminal
- Soit le terminal n'est pas en mode administrateur

### 2️⃣ Installer Node.js LTS (qui inclut npm)

```powershell
# Installer la dernière version LTS
nvm install lts

# Utiliser cette version
nvm use lts
```

### 3️⃣ Vérifier npm (inclus avec Node.js)

```powershell
node --version
npm --version
```

Vous devriez voir les versions installées. **npm est maintenant disponible !** ✅

### 4️⃣ (Optionnel) Installer yarn

Si vous préférez utiliser yarn (votre projet a un `yarn.lock`), installez-le globalement :

```powershell
npm install -g yarn
```

Puis vérifiez :

```powershell
yarn --version
```

## 📋 Résumé

| Outil | Comment l'obtenir |
|-------|-------------------|
| **npm** | ✅ Inclus automatiquement avec Node.js |
| **yarn** | Optionnel : `npm install -g yarn` |

## 🎯 Pour votre projet

Votre projet a un fichier `yarn.lock`, ce qui signifie qu'il a été créé avec yarn. Vous pouvez utiliser **npm** ou **yarn** :

### Avec npm :
```powershell
npm install
npm run dev
```

### Avec yarn :
```powershell
yarn install
yarn dev
```

Les deux fonctionnent parfaitement ! 🚀

## ⚠️ Problème : "nvm n'est pas reconnu"

Si vous voyez cette erreur après avoir installé NVM :

1. **Fermez complètement** Cursor/PowerShell
2. **Rouvrez** un nouveau terminal PowerShell
3. **Exécutez en tant qu'administrateur** (clic droit → Exécuter en tant qu'administrateur)
4. Testez à nouveau : `nvm version`

## ✅ Vérification finale

Une fois tout installé, vous devriez pouvoir exécuter :

```powershell
nvm version      # Version de NVM
node --version   # Version de Node.js
npm --version    # Version de npm
yarn --version   # Version de yarn (si installé)
```


