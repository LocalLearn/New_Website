import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import CoursesPage from './pages/CoursesPage';
import PythonPilotPage from './pages/PythonPilotPage';
import ProjectBuilderPage from './pages/ProjectBuilderPage.tsx';

function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Only attempt to sign out if there's an active user session
      if (!user) {
        console.log('No active session found');
        navigate('/');
        return;
      }

      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // If there's an error, still redirect to home page
      navigate('/');
    }
  };

  return (
    <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
        <BookOpen className="w-6 h-6 text-purple-600 transform -rotate-12" />
        <span>LocalLearn</span>
      </Link>
      <div className="flex items-center space-x-6">
        {user && (
          <Link 
            to="/courses" 
            className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
          >
            <BookOpen className="w-5 h-5" />
            <span>Courses</span>
          </Link>
        )}
        {user ? (
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <>
            <Link 
              to="/signin" 
              className="text-gray-700 hover:text-purple-600"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/python-pilot" element={<PythonPilotPage />} />
          <Route path="/project-builder" element={<ProjectBuilderPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;