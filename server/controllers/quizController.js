import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

// Create a new quiz
export const createQuiz = async (req, res) => {
  try {
    const { title, description, isPublic, questions } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Title and at least one question are required' });
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Create quiz ID
      const quizId = uuidv4();
      
      // Insert quiz into database
      await connection.query(
        'INSERT INTO quizzes (id, title, description, created_by, is_public) VALUES (?, ?, ?, ?, ?)',
        [quizId, title, description, userId, isPublic ? 1 : 0]
      );
      
      // Insert questions
      for (const question of questions) {
        const questionId = uuidv4();
        await connection.query(
          'INSERT INTO questions (id, quiz_id, text, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
          [
            questionId,
            quizId,
            question.text,
            JSON.stringify(question.options),
            question.correctAnswer
          ]
        );
      }
      
      // Commit transaction
      await connection.commit();
      
      res.status(201).json({
        id: quizId,
        title,
        description,
        isPublic,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        questions: questions.map(q => ({
          ...q,
          id: uuidv4() // Generate IDs for the response
        }))
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all public quizzes
export const getQuizzes = async (req, res) => {
  try {
    // Get all public quizzes
    const [quizzes] = await pool.query(
      'SELECT q.*, u.username as creator_name FROM quizzes q JOIN users u ON q.created_by = u.id WHERE q.is_public = 1 ORDER BY q.created_at DESC'
    );
    
    // Get questions for each quiz
    const quizzesWithQuestions = await Promise.all(
      quizzes.map(async (quiz) => {
        const [questions] = await pool.query(
          'SELECT id, text, options, correct_answer FROM questions WHERE quiz_id = ?',
          [quiz.id]
        );
        
        // Parse options from JSON string to array
        const formattedQuestions = questions.map(q => ({
          id: q.id,
          text: q.text,
          options: JSON.parse(q.options),
          correctAnswer: q.correct_answer
        }));
        
        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          createdBy: quiz.created_by,
          creatorName: quiz.creator_name,
          isPublic: !!quiz.is_public,
          createdAt: quiz.created_at,
          questions: formattedQuestions
        };
      })
    );
    
    res.json(quizzesWithQuestions);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get quiz by ID
export const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get quiz
    const [quizzes] = await pool.query(
      'SELECT q.*, u.username as creator_name FROM quizzes q JOIN users u ON q.created_by = u.id WHERE q.id = ?',
      [id]
    );
    
    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    const quiz = quizzes[0];
    
    // Get questions
    const [questions] = await pool.query(
      'SELECT id, text, options, correct_answer FROM questions WHERE quiz_id = ?',
      [id]
    );
    
    // Parse options from JSON string to array
    const formattedQuestions = questions.map(q => ({
      id: q.id,
      text: q.text,
      options: JSON.parse(q.options),
      correctAnswer: q.correct_answer
    }));
    
    res.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      createdBy: quiz.created_by,
      creatorName: quiz.creator_name,
      isPublic: !!quiz.is_public,
      createdAt: quiz.created_at,
      questions: formattedQuestions
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get quizzes created by the authenticated user
export const getUserQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's quizzes
    const [quizzes] = await pool.query(
      'SELECT * FROM quizzes WHERE created_by = ? ORDER BY created_at DESC',
      [userId]
    );
    
    // Get questions for each quiz
    const quizzesWithQuestions = await Promise.all(
      quizzes.map(async (quiz) => {
        const [questions] = await pool.query(
          'SELECT id, text, options, correct_answer FROM questions WHERE quiz_id = ?',
          [quiz.id]
        );
        
        // Parse options from JSON string to array
        const formattedQuestions = questions.map(q => ({
          id: q.id,
          text: q.text,
          options: JSON.parse(q.options),
          correctAnswer: q.correct_answer
        }));
        
        return {
          id: quiz.id,
          title: quiz.title,
          description: quiz.description,
          createdBy: quiz.created_by,
          isPublic: !!quiz.is_public,
          createdAt: quiz.created_at,
          questions: formattedQuestions
        };
      })
    );
    
    res.json(quizzesWithQuestions);
  } catch (error) {
    console.error('Get user quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a quiz
export const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isPublic, questions } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Title and at least one question are required' });
    }
    
    // Check if quiz exists and belongs to the user
    const [quizzes] = await pool.query(
      'SELECT * FROM quizzes WHERE id = ? AND created_by = ?',
      [id, userId]
    );
    
    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz not found or unauthorized' });
    }
    
    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // Update quiz
      await connection.query(
        'UPDATE quizzes SET title = ?, description = ?, is_public = ? WHERE id = ?',
        [title, description, isPublic ? 1 : 0, id]
      );
      
      // Delete existing questions
      await connection.query('DELETE FROM questions WHERE quiz_id = ?', [id]);
      
      // Insert new questions
      for (const question of questions) {
        const questionId = uuidv4();
        await connection.query(
          'INSERT INTO questions (id, quiz_id, text, options, correct_answer) VALUES (?, ?, ?, ?, ?)',
          [
            questionId,
            id,
            question.text,
            JSON.stringify(question.options),
            question.correctAnswer
          ]
        );
      }
      
      // Commit transaction
      await connection.commit();
      
      res.json({
        id,
        title,
        description,
        isPublic,
        createdBy: userId,
        questions: questions.map(q => ({
          ...q,
          id: q.id || uuidv4() // Use existing ID or generate a new one
        }))
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if quiz exists and belongs to the user
    const [quizzes] = await pool.query(
      'SELECT * FROM quizzes WHERE id = ? AND created_by = ?',
      [id, userId]
    );
    
    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz not found or unauthorized' });
    }
    
    // Delete quiz (questions will be deleted by CASCADE)
    await pool.query('DELETE FROM quizzes WHERE id = ?', [id]);
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
