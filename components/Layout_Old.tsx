import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Zap, BookOpen, Users, Settings, Home, LogOut } from 'lucide-react';
import { MOCK_USER } from '../services/mockData';

export const Layout: React.FC = () => {
  const location = useLocation();

  const NAV_ITEMS = [
    { label: 'Dashboard', icon: <Home size={20} />, path: '/' },
    { label: 'Courses', icon: <BookOpen size={20} />, path: '/courses' },
    { label: 'Feed', icon: <Users size={20} />, path: '/feed' },
    { label: 'Simulator', icon: <Zap size={20} />, path: '/simulator' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 md:flex-row overflow-hidden font-sans">
      {/* Sidebar for Desktop - Dark Theme */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 h-full shadow-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
             <Zap size={24} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              NovEng
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Practical Engineering</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
              {/* Active glow indicator */}
              {location.pathname === item.path && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Snippet */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
             <img src={MOCK_USER.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-700" />
             <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{MOCK_USER.name}</p>
                <p className="text-xs text-slate-500 truncate">Level {MOCK_USER.stats.level} Engineer</p>
             </div>
             <Settings size={16} className="text-slate-500 hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative no-scrollbar pb-20 md:pb-0 bg-slate-50/50">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-4 flex justify-between items-center z-50">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 rounded-lg transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-500'
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement<{ size: number }>, { size: 24 })}
            </NavLink>
          );
        })}
        <NavLink to="/profile" className="flex flex-col items-center gap-1 text-slate-500">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-600">
                <img src={MOCK_USER.avatar} alt="Me" />
            </div>
        </NavLink>
      </nav>
    </div>
  );
};