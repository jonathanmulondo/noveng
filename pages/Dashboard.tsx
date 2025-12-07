import React from 'react';
import { MOCK_USER, MOCK_MODULES } from '../services/mockData';
import { Flame, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const inProgressModules = MOCK_MODULES.filter(m => m.progress > 0 && m.progress < 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* Minimalist Welcome Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-purple-600">
            <Flame size={24} className="fill-purple-600 animate-pulse" />
            <span className="text-sm font-medium uppercase tracking-wider">
              {MOCK_USER.stats.streakDays} Day Streak
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 leading-tight">
            Welcome back,<br />{MOCK_USER.name.split(' ')[0]}
          </h1>

          <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
            You're on track to reach Level {MOCK_USER.stats.level + 1}.
            Just <span className="font-semibold text-purple-600">{MOCK_USER.stats.nextLevelXp - MOCK_USER.stats.currentXp} XP</span> away.
          </p>
        </section>

        {/* Minimalist Stats - Single Row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Level', value: MOCK_USER.stats.level, suffix: '' },
            { label: 'Total XP', value: MOCK_USER.stats.currentXp.toLocaleString(), suffix: '' },
            { label: 'Modules', value: MOCK_USER.completedModules.length, suffix: '/18' },
            { label: 'This Week', value: '12.5h', suffix: '' },
          ].map((stat, i) => (
            <div key={i} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white rounded-2xl p-6 border border-neutral-200 group-hover:border-purple-200 transition-all duration-300">
                <div className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-500">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-neutral-500 mt-1 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Continue Learning - Minimalist Cards */}
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                Continue Learning
              </h2>
              <p className="text-neutral-600">Pick up where you left off</p>
            </div>
            <Link
              to="/courses"
              className="group flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              View all
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-6">
            {inProgressModules.length > 0 ? inProgressModules.slice(0, 3).map(module => (
              <Link to={`/module/${module.id}`} key={module.id} className="group block">
                <div className="bg-white rounded-3xl p-8 border border-neutral-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                  <div className="flex gap-6 items-center">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 ring-4 ring-neutral-100 group-hover:ring-purple-100 transition-all">
                      <img
                        src={module.thumbnail}
                        alt={module.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                          {module.category}
                        </span>
                        <span className="text-xs text-neutral-400">•</span>
                        <span className="text-xs text-neutral-500">{module.duration}</span>
                      </div>

                      <h3 className="text-xl font-display font-semibold text-neutral-900 mb-4 group-hover:text-purple-600 transition-colors">
                        {module.title}
                      </h3>

                      {/* Progress Bar - Minimalist */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-neutral-600 tabular-nums w-12 text-right">
                          {module.progress}%
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="w-12 h-12 rounded-full bg-neutral-50 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 flex items-center justify-center transition-all duration-300">
                      <ArrowRight size={20} className="text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-neutral-200 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={28} className="text-purple-600" />
                </div>
                <p className="text-neutral-600 mb-4">No courses in progress</p>
                <Link to="/courses" className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                  Browse courses
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Minimalist Skill Overview */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-12 text-white">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={24} className="fill-white" />
              <h3 className="text-2xl font-display font-bold">Skill Progress</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(MOCK_USER.stats.skills).map(([skill, value]) => (
                <div key={skill} className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium capitalize text-lg">
                      {skill.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-2xl font-display font-bold tabular-nums">
                      {value}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-700"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
