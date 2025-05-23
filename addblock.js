window.onload = () => {
    const iframe = document.getElementById("video-frame");
    
    // Bloque les faux clics avec une double vérif
    iframe.addEventListener('load', () => {
        const overlay = document.createElement('div');
        overlay.className = 'ad-overlay-blocker';
        document.querySelector('.video-container').appendChild(overlay);
    });
};
