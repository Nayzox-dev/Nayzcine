// suggestions.js
document.addEventListener("DOMContentLoaded", function () {
    // 📩 Gestion du formulaire de suggestion
    const suggestionForm = document.getElementById("suggestion-form");
    if (suggestionForm) {
        suggestionForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            // Récupération des valeurs
            const formData = new FormData(suggestionForm);
            const title = formData.get("title");
            const type = formData.get("type");

            // Ici, tu peux adapter l'URL ou le mode d'envoi :
            const webhookURL = "https://discord.com/api/webhooks/1375365955944972368/Pi5X1P3LiSfCAWtpj-KeSZN2zZxFN0CJ_Z0BWgj18OXICo565Xbxh_8VQEywkRGzvwVN";
            const payload = {
                username: "🎬 Suggestion du site",
                avatar_url: "https://i.imgur.com/Zz6v4gk.png",
                embeds: [
                    {
                        title: "💡 Nouvelle suggestion",
                        description: "Une nouvelle idée a été soumise par un utilisateur.",
                        color: 0x5865F2,
                        fields: [
                            {
                                name: "🎬 Titre proposé",
                                value: `> ${title}`
                            },
                            {
                                name: "📺 Type",
                                value: `> ${type}`
                            }
                        ],
                        footer: {
                            text: "Envoyé depuis le formulaire de suggestion",
                            icon_url: "https://i.imgur.com/Zz6v4gk.png"
                        },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            try {
                const response = await fetch(webhookURL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    document.getElementById("suggestion-response").style.display = "block";
                    suggestionForm.reset();
                }
            } catch (error) {
                // Silencieux (pas de notif si erreur)
            }
        });
    }
});
