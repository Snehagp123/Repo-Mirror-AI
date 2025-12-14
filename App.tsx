import React, { useState } from 'react';
import { RepoInput } from './components/RepoInput';
import { Dashboard } from './components/Dashboard';
import { AnalysisLoader } from './components/AnalysisLoader';
import { AnalysisState, RepoContext, AnalysisResult } from './types';
import { fetchRepoData, parseRepoUrl } from './services/github';
import { analyzeRepoWithGemini } from './services/gemini';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>(AnalysisState.IDLE);
  const [repoData, setRepoData] = useState<RepoContext | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Loading state
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLoadingLogs(prev => [...prev, msg]);
  };

  const handleAnalyze = async (url: string, token: string) => {
    try {
      setError(null);
      setLoadingLogs([]);
      setLoadingStep(0);
      setState(AnalysisState.FETCHING_REPO);

      const parsed = parseRepoUrl(url);
      if (!parsed) {
        throw new Error('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
      }
      
      addLog(`Target confirmed: ${parsed.owner}/${parsed.repo}`);
      
      // Step 1: Data Extraction
      setLoadingStep(1);
      // Pass the addLog callback to fetchRepoData
      const data = await fetchRepoData(parsed.owner, parsed.repo, token, addLog);
      setRepoData(data);

      // Step 2: Context Optimization (Brief delay for visual pacing)
      setLoadingStep(2);
      addLog(`Compiling ${data.files.length} files into context window...`);
      addLog(`Optimizing token usage for Gemini 2.5 Flash...`);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 3: AI Analysis
      setLoadingStep(3);
      setState(AnalysisState.ANALYZING_AI);
      addLog("Transmitting context to Gemini...");
      addLog("Generating performance score and roadmap...");
      
      const result = await analyzeRepoWithGemini(data);
      addLog("Analysis complete. Rendering dashboard...");
      setAnalysis(result);

      setState(AnalysisState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setState(AnalysisState.ERROR);
    }
  };

  const reset = () => {
    setState(AnalysisState.IDLE);
    setRepoData(null);
    setAnalysis(null);
    setError(null);
    setLoadingStep(0);
    setLoadingLogs([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      {/* Navbar/Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white font-mono">
              RM
            </div>
            <span className="font-bold text-lg tracking-tight">RepoMirror<span className="text-blue-500">.ai</span></span>
          </div>
          <div className="text-xs font-mono text-slate-500">
             Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main>
        {state === AnalysisState.IDLE && (
          <RepoInput onAnalyze={handleAnalyze} loading={false} />
        )}

        {(state === AnalysisState.FETCHING_REPO || state === AnalysisState.ANALYZING_AI) && (
          <AnalysisLoader currentStep={loadingStep} logs={loadingLogs} />
        )}

        {state === AnalysisState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
             <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 max-w-md w-full text-center">
                <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                <p className="text-red-200 mb-6">{error}</p>
                <div className="bg-slate-950 rounded p-3 text-left font-mono text-xs text-slate-400 mb-6 overflow-auto max-h-32 border border-slate-800">
                   {loadingLogs.map((log, i) => <div key={i}>{log}</div>)}
                   <div className="text-red-400 mt-1">Error: {error}</div>
                </div>
                <button 
                  onClick={reset}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Try Again
                </button>
             </div>
          </div>
        )}

        {state === AnalysisState.COMPLETE && repoData && analysis && (
          <Dashboard repo={repoData} analysis={analysis} onReset={reset} />
        )}
      </main>
    </div>
  );
};

export default App;