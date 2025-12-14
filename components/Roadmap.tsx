import React, { useState } from 'react';
import { RoadmapItem } from '../types';
import { Filter } from 'lucide-react';

interface RoadmapProps {
  roadmap: RoadmapItem[];
}

export const Roadmap: React.FC<RoadmapProps> = ({ roadmap }) => {
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const filteredItems = roadmap.filter(item => filter === 'All' || item.priority === filter);

  const getPriorityStyles = (p: string) => {
    switch (p) {
      case 'High': return {
        badge: 'text-red-300 bg-red-500/10 border-red-500/20',
        border: 'group-hover:border-red-500/50',
        indicator: 'bg-red-500'
      };
      case 'Medium': return {
        badge: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
        border: 'group-hover:border-amber-500/50',
        indicator: 'bg-amber-500'
      };
      case 'Low': return {
        badge: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
        border: 'group-hover:border-blue-500/50',
        indicator: 'bg-blue-500'
      };
      default: return {
        badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
        border: 'group-hover:border-slate-500/50',
        indicator: 'bg-slate-500'
      };
    }
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4 overflow-x-auto">
        <Filter size={14} className="text-slate-500 mr-2 shrink-0" />
        {(['All', 'High', 'Medium', 'Low'] as const).map(f => (
            <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border shrink-0 ${
                    filter === f 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-105' 
                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200'
                }`}
            >
                {f}
            </button>
        ))}
      </div>

      <div className="space-y-0 min-h-[300px]">
        {filteredItems.length === 0 && (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 animate-in fade-in zoom-in-95 duration-300">
                <p className="text-slate-500 text-sm">No actionable items found for this priority level.</p>
                <button 
                  onClick={() => setFilter('All')}
                  className="mt-3 text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  View All
                </button>
            </div>
        )}
        
        {filteredItems.map((item, index) => {
          const styles = getPriorityStyles(item.priority);
          // Key needs to include filter to trigger fresh animation on list changes
          const key = `${filter}-${item.title}-${index}`; 
          
          return (
            <div key={key} className="flex gap-6 group relative animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both" style={{ animationDelay: `${index * 50}ms` }}>
               {/* Connector Line - Only show if not last item in the *current filtered list* */}
               {index < filteredItems.length - 1 && (
                  <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors"></div>
               )}

               <div className="flex flex-col items-center pt-1 relative z-10">
                  <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-slate-500 transition-all shadow-lg overflow-hidden`}>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${styles.indicator}`}></div>
                    <span className="text-sm font-bold font-mono text-slate-500 group-hover:text-white transition-colors relative z-10">
                      {index + 1}
                    </span>
                  </div>
               </div>
               
               <div className="flex-1 pb-8">
                  <div className={`bg-slate-800/40 p-6 rounded-xl border border-slate-700/50 transition-all duration-300 hover:bg-slate-800/60 hover:shadow-xl hover:-translate-y-1 ${styles.border}`}>
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                          <h4 className="text-lg font-bold text-slate-100 group-hover:text-blue-200 transition-colors">{item.title}</h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${styles.badge}`}>
                            {item.priority}
                          </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                              {item.category.toUpperCase()}
                          </span>
                      </div>
                  </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};