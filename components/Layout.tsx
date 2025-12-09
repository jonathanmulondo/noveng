import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Zap, BookOpen, Users, Home, Sparkles, Bot, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NovieFloatingButton } from './NovieFloatingButton';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const NAV_ITEMS = [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { label: 'Courses', icon: <BookOpen size={20} />, path: '/courses' },
    { label: 'Simulator', icon: <Zap size={20} />, path: '/simulator' },
    { label: 'Feed', icon: <Users size={20} />, path: '/feed' },
    { label: 'Novie AI', icon: <Bot size={20} />, path: '/novie', special: true },
  ];

  return (
    <div className="flex flex-row h-screen bg-white overflow-hidden font-sans antialiased">

      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg"
      >
        {isMobileSidebarOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Menu size={24} className="text-white" />
        )}
      </button>

      {/* Sidebar - Shows on Desktop, Toggleable on Mobile */}
      <aside className={`
        fixed md:relative
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        transition-transform duration-300 ease-in-out
        flex flex-col w-72 bg-gradient-to-b from-neutral-900 via-purple-950 to-neutral-900 text-neutral-300 h-full shadow-2xl z-40 border-r border-purple-900/20
      `}>

        {/* Logo */}
        <div className="p-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-md opacity-75" />
              <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
                <Zap size={28} className="text-white" fill="white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                NovEng
              </h1>
              <p className="text-xs text-purple-400 font-medium uppercase tracking-widest">
                Hands on the Future
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'hover:bg-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                {/* Gradient border effect on hover */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300" />
                )}

                <div className="relative z-10 flex items-center gap-4 w-full">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  )}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-purple-900/30">
          <div
            className="group relative cursor-pointer"
            onClick={() => navigate('/settings')}
          >
            {/* Gradient hover effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300" />

            <div className="relative flex items-center gap-4 p-4 rounded-2xl">
              <div className="relative">
                {user?.profile?.profile_picture_url ? (
                  <img
                    src={user.profile.profile_picture_url}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500 transition-all object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-purple-500/30 group-hover:border-purple-500 transition-all flex items-center justify-center text-white text-lg font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                  <Sparkles size={10} className="text-white fill-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-purple-400 truncate">
                  Level {user?.profile?.level || 1} • {user?.profile?.current_xp || 0} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-white">
        <Outlet />

        {/* Floating Novie AI Button - Appears on all pages except /novie and /feed */}
        {location.pathname !== '/novie' && location.pathname !== '/feed' && <NovieFloatingButton />}
      </main>
    </div>
  );
};
