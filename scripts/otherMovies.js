// ---------------------------------------------
// CONSTANTES (garde tes valeurs actuelles)
// ---------------------------------------------
// OM_BASE_LIST : base d’URL pour récupérer une LISTE de films par genre.
// Exemple typique : "http://localhost:8000/api/v1/titles/?"
const OM_BASE_LIST = urls;

// OM_BASE_DETAIL : base d’URL pour récupérer le DÉTAIL d’un film via son id.
// Exemple typique : "http://localhost:8000/api/v1/titles/"
const OM_BASE_DETAIL = url;

// ---------------------------------------------
// HELPERS GÉNÉRIQUES (DOM + Fetch)
// ---------------------------------------------

/**
 * Petit raccourci pour document.querySelector.
 * @param {string} selector - Sélecteur CSS (ex: ".classe" ou "#id").
 * @returns {Element|null} - Le premier élément correspondant, sinon null.
 */
function $(selector) {
  return document.querySelector(selector);
}

/**
 * Remonte dans l’arbre DOM à partir d’un élément jusqu’à trouver un parent
 * qui possède la classe passée en paramètre.
 * @param {Element} el - Élement de départ (ex: un <span> dans une carte).
 * @param {string} className - Nom de la classe à chercher (ex: "group").
 * @returns {Element|null} - Le parent trouvé, sinon null si rien.
 */
function closestByClass(el, className) {
  // Tant qu’on a un élément et que c’est bien un noeud d’élément (nodeType === 1)
  while (el && el.nodeType === 1) {
    // Si l’élément courant a la classe recherchée, on le retourne
    if (el.classList.contains(className)) return el;
    // Sinon on remonte d’un parent
    el = el.parentElement;
  }
  // On n’a rien trouvé
  return null;
}

/**
 * Récupère du JSON depuis une URL avec une gestion d’erreur simple.
 * Idéal pour débuter : on évite que l’app crashe en renvoyant null si problème.
 * @param {string} url - L’URL à appeler avec fetch.
 * @returns {Promise<Object|null>} - L’objet JSON parsé, ou null en cas de souci.
 */
async function fetchJson(url) {
  try {
    // Appel réseau
    const r = await fetch(url);
    // Vérifie que le statut est 2xx
    if (!r.ok) {
      console.warn("Réponse HTTP non OK pour:", url, r.status);
      return null;
    }
    // Convertit la réponse en JSON
    return await r.json();
  } catch (err) {
    // Erreur réseau (ex: serveur down, mauvaise URL, CORS, etc.)
    console.error("Erreur réseau:", err);
    return null;
  }
}

// ---------------------------------------------
// HELPERS API (petites fonctions claires)
// ---------------------------------------------

/**
 * Construit l’URL pour une liste de films d’un genre donné.
 * - On limite à 6 films.
 * - On trie par score IMDb décroissant.
 * @param {string} genreName - Nom du genre (ex: "Comedy").
 * @returns {string} - L’URL complète prête pour fetch.
 */
function buildListUrlForGenre(genreName) {
  // On construit la query string partie par partie (lisible)
  const params = [
    "genre=" + encodeURIComponent(genreName), // encode pour gérer espaces/accents
    "sort_by=-imdb_score", // tri décroissant sur la note
    "page_size=6", // on ne veut que 6 résultats
  ].join("&");
  // On concatène avec la base (qui se termine déjà par "?")
  return OM_BASE_LIST + params;
}

/**
 * Récupère le détail d’un film à partir de son id.
 * @param {string} id - Identifiant du film (ex: "tt1234567").
 * @returns {Promise<Object|null>} - L’objet détail du film, ou null si erreur.
 */
async function getMovieDetail(id) {
  if (!id) return null; // Sécurité : si pas d’id, on arrête
  const url = OM_BASE_DETAIL + id; // Construit l’URL détail
  return await fetchJson(url); // Appelle l’API via notre helper
}

// ---------------------------------------------
// HELPERS D’INJECTION (modif DOM, petites étapes)
// ---------------------------------------------

/**
 * Met un texte dans un élément DOM s’il existe.
 * @param {Element|null} el - L’élément cible (ex: un <div> titre).
 * @param {string} value - Le texte à afficher (string vide si rien).
 */
function setText(el, value) {
  if (!el) return; // Sécurité si le sélecteur n’a rien trouvé
  el.textContent = value || ""; // Fallback sur "" si value est falsy
}

