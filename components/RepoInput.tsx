import React, { useState } from 'react';
import { Search, Github, AlertCircle } from 'lucide-react';

interface RepoInputProps {
  onAnalyze: (url: string, token: string) => void;
  loading: boolean;
}

export const RepoInput: React.FC<RepoInputProps> = ({ onAnalyze, loading }) => {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim(), token.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-8 p-4 bg-blue-500/10 rounded-full animate-pulse-fast">
        <Github size={64} className="text-blue-400" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
        Repo Mirror AI
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10">
        Turn your GitHub repository into a detailed scorecard. 
        Get an AI-powered code review, actionable roadmap, and professional rating in seconds.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xl relative z-10">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-slate-900 rounded-lg border border-slate-700 p-2 shadow-2xl">
            <Search className="ml-3 text-slate-500" />
            <input
              type="text"
              placeholder="https://github.com/username/repository"
              className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 focus:outline-none px-4 py-3"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 flex flex-col items-center">
        <button 
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="text-xs text-slate-500 hover:text-slate-300 underline mb-2"
        >
            {showTokenInput ? 'Hide Token Input' : 'Rate limited? Add GitHub Token (Optional)'}
        </button>
        
        {showTokenInput && (
             <div className="w-full max-w-md animate-in fade-in slide-in-from-top-2">
                 <input 
                    type="password" 
                    placeholder="github_pat_..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                 />
                 <p className="text-[10px] text-slate-500 mt-1 text-left">
                    <AlertCircle size={10} className="inline mr-1" />
                    Only needed if you hit API rate limits. Token is not stored.
                 </p>
             </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl w-full">
        {[
          { title: "Smart Analysis", desc: "Evaluates structure, quality, and best practices." },
          { title: "Honest Feedback", desc: "Identifies strengths and critical weaknesses." },
          { title: "Action Plan", desc: "Personalized roadmap to improve the project." }
        ].map((item, i) => (
          <div key={i} className="glass-panel p-6 rounded-xl hover:border-blue-500/30 transition-colors">
            <h3 className="text-blue-400 font-semibold mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};