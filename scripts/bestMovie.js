(() => {
  // ---------------------------------------------
  // HELPERS
  // ---------------------------------------------

  // Récupère le détail complet d’un film via son id.
  const getMovieDetail = async (id) => {
    const r = await fetch(url + id);
    const detail = await r.json();
    return detail;
  };

  // ---------------------------------------------
  // AFFICHAGE DU "MEILLEUR FILM"
  // ---------------------------------------------

  // Remplit le titre et le résumé du meilleur film.
  const fillBestTexts = (movie) => {
    const titleEl = document.querySelector(".title-bestMovie");
    if (titleEl) titleEl.textContent = movie.title || "";

    const descEl = document.querySelector(".best-description");
    if (descEl) {
      descEl.textContent =
        movie.long_description || movie.description || movie.summary || "";
    }
  };

  // Met l’affiche dans l’image correspondante.
  const fillBestImage = (movie) => {
    const img = document.querySelector(".bestImage");
    if (img) {
      img.src = movie.image_url;
      img.alt = movie.title;
      img.dataset.movieId = movie.id; // utile pour ouvrir la modale
    }
  };

  // Prépare le bouton "Détails" avec l’id du film.
  const attachBestButton = (id) => {
    const btn = document.querySelector(".bestMovie button");
    if (btn) {
      btn.dataset.movieId = id;
      btn.setAttribute("aria-label", "Détails du meilleur film");
    }
  };

  // ---------------------------------------------
  // PROGRAMME PRINCIPAL
  // ---------------------------------------------

  const loadBestMovie = async () => {
    // 1) On prend le premier film de la liste
    const r = await fetch(urlBestMovie);
    const data = await r.json();
    const bestMovieListItem = data.results[0]; // contient id et titre
    const id = bestMovieListItem.id;

    // 2) On va chercher le détail complet avec l’id
    const detail = await getMovieDetail(id);

    // 3) On remplit le titre, le résumé et l’image
    fillBestTexts(detail);
    fillBestImage(detail);

    // 4) On prépare le bouton "Détails"
    attachBestButton(id);
  };

  // Lancer le rendu du meilleur film
  loadBestMovie();
})();
