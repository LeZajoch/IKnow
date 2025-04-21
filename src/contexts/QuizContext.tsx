
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Quiz, Question, QuizResult } from '@/types';
import { useAuth } from './AuthContext';

interface QuizContextType {
  quizzes: Quiz[];
  userQuizzes: Quiz[];
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>) => void;
  updateQuiz: (quiz: Quiz) => void;
  deleteQuiz: (quizId: string) => void;
  getQuiz: (quizId: string) => Quiz | undefined;
  saveQuizResult: (result: Omit<QuizResult, 'dateTaken' | 'userId'>) => void;
  userResults: QuizResult[];
}

const QuizContext = createContext<QuizContextType>({
  quizzes: [],
  userQuizzes: [],
  createQuiz: () => {},
  updateQuiz: () => {},
  deleteQuiz: () => {},
  getQuiz: () => undefined,
  saveQuizResult: () => {},
  userResults: [],
});

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load quizzes from localStorage
    const storedQuizzes = localStorage.getItem('quizzes');
    if (storedQuizzes) {
      setQuizzes(JSON.parse(storedQuizzes));
    }

    // Load results from localStorage
    const storedResults = localStorage.getItem('quizResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  // Save quizzes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  // Save results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quizResults', JSON.stringify(results));
  }, [results]);

  // Filter quizzes created by the current user
  const userQuizzes = quizzes.filter(
    quiz => user && quiz.createdBy === user.id
  );

  // Filter quiz results for the current user
  const userResults = results.filter(
    result => user && (result.userId === user.id || (result.quizId && !result.userId && result.quizId.startsWith(user.id)))
  );

  const createQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!user) return;

    const newQuiz: Quiz = {
      ...quizData,
      id: crypto.randomUUID(),
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    setQuizzes(prev => [...prev, newQuiz]);
  };

  const updateQuiz = (updatedQuiz: Quiz) => {
    setQuizzes(prev =>
      prev.map(quiz => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz))
    );
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
  };

  const getQuiz = (quizId: string) => {
    return quizzes.find(quiz => quiz.id === quizId);
  };

  const saveQuizResult = (resultData: Omit<QuizResult, 'dateTaken' | 'userId'>) => {
    if (!user) return;

    const newResult: QuizResult = {
      ...resultData,
      userId: user.id,
      dateTaken: new Date().toISOString(),
    };

    setResults(prev => [...prev, newResult]);
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        userQuizzes,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        getQuiz,
        saveQuizResult,
        userResults,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
