import 'dotenv/config'; 

import express from 'express';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); 

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post('/api/generate', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send({ error: 'Le champ prompt est requis.' });
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }], 
            config: {
                maxOutputTokens: 50000,
            }
        });

        const generatedText = response.text || "Thierry n'a pas pu générer de réponse (Plus de Token disponible).";
        
        console.log(`Réponse de Gemini générée (longueur: ${generatedText.length})`);
        
        res.json({ text: generatedText });
    } catch (error) {
        console.error("Erreur Gemini (Clé API ou Quota?):", error);
        res.status(500).send({ error: "Échec de la génération du contenu. Vérifiez que votre clé API est valide ou que le quota n'est pas atteint." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port http://localhost:${PORT}`);
    console.log("Vérifiez la console pour les erreurs potentielles de l'API Gemini.");
});