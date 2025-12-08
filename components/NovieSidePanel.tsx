import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { chatWithNovie } from '../services/geminiService';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'novie';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

interface ConversationContext {
  role: 'user' | 'model';
  parts: string;
}

const QUICK_QUESTIONS = [
  "How do I blink an LED?",
  "What's digitalWrite?",
  "Help with buttons",
  "Explain PWM"
];

interface NovieSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovieSidePanel: React.FC<NovieSidePanelProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSelectedImage(base64.split(',')[1]);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getPageContext = () => {
    const path = location.pathname;
    if (path.includes('/courses')) return 'Courses Page';
    if (path.includes('/simulator')) return 'Circuit Simulator';
    if (path.includes('/feed')) return 'Community Feed';
    if (path.includes('/module/')) {
      const moduleId = path.split('/module/')[1];
      return `Module: ${moduleId.replace(/_/g, ' ')}`;
    }
    return 'Dashboard';
  };

  const handleSend = async (customMessage?: string) => {
    const messageText = customMessage || input.trim();
    if ((!messageText && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText || '📸 [Image sent]',
      timestamp: new Date(),
      imageUrl: imagePreview || undefined
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const context = {
        currentPage: getPageContext()
      };

      const aiResponse = await chatWithNovie(
        messageText,
        conversationHistory,
        context,
        selectedImage || undefined
      );

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

      clearImage();
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'novie',
        content: "Sorry, I'm having trouble connecting right now. Please try again! 🔧",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-gradient-to-br from-purple-50 via-pink-50 to-white z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                Novie
                <Sparkles size={18} className="fill-white animate-pulse" />
              </h2>
              <p className="text-purple-100 text-xs">Arduino assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-280px)]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'novie' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                    <Bot size={18} className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white'
                      : 'bg-white border-2 border-purple-100 text-neutral-800'
                  }`}
                >
                  {message.imageUrl && (
                    <img
                      src={message.imageUrl}
                      alt="Uploaded"
                      className="w-full rounded-xl mb-2 border-2 border-white/20"
                    />
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-purple-100' : 'text-neutral-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-700 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                    A
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="bg-white border-2 border-purple-100 rounded-2xl p-4">
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


        {/* Input Area */}
        <div className="bg-white border-t-2 border-purple-100 p-4 shadow-lg">
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 rounded-xl border-2 border-purple-200"
              />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="px-3 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl transition-all disabled:opacity-50"
              title="Upload image"
            >
              <ImageIcon size={18} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Novie anything..."
              className="flex-1 px-4 py-3 bg-neutral-50 border-2 border-neutral-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all text-sm text-neutral-800 placeholder-neutral-400"
              disabled={isLoading}
            />

            <button
              onClick={() => handleSend()}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-200 flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
