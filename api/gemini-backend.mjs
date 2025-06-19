import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

// Usar la API key desde una variable de entorno
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('Error: No se encontró la API key de Gemini. Por favor, configura la variable de entorno GEMINI_API_KEY');
  process.exit(1);
}

// Inicializar el cliente de Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

app.post('/api/gemini', async (req, res) => {
  try {
    const contexto = `Eres un asistente virtual de salud mental especializado en el diagnóstico temprano de ansiedad y depresión. Tu objetivo es realizar una breve evaluación inicial al usuario, haciendo preguntas claras y sencillas, una por una, para identificar posibles síntomas de ansiedad o depresión.

Instrucciones para el flujo:
- Preséntate brevemente y explica que vas a hacer algunas preguntas para ayudar a identificar posibles síntomas.
- Haz preguntas de tipo sí/no o de opción múltiple sobre el estado de ánimo, energía, sueño, apetito, concentración y nivel de preocupación.
- Después de cada respuesta, haz la siguiente pregunta relevante.
- Si detectas respuestas que sugieren síntomas de ansiedad o depresión, informa al usuario de manera empática y sugiere buscar ayuda profesional.
- Si no detectas síntomas, tranquiliza al usuario y sugiere recursos de autocuidado.
- Mantén siempre un tono empático, profesional y motivador.
- No hagas diagnósticos médicos, solo orientaciones y sugerencias.`;

    const { message, history = [] } = req.body;
    
    // Prepara el array para Gemini
    const contents = [
      { role: "user", parts: [{ text: contexto }] }
    ];

    // Añade el historial de la conversación
    history.forEach(msg => {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      });
    });

    // Añade el mensaje actual si existe
    if (message) {
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent({ contents });
    const response = await result.response;
    const text = response.text();
    res.json({ text });
  } catch (error) {
    console.error('Error detallado:', error);
    if (error.response) {
      // Si el error viene de una respuesta HTTP
      error.response.text().then((body) => {
        console.error('Cuerpo de la respuesta de error:', body);
        res.status(500).json({ 
          error: 'Error al comunicarse con Gemini', 
          details: error.message,
          body
        });
      });
    } else {
      res.status(500).json({ 
        error: 'Error al comunicarse con Gemini', 
        details: error.message 
      });
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor Gemini proxy escuchando en http://localhost:${PORT}`);
});