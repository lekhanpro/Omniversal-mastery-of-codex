import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DomainView from './pages/DomainView';
import KnowledgeMap from './pages/KnowledgeMap';

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
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/domain/:id" element={<DomainView />} />
          <Route path="/knowledge-map" element={<KnowledgeMap />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
