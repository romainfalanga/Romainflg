import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import PageProfilRomainFalanga from './pages/PageProfilRomainFalanga';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/project/:slug" element={<ProjectPage />} />
                <Route path="/profile" element={<PageProfilRomainFalanga />} />
              </Routes>
            </main>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;