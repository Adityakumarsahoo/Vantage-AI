import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.startsWith('/api/') && !req.originalUrl.startsWith('/api/admin/logs')) {
    console.log(`[API REQUEST] ${req.method} ${req.originalUrl}`);
  }
  next();
};
