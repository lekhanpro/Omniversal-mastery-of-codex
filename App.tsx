import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DomainView from './pages/DomainView';
import Arena from './pages/Arena';
import Oracle from './pages/Oracle';
import Grimoire from './pages/Grimoire';
import Observatory from './pages/Observatory';
import Forge from './pages/Forge';
import Cartography from './pages/Cartography';
import Dashboard from './pages/Dashboard';

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
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/domain/:id" element={<Layout><DomainView /></Layout>} />
        <Route path="/knowledge-map" element={<ExternalRedirect url="/knowledge-map.html" />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/oracle" element={<Oracle />} />
        <Route path="/grimoire" element={<Grimoire />} />
        <Route path="/observatory" element={<ExternalRedirect url="/observatory.html" />} />
        <Route path="/forge" element={<ExternalRedirect url="/forge.html" />} />
        <Route path="/cartography" element={<Layout><Cartography /></Layout>} />
        <Route path="/dashboard" element={<ExternalRedirect url="/dashboard.html" />} />
      </Routes>
    </Router>
  );
};

export default App;
