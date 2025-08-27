import { GoogleGenerativeAI } from "@google/generative-ai";
import { findFaqAnswer } from "./faqHelper.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function runChat(message, history = []) {
  // 1) Try to answer from FAQ first
  const faqHit = findFaqAnswer(message);
  if (faqHit) return faqHit;

  // 2) Fallback to Gemini
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const formattedHistory = (history || []).map(m => ({
    role: m.role,                  
    parts: [{ text: m.content }],  
  }));

  const primer = `
You are KindBite Assistant. KindBite is a food donation platform.

Key Features:
- Donors can post available food with location & expiry timer.
- Receivers can claim food. Once claimed, it becomes unavailable.
- Review system: receivers can review donors.
- Email verification and forgot password for secure login.
- Real-time notifications using Socket.IO.
- Goal: Reduce food waste and help people in need.

⚠️ Very Important:
- Only answer questions directly related to KindBite or its features.
- If a user asks something unrelated (like general knowledge, movies, politics, etc.),
  reply: "I can only help with KindBite-related questions such as donations, claiming food, reviews, or account help."
- Stay concise, clear, and professional.
`;

  const chat = model.startChat({
    history: [
      { role: "user",  parts: [{ text: primer }] },
      { role: "model", parts: [{ text: "Understood. I will only answer KindBite-related questions." }] },
      ...formattedHistory,
    ],
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}

/*
Both startChat and sendMessage are inbuilt methods of the Gemini SDK.

🔹 model.startChat()

Creates a chat session with Gemini.

You can pass:
history: previous conversation turns (like user → bot messages).

Returns a chat object that you can keep using.


🔹 chat.sendMessage(message)

Sends a new user message into that chat session.
Gemini responds with a model reply.
Returns a response object (which you usually convert to text using .response.text()).




### Code Meaning

const primer =
    "You are KindBite Assistant. KindBite is a platform that connects donors with receivers to reduce food waste." +
    " Prefer concise, actionable, and safe answers. If you don’t know, say so.";

const chat = model.startChat({
  history: [
    { role: "user",  parts: [{ text: primer }] },
    { role: "model", parts: [{ text: "Understood. I will help with KindBite questions." }] },
    ...formattedHistory,
  ],
});


1. **`primer`**

   * This is your **system instruction** (like telling the AI who it is and what it should do).
   * Example: You are KindBite Assistant → AI knows it should act as your app’s helper.

2. **History initialization**

  
   history: [
     { role: "user",  parts: [{ text: primer }] },
     { role: "model", parts: [{ text: "Understood. I will help with KindBite questions." }] },
   ]
   

   * First, we **inject** a "fake user message" containing the `primer`.
   * Then, we **inject** a "fake AI reply" confirming it.
   * This tricks the chat into believing you already told it what KindBite is, so it will **always remember context**.

3. **`...formattedHistory`**

   * After that, your real conversation history (`messages`) is appended.
   * So the assistant will always see your **primer** first, then your actual chat.


✅ **In short:**
You are **seeding the chat history with a permanent context about KindBite**, so every reply is influenced by it.


*/