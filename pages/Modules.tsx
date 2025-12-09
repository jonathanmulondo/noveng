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
    <div className="min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">

        {/* Header */}
        <section className="space-y-6 pt-16 md:pt-0">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white">
              Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">Library</span>
            </h1>
            <p className="text-xl text-purple-200">
              Explore hands-on Arduino courses from beginner to advanced
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-0 group-hover:opacity-40 transition-opacity" />
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-300 z-10" size={20} />
              <input
                type="text"
                placeholder="Search courses by name, description, or category..."
                className="relative w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-white/10 rounded-3xl focus:outline-none focus:border-purple-400/50 focus:bg-white/15 transition-all text-white placeholder-purple-300/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedDifficulty('All')}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedDifficulty === 'All'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/5 backdrop-blur-sm text-purple-200 border border-white/10 hover:border-purple-400/50'
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
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 backdrop-blur-sm text-purple-200 border border-white/10 hover:border-purple-400/50'
                  }`}
                >
                  <Icon size={16} />
                  {level}
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    selectedDifficulty === level
                      ? 'bg-white/20'
                      : 'bg-white/10'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-purple-300">
            <span className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <BookOpen size={16} className="text-purple-400" />
              {modules.length} Total Courses
            </span>
            {searchQuery && (
              <span className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <Search size={16} className="text-pink-400" />
                {filteredModules.length} Results
              </span>
            )}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-purple-400 animate-spin mb-4" />
            <p className="text-purple-200 text-lg">Loading modules...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur opacity-30" />
              <div className="relative w-20 h-20 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center mb-6 backdrop-blur-sm">
                <AlertCircle size={36} className="text-red-400" />
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              Failed to Load Modules
            </h3>
            <p className="text-purple-200 mb-6 max-w-md text-center">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
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
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur opacity-50" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <Icon size={28} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-3xl font-display font-bold text-white">
                        {level}
                      </h2>
                      <p className="text-purple-300">{config.description}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-semibold text-purple-200">
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
                            <div className="relative h-full">
                              {/* Glowing border on hover */}
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 group-hover:border-purple-400/50 transition-all duration-300 h-full">

                                {/* Thumbnail */}
                                <div className="relative h-48 overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
                                  <img
                                    src={module.thumbnail_url || `https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80`}
                                    alt={module.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

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
                                  <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
                                    Module {module.module_number} • {module.category}
                                  </div>

                                  {/* Title */}
                                  <h3 className="text-xl font-display font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                                    {module.title}
                                  </h3>

                                  {/* Description */}
                                  <p className="text-sm text-purple-200 line-clamp-2 leading-relaxed">
                                    {module.description}
                                  </p>

                                  {/* Meta info */}
                                  <div className="flex items-center gap-4 text-xs text-purple-300 pt-2 border-t border-white/10">
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
                                    <div className="flex items-center gap-2 text-sm font-semibold text-green-300 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full">
                                      ✓ Completed
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/5 backdrop-blur-sm border border-dashed border-white/10 rounded-3xl">
                      <p className="text-purple-300">No {level.toLowerCase()} courses available</p>
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
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur opacity-30" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Search size={36} className="text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">
              No courses found
            </h3>
            <p className="text-purple-200 mb-4">
              Try adjusting your search query
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              Clear Search
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
