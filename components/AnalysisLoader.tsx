import React, { useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, Circle, Terminal, Search, FileCode, Cpu, FileText } from 'lucide-react';

interface AnalysisLoaderProps {
  currentStep: number;
  logs: string[];
}

const STEPS = [
  { title: 'Repository Scan', icon: Search, desc: 'Connecting to GitHub API' },
  { title: 'Data Extraction', icon: FileCode, desc: 'Retrieving files & metadata' },
  { title: 'Context Optimization', icon: FileText, desc: 'Preparing token window' },
  { title: 'Gemini Analysis', icon: Cpu, desc: 'Generating insights & roadmap' },
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ currentStep, logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-4xl mx-auto px-4">
      <div className="glass-panel w-full rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Side: Steps */}
          <div className="p-8 bg-slate-900/50 border-r border-slate-800">
             <h2 className="text-xl font-bold text-white mb-6">Analyzing Repository</h2>
             <div className="space-y-6">
                {STEPS.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  const Icon = step.icon;

                  return (
                    <div key={index} className={`flex items-center gap-4 transition-all duration-300 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300
                          ${isActive ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 
                            isCompleted ? 'bg-green-500/10 border-green-500/50 text-green-400' : 
                            'bg-slate-800 border-slate-700 text-slate-500'
                          }`}>
                          {isActive ? <Loader2 size={20} className="animate-spin" /> : 
                           isCompleted ? <CheckCircle2 size={20} /> : 
                           <Icon size={20} />}
                       </div>
                       <div>
                          <h3 className={`font-medium ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-slate-400'}`}>
                            {step.title}
                          </h3>
                          <p className="text-xs text-slate-500">{step.desc}</p>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Right Side: Terminal Log */}
          <div className="p-0 bg-slate-950 flex flex-col h-full min-h-[300px] md:min-h-0">
             <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-800">
                <Terminal size={14} className="text-slate-500" />
                <span className="text-xs font-mono text-slate-400">Analysis Log</span>
             </div>
             <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 h-[300px] md:h-auto custom-scrollbar">
                {logs.length === 0 && (
                  <span className="text-slate-600 italic">Waiting for process start...</span>
                )}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-blue-500 select-none">{'>'}</span>
                    <span className="text-slate-300">{log}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
             </div>
          </div>

        </div>
      </div>
      
      <p className="text-slate-500 text-sm mt-6 animate-pulse">
        {currentStep === 3 ? 'This may take up to 30 seconds...' : 'Please do not close this window.'}
      </p>
    </div>
  );
};