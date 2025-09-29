// Création de l'url de base
const url = "http://localhost:8000/api/v1/titles/";
const urls = "http://localhost:8000/api/v1/titles/?";

// Création de l'url pour le meilleur film et les films les mieux notés
const urlBestMovie =
  "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=10";

// Création de l'url pour le meilleur film d'action
const urlActionMovies =
  "http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score&page_size=10";

// Création de l'url pour le meilleur film d'aventure
const urlAdventureMovies =
  "http://localhost:8000/api/v1/titles/?genre=Adventure&sort_by=-imdb_score&page_size=10";

// Création de l'url pour les catégories de films
const urlGenres = "http://localhost:8000/api/v1/genres/?page_size=25";
