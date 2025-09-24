// ---------------------------------------------
// OTHER MOVIES (quand on change de genre)
// ---------------------------------------------

// Fonction appelée quand on choisit un genre dans le menu
const onCategorySelect = async (genreName) => {
  // URL pour demander les films de ce genre
  const listUrl =
    "http://localhost:8000/api/v1/titles/?genre=" +
    encodeURIComponent(genreName) +
    "&sort_by=-imdb_score&page_size=6";

  const r = await fetch(listUrl);
  const data = await r.json();
  const results = data.results;

  // On remplit jusqu’à 6 cartes
  for (let i = 1; i <= 6; i++) {
    const movie = results[i - 1];
    const imgSel = `.otherMovies .image-${i}`;
    const titleSel = `.otherMovies .titleMovie-${i}`;

    const img = document.querySelector(imgSel);
    const titleEl = document.querySelector(titleSel);

    if (!img || !titleEl) continue;

    if (!movie) {
      // Si pas assez de films → on vide la carte
      titleEl.textContent = "";
      img.removeAttribute("src");
      img.alt = "";
      continue;
    }

    // Titre immédiat
    titleEl.textContent = movie.title || "";

    // On récupère plus d’infos (pour image fiable)
    const rd = await fetch("http://localhost:8000/api/v1/titles/" + movie.id);
    const detail = await rd.json();

    img.src = detail.image_url || "";
    img.alt = movie.title || "Affiche";

    // On garde aussi l’id pour la modale
    img.dataset.movieId = movie.id;
    titleEl.dataset.movieId = movie.id;
  }
};

// On rend disponible cette fonction globalement
window.onCategorySelect = onCategorySelect;
