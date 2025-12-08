import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Module } from '../services/api';
import { explainCode } from '../services/geminiService';
import { ChevronLeft, BookOpen, Loader2, AlertCircle, Star, Clock, Users, Bot, Send, Sparkles, CheckCircle2, PlayCircle, Code2, BookMarked, List } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'theory' | 'code'>('overview');
  const [activeSection, setActiveSection] = useState<string>('');

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

        const content = await api.getModuleContent(id);
        setOverviewContent(content.overview);

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

      // Numbered lists
      if (line.match(/^\d+\.\s+(.+)$/)) {
        const text = line.replace(/^\d+\.\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1');
        elements.push(
          <div key={`num-${key++}`} className="flex gap-3 mb-3">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {line.match(/^\d+/)?.[0]}
            </div>
            <p className="text-white/90 leading-relaxed">{text}</p>
          </div>
        );
        return;
      }

      // Bullet points
      if (line.match(/^[-*]\s+(.+)$/)) {
        const text = line.replace(/^[-*]\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1');
        elements.push(
          <div key={`bullet-${key++}`} className="flex gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
            <p className="text-white/90 leading-relaxed">{text}</p>
          </div>
        );
        return;
      }

      // Regular text
      if (line.trim()) {
        const cleanText = line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-pink-300 font-semibold">$1</strong>');
        elements.push(
          <p key={`p-${key++}`} className="text-white/90 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: cleanText }} />
        );
      }
    });

    return <div className="space-y-2">{elements}</div>;
  };

  const theorySections = sections.filter(s => s.type === 'theory');
  const codeSections = sections.filter(s => s.type === 'code');

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

  const currentSections = activeTab === 'theory' ? theorySections : activeTab === 'code' ? codeSections : [];
  const currentSection = currentSections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Courses
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Module Hero */}
            <div className="bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden shadow-xl">
              <div className="relative h-64">
                <img
                  src={module.thumbnail_url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80'}
                  alt={module.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                    Module {module.module_number} • {module.category}
                  </div>
                  <h1 className="text-4xl font-display font-bold text-white mb-3">
                    {module.title}
                  </h1>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{module.student_count?.toLocaleString() || 0} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                      <span>{module.rating?.toFixed(1) || '4.8'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-neutral-200 bg-white flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all relative flex items-center justify-center gap-2 ${
                    activeTab === 'overview' ? 'text-purple-600' : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <BookMarked size={18} />
                  Overview
                  {activeTab === 'overview' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-500" />
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab('theory'); if (theorySections[0]) setActiveSection(theorySections[0].id); }}
                  className={`flex-1 px-6 py-4 font-semibold transition-all relative flex items-center justify-center gap-2 ${
                    activeTab === 'theory' ? 'text-purple-600' : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <BookOpen size={18} />
                  Theory ({theorySections.length})
                  {activeTab === 'theory' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-500" />
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab('code'); if (codeSections[0]) setActiveSection(codeSections[0].id); }}
                  className={`flex-1 px-6 py-4 font-semibold transition-all relative flex items-center justify-center gap-2 ${
                    activeTab === 'code' ? 'text-purple-600' : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <Code2 size={18} />
                  Code ({codeSections.length})
                  {activeTab === 'code' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-500" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-8">
                {activeTab === 'overview' ? (
                  <div className="bg-gradient-to-b from-purple-900 to-purple-800 p-8 rounded-2xl shadow-lg text-white">
                    {renderContent(overviewContent, false)}
                  </div>
                ) : currentSection ? (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                        {activeTab === 'theory' ? <BookOpen size={20} /> : <Code2 size={20} />}
                      </div>
                      {currentSection.title}
                    </h2>
                    <div className="bg-gradient-to-b from-purple-900 to-purple-800 p-8 rounded-2xl shadow-lg text-white">
                      {renderContent(currentSection.content, activeTab === 'code')}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-neutral-500">No {activeTab} sections available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Table of Contents - Like Navigation Bar */}
            {(activeTab === 'theory' || activeTab === 'code') && currentSections.length > 0 && (
              <div className="bg-gradient-to-b from-purple-900 to-purple-800 rounded-3xl p-6 text-white sticky top-24 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <List size={20} />
                  <h3 className="font-display font-bold">Table of Contents</h3>
                </div>
                <div className="space-y-2">
                  {currentSections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        activeSection === section.id
                          ? 'bg-white/20 shadow-lg backdrop-blur-sm'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          activeSection === section.id ? 'bg-white text-purple-700' : 'bg-white/20'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium line-clamp-2">{section.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Novie Chatbot */}
            <div className="bg-white rounded-3xl border-2 border-purple-200 overflow-hidden shadow-xl sticky top-24">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-display font-bold">Ask Novie</h3>
                    <p className="text-white/80 text-xs">Your AI assistant</p>
                  </div>
                </div>
              </div>

              <div className="h-80 overflow-y-auto p-4 space-y-3">
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
                        : 'bg-purple-50 text-neutral-800 border border-purple-200'
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
                    <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
                      <Loader2 size={16} className="text-purple-600 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t-2 border-purple-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask anything..."
                    className="flex-1 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isLoadingChat}
                    className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
