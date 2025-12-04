// server.js (Exemple Node.js)
import express from 'express';
import { GoogleGenAI } from '@google/genai';

// ⚠️ La clé est chargée en toute sécurité à partir d'une variable d'environnement
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

const app = express();
app.use(express.json()); // Pour analyser les corps de requêtes JSON

// Permettre à votre site web (frontend) d'appeler ce serveur (CORS)
app.use((req, res, next) => {
    // Remplacez '*' par l'URL exacte de votre site web pour la production
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Endpoint pour la requête Gemini
app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send({ error: 'Le champ prompt est requis.' });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        // Renvoyer uniquement le texte généré à la page web
        res.json({ text: response.text });
    } catch (error) {
        console.error("Erreur Gemini:", error);
        res.status(500).send({ error: "Échec de la génération du contenu." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});