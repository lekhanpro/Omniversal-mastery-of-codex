import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DomainView from './pages/DomainView';
import KnowledgeMapNew from './pages/KnowledgeMapNew';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/domain/:id" element={<Layout><DomainView /></Layout>} />
        <Route path="/knowledge-map" element={<KnowledgeMapNew />} />
      </Routes>
    </Router>
  );
};

export default App;
