import { Router } from 'express';
import { upgradePlan } from '../controllers/subscriptionController';

const router = Router();

router.post('/upgrade', upgradePlan);

export default router;
