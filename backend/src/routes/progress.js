import express from 'express';

const router = express.Router();

// GET /api/progress/:userId - Get user progress
router.get('/:userId', async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Progress tracking not yet implemented. Coming in Phase 2.'
  });
});

export default router;
