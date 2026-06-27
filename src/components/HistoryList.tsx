import React from 'react';
import { FileText, Calendar, Trash2, ArrowRight, TrendingUp, HelpCircle } from 'lucide-react';
import { ScanHistoryItem } from '../types';

interface HistoryListProps {
  history: ScanHistoryItem[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
}

export default function HistoryList({
  history,
  onSelect,
  onDelete,
  isDark
}: HistoryListProps) {
  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20';
    if (score >= 50) return 'bg-amber-500/15 text-amber-500 border-amber-500/20';
    return 'bg-rose-500/15 text-rose-500 border-rose-500/20';
  };

  if (history.length === 0) {
    return (
      <div className={`p-12 text-center rounded-2xl border ${
        isDark ? 'bg-[#111114] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}>
        <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-3.5" />
        <h4 className="font-bold text-sm">No Crawl Scan History Found</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Perform your very first website crawl scan above to populate your database and trigger the AI Recommendation Engine.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="h-4 w-4 text-indigo-400" />
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Crawl Scan Archives</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            id={`history-card-${item.id}`}
            className={`p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all hover:scale-[1.01] ${
              isDark ? 'bg-[#111114] border-slate-800 hover:border-slate-750' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="space-y-1 w-2/3">
              <span className="text-[9px] text-slate-400 font-mono tracking-wider block">ID: {item.id}</span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{item.url}</h4>
              
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <span>• {item.issuesCount} Issues</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className={`px-2.5 py-1 text-xs rounded-lg font-black border flex flex-col items-center justify-center min-w-[50px] ${getScoreBg(item.score)}`}>
                <span className="text-[10px] uppercase font-bold opacity-75">Score</span>
                <span>{item.score}%</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <button
                  id={`history-view-btn-${item.id}`}
                  onClick={() => onSelect(item.id)}
                  className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                  title="View Audit Report Dashboard"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  id={`history-delete-btn-${item.id}`}
                  onClick={() => onDelete(item.id)}
                  className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Delete Audit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
