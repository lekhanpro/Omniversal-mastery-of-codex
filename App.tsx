import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import DomainView from './pages/DomainView';
import Arena from './pages/Arena';
import Oracle from './pages/Oracle';
import Grimoire from './pages/Grimoire';
import KnowledgeMapNew from './pages/KnowledgeMapNew';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Redirect component for external HTML pages
const ExternalRedirect: React.FC<{ url: string }> = ({ url }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  return <div className="min-h-screen bg-black text-white flex items-center justify-center">Redirecting...</div>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/domain/:id" element={<Layout><DomainView /></Layout>} />
          <Route path="/knowledge-map" element={<Layout><KnowledgeMapNew /></Layout>} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/oracle" element={<Oracle />} />
          <Route path="/grimoire" element={<Grimoire />} />
          <Route path="/dashboard" element={<ExternalRedirect url="/dashboard.html" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
