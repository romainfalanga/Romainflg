import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthForm } from './components/AuthForm';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { CreditsPage } from './pages/CreditsPage';
import { FLGPassPage } from './pages/FLGPassPage';
import { DraftChessPage } from './pages/projects/DraftChessPage';
import { Chess100Page } from './pages/projects/Chess100Page';
import { Chess13Page } from './pages/projects/Chess13Page';
import { ChessValuePage } from './pages/projects/ChessValuePage';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user, loading } = useAuth();

  // Debug logs
  console.log('🎯 App render:', { 
    user: !!user, 
    loading, 
    userEmail: user?.email,
    currentPath: window.location.pathname 
  });

  return (
    <Router>
      <Routes>
        <Route 
          path="/auth" 
          element={
            user && !loading ? (
              <>
                {console.log('🔄 Utilisateur connecté, redirection vers /')}
                <Navigate to="/" replace />
              </>
            ) : <AuthForm />
          } 
        />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="credits"
            element={
              <CreditsPage />
            }
          />
          <Route
            path="flg-pass"
            element={
              <FLGPassPage />
            }
          />
          <Route path="projects/draft-chess" element={<DraftChessPage />} />
          <Route path="projects/chess-100" element={<Chess100Page />} />
          <Route path="projects/chess-13" element={<Chess13Page />} />
          <Route path="projects/chess-value" element={<ChessValuePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;