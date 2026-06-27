import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { analyzeWebsite } from './server/analyzer';
import { UserProfile } from './src/types';
import { generatePDF, generateDocx, generateExcel, generateCsv, generateJson } from './server/generators';

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Setup Activity Logs logging middleware
  app.use((req, res, next) => {
    // Basic request logging if it targets an API
    if (req.path.startsWith('/api/') && !req.path.startsWith('/api/logs')) {
      console.log(`[API REQUEST] ${req.method} ${req.path}`);
    }
    next();
  });

  // --- AUTH ENDPOINTS ---

  // POST /api/auth/register
  app.post('/api/auth/register', (req, res) => {
    try {
      const { email, name, password } = req.body;
      if (!email || !name || !password) {
        return res.status(400).json({ error: 'Please supply all required fields (email, name, password)' });
      }

      const existing = db.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'An account with this email address already exists' });
      }

      const newUser: UserProfile = {
        id: 'usr-' + Math.random().toString(36).substring(2, 11),
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        plan: 'free',
        createdAt: new Date().toISOString()
      };

      db.createUser(newUser, password);
      res.status(201).json({ user: newUser, token: `mock-token-${newUser.id}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/auth/login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = db.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'No user account found with that email' });
      }

      const savedPassword = db.getUserPassword(user.id);
      if (savedPassword !== password) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      db.addLog(user.id, user.email, 'User Login', 'Successfully logged in');
      res.json({ user, token: `mock-token-${user.id}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/auth/profile
  app.get('/api/auth/profile', (req, res) => {
    // Simple profile retrieval matching authorization token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer mock-token-')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = authHeader.replace('Bearer mock-token-', '');
    const users = db.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  });

  // --- WEBSITE ANALYZER ENDPOINTS ---

  // POST /api/analyze
  app.post('/api/analyze', async (req, res) => {
    try {
      const { url, userId, email } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'Website URL is required' });
      }

      console.log(`Starting crawl & analysis for: ${url}`);
      // Perform deep crawlers & audits using our analyzer
      const report = await analyzeWebsite(url);

      // Save report in db
      db.saveReport(report, userId || 'anonymous', email || 'anonymous@analyzer.com');

      res.status(200).json(report);
    } catch (err: any) {
      console.error('Analysis failed', err);
      res.status(500).json({ error: err.message || 'Internal audit processing error' });
    }
  });

  // GET /api/history
  app.get('/api/history', (req, res) => {
    try {
      const reports = db.getReports();
      // Map to short history summary items
      const history = reports.map(r => ({
        id: r.id,
        url: r.url,
        date: r.date,
        score: r.overallScore,
        status: 'completed' as const,
        issuesCount: r.aiRecommendations.length + r.lineByLineReport.length
      }));
      res.json(history);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/report/:id
  app.get('/api/report/:id', (req, res) => {
    try {
      const report = db.getReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- DOWNLOAD ENDPOINTS ---

  // GET /api/download/pdf/:id
  app.get('/api/download/pdf/:id', (req, res) => {
    try {
      const report = db.getReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      generatePDF(report, res);
    } catch (err: any) {
      console.error('PDF export failed', err);
      res.status(500).json({ error: err.message || 'PDF Generation failed' });
    }
  });

  // GET /api/download/docx/:id
  app.get('/api/download/docx/:id', (req, res) => {
    try {
      const report = db.getReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      generateDocx(report, res);
    } catch (err: any) {
      console.error('Word export failed', err);
      res.status(500).json({ error: err.message || 'Word Generation failed' });
    }
  });

  // GET /api/download/excel/:id
  app.get('/api/download/excel/:id', (req, res) => {
    try {
      const report = db.getReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      generateExcel(report, res);
    } catch (err: any) {
      console.error('Excel export failed', err);
      res.status(500).json({ error: err.message || 'Excel Generation failed' });
    }
  });

  // GET /api/download/csv/:id
  app.get('/api/download/csv/:id', (req, res) => {
    try {
      const report = db.getReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      generateCsv(report, res);
    } catch (err: any) {
      console.error('CSV export failed', err);
      res.status(500).json({ error: err.message || 'CSV Generation failed' });
    }
  });

  // GET /api/download/json/:id
  app.get('/api/download/json/:id', (req, res) => {
    try {
      const report = db.getReportById(req.params.id);
      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }
      generateJson(report, res);
    } catch (err: any) {
      console.error('JSON export failed', err);
      res.status(500).json({ error: err.message || 'JSON Generation failed' });
    }
  });

  // DELETE /api/history/:id
  app.delete('/api/history/:id', (req, res) => {
    try {
      const deleted = db.deleteReport(req.params.id, 'admin-user', 'admin@analyzer.com');
      if (!deleted) {
        return res.status(404).json({ error: 'Report not found or already deleted' });
      }
      res.json({ success: true, message: 'Report deleted from history' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- SUBSCRIPTIONS ENDPOINT ---

  // POST /api/subscriptions/upgrade
  app.post('/api/subscriptions/upgrade', (req, res) => {
    try {
      const { userId, plan } = req.body;
      if (!userId || !plan) {
        return res.status(400).json({ error: 'User ID and Plan are required' });
      }

      const updatedUser = db.updateUserPlan(userId, plan);
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, user: updatedUser });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- ADMIN PANEL ENDPOINTS ---

  // GET /api/admin/stats
  app.get('/api/admin/stats', (req, res) => {
    try {
      const users = db.getUsers();
      const reports = db.getReports();
      const logs = db.getLogs();

      res.json({
        totalUsers: users.length,
        totalReports: reports.length,
        totalLogs: logs.length,
        averageScore: reports.length > 0
          ? Math.round(reports.reduce((acc, curr) => acc + curr.overallScore, 0) / reports.length)
          : 0,
        plansCount: {
          free: users.filter(u => u.plan === 'free').length,
          pro: users.filter(u => u.plan === 'pro').length,
          enterprise: users.filter(u => u.plan === 'enterprise').length
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/admin/users
  app.get('/api/admin/users', (req, res) => {
    try {
      res.json(db.getUsers());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/admin/logs
  app.get('/api/admin/logs', (req, res) => {
    try {
      res.json(db.getLogs());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- VITE INTERFACE AND STATIC FILES ---

  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYSTEM STARTED] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});
