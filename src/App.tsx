import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Navbar from './components/layout/Navbar';
import Auth from './components/Auth';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import PageProfilRomainFalanga from './pages/PageProfilRomainFalanga';
import AdminApplications from './pages/AdminApplications';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/project/:id" element={<ProjectPage />} />
              <Route path="/profile" element={<PageProfilRomainFalanga />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
            </Routes>
          </main>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;