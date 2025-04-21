import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'quiz_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database with required tables
export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create quizzes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        created_by VARCHAR(36) NOT NULL,
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create questions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id VARCHAR(36) PRIMARY KEY,
        quiz_id VARCHAR(36) NOT NULL,
        text TEXT NOT NULL,
        options JSON NOT NULL,
        correct_answer INT NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      )
    `);
    
    // Create quiz_results table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id VARCHAR(36) PRIMARY KEY,
        quiz_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        score INT NOT NULL,
        total_questions INT NOT NULL,
        date_taken TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Export the pool to be used in other files
export default pool;
