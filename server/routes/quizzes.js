import express from 'express';
import { 
  createQuiz, 
  getQuizzes, 
  getQuizById, 
  updateQuiz, 
  deleteQuiz,
  getUserQuizzes
} from '../controllers/quizController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all public quizzes
router.get('/', getQuizzes);

// Get quiz by ID
router.get('/:id', getQuizById);

// Get quizzes created by the authenticated user
router.get('/user/me', authenticateToken, getUserQuizzes);

// Create a new quiz (protected)
router.post('/', authenticateToken, createQuiz);

// Update a quiz (protected)
router.put('/:id', authenticateToken, updateQuiz);

// Delete a quiz (protected)
router.delete('/:id', authenticateToken, deleteQuiz);

export default router;
