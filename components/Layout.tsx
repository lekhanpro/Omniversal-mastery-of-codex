import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getIcon } from './Icons';
import { domains } from '../data';
import { Menu, X, Search, Grid, Lock, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import CosmicCanvas from './CosmicCanvas';
import ScrollProgress from './ScrollProgress';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100 font-sans flex flex-col md:flex-row overflow-hidden relative">
      <CosmicCanvas />
      <ScrollProgress />
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border z-50">
        <Link to="/" className="text-neon-blue font-mono font-bold tracking-wider">OMNIVERSAL CODEX</Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="text-neon-blue" /> : <Menu className="text-neon-blue" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border-r border-gray-200 dark:border-dark-border shadow-lg
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-dark-border hidden md:flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold font-mono text-neon-blue tracking-widest">
                <Link to="/">OMNIVERSAL CODEX</Link>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">v2.5.0 [ULTRA_EXPANDED]</p>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>

          <div className="p-4">
             <Link 
                to="/"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 border border-transparent ${
                  location.pathname === '/' ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Grid className="w-5 h-5 mr-3" />
                <span className="font-mono text-sm">Home</span>
             </Link>

             <div className="mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-3">Features</div>
              
              <Link 
                to="/knowledge-map"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 border border-transparent ${
                  location.pathname === '/knowledge-map' ? 'bg-neon-purple/10 border-neon-purple text-neon-purple' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="mr-3">🗺️</span>
                <span className="font-mono text-sm">Knowledge Map</span>
             </Link>

             <Link 
                to="/oracle"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 border border-transparent ${
                  location.pathname === '/oracle' ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="mr-3">🔮</span>
                <span className="font-mono text-sm">Oracle</span>
             </Link>

             <Link 
                to="/arena"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 border border-transparent ${
                  location.pathname === '/arena' ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="mr-3">⚔️</span>
                <span className="font-mono text-sm">Arena</span>
             </Link>

             <Link 
                to="/grimoire"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 border border-transparent ${
                  location.pathname === '/grimoire' ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="mr-3">📖</span>
                <span className="font-mono text-sm">Grimoire</span>
             </Link>

             <Link 
                to="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center p-3 mb-4 rounded-lg transition-all duration-200 border border-transparent ${
                  location.pathname === '/dashboard' ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="mr-3">📊</span>
                <span className="font-mono text-sm">Dashboard</span>
             </Link>

             <div className="mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-3">Domains</div>
             
             <div className="space-y-1 overflow-y-auto h-[calc(100vh-280px)] custom-scrollbar pr-2">
                {domains.map((domain) => (
                  <Link
                    key={domain.id}
                    to={`/domain/${domain.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center p-2.5 rounded-md transition-colors text-sm ${
                      location.pathname === `/domain/${domain.id}` 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-neon-blue' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                    } ${domain.isLocked ? 'opacity-50' : ''}`}
                  >
                    <div className="mr-3">{getIcon(domain.icon, "w-4 h-4")}</div>
                    <span className="truncate">{domain.id}. {domain.title}</span>
                    {domain.isLocked && <Lock className="w-3 h-3 ml-auto" />}
                  </Link>
                ))}
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen overflow-y-auto overflow-x-hidden relative">
         {children}
      </main>
    </div>
  );
};

export default Layout;