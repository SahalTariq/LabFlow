// server.js - Node.js + Express backend server for LabFlow MERN Stack
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import patientRoutes from './server/routes/patientRoutes.js';
import statRoutes from './server/routes/statRoutes.js';
import staffRoutes from './server/routes/staffRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // REST API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      stack: 'MERN (MongoDB Models, Express, React, Node.js)',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/patients', patientRoutes);
  app.use('/api/stats', statRoutes);
  app.use('/api/staff', staffRoutes);

  // Vite integration (Development middleware / Production static files)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LabFlow MERN] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start LabFlow MERN server:', err);
  process.exit(1);
});