/**
 * Met à jour une image (src/alt) et, en option, un data-movie-id.
 * @param {HTMLImageElement|null} imgEl - L’élément <img> cible.
 * @param {string} src - L’URL de l’image (peut être vide).
 * @param {string} alt - Le texte alternatif (fallback "Affiche").
 * @param {string} [movieId] - Id du film pour gérer les clics (optionnel).
 */
function setImage(imgEl, src, alt, movieId) {
  if (!imgEl) return; // Sécurité DOM
  if (src) imgEl.src = src; // On met src seulement si non vide
  imgEl.alt = alt || "Affiche"; // Alt lisible pour l’accessibilité
  if (movieId) imgEl.dataset.movieId = movieId; // Utile pour ouvrir la modale
}

/**
 * Donne l’id du film au bouton "Détails" d’une carte.
 * - On part d’un élément titre (titleEl).
 * - On remonte jusqu’à la carte parente (classe .group).
 * - On attrape le <button> et on lui met data-movie-id.
 * @param {Element|null} fromTitleEl - Un élément enfant de la carte (titre).
 * @param {string} movieId - Identifiant du film.
 */
function attachMovieIdToCardButton(fromTitleEl, movieId) {
  if (!fromTitleEl || !movieId) return; // Sécurité
  const card = closestByClass(fromTitleEl, "group"); // Trouve la carte parente
  if (!card) return; // Si pas de parent ".group", on sort
  const btn = card.querySelector("button"); // On cherche le bouton de la carte
  if (!btn) return; // Si pas trouvé, on sort
  btn.dataset.movieId = movieId; // data-movie-id="123"
  btn.setAttribute("aria-label", "Détails du film"); // a11y
}

/**
 * Vide entièrement une carte (titre, image, data-movie-id).
 * @param {Element|null} titleEl - Élément du titre.
 * @param {HTMLImageElement|null} imgEl - Élément image.
 */
function resetCard(titleEl, imgEl) {
  // On enlève le texte du titre
  setText(titleEl, "");
  // On nettoie l’image (src, alt, data)
  if (imgEl) {
    imgEl.removeAttribute("src");
    imgEl.alt = "";
    imgEl.removeAttribute("data-movie-id");
  }
  // On enlève le data-movie-id du bouton s’il existe
  const card = titleEl ? closestByClass(titleEl, "group") : null;
  const btn = card ? card.querySelector("button") : null;
  if (btn) btn.removeAttribute("data-movie-id");
}

/**
 * Retourne les éléments DOM (image + titre) d’une carte d’index i (1..6).
 * Les sélecteurs supposent une structure .otherMovies avec .image-i et .titleMovie-i
 * @param {number} i - L’index de carte (entre 1 et 6).
 * @returns {{img: HTMLImageElement|null, titleEl: Element|null}}
 */
function getCardElements(i) {
  const imgSel = `.otherMovies .image-${i}`; // ex: .image-1
  const titleSel = `.otherMovies .titleMovie-${i}`; // ex: .titleMovie-1
  return { img: $(imgSel), titleEl: $(titleSel) };
}

// ---------------------------------------------
// FORMATAGE TEXTE (affichages jolis + robustes)
// ---------------------------------------------

/**
 * Construit le texte "YEAR - GENRES" de manière robuste.
 * @param {Object} movie - Objet film (détail ou liste).
 * @returns {string} - Exemple: "1999 - Action, Sci-Fi"
 */
function formatYearGenres(movie) {
  if (!movie) return ""; // Sécurité
  // Année : prend movie.year, sinon extrait AAAA de date_published
  const year =
    movie.year ||
    (movie.date_published ? movie.date_published.slice(0, 4) : "");
  // Genres : tableau -> "a, b, c" / string -> tel quel / sinon ""
  const genres = Array.isArray(movie.genres)
    ? movie.genres.join(", ")
    : movie.genres || "";
  // Assemble seulement ce qui existe
  return [year, genres].filter(Boolean).join(" - ");
}

/**
 * Construit "RATED - DURATION minutes - (COUNTRIES)".
 * @param {Object} movie - Objet film.
 * @returns {string} - Exemple: "PG-13 - 120 minutes - (USA / UK)"
 */
