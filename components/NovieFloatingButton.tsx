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
        className="fixed top-20 right-4 md:top-6 md:right-6 z-50 group"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity animate-pulse" />

        {/* Main button */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40 group-hover:scale-110 transition-all duration-300 border-2 border-white">
          <Bot size={20} className="text-white" strokeWidth={2.5} />

          {/* Sparkle indicator */}
          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles size={10} className="text-white fill-white" />
          </div>
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-lg whitespace-nowrap shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            Ask Novie 🤖
            <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-neutral-900" />
          </div>
        )}
      </button>

      {/* Side Panel */}
      <NovieSidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};
