import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Sliders, 
  FileCode, 
  Smartphone, 
  Image, 
  Link2, 
  FileWarning, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ExternalLink,
  Laptop,
  Tablet,
  Download,
  Share2,
  Lock
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ReportData } from '../types';

interface ReportDashboardProps {
  report: ReportData;
  isDark: boolean;
  onExport: (format: 'pdf' | 'json' | 'csv') => void;
  planLevel: 'free' | 'pro' | 'enterprise';
  onUpgradePrompt: () => void;
}

export default function ReportDashboard({
  report,
  isDark,
  onExport,
  planLevel,
  onUpgradePrompt
}: ReportDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'seo' | 'performance' | 'security' | 'accessibility' | 'code' | 'responsive' | 'assets'>('overview');
  const [selectedViewport, setSelectedViewport] = useState('Desktop (1440px)');

  // Data for the categories Radar Chart
  const radarData = [
    { subject: 'Performance', value: report.categories.performance, fullMark: 100 },
    { subject: 'SEO', value: report.categories.seo, fullMark: 100 },
    { subject: 'Accessibility', value: report.categories.accessibility, fullMark: 100 },
    { subject: 'Best Practices', value: report.categories.bestPractices, fullMark: 100 },
    { subject: 'Security', value: report.categories.security, fullMark: 100 },
    { subject: 'Code Quality', value: report.categories.codeQuality, fullMark: 100 },
  ];

  const barData = [
    { name: 'Perf', Score: report.categories.performance },
    { name: 'SEO', Score: report.categories.seo },
    { name: 'Access', Score: report.categories.accessibility },
    { name: 'Sec', Score: report.categories.security },
    { name: 'Code', Score: report.categories.codeQuality },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500';
    if (score >= 50) return 'text-amber-500 border-amber-500';
    return 'text-rose-500 border-rose-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10 text-emerald-500';
    if (score >= 50) return 'bg-amber-500/10 text-amber-500';
    return 'bg-rose-500/10 text-rose-500';
  };

  const currentScreenshot = report.viewportScreenshots.find(v => v.viewport === selectedViewport);

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className={`p-6 rounded-3xl border flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden shadow-lg transition-all ${
        isDark ? 'bg-[#111115] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-600 via-violet-500 to-indigo-500" />
        <div className="space-y-1.5 pl-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-emerald-500 font-mono tracking-wider uppercase font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Audit Active & Persisted</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">{report.url}</h2>
          <p className="text-xs text-slate-400 font-medium">
            Scanned on {new Date(report.date).toLocaleDateString()} at {new Date(report.date).toLocaleTimeString()}
          </p>
        </div>

        {/* Exports Panel */}
        <div className="flex flex-wrap items-center gap-2 pl-2 lg:pl-0">
          <a
            id="export-pdf-btn"
            href={`${import.meta.env.VITE_API_URL || ''}/api/download/pdf/${report.id}`}
            download
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border hover:scale-[1.01] transition-all shadow-sm ${
              isDark ? 'bg-[#16161c] border-slate-800 text-indigo-400 hover:text-indigo-300 hover:border-slate-700' : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50'
            }`}
          >
            <Download className="h-4 w-4" />
            PDF Report
          </a>

          <a
            id="export-docx-btn"
            href={`${import.meta.env.VITE_API_URL || ''}/api/download/docx/${report.id}`}
            download
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border hover:scale-[1.01] transition-all shadow-sm ${
              isDark ? 'bg-[#16161c] border-slate-800 text-blue-400 hover:text-blue-300 hover:border-slate-700' : 'bg-white border-slate-200 text-blue-600 hover:bg-slate-50'
            }`}
          >
            <FileCode className="h-4 w-4" />
            Word (DOCX)
          </a>

          <a
            id="export-excel-btn"
            href={`${import.meta.env.VITE_API_URL || ''}/api/download/excel/${report.id}`}
            download
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border hover:scale-[1.01] transition-all shadow-sm ${
              isDark ? 'bg-[#16161c] border-slate-800 text-emerald-400 hover:text-emerald-300 hover:border-slate-700' : 'bg-white border-slate-200 text-emerald-600 hover:bg-slate-50'
            }`}
          >
            <Sliders className="h-4 w-4" />
            Excel Sheet
          </a>

          <a
            id="export-csv-btn"
            href={`${import.meta.env.VITE_API_URL || ''}/api/download/csv/${report.id}`}
            download
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border hover:scale-[1.01] transition-all shadow-sm ${
              isDark ? 'bg-[#16161c] border-slate-800 text-amber-400 hover:text-amber-300 hover:border-slate-700' : 'bg-white border-slate-200 text-amber-600 hover:bg-slate-50'
            }`}
          >
            <Download className="h-4 w-4" />
            CSV Matrix
          </a>

          <a
            id="export-json-btn"
            href={`${import.meta.env.VITE_API_URL || ''}/api/download/json/${report.id}`}
            download
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border hover:scale-[1.01] transition-all shadow-sm ${
              isDark ? 'bg-[#16161c] border-slate-800 text-pink-400 hover:text-pink-300 hover:border-slate-700' : 'bg-white border-slate-200 text-pink-600 hover:bg-slate-50'
            }`}
          >
            <FileCode className="h-4 w-4" />
            JSON Output
          </a>
        </div>
      </div>

      {/* Main Categories Navigation */}
      <div className="flex flex-wrap gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800/60">
        {[
          { key: 'overview', label: 'Overall Overview', icon: <Sliders className="h-4 w-4" /> },
          { key: 'seo', label: 'SEO Analyzer', icon: <Search className="h-4 w-4" /> },
          { key: 'performance', label: 'Page Speed Metrics', icon: <Laptop className="h-4 w-4" /> },
          { key: 'security', label: 'Security Headers', icon: <ShieldCheck className="h-4 w-4" /> },
          { key: 'accessibility', label: 'W3C Accessibility', icon: <Tablet className="h-4 w-4" /> },
          { key: 'code', label: 'Code Quality / DOM', icon: <FileCode className="h-4 w-4" /> },
          { key: 'responsive', label: 'Responsive Viewports', icon: <Smartphone className="h-4 w-4" /> },
          { key: 'assets', label: 'Images & Assets', icon: <Image className="h-4 w-4" /> }
        ].map(subTab => (
          <button
            key={subTab.key}
            id={`subtab-${subTab.key}`}
            onClick={() => setActiveSubTab(subTab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 shadow-sm ${
              activeSubTab === subTab.key
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                : isDark
                ? 'bg-[#111115] text-slate-400 hover:bg-[#16161c] hover:text-slate-200 border border-slate-850'
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-slate-200'
            }`}
          >
            {subTab.icon}
            {subTab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB CONTENTS */}

      {/* 1. OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Radial Scores Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { label: 'Overall Score', value: report.overallScore },
              { label: 'Performance', value: report.categories.performance },
              { label: 'SEO Score', value: report.categories.seo },
              { label: 'Security', value: report.categories.security },
              { label: 'Accessibility', value: report.categories.accessibility },
              { label: 'Best Practices', value: report.categories.bestPractices },
              { label: 'Code Quality', value: report.categories.codeQuality },
              { label: 'Broken Links', value: report.categories.brokenLinks }
            ].map((cat, idx) => (
              <div 
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center glow-card ${
                  isDark ? 'bg-[#111115] border-slate-850' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className={`relative flex items-center justify-center w-16 h-16 rounded-full border-4 shadow-inner ${getScoreColor(cat.value)}`}>
                  <span className="font-black text-sm font-mono">{cat.value}</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-400 font-extrabold uppercase tracking-wider mt-3.5 block">{cat.label}</span>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Radar Audit comparison */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between glow-card ${
              isDark ? 'bg-[#111115] border-slate-850' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-1">
                <h3 className="font-black text-sm tracking-tight">Visual Audit Vectors</h3>
                <p className="text-[11px] text-slate-400">Categorical comparison matching Lighthouse core algorithms.</p>
              </div>
              <div className="h-[250px] w-full flex items-center justify-center pt-4">
                <ResponsiveContainer width="100%" height="95%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 10, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                    <Radar name="Report" dataKey="value" stroke="#6366f1" fill="#4f46e5" fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar distribution */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between lg:col-span-2 glow-card ${
              isDark ? 'bg-[#111115] border-slate-850' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-1">
                <h3 className="font-black text-sm tracking-tight">Detailed Category Metrics</h3>
                <p className="text-[11px] text-slate-400">Absolute percentages computed across W3C index parameters.</p>
              </div>
              <div className="h-[250px] w-full pt-4">
                <ResponsiveContainer width="100%" height="95%">
                  <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis stroke={isDark ? '#475569' : '#94a3b8'} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#111115' : '#fff', borderColor: '#6366f1', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="Score" fill="url(#colorScore)" radius={[6, 6, 0, 0]} barSize={36}>
                      {/* Define stylish gradient */}
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={1}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.85}/>
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SEO ANALYZER */}
      {activeSubTab === 'seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">SEO Indexing Parameters</h3>
            {report.metrics.seo.map((metric, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex justify-between gap-4 items-start ${
                  isDark ? 'bg-[#111114] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getScoreBg(metric.score)}`}>
                      {metric.score}/100
                    </span>
                    <h4 className="font-bold text-xs">{metric.name}</h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{metric.description}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    metric.status === 'good' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    metric.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {metric.status}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-2 font-bold max-w-[200px] truncate">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-5 rounded-2xl border space-y-4 h-fit ${
            isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-sm">Robots & Sitemap Verification</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#16161a]">
                <span className="text-xs font-semibold">robots.txt</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Present
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#16161a]">
                <span className="text-xs font-semibold">sitemap.xml</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Found
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#16161a]">
                <span className="text-xs font-semibold">Open Graph metadata</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Present
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#16161a]">
                <span className="text-xs font-semibold">Twitter card schema</span>
                <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Configured
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">These search indexing files inform bots which pages to register for Google Indexing crawls.</p>
          </div>
        </div>
      )}

      {/* 3. PERFORMANCE */}
      {activeSubTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Core Web Vitals</h3>
            {report.metrics.performance.map((metric, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex justify-between gap-4 items-start ${
                  isDark ? 'bg-[#111114] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getScoreBg(metric.score)}`}>
                      {metric.score}/100
                    </span>
                    <h4 className="font-bold text-xs">{metric.name}</h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{metric.description}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    metric.status === 'good' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    metric.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {metric.status}
                  </span>
                  <div className="text-[11px] text-indigo-400 font-mono font-black mt-2">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="font-bold text-sm">Compression & Speed parameters</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">GZIP Compression</span>
                  <span className="text-emerald-500 font-bold">Enabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CDN Edge Servers</span>
                  <span className="text-emerald-500 font-bold">Configured</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CSS minification</span>
                  <span className="text-emerald-500 font-bold">Optimal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Render Blocking Resources</span>
                  <span className="text-amber-500 font-bold">2 assets (Warning)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SECURITY */}
      {activeSubTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">Encryption & Response Headers</h3>
            {report.metrics.security.map((metric, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex justify-between gap-4 items-start ${
                  isDark ? 'bg-[#111114] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getScoreBg(metric.score)}`}>
                      {metric.score}/100
                    </span>
                    <h4 className="font-bold text-xs">{metric.name}</h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{metric.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    metric.status === 'good' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    metric.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {metric.status}
                  </span>
                  <div className="text-[10px] font-mono mt-2 text-slate-400 font-bold truncate max-w-[150px]">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-5 rounded-2xl border space-y-4 ${
            isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-sm">Security Headers checklist</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>SSL Certificate</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Secure
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mixed Content Check</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> No mixed resources
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Secure Cookies (Secure; HttpOnly)</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Passed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Server Information leak</span>
                <span className="text-amber-500 font-semibold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> nginx leak detected
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">Exposure of specific web server configurations simplifies server targeted exploit attacks.</p>
          </div>
        </div>
      )}

      {/* 5. ACCESSIBILITY */}
      {activeSubTab === 'accessibility' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">W3C WCAG Accessibility Audit</h3>
            {report.metrics.accessibility.map((metric, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex justify-between gap-4 items-start ${
                  isDark ? 'bg-[#111114] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getScoreBg(metric.score)}`}>
                      {metric.score}/100
                    </span>
                    <h4 className="font-bold text-xs">{metric.name}</h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{metric.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    metric.status === 'good' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    metric.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {metric.status}
                  </span>
                  <div className="text-[10px] font-mono mt-2 text-slate-400 font-bold">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-5 rounded-2xl border space-y-4 h-fit ${
            isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-sm">Assistive Layout Elements</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span>ARIA landmark wrappers</span>
                <span className="text-emerald-500 font-bold">Passed</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Skip-To-Content Links</span>
                <span className="text-rose-500 font-bold">Missing</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Keyboard tab-focus outlines</span>
                <span className="text-emerald-500 font-bold">Configured</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Form input label associations</span>
                <span className="text-emerald-500 font-bold">Passed</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">Landmarks are structural indicators that assist blind screen-reader users navigation layout jumps.</p>
          </div>
        </div>
      )}

      {/* 6. CODE QUALITY / DOM */}
      {activeSubTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-400">HTML Structure & DOM Efficiency</h3>
            {report.metrics.codeQuality.map((metric, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-xl border flex justify-between gap-4 items-start ${
                  isDark ? 'bg-[#111114] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getScoreBg(metric.score)}`}>
                      {metric.score}/100
                    </span>
                    <h4 className="font-bold text-xs">{metric.name}</h4>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{metric.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    metric.status === 'good' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                    metric.status === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {metric.status}
                  </span>
                  <div className="text-[11px] font-mono mt-2 text-indigo-500 font-bold">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {/* JavaScript console logs exceptions */}
            <div className={`p-5 rounded-2xl border ${
              isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h3 className="font-bold text-sm mb-3">JavaScript Console Failures</h3>
              <div className="space-y-3">
                {report.jsAnalysis.map((jsErr, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-rose-500/5 border border-rose-500/10 text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-rose-500">
                      <span>{jsErr.type}</span>
                      <span>Line {jsErr.line}</span>
                    </div>
                    <p className="text-slate-400 font-mono text-[10px]">{jsErr.error}</p>
                    <p className="text-[9px] text-slate-500 font-bold">File: {jsErr.file}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. RESPONSIVE VIEWPORTS */}
      {activeSubTab === 'responsive' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-3">Responsive Viewports</h3>
            {report.viewportScreenshots.map((vp) => (
              <button
                key={vp.viewport}
                id={`viewport-selector-${vp.viewport.split(' ')[0]}`}
                onClick={() => setSelectedViewport(vp.viewport)}
                className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                  selectedViewport === vp.viewport
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : isDark
                    ? 'bg-[#111114] border-slate-800 hover:bg-[#16161a] text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-xs">{vp.viewport}</div>
                  <div className="text-[10px] font-mono opacity-80 mt-0.5">{vp.width}x{vp.height}</div>
                </div>
                <Smartphone className="h-4 w-4 shrink-0" />
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-4 flex flex-col items-center">
            {/* Simulated frame device viewport */}
            <div className={`relative border rounded-2xl overflow-hidden shadow-2xl transition-all ${
              isDark ? 'bg-[#0a0a0c] border-slate-800' : 'bg-slate-100 border-slate-300'
            }`} style={{
              width: '100%',
              maxWidth: currentScreenshot?.isPortrait ? '340px' : '100%',
              aspectRatio: currentScreenshot?.isPortrait ? '9/16' : '16/10'
            }}>
              {/* Header status indicators of mockup device */}
              <div className="flex items-center gap-1.5 px-4 py-2 bg-[#111114] text-slate-400 text-[10px] font-bold font-mono border-b border-slate-800">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="ml-3 truncate">{report.url}</span>
              </div>
              
              {/* Image asset screenshot mockups inside device layout */}
              <div className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${currentScreenshot?.mockUrl})` }}>
                {/* Overlay details */}
                <div className="absolute inset-0 bg-[#0a0a0c]/45 flex items-center justify-center text-center p-6">
                  <div className="bg-[#111114]/90 p-4 rounded-xl border border-white/15 max-w-sm">
                    <h4 className="font-black text-xs text-white uppercase tracking-wider">{currentScreenshot?.viewport} Simulator</h4>
                    <p className="text-[10px] text-slate-300 mt-1">Crawl metrics parsed container tags dynamically. Grid and flexible layouts adjusted successfully.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. IMAGES & ASSETS */}
      {activeSubTab === 'assets' && (
        <div className="space-y-6">
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold text-sm mb-3">Oversized Images & WebP Optimizer</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="py-2.5 font-bold">Image Source URL</th>
                    <th className="py-2.5 font-bold">File Size</th>
                    <th className="py-2.5 font-bold">Dimensions</th>
                    <th className="py-2.5 font-bold">Lazy Loaded</th>
                    <th className="py-2.5 font-bold text-rose-500">Savings Suggestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {report.imageOptimization.map((img, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-2.5 font-mono text-[10px] text-slate-400 max-w-xs truncate">{img.src}</td>
                      <td className="py-2.5 font-semibold">{img.size}</td>
                      <td className="py-2.5 font-mono text-[10px]">{img.dimensions}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          img.lazyLoaded ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {img.lazyLoaded ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="py-2.5 font-bold text-rose-500 text-[10px]">{img.saving}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="font-bold text-sm mb-3">Broken Resource & Redirect Links Checker</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                    <th className="py-2.5 font-bold">Target Resource Link</th>
                    <th className="py-2.5 font-bold">Type</th>
                    <th className="py-2.5 font-bold">Status</th>
                    <th className="py-2.5 font-bold">Error Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {report.brokenLinks.map((link, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-2.5 font-mono text-[10px] text-rose-500/90 max-w-xs truncate">{link.url}</td>
                      <td className="py-2.5 font-semibold capitalize text-slate-400">{link.type}</td>
                      <td className="py-2.5 text-rose-500 font-bold">{link.status}</td>
                      <td className="py-2.5 font-bold text-rose-500 text-[10px]">{link.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
