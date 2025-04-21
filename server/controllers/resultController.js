import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

// Save a quiz result
export const saveQuizResult = async (req, res) => {
  try {
    const { quizId, score, totalQuestions } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!quizId || score === undefined || !totalQuestions) {
      return res.status(400).json({ message: 'Quiz ID, score, and total questions are required' });
    }
    
    // Check if quiz exists
    const [quizzes] = await pool.query(
      'SELECT * FROM quizzes WHERE id = ?',
      [quizId]
    );
    
    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    // Create result ID
    const resultId = uuidv4();
    
    // Insert result into database
    await pool.query(
      'INSERT INTO quiz_results (id, quiz_id, user_id, score, total_questions) VALUES (?, ?, ?, ?, ?)',
      [resultId, quizId, userId, score, totalQuestions]
    );
    
    res.status(201).json({
      id: resultId,
      quizId,
      userId,
      score,
      totalQuestions,
      dateTaken: new Date().toISOString()
    });
  } catch (error) {
    console.error('Save quiz result error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's quiz results
export const getUserResults = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's results
    const [results] = await pool.query(
      `SELECT r.*, q.title as quiz_title 
       FROM quiz_results r 
       JOIN quizzes q ON r.quiz_id = q.id 
       WHERE r.user_id = ? 
       ORDER BY r.date_taken DESC`,
      [userId]
    );
    
    // Format results
    const formattedResults = results.map(result => ({
      id: result.id,
      quizId: result.quiz_id,
      quizTitle: result.quiz_title,
      score: result.score,
      totalQuestions: result.total_questions,
      dateTaken: result.date_taken
    }));
    
    res.json(formattedResults);
  } catch (error) {
    console.error('Get user results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
