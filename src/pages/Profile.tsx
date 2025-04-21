
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuiz } from '@/contexts/QuizContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { userQuizzes, userResults } = useQuiz();

  if (!user) {
    return <div>Loading...</div>;
  }

  const totalQuizzesTaken = userResults.length;
  const averageScore = totalQuizzesTaken
    ? Math.round(
        (userResults.reduce(
          (sum, result) => sum + (result.score / result.totalQuestions) * 100,
          0
        ) /
          totalQuizzesTaken) *
          100
      ) / 100
    : 0;

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-600">Username:</span> {user.username}
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span> {user.email}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-600">Quizzes Created:</span> {userQuizzes.length}
              </div>
              <div>
                <span className="font-medium text-gray-600">Quizzes Taken:</span> {totalQuizzesTaken}
              </div>
              <div>
                <span className="font-medium text-gray-600">Average Score:</span> {averageScore}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
