import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import useAuthStore from './store/authStore';

// Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import VerifyEmail from './components/auth/VerifyEmail';
import Dashboard from './components/dashboard/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // Check if user is authenticated and email is verified
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is not verified, redirect to verify email page
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return children;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (isAuthenticated && user) {
    // If user is verified, redirect to dashboard
    if (user.emailVerified) {
      return <Navigate to="/dashboard" replace />;
    } else {
      // If user is not verified, redirect to verify email
      return <Navigate to="/verify-email" replace />;
    }
  }
  
  return children;
};

function App() {
  const { initializeAuth, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      initializeAuth(user);
    });

    return () => unsubscribe();
  }, [initializeAuth, setLoading]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } 
          />
          <Route 
            path="/verify-email" 
            element={<VerifyEmail />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
