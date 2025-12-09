import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_MODULES } from '../services/mockData';
import { Flame, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get user data with defaults for new users
  const userName = user?.name?.split(' ')[0] || 'User';
  const level = user?.profile?.level || 1;
  const currentXp = user?.profile?.current_xp || 0;
  const nextLevelXp = user?.profile?.next_level_xp || 100;
  const streakDays = user?.profile?.streak_days || 0;
  const totalHours = user?.profile?.total_learning_hours || 0;

  // Fetch user's real progress (completed modules, etc.)
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;

      try {
        // For now, we'll use empty progress until we implement the backend endpoint
        // TODO: Fetch from API endpoint
        setUserProgress({
          completedModules: [],
          inProgressModules: [],
          skills: {
            hardware: 0,
            programming: 0,
            circuits: 0,
            troubleshooting: 0
          }
        });
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id]);

  const completedModulesCount = userProgress?.completedModules?.length || 0;
  const inProgressModules = userProgress?.inProgressModules || [];
  const skills = userProgress?.skills || { hardware: 0, programming: 0, circuits: 0, troubleshooting: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12 space-y-8 md:space-y-16">

        {/* Minimalist Welcome Section */}
        <section className="space-y-3 md:space-y-4 pt-16 md:pt-0">
          {streakDays > 0 && (
            <div className="flex items-center gap-2 md:gap-3 text-purple-600">
              <Flame size={20} className="fill-purple-600 animate-pulse md:w-6 md:h-6" />
              <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
                {streakDays} Day Streak
              </span>
            </div>
          )}

          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 leading-tight">
            Welcome back,<br />{userName}
          </h1>

          <p className="text-base md:text-xl text-neutral-600 max-w-2xl leading-relaxed">
            You're on track to reach Level {level + 1}.
            Just <span className="font-semibold text-purple-600">{nextLevelXp - currentXp} XP</span> away.
          </p>
        </section>

        {/* Minimalist Stats - Single Row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { label: 'Level', value: level, suffix: '' },
            { label: 'Total XP', value: currentXp.toLocaleString(), suffix: '' },
            { label: 'Modules', value: completedModulesCount, suffix: '/18' },
            { label: 'This Week', value: totalHours > 0 ? `${totalHours.toFixed(1)}h` : '0h', suffix: '' },
          ].map((stat, i) => (
            <div key={i} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white rounded-2xl p-4 md:p-6 border border-neutral-200 group-hover:border-purple-200 transition-all duration-300">
                <div className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-500">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-xs md:text-sm text-neutral-500 mt-1 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Continue Learning - Minimalist Cards */}
        <section className="space-y-4 md:space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-1 md:mb-2">
                Continue Learning
              </h2>
              <p className="text-sm md:text-base text-neutral-600">Pick up where you left off</p>
            </div>
            <Link
              to="/courses"
              className="group flex items-center gap-1 md:gap-2 text-sm md:text-base text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              <span className="hidden md:inline">View all</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform md:w-[18px] md:h-[18px]" />
            </Link>
          </div>

          <div className="space-y-4 md:space-y-6">
            {inProgressModules.length > 0 ? inProgressModules.slice(0, 3).map(module => (
              <Link to={`/module/${module.id}`} key={module.id} className="group block">
                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-neutral-200 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300">
                  <div className="flex gap-3 md:gap-6 items-center">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shrink-0 ring-2 md:ring-4 ring-neutral-100 group-hover:ring-purple-100 transition-all">
                      <img
                        src={module.thumbnail}
                        alt={module.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-purple-600">
                          {module.category}
                        </span>
                        <span className="text-xs text-neutral-400 hidden md:inline">•</span>
                        <span className="text-[10px] md:text-xs text-neutral-500 hidden md:inline">{module.duration}</span>
                      </div>

                      <h3 className="text-sm md:text-xl font-display font-semibold text-neutral-900 mb-2 md:mb-4 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {module.title}
                      </h3>

                      {/* Progress Bar - Minimalist */}
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-neutral-600 tabular-nums w-8 md:w-12 text-right">
                          {module.progress}%
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-neutral-50 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 flex items-center justify-center transition-all duration-300 shrink-0">
                      <ArrowRight size={16} className="text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 border-2 border-dashed border-neutral-200 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <BookOpen size={24} className="text-purple-600 md:w-7 md:h-7" />
                </div>
                <p className="text-sm md:text-base text-neutral-600 mb-3 md:mb-4">No courses in progress</p>
                <Link to="/courses" className="inline-flex items-center gap-2 text-sm md:text-base text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                  Browse courses
                  <ArrowRight size={14} className="md:w-4 md:h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Minimalist Skill Overview */}
        <section className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 p-6 md:p-12 text-white mb-6 md:mb-0">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Sparkles size={20} className="fill-white md:w-6 md:h-6" />
              <h3 className="text-xl md:text-2xl font-display font-bold">Skill Progress</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {Object.entries(skills).map(([skill, value]) => (
                <div key={skill} className="space-y-2 md:space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium capitalize text-sm md:text-lg">
                      {skill.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xl md:text-2xl font-display font-bold tabular-nums">
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
