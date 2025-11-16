import { runChat } from "../config/gemini.js";

export const chatBot = async (req, res) => {
  try {
    const { message, history } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required and must be a non-empty string" });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: "History must be an array" });
    }

    const reply = await runChat(message.trim(), history);
    
    if (!reply || typeof reply !== 'string') {
      return res.status(500).json({ error: "Invalid response from chatbot" });
    }

    res.json({ reply });
  } 
  catch (error) {
    console.error("Chatbot error:", error);
    const errorMessage = error.message || "Something went wrong with the chatbot";
    res.status(500).json({ error: errorMessage });
  }
};
