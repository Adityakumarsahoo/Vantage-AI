import { Router } from 'express';
import authRouter from './auth';
import analyzeRouter from './analyze';
import downloadRouter from './download';
import subscriptionRouter from './subscription';
import adminRouter from './admin';

const router = Router();

router.use('/auth', authRouter);
router.use('/download', downloadRouter);
router.use('/subscriptions', subscriptionRouter);
router.use('/admin', adminRouter);
router.use('/', analyzeRouter);

export default router;
