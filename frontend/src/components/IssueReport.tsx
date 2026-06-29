import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  ExternalLink, 
  HelpCircle,
  FileCode,
  Sliders,
  Terminal,
  Zap,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import { AIRecommendation, CodeIssue } from '../types';

interface IssueReportProps {
  recommendations: AIRecommendation[];
  lineByLine: CodeIssue[];
  isDark: boolean;
  onOptimizeWithAi: (issueId: string) => void;
}

interface StandardIssue {
  id: string;
  title: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedUrl: string;
  fileName?: string;
  lineNumber?: number;
  suggestedFix: string;
  currentCode?: string;
  correctCode?: string;
  docLink: string;
  scoreImpact: number;
  isAiRecommendation: boolean;
}

export default function IssueReport({
  recommendations,
  lineByLine,
  isDark,
  onOptimizeWithAi
}: IssueReportProps) {
  // Filters & State Managers
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('impact-desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [fixedIds, setFixedIds] = useState<Set<string>>(new Set());
  const [fixingId, setFixingId] = useState<string | null>(null);

  // Normalize all code errors and AI recommendations into a single database schema
  const unifiedIssues = useMemo(() => {
    const list: StandardIssue[] = [];

    // Map AI recommendations
    recommendations.forEach((rec) => {
      list.push({
        id: rec.id,
        title: rec.problem,
        category: rec.category,
        severity: rec.severity as any,
        description: rec.whyItMatters,
        affectedUrl: 'Entire Site Layout',
        fileName: 'index.html',
        suggestedFix: rec.howToFix,
        currentCode: rec.exampleCode.current,
        correctCode: rec.exampleCode.correct,
        docLink: rec.referenceDocs,
        scoreImpact: rec.scoreImpact,
        isAiRecommendation: true
      });
    });

    // Map Line-by-Line code issues
    lineByLine.forEach((issue, idx) => {
      list.push({
        id: `line-issue-${idx}`,
        title: issue.error,
        category: issue.type === 'html' ? 'HTML Semantics' : issue.type === 'css' ? 'CSS Layout' : 'JS Code Quality',
        severity: (issue.severity === 'high' ? 'high' : issue.severity === 'medium' ? 'medium' : 'low') as any,
        description: `Code statement on line ${issue.lineNumber} does not comply with strict standard practices.`,
        affectedUrl: issue.url,
        fileName: issue.fileName,
        lineNumber: issue.lineNumber,
        suggestedFix: `Replace code on line ${issue.lineNumber} with the corrected version to conform to standard best practices.`,
        currentCode: issue.currentCode,
        correctCode: issue.correctCode,
        docLink: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        scoreImpact: issue.severity === 'high' ? 8 : issue.severity === 'medium' ? 5 : 2,
        isAiRecommendation: false
      });
    });

    return list;
  }, [recommendations, lineByLine]);

  // Compute stats counters
  const stats = useMemo(() => {
    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;

    unifiedIssues.forEach((issue) => {
      if (fixedIds.has(issue.id)) return;
      if (issue.severity === 'critical') critical++;
      else if (issue.severity === 'high') high++;
      else if (issue.severity === 'medium') medium++;
      else low++;
    });

    return { total: unifiedIssues.length - fixedIds.size, critical, high, medium, low };
  }, [unifiedIssues, fixedIds]);

  // Handle Search, Filtering, and Sorting logic
  const processedIssues = useMemo(() => {
    let items = [...unifiedIssues];

    // Search filter
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.fileName && item.fileName.toLowerCase().includes(q))
      );
    }

    // Severity filter
    if (severityFilter !== 'all') {
      items = items.filter((item) => item.severity === severityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      items = items.filter((item) => item.category.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    // Sort order
    items.sort((a, b) => {
      if (sortOrder === 'impact-desc') {
        return b.scoreImpact - a.scoreImpact;
      }
      if (sortOrder === 'severity-desc') {
        const priorityMap = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityMap[b.severity] - priorityMap[a.severity];
      }
      if (sortOrder === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return items;
  }, [unifiedIssues, searchTerm, severityFilter, categoryFilter, sortOrder]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFixWithAi = (id: string) => {
    setFixingId(id);
    onOptimizeWithAi(id);
    
    // Simulate real-time resolution update after short animation
    setTimeout(() => {
      setFixedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setFixingId(null);
      if (expandedId === id) {
        setExpandedId(null);
      }
    }, 1500);
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'} text-center`}>
          <span className="text-xl md:text-2xl font-black text-indigo-500">{stats.total}</span>
          <span className="text-[10px] text-slate-400 block font-bold uppercase mt-1">Remaining Issues</span>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'} text-center`}>
          <span className="text-xl md:text-2xl font-black text-rose-500">{stats.critical}</span>
          <span className="text-[10px] text-slate-400 block font-bold uppercase mt-1">Critical Warnings</span>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'} text-center`}>
          <span className="text-xl md:text-2xl font-black text-orange-500">{stats.high}</span>
          <span className="text-[10px] text-slate-400 block font-bold uppercase mt-1">High Severity</span>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'} text-center`}>
          <span className="text-xl md:text-2xl font-black text-amber-500">{stats.medium}</span>
          <span className="text-[10px] text-slate-400 block font-bold uppercase mt-1">Medium Severity</span>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'} text-center col-span-2 md:col-span-1`}>
          <span className="text-xl md:text-2xl font-black text-slate-400">{stats.low}</span>
          <span className="text-[10px] text-slate-400 block font-bold uppercase mt-1">Low Severity</span>
        </div>
      </div>

      {/* 2. Interactive Search & Filtering Controls */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row gap-3 items-center justify-between ${
        isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search problems, file names, elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-1.5 pl-9 pr-4 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border ${
              isDark ? 'bg-[#16161a] border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
        </div>

        {/* Filters and sorting dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Severity Dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 border ${
                isDark ? 'bg-[#16161a] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">All Severities</option>
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">⚪ Low</option>
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 border ${
                isDark ? 'bg-[#16161a] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              <option value="all">All Categories</option>
              <option value="performance">Performance</option>
              <option value="seo">SEO</option>
              <option value="security">Security</option>
              <option value="accessibility">Accessibility Compliance</option>
              <option value="codeQuality">Code Quality & DOM</option>
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 border ${
                isDark ? 'bg-[#16161a] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              <option value="impact-desc">💥 Highest Score Impact</option>
              <option value="severity-desc">🚨 Highest Severity First</option>
              <option value="title-asc">🔤 Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Issue Listings Table */}
      <div className={`border rounded-xl overflow-hidden ${
        isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b text-slate-400 font-bold uppercase tracking-wider text-[10px] ${
                isDark ? 'bg-slate-800/10 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <th className="py-3 px-4 text-center w-12">Status</th>
                <th className="py-3 px-4">Detected Issue Description</th>
                <th className="py-3 px-4 w-40">Diagnostic Category</th>
                <th className="py-3 px-4 w-28 text-center">Severity</th>
                <th className="py-3 px-4 w-36">Affected Code Location</th>
                <th className="py-3 px-4 w-12 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {processedIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                    No matching diagnostic issues or errors found for your search filters.
                  </td>
                </tr>
              ) : (
                processedIssues.map((issue) => {
                  const isExpanded = expandedId === issue.id;
                  const isFixed = fixedIds.has(issue.id);

                  return (
                    <React.Fragment key={issue.id}>
                      {/* Main summary row */}
                      <tr 
                        onClick={() => toggleExpand(issue.id)}
                        className={`cursor-pointer transition-colors group ${
                          isExpanded 
                            ? isDark ? 'bg-indigo-600/5' : 'bg-indigo-50/20' 
                            : isDark ? 'hover:bg-slate-800/20' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        {/* Status Checkbox */}
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center">
                            {isFixed ? (
                              <CheckCircle className="h-4 w-4 text-emerald-500" title="Fixed successfully" />
                            ) : (
                              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" title="Active issue" />
                            )}
                          </div>
                        </td>

                        {/* Title & Description preview */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">
                            {issue.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {issue.description}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 font-semibold text-slate-400 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            {issue.isAiRecommendation ? <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" /> : <Terminal className="h-3 w-3 text-slate-500 shrink-0" />}
                            {issue.category}
                          </span>
                        </td>

                        {/* Severity Badge */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getSeverityStyle(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </td>

                        {/* File Identifier / Location */}
                        <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400">
                          {issue.fileName ? (
                            <span className="font-semibold block truncate">
                              {issue.fileName}
                              {issue.lineNumber && <span className="text-rose-500 ml-1 font-bold">:{issue.lineNumber}</span>}
                            </span>
                          ) : (
                            <span className="text-slate-500">Global Structural</span>
                          )}
                        </td>

                        {/* Expand Trigger Button */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex justify-center text-slate-400 group-hover:text-slate-200">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Rich Details Drawer */}
                      {isExpanded && (
                        <tr className={isDark ? 'bg-slate-900/30' : 'bg-slate-50/30'}>
                          <td colSpan={6} className="py-5 px-6 border-b border-indigo-500/10">
                            <div className="space-y-4 animate-fade-in">
                              
                              {/* Metadata indicators */}
                              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 dark:border-slate-800/40 pb-3">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Diagnostic Analysis Details:</span>
                                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold">
                                  Score Impact: -{issue.scoreImpact} Score Points
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  Affected URL Resource: <span className="underline">{issue.affectedUrl}</span>
                                </span>
                              </div>

                              {/* Dual Column Layout: Why it matters vs Suggested Fix */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Problem Description & Why It Matters</h4>
                                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                    {issue.description}
                                  </p>
                                </div>

                                <div className="space-y-1.5">
                                  <h4 className="font-extrabold text-xs text-emerald-500 uppercase tracking-wider">How to Fix & Remediate Correctly</h4>
                                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                    {issue.suggestedFix}
                                  </p>
                                </div>
                              </div>

                              {/* Before & After Code Panels (Only render if codes are available) */}
                              {issue.currentCode && issue.correctCode && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                                  {/* Current code snippet block */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-rose-500 uppercase tracking-widest font-black block">Identified Faulty Code Block</span>
                                    <pre className="p-3.5 rounded-lg font-mono text-[10.5px] bg-[#0a0a0c] text-rose-400 border border-rose-500/15 overflow-x-auto max-h-[160px]">
                                      <code>{issue.currentCode}</code>
                                    </pre>
                                  </div>

                                  {/* Refactored corrected block */}
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-emerald-500 uppercase tracking-widest font-black block">Suggested Refactored Code</span>
                                    <pre className="p-3.5 rounded-lg font-mono text-[10.5px] bg-[#0a0a0c] text-emerald-400 border border-emerald-500/15 overflow-x-auto max-h-[160px]">
                                      <code>{issue.correctCode}</code>
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {/* Interactive Actions row */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                                <a 
                                  href={issue.docLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-400 hover:underline inline-flex items-center gap-1 text-xs font-semibold"
                                >
                                  <HelpCircle className="h-4 w-4 shrink-0" />
                                  Review W3C Compliance Documentation
                                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                                </a>

                                <button
                                  onClick={() => handleFixWithAi(issue.id)}
                                  disabled={fixingId !== null || isFixed}
                                  className={`px-4 py-1.5 rounded-lg font-bold transition-all inline-flex items-center gap-1.5 text-xs shadow-md cursor-pointer ${
                                    isFixed 
                                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-none' 
                                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/15 disabled:opacity-50'
                                  }`}
                                >
                                  {isFixed ? (
                                    <>
                                      <CheckCircle className="h-3.5 w-3.5" />
                                      Refactored with Aditya
                                    </>
                                  ) : (
                                    <>
                                      <Zap className={`h-3.5 w-3.5 ${fixingId === issue.id ? 'animate-bounce' : ''}`} />
                                      {fixingId === issue.id ? 'Refactoring Code Layout...' : 'Fix Code with Aditya'}
                                    </>
                                  )}
                                </button>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
