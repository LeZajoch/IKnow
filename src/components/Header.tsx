
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-quiz-blue">
            IKnow
          </Link>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="text-gray-600 hover:text-quiz-blue">
                Home
              </Link>
            </li>
            <li>
              <Link to="/explore" className="text-gray-600 hover:text-quiz-blue">
                Explore Quizzes
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/dashboard" className="text-gray-600 hover:text-quiz-blue">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/create" className="text-gray-600 hover:text-quiz-blue">
                    Create Quiz
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-gray-700">
                Hi, {user?.username}
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
