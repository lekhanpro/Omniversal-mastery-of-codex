import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { domains } from '../data';
import { getIcon } from '../components/Icons';
import { Search, Quote } from 'lucide-react';
import QuotesRotator from '../components/QuotesRotator';

const Home: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredDomains = domains.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.shortDescription.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 font-mono tracking-tighter">
          <span className="text-neon-blue">OMNIVERSAL MASTERY OF</span> CODEX
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          A comprehensive digital library for personal evolution, future intelligence, and high-performance skill building.
        </p>
        
        <div className="mt-8 relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search protocols, skills, and domains..."
            className="block w-full pl-10 pr-3 py-3 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Domain Cards */}
      <section id="domains" className="mb-16">
        <h2 className="text-3xl font-bold text-neon-blue mb-8 text-center font-mono">Knowledge Domains</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDomains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link 
                to={domain.isLocked ? '#' : `/domain/${domain.id}`}
                className={`block h-full p-6 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm group relative overflow-hidden ${
                  domain.isLocked ? 'cursor-not-allowed opacity-60' : 'hover:border-neon-blue hover:shadow-md transition-all duration-300'
                }`}
              >
                 {!domain.isLocked && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-neon-blue/10 to-transparent rounded-bl-full -mr-8 -mt-8 group-hover:-mr-4 group-hover:-mt-4 transition-all duration-500" />}
                
                <div className="flex items-start justify-between mb-4">
                   <div className={`p-3 rounded-lg ${domain.isLocked ? 'bg-gray-200 dark:bg-gray-800 text-gray-500' : 'bg-neon-blue/10 text-neon-blue'}`}>
                      {getIcon(domain.icon)}
                   </div>
                   <span className="font-mono text-xs text-gray-400 dark:text-gray-500">D-{String(domain.id).padStart(2, '0')}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-neon-blue transition-colors">
                  {domain.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {domain.shortDescription}
                </p>

                {domain.isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-[1px]">
                        <div className="px-3 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">
                            Encrypted
                        </div>
                    </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quotes Rotator */}
      <section id="quotes" className="mb-16">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Quote className="w-8 h-8 text-neon-green" />
          <h2 className="text-3xl font-bold text-neon-green text-center font-mono">Codex Quotes</h2>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-8 shadow-sm">
          <QuotesRotator />
        </div>
      </section>
    </div>
  );
};

export default Home;