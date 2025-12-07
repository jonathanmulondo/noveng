import express from 'express';

const router = express.Router();

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Authentication not yet implemented. Coming in Phase 2.'
  });
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Authentication not yet implemented. Coming in Phase 2.'
  });
});

export default router;
