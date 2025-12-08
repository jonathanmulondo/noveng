import Anthropic from "@anthropic-ai/sdk";

// Use Vite's environment variable format
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';

console.log('🔑 Anthropic API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');

let anthropic: Anthropic | null = null;

if (apiKey) {
  anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  console.log('✅ Anthropic Claude initialized');
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
  if (!anthropic) {
    return "⚠️ **API Key Missing**\n\nTo enable Novie AI, add your Anthropic API key:\n\n1. Get a free key at: https://console.anthropic.com/\n2. Update your `.env` file\n3. Add: `VITE_ANTHROPIC_API_KEY=your_key_here`\n4. Restart the dev server\n\nUntil then, I can answer basic Arduino questions using my built-in knowledge!";
  }

  try {
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

    // Build conversation history for Claude
    const messages: Anthropic.MessageParam[] = conversationHistory.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts
    }));

    // Add current message
    if (imageBase64) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64
            }
          },
          {
            type: 'text',
            text: contextualMessage
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: contextualMessage
      });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: NOVIE_SYSTEM_PROMPT,
      messages: messages
    });

    const textContent = response.content.find(block => block.type === 'text');
    return textContent && textContent.type === 'text' ? textContent.text : "I apologize, I couldn't generate a response. Could you try rephrasing your question?";

  } catch (error: any) {
    console.error("Claude API Error:", error);
    console.error("Error details:", error?.message, error?.status, error?.statusText);

    if (error?.message?.includes('API_KEY') || error?.message?.includes('API key')) {
      return "⚠️ **Invalid API Key**\n\nYour Anthropic API key appears to be invalid. Please check that it's correct in your `.env` file.";
    }

    if (error?.status === 400) {
      return `⚠️ **API Error**\n\n${error?.message || 'Bad request. Please try again.'}`;
    }

    return `Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔧\n\nError: ${error?.message || 'Unknown error'}`;
  }
};

// Legacy function for backward compatibility
export const explainCode = async (code: string): Promise<string> => {
  return chatWithNovie(`Explain this Arduino code:\n\n\`\`\`cpp\n${code}\n\`\`\``, []);
};
