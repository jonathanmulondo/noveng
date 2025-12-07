import express from 'express';

const router = express.Router();

// GET /api/feed - Get feed posts
router.get('/', async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Feed not yet implemented. Coming in Phase 2.'
  });
});

export default router;
