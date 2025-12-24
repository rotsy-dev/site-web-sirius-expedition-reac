# 🚀 Installation de NVM - Guide étape par étape

## ✅ Étapes d'installation

### 1️⃣ Télécharger NVM-Windows

La page de téléchargement devrait s'ouvrir dans votre navigateur. Si ce n'est pas le cas :
- Allez sur : https://github.com/coreybutler/nvm-windows/releases/latest
- Téléchargez le fichier **`nvm-setup.exe`** (le plus récent)

### 2️⃣ Installer NVM-Windows

1. **Trouvez le fichier téléchargé** (généralement dans `Téléchargements`)
2. **Clic droit** sur `nvm-setup.exe`
3. Sélectionnez **"Exécuter en tant qu'administrateur"** ⚠️ IMPORTANT
4. Suivez l'assistant d'installation :
   - Acceptez les termes
   - Choisissez le dossier d'installation (par défaut : `C:\Users\<VotreNom>\AppData\Roaming\nvm`)
   - Cliquez sur "Install"
   - Attendez la fin de l'installation

### 3️⃣ Fermer et rouvrir le terminal

**CRUCIAL** : Fermez complètement Cursor/PowerShell et rouvrez-le pour que les changements prennent effet.

### 4️⃣ Vérifier l'installation

Dans un **nouveau** terminal PowerShell (en tant qu'administrateur si possible), exécutez :

```powershell
nvm version
```

Vous devriez voir quelque chose comme : `1.1.12` ou similaire.

### 5️⃣ Installer Node.js LTS

```powershell
# Installer la dernière version LTS (Long Term Support)
nvm install lts

# Utiliser cette version
nvm use lts
```

### 6️⃣ Vérifier Node.js et npm

```powershell
node --version
npm --version
```

Vous devriez voir les versions installées.

### 7️⃣ Installer les dépendances du projet

Une fois Node.js installé, dans le dossier du projet :

```powershell
cd "d:\site web v1\site-web-sirius-expedition-reac"
npm install
```

## ⚠️ Problèmes courants

### "nvm n'est pas reconnu"
- ✅ Fermez et rouvrez complètement votre terminal
- ✅ Exécutez PowerShell en tant qu'administrateur
- ✅ Vérifiez que l'installation s'est bien terminée

### Erreur de permissions
- ✅ Exécutez toujours PowerShell en tant qu'administrateur pour installer des versions Node.js
- ✅ Vérifiez que vous avez les droits administrateur

### Node.js déjà installé
Si vous avez déjà Node.js installé, vous pouvez :
- Le désinstaller d'abord (recommandé)
- Ou laisser NVM le gérer (NVM peut coexister)

## 🎯 Prochaines étapes après installation

1. ✅ NVM installé
2. ✅ Node.js LTS installé
3. ✅ Installer les dépendances : `npm install`
4. ✅ Lancer le projet : `npm run dev`

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes, vérifiez :
- Que vous avez exécuté l'installateur en tant qu'administrateur
- Que vous avez fermé et rouvert votre terminal
- Que NVM est dans votre PATH système

