import { GoogleGenerativeAI } from "@google/generative-ai";

// Use Vite's environment variable format
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

console.log('🔑 Gemini API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');

let ai: GoogleGenerativeAI | null = null;

if (apiKey) {
  ai = new GoogleGenerativeAI(apiKey);
  console.log('✅ GoogleGenerativeAI initialized');
} else {
  console.warn('⚠️ No API key found - Novie will not work');
}

// System prompt for Novie AI
const NOVIE_SYSTEM_PROMPT = `You are Novie, a friendly and knowledgeable Arduino learning assistant for NovEng, an educational platform.

Your personality:
- Enthusiastic and encouraging
- Patient and beginner-friendly
- Use emojis occasionally (but not excessively)
- Keep answers concise but informative
- Focus on hands-on, practical explanations

Your expertise:
- Arduino Uno programming (C++)
- Basic electronics and circuits
- Common sensors (ultrasonic, temperature, light)
- LEDs, buttons, servos, motors
- Project guidance and troubleshooting

Guidelines:
- Always provide code examples when relevant
- Explain the "why" behind concepts
- Suggest next learning steps
- If user asks something outside Arduino/electronics, politely redirect to Arduino topics
- Keep responses under 200 words unless explaining code

Format code blocks with triple backticks and cpp language tag.`;

interface ChatContext {
  currentPage?: string;
  currentModule?: string;
  currentCode?: string;
  simulatorState?: string;
}

export const chatWithNovie = async (
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'model'; parts: string }>,
  context?: ChatContext,
  imageBase64?: string
): Promise<string> => {
  if (!ai) {
    return "⚠️ **API Key Missing**\n\nTo enable Novie AI, add your Gemini API key:\n\n1. Get a free key at: https://aistudio.google.com/app/apikey\n2. Create a `.env` file in the project root\n3. Add: `VITE_GEMINI_API_KEY=your_key_here`\n4. Restart the dev server\n\nUntil then, I can answer basic Arduino questions using my built-in knowledge!";
  }

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Build context-aware message
    let contextualMessage = userMessage;
    if (context) {
      const contextParts = [];
      if (context.currentPage) contextParts.push(`[User is on: ${context.currentPage}]`);
      if (context.currentModule) contextParts.push(`[Current module: ${context.currentModule}]`);
      if (context.currentCode) contextParts.push(`[Code on screen:\n${context.currentCode}]`);
      if (context.simulatorState) contextParts.push(`[Simulator state: ${context.simulatorState}]`);

      if (contextParts.length > 0) {
        contextualMessage = `${contextParts.join('\n')}\n\nUser question: ${userMessage}`;
      }
    }

    // Build conversation history in the correct format
    const history = [
      { role: 'user', parts: [{ text: NOVIE_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: "Got it! I'm Novie, ready to help with Arduino and electronics learning. I'll keep my answers friendly, practical, and concise! 🚀" }] },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }]
      }))
    ];

    // If image is provided, add it to the prompt
    if (imageBase64) {
      const chat = model.startChat({ history });
      const result = await chat.sendMessage([
        { text: contextualMessage },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64
          }
        }
      ]);
      return result.response.text() || "I apologize, I couldn't analyze the image. Could you try again?";
    } else {
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(contextualMessage);
      return result.response.text() || "I apologize, I couldn't generate a response. Could you try rephrasing your question?";
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    console.error("Error details:", error?.message, error?.status, error?.statusText);

    if (error?.message?.includes('API_KEY') || error?.message?.includes('API key')) {
      return "⚠️ **Invalid API Key**\n\nYour Gemini API key appears to be invalid. Please check that it's correct in your `.env` file.";
    }

    if (error?.status === 400) {
      return `⚠️ **API Error**\n\n${error?.message || 'Bad request. The model name might be incorrect or the API format has changed.'}`;
    }

    return `Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔧\n\nError: ${error?.message || 'Unknown error'}`;
  }
};

// Legacy function for backward compatibility
export const explainCode = async (code: string): Promise<string> => {
  return chatWithNovie(`Explain this Arduino code:\n\n\`\`\`cpp\n${code}\n\`\`\``, []);
};