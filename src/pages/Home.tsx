
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-quiz-blue to-quiz-purple py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn, Create, <span className="text-quiz-lightPurple">Quiz!</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              Create, manage, and play quizzes for fun or education. Make learning interactive and engaging!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-quiz-blue hover:bg-gray-100">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link to="/create">
                    <Button size="lg" variant="outline" className="border-white text-quiz-blue hover:bg-quiz-lightPurple hover:border-quiz-lightPurple">
                      Create a Quiz
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-white text-quiz-blue hover:bg-gray-100">
                      Sign Up
                    </Button>
                  </Link>
                  <Link to="/explore">
                    <Button size="lg" variant="outline" className="border-white text-quiz-blue hover:bg-quiz-lightPurple hover:border-quiz-lightPurple">
                      Explore Quizzes
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why IKnow?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-quiz-lightBlue bg-opacity-10 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-quiz-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Create Engaging Quizzes</h3>
                <p className="text-gray-600 text-center">
                  Easily create quizzes that make learning fun and interactive.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-quiz-lightBlue bg-opacity-10 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-quiz-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Track Your Progress</h3>
                <p className="text-gray-600 text-center">
                  Monitor your learning journey with comprehensive statistics.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-quiz-lightBlue bg-opacity-10 w-16 h-16 flex items-center justify-center rounded-full mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-quiz-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Share With Others</h3>
                <p className="text-gray-600 text-center">
                  Make your quizzes public or share them with specific users or groups.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-quiz-purple text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">Sign up for free and start your learning journey.</p>
              </div>

              <div className="text-center">
                <div className="bg-quiz-purple text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">Create a Quiz</h3>
                <p className="text-gray-600">Design your own quiz or explore existing ones.</p>
              </div>

              <div className="text-center">
                <div className="bg-quiz-purple text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Play and Learn</h3>
                <p className="text-gray-600">Test your knowledge with interactive quizzes.</p>
              </div>

              <div className="text-center">
                <div className="bg-quiz-purple text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                <p className="text-gray-600">Review your performance and improve over time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-quiz-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make Learning Fun?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students and teachers who are transforming education with interactive quizzes.
            </p>
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="bg-white text-quiz-blue hover:bg-gray-100">
                {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
