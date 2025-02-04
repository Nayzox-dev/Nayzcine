const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// 📌 Route pour enregistrer une suggestion
app.post("/save-suggestion", (req, res) => {
    const { title, type, message } = req.body;
    if (!title || !type || !message) {
        return res.status(400).send("Tous les champs sont requis !");
    }

    const data = `"${title}" , "${type}" , "${message}"\n`;

    fs.appendFile("suggestions.txt", data, (err) => {
        if (err) {
            console.error("Erreur lors de l'écriture du fichier :", err);
            return res.status(500).send("Erreur serveur");
        }
        res.send("Suggestion enregistrée avec succès !");
    });
});

// 📌 Route pour récupérer toutes les suggestions
app.get("/get-suggestions", (req, res) => {
    fs.readFile("suggestions.txt", "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier :", err);
            return res.status(500).send("Erreur serveur");
        }
        res.send(data);
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
