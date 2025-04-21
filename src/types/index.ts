
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  dateTaken: string;
}

export interface UserProfile {
  user: User;
  quizzes: Quiz[];
  results: QuizResult[];
}
