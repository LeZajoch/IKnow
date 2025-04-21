
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Explore: React.FC = () => {
  const { quizzes } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter public quizzes
  const publicQuizzes = quizzes.filter(quiz => quiz.isPublic);
  
  // Filter based on search term
  const filteredQuizzes = publicQuizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Explore Quizzes</h1>
      <p className="text-gray-600 mb-8">Discover and play quizzes created by other users</p>
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search quizzes..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredQuizzes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuizzes.map(quiz => (
            <Card key={quiz.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{quiz.description}</p>
                <div className="text-sm text-gray-500">
                  {quiz.questions.length} questions
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 border-t">
                <Link to={`/quiz/${quiz.id}`} className="w-full">
                  <Button className="w-full">Play Quiz</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No quizzes found matching "{searchTerm}"</p>
          <Button 
            variant="outline"
            onClick={() => setSearchTerm('')}
            className="mt-4"
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">No public quizzes available yet.</p>
          <Link to="/create">
            <Button>Create the First Quiz</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Explore;
