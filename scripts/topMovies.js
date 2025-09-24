(() => {
  // ---------------------------------------------
  // HELPERS
  // ---------------------------------------------

  // Récupère le détail d’un film
  const getMovieDetail = async (id) => {
    const r = await fetch(url + id);
    return await r.json();
  };

  // Met l’image d’un film dans une carte
  const setMovieImage = async (id, selector) => {
    const detail = await getMovieDetail(id);
    const img = document.querySelector(selector);
    if (img) {
      img.src = detail.image_url;
      img.alt = detail.title;
      img.dataset.movieId = id;
    }
  };

  // Pose l’id sur le bouton "Détails"
  const attachIdToCardButton = (fromTitleEl, movieId) => {
    let card = fromTitleEl;
    while (card && !card.classList.contains("group")) {
      card = card.parentElement;
    }
    if (!card) return;
    const btn = card.querySelector("button");
    if (btn) {
      btn.dataset.movieId = movieId;
      btn.setAttribute("aria-label", "Détails du film");
    }
  };

  // ---------------------------------------------
  // PROGRAMME PRINCIPAL
  // ---------------------------------------------

  const loadTopMovies = async () => {
    const r = await fetch(urlBestMovie);
    const data = await r.json();
    const results = data.results;

    const startIndex = 1; // on saute le "meilleur film"
    const maxCards = 6; // max 6 cartes
    const n = Math.min(results.length - startIndex, maxCards);

    for (let i = 1; i <= n; i++) {
      const movie = results[startIndex + i - 1];

      const titleEl = document.querySelector(".topMovies .titleMovie-" + i);
      if (titleEl) titleEl.textContent = movie.title || "";

      await setMovieImage(movie.id, ".topMovies .image-" + i);

      if (titleEl) attachIdToCardButton(titleEl, movie.id);
    }
  };

  loadTopMovies();
})();
