import React, { useState } from 'react';
import { RepoContext, AnalysisResult } from '../types';
import { ScoreCard } from './ScoreCard';
import { DimensionsChart } from './Charts';
import { Roadmap } from './Roadmap';
import { ExternalLink, GitBranch, Code, Check, X, Share2, CheckCheck, Twitter, Linkedin } from 'lucide-react';

interface DashboardProps {
  repo: RepoContext;
  analysis: AnalysisResult;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ repo, analysis, onReset }) => {
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    return `RepoMirror Analysis: ${repo.metadata.full_name}
Score: ${analysis.score}/100
Summary: ${analysis.summary}
Strengths: ${analysis.strengths.slice(0, 3).join(', ')}
Link: ${repo.metadata.html_url}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    // Truncate summary for Twitter's limit if needed
    const tweetText = `RepoMirror Analysis: ${repo.metadata.full_name}\nScore: ${analysis.score}/100\n\n${analysis.summary.slice(0, 120)}...\n\n${repo.metadata.html_url}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const text = getShareText();
    // Use the feed share intent
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-slate-800/60">
        <div className="flex items-center gap-5">
          <div className="relative">
             <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
             <img src={repo.metadata.owner.avatar_url} alt="Avatar" className="relative w-16 h-16 rounded-xl border border-slate-700 shadow-xl" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
              {repo.metadata.name}
              <a 
                href={repo.metadata.html_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-500 hover:text-blue-400 transition-colors p-1 hover:bg-slate-800 rounded"
              >
                <ExternalLink size={20} />
              </a>
            </h2>
            <div className="flex gap-4 text-sm text-slate-400 mt-2 font-mono">
               <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                 <Code size={12} className="text-blue-400" /> 
                 {repo.metadata.language || 'Multi-language'}
               </span>
               <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                 <GitBranch size={12} className="text-purple-400" /> 
                 {repo.metadata.forks_count}
               </span>
               <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                 ★ {repo.metadata.stargazers_count}
               </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="flex bg-slate-900 rounded-lg border border-slate-800 shadow-lg overflow-hidden">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all border-r border-slate-800 group"
                title="Copy Summary"
              >
                {copied ? <CheckCheck size={16} className="text-green-400" /> : <Share2 size={16} className="group-hover:text-blue-400 transition-colors" />}
                <span className="text-sm font-medium hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button 
                onClick={handleTwitterShare}
                className="p-2.5 text-slate-400 hover:text-sky-500 hover:bg-slate-800 transition-all border-r border-slate-800"
                title="Share on Twitter"
              >
                <Twitter size={18} />
              </button>
              <button 
                onClick={handleLinkedInShare}
                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-slate-800 transition-all"
                title="Share on LinkedIn"
              >
                <Linkedin size={18} />
              </button>
          </div>
          
          <button 
            onClick={onReset}
            className="text-sm font-medium px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 hover:border-blue-400 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
          >
            Analyze Another
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Score Card */}
        <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl border-slate-700/40 transform transition-all hover:scale-[1.01] hover:shadow-blue-500/10">
           <div className="bg-slate-900/40 p-4 border-b border-slate-700/40 backdrop-blur-md">
               <h3 className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">Quality Score</h3>
           </div>
           <div className="p-8 flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900/0 to-slate-900/20">
               <div className="scale-110 mb-4">
                 <ScoreCard score={analysis.score} />
               </div>
               <p className="text-center text-slate-400 text-xs px-8 leading-relaxed max-w-[250px]">
                 Composite rating based on code structure, best practices, and documentation quality.
               </p>
           </div>
        </div>

        {/* Summary Card */}
        <div className="glass-panel rounded-2xl lg:col-span-2 flex flex-col overflow-hidden shadow-2xl border-slate-700/40">
           <div className="bg-slate-900/40 p-4 border-b border-slate-700/40 backdrop-blur-md flex justify-between items-center">
              <h3 className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">Executive Summary</h3>
           </div>
           
           <div className="p-8 flex-1 flex flex-col">
               <p className="text-lg text-slate-200 leading-relaxed mb-8 font-light tracking-wide">
                 {analysis.summary}
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                 {/* Strengths */}
                 <div className="bg-emerald-950/10 border border-emerald-500/10 rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:bg-emerald-900/20">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12">
                        <Check size={48} className="text-emerald-500" />
                    </div>
                    <h4 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2 text-xs uppercase tracking-wider relative z-10">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Key Strengths
                    </h4>
                    <ul className="space-y-3 relative z-10">
                       {analysis.strengths.slice(0, 3).map((s, i) => (
                          <li key={i} className="text-slate-300 text-sm flex items-start gap-3">
                            <Check size={14} className="mt-1 shrink-0 text-emerald-500/70" />
                            <span className="leading-snug opacity-90">{s}</span>
                          </li>
                       ))}
                    </ul>
                 </div>

                 {/* Weaknesses */}
                 <div className="bg-rose-950/10 border border-rose-500/10 rounded-xl p-5 relative overflow-hidden group hover:border-rose-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(244,63,94,0.1)] hover:bg-rose-900/20">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
                        <X size={48} className="text-rose-500" />
                    </div>
                    <h4 className="text-rose-400 font-semibold mb-4 flex items-center gap-2 text-xs uppercase tracking-wider relative z-10">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                        Improvements Needed
                    </h4>
                    <ul className="space-y-3 relative z-10">
                       {analysis.weaknesses.slice(0, 3).map((w, i) => (
                          <li key={i} className="text-slate-300 text-sm flex items-start gap-3">
                            <X size={14} className="mt-1 shrink-0 text-rose-500/70" />
                            <span className="leading-snug opacity-90">{w}</span>
                          </li>
                       ))}
                    </ul>
                 </div>
               </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Analysis Chart */}
         <div className="glass-panel rounded-2xl flex flex-col overflow-hidden shadow-2xl border-slate-700/40 h-fit transform transition-all hover:shadow-blue-500/10">
            <div className="bg-slate-900/40 p-4 border-b border-slate-700/40 backdrop-blur-md">
               <h3 className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">Technical Dimensions</h3>
            </div>
            <div className="p-6">
                <div className="h-64 -ml-4 mb-4">
                    <DimensionsChart ratings={analysis.ratings} />
                </div>
                <div className="space-y-4">
                   {Object.entries(analysis.ratings).map(([key, val]) => (
                     <div key={key} className="group cursor-default">
                         <div className="flex items-center justify-between text-sm mb-1.5">
                            <span className="text-slate-400 group-hover:text-blue-300 transition-colors capitalize font-medium">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-white font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 transition-colors group-hover:border-blue-500/50">{val}</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-out group-hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
                                style={{ width: `${val}%` }}
                            ></div>
                         </div>
                     </div>
                   ))}
                </div>
            </div>
         </div>

         {/* Roadmap */}
         <div className="glass-panel rounded-2xl lg:col-span-2 flex flex-col overflow-hidden shadow-2xl border-slate-700/40">
            <div className="bg-slate-900/40 p-4 border-b border-slate-700/40 backdrop-blur-md flex items-center justify-between">
               <h3 className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">Recommended Roadmap</h3>
               <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-1 rounded border border-blue-500/20 font-mono tracking-tight animate-pulse">
                   AI-GENERATED PLAN
               </span>
            </div>
            <div className="p-6 md:p-8 bg-slate-900/20">
               <Roadmap roadmap={analysis.roadmap} />
            </div>
         </div>
      </div>
    </div>
  );
};