import { runChat } from "../config/gemini.js";

export const chatBot = async (req, res) => {
  try {
    const { message, history } = req.body;

    const reply = await runChat(message, history);
    res.json({ reply });
  } 
  catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Something went wrong with the chatbot" });
  }
};
