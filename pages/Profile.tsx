import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../services/mockData';
import { Award, Zap, Book, Settings, LogOut, Sparkles, Flame, Clock } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Use real user data if available, fallback to profile data
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const currentXp = user?.profile?.current_xp || 0;
  const level = user?.profile?.level || 1;
  const streakDays = user?.profile?.streak_days || 0;
  const totalHours = user?.profile?.total_learning_hours || 0;

  // For now, use mock data for badges and completed modules until we implement progress tracking
  const badges = MOCK_USER.badges;
  const completedModulesCount = MOCK_USER.completedModules.length;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto pt-20 md:pt-10">
      {/* Profile Header Card */}
      <div className="relative group mb-8">
        {/* Glowing border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-500" />

        {/* Main card */}
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-400 rounded-full blur opacity-50" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full border-4 border-purple-900/50 shadow-lg">
              <Award size={20} className="text-yellow-900" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">{userName}</h1>
            <p className="text-purple-300 mb-4">{userEmail}</p>

            {/* Stats Pills */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="relative group/pill">
                <div className="absolute inset-0 bg-purple-500 rounded-xl blur opacity-0 group-hover/pill:opacity-40 transition-opacity" />
                <div className="relative bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm text-purple-200 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
                  <Zap size={18} className="text-purple-400" /> Level {level}
                </div>
              </div>

              <div className="relative group/pill">
                <div className="absolute inset-0 bg-blue-500 rounded-xl blur opacity-0 group-hover/pill:opacity-40 transition-opacity" />
                <div className="relative bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm text-blue-200 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
                  <Sparkles size={18} className="text-blue-400" /> {currentXp} XP
                </div>
              </div>

              <div className="relative group/pill">
                <div className="absolute inset-0 bg-green-500 rounded-xl blur opacity-0 group-hover/pill:opacity-40 transition-opacity" />
                <div className="relative bg-green-500/20 border border-green-400/30 backdrop-blur-sm text-green-200 px-4 py-2 rounded-xl flex items-center gap-2 font-semibold">
                  <Book size={18} className="text-green-400" /> {completedModulesCount} Modules
                </div>
              </div>
            </div>

            {/* Streak & Hours */}
            <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
              {streakDays > 0 && (
                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 backdrop-blur-sm text-orange-300 px-3 py-1 rounded-full text-sm font-semibold">
                  <Flame size={16} className="text-orange-400 fill-orange-400" /> {streakDays} day streak!
                </div>
              )}
              {totalHours > 0 && (
                <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-sm text-cyan-300 px-3 py-1 rounded-full text-sm font-semibold">
                  <Clock size={16} className="text-cyan-400" /> {totalHours.toFixed(1)}h total
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/settings')}
              className="relative group/btn"
            >
              <div className="absolute inset-0 bg-purple-500 rounded-full blur opacity-0 group-hover/btn:opacity-60 transition-opacity" />
              <div className="relative bg-white/5 border border-white/10 hover:border-purple-400/50 backdrop-blur-sm text-purple-300 p-3 rounded-full transition-all">
                <Settings size={20} />
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="relative group/btn"
              title="Logout"
            >
              <div className="absolute inset-0 bg-red-500 rounded-full blur opacity-0 group-hover/btn:opacity-60 transition-opacity" />
              <div className="relative bg-red-500/20 border border-red-400/30 hover:border-red-400/50 backdrop-blur-sm text-red-300 p-3 rounded-full transition-all">
                <LogOut size={20} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles size={24} className="text-yellow-400 fill-yellow-400" />
          Badges Earned
        </h2>
        <p className="text-purple-300">Unlock achievements as you progress</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Earned Badges */}
        {badges.map((badge, i) => (
          <div key={i} className="relative group">
            {/* Glowing effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity" />

            {/* Badge card */}
            <div className="relative bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-xl p-6 rounded-2xl border border-yellow-400/30 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-full mb-3 shadow-lg shadow-yellow-500/50">
                <Award size={32} className="text-white" />
              </div>
              <h3 className="font-bold text-white">{badge}</h3>
              <p className="text-xs text-yellow-300/70 mt-1">Earned</p>
            </div>
          </div>
        ))}

        {/* Locked Badge */}
        <div className="relative group">
          {/* Subtle glow */}
          <div className="absolute -inset-0.5 bg-white/10 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />

          {/* Locked card */}
          <div className="relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center text-center opacity-50 hover:opacity-70 transition-opacity">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-3">
              <Award size={32} className="text-purple-300" />
            </div>
            <h3 className="font-bold text-purple-200">Master Builder</h3>
            <p className="text-xs text-purple-300/70 mt-1">Complete 5 more modules</p>
          </div>
        </div>
      </div>
    </div>
  );
};
