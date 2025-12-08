import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Lightbulb, Code, Cpu, Zap } from 'lucide-react';
import { chatWithNovie } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'novie';
  content: string;
  timestamp: Date;
}

interface ConversationContext {
  role: 'user' | 'model';
  parts: string;
}

const QUICK_QUESTIONS = [
  "How do I blink an LED?",
  "What's the difference between digitalWrite and analogWrite?",
  "How do I use a button with Arduino?",
  "Explain pull-up resistors",
  "Help me with servo motors",
  "What pins support PWM?"
];

export const Novie: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'novie',
      content: "Hi! I'm Novie, your Arduino learning assistant! 👋\n\nI'm here to help you with:\n• Arduino code explanations\n• Circuit wiring advice\n• Component troubleshooting\n• Project ideas\n\nWhat would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationContext[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const messageText = customMessage || input.trim();
    if (!messageText || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Gemini AI with conversation history
      const aiResponse = await chatWithNovie(messageText, conversationHistory);

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', parts: messageText },
        { role: 'model', parts: aiResponse }
      ]);

      const novieMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'novie',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, novieMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'novie',
        content: "Sorry, I'm having trouble connecting right now. Please try again! 🔧\n\nIn the meantime, try asking one of the quick questions below.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-white">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white p-6 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Bot size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                Novie AI
                <Sparkles size={24} className="fill-white animate-pulse" />
              </h1>
              <p className="text-purple-100">Your personal Arduino learning companion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'novie' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <Bot size={24} className="text-white" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-3xl p-5 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white'
                    : 'bg-white border-2 border-purple-100 text-neutral-800'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-purple-100' : 'text-neutral-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center shrink-0 text-white font-bold">
                  A
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <div className="bg-white border-2 border-purple-100 rounded-3xl p-5">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      <div className="px-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-neutral-600 mb-3 font-medium">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-4 py-2 bg-white border-2 border-purple-200 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-50 hover:border-purple-300 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-purple-100 p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Novie anything about Arduino..."
            className="flex-1 px-6 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-3xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all text-neutral-800 placeholder-neutral-400"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-3xl font-bold hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
          >
            <Send size={20} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
