import React from 'react';
import { MOCK_USER, MOCK_MODULES } from '../services/mockData';
import { Flame, Trophy, Star, Clock, Target, ArrowRight, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const inProgressModules = MOCK_MODULES.filter(m => m.progress > 0 && m.progress < 100);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
           <Trophy size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 text-blue-100 font-medium">
             <Flame size={20} className="text-orange-400 fill-orange-400 animate-pulse" />
             {MOCK_USER.stats.streakDays} Day Streak!
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {MOCK_USER.name.split(' ')[0]}! 👋</h1>
          <p className="text-blue-100 max-w-lg mb-6">
            Ready to continue your engineering journey? You're 230 XP away from Level {MOCK_USER.stats.level + 1}.
          </p>
          
          <div className="flex gap-8 items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 w-fit">
             <div className="text-center">
                <div className="text-2xl font-bold">{MOCK_USER.stats.level}</div>
                <div className="text-xs text-blue-200 uppercase tracking-wider">Level</div>
             </div>
             <div className="w-[1px] h-8 bg-white/20"></div>
             <div className="text-center">
                <div className="text-2xl font-bold">{MOCK_USER.stats.currentXp}</div>
                <div className="text-xs text-blue-200 uppercase tracking-wider">Total XP</div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
           { label: 'Weekly XP', value: '+125 XP', sub: 'Top 10%', icon: <BarChart3 />, color: 'bg-cyan-500' },
           { label: 'Skills Mastered', value: '12/18', sub: '3 in progress', icon: <Target />, color: 'bg-indigo-500' },
           { label: 'Badges Earned', value: '8', sub: '2 away from next', icon: <Trophy />, color: 'bg-purple-500' },
           { label: 'Learning Time', value: '12.5h', sub: 'This week', icon: <Clock />, color: 'bg-pink-500' }
        ].map((stat, i) => (
           <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20 ${stat.color} group-hover:scale-110 transition-transform`}></div>
               <div className="flex justify-between items-start text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wide">{stat.label}</span>
                  {React.cloneElement(stat.icon as any, { size: 18, className: stat.color.replace('bg-', 'text-') })}
               </div>
               <div>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.sub}</div>
               </div>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning Section */}
        <div className="lg:col-span-2 space-y-4">
           <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-slate-800">Continue Learning 🚀</h2>
              <Link to="/courses" className="text-sm text-blue-600 font-semibold hover:underline">View All</Link>
           </div>
           
           <div className="space-y-4">
             {inProgressModules.length > 0 ? inProgressModules.map(module => (
               <Link to={`/module/${module.id}`} key={module.id} className="block group">
                 <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-all items-center">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                       <img src={module.thumbnail} alt={module.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute inset-0 bg-black/10"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between mb-1">
                          <span className="text-xs font-semibold text-slate-500">{module.category}</span>
                          <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Clock size={12}/> 12 min left</span>
                       </div>
                       <h3 className="font-bold text-slate-900 mb-3 truncate group-hover:text-blue-600 transition-colors">{module.title}</h3>
                       
                       <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: `${module.progress}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-600 w-8">{module.progress}%</span>
                       </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       <ArrowRight size={20} />
                    </div>
                 </div>
               </Link>
             )) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                  <p className="text-slate-500 mb-2">No courses in progress.</p>
                  <Link to="/courses" className="text-blue-600 font-bold">Start a new course</Link>
                </div>
             )}
           </div>
        </div>

        {/* Skill Progress Chart */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-2xl shadow-slate-900/20">
            <div>
               <h3 className="font-bold text-lg mb-6">Skill Progress</h3>
               <div className="flex justify-center mb-8 relative">
                   {/* Simple SVG Donut Chart */}
                   <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#1e293b" strokeWidth="12" />
                      {/* Arduino Segment */}
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.75)} strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">75%</span>
                      <span className="text-xs text-slate-400">Overall</span>
                   </div>
               </div>
            </div>
            
            <div className="space-y-4">
               {Object.entries(MOCK_USER.stats.skills).map(([skill, val], i) => (
                  <div key={skill} className="space-y-1">
                     <div className="flex justify-between text-xs font-medium">
                        <span className="capitalize text-slate-300">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-slate-400">{val}%</span>
                     </div>
                     <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${i===0 ? 'bg-blue-500' : i===1 ? 'bg-indigo-500' : i===2 ? 'bg-teal-400' : 'bg-purple-500'}`} 
                          style={{ width: `${val}%` }}
                        ></div>
                     </div>
                  </div>
               ))}
            </div>
        </div>
      </div>
    </div>
  );
};