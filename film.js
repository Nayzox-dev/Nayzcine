// Récupérer les paramètres de l'URL
const urlParams = new URLSearchParams(window.location.search);
const movieTitle = urlParams.get('title');
const movieLink = urlParams.get('link');
const episodeCount = urlParams.get('episodes'); // Paramètre pour le nombre d'épisodes

// Affichage du titre du film
document.getElementById("movie-title").textContent = decodeURIComponent(movieTitle);

// Vérifier si le lien a bien été passé et l'afficher dans un iframe
if (movieLink) {
    const decodedLink = decodeURIComponent(movieLink); // Décoder l'URL du lien modifié
    // Affichage dans la console pour vérifier le lien
    console.log(`Lien décodé dans film.js: ${decodedLink}`);
    
    // Définir le lien de l'épisode dans l'iframe
    document.getElementById("video-frame").setAttribute("src", decodedLink);
} else {
    console.error("Aucun lien de vidéo trouvé dans l'URL.");
}

// Afficher le nombre d'épisodes si disponible
if (episodeCount) {
    document.getElementById("episode-count").textContent = `Nombre d'épisodes : ${episodeCount}`;
}
