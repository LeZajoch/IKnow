
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuiz } from '@/contexts/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { userQuizzes, userResults, quizzes, getQuiz } = useQuiz();

  const totalQuizzes = userQuizzes.length;
  const totalQuestions = userQuizzes.reduce(
    (sum, quiz) => sum + quiz.questions.length,
    0
  );
  const averageScore = userResults.length
    ? Math.round(
        (userResults.reduce(
          (sum, result) => sum + (result.score / result.totalQuestions) * 100,
          0
        ) /
          userResults.length) *
          100
      ) / 100
    : 0;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username}!</h1>
      <p className="text-gray-600 mb-8">Manage your quizzes and track your progress</p>

      {/* Stats Section */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold">{totalQuizzes}</CardTitle>
            <CardDescription>Quizzes Created</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold">{totalQuestions}</CardTitle>
            <CardDescription>Total Questions</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold">{averageScore}%</CardTitle>
            <CardDescription>Average Score</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Content</h2>
        <Link to="/create">
          <Button>Create New Quiz</Button>
        </Link>
      </div>

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="quizzes">My Quizzes</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes">
          {userQuizzes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userQuizzes.map((quiz) => (
                <Card key={quiz.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription className="truncate">{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{quiz.questions.length} Questions</span>
                      <span>{quiz.isPublic ? 'Public' : 'Private'}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t flex justify-between gap-2">
                    <Link to={`/edit/${quiz.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">Edit</Button>
                    </Link>
                    <Link to={`/quiz/${quiz.id}`} className="flex-1">
                      <Button className="w-full">Play</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">You haven't created any quizzes yet.</p>
              <Link to="/create">
                <Button>Create Your First Quiz</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="results">
          {userResults.length > 0 ? (
            <div className="bg-white rounded-lg border">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b">
                    <tr>
                      <th className="px-6 py-3 bg-gray-50">Quiz</th>
                      <th className="px-6 py-3 bg-gray-50">Score</th>
                      <th className="px-6 py-3 bg-gray-50">Date</th>
                      <th className="px-6 py-3 bg-gray-50">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userResults.map((result, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-6 py-4">
                          {(() => {
                            const quiz = getQuiz(result.quizId);
                            return quiz ? quiz.title : 'Unknown Quiz';
                          })()}
                        </td>
                        <td className="px-6 py-4">
                          {result.score}/{result.totalQuestions} ({Math.round((result.score / result.totalQuestions) * 100)}%)
                        </td>
                        <td className="px-6 py-4">
                          {formatDistanceToNow(new Date(result.dateTaken), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4">
                          {getQuiz(result.quizId) ? (
                            <Link to={`/quiz/${result.quizId}`}>
                              <Button variant="outline" size="sm">
                                Retry
                              </Button>
                            </Link>
                          ) : (
                            <Button variant="outline" size="sm" disabled title="Quiz no longer exists">
                              Retry
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">No quiz results yet.</p>
              <Link to="/explore">
                <Button>Find Quizzes to Play</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
