import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_MODULES } from '../services/mockData';
import { Flame, BookOpen, ArrowRight, Sparkles, Zap } from 'lucide-react';
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
    <div className="min-h-screen relative">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-12 space-y-8 md:space-y-16">

        {/* Futuristic Welcome Section */}
        <section className="space-y-3 md:space-y-4 pt-16 md:pt-0 relative">
          {streakDays > 0 && (
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-sm">
              <Flame size={20} className="fill-orange-400 text-orange-400 animate-pulse md:w-6 md:h-6" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-orange-300">
                {streakDays} Day Streak
              </span>
            </div>
          )}

          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Welcome back,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              {userName}
            </span>
          </h1>

          <p className="text-base md:text-xl text-purple-200 max-w-2xl leading-relaxed">
            You're on track to reach Level {level + 1}.
            Just <span className="font-semibold text-pink-400">{nextLevelXp - currentXp} XP</span> away.
          </p>
        </section>

        {/* Futuristic Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { label: 'Level', value: level, suffix: '', icon: <Zap size={18} className="text-purple-400" /> },
            { label: 'Total XP', value: currentXp.toLocaleString(), suffix: '', icon: <Sparkles size={18} className="text-pink-400" /> },
            { label: 'Modules', value: completedModulesCount, suffix: '/18', icon: <BookOpen size={18} className="text-cyan-400" /> },
            { label: 'This Week', value: totalHours > 0 ? `${totalHours.toFixed(1)}h` : '0h', suffix: '', icon: <Flame size={18} className="text-orange-400" /> },
          ].map((stat, i) => (
            <div key={i} className="group relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10 group-hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  {stat.icon}
                  <div className="text-2xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-200">
                    {stat.value}{stat.suffix}
                  </div>
                </div>
                <div className="text-xs md:text-sm text-purple-300 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Continue Learning Section */}
        <section className="space-y-4 md:space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-1 md:mb-2">
                Continue Learning
              </h2>
              <p className="text-sm md:text-base text-purple-300">Pick up where you left off</p>
            </div>
            <Link
              to="/courses"
              className="group inline-flex items-center gap-1 md:gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 backdrop-blur-sm transition-all"
            >
              <span className="hidden md:inline text-sm text-purple-300">View all</span>
              <ArrowRight size={16} className="text-purple-400 group-hover:translate-x-1 transition-transform md:w-[18px] md:h-[18px]" />
            </Link>
          </div>

          <div className="space-y-4 md:space-y-6">
            {inProgressModules.length > 0 ? inProgressModules.slice(0, 3).map(module => (
              <Link to={`/module/${module.id}`} key={module.id} className="group block">
                <div className="relative">
                  {/* Glowing effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                  <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/10 group-hover:border-purple-400/50 transition-all duration-300">
                    <div className="flex gap-3 md:gap-6 items-center">
                      {/* Thumbnail */}
                      <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shrink-0 ring-2 md:ring-4 ring-white/10 group-hover:ring-purple-400/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
                        <img
                          src={module.thumbnail}
                          alt={module.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-purple-400">
                            {module.category}
                          </span>
                          <span className="text-xs text-purple-500 hidden md:inline">•</span>
                          <span className="text-[10px] md:text-xs text-purple-400 hidden md:inline">{module.duration}</span>
                        </div>

                        <h3 className="text-sm md:text-xl font-display font-semibold text-white mb-2 md:mb-4 group-hover:text-purple-300 transition-colors line-clamp-2">
                          {module.title}
                        </h3>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/50"
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>
                          <span className="text-xs md:text-sm font-semibold text-purple-300 tabular-nums w-8 md:w-12 text-right">
                            {module.progress}%
                          </span>
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-pink-500 group-hover:border-transparent flex items-center justify-center transition-all duration-300 shrink-0">
                        <ArrowRight size={16} className="text-purple-400 group-hover:text-white group-hover:translate-x-0.5 transition-all md:w-5 md:h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl md:rounded-3xl blur" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-8 md:p-12 border-2 border-dashed border-white/10 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center mx-auto mb-3 md:mb-4">
                    <BookOpen size={24} className="text-purple-400 md:w-7 md:h-7" />
                  </div>
                  <p className="text-sm md:text-base text-purple-200 mb-3 md:mb-4">No courses in progress</p>
                  <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                    Browse courses
                    <ArrowRight size={14} className="md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Futuristic Skill Progress */}
        <section className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-6 md:mb-0">
          {/* Glowing border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl md:rounded-3xl blur opacity-50" />

          {/* Card */}
          <div className="relative bg-gradient-to-br from-purple-600/40 via-purple-500/40 to-pink-500/40 backdrop-blur-xl p-6 md:p-12 border border-white/10">
            {/* Circuit pattern overlay */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" opacity="0.3" />
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="1" opacity="0.3" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <Sparkles size={20} className="fill-white text-white md:w-6 md:h-6" />
                <h3 className="text-xl md:text-2xl font-display font-bold text-white">Skill Progress</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {Object.entries(skills).map(([skill, value]) => (
                  <div key={skill} className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-medium capitalize text-sm md:text-lg text-white">
                        {skill.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-xl md:text-2xl font-display font-bold tabular-nums text-white">
                        {value}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                      <div
                        className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full transition-all duration-700 shadow-lg shadow-white/30"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
