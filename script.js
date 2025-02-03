let allMovies = []; 

async function loadMovies() {
    const response = await fetch('fsa.json');
    const movies = await response.json();
    allMovies = movies;

    const newReleases = movies.slice(-10);
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
    const films = shuffleArray(movies.filter(movie => movie.category === "Film")).slice(0, 20);

    let seriesList = movies.filter(movie => movie.category === "Série");
    let uniqueSeries = {};

    seriesList.forEach(movie => {
        let cleanTitle = movie.title.replace(/\s*(Saison|S|S-|S)\s*\d+/gi, "").trim();
        if (!uniqueSeries[cleanTitle]) {
            uniqueSeries[cleanTitle] = { title: cleanTitle, media: movie.media };
        }
    });

    let series = shuffleArray(Object.values(uniqueSeries)).slice(0, 20);

    displayMovies(newReleases, "new-releases");
    displayMovies(films, "films");
    displayMovies(series, "series");
}

function displayMovies(movieList, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    movieList.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie-card');
        movieDiv.innerHTML = `<img src="${movie.media}" alt="${movie.title}"><h3>${movie.title}</h3>`;
        container.appendChild(movieDiv);
    });
}

// 🔎 RECHERCHE DYNAMIQUE
document.getElementById('search').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');

    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "none";
    if (searchValue.length === 0) return;

    const filteredMovies = allMovies.filter(movie => movie.title.toLowerCase().includes(searchValue));
    filteredMovies.slice(0, 5).forEach(movie => {
        const item = document.createElement('div');
        item.classList.add('search-item');
        item.innerHTML = `
            <img class="small-thumbnail" src="${movie.media}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        item.addEventListener('click', () => alert(`Vous avez sélectionné : ${movie.title}`));
        resultsContainer.appendChild(item);
    });

    if (filteredMovies.length > 0) {
        resultsContainer.style.display = "flex";
        resultsContainer.style.position = "absolute";
        resultsContainer.style.top = "100%";
        resultsContainer.style.left = "0";
        resultsContainer.style.width = "100%";
    }
});

loadMovies();
