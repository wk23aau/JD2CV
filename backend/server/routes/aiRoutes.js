import express from 'express';
import { generateCVContent } from '../services/aiService.js';

const router = express.Router();

router.post('/generate-cv', async (req, res) => {
  try {
    const { jobInfo, userProfile } = req.body;
    const result = await generateCVContent(jobInfo, userProfile);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
