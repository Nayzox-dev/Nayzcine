// Fonction pour détecter si les outils de développement sont ouverts
function detectDevTools() {
    let devToolsOpen = false;

    // Fonction pour vérifier si les DevTools sont ouverts
    function checkDevTools() {
        // Si la différence entre les dimensions de la fenêtre est trop grande (indique DevTools ouvert)
        const devToolsDetected = window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100;

        // Si DevTools est détecté et qu'il n'a pas encore été signalé
        if (devToolsDetected && !devToolsOpen) {
            devToolsOpen = true;
            window.location.href = 'f12.html';  // Rediriger vers f12.html si DevTools est ouvert
        }
    }

    // Vérification toutes les 100ms si les DevTools sont ouverts
    const devToolsDetectionInterval = setInterval(() => {
        checkDevTools();
    }, 100);

    // Vérification en cas de fermeture du DevTools
    window.onresize = function() {
        const devToolsClosed = window.outerWidth - window.innerWidth <= 100 && window.outerHeight - window.innerHeight <= 100;
        if (devToolsClosed) {
            clearInterval(devToolsDetectionInterval);
        }
    };

    // Détecter l'état des DevTools au chargement de la page
    window.onload = function() {
        checkDevTools();
    };
}

// Vérification du mode mobile activé dans DevTools
function checkIfMobileMode() {
    const isMobile = window.innerWidth <= 800 || window.outerWidth - window.innerWidth > 100;

    if (isMobile) {
        window.location.href = 'f12.html';  // Rediriger vers f12.html si on est en mode mobile
    }
}

// Fonction pour détecter l'utilisation d'outils de développement sur un appareil mobile ou simulateur mobile
function detectMobileModeInDevTools() {
    const userAgent = navigator.userAgent.toLowerCase();

    // Si un appareil mobile est détecté
    if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('android') !== -1) {
        window.location.href = 'f12.html';  // Rediriger vers f12.html si mobile détecté
    }
}

// Fonction pour désactiver le clic droit et empêcher l'ouverture du menu contextuel
function disableRightClick() {
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();  // Empêcher le menu contextuel
        window.location.href = 'f12.html';  // Rediriger vers f12.html
    });
}

// Fonction pour désactiver les raccourcis clavier
function disableKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Liste des raccourcis interdits pour ouvrir la console ou inspecter le code
        const raccourcisInterdits = [
            { ctrl: true, shift: true, key: 'I' }, // Ctrl + Shift + I (Console DevTools)
            { ctrl: true, shift: true, key: 'J' }, // Ctrl + Shift + J (Console DevTools)
            { ctrl: true, key: 'U' }, // Ctrl + U (Voir le code source)
            { keyCode: 123 }, // F12 (Ouvrir DevTools)
            { ctrl: true, shift: true, key: 'C' }, // Ctrl + Shift + C (Inspecteur)
            { ctrl: true, shift: true, key: 'S' }, // Ctrl + Shift + S (Save as)
            { ctrl: true, shift: true, key: 'Q' }, // Ctrl + Shift + Q
            { ctrl: true, shift: true, key: 'K' }, // Ctrl + Shift + K (Ouvrir la console dans Firefox)
            { ctrl: true, shift: true, key: 'L' }, // Ctrl + Shift + L (Ouvrir la console dans certains navigateurs)
            { ctrl: true, shift: true, key: 'M' }, // Ctrl + Shift + M (Mode mobile dans Chrome)
            { ctrl: true, shift: true, key: 'P' }, // Ctrl + Shift + P (Palette de commandes dans Firefox)
            { ctrl: true, shift: true, key: 'T' }, // Ctrl + Shift + T (Rouvrir un onglet)
            { ctrl: true, shift: true, key: 'W' }, // Ctrl + Shift + W (Fermer l'onglet)
            { ctrl: true, key: 'F1' }, // Ctrl + F1 (Ouvrir les outils de développement dans certains navigateurs)
            { keyCode: 112 }, // F1 (Ouvre l'aide et parfois DevTools)
            { ctrl: true, shift: true, key: 'F' }, // Ctrl + Shift + F (Rechercher dans les DevTools)
            { ctrl: true, key: 'F12' }, // Ctrl + F12 (Ouvrir DevTools dans certains navigateurs)
        ];

        // Vérification des raccourcis interdits avec keyCode (pour F12 et autres touches de fonction)
        raccourcisInterdits.forEach(function(raccourci) {
            if (
                (raccourci.ctrl === event.ctrlKey && raccourci.shift === event.shiftKey && event.key === raccourci.key) ||
                (raccourci.keyCode === event.keyCode)
            ) {
                event.preventDefault(); // Empêcher l'action par défaut
                window.location.href = 'f12.html';  // Rediriger vers f12.html
            }
        });

        // Vérifier les combinaisons Ctrl + [lettres] interdites (A-Z)
        const interdites = [
            'a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
            'p', 'q', 'r', 's', 't', 'u', 'w', 'x', 'y', 'z'
        ];

        if (event.ctrlKey && interdites.includes(event.key.toLowerCase())) {
            event.preventDefault(); // Empêcher l'action par défaut
            window.location.href = 'f12.html';  // Rediriger vers f12.html
        }
    });
}

// Fonction principale pour vérifier tout et activer les protections
function init() {
    detectDevTools();
    checkIfMobileMode();
    detectMobileModeInDevTools();
    disableRightClick();
    disableKeyboardShortcuts();
}

// Lancer l'initialisation dès que la page est chargée
window.onload = init;

// Écouter les événements de redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    checkIfMobileMode();  // Vérifier si on est en mode mobile lors du redimensionnement
});
