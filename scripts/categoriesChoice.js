(() => {
  // -------------------------------------------------
  // CONFIG : urlGenres dans le fichier config.js
  // -------------------------------------------------
  const API = urlGenres;
  const EXCLUDE = ["action", "adventure"]; // genres à ignorer (en minuscules)
  const LS_KEY = "selectedGenre"; // clé localStorage

  // Classes réutilisées (pour simplifier)
  const ITEM_BASE_CLASS =
    "w-[229px] h-[60.5px] tablet:w-101 px-3 text-left flex items-center " +
    "font-Oswald font-semibold text-[32px] bg-white transition " +
    "hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30";

  const ITEM_ACTIVE_CLASS =
    "bg-gray-200 text-black ring-2 ring-black/20 pl-2 border-l-4 border-l-black";

  // ---------------------------------------------
  // RÉFÉRENCES DOM
  // ---------------------------------------------
  const btn = document.getElementById("genresBtn");
  const btnLabel = document.getElementById("genresBtnLabel");
  const menu = document.getElementById("genresMenu");
  const list = document.getElementById("genresList");

  // Fonction d’intégration (autres scripts branchent dessus)
  if (!window.onCategorySelect) {
    window.onCategorySelect = () => {};
  }

  // ---------------------------------------------
  // OUVRIR / FERMER LE MENU
  // ---------------------------------------------
  const openMenu = () => {
    menu.classList.remove("hidden");
    btn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    menu.classList.add("hidden");
    btn.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    if (menu.classList.contains("hidden")) openMenu();
    else closeMenu();
  };

  // ---------------------------------------------
  // STYLE ACTIF
  // ---------------------------------------------
  const clearActiveStyles = () => {
    const buttons = list.querySelectorAll("button[data-name]");
    buttons.forEach((b) => {
      // on remet la classe "de base"
      b.className = ITEM_BASE_CLASS;
      // on retire le ✓ s’il y en a un
      const chk = b.querySelector(".chk");
      if (chk) chk.remove();
      b.setAttribute("aria-selected", "false");
      b.setAttribute("aria-checked", "false");
    });
  };

  const styleActive = (name) => {
    clearActiveStyles();

    const current = list.querySelector('button[data-name="' + name + '"]');
    if (!current) return;

    // on ajoute la classe "actif"
    current.className = ITEM_BASE_CLASS + " " + ITEM_ACTIVE_CLASS;

    // on ajoute un petit ✓ au début
    const tick = document.createElement("span");
    tick.className = "chk mr-1";
    tick.textContent = "✓";
    current.insertBefore(tick, current.firstChild);

    // attributs ARIA
    current.setAttribute("aria-selected", "true");
    current.setAttribute("aria-checked", "true");

    // label du bouton principal + sauvegarde
    btnLabel.textContent = name;
    localStorage.setItem(LS_KEY, name);
  };

  // ---------------------------------------------
  // SÉLECTION D’UN GENRE
  // ---------------------------------------------
  const handleSelect = (name) => {
    styleActive(name);
    closeMenu();
    window.onCategorySelect(name);
  };

  // ---------------------------------------------
  // FABRICATION D’UN ITEM <li><button>
  // ---------------------------------------------
  const makeItem = (name) => {
    const li = document.createElement("li");
    const itemBtn = document.createElement("button");

    itemBtn.type = "button";
    itemBtn.dataset.name = name;
    itemBtn.setAttribute("role", "menuitemradio");
    itemBtn.setAttribute("aria-checked", "false");
    itemBtn.className = ITEM_BASE_CLASS;
    itemBtn.textContent = name;

    itemBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleSelect(name);
    });

    li.appendChild(itemBtn);
    return li;
  };

  // ---------------------------------------------
  // RENDU LISTE + INIT SÉLECTION
  // ---------------------------------------------
  const renderList = (genres) => {
    list.innerHTML = "";
    genres.forEach((g) => list.appendChild(makeItem(g)));
  };

  const initSelection = (genres) => {
    const saved = localStorage.getItem(LS_KEY);
    const initial = saved && genres.includes(saved) ? saved : genres[0] || null;

    if (initial) {
      styleActive(initial);
      window.onCategorySelect(initial);
    } else {
      btnLabel.textContent = "—";
    }
  };

  // ---------------------------------------------
  // ÉVÉNEMENTS
  // ---------------------------------------------
  btn.addEventListener("click", () => {
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // ---------------------------------------------
  // CHARGEMENT DES GENRES
  // ---------------------------------------------
  const loadGenres = async () => {
    const r = await fetch(API);
    const data = await r.json();
    const results = data.results || [];

    // on garde seulement les noms
    let names = results.map((g) => g.name).filter(Boolean);

    // on enlève les genres exclus (on compare en minuscules)
    names = names.filter((n) => !EXCLUDE.includes(String(n).toLowerCase()));

    // fallback simple si vide (pour voir le menu fonctionner)
    if (!names.length) names = ["Comedy", "Drama", "Sci-Fi"];

    renderList(names);
    initSelection(names);
  };

  // Démarrage (si ton script n’est pas en "defer")
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadGenres);
  } else {
    loadGenres();
  }
})();
