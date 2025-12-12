import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Module } from '../services/api';
import { explainCode } from '../services/geminiService';
import { ChevronLeft, ChevronRight, BookOpen, Loader2, AlertCircle, Star, Clock, Users, Bot, Send, Sparkles, CheckCircle2, PlayCircle, Code2, BookMarked, List, X, Target } from 'lucide-react';
import { ModuleQuiz } from '../components/ModuleQuiz';
import { getQuizBySlug } from '../data/quizzes';

interface LessonSection {
  id: string;
  title: string;
  content: string;
  type: 'theory' | 'code';
}

interface Message {
  id: string;
  role: 'user' | 'novie';
  content: string;
  timestamp: Date;
}

export const ModuleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [module, setModule] = useState<Module | null>(null);
  const [sections, setSections] = useState<LessonSection[]>([]);
  const [overviewContent, setOverviewContent] = useState<string>('');
  const [lessonContent, setLessonContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'learn' | 'quiz'>('overview');
  const [activeSection, setActiveSection] = useState<string>('');
  const [isNovieChatOpen, setIsNovieChatOpen] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);

  // Card swipe navigation state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Chatbot state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'novie',
      content: "Hi! I'm Novie, your learning assistant! Ask me anything about this lesson.",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollChatToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [messages]);

  // ESC key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNovieChatOpen) {
        setIsNovieChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isNovieChatOpen]);

  // Parse content into story cards (split by ## sections)
  const parseContentIntoCards = (text: string): Array<{title: string, content: string, emoji?: string}> => {
    if (!text || text.trim() === '') {
      console.log('parseContentIntoCards: No text provided');
      return [];
    }

    const cards: Array<{title: string, content: string, emoji?: string}> = [];

    // Split by ## headers (level 2)
    const sections = text.split(/\n## /);

    console.log('parseContentIntoCards: Found', sections.length, 'sections');

    sections.forEach((section, index) => {
      // Skip the first section if it's just the title (# heading)
      if (index === 0 && section.startsWith('#')) {
        return;
      }

      const lines = section.split('\n');
      const titleLine = lines[0].replace(/^##\s*/, '').trim();

      // Skip if no title
      if (!titleLine) return;

      // Extract emoji if present
      const emojiMatch = titleLine.match(/^([^\w\s]+)\s+(.+)$/);
      const title = emojiMatch ? emojiMatch[2].trim() : titleLine;
      const emoji = emojiMatch ? emojiMatch[1] : '📚';

      // Get content (everything after the title line)
      const content = lines.slice(1).join('\n').trim();

      if (title) {
        cards.push({ title, content: content || 'No content available', emoji });
      }
    });

    console.log('parseContentIntoCards: Created', cards.length, 'cards');
    return cards;
  };

  // Card navigation functions
  const allCards = activeTab === 'learn' ? parseContentIntoCards(lessonContent) : [];
  const totalCards = allCards.length;

  // Debug: Log when cards change
  useEffect(() => {
    console.log(`🎴 [ModuleDetail] Cards updated. Total: ${totalCards}, ActiveTab: ${activeTab}`);
    if (activeTab === 'learn') {
      console.log(`📝 [ModuleDetail] Lesson content length for parsing: ${lessonContent?.length || 0} chars`);
    }
  }, [totalCards, activeTab, lessonContent]);

  const goToNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  // Keyboard navigation (Left/Right arrows)
  useEffect(() => {
    if (activeTab !== 'learn') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPreviousCard();
      if (e.key === 'ArrowRight') goToNextCard();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeTab, currentCardIndex, totalCards]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNextCard();
    }
    if (isRightSwipe) {
      goToPreviousCard();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Reset card index when switching to learn tab
  useEffect(() => {
    if (activeTab === 'learn') {
      setCurrentCardIndex(0);
    }
  }, [activeTab]);

  // Parse lesson content into theory and code sections
  const parseSections = (content: string): LessonSection[] => {
    const sections: LessonSection[] = [];
    const lines = content.split('\n');
    let currentSection: LessonSection | null = null;
    let sectionId = 0;

    lines.forEach((line) => {
      // Check for section headers (## Header)
      const headerMatch = line.match(/^##\s+(.+)$/);

      if (headerMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }

        const title = headerMatch[1].trim();
        const isCodeSection = title.toLowerCase().includes('code') ||
                              title.toLowerCase().includes('upload') ||
                              title.toLowerCase().includes('example') ||
                              title.toLowerCase().includes('sketch');

        currentSection = {
          id: `section-${sectionId++}`,
          title: title.replace(/^\d+\.\s*/, ''), // Remove numbering
          content: '',
          type: isCodeSection ? 'code' : 'theory'
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  // Fetch module data from backend
  useEffect(() => {
    async function loadModule() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const moduleData = await api.getModule(id);
        setModule(moduleData);

        // Load quiz if available
        const moduleQuiz = getQuizBySlug(id);
        console.log(`🎯 [ModuleDetail] Loading quiz for "${id}":`, moduleQuiz);
        setQuiz(moduleQuiz);

        console.log(`📖 [ModuleDetail] Fetching content for module: ${id}`);
        const content = await api.getModuleContent(id);
        console.log(`📊 [ModuleDetail] Received content:`, {
          overviewLength: content.overview?.length || 0,
          lessonLength: content.lesson?.length || 0
        });

        setOverviewContent(content.overview);
        setLessonContent(content.lesson);

        console.log(`✏️ [ModuleDetail] Set lesson content, length: ${content.lesson?.length || 0}`);

        const parsedSections = parseSections(content.lesson);
        setSections(parsedSections);

        if (parsedSections.length > 0) {
          setActiveSection(parsedSections[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch module:', err);
        setError(err instanceof Error ? err.message : 'Failed to load module');
      } finally {
        setLoading(false);
      }
    }

    loadModule();
  }, [id]);

  const handleSendMessage = async () => {
    const messageText = chatInput.trim();
    if (!messageText || isLoadingChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoadingChat(true);

    setTimeout(async () => {
      const context = `The user is learning about: ${module?.title}\n\nQuestion: ${messageText}`;
      const aiResponse = await explainCode(context);

      const novieMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'novie',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, novieMessage]);
      setIsLoadingChat(false);
    }, 1000);
  };

  // Render formatted content
  const renderContent = (text: string, isCode: boolean): JSX.Element => {
    console.log(`🎨 [renderContent] Rendering content, length: ${text?.length || 0}, isCode: ${isCode}`);

    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeContent = '';
    const elements: JSX.Element[] = [];
    let key = 0;

    lines.forEach((line) => {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${key++}`} className="mb-6 rounded-xl overflow-hidden border-2 border-purple-300 shadow-lg">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 flex items-center gap-2">
                <Code2 size={16} className="text-white" />
                <span className="text-white text-sm font-semibold">Arduino Code</span>
              </div>
              <pre className="bg-neutral-900 text-green-400 p-6 overflow-x-auto font-mono text-sm leading-relaxed">
                {codeContent}
              </pre>
            </div>
          );
          codeContent = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return;
      }

      // Skip section headers (## and ###) - they're already shown as section titles
      if (line.match(/^##[#]?\s+(.+)$/)) {
        return;
      }

      // Skip horizontal rules
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
        return;
      }

      // Numbered lists
      if (line.match(/^\d+\.\s+(.+)$/)) {
        const text = line.replace(/^\d+\.\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1');
        elements.push(
          <div key={`num-${key++}`} className="flex gap-3 mb-4">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm font-bold flex-shrink-0">
              {line.match(/^\d+/)?.[0]}
            </div>
            <p className="text-neutral-800 leading-relaxed font-medium text-base">{text}</p>
          </div>
        );
        return;
      }

      // Bullet points
      if (line.match(/^[-*]\s+(.+)$/)) {
        const text = line.replace(/^[-*]\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1');
        elements.push(
          <div key={`bullet-${key++}`} className="flex gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-pink-500 mt-2.5 flex-shrink-0" />
            <p className="text-neutral-800 leading-relaxed font-medium text-base">{text}</p>
          </div>
        );
        return;
      }

      // Regular text
      if (line.trim()) {
        const cleanText = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-purple-700 font-bold">$1</strong>');
        elements.push(
          <p key={`p-${key++}`} className="text-neutral-800 leading-relaxed font-medium text-base mb-4" dangerouslySetInnerHTML={{ __html: cleanText }} />
        );
      }
    });

    console.log(`🎨 [renderContent] Created ${elements.length} elements from ${lines.length} lines`);
    return <div className="space-y-2">{elements}</div>;
  };

  // No longer needed - we use unified card-based learning instead
  // const theorySections = sections.filter(s => s.type === 'theory');
  // const codeSections = sections.filter(s => s.type === 'code');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-purple-600 animate-spin mb-4 mx-auto" />
          <p className="text-neutral-600 text-lg">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-red-600" />
          </div>
          <h3 className="text-2xl font-display font-bold text-neutral-800 mb-2">
            {error || 'Module not found'}
          </h3>
          <p className="text-neutral-600 mb-6">
            The module you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // No longer needed with card-based layout
  // const currentSections = activeTab === 'theory' ? theorySections : activeTab === 'code' ? codeSections : [];
  // const currentSection = currentSections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-neutral-900 to-black relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-neutral-900/95 backdrop-blur-xl border-b border-purple-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/courses')}
            className="group flex items-center gap-2 text-purple-300 hover:text-purple-200 font-semibold transition-colors"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Courses</span>
          </button>
        </div>
      </div>

      {/* Mobile-First Swipe Card Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* Module Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="relative h-48 sm:h-56">
            <img
              src={module.thumbnail_url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80'}
              alt={module.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                Module {module.module_number} • {module.category}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                {module.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-white/90 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{module.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={14} />
                  <span>{module.student_count?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span>{module.rating?.toFixed(1) || '4.8'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Tab Pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-neutral-700 hover:bg-neutral-50 shadow'
            }`}
          >
            <BookMarked size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === 'learn'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-neutral-700 hover:bg-neutral-50 shadow'
            }`}
          >
            <BookOpen size={16} />
            Learn ({allCards.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === 'quiz'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-neutral-700 hover:bg-neutral-50 shadow'
            }`}
          >
            <Target size={16} />
            Quiz {quiz && `(${quiz.questions.length})`}
          </button>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' ? (
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
            <div className="prose prose-sm sm:prose max-w-none">
              {renderContent(overviewContent, false)}
            </div>
          </div>
        ) : activeTab === 'quiz' ? (
          quiz ? (
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
              <ModuleQuiz
                moduleSlug={id!}
                questions={quiz.questions}
                passingScore={70}
                onComplete={(score, passed) => {
                  console.log(`Quiz complete! Score: ${score}%, Passed: ${passed}`);
                }}
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Target size={28} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">
                Quiz Coming Soon!
              </h3>
              <p className="text-neutral-600 text-sm">
                We're preparing an interactive quiz for this module.
              </p>
            </div>
          )
        ) : (
          /* Duolingo-Style Swipe Cards */
          <div className="relative">
            {allCards.length > 0 ? (
              <>
                {/* Card Container */}
                <div
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Progress Bar */}
                  <div className="bg-neutral-100 h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-500 h-full transition-all duration-300"
                      style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
                    />
                  </div>

                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{allCards[currentCardIndex]?.emoji || '📚'}</div>
                        <div>
                          <h2 className="text-xl md:text-2xl font-display font-bold">{allCards[currentCardIndex]?.title}</h2>
                          <p className="text-sm font-semibold text-white/90">Step {currentCardIndex + 1} of {totalCards}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 sm:p-8 min-h-[400px] max-h-[600px] overflow-y-auto">
                    <div className="prose prose-sm sm:prose max-w-none">
                      {renderContent(allCards[currentCardIndex]?.content || '', false)}
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="border-t border-neutral-200 px-6 py-4 bg-neutral-50">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={goToPreviousCard}
                        disabled={currentCardIndex === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-200"
                      >
                        <ChevronLeft size={18} />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      {/* Progress Dots */}
                      <div className="flex items-center gap-1.5">
                        {allCards.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentCardIndex(index)}
                            className={`transition-all ${
                              index === currentCardIndex
                                ? 'w-8 h-2 bg-purple-600'
                                : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
                            } rounded-full`}
                            aria-label={`Go to card ${index + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={goToNextCard}
                        disabled={currentCardIndex === totalCards - 1}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-purple-600"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {/* Keyboard Hint */}
                    <div className="hidden md:block text-center mt-3 text-xs text-neutral-500">
                      Use ← → arrow keys to navigate
                    </div>
                  </div>
                </div>

                {/* Completion CTA */}
                {currentCardIndex === totalCards - 1 && (
                  <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl shadow-lg p-6 text-white text-center">
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-2">Great Progress! 🎉</h3>
                    <p className="text-white/90 mb-4 text-sm">
                      You've completed all lesson cards. Ready for the quiz?
                    </p>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors shadow-lg"
                    >
                      Take the Quiz
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <p className="text-neutral-500">No lesson content available</p>
              </div>
            )}
          </div>
        )}

        {/* Novie Floating Button */}
        <button
          onClick={() => setIsNovieChatOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full shadow-2xl hover:shadow-purple-300 hover:scale-110 transition-all duration-300 flex items-center justify-center z-40"
          aria-label="Open Novie AI Assistant"
        >
          <Bot size={28} className="text-white" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
        </button>
      </div>

        {/* Novie Chat Popup Modal */}
        {isNovieChatOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
              onClick={() => setIsNovieChatOpen(false)}
            />

            {/* Chat Modal */}
            <div className="fixed bottom-6 right-6 w-full max-w-md z-50 animate-in slide-in-from-bottom-4">
              <div className="bg-white rounded-3xl border-2 border-purple-200 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Bot size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-display font-bold">Ask Novie</h3>
                        <p className="text-white/80 text-xs">Your AI assistant</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsNovieChatOpen(false)}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                      aria-label="Close chat"
                    >
                      <X size={18} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-purple-50/30 to-white">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'novie' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <Bot size={14} className="text-white" />
                        </div>
                      )}
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                          : 'bg-white text-neutral-800 border-2 border-purple-100 shadow-sm'
                      }`}>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoadingChat && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                        <Sparkles size={14} className="text-white animate-pulse" />
                      </div>
                      <div className="bg-white p-3 rounded-2xl border-2 border-purple-100 shadow-sm">
                        <Loader2 size={16} className="text-purple-600 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t-2 border-purple-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask anything about this lesson..."
                      className="flex-1 px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      autoFocus
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isLoadingChat}
                      className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 text-center">
                    Press Enter to send • ESC to close
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
};
