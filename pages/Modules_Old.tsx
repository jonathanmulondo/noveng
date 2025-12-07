import React, { useState } from 'react';
import { MOCK_MODULES, MOCK_USER } from '../services/mockData';
import { ModuleCategory } from '../types';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Search, Filter, Star, BookOpen, Users } from 'lucide-react';

const CATEGORIES: ModuleCategory[] = ['Arduino', 'PCB Design', 'Raspberry Pi', 'Embedded Systems', 'Power Electronics'];

export const Modules: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = MOCK_MODULES.filter(m => {
    const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
               Course Library <span className="text-2xl">📚</span>
            </h1>
            <p className="text-slate-500">Explore practical engineering courses and learning paths</p>
         </div>
         <div className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-200 text-center min-w-[120px]">
            <div className="text-2xl font-bold">{filteredModules.length}</div>
            <div className="text-xs font-medium opacity-90">Total Courses</div>
         </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search courses, skills, topics..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <button className="flex items-center gap-2 px-5 py-3 bg-slate-600 text-white rounded-xl font-medium shadow-md hover:bg-slate-700 transition-colors">
            <Filter size={18} /> Filter
         </button>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
         <button 
           onClick={() => setActiveCategory('All')}
           className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
             activeCategory === 'All' 
               ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md' 
               : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
           }`}
         >
           All Courses
         </button>
         {CATEGORIES.map(cat => (
           <button 
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
               activeCategory === cat 
                 ? 'bg-slate-800 text-white shadow-md' 
                 : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
             }`}
           >
             {/* Simple icon mapping */}
             {cat === 'Arduino' && '🔧 '}
             {cat === 'PCB Design' && '⚙️ '}
             {cat === 'Raspberry Pi' && '🥧 '}
             {cat === 'Embedded Systems' && '💻 '}
             {cat === 'Power Electronics' && '⚡ '}
             {cat}
           </button>
         ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredModules.map((module) => {
          const isCompleted = MOCK_USER.completedModules.includes(module.id);
          return (
            <div 
              key={module.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Thumbnail Area */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={module.thumbnail} 
                  alt={module.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60"></div>
                
                {/* Overlay Tags */}
                <div className="absolute top-4 right-4">
                   {module.difficulty === 'Beginner' && <span className="text-xs font-bold bg-green-500/90 text-white backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">Beginner</span>}
                   {module.difficulty === 'Intermediate' && <span className="text-xs font-bold bg-yellow-500/90 text-white backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">Intermediate</span>}
                   {module.difficulty === 'Advanced' && <span className="text-xs font-bold bg-red-500/90 text-white backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">Advanced</span>}
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs font-medium">
                   <Star size={12} className="text-yellow-400 fill-yellow-400" /> {module.rating} <span className="text-slate-300">({module.studentCount})</span>
                </div>
              </div>
              
              {/* Content Area */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                  {module.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-6 border-b border-slate-100 pb-4">
                   <div className="flex items-center gap-1">
                      <BookOpen size={14} /> 12 modules
                   </div>
                   <div className="flex items-center gap-1">
                      <Clock size={14} /> {module.duration}
                   </div>
                </div>

                <div className="flex items-center gap-3 text-slate-500 text-xs mb-4">
                    <Users size={14} /> {module.studentCount.toLocaleString()} students
                </div>

                {/* Progress or CTA */}
                {module.progress > 0 ? (
                  <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold text-slate-600">
                        <span>Your progress</span>
                        <span className="text-blue-600">{module.progress}%</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${module.progress}%` }}></div>
                     </div>
                     <Link to={`/module/${module.id}`} className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200 mt-4">
                       Continue Learning
                     </Link>
                  </div>
                ) : (
                  <Link to={`/module/${module.id}`} className="block w-full text-center py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors mt-auto">
                     Start Course
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};