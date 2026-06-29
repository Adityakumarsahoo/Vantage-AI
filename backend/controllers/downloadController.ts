import { Request, Response } from 'express';
import { db } from '../models/db';
import { generatePDF, generateDocx, generateExcel, generateCsv, generateJson } from '../utils/generators';

export const downloadPDF = (req: Request, res: Response): any => {
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
};

export const downloadDocx = (req: Request, res: Response): any => {
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
};

export const downloadExcel = (req: Request, res: Response): any => {
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
};

export const downloadCsv = (req: Request, res: Response): any => {
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
};

export const downloadJson = (req: Request, res: Response): any => {
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
};
