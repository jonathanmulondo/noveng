import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../services/mockData';
import { Award, Zap, Book, Settings, LogOut } from 'lucide-react';

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
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
                {userName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full border-4 border-white">
                <Award size={20} className="text-yellow-900" />
            </div>
        </div>

        <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-slate-900">{userName}</h1>
            <p className="text-slate-500">{userEmail}</p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <Zap size={18} /> Level {level}
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <Zap size={18} /> {currentXp} XP
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                    <Book size={18} /> {completedModulesCount} Modules
                </div>
            </div>
            {streakDays > 0 && (
              <div className="mt-3">
                <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 {streakDays} day streak!
                </div>
              </div>
            )}
            {totalHours > 0 && (
              <p className="text-sm text-slate-500 mt-2">
                Total learning time: {totalHours.toFixed(1)} hours
              </p>
            )}
        </div>

        <div className="flex gap-2">
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-full transition-colors">
              <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-full transition-colors"
            title="Logout"
          >
              <LogOut size={20} />
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Badges Earned</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {badges.map((badge, i) => (
            <div key={i} className="bg-gradient-to-br from-amber-100 to-orange-50 p-6 rounded-xl border border-orange-100 flex flex-col items-center text-center">
                <div className="bg-orange-200 p-3 rounded-full mb-3 text-orange-700">
                    <Award size={32} />
                </div>
                <h3 className="font-bold text-orange-900">{badge}</h3>
                <p className="text-xs text-orange-700/70 mt-1">Earned</p>
            </div>
        ))}
        {/* Locked Badge Placeholder */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 border-dashed flex flex-col items-center text-center opacity-60 grayscale">
            <div className="bg-slate-200 p-3 rounded-full mb-3 text-slate-400">
                <Award size={32} />
            </div>
            <h3 className="font-bold text-slate-400">Master Builder</h3>
            <p className="text-xs text-slate-400 mt-1">Complete 5 more modules</p>
        </div>
      </div>
    </div>
  );
};