import { Request, Response } from 'express';
import { db } from '../models/db';
import { analyzeWebsite } from '../utils/analyzer';

export const analyze = async (req: Request, res: Response): Promise<any> => {
  try {
    const { url, userId, email } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Website URL is required' });
    }

    console.log(`Starting crawl & analysis for: ${url}`);
    const report = await analyzeWebsite(url);

    db.saveReport(report, userId || 'anonymous', email || 'anonymous@analyzer.com');
    res.status(200).json(report);
  } catch (err: any) {
    console.error('Analysis failed', err);
    res.status(500).json({ error: err.message || 'Internal audit processing error' });
  }
};

export const getHistory = (req: Request, res: Response): any => {
  try {
    const reports = db.getReports();
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
};

export const getReport = (req: Request, res: Response): any => {
  try {
    const report = db.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReport = (req: Request, res: Response): any => {
  try {
    const deleted = db.deleteReport(req.params.id, 'admin-user', 'admin@analyzer.com');
    if (!deleted) {
      return res.status(404).json({ error: 'Report not found or already deleted' });
    }
    res.json({ success: true, message: 'Report deleted from history' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
