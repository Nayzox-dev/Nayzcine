document.addEventListener("DOMContentLoaded", function () {
    // 🔥 Désactiver la saisie dans la barre de recherche
    const searchInput = document.getElementById("search");
    searchInput.setAttribute("readonly", true);
    searchInput.style.cursor = "pointer"; // Curseur pointeur pour indiquer un bouton

    // ✅ Empêcher le focus sur mobile (évite l'affichage du clavier)
    searchInput.addEventListener("focus", function (event) {
        event.target.blur();
    });

    // 🚀 Rediriger vers "nouveauté.html" au clic
    searchInput.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    // 📌 Gestion du formulaire de suggestions
    document.getElementById("suggestion-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("suggestion-title").value;
        const type = document.getElementById("suggestion-type").value;
        const message = document.getElementById("suggestion-message").value;

        const suggestionData = { title, type, message };

        // 📩 Envoi des données au serveur
        fetch("http://localhost:3000/save-suggestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(suggestionData),
        })
        .then(response => response.text())
        .then(result => {
            document.getElementById("suggestion-response").innerHTML =
                `<p style="color: lightgreen;">Suggestion enregistrée ! Elle sera ajoutée dans l'onglet "Nouveautés" dès que possible.</p>`;
            this.reset();
        })
        .catch(error => {
            console.error("Erreur :", error);
            document.getElementById("suggestion-response").innerHTML =
                `<p style="color: red;">Erreur lors de l'enregistrement.</p>`;
        });
    });

    // 📌 Charger et afficher les suggestions
    function loadSuggestions() {
        fetch("http://localhost:3000/get-suggestions")
            .then(response => response.text())
            .then(data => {
                const suggestionsContainer = document.getElementById("all-suggestions");
                if (suggestionsContainer) {
                    suggestionsContainer.innerHTML = `<h3>Suggestions des utilisateurs :</h3><pre>${data}</pre>`;
                }
            })
            .catch(error => console.error("Erreur lors du chargement des suggestions :", error));
    }

    loadSuggestions(); // Charger les suggestions au démarrage

    // 🍔 MENU BURGER
    const burgerMenu = document.querySelector(".burger-menu");
    const menu = document.querySelector(".menu");

    if (burgerMenu && menu) {
        burgerMenu.addEventListener("click", function () {
            menu.classList.toggle("active");
        });
    }
    
});
