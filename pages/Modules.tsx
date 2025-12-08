import React, { useState, useEffect } from 'react';
import { MOCK_USER } from '../services/mockData';
import { api, Module } from '../services/api';
import { Link } from 'react-router-dom';
import { Clock, Search, Star, BookOpen, Users, Loader2, AlertCircle, GraduationCap, TrendingUp, Rocket } from 'lucide-react';

type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

const DIFFICULTY_LEVELS: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

const DIFFICULTY_CONFIG = {
  Beginner: {
    icon: GraduationCap,
    color: 'green',
    description: 'Perfect for getting started'
  },
  Intermediate: {
    icon: TrendingUp,
    color: 'amber',
    description: 'Build on your knowledge'
  },
  Advanced: {
    icon: Rocket,
    color: 'red',
    description: 'Master complex projects'
  }
};

export const Modules: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'All'>('All');
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch modules from backend
  useEffect(() => {
    async function loadModules() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getModules();
        setModules(data);
      } catch (err) {
        console.error('Failed to fetch modules:', err);
        setError('Failed to load modules. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    }
    loadModules();
  }, []);

  // Filter modules by search query and difficulty
  const filteredModules = modules.filter(module => {
    // Search filter
    const matchesSearch = !searchQuery.trim() ||
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'All' || module.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  // Group modules by difficulty
  const modulesByDifficulty = DIFFICULTY_LEVELS.reduce((acc, level) => {
    acc[level] = filteredModules.filter(m => m.difficulty === level);
    return acc;
  }, {} as Record<DifficultyLevel, Module[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

        {/* Header */}
        <section className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600">
              Course Library
            </h1>
            <p className="text-xl text-neutral-600">
              Explore hands-on Arduino courses from beginner to advanced
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search courses by name, description, or category..."
              className="w-full pl-14 pr-6 py-4 bg-white border-2 border-neutral-200 rounded-3xl focus:outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all text-neutral-800 placeholder-neutral-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedDifficulty('All')}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedDifficulty === 'All'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-neutral-600 border-2 border-neutral-200 hover:border-purple-300'
              }`}
            >
              <BookOpen size={16} />
              All Levels
            </button>
            {DIFFICULTY_LEVELS.map((level) => {
              const config = DIFFICULTY_CONFIG[level];
              const Icon = config.icon;
              const count = modules.filter(m => m.difficulty === level).length;

              return (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                    selectedDifficulty === level
                      ? `bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 text-white shadow-lg`
                      : 'bg-white text-neutral-600 border-2 border-neutral-200 hover:border-purple-300'
                  }`}
                >
                  <Icon size={16} />
                  {level}
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    selectedDifficulty === level
                      ? 'bg-white/20'
                      : 'bg-neutral-100'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-neutral-600">
            <span className="flex items-center gap-2">
              <BookOpen size={16} className="text-purple-600" />
              {modules.length} Total Courses
            </span>
            {searchQuery && (
              <span className="flex items-center gap-2">
                <Search size={16} className="text-pink-500" />
                {filteredModules.length} Results
              </span>
            )}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-purple-600 animate-spin mb-4" />
            <p className="text-neutral-600 text-lg">Loading modules...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
              <AlertCircle size={36} className="text-red-600" />
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-800 mb-2">
              Failed to Load Modules
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md text-center">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Modules by Difficulty */}
        {!loading && !error && (
          <>
            {DIFFICULTY_LEVELS.map((level) => {
              const levelModules = modulesByDifficulty[level];
              if (levelModules.length === 0 && searchQuery) return null;

              const config = DIFFICULTY_CONFIG[level];
              const Icon = config.icon;

              return (
                <section key={level} className="space-y-6">
                  {/* Section Header */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${config.color}-500 to-${config.color}-600 flex items-center justify-center shadow-lg`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-display font-bold text-neutral-800">
                        {level}
                      </h2>
                      <p className="text-neutral-600">{config.description}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-neutral-700 border-2 border-neutral-200">
                        {levelModules.length} {levelModules.length === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>
                  </div>

                  {/* Course Grid */}
                  {levelModules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {levelModules.map((module) => {
                        const isCompleted = MOCK_USER.completedModules.includes(module.slug);

                        return (
                          <Link
                            to={`/module/${module.slug}`}
                            key={module.slug}
                            className="group"
                          >
                            <div className="bg-white rounded-3xl overflow-hidden border-2 border-neutral-200 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 h-full">

                              {/* Thumbnail */}
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={module.thumbnail_url || `https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80`}
                                  alt={module.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                {/* Difficulty badge */}
                                <div className="absolute top-4 right-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                                    level === 'Beginner'
                                      ? 'bg-green-500/90 text-white'
                                      : level === 'Intermediate'
                                      ? 'bg-amber-500/90 text-white'
                                      : 'bg-red-500/90 text-white'
                                  }`}>
                                    {level}
                                  </span>
                                </div>

                                {/* Rating */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                  <span className="text-white text-sm font-semibold">{module.rating?.toFixed(1) || '4.8'}</span>
                                  <span className="text-white/60 text-xs">({module.student_count?.toLocaleString() || 0})</span>
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-6 space-y-4">
                                {/* Category tag */}
                                <div className="text-xs font-bold uppercase tracking-wider text-purple-600">
                                  Module {module.module_number} • {module.category}
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-display font-semibold text-neutral-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                                  {module.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                                  {module.description}
                                </p>

                                {/* Meta info */}
                                <div className="flex items-center gap-4 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                                  <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    <span>{module.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Users size={14} />
                                    <span>{module.student_count?.toLocaleString() || '0'}</span>
                                  </div>
                                </div>

                                {/* Completed badge */}
                                {isCompleted && (
                                  <div className="flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-full">
                                    ✓ Completed
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-neutral-200">
                      <p className="text-neutral-500">No {level.toLowerCase()} courses available</p>
                    </div>
                  )}
                </section>
              );
            })}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && filteredModules.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
              <Search size={36} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-800 mb-2">
              No courses found
            </h3>
            <p className="text-neutral-600 mb-4">
              Try adjusting your search query
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              Clear Search
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
