let allMovies = [];

async function loadMovies() {
    const response = await fetch('fsa.json');
    const movies = await response.json();
    allMovies = movies;

    const newReleases = movies.slice(-10);
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

    // Filtrer les films et séries avec une image valide uniquement
    let films = shuffleArray(movies.filter(movie => isFilm(movie) && hasValidImage(movie)));
    let series = shuffleArray(movies.filter(movie => isSeriesOrAnime(movie) && hasValidImage(movie)));

    displayMovies(newReleases, "new-releases");
    displayMovies(films, "films");
    displayMovies(series, "series");

    setupSearch();
}

// 📌 Vérifier si un film/série a une image valide
function hasValidImage(movie) {
    return movie.media && movie.media.trim() !== "" && movie.media.startsWith("http");
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

function displayMovies(movieList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let displayedMovies = 0;
    const maxMovies = 20;

    movieList.forEach(movie => {
        if (!hasValidImage(movie) || displayedMovies >= maxMovies) return;

        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-card");
        movieDiv.innerHTML = `
            <img src="${movie.media}" alt="${movie.title}" onerror="this.parentNode.remove(); replaceMovie('${containerId}')">
            <h3>${movie.title}</h3>
        `;

        movieDiv.addEventListener("click", () => handleClick(movie));
        container.appendChild(movieDiv);
        displayedMovies++;
    });

    // Compléter les films manquants
    while (displayedMovies < maxMovies) {
        replaceMovie(containerId);
        displayedMovies++;
    }
}

// 📌 Fonction pour remplacer un film manquant
function replaceMovie(containerId) {
    const container = document.getElementById(containerId);
    const replacementMovie = allMovies.find(movie => hasValidImage(movie));

    if (replacementMovie) {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("movie-card");
        movieDiv.innerHTML = `
            <img src="${replacementMovie.media}" alt="${replacementMovie.title}">
            <h3>${replacementMovie.title}</h3>
        `;
        movieDiv.addEventListener("click", () => handleClick(replacementMovie));
        container.appendChild(movieDiv);
    }
}

function handleClick(movie) {
    const links = extractAllLinks(movie.description);

    if (isFilm(movie)) {
        window.location.href = cleanURL(links[0]); 
    } else if (isSeriesOrAnime(movie)) {
        showEpisodesModal(movie.title, links);
    } else {
        alert("Aucun lien trouvé pour ce contenu.");
    }
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
function showEpisodesModal(title, episodeLinks) {
    if (episodeLinks.length === 0) {
        alert("Aucun épisode disponible.");
        return;
    }

    let modal = document.createElement("div");
    modal.classList.add("episodes-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${title}</h2>
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

// 📌 Fermeture du pop-up
function closeEpisodesModal() {
    document.querySelector(".episodes-modal").remove();
}

// 📌 Configuration de la barre de recherche
function setupSearch() {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("search-results");

    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        resultsContainer.innerHTML = "";
        resultsContainer.style.display = "none";

        if (query.length === 0) return;

        const results = allMovies
            .filter(movie => movie.title.toLowerCase().includes(query) && hasValidImage(movie)) 
            .slice(0, 5);
        
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

// 📌 Mise en surbrillance du texte correspondant
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<strong style='color: red;'>$1</strong>");
}

loadMovies();
