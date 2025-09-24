(() => {
  // -------------------------------------------------
  // CONFIG : url dans le fichier config.js
  // -------------------------------------------------
  const BASE_URL = url;

  // -------------------------------------------------
  // RÉFÉRENCES MODALE
  // -------------------------------------------------
  const overlayId = "bestMovieModal"; // l’overlay noir qui entoure la modale
  const $ = (sel) => document.querySelector(sel); // petit raccourci
  const byId = (id) => document.getElementById(id); // petit raccourci

  const modalOverlay = byId(overlayId);
  const closeX = byId("movieModalCloseX"); // bouton croix (mobile/tablette)
  const closeBtn = byId("movieModalCloseBtn"); // bouton "Fermer" (ordi)

  // -------------------------------------------------
  // OUVRIR / FERMER LA MODALE
  // -------------------------------------------------
  const openModal = () => {
    modalOverlay.classList.remove("hidden");
    modalOverlay.classList.add("flex");
  };

  const closeModal = () => {
    modalOverlay.classList.remove("flex");
    modalOverlay.classList.add("hidden");
  };

  // on ferme uniquement via la croix ou le bouton (pas via clic overlay)
  if (closeX) closeX.addEventListener("click", closeModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  // -------------------------------------------------
  // HELPERS D’INJECTION (remplir le contenu)
  // -------------------------------------------------
  const setText = (id, value) => {
    const el = byId(id);
    if (el) el.textContent = value ?? "";
  };

  const setPoster = (src, alt = "Affiche") => {
    const img = byId("mm-poster");
    if (img) {
      img.src = src || "";
      img.alt = alt || "Affiche";
    }
  };

  // Petits formatages pour afficher joliment
  const fmtYearGenres = (movie) => {
    const year =
      movie.year ??
      (movie.date_published ? movie.date_published.slice(0, 4) : "");
    const genres = Array.isArray(movie.genres)
      ? movie.genres.join(", ")
      : movie.genres || "";
    return [year, genres].filter(Boolean).join(" - ");
  };

  const fmtRatingDurationCountry = (movie) => {
    const rated = movie.rated || movie.rating || "";
    const durationMin = movie.duration ?? movie.runtime ?? "";
    const countries = Array.isArray(movie.countries)
      ? movie.countries.join(" / ")
      : movie.countries || movie.country || "";
    const durationPart = durationMin ? `${durationMin} minutes` : "";
    return [rated, durationPart, countries ? `(${countries})` : ""]
      .filter(Boolean)
      .join(" - ");
  };

  const fmtImdb = (movie) => {
    const score = movie.imdb_score ?? movie.imdb ?? movie.avg_vote ?? "";
    return score ? `IMDB score: ${score}/10` : "";
  };

  const fmtBoxOffice = (movie) => {
    const income = movie.worldwide_gross_income || movie.income || "";
    return income ? `Recettes au box-office: ${income}` : "";
  };

  const fmtPeople = (listLike) => {
    if (!listLike) return "";
    return Array.isArray(listLike) ? listLike.join(", ") : String(listLike);
  };

  // -------------------------------------------------
  // REMPLIR LA MODALE À PARTIR D’UN OBJET FILM
  // -------------------------------------------------
  const fillModal = (movie) => {
    setText("mm-title", movie.title || "");
    setText("mm-year-genres", fmtYearGenres(movie));
    setText("mm-rating-duration-country", fmtRatingDurationCountry(movie));
    setText("mm-imdb", fmtImdb(movie));
    setText("mm-boxoffice", fmtBoxOffice(movie));
    setText("mm-directors", fmtPeople(movie.directors));
    setText(
      "mm-summary",
      movie.description || movie.long_description || movie.summary || ""
    );
    setText("mm-actors", fmtPeople(movie.actors));
    setPoster(
      movie.image_url || movie.poster_url || "",
      movie.title || "Affiche"
    );
  };

  // -------------------------------------------------
  // OUVRIR LA MODALE À PARTIR D’UN ID (on va chercher le détail)
  // -------------------------------------------------
  const openMovieModalById = async (id) => {
    const res = await fetch(BASE_URL + id);
    const movie = await res.json();
    fillModal(movie); // on remplit les champs de la modale
    openModal(); // on affiche la modale
  };

  // -------------------------------------------------
  // DÉLÉGATION : tout bouton avec data-movie-id ouvre la modale
  // -------------------------------------------------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-movie-id]");
    if (!btn) return; // on ignore les clics ailleurs
    const id = btn.dataset.movieId;
    if (!id) return; // si pas d'id, on ne fait rien
    openMovieModalById(id); // on ouvre la modale pour cet id
  });
})();
