(() => {
  // ---------------------------------------------
  // HELPERS
  // ---------------------------------------------

  // Récupère le détail complet d’un film via son id.
  const getMovieDetail = async (id) => {
    const r = await fetch(url + id); // ex: ".../titles/1234"
    const detail = await r.json();
    return detail;
  };

  // Met une image (affiche) dans un <img> donné.
  const setImage = (selector, src, alt = "Affiche") => {
    const img = document.querySelector(selector);
    if (img) {
      img.src = src || "";
      img.alt = alt || "Affiche";
    }
  };

  // ---------------------------------------------
  // AFFICHAGE "MEILLEUR FILM"
  // ---------------------------------------------

  // Remplit le titre (depuis la liste) et le résumé (depuis le détail).
  const fillBestTexts = (title, detail) => {
    const titleEl = document.querySelector(".title-bestMovie");
    if (titleEl) titleEl.textContent = title || "";

    const descEl = document.querySelector(".best-description");
    if (descEl) {
      // Le long résumé vient du détail
      descEl.textContent =
        detail.long_description || detail.description || detail.summary || "";
    }
  };

  // Branche le bouton "Détails" du bloc "Meilleur film".
  const attachBestButton = (id) => {
    const btn = document.querySelector(".bestMovie button");
    if (btn) {
      btn.dataset.movieId = id;
      btn.setAttribute("aria-label", "Détails du meilleur film");
    }
  };

  // Programme principal : charge le meilleur film et remplit la section.
  const loadBestMovie = async () => {
    // 1) On récupère la liste triée
    const r = await fetch(urlBestMovie);
    const data = await r.json();
    const bestMovie = data.results[0]; // objet "liste"
    const id = bestMovie.id;

    // 2) On récupère le DÉTAIL (pour le résumé + image)
    const detail = await getMovieDetail(id);

    // 3) Texte (titre depuis la liste, résumé depuis le détail)
    fillBestTexts(bestMovie.title, detail);

    // 4) Image (depuis le détail)
    setImage(".bestImage", detail.image_url, detail.title);
    const img = document.querySelector(".bestImage");
    if (img) img.dataset.movieId = id;

    // 5) Bouton "Détails"
    attachBestButton(id);
  };

  // Lance le rendu du meilleur film.
  loadBestMovie();
})();
