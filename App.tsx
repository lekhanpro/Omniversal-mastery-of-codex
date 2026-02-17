import React, { useEffect } from 'react';
import { HashRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import { ShareProgressProvider } from './contexts/ShareProgressContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Arena from './pages/Arena';
import Cartography from './pages/Cartography';
import Dashboard from './pages/Dashboard';
import DomainView from './pages/DomainView';
import Forge from './pages/Forge';
import Grimoire from './pages/Grimoire';
import Home from './pages/Home';
import KnowledgeMap from './pages/KnowledgeMap';
import Observatory from './pages/Observatory';
import Oracle from './pages/Oracle';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

const RoutedApp: React.FC = () => (
  <>
    <ScrollToTop />
    <LoadingScreen />
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/domain/:id"
        element={
          <Layout>
            <DomainView />
          </Layout>
        }
      />
      <Route
        path="/map"
        element={
          <Layout>
            <KnowledgeMap />
          </Layout>
        }
      />
      <Route path="/knowledge-map" element={<Navigate to="/map" replace />} />
      <Route
        path="/oracle"
        element={
          <Layout>
            <Oracle />
          </Layout>
        }
      />
      <Route
        path="/arena"
        element={
          <Layout>
            <Arena />
          </Layout>
        }
      />
      <Route
        path="/grimoire"
        element={
          <Layout>
            <Grimoire />
          </Layout>
        }
      />
      <Route
        path="/observatory"
        element={
          <Layout>
            <Observatory />
          </Layout>
        }
      />
      <Route
        path="/forge"
        element={
          <Layout>
            <Forge />
          </Layout>
        }
      />
      <Route
        path="/cartography"
        element={
          <Layout>
            <Cartography />
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

const App: React.FC = () => (
  <ThemeProvider>
    <ShareProgressProvider>
      <Router>
        <RoutedApp />
      </Router>
    </ShareProgressProvider>
  </ThemeProvider>
);

export default App;
