import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_MODULES } from '../services/mockData';
import { explainCode } from '../services/geminiService';
import { ChevronLeft, ChevronRight, Sparkles, Copy, Monitor, Lightbulb, FileText, CheckCircle, Code } from 'lucide-react';

export const ModuleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const module = MOCK_MODULES.find(m => m.id === id);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  if (!module) return <div className="p-10 text-center text-slate-500">Module not found</div>;

  const step = module.steps[currentStep];
  const isLastStep = currentStep === module.steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      alert("Module completed! +50 XP");
      navigate('/');
    } else {
      setCurrentStep(prev => prev + 1);
      setAiExplanation(null);
    }
  };

  const handleAiExplain = async () => {
    if (!step.codeSnippet) return;
    setIsLoadingAi(true);
    const explanation = await explainCode(step.codeSnippet);
    setAiExplanation(explanation);
    setIsLoadingAi(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* Top Nav */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md shrink-0 z-20">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/courses')} className="hover:bg-slate-800 p-2 rounded-lg transition-colors text-slate-400 hover:text-white">
               <ChevronLeft size={20} />
            </button>
            <div>
               <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {module.title}
               </div>
               <h1 className="font-bold text-lg">{step.title}</h1>
            </div>
         </div>
         
         <div className="flex gap-4">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300 hover:text-white border border-slate-700">
                <FileText size={16} /> Content
             </button>
             <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg text-sm text-slate-400 transition-colors">
                <Monitor size={16} /> Simulator
             </button>
             <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg text-sm text-slate-400 transition-colors">
                <Lightbulb size={16} /> Notes
             </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Content & Visuals */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto custom-scrollbar">
            
            {/* Progress Bar */}
            <div className="flex items-center gap-4 mb-8">
               <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${((currentStep) / module.steps.length) * 100}%` }}></div>
               </div>
               <span className="text-xs font-bold text-slate-500">{Math.round(((currentStep) / module.steps.length) * 100)}% Complete</span>
               <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">+50 XP earned</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold text-slate-900">{step.title}</h2>
                {step.codeSnippet && <Monitor size={28} className="text-blue-500" />}
            </div>

            <p className="text-lg text-slate-600 leading-relaxed mb-8">
               {step.content}
            </p>

            {/* Key Concepts Box */}
            {step.keyConcepts && (
              <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Lightbulb size={100} className="text-white" />
                 </div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500 p-2 rounded-lg text-white">
                       <Lightbulb size={20} fill="white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Key Concepts</h3>
                 </div>
                 <ul className="space-y-3">
                    {step.keyConcepts.map((concept, i) => (
                       <li key={i} className="flex gap-3 text-slate-300 text-sm md:text-base bg-slate-700/50 p-3 rounded-lg border border-slate-600/50">
                          <span className="text-blue-400 font-bold">⚡</span>
                          {concept}
                       </li>
                    ))}
                 </ul>
              </div>
            )}
            
            {/* Image Block */}
            {step.image && (
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 mb-8">
                <img src={step.image} alt={step.title} className="w-full h-auto" />
              </div>
            )}

            {/* IDE Block */}
            {step.codeSnippet && (
              <div className="bg-[#0D1117] rounded-xl overflow-hidden shadow-2xl border border-slate-800 mb-8 font-mono text-sm">
                 {/* IDE Header */}
                 <div className="bg-[#161b22] px-4 py-3 flex justify-between items-center border-b border-slate-800">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-slate-400 text-xs flex items-center gap-2">
                       <Code size={14} /> Arduino Code
                    </span>
                    <button className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-xs border border-slate-700 px-2 py-1 rounded">
                       <Copy size={12} /> Copy Code
                    </button>
                 </div>

                 <div className="p-6 overflow-x-auto relative group">
                    <pre className="text-slate-300 leading-relaxed">
                       <code>{step.codeSnippet}</code>
                    </pre>
                 </div>
                 
                 {/* AI Action Bar */}
                 <div className="bg-[#161b22] px-4 py-3 border-t border-slate-800 flex justify-between items-center">
                     <p className="text-slate-500 text-xs">Need help understanding this?</p>
                     <button 
                        onClick={handleAiExplain}
                        disabled={isLoadingAi}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/50 transition-all active:scale-95 disabled:opacity-50"
                     >
                        <Sparkles size={14} /> {isLoadingAi ? 'Analyzing...' : 'Ask AI Tutor'}
                     </button>
                 </div>
                 
                 {/* AI Response Area */}
                 {aiExplanation && (
                   <div className="bg-indigo-900/20 border-t border-indigo-500/20 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
                            <Sparkles size={20} className="text-white" fill="white" />
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-indigo-300 font-bold">NovEng AI Explanation</h4>
                            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-black/20 p-4 rounded-lg border border-indigo-500/10">
                               {aiExplanation}
                            </div>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
            )}
        </div>

        {/* RIGHT: Step Navigation (Desktop) */}
        <div className="hidden xl:flex w-80 bg-slate-50 border-l border-slate-200 flex-col">
           <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">Course Progress</h3>
              <p className="text-xs text-slate-500">Arduino Foundations • 8 hours left</p>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {module.steps.map((s, idx) => {
                 const isActive = idx === currentStep;
                 const isPast = idx < currentStep;
                 return (
                    <div 
                      key={idx}
                      onClick={() => setCurrentStep(idx)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 border-blue-600 transform scale-105' 
                          : isPast 
                             ? 'bg-slate-100 text-slate-400 border-transparent hover:bg-slate-200'
                             : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'
                      }`}
                    >
                       <div className="flex justify-between items-start mb-1">
                          <span className={`text-xs font-bold uppercase ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>Step {idx + 1}</span>
                          {isPast && <CheckCircle size={14} className="text-green-500" />}
                          {isActive && <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>}
                       </div>
                       <h4 className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-700'}`}>{s.title}</h4>
                    </div>
                 );
              })}
           </div>

           <div className="p-6 border-t border-slate-200 bg-white">
              <button 
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                 {isLastStep ? 'Complete Module' : 'Next Step'} <ChevronRight size={18} />
              </button>
           </div>
        </div>

      </div>

      {/* Mobile Sticky Footer Nav */}
      <div className="xl:hidden bg-white border-t border-slate-200 p-4 flex gap-4 items-center justify-between shrink-0">
         <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="text-slate-500 disabled:opacity-30">Previous</button>
         <span className="text-sm font-bold text-slate-700">{currentStep + 1} / {module.steps.length}</span>
         <button onClick={handleNext} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-md flex items-center gap-2">
            {isLastStep ? 'Finish' : 'Next'} <ChevronRight size={16} />
         </button>
      </div>

    </div>
  );
};