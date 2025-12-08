import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';

// Import routes
import moduleRoutes from './routes/modules.js';
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import feedRoutes from './routes/feed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Clean CORS_ORIGIN from any quotes that might be added by Vercel
const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:5173').replace(/["']/g, '');
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/modules', moduleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/feed', feedRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.warn('⚠️  Starting server without database connection');
    }

    app.listen(PORT, () => {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════════╗');
      console.log('║                                                           ║');
      console.log('║          🚀 NovEng Backend Server Running!                ║');
      console.log('║                                                           ║');
      console.log('╠═══════════════════════════════════════════════════════════╣');
      console.log(`║  Port:        ${PORT.toString().padEnd(43)} ║`);
      console.log(`║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(43)} ║`);
      console.log(`║  Database:    ${(dbConnected ? '✓ Connected' : '✗ Disconnected').padEnd(43)} ║`);
      console.log('║                                                           ║');
      console.log('║  API Endpoints:                                           ║');
      console.log(`║    GET  /health                                           ║`);
      console.log(`║    GET  /api/modules                                      ║`);
      console.log(`║    GET  /api/modules/:slug                                ║`);
      console.log(`║    POST /api/auth/register                                ║`);
      console.log(`║    POST /api/auth/login                                   ║`);
      console.log(`║    GET  /api/progress/:userId                             ║`);
      console.log(`║    GET  /api/feed                                         ║`);
      console.log('║                                                           ║');
      console.log('╚═══════════════════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
