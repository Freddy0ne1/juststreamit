# 🎬 Projet JustStreamIT

Application web permettant de découvrir les meilleurs films grâce à une interface moderne, responsive et connectée à l’API **OCMovies**.

---

# 🚀 Installation de Tailwind CSS

## 1️⃣ Vérifier si Node.js est installé sur votre ordinateur

💻 Dans le terminal, tapez :

```bash
node -v
```

- ✅ Si Node.js est installé, vous verrez une version (exemple : `v22.19.0`).
- ❌ Sinon, téléchargez et installez-le ici :  
  🔗 [Télécharger Node.js](https://nodejs.org/fr/download)

---

## 2️⃣ Installer Tailwind CSS depuis le terminal de votre IDE

👉 Exemple : **VS Code**  
📦 Installez les deux dépendances : **`tailwindcss`** et **`@tailwindcss/cli`** avec :

```bash
npm install tailwindcss @tailwindcss/cli
```

---

## 3️⃣ Configurer Tailwind

📂 Créez un dossier **`src/`** puis un fichier **`default.css`** (ou autre nom).  
Ajoutez ce contenu :

`src/default.css`

```css
@import "tailwindcss";
```

---

## 4️⃣ Démarrer le processus de compilation CLI de Tailwind

▶️ Lancez cette commande dans le terminal :

```bash
npx @tailwindcss/cli -i ./src/default.css -o ./src/style.css --watch
```

👉 Cela génère automatiquement **`style.css`** que vous pourrez inclure dans votre HTML.

⚡ **Astuce** : Pour profiter pleinement de Tailwind, téléchargez l’extension **Tailwind CSS IntelliSense** dans **VS Code** (autocomplétion + suggestions).

---

✅ Vous pouvez maintenant utiliser toutes les classes utilitaires de **Tailwind CSS** !  
📚 [Documentation officielle](https://tailwindcss.com/docs)

---

# 🎥 API utilisée : OCMovies-API

Le projet JustStreamIT consomme les données de l’API **OCMovies** (films, genres, détails, etc.).

👉 Pour installer et lancer le serveur **OCMovies-API**, suivez ce lien GitHub officiel :  
🔗 [OCMovies-API – Installation et documentation](https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR)

---

# 🖥️ Utilisation

1. 📂 Clonez ce projet dans votre IDE (exemple : VS Code).
2. 🎥 Lancez le serveur **OCMovies-API** en local.
3. 🛠️ Démarrez la compilation Tailwind avec la commande :
   ```bash
   npx @tailwindcss/cli -i ./src/default.css -o ./src/style.css --watch
   ```
4. 🌐 Ouvrez le fichier **`index.html`** dans votre navigateur.

👉 Vous pouvez maintenant naviguer dans l’application, explorer les films, changer de genre via le menu et afficher les détails grâce à la modale.

---

✍️ Projet réalisé par **Freddy (2025)**
