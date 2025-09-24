# 🚀 Installation de Tailwind CSS

---

## 1️⃣ Vérifier si Node.js est installé sur votre ordinateur

Dans le terminal, tapez :

```bash
node -v
```

✅ Si Node.js est installé, vous verrez une version (exemple : `v22.19.0`).  
❌ Sinon, téléchargez et installez-le ici :  
🔗 [Télécharger Node.js](https://nodejs.org/fr/download)

---

## 2️⃣ Installer Tailwind CSS depuis le terminal de votre IDE

👉 Exemple : **VS Code**.  
Installez les deux dépendances : **`tailwindcss`** et **`@tailwindcss/cli`** avec :

```bash
npm install tailwindcss @tailwindcss/cli
```

---

## 3️⃣ Configurer Tailwind

Créez un dossier **`src/`** puis un fichier **`default.css`** (ou autre nom).  
Ajoutez ce contenu :

`src/default.css`
```css
@import "tailwindcss";
```

---

## 4️⃣ Démarrer le processus de compilation CLI de Tailwind

Lancez cette commande dans le terminal :

```bash
npx @tailwindcss/cli -i ./src/default.css -o ./src/style.css --watch
```

👉 Cela génère automatiquement **`style.css`** que vous pourrez inclure dans votre HTML.

---

✅ Vous pouvez maintenant utiliser toutes les classes utilitaires de **Tailwind CSS** !  
📚 [Documentation officielle](https://tailwindcss.com/docs)
