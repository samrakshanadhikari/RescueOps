import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import HelpRequest from './components/HelpRequest';
import ResultsPage from './components/ResultsPage';
import EmergencyPage from './components/EmergencyPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="App">
        <div style={{ color: '#2E3A59', fontSize: '24px' }}>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

function AppContent() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <HelpRequest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/emergency" 
          element={
            <ProtectedRoute>
              <EmergencyPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
