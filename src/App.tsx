/**
 * FounderFit Score v2.1: The 6 Execution Forces Framework
 * Main Application Component
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HealthGate } from './components/HealthGate';
import type { ReactNode } from 'react';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SurveyPage from './pages/SurveyPage';
import SurveyStartPage from './pages/SurveyStartPage';
import DemographicsPage from './pages/DemographicsPage';
import SurveyQuestionPage from './pages/SurveyQuestionPage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Admin Route Component
function AdminRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route
        path="/survey"
        element={
          <ProtectedRoute>
            <SurveyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/survey/start"
        element={
          <ProtectedRoute>
            <SurveyStartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/survey/demographics"
        element={
          <ProtectedRoute>
            <DemographicsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/survey/q/:index"
        element={
          <ProtectedRoute>
            <SurveyQuestionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/:assessmentId"
        element={
          <ProtectedRoute>
            <ResultsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <HealthGate>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </HealthGate>
  );
}

export default App;
