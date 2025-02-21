let allMovies = [];

async function loadMovies() {
    const response = await fetch('fsa.json');
    const movies = await response.json();
    allMovies = movies;

    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

    // Filtrer les films, séries et nouveautés en supprimant les doublons
    let films = removeDuplicates(shuffleArray(movies.filter(movie => isFilm(movie) && hasValidImage(movie))), false).slice(0, 20);
    let series = removeDuplicates(shuffleArray(movies.filter(movie => isSeriesOrAnime(movie) && hasValidImage(movie))), true).slice(0, 20);
    let newReleases = removeDuplicates(movies.slice(-50).reverse(), true).slice(0, 10); // ✅ 10 derniers sans doublons

    displayMovies(newReleases, "new-releases");
    displayMovies(films, "films");
    displayMovies(series, "series");

    setupSearch();
}

// 📌 Vérifier si un film/série a une image valide
function hasValidImage(movie) {
    return movie.media && movie.media.trim() !== "" && movie.media.startsWith("http");
}

// 📌 Supprimer les doublons des films, séries et nouveautés
function removeDuplicates(movieList, isSeries = false) {
    let uniqueMovies = {};
    
    movieList.forEach(movie => {
        let cleanTitle = isSeries ? normalizeSeriesTitle(movie.title) : movie.title;
        if (!uniqueMovies[cleanTitle]) {
            uniqueMovies[cleanTitle] = movie;
            if (isSeries) uniqueMovies[cleanTitle].title = cleanTitle; // Normaliser le titre affiché
        }
    });

    return Object.values(uniqueMovies);
}

// 📌 Normaliser les titres des séries (suppression des S1, Saison 1, etc.)
function normalizeSeriesTitle(title) {
    return title.replace(/\s*(Saison|S|S-) ?\d+/gi, "").trim();
}

// 📌 Détection FILM
function isFilm(movie) {
    return movie.category.toLowerCase() === "film" && extractAllLinks(movie.description).length === 1;
}

// 📌 Détection SÉRIE/ANIME
function isSeriesOrAnime(movie) {
    const validCategories = ["série", "serie", "anime", "animé"];
    return validCategories.includes(movie.category.toLowerCase()) && extractAllLinks(movie.description).length > 1;
}

// 📌 Affichage des films et séries
function displayMovies(movieList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let displayedTitles = new Set();

    movieList.forEach(movie => {
        if (!hasValidImage(movie) || displayedTitles.has(movie.title)) return;

        displayedTitles.add(movie.title);

        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-card");
        movieDiv.innerHTML = `
            <img src="${movie.media}" alt="${movie.title}" onerror="this.parentNode.remove()">
            <h3>${movie.title}</h3>
        `;

        movieDiv.addEventListener("click", () => handleClick(movie));
        container.appendChild(movieDiv);
    });
}

function handleClick(movie) {
    if (isSeriesOrAnime(movie)) {
        // Afficher les saisons de la série
        showSeasonsModal(movie);
    } else if (isFilm(movie)) {
        const links = extractAllLinks(movie.description);
        window.location.href = cleanURL(links[0]);
    } else {
        alert("Aucun lien trouvé pour ce contenu.");
    }
}

function showSeasonsModal(series) {
    const seasons = extractSeasons(series.description);

    if (seasons.length === 0) {
        alert("Aucune saison disponible.");
        return;
    }

    let modal = document.createElement("div");
    modal.classList.add("seasons-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Saisons de ${series.title}</h2>
            <div class="seasons-list">
                ${seasons.map((season, index) => `
                    <button class="season-btn" onclick="showEpisodesModal('${series.title}', ${index}, ${season.links})">
                        Saison ${index + 1}
                    </button>
                `).join("")}
            </div>
            <button class="close-modal" onclick="closeSeasonsModal()">Fermer</button>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeSeasonsModal() {
    document.querySelector(".seasons-modal").remove();
}

// Extraction des saisons depuis la description (adaptée à la structure de ton fichier JSON)
function extractSeasons(description) {
    // Supposons que chaque saison est définie sous la forme "Saison 1: [lien1, lien2, ...]"
    const seasonRegex = /Saison (\d+):\s*(https?:\/\/[^\s]+)/g;
    let matches;
    let seasons = [];

    while ((matches = seasonRegex.exec(description)) !== null) {
        let seasonNumber = matches[1];
        let seasonLinks = [matches[2]];  // Tu peux ajouter plus de liens si plusieurs épisodes sont dans la description

        seasons.push({ number: seasonNumber, links: seasonLinks });
    }

    return seasons;
}

function closeSeasonsModal() {
    document.querySelector(".seasons-modal").remove();
}


// 📌 Nettoyer les URL (supprime les parenthèses à la fin)
function cleanURL(url) {
    return url.replace(/\)$/, "");
}

// 📌 Extraction de **TOUS** les liens présents dans une description
function extractAllLinks(description) {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    return description.match(linkRegex) ? description.match(linkRegex).map(cleanURL) : [];
}

// 📌 Affichage du pop-up des épisodes
function showEpisodesModal(seriesTitle, seasonIndex, episodeLinks) {
    if (episodeLinks.length === 0) {
        alert("Aucun épisode disponible pour cette saison.");
        return;
    }

    let modal = document.createElement("div");
    modal.classList.add("episodes-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${seriesTitle} - Saison ${seasonIndex + 1}</h2>
            <div class="episodes-list">
                ${episodeLinks.map((url, index) => `
                    <button class="episode-btn" onclick="window.location.href='${cleanURL(url)}'">
                        Épisode ${index + 1}
                    </button>
                `).join("")}
            </div>
            <button class="close-modal" onclick="closeEpisodesModal()">Fermer</button>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeEpisodesModal() {
    document.querySelector(".episodes-modal").remove();
}

function closeEpisodesModal() {
    document.querySelector(".episodes-modal").remove();
}

// 📌 Fermeture du pop-up
function closeEpisodesModal() {
    document.querySelector(".episodes-modal").remove();
}

// 📌 Configuration de la barre de recherche
function setupSearch() {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("search-results");

    // Placer le container des résultats sous la barre de recherche
    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        resultsContainer.innerHTML = "";
        resultsContainer.style.display = "none";

        if (query.length === 0) return;

        const results = allMovies
            .filter(movie => movie.title.toLowerCase().includes(query) && hasValidImage(movie)) 
            .slice(0, 20);
        
        if (results.length > 0) {
            results.forEach(movie => {
                const resultItem = document.createElement("div");
                resultItem.classList.add("search-item");
                resultItem.innerHTML = ` 
                    <img class="small-thumbnail" src="${movie.media}" alt="${movie.title}">
                    <span>${highlightMatch(movie.title, query)}</span>
                `;
                resultItem.addEventListener("click", () => handleClick(movie));

                resultsContainer.appendChild(resultItem);
            });
            resultsContainer.style.display = "block";
        }
    });

    document.addEventListener("click", (event) => {
        if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
            resultsContainer.style.display = "none";
        }
    });
}

// Ajouter un événement de défilement sur les images avec la souris maintenue
function enableImageScroll() {
    const moviesRows = document.querySelectorAll('.movies-row');
    
    moviesRows.forEach(row => {
        let isMouseDown = false;
        let startX;
        let scrollLeft;

        row.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Empêche la sélection de l'image lors du clic
            isMouseDown = true;
            startX = e.pageX - row.offsetLeft;
            scrollLeft = row.scrollLeft;
            row.style.cursor = 'grabbing'; // Change le curseur pour indiquer le mouvement
        });

        row.addEventListener('mouseleave', () => {
            isMouseDown = false;
            row.style.cursor = 'grab'; // Revenir au curseur "attraper" lorsqu'on sort de l'élément
        });

        row.addEventListener('mouseup', () => {
            isMouseDown = false;
            row.style.cursor = 'grab'; // Revenir au curseur "attraper" lorsqu'on relâche le clic
        });

        row.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - row.offsetLeft;
            const scroll = (x - startX) * 2;  // Vitesse de défilement
            row.scrollLeft = scrollLeft - scroll;
        });
    });
}

loadMovies();

// Appeler la fonction après avoir chargé les films
enableImageScroll();

// 📌 Mise en surbrillance du texte correspondant
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<strong style='color: red;'>$1</strong>");
}

loadMovies();
