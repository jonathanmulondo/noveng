import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; 
// Note: In a real app, ensure API_KEY is set. For this demo, we handle missing keys gracefully in the UI.

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const explainCode = async (code: string): Promise<string> => {
  if (!ai) {
    return "API Key missing. Please configure the environment variable to use AI features.";
  }

  try {
    const model = "gemini-2.5-flash";
    const prompt = `You are an expert Arduino tutor for beginners. Explain the following C++ code simply, line by line, focusing on the logic:
    
    \`\`\`cpp
    ${code}
    \`\`\`
    
    Keep it encouraging and short (max 150 words).`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't explain this code right now. Please try again later.";
  }
};