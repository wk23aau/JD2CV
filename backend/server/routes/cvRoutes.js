import express from 'express';
import { generateCVContent } from '../services/aiService.js';
import { checkAndDecrementUserCredits } from '../services/userService.js';

const router = express.Router();
const GEMINI_CALL_COST = 5;

router.post('/generate', async (req, res) => {
  try {
    const { jobInfo, userProfile } = req.body;
    const userId = userProfile?.id;

    if (userId) {
      try {
        await checkAndDecrementUserCredits(userId, GEMINI_CALL_COST);
      } catch (creditError) {
        return res.status(creditError.statusCode || 403).json({ message: creditError.message });
      }
    }
    
    const cvContent = await generateCvWithAI(jobInfo, userProfile);
    res.json({ cvContent });

  } catch (error) {
    console.error('Error in /generate CV route:', error.message);
    res.status(error.statusCode || 500).json({ message: error.message || 'Failed to generate CV due to an internal server error.' });
  }
});

export default router;