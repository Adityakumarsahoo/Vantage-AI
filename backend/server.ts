import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import { logger } from './middleware/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  
  // Enable CORS configuration
  app.use(cors());
  
  app.use(express.json());
  app.use(logger);

  // Mount API router
  app.use('/api', router);

  // Serve static files in production fallback
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), '../frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[SYSTEM STARTED] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});
