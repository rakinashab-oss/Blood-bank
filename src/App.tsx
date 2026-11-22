import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { AwarenessPage } from './pages/AwarenessPage';
import { ReportProblemPage } from './pages/ReportProblemPage';
import { RegisterDonorPage } from './pages/RegisterDonorPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Scroll to top helper on navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#fbfbfc] text-charcoal-900 selection:bg-blood-100 selection:text-blood-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/directory" element={<DirectoryPage />} />
                <Route path="/awareness" element={<AwarenessPage />} />
                <Route path="/register" element={<RegisterDonorPage />} />
                <Route path="/report" element={<ReportProblemPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
