import { Router } from 'express';
import { getStats, getUsers, getLogs } from '../controllers/adminController';

const router = Router();

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/logs', getLogs);

export default router;
