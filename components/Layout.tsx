import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getIcon } from './Icons';
import { domains } from '../data';
import { Menu, X, Search, Grid, Lock } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-dark-card border-b border-dark-border z-50">
        <Link to="/" className="text-neon-blue font-mono font-bold tracking-wider">LEKHAN'S CODEX</Link>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="text-neon-blue" /> : <Menu className="text-neon-blue" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-black/95 backdrop-blur-xl border-r border-dark-border
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-dark-border hidden md:block">
            <h1 className="text-xl font-bold font-mono text-neon-blue tracking-widest">
              <Link to="/">LEKHAN'S CODEX</Link>
            </h1>
            <p className="text-xs text-gray-500 mt-1">v2.5.0 [ULTRA_EXPANDED]</p>
          </div>

          <div className="p-4">
             <Link 
                to="/"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 border border-transparent ${
                  location.pathname === '/' ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5 mr-3" />
                <span className="font-mono text-sm">Dashboard</span>
             </Link>
              <Link 
                to="/knowledge-map"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center p-3 mb-4 rounded-lg transition-all duration-200 border border-transparent ${
                  location.pathname === '/knowledge-map' ? 'bg-neon-purple/10 border-neon-purple text-neon-purple' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Search className="w-5 h-5 mr-3" />
                <span className="font-mono text-sm">Knowledge Map</span>
             </Link>

             <div className="mb-2 text-xs font-bold text-gray-600 uppercase tracking-widest px-3">Domains</div>
             
             <div className="space-y-1 overflow-y-auto h-[calc(100vh-280px)] custom-scrollbar pr-2">
                {domains.map((domain) => (
                  <Link
                    key={domain.id}
                    to={`/domain/${domain.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center p-2.5 rounded-md transition-colors text-sm ${
                      location.pathname === `/domain/${domain.id}` 
                        ? 'bg-white/10 text-neon-blue' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
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
      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen overflow-y-auto overflow-x-hidden relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
         <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-slate-900 -z-10" />
         {children}
      </main>
    </div>
  );
};

export default Layout;