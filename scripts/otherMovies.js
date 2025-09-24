// ---------------------------------------------
// CONSTANTES
// ---------------------------------------------

// Base URL pour la liste par genre
const OM_BASE_LIST = "http://localhost:8000/api/v1/titles/?";
// Base URL pour récupérer le détail d’un film
const OM_BASE_DETAIL = "http://localhost:8000/api/v1/titles/";

// ---------------------------------------------
// HELPERS (petites fonctions utiles)
// ---------------------------------------------

// Récupère le détail d’un film (API détail)
const om_getMovieDetail = async (id) => {
  const r = await fetch(OM_BASE_DETAIL + id);
  const detail = await r.json();
  return detail;
};

// Donne l’id du film au bouton “Détails” de la carte
const om_attachMovieIdToCardButton = (fromTitleEl, movieId) => {
  // On remonte jusqu’à la carte parente (.group)
  let p = fromTitleEl;
  while (p && !p.classList.contains("group")) {
    p = p.parentElement;
  }
  if (!p) return;

  // On trouve le bouton
  const btn = p.querySelector("button");
  if (btn) {
    btn.dataset.movieId = movieId; // data-movie-id="123"
    btn.setAttribute("aria-label", "Détails du film");
  }
};

// Charge le détail du film et met l’image dans l’élément <img>
const om_setImageFromDetail = async (movieId, imgEl, movieTitle) => {
  const detail = await om_getMovieDetail(movieId);
  imgEl.src = detail.image_url || "";
  imgEl.alt = movieTitle || "Affiche";
  imgEl.dataset.movieId = movieId; // utile si on clique sur l’image
};

// Vide une carte si aucun film à cet emplacement
const om_resetCard = (titleEl, imgEl) => {
  if (titleEl) titleEl.textContent = "";
  if (imgEl) {
    imgEl.removeAttribute("src");
    imgEl.alt = "";
    imgEl.removeAttribute("data-movie-id");
  }
  // On enlève aussi l’id du bouton
  const card = titleEl?.closest(".group");
  const btn = card?.querySelector("button");
  if (btn) btn.removeAttribute("data-movie-id");
};

// ---------------------------------------------
// PROGRAMME PRINCIPAL (appelé quand on choisit un genre)
// ---------------------------------------------

// Cette fonction est appelée par le dropdown (genres-dropdown.js)
window.onCategorySelect = async (genreName) => {
  // URL de la liste pour ce genre
  const listUrl =
    OM_BASE_LIST +
    "genre=" +
    encodeURIComponent(genreName) +
    "&sort_by=-imdb_score&page_size=6";

  // 1) Récupération de la liste
  const r = await fetch(listUrl);
  const data = await r.json();
  const results = data.results || [];

  // 2) On remplit jusqu’à 6 cartes
  for (let i = 1; i <= 6; i++) {
    const movie = results[i - 1];

    const imgSel = `.otherMovies .image-${i}`;
    const titleSel = `.otherMovies .titleMovie-${i}`;

    const img = document.querySelector(imgSel);
    const titleEl = document.querySelector(titleSel);

    // Si pas de film → on vide la carte
    if (!movie) {
      om_resetCard(titleEl, img);
      continue;
    }

    // Sinon → on remplit la carte
    if (titleEl) titleEl.textContent = movie.title || "";

    if (titleEl) om_attachMovieIdToCardButton(titleEl, movie.id);

    if (img) await om_setImageFromDetail(movie.id, img, movie.title);
  }
};
