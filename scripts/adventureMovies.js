(() => {
  // ---------------------------------------------
  // HELPERS (petites fonctions utilitaires)
  // ---------------------------------------------

  // Récupère le détail complet d’un film à partir de son id.
  // Exemple : "http://localhost:8000/api/v1/titles/1234"
  const getMovieDetail = async (id) => {
    const r = await fetch(url + id); // on appelle l’API détail
    const detail = await r.json(); // on transforme la réponse en objet JS
    return detail; // on renvoie l’objet film
  };

  // À partir d’un élément (par exemple le titre),
  // on remonte dans le DOM jusqu’à la carte complète (classe .group).
  const findCardRoot = (fromEl) => {
    let p = fromEl;
    while (p && !p.classList.contains("group")) {
      p = p.parentElement; // on remonte d’un parent à chaque tour
    }
    return p; // renvoie la carte (.group) ou null si rien trouvé
  };

  // Calcule combien de cartes on peut remplir.
  // Utile si la liste contient moins de films que prévu.
  const computeCardsToFill = (results, startIndex, maxCount) => {
    const rest = results.length - startIndex; // films restants après startIndex
    return rest < maxCount ? rest : maxCount; // on prend le plus petit
  };

  // ---------------------------------------------
  // AFFICHAGE D’UNE CARTE AVENTURE
  // ---------------------------------------------

  // Met l’affiche (image) du film dans l’<img> de la carte aventure.
  const setAdventureImage = async (
    id,
    selector = ".adventureMovies .image-1"
  ) => {
    const detail = await getMovieDetail(id); // on récupère les infos du film
    const img = document.querySelector(selector); // on vise l’<img>
    if (img) {
      img.src = detail.image_url; // l’adresse de l’image
      img.alt = detail.title; // le titre en texte alternatif
      img.dataset.movieId = id; // garde l’id pour la modale (si clic)
    }
  };

  // Pose l’id du film sur le bouton “Détails” de la carte aventure.
  const attachIdToAdventureButton = (fromTitleEl, movieId) => {
    const card = findCardRoot(fromTitleEl); // on retrouve la carte parente
    if (!card) return;
    const btn = card.querySelector("button"); // le bouton "Détails"
    if (btn) {
      btn.dataset.movieId = movieId; // ex: data-movie-id="123"
      btn.setAttribute("aria-label", "Détails du film"); // aide accessibilité
    }
  };

  // Remplit une carte aventure complète : titre + image + bouton.
  const fillAdventureCard = async (movie, index) => {
    const titleSel = `.adventureMovies .titleMovie-${index}`;
    const imageSel = `.adventureMovies .image-${index}`;

    // 1) Titre
    const titleEl = document.querySelector(titleSel);
    if (titleEl) titleEl.textContent = movie.title || "";

    // 2) Image
    await setAdventureImage(movie.id, imageSel);

    // 3) Bouton Détails
    if (titleEl) attachIdToAdventureButton(titleEl, movie.id);
  };

  // ---------------------------------------------
  // PROGRAMME PRINCIPAL
  // ---------------------------------------------

  // Charge la liste des films d’aventure et remplit jusqu’à 6 cartes.
  const loadAdventureMovies = async () => {
    const r = await fetch(urlAdventureMovies); // on appelle l’API liste
    const data = await r.json();
    const results = data.results; // tableau de films

    const startIndex = 0; // on commence au premier film
    const n = computeCardsToFill(results, startIndex, 6); // combien de cartes max

    // On remplit carte par carte
    for (let i = 1; i <= n; i++) {
      const movie = results[startIndex + i - 1]; // on prend le bon film
      await fillAdventureCard(movie, i); // on remplit la carte
    }
  };

  // On lance le chargement au démarrage
  loadAdventureMovies();
})();
