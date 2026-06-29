import { Router } from 'express';
import { downloadPDF, downloadDocx, downloadExcel, downloadCsv, downloadJson } from '../controllers/downloadController';

const router = Router();

router.get('/pdf/:id', downloadPDF);
router.get('/docx/:id', downloadDocx);
router.get('/excel/:id', downloadExcel);
router.get('/csv/:id', downloadCsv);
router.get('/json/:id', downloadJson);

export default router;
