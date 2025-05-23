// report.js
document.addEventListener("DOMContentLoaded", function () {
    // 📩 Gestion du formulaire de signalement
    const suggestionForm = document.getElementById("suggestion-form");
    if (suggestionForm) {
        suggestionForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            // Récupération des valeurs
            const formData = new FormData(suggestionForm);
            const title = formData.get("title");
            const type = formData.get("type");
            const description = formData.get("problem_description");

            // Webhook Discord pour les signalements
            const webhookURL = "https://discord.com/api/webhooks/1375366130289610834/U7rkTApTDhLNDTnqsk2xIIuE1OMEjGlE5j7ZCt2RPAv-G1BHaXpiIYu3IKJeNdTwUMXn";
            const payload = {
                username: "🛠️ Signalement de problème",
                avatar_url: "https://i.imgur.com/Zz6v4gk.png",
                embeds: [
                    {
                        title: "🚨 Problème signalé",
                        description: "Un utilisateur a signalé un souci via le site.",
                        color: 0x5865F2,
                        fields: [
                            {
                                name: "🎬 Titre concerné",
                                value: `> ${title}`
                            },
                            {
                                name: "📺 Type",
                                value: `> ${type}`
                            },
                            {
                                name: "❗ Description du problème",
                                value: `> ${description}`
                            }
                        ],
                        footer: {
                            text: "Formulaire de signalement",
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
                } else {
                    alert("❌ Une erreur est survenue, veuillez réessayer.");
                }
            } catch (error) {
                alert("❌ Une erreur s'est produite, vérifiez votre connexion.");
            }
        });
    }
});
