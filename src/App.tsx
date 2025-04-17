import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { UserProfileIcon } from './components/UserProfileIcon';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import VerificationPage from './pages/VerificationPage';
import OnboardingPage from './pages/OnboardingPage';
import CoursesPage from './pages/CoursesPage';
import PythonPilotPage from './pages/PythonPilotPage';
import ProjectBuilderPage from './pages/ProjectBuilderPage';

function Navigation() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log('Initiating sign out...');
      await signOut();
      console.log('Sign out completed');
    } catch (error) {
      console.error('Error during sign out:', error);
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
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
            <UserProfileIcon fullName={user.user_metadata?.full_name} />
          </div>
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
    <div className="min-h-screen bg-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/python-pilot" element={<PythonPilotPage />} />
        <Route path="/project-builder" element={<ProjectBuilderPage />} />
      </Routes>
    </div>
  );
}

export default App;