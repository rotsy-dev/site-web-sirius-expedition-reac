# 📦 Guide d'installation de NVM pour Windows

## 🪟 Installation de NVM-Windows

### Étape 1 : Télécharger NVM-Windows

1. Allez sur la page de téléchargement : https://github.com/coreybutler/nvm-windows/releases
2. Téléchargez le fichier **`nvm-setup.exe`** (dernière version)
3. Ou téléchargez le fichier **`nvm-setup.zip`** et extrayez-le

### Étape 2 : Installer NVM-Windows

1. **Exécutez `nvm-setup.exe` en tant qu'administrateur** (clic droit → Exécuter en tant qu'administrateur)
2. Suivez l'assistant d'installation
3. **Important** : Notez le chemin d'installation (par défaut : `C:\Users\<VotreNom>\AppData\Roaming\nvm`)

### Étape 3 : Vérifier l'installation

Ouvrez une **nouvelle** fenêtre PowerShell ou CMD (fermez et rouvrez) et exécutez :

```powershell
nvm version
```

Vous devriez voir la version de NVM installée (ex: `1.1.12`)

### Étape 4 : Installer Node.js

```powershell
# Installer la dernière version LTS (recommandé)
nvm install lts

# Ou installer une version spécifique (ex: 20.11.0)
nvm install 20.11.0

# Utiliser la version installée
nvm use lts
# ou
nvm use 20.11.0
```

### Étape 5 : Vérifier Node.js et npm

```powershell
node --version
npm --version
```

## 🔧 Commandes NVM utiles

```powershell
# Lister les versions de Node.js installées
nvm list

# Lister les versions disponibles à installer
nvm list available

# Installer une version spécifique
nvm install <version>

# Utiliser une version spécifique
nvm use <version>

# Désinstaller une version
nvm uninstall <version>

# Utiliser la version par défaut
nvm use default
```

## ⚠️ Notes importantes

1. **Fermez et rouvrez votre terminal** après l'installation pour que les changements prennent effet
2. **Exécutez en tant qu'administrateur** si vous rencontrez des problèmes de permissions
3. **Désinstallez Node.js existant** avant d'installer NVM si vous avez déjà Node.js installé (recommandé)

## 🐛 Résolution de problèmes

### Erreur : "nvm n'est pas reconnu"
- Fermez et rouvrez votre terminal
- Vérifiez que NVM est dans votre PATH
- Réinstallez NVM en tant qu'administrateur

### Erreur de permissions
- Exécutez PowerShell en tant qu'administrateur
- Vérifiez les permissions du dossier d'installation

## 📚 Ressources

- Documentation officielle : https://github.com/coreybutler/nvm-windows
- Versions Node.js disponibles : https://nodejs.org/

