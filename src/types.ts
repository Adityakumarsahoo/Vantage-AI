export interface ScanHistoryItem {
  id: string;
  url: string;
  date: string;
  score: number;
  status: 'completed' | 'failed' | 'scanning';
  issuesCount: number;
}

export interface CodeIssue {
  fileName: string;
  url: string;
  lineNumber: number;
  type: 'html' | 'css' | 'js';
  error: string;
  currentCode: string;
  correctCode: string;
  severity: 'high' | 'medium' | 'low';
}

export interface AIRecommendation {
  id: string;
  category: 'performance' | 'seo' | 'security' | 'accessibility' | 'codeQuality';
  problem: string;
  whyItMatters: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  scoreImpact: number;
  howToFix: string;
  exampleCode: {
    current: string;
    correct: string;
  };
  referenceDocs: string;
  priority: 'immediate' | 'high' | 'medium' | 'low';
}

export interface MetricDetail {
  name: string;
  value: string | number;
  score: number; // 0-100
  status: 'good' | 'warning' | 'error';
  description: string;
}

export interface ReportData {
  id: string;
  url: string;
  date: string;
  overallScore: number;
  categories: {
    performance: number;
    seo: number;
    accessibility: number;
    bestPractices: number;
    security: number;
    responsive: number;
    codeQuality: number;
    brokenLinks: number;
  };
  metrics: {
    performance: MetricDetail[];
    seo: MetricDetail[];
    security: MetricDetail[];
    accessibility: MetricDetail[];
    codeQuality: MetricDetail[];
  };
  viewportScreenshots: {
    viewport: string;
    width: number;
    height: number;
    isPortrait: boolean;
    mockUrl: string;
  }[];
  brokenLinks: {
    url: string;
    status: number;
    type: 'page' | 'image' | 'script' | 'stylesheet' | 'api';
    error: string;
  }[];
  imageOptimization: {
    src: string;
    size: string;
    webpSupport: boolean;
    lazyLoaded: boolean;
    dimensions: string;
    saving: string;
  }[];
  jsAnalysis: {
    error: string;
    type: string;
    file: string;
    line: number;
  }[];
  cssAnalysis: {
    issue: string;
    severity: 'high' | 'medium' | 'low';
    selector?: string;
  }[];
  htmlValidation: {
    message: string;
    line: number;
    column: number;
    type: 'error' | 'warning';
  }[];
  aiRecommendations: AIRecommendation[];
  lineByLineReport: CodeIssue[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}
