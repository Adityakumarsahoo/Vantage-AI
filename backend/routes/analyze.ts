import { Router } from 'express';
import { analyze, getHistory, getReport, deleteReport } from '../controllers/analyzeController';

const router = Router();

router.post('/analyze', analyze);
router.get('/history', getHistory);
router.get('/report/:id', getReport);
router.delete('/history/:id', deleteReport);

export default router;
