import { Request, Response } from 'express';
import { db } from '../models/db';

export const getStats = (req: Request, res: Response): any => {
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
};

export const getUsers = (req: Request, res: Response): any => {
  try {
    res.json(db.getUsers());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getLogs = (req: Request, res: Response): any => {
  try {
    res.json(db.getLogs());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
