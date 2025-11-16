import { GoogleGenerativeAI } from "@google/generative-ai";
import { findFaqAnswer } from "./faqHelper.js";

// Check if API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function runChat(message, history = []) {
  // 1) Try to answer from FAQ first
  const faqHit = findFaqAnswer(message);
  if (faqHit) return faqHit;

  // 2) Check if API key is configured
  if (!genAI || !process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables.");
  }

  // 3) Fallback to Gemini
  // Try different model names in order of preference
  // Using standard model identifiers for Google Generative AI v1 API
  // Updated to use Gemini 2.5 models (Gemini 1.5 models are retired)
  const modelNames = [
    "gemini-2.5-flash",     // Recommended: Fast and efficient, optimized for chat applications
    "gemini-2.5-pro",       // Alternative: More capable but slower, ideal for complex reasoning
    "gemini-2.5-flash-lite" // Lightweight fallback: Most cost-effective option
  ];
  
  // Filter and format history - only include messages with valid role and content
  const formattedHistory = (history || [])
    .filter(m => m && m.role && m.content && typeof m.content === 'string')
    .map(m => ({
      role: m.role === "user" ? "user" : "model", // Ensure valid role
      parts: [{ text: String(m.content) }],  
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

  // Try each model name until one works
  let lastError = null;
  let successfulModel = null;
  
  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      
      const chat = model.startChat({
        history: [
          { role: "user",  parts: [{ text: primer }] },
          { role: "model", parts: [{ text: "Understood. I will only answer KindBite-related questions." }] },
          ...formattedHistory,
        ],
      });

      const result = await chat.sendMessage(message);
      const responseText = result.response.text();
      
      if (!responseText || responseText.trim().length === 0) {
        throw new Error("Empty response from Gemini API");
      }
      
      if (!successfulModel) {
        successfulModel = modelName;
        console.log(`✓ Successfully using model: ${modelName}`);
      }
      
      return responseText;
    } catch (error) {
      // Log full error for debugging
      console.error(`Failed with model ${modelName}:`, error);
      lastError = error;
      
      // Convert error to string for pattern matching
      const errorStr = String(error.message || error?.toString() || JSON.stringify(error) || '');
      const errorMessage = error.message || error?.toString() || 'Unknown error';
      
      // Continue to next model if this one fails with a 404 or model not found error
      // Check for v1beta API version issues or model not found errors
      if (errorStr.includes("404") || 
          errorStr.includes("not found") || 
          errorStr.includes("not supported") ||
          errorStr.includes("v1beta") ||
          errorStr.includes("is not found for API version") ||
          errorStr.includes("models/") && errorStr.includes("404")) {
        console.log(`Model ${modelName} not available, trying next model...`);
        continue;
      }
      // For other errors (auth, rate limit, etc.), throw immediately
      throw new Error(`Failed to get response from Gemini: ${errorMessage}`);
    }
  }
  
  // If all models failed, provide helpful error message
  const errorMessage = lastError?.message || lastError?.toString() || JSON.stringify(lastError) || "Unknown error";
  const isV1BetaIssue = String(errorMessage).includes("v1beta");
  
  let helpMessage = `Failed to get response from Gemini. Tried models: ${modelNames.join(", ")}.\n`;
  helpMessage += `Last error: ${errorMessage}\n\n`;
  helpMessage += `Troubleshooting steps:\n`;
  helpMessage += `1. Verify your API key is valid and has access to the Generative Language API\n`;
  helpMessage += `2. Ensure the Generative Language API is enabled in Google Cloud Console\n`;
  
  if (isV1BetaIssue) {
    helpMessage += `3. Your SDK appears to be using v1beta API. Try updating @google/generative-ai to the latest version\n`;
  }
  
  helpMessage += `4. List available models: curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY"\n`;
  helpMessage += `5. Check your API key permissions in Google Cloud Console`;
  
  throw new Error(helpMessage);
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