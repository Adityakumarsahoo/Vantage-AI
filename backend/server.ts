import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import { logger } from './middleware/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Enable CORS configuration
app.use(cors());

app.use(express.json());
app.use(logger);

// Mount API router (covers both prefixed and stripped routes on Vercel)
app.use('/api', router);
app.use('/', router);

// Serve static files in production fallback (only if not on Vercel serverless)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const distPath = path.join(process.cwd(), '../frontend/dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Only listen if not running in a serverless environment (like Vercel)
if (!process.env.VERCEL) {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[SYSTEM STARTED] Server running on http://localhost:${PORT}`);
  });
}

export default app;
