import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  RefreshCw, 
  History, 
  ShieldAlert, 
  User as UserIcon, 
  LogOut, 
  Sun, 
  Moon, 
  Sliders, 
  Terminal, 
  CheckCircle, 
  Zap, 
  Lock, 
  AlertTriangle,
  Play,
  Pause,
  ArrowLeft,
  X,
  FileText,
  MapPin,
  Mail,
  Github,
  Globe,
  ExternalLink,
  Laptop,
  Code2
} from 'lucide-react';
import { ScanHistoryItem, ReportData, UserProfile } from './types';
import ReportDashboard from './components/ReportDashboard';
import IssueReport from './components/IssueReport';
import HistoryList from './components/HistoryList';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Theme & State managers
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<'scanner' | 'history' | 'admin'>('scanner');
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Scanning states
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [isScanPaused, setIsScanPaused] = useState(false);
  
  // Results & History datasets
  const [activeReport, setActiveReport] = useState<ReportData | null>(null);
  const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>([]);
  
  // Modals controllers
  const [errorMessage, setErrorMessage] = useState('');
  const [ownerImgLoaded, setOwnerImgLoaded] = useState(false);

  // Load profile and scan history archives on init
  useEffect(() => {
    // Check saved user
    const savedUser = localStorage.getItem('analyzer_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        setHistoryItems(await res.json());
      }
    } catch (err) {
      console.error('Failed to load history list', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('analyzer_user');
    localStorage.removeItem('analyzer_token');
    setCurrentUser(null);
    setActiveTab('scanner');
  };

  // Launch analysis crawling pipelines
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setErrorMessage('');
    setIsScanning(true);
    setScanProgress(5);
    setIsScanPaused(false);
    setScanStep('Initiating crawl connection & resolving URL...');

    // Progress counter animation simulation
    let progress = 5;
    const interval = setInterval(() => {
      // Allow pausing scan
      if (isScanPaused) return;

      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 98; // Hold at 98% until server returns report
      }
      setScanProgress(progress);

      // Dynamically rotate scanning descriptors
      if (progress < 20) {
        setScanStep('Parsing webpage structural tags & document elements...');
      } else if (progress < 45) {
        setScanStep('Measuring speed benchmarks & Core Web Vitals (FCP, LCP)...');
      } else if (progress < 65) {
        setScanStep('Evaluating HTTP secure response parameters (SSL, CSP, HSTS)...');
      } else if (progress < 85) {
        setScanStep('Calling Aditya recommending model for line-by-line solutions...');
      } else {
        setScanStep('Assembling audit matrices & exporting file parameters...');
      }
    }, 450);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput,
          userId: currentUser?.id || 'anonymous',
          email: currentUser?.email || 'anonymous@analyzer.com'
        })
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) {
        throw new Error(data.error || 'Website scan crawl failed');
      }

      setScanProgress(100);
      setTimeout(() => {
        setIsScanning(false);
        setActiveReport(data);
        fetchHistory();
      }, 500);

    } catch (err: any) {
      clearInterval(interval);
      setIsScanning(false);
      setErrorMessage(err.message || 'Crawl failed. Ensure the URL is valid.');
    }
  };

  // Delete scan history report
  const handleDeleteHistory = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setHistoryItems(prev => prev.filter(item => item.id !== id));
        if (activeReport?.id === id) {
          setActiveReport(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete report', err);
    }
  };

  // Select/load report from archives
  const handleSelectReport = async (id: string) => {
    try {
      const res = await fetch(`/api/report/${id}`);
      if (res.ok) {
        const report = await res.json();
        setActiveReport(report);
        setActiveTab('scanner');
      }
    } catch (err) {
      console.error('Failed to load report', err);
    }
  };

  // Export report generator files
  const handleExportReport = (format: 'pdf' | 'json' | 'csv') => {
    if (!activeReport) return;

    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeReport, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `website_audit_report_${activeReport.id}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'csv') {
      // Construct CSV details
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Category,Metric,Score,Value\n";
      
      activeReport.metrics.seo.forEach(m => {
        csvContent += `SEO,"${m.name}",${m.score},"${m.value}"\n`;
      });
      activeReport.metrics.performance.forEach(m => {
        csvContent += `Performance,"${m.name}",${m.score},"${m.value}"\n`;
      });
      activeReport.metrics.security.forEach(m => {
        csvContent += `Security,"${m.name}",${m.score},"${m.value}"\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", encodedUri);
      downloadAnchor.setAttribute("download", `website_audit_report_${activeReport.id}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      // Trigger browser printing window configured for PDF export layout
      window.print();
    }
  };

  const handleOptimizeWithAi = (issueId: string) => {
    console.log(`Live code refactored for recommendation: ${issueId}`);
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email.toLowerCase() === 'toadityakumarsahoo@gmail.com';

  return (
    <div className={`min-h-screen transition-all font-sans relative ${
      isDark ? 'bg-[#09090b] text-slate-100 ambient-grid' : 'bg-[#fafafa] text-slate-800 ambient-grid-light'
    }`}>
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[150px] -left-[100px] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute -top-[100px] right-0 w-[550px] h-[550px] rounded-full bg-violet-600/10 blur-[130px]" />
      </div>

      {/* Navigation Rail / Header bar */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all ${
        isDark ? 'bg-[#09090b]/80 border-slate-900' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 text-white relative">
              <Sparkles className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-emerald-400 rounded-full border-2 border-indigo-600" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight block bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">Vantage AI</span>
              <span className="text-[10px] text-slate-500 font-mono">Enterprise Audit Node v2.1</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 md:gap-3">
            <div className={`p-1 rounded-xl flex items-center ${isDark ? 'bg-slate-900/60' : 'bg-slate-100'}`}>
              {[
                { id: 'scanner', label: 'Scanner' },
                { id: 'history', label: 'History' },
                { id: 'admin', label: 'Monitor' }
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`nav-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-800/80 mx-1" />

            {/* Dark/Light mode switcher */}
            <button
              id="theme-toggle"
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-xl transition-all border ${
                isDark 
                  ? 'bg-slate-900/60 border-slate-850 text-yellow-400 hover:text-yellow-300 hover:bg-slate-800/45' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 shadow-sm'
              }`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              100% FREE NO LOGIN
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10 space-y-8">
        
        {/* TAB 1: CRAWLER SCANNER */}
        {activeTab === 'scanner' && (
          <div className="space-y-8">
            
            {/* Analyzer Search Module (Hidden when scanning or viewing results) */}
            {!isScanning && !activeReport && (
              <div className="text-center max-w-3xl mx-auto py-12 md:py-20 space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Fully Integrated AI Crawler
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 dark:from-white dark:via-indigo-100 dark:to-indigo-300 bg-clip-text text-transparent">
                    Enterprise-grade <br />
                    <span className="text-transparent bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text">Website Auditor</span>
                  </h1>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
                    Scan any public URL. Generate absolute performance metrics, line-by-line validation diagnostics, and refactored responsive viewport code blocks.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2.5 max-w-md mx-auto shadow-md">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span className="font-semibold text-left">{errorMessage}</span>
                  </div>
                )}

                {/* Input form */}
                <div className="max-w-xl mx-auto space-y-4">
                  <form onSubmit={handleAnalyze} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-15 group-hover:opacity-25 transition duration-300" />
                    <div className="relative w-full">
                      <input
                        id="analyzer-url-input"
                        type="text"
                        placeholder="https://example.com"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className={`w-full border rounded-full py-4 px-6 pr-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold transition-all ${
                          isDark 
                            ? 'bg-[#121214] border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500' 
                            : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-400 shadow-md'
                        }`}
                      />
                      <button
                        id="analyzer-submit-btn"
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-full text-xs font-bold flex items-center gap-2 text-white transition-all shadow-md shadow-indigo-500/10 cursor-pointer hover:scale-[1.02]"
                      >
                        <span>Analyze URL</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>

                  {/* Quick Preset Scan Suggestions */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Try Preset:</span>
                    {[
                      'https://react.dev',
                      'https://github.com',
                      'https://wikipedia.org'
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setUrlInput(preset)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                          isDark 
                            ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200' 
                            : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 shadow-sm'
                        }`}
                      >
                        {preset.replace('https://', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Benchmarks Logos */}
                <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-slate-400 dark:text-slate-500 text-[10px] font-mono tracking-widest font-black uppercase">
                  <span>Google Lighthouse</span> • <span>PageSpeed Insights</span> • <span>W3C Validator</span> • <span>SSL Checker</span>
                </div>
              </div>
            )}

            {/* SCANNING PROGRESS OVERLAY */}
            {isScanning && (
              <div className={`max-w-2xl mx-auto p-8 rounded-3xl border text-center space-y-8 shadow-2xl relative overflow-hidden scanline-overlay ${
                isDark ? 'bg-[#121215] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                {/* Visual Radar Indicator */}
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full mx-auto bg-indigo-500/5 border border-indigo-500/10 animate-pulse">
                  <div className="absolute inset-2 rounded-full border border-dashed border-indigo-500/30 animate-spin" style={{ animationDuration: '15s' }} />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 text-white flex items-center justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Active Real-Time Crawling</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Analyzing node hierarchy, validating HTTP secure parameters, measuring performance latency, and compiling Aditya recommendations.
                  </p>
                </div>

                {/* Progress bar container */}
                <div className="space-y-3.5 max-w-lg mx-auto">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-indigo-500 dark:text-indigo-400 font-mono tracking-wide">{scanStep}</span>
                    <span className="font-mono text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">{scanProgress}%</span>
                  </div>

                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-500 rounded-full transition-all duration-300 shadow-sm" 
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>

                {/* Scan Queue Controls */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    id="scan-pause-resume"
                    type="button"
                    onClick={() => setIsScanPaused(!isScanPaused)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border inline-flex items-center gap-1.5 transition-all shadow-sm ${
                      isDark ? 'bg-[#18181c] border-slate-800 hover:bg-slate-800 text-slate-200' : 'bg-slate-50 border-slate-250 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isScanPaused ? (
                      <>
                        <Play className="h-4 w-4 text-emerald-500" /> Resume Audit
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 text-amber-500 animate-pulse" /> Pause Crawl
                      </>
                    )}
                  </button>

                  <button
                    id="scan-cancel"
                    type="button"
                    onClick={() => setIsScanning(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-all shadow-sm"
                  >
                    Cancel Scan
                  </button>
                </div>
              </div>
            )}

            {/* AUDIT RESULTS DISCOVERY (Active Report loaded) */}
            {activeReport && !isScanning && (
              <div className="space-y-8 animate-fade-in">
                {/* Back Link to scan another website */}
                <button
                  id="back-to-crawler"
                  onClick={() => {
                    setActiveReport(null);
                    setUrlInput('');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    isDark ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Audit Another Website
                </button>

                {/* Score and Analytics Tabs */}
                <ReportDashboard 
                  report={activeReport} 
                  isDark={isDark} 
                  onExport={handleExportReport} 
                  planLevel="enterprise"
                  onUpgradePrompt={() => {}}
                />

                {/* AI Recommendations and Line-by-Line Report */}
                <IssueReport 
                  recommendations={activeReport.aiRecommendations} 
                  lineByLine={activeReport.lineByLineReport} 
                  isDark={isDark} 
                  onOptimizeWithAi={handleOptimizeWithAi}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARCHIVES HISTORIES */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black tracking-tight">Crawl Scan Database</h2>
              <p className="text-xs text-slate-400 mt-1">Review saved audits, indexation checklists, and track performance scores chronologically.</p>
            </div>

            <HistoryList 
              history={historyItems} 
              onSelect={handleSelectReport} 
              onDelete={handleDeleteHistory} 
              isDark={isDark} 
            />
          </div>
        )}

        {/* TAB 3: SYSTEM MONITOR */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-black tracking-tight">System Monitor Dashboard</h2>
              <p className="text-xs text-slate-400 mt-1">Audit platform diagnostic logs, server health metrics, and overall crawl success distributions in real-time.</p>
            </div>

            <AdminPanel isDark={isDark} />
          </div>
        )}
      </main>

      {/* AUTHOR & OWNER PROFILE BLOCK */}
      <section className="max-w-4xl mx-auto px-4 mt-20 mb-12 animate-fade-in">
        <div className={`p-8 rounded-3xl border relative overflow-hidden transition-all duration-300 premium-interactive-card glass-panel ${
          isDark 
            ? 'bg-slate-900/30 border-slate-800/80 shadow-[0_0_50px_-12px_rgba(99,102,241,0.05)]' 
            : 'bg-white/70 border-slate-200/80 shadow-[0_0_50px_-12px_rgba(99,102,241,0.08)]'
        }`}>
          {/* Glowing background highlights */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/8 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/8 rounded-full blur-[50px] pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Spinning gradient avatar slot */}
            <div className="relative group shrink-0 mx-auto md:mx-0">
              {/* Outer rotating color-gradient border */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-full opacity-70 blur-sm group-hover:opacity-100 transition duration-500 animate-spin-slow" />
              
              {/* Inner container */}
              <div className={`relative w-28 h-28 rounded-full overflow-hidden border-2 border-indigo-500/20 p-1 flex items-center justify-center ${
                isDark ? 'bg-slate-950' : 'bg-slate-50'
              }`}>
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <img 
                    src="/input_file_1.png" 
                    alt="Aditya Kumar Sahoo" 
                    onLoad={() => setOwnerImgLoaded(true)}
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src.includes('input_file_1.png')) {
                        img.src = '/input_file_0.png';
                      } else if (img.src.includes('input_file_0.png')) {
                        img.src = '/aditya_owner.png';
                      } else {
                        setOwnerImgLoaded(false);
                      }
                    }}
                    className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                      ownerImgLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {!ownerImgLoaded && (
                    <div 
                      id="aks-avatar-fallback" 
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 text-white font-black text-2xl tracking-widest font-mono"
                    >
                      AKS
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left space-y-4 flex-1">
              <div className="space-y-1.5">
                <div className="flex flex-col md:flex-row md:items-center gap-2.5">
                  <h3 className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-950 to-indigo-950 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-2">
                    Aditya Kumar Sahoo
                    <CheckCircle className="h-5 w-5 text-indigo-500 dark:text-indigo-400 fill-indigo-500/10 shrink-0" />
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 max-w-fit mx-auto md:mx-0">
                    Platform Owner & Chief Architect
                  </span>
                </div>
                
                {/* Coordinates & Locator */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-slate-400 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-rose-500/80" />
                    Bhubaneswar, Odisha, India
                  </span>
                  <span className="hidden md:inline text-slate-600 dark:text-slate-800">•</span>
                  <span className="flex items-center gap-1.5">
                    <Code2 className="h-4 w-4 text-indigo-500" />
                    React, TS & GenAI Systems
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                Lead Architect and Author of Vantage AI Website Auditor. Specializes in building full-stack reactive environments, real-time diagnostic telemetry, and modern developer experience platforms powered by recommendation networks.
              </p>

              {/* Technology badges grid */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1.5">
                {[
                  { label: 'React 19', color: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400' },
                  { label: 'TypeScript', color: 'border-blue-500/20 bg-blue-500/5 text-blue-400' },
                  { label: 'Intelligent AI Recommendations', color: 'border-violet-500/20 bg-violet-500/5 text-violet-400' },
                  { label: 'Vite & Express', color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' },
                ].map((tech) => (
                  <span key={tech.label} className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors duration-300 hover:bg-slate-800/10 dark:hover:bg-slate-100/5 ${tech.color}`}>
                    {tech.label}
                  </span>
                ))}
              </div>

              {/* Social / Contact Links */}
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-2">
                <a 
                  href="https://github.com/Adityakumarsahoo" 
                  target="_blank" 
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-300 hover:scale-[1.03] ${
                    isDark 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' 
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  <Github className="h-4 w-4" />
                  GitHub Profile
                </a>
                
                <a 
                  href="mailto:toadityakumarsahoo@gmail.com"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-300 hover:scale-[1.03] ${
                    isDark 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' 
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  <Mail className="h-4 w-4 animate-pulse" />
                  Email Contact
                </a>

                <a 
                  href="https://aditya-spark.vercel.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-300 hover:scale-[1.03] ${
                    isDark 
                      ? 'bg-slate-900/60 border-slate-800 text-slate-350 hover:bg-slate-800 hover:text-white' 
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  Portfolio Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER BAR */}
      <footer className={`border-t py-8 mt-12 transition-all ${
        isDark ? 'bg-[#0a0a0c]/95 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center items-center gap-1.5 font-bold text-xs">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-slate-800 dark:text-slate-200">Vantage AI Website Auditor</span>
          </div>
          <p className="text-[10px] max-w-md mx-auto">
            Calculated metrics correspond to standard Google Lighthouse and W3C WCAG accessibility auditing algorithms.
          </p>
          <div className="flex justify-center gap-3 text-[10px] font-semibold text-slate-400">
            <span>Enterprise-Grade Analyzer</span> • <span>Open-Source Audit Metrics</span> • <span>Created & Powered by Aditya</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
