(() => {
  // ---------------------------------------------
  // HELPERS (petites fonctions utiles)
  // ---------------------------------------------

  // Récupère le détail complet d’un film à partir de son id.
  // Exemple : url + "1234" → objet { title, image_url, ... }
  const getMovieDetail = async (id) => {
    const r = await fetch(url + id); // "url" est défini ailleurs (config globale)
    const detail = await r.json();
    return detail;
  };

  // À partir d’un élément (ex: le titre), remonte jusqu’à la carte (.group).
  const findCardRoot = (fromEl) => {
    let p = fromEl;
    while (p && !p.classList.contains("group")) {
      p = p.parentElement; // on remonte parent par parent
    }
    return p; // renvoie la carte ou null si pas trouvée
  };

  // Calcule combien de cartes on peut remplir (évite de dépasser la liste).
  const computeCardsToFill = (results, startIndex, maxCount) => {
    const rest = results.length - startIndex; // films restants après startIndex
    return rest < maxCount ? rest : maxCount; // on prend le plus petit
  };

  // ---------------------------------------------
  // AFFICHAGE D’UNE CARTE TOP MOVIE
  // ---------------------------------------------

  // Met l'affiche (image) du film dans l’<img> de la carte topMovies.
  const setTopImage = async (id, selector) => {
    const detail = await getMovieDetail(id); // on récupère le film complet
    const img = document.querySelector(selector); // on vise l'<img> de la carte
    if (img) {
      img.src = detail.image_url; // URL de l'affiche
      img.alt = detail.title; // texte alternatif
      img.dataset.movieId = id; // pratique pour la modale si clic sur l’image
    }
  };

  // Lie l’id du film au bouton “Détails” de la carte.
  const attachIdToTopButton = (fromTitleEl, movieId) => {
    const card = findCardRoot(fromTitleEl); // on retrouve la carte à partir du titre
    if (!card) return;
    const btn = card.querySelector("button"); // bouton "Détails" de la carte
    if (btn) {
      btn.dataset.movieId = movieId; // ex: data-movie-id="123"
      btn.setAttribute("aria-label", "Détails du film"); // accessibilité
    }
  };

  // Remplit UNE carte : titre + image + branche le bouton (pour un film donné).
  const fillTopCard = async (movie, index) => {
    const titleSel = `.topMovies .titleMovie-${index}`;
    const imageSel = `.topMovies .image-${index}`;

    // 1) Titre
    const titleEl = document.querySelector(titleSel);
    if (titleEl) {
      titleEl.textContent = movie.title || "";
    }

    // 2) Image (via endpoint détail pour récupérer image_url fiable)
    await setTopImage(movie.id, imageSel);

    // 3) Bouton "Détails" (ouvre la modale)
    if (titleEl) {
      attachIdToTopButton(titleEl, movie.id);
    }
  };

  // ---------------------------------------------
  // PROGRAMME PRINCIPAL : CHARGER ET REMPLIR
  // ---------------------------------------------

  // Charge la liste des films triés par note et remplit 6 cartes,
  // en sautant le premier (utilisé par la section "Meilleur film").
  const loadTopMovies = async () => {
    // "urlBestMovie" est défini ailleurs : liste triée par -imdb_score
    const r = await fetch(urlBestMovie);
    const data = await r.json();
    const results = data.results; // tableau de films

    const startIndex = 1; // on saute le tout premier (index 0)
    const n = computeCardsToFill(results, startIndex, 6); // max 6 cartes

    // On remplit carte par carte (1..n)
    for (let i = 1; i <= n; i++) {
      const movie = results[startIndex + i - 1]; // film correspondant
      await fillTopCard(movie, i); // on remplit la carte i
    }
  };

  // On lance le rendu des "Films les mieux notés".
  loadTopMovies();
})();
