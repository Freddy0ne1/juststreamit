// Quand le DOM (structure HTML) est entièrement chargé, on lance la fonction
document.addEventListener("DOMContentLoaded", () => {
  // On sélectionne toutes les sections qui ont la classe .toggle-section
  // Chaque "section" doit contenir un bouton et des éléments cachés (.extra)
  document.querySelectorAll(".toggle-section").forEach((section) => {
    // On cherche le bouton de la section (classe .toggle-btn)
    const btn = section.querySelector(".toggle-btn");

    // On récupère tous les éléments "en plus" (classe .extra)
    const extras = section.querySelectorAll(".extra");

    // Si pas de bouton ou pas d'éléments à cacher/afficher → on sort
    if (!btn || extras.length === 0) return;

    // État interne : est-ce qu’on est en mode "déplié" ou "replié" ?
    let expanded = false;

    // Quand on clique sur le bouton
    btn.addEventListener("click", () => {
      // On inverse l’état (false → true, true → false)
      expanded = !expanded;

      // Pour chaque élément .extra, on ajoute/retire la classe "hidden"
      // (hidden = caché en Tailwind)
      extras.forEach((el) => el.classList.toggle("hidden", !expanded));

      // On change le texte du bouton selon l’état
      // - "Voir moins" si c’est déplié
      // - "Voir plus" si c’est replié
      btn.textContent = expanded ? "Voir moins" : "Voir plus";

      // Accessibilité : aria-expanded="true/false" pour les lecteurs d’écran
      btn.setAttribute("aria-expanded", String(expanded));
    });
  });
});
