import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authMiddleware } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import artistRoutes from './routes/artists.js';
import artFormRoutes from './routes/artforms.js';
import offeringRoutes from './routes/offerings.js';
import experienceRoutes from './routes/experiences.js';
import paymentRoutes from './routes/payments.js';
import artistDashboardRoutes from './routes/artistDashboard.js';
import learnerDashboardRoutes from './routes/learnerDashboard.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow local development, Render URLs, or requests with no origin (e.g. mobile apps, curl, same-origin)
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('onrender.com') || process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(authMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/artforms', artFormRoutes);
app.use('/api/offerings', offeringRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/artist', artistDashboardRoutes);
app.use('/api/learner', learnerDashboardRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'ANUNAAD (अनुनाद)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve static build in production if available
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distCandidate1 = path.resolve(__dirname, '../dist');
const distCandidate2 = path.resolve(process.cwd(), 'dist');
const distPath = fs.existsSync(path.join(distCandidate1, 'index.html'))
  ? distCandidate1
  : distCandidate2;

app.use(express.static(distPath));

// Also serve public folder as fallback for static audio/images
const publicCandidate1 = path.resolve(__dirname, '../public');
const publicCandidate2 = path.resolve(process.cwd(), 'public');
const publicPath = fs.existsSync(publicCandidate1) ? publicCandidate1 : publicCandidate2;
app.use(express.static(publicPath));

// 404 handler for API routes (always return JSON, never HTML)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.originalUrl}` });
  }
  next();
});

// Fallback for SPA routing (only non-API requests get index.html)
app.use((req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(503).json({
    message: 'ANUNAAD platform is building or initializing static assets.',
    pathChecked: indexPath,
    hint: 'Frontend dist/index.html is not yet available. Please wait a few seconds or trigger a build.'
  });
});

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`  ANUNAAD (अनुनाद) — Living Traditions Platform`);
  console.log(`  Backend API active on http://localhost:${PORT}`);
  console.log(`  Core Philosophy: "Every tradition deserves to resonate"`);
  console.log(`=================================================\n`);
});