function formatRatingDurationCountry(movie) {
  if (!movie) return ""; // Sécurité
  // Notation (PG-13, etc.) — multiples champs possibles selon API
  const rated = movie.rated || movie.rating || "";
  // Durée en minutes : movie.duration si défini, sinon movie.runtime
  const durationMin = movie.duration != null ? movie.duration : movie.runtime;
  const durationPart = durationMin ? `${durationMin} minutes` : "";
  // Pays : array -> "USA / UK" / string -> tel quel / sinon ""
  const countries = Array.isArray(movie.countries)
    ? movie.countries.join(" / ")
    : movie.countries || movie.country || "";
  // Ajoute les pays entre parenthèses s’ils existent
  return [rated, durationPart, countries ? `(${countries})` : ""]
    .filter(Boolean)
    .join(" - ");
}

/**
 * Construit "IMDB score: X/10" si la note est disponible.
 * @param {Object} movie - Objet film.
 * @returns {string} - Exemple: "IMDB score: 8.4/10" ou "" si pas de score.
 */
function formatImdb(movie) {
  if (!movie) return ""; // Sécurité
  // On couvre plusieurs conventions possibles côté API
  const score = movie.imdb_score ?? movie.imdb ?? movie.avg_vote;
  return score ? `IMDB score: ${score}/10` : "";
}

// ---------------------------------------------
// FILL / RESET D’UNE CARTE (1 film)
// ---------------------------------------------

/**
 * Remplit une carte avec les infos d’un film :
 * - Titre
 * - data-movie-id sur le bouton
 * - Image depuis l’API DÉTAIL (pour avoir image_url fiable)
 * @param {Object} movie - Film issu de la LISTE (contient au moins id et title).
 * @param {Element|null} titleEl - Élément du titre à remplir.
 * @param {HTMLImageElement|null} imgEl - Élément image à remplir.
 */
async function fillOneCard(movie, titleEl, imgEl) {
  if (!movie) return; // Sécurité
  setText(titleEl, movie.title || ""); // Titre visible
  attachMovieIdToCardButton(titleEl, movie.id); // data-movie-id sur le bouton

  // On appelle l’API DÉTAIL pour obtenir image_url (souvent plus fiable)
  const detail = await getMovieDetail(movie.id);
  if (detail) {
    // Si on a bien le détail, on met l’image + alt + data-movie-id
    setImage(imgEl, detail.image_url || "", movie.title, movie.id);
  } else {
    // Si l’API détail échoue, on met au moins alt et data
    setImage(imgEl, "", movie.title, movie.id);
  }
}

/**
 * Vide une carte d’index i (1..6) si aucun film n’est disponible à cette place.
 * @param {number} i - Index de carte à vider.
 */
function resetOneCard(i) {
  const { img, titleEl } = getCardElements(i); // Récupère les éléments DOM
  resetCard(titleEl, img); // Nettoie la carte
}

// ---------------------------------------------
// PROGRAMME PRINCIPAL (appel dropdown)
// ---------------------------------------------

/**
 * Charge et remplit jusqu’à 6 cartes pour le genre choisi.
 * Étapes :
 *  1) Construire l’URL liste selon le genre
 *  2) Récupérer la liste (fetchJson)
 *  3) Pour i = 1..6 : remplir la carte si film, sinon la vider
 * @param {string} genreName - Nom du genre sélectionné dans le dropdown.
 */
async function fillCardsForGenre(genreName) {
  // Construit l’URL liste (genre, tri, page_size=6)
  const listUrl = buildListUrlForGenre(genreName);

  // Appelle l’API pour récupérer la liste
  const data = await fetchJson(listUrl);
  // results sera un tableau de films (ou [] si null/erreur)
  const results = data && data.results ? data.results : [];

  // Boucle sur 6 emplacements fixes
  for (let i = 1; i <= 6; i++) {
    const movie = results[i - 1]; // Film à la position i (peut être undefined)
    const { img, titleEl } = getCardElements(i); // Récupère les éléments DOM de la carte i

    if (!movie) {
      // Pas de film pour cette position -> on vide la carte
      resetCard(titleEl, img);
      continue;
    }

    // On remplit la carte avec ce film
    await fillOneCard(movie, titleEl, img);
  }
}

/**
 * Fonction exposée sur window pour être appelée
 * depuis ton dropdown (ex: on change de genre).
 * @param {string} genreName - Genre sélectionné par l’utilisateur.
 */
window.onCategorySelect = async function (genreName) {
  if (!genreName) return; // Sécurité si rien n’est passé
  await fillCardsForGenre(genreName); // Lance le remplissage des 6 cartes
};
