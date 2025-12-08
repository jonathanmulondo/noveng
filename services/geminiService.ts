import { GoogleGenAI } from "@google/genai";

// Use Vite's environment variable format
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
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
    const model = "gemini-2.0-flash-exp";

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

    // Build conversation contents
    const contents = [
      { role: 'user', parts: NOVIE_SYSTEM_PROMPT },
      { role: 'model', parts: "Got it! I'm Novie, ready to help with Arduino and electronics learning. I'll keep my answers friendly, practical, and concise! 🚀" },
      ...conversationHistory,
      { role: 'user', parts: contextualMessage }
    ];

    // If image is provided, add it to the prompt
    let requestContents;
    if (imageBase64) {
      requestContents = contents.map(msg => `${msg.role}: ${msg.parts}`).join('\n') +
        `\n\n[User has uploaded an image - please analyze it and help with their question]`;

      // For vision, we need to use a different format
      const response = await ai.models.generateContent({
        model: model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: requestContents },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64
                }
              }
            ]
          }
        ]
      });
      return response.text || "I apologize, I couldn't analyze the image. Could you try again?";
    } else {
      requestContents = contents.map(msg => `${msg.role}: ${msg.parts}`).join('\n');
      const response = await ai.models.generateContent({
        model: model,
        contents: requestContents,
      });
      return response.text || "I apologize, I couldn't generate a response. Could you try rephrasing your question?";
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    if (error?.message?.includes('API_KEY')) {
      return "⚠️ **Invalid API Key**\n\nYour Gemini API key appears to be invalid. Please check that it's correct in your `.env` file.";
    }

    return "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔧";
  }
};

// Legacy function for backward compatibility
export const explainCode = async (code: string): Promise<string> => {
  return chatWithNovie(`Explain this Arduino code:\n\n\`\`\`cpp\n${code}\n\`\`\``, []);
};