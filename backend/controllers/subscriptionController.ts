import { Request, Response } from 'express';
import { db } from '../models/db';

export const upgradePlan = (req: Request, res: Response): any => {
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
};
