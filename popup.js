document.addEventListener("DOMContentLoaded", function() {
    console.log("Script chargé, affichage de la popup...");

    let popup = document.getElementById("popup");
    let overlay = document.getElementById("overlay");

    if (popup && overlay) {
        setTimeout(function() {
            console.log("Affichage de la popup...");
            popup.style.display = "block";
            overlay.style.display = "block";
        }, 1000); // Affichage après 3 secondes
    } else {
        console.error("Popup ou overlay introuvable !");
    }
});

// Fonction pour fermer la popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}



///////////////////////////////////


