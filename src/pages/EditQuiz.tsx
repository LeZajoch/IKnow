import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Plus } from 'lucide-react';
import { Question, Quiz } from '@/types';

const EditQuiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuiz, updateQuiz } = useQuiz();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [originalQuiz, setOriginalQuiz] = useState<Quiz | null>(null);

  // Load quiz data
  useEffect(() => {
    if (!quizId) {
      setError('No quiz ID provided');
      setLoading(false);
      return;
    }

    try {
      const quiz = getQuiz(quizId);
      if (quiz) {
        setOriginalQuiz(quiz);
        setTitle(quiz.title);
        setDescription(quiz.description || '');
        setIsPublic(quiz.isPublic || false);
        
        // Deep clone the questions to avoid modifying the original
        const clonedQuestions = quiz.questions.map(q => ({
          ...q,
          options: [...q.options]
        }));
        
        setQuestions(clonedQuestions);
        setLoading(false);
      } else {
        setError('Quiz not found');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError('Error loading quiz');
      setLoading(false);
    }
  }, [quizId, getQuiz]);

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    if (!newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options = ['', '', '', ''];
    }
    newQuestions[questionIndex].options![optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleQuestionTextChange = (questionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].text = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { 
        id: crypto.randomUUID(),
        text: '', 
        options: ['', '', '', ''], 
        correctAnswer: 0 
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Quiz title is required');
      return false;
    }

    if (!description.trim()) {
      setError('Quiz description is required');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text?.trim()) {
        setError(`Question ${i + 1} is empty`);
        return false;
      }

      if (!q.options) {
        setError(`Question ${i + 1} has no options`);
        return false;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          setError(`Option ${j + 1} for question ${i + 1} is empty`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm() || !originalQuiz) return;

    try {
      // Update the quiz with the new values while preserving the original id, createdBy, and createdAt
      updateQuiz({
        ...originalQuiz,
        title,
        description,
        isPublic,
        questions: questions as Question[],
      });
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to update quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          className="mt-4" 
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Quiz</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="isPublic">Make quiz public</Label>
            </div>
          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-bold mb-4">Questions</h2>
        
        {questions.map((question, qIndex) => (
          <Card key={question.id} className="mb-6">
            <CardHeader className="flex flex-row items-center">
              <CardTitle className="flex-1">Question {qIndex + 1}</CardTitle>
              {questions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(qIndex)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                <Textarea
                  id={`question-${qIndex}`}
                  value={question.text || ''}
                  onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                  placeholder="Enter question text"
                />
              </div>
              <div className="space-y-4">
                <Label>Options</Label>
                {question.options?.map((option, oIndex) => (
                  <div key={oIndex} className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`correct-${qIndex}-${oIndex}`}
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                        className="h-4 w-4 text-quiz-blue"
                      />
                      <Label htmlFor={`correct-${qIndex}-${oIndex}`} className="text-sm">
                        Correct
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="mb-6">
          <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>
        
        <CardFooter className="flex justify-between px-0">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </form>
    </div>
  );
};

export default EditQuiz;
