import React, { useState } from 'react';
import { MOCK_MODULES, MOCK_USER } from '../services/mockData';
import { ModuleCategory } from '../types';
import { Link } from 'react-router-dom';
import { Clock, Search, Star, BookOpen, Users } from 'lucide-react';

// MVP Focus: Arduino Only
const CATEGORIES: ModuleCategory[] = ['Arduino'];

export const Modules: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = MOCK_MODULES.filter(m => {
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

        {/* Minimalist Header */}
        <section className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600">
              Course Library
            </h1>
            <p className="text-xl text-neutral-600">
              Explore hands-on engineering courses designed for makers
            </p>
          </div>

          {/* Search bar - Minimalist */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-14 pr-6 py-4 bg-white border-2 border-neutral-200 rounded-3xl focus:outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all text-neutral-800 placeholder-neutral-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category pills - Minimalist */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                activeCategory === 'All'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200'
                  : 'bg-white text-neutral-600 border-2 border-neutral-200 hover:border-purple-300'
              }`}
            >
              All Courses
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200'
                    : 'bg-white text-neutral-600 border-2 border-neutral-200 hover:border-purple-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Course grid - Minimalist cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModules.map((module) => {
            const isCompleted = MOCK_USER.completedModules.includes(module.id);
            const inProgress = module.progress > 0 && module.progress < 100;

            return (
              <Link
                to={`/module/${module.id}`}
                key={module.id}
                className="group"
              >
                <div className="bg-white rounded-3xl overflow-hidden border-2 border-neutral-200 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300">

                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={module.thumbnail}
                      alt={module.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Difficulty badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                        module.difficulty === 'Beginner'
                          ? 'bg-green-500/90 text-white'
                          : module.difficulty === 'Intermediate'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-red-500/90 text-white'
                      }`}>
                        {module.difficulty}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm font-semibold">{module.rating}</span>
                      <span className="text-white/60 text-xs">({module.studentCount})</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Category tag */}
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-600">
                      {module.category}
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
                        <span>{module.studentCount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress or CTA */}
                    {inProgress ? (
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-neutral-600">Progress</span>
                          <span className="font-bold text-purple-600">{module.progress}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : isCompleted ? (
                      <div className="flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-full">
                        ✓ Completed
                      </div>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        {/* Empty state */}
        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-6">
              <BookOpen size={36} className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-display font-bold text-neutral-800 mb-2">
              No courses found
            </h3>
            <p className="text-neutral-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
