document.addEventListener("DOMContentLoaded", function() {
    console.log("Script chargé, affichage de la popuppp...");

    let popuppp = document.getElementById("popuppp");
    let overlay = document.getElementById("overlay");

    if (popuppp && overlay) {
        setTimeout(function() {
            console.log("Affichage de la popuppp...");
            popuppp.style.display = "block";
            overlay.style.display = "block";
        }, 1000); // Affichage après 1 seconde (modifie si besoin)
    } else {
        console.error("Popuppp ou overlay introuvable !");
    }
});

// Fonction pour fermer la popuppp
function closePopuppp() {
    document.getElementById("popuppp").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}
