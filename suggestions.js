document.addEventListener("DOMContentLoaded", function () {
    // Charger les suggestions sauvegardées au chargement de la page
    loadSuggestions();

    // Formulaire de suggestions
    document.getElementById('suggestion-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const title = document.getElementById('suggestion-title').value;
        const type = document.getElementById('suggestion-type').value;
        const message = document.getElementById('suggestion-message').value;

        const suggestionData = `"${title}" , "${type}" , "${message}"`;

        // Sauvegarder en local dans le navigateur
        saveSuggestion(suggestionData);

        document.getElementById('suggestion-response').innerHTML = `<p style="color: lightgreen;">Suggestion enregistrée, Elle sera ajoutée dans l'onglet "Nouveautés" dès que possible!</p>`;
        this.reset();
    });

    // Convertit la barre de recherche en bouton redirigeant vers index.html
    document.getElementById("search").addEventListener("click", function () {
        window.location.href = "index.html";
    });

    // Configuration de la barre de recherche
    setupSearch();
});

// Sauvegarde les suggestions dans localStorage
function saveSuggestion(suggestion) {
    let suggestions = localStorage.getItem("suggestions");
    suggestions = suggestions ? JSON.parse(suggestions) : [];
    suggestions.push(suggestion);
    localStorage.setItem("suggestions", JSON.stringify(suggestions));
}

// Charge les suggestions enregistrées (optionnel : affichage console)
function loadSuggestions() {
    let suggestions = localStorage.getItem("suggestions");
    if (suggestions) {
        console.log("Suggestions enregistrées :", JSON.parse(suggestions));
    }
}

function setupSearch() {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("search-results");

    searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase().trim();
        resultsContainer.innerHTML = "";
        resultsContainer.style.display = "none";

        if (query.length === 0) return;

        fetch('fsa.json')
            .then(response => response.json())
            .then(movies => {
                const results = movies
                    .filter(movie => movie.title.toLowerCase().includes(query))
                    .slice(0, 5);

                if (results.length > 0) {
                    results.forEach(movie => {
                        const resultItem = document.createElement("div");
                        resultItem.classList.add("search-item");
                        resultItem.innerHTML = `<span>${movie.title}</span>`;
                        resultItem.addEventListener("click", () => {
                            searchInput.value = movie.title;
                            resultsContainer.style.display = "none";
                        });

                        resultsContainer.appendChild(resultItem);
                    });
                    resultsContainer.style.display = "block";
                }
            });
    });

    document.addEventListener("click", (event) => {
        if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
            resultsContainer.style.display = "none";
        }
    });
}
