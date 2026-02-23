import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("API key not found! Set GOOGLE_API_KEY in .env");

const ai = new GoogleGenAI({ apiKey });

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    console.log("Gemini response:", response); // <-- log full response
    res.json({ text: response.text });
  } catch (err) {
    console.error("Gemini API error:", err); // <-- log real error
    res.status(500).json({ text: err.message }); // <-- send real message to React
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));