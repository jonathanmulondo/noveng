import React, { useState } from 'react';
import { Bot, X, Sparkles } from 'lucide-react';
import { NovieSidePanel } from './NovieSidePanel';

export const NovieFloatingButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsPanelOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" />

        {/* Main button */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/40 group-hover:scale-110 transition-all duration-300 border-4 border-white">
          <Bot size={32} className="text-white" strokeWidth={2.5} />

          {/* Sparkle indicator */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles size={14} className="text-white fill-white" />
          </div>
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-2xl whitespace-nowrap shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            Ask Novie 🤖
            <div className="absolute top-full right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-neutral-900" />
          </div>
        )}
      </button>

      {/* Side Panel */}
      <NovieSidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};
