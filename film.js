// Récupérer les paramètres de l'URL
const urlParams = new URLSearchParams(window.location.search);
const movieTitle = urlParams.get('title');
const movieLink = urlParams.get('link');

// Affichage du titre du film
document.getElementById("movie-title").textContent = decodeURIComponent(movieTitle);

// Créer une fonction de nettoyage de la page avant de charger l'iframe
function cleanUpPage() {
    // Masquer tous les éléments de pub connus (exemple générique, à adapter selon les sélecteurs)
    const ads = document.querySelectorAll('.ad-banner, .popup-ad, iframe[src*="ads"], .advertisement, .adsbygoogle, .ad-container');
    ads.forEach(ad => {
        ad.style.display = 'none';
    });

    // Cacher les iframes avec des URLs suspectes (comme celles de Google Ads)
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        const iframeSrc = iframe.getAttribute('src');
        if (iframeSrc && iframeSrc.includes("ads")) {
            iframe.style.display = 'none';
        }
    });
}

// Charger l'iframe après le nettoyage
function loadVideo() {
    cleanUpPage(); // Appel de la fonction pour masquer les publicités

    if (movieLink) {
        const decodedLink = decodeURIComponent(movieLink);
        console.log(`Lien de la vidéo: ${decodedLink}`);

        // Créer un nouvel iframe sans sandbox et charger le lien
        const iframe = document.getElementById("video-frame");
        iframe.setAttribute("src", decodedLink);
        iframe.removeAttribute("sandbox"); // Supprimer le sandbox pour permettre la lecture de la vidéo
        iframe.setAttribute("allowfullscreen", "true");
    } else {
        console.error("Aucun lien vidéo trouvé.");
    }
}

// Attendre que la page soit prête avant de charger la vidéo
window.onload = loadVideo;
