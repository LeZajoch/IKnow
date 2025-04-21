
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Quiz } from '@/types';

const PlayQuiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, saveQuizResult } = useQuiz();

  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quizId) {
      const quiz = getQuiz(quizId);
      if (quiz) {
        setCurrentQuiz(quiz);
      } else {
        setError('Quiz not found');
      }
    }
  }, [quizId, getQuiz]);

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button
          className="mt-4"
          onClick={() => navigate('/explore')}
        >
          Explore Other Quizzes
        </Button>
      </div>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);

    // Check if answer is correct
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question or show results
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      const finalScore = score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0);
      setScore(finalScore);

      // Save quiz result
      saveQuizResult({
        quizId: currentQuiz.id,
        score: finalScore,
        totalQuestions: currentQuiz.questions.length,
      });

      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-quiz-blue mb-2">{score} / {currentQuiz.questions.length}</h2>
              <p className="text-xl text-gray-600">
                {score === currentQuiz.questions.length
                  ? 'Perfect score! Excellent job!'
                  : score > currentQuiz.questions.length / 2
                  ? 'Good job! You passed the quiz.'
                  : 'Keep practicing to improve your score.'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium mb-2">Quiz Summary:</h3>
              <ul className="space-y-1">
                <li><span className="text-gray-600">Title:</span> {currentQuiz.title}</li>
                <li><span className="text-gray-600">Total Questions:</span> {currentQuiz.questions.length}</li>
                <li><span className="text-gray-600">Correct Answers:</span> {score}</li>
                <li><span className="text-gray-600">Score Percentage:</span> {Math.round((score / currentQuiz.questions.length) * 100)}%</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Button onClick={restartQuiz}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{currentQuiz.title}</h1>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedOption === index
                      ? 'border-quiz-blue bg-quiz-blue bg-opacity-5'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        selectedOption === index
                          ? 'border-quiz-blue'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedOption === index && (
                        <div className="w-3 h-3 rounded-full bg-quiz-blue" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
            >
              {currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PlayQuiz;
