import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Module } from '../services/api';
import { explainCode } from '../services/geminiService';
import { ChevronLeft, BookOpen, Loader2, AlertCircle, Star, Clock, Users, Bot, Send, Sparkles, CheckCircle2, PlayCircle } from 'lucide-react';

interface LessonSegment {
  title: string;
  content: string;
  order: number;
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
  const [lessonContent, setLessonContent] = useState<string>('');
  const [overviewContent, setOverviewContent] = useState<string>('');
  const [lessonSegments, setLessonSegments] = useState<LessonSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lesson'>('overview');
  const [activeSegment, setActiveSegment] = useState<number>(0);
  const [completedSegments, setCompletedSegments] = useState<Set<number>>(new Set());

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
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollChatToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [messages]);

  // Parse and format lesson content into segments
  const parseSegments = (content: string): LessonSegment[] => {
    const segments: LessonSegment[] = [];
    const lines = content.split('\n');
    let currentSegment: LessonSegment | null = null;
    let segmentOrder = 0;

    lines.forEach((line) => {
      // Check for segment headers (## Header or Step X: Header)
      const headerMatch = line.match(/^##\s+(.+)$/) || line.match(/^Step\s+\d+:\s+(.+)$/i);

      if (headerMatch) {
        if (currentSegment) {
          segments.push(currentSegment);
        }
        currentSegment = {
          title: headerMatch[1].trim(),
          content: '',
          order: segmentOrder++
        };
      } else if (currentSegment) {
        currentSegment.content += line + '\n';
      } else if (line.trim()) {
        // Content before first header goes into intro segment
        if (segments.length === 0) {
          segments.push({
            title: 'Introduction',
            content: line + '\n',
            order: segmentOrder++
          });
          currentSegment = segments[0];
        }
      }
    });

    if (currentSegment && !segments.includes(currentSegment)) {
      segments.push(currentSegment);
    }

    return segments.length > 0 ? segments : [{
      title: 'Lesson Content',
      content: content,
      order: 0
    }];
  };

  // Format content by removing markdown syntax and styling
  const formatContent = (text: string): JSX.Element[] => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let codeBlock = '';
    let inCodeBlock = false;
    let listItems: string[] = [];
    let key = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key++}`} className="space-y-2 mb-6">
            {listItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2 flex-shrink-0" />
                <span className="text-neutral-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${key++}`} className="mb-6 rounded-2xl overflow-hidden border-2 border-purple-200">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
                <span className="text-white/80 text-xs font-mono ml-2">Code</span>
              </div>
              <pre className="bg-neutral-900 text-green-400 p-6 overflow-x-auto">
                <code className="font-mono text-sm">{codeBlock}</code>
              </pre>
            </div>
          );
          codeBlock = '';
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlock += line + '\n';
        return;
      }

      // Remove ### headers but keep the text
      if (line.match(/^###\s+(.+)$/)) {
        flushList();
        const text = line.replace(/^###\s+/, '');
        elements.push(
          <h4 key={`h4-${key++}`} className="text-lg font-bold text-purple-700 mb-3 mt-6">
            {text}
          </h4>
        );
        return;
      }

      // Bullet points
      if (line.match(/^[-*]\s+(.+)$/)) {
        const text = line.replace(/^[-*]\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1');
        listItems.push(text);
        return;
      }

      // Regular paragraphs
      if (line.trim()) {
        flushList();
        // Remove bold markdown
        const cleanText = line.replace(/\*\*(.+?)\*\*/g, '$1');
        elements.push(
          <p key={`p-${key++}`} className="text-neutral-700 leading-relaxed mb-4">
            {cleanText}
          </p>
        );
      }
    });

    flushList();
    return elements;
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
        setLessonContent(content.lesson);

        const segments = parseSegments(content.lesson);
        setLessonSegments(segments);
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
      const context = `The user is learning about: ${module?.title}\nLesson context: ${lessonSegments[activeSegment]?.title}\n\nQuestion: ${messageText}`;
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

  const markSegmentComplete = (segmentIndex: number) => {
    setCompletedSegments(prev => new Set(prev).add(segmentIndex));
    if (segmentIndex < lessonSegments.length - 1) {
      setActiveSegment(segmentIndex + 1);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Courses
          </button>
          <div className="text-sm text-neutral-600">
            Module {module.module_number} • {activeTab === 'lesson' && `${completedSegments.size}/${lessonSegments.length} segments completed`}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Hero Card */}
            <div className="bg-white rounded-3xl border-2 border-neutral-200 overflow-hidden mb-8 shadow-lg">
              <div className="relative h-80 overflow-hidden">
                <img
                  src={module.thumbnail_url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80'}
                  alt={module.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                <div className="absolute top-6 right-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md ${
                    module.difficulty === 'Beginner'
                      ? 'bg-green-500/90 text-white'
                      : module.difficulty === 'Intermediate'
                      ? 'bg-amber-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {module.difficulty}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                    Module {module.module_number} • {module.category}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                    {module.title}
                  </h1>
                  <div className="flex items-center gap-6 text-white/80 text-sm">
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

              {/* Tabs */}
              <div className="border-b border-neutral-200 bg-white">
                <div className="flex gap-1 px-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-4 font-semibold transition-all relative ${
                      activeTab === 'overview'
                        ? 'text-purple-600'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    Overview
                    {activeTab === 'overview' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-t" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('lesson')}
                    className={`px-6 py-4 font-semibold transition-all relative ${
                      activeTab === 'lesson'
                        ? 'text-purple-600'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    Lesson
                    {activeTab === 'lesson' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-t" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {activeTab === 'overview' ? (
                  <div>
                    {/* Overview Content */}
                    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50/30 p-8 rounded-2xl border-2 border-purple-200">
                      <div className="prose prose-lg max-w-none">
                        {formatContent(overviewContent)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Lesson Progress */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-display font-bold text-neutral-800">
                          {lessonSegments[activeSegment]?.title}
                        </h3>
                        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                          Step {activeSegment + 1} of {lessonSegments.length}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-neutral-200 rounded-full h-2 mb-6">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
                          style={{ width: `${((completedSegments.size) / lessonSegments.length) * 100}%` }}
                        />
                      </div>

                      {/* Segment Content */}
                      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50/30 p-8 rounded-2xl border-2 border-purple-200 mb-6">
                        <div className="prose prose-lg max-w-none">
                          {formatContent(lessonSegments[activeSegment]?.content || '')}
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setActiveSegment(Math.max(0, activeSegment - 1))}
                          disabled={activeSegment === 0}
                          className="px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-700 font-semibold rounded-full hover:border-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        <button
                          onClick={() => markSegmentComplete(activeSegment)}
                          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-200 transition-all flex items-center gap-2"
                        >
                          <CheckCircle2 size={20} />
                          {activeSegment < lessonSegments.length - 1 ? 'Complete & Continue' : 'Complete Lesson'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-3 bg-white border-2 border-neutral-200 text-neutral-700 font-semibold rounded-full hover:border-purple-300 transition-all"
              >
                Back to Courses
              </button>
              <button
                onClick={() => navigate('/simulator')}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-200 transition-all flex items-center gap-2"
              >
                <PlayCircle size={20} />
                Open in Simulator
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Lesson Segments Sidebar (Lesson Tab Only) */}
            {activeTab === 'lesson' && (
              <div className="bg-white rounded-3xl border-2 border-neutral-200 p-6 mb-6 sticky top-24">
                <h3 className="text-lg font-display font-bold text-neutral-800 mb-4">Lesson Steps</h3>
                <div className="space-y-2">
                  {lessonSegments.map((segment, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSegment(index)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        activeSegment === index
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                          : completedSegments.has(index)
                          ? 'bg-green-50 text-green-700 border-2 border-green-200'
                          : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {completedSegments.has(index) ? (
                          <CheckCircle2 size={20} className="flex-shrink-0" />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            activeSegment === index ? 'bg-white/20' : 'bg-neutral-200'
                          }`}>
                            {index + 1}
                          </div>
                        )}
                        <span className="text-sm font-semibold line-clamp-2">{segment.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded Novie Chatbot */}
            <div className="bg-white rounded-3xl border-2 border-purple-200 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Bot size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-display font-bold text-lg">Ask Novie</h3>
                    <p className="text-white/80 text-sm">Your AI learning assistant</p>
                  </div>
                </div>
              </div>

              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'novie' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                          : 'bg-purple-50 text-neutral-800 border-2 border-purple-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoadingChat && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      <Sparkles size={16} className="text-white animate-pulse" />
                    </div>
                    <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200">
                      <Loader2 size={16} className="text-purple-600 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t-2 border-purple-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about this lesson..."
                    className="flex-1 px-4 py-3 bg-purple-50 border-2 border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isLoadingChat}
                    className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Send size={20} />
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
