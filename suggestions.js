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
        window.location.href = "index2.html";
    });

    // 🍔 MENU BURGER
    const burgerMenu = document.querySelector(".burger-menu");
    const menu = document.querySelector(".menu");

    if (burgerMenu && menu) {
        burgerMenu.addEventListener("click", function () {
            menu.classList.toggle("active");
        });
    }

    // 📩 Formulaire de suggestion - Envoi de données
    document.getElementById("suggestion-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Empêche le rechargement immédiat de la page

        let form = this;
        let formData = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                document.getElementById("suggestion-response").style.display = "block"; // Affiche le message de confirmation
                form.reset(); // Réinitialise le formulaire
            }
        }).catch(error => {
            // Pas de notification ou de log
        });
    });
});
