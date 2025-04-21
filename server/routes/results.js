import express from 'express';
import { 
  saveQuizResult, 
  getUserResults 
} from '../controllers/resultController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Save a quiz result (protected)
router.post('/', authenticateToken, saveQuizResult);

// Get user's quiz results (protected)
router.get('/user/me', authenticateToken, getUserResults);

export default router;
