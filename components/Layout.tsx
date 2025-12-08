import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Zap, BookOpen, Users, Home, Sparkles, Bot } from 'lucide-react';
import { MOCK_USER } from '../services/mockData';
import { NovieFloatingButton } from './NovieFloatingButton';

export const Layout: React.FC = () => {
  const location = useLocation();

  const NAV_ITEMS = [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { label: 'Courses', icon: <BookOpen size={20} />, path: '/courses' },
    { label: 'Simulator', icon: <Zap size={20} />, path: '/simulator' },
    { label: 'Feed', icon: <Users size={20} />, path: '/feed' },
    { label: 'Novie AI', icon: <Bot size={20} />, path: '/novie', special: true },
  ];

  return (
    <div className="flex flex-col h-screen bg-white md:flex-row overflow-hidden font-sans antialiased">

      {/* Sidebar for Desktop - Purple/Pink Theme */}
      <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-neutral-900 via-purple-950 to-neutral-900 text-neutral-300 h-full shadow-2xl z-20 border-r border-purple-900/20">

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
          <div className="group relative">
            {/* Gradient hover effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300" />

            <div className="relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer">
              <div className="relative">
                <img
                  src={MOCK_USER.avatar}
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-purple-500/30 group-hover:border-purple-500 transition-all"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                  <Sparkles size={10} className="text-white fill-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {MOCK_USER.name}
                </p>
                <p className="text-xs text-purple-400 truncate">
                  Level {MOCK_USER.stats.level} • {MOCK_USER.stats.currentXp} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-white">
        <Outlet />

        {/* Floating Novie AI Button - Appears on all pages except /novie and /feed */}
        {location.pathname !== '/novie' && location.pathname !== '/feed' && <NovieFloatingButton />}
      </main>

      {/* Mobile Bottom Nav - Purple/Pink Theme */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-purple-900/20 px-6 py-4 flex justify-between items-center z-50 backdrop-blur-lg bg-opacity-95">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 rounded-xl transition-all"
            >
              {/* Active background glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl opacity-20 blur-sm" />
              )}

              <div className={`relative p-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30'
                  : ''
              }`}>
                {React.cloneElement(item.icon as React.ReactElement<{ className: string }>, {
                  className: isActive ? 'text-white' : 'text-neutral-500'
                })}
              </div>
            </NavLink>
          );
        })}

        {/* Profile in mobile nav */}
        <NavLink to="/profile" className="flex flex-col items-center gap-1 relative">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-purple-500/30">
            <img src={MOCK_USER.avatar} alt="Me" className="w-full h-full object-cover" />
          </div>
        </NavLink>
      </nav>
    </div>
  );
};
