import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { domains } from '../data';
import { getIcon } from '../components/Icons';
import Accordion from '../components/Accordion';
import { ArrowLeft, ArrowRight, Box, Layers, Activity, BookOpen } from 'lucide-react';
import { masteryDomains } from '../utils/codex';

const DomainView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const domainId = parseInt(id || '0');
  const domain = masteryDomains.find(d => d.id === domainId);
  const [activeTab, setActiveTab] = useState<'subjects' | 'resources'>('subjects');

  if (!domain || domain.isLocked) {
    return <Navigate to="/" />;
  }

  const maxDomainId = masteryDomains[masteryDomains.length - 1]?.id ?? 17;
  const prevDomain = domainId > 1 ? domainId - 1 : null;
  const nextDomain = domainId < maxDomainId ? domainId + 1 : null;

  // Default resources if not provided
  const defaultResources = [
    { title: "Foundational Textbook", author: "Various Authors" },
    { title: "Advanced Course Materials", author: "Online Platforms" },
    { title: "Research Papers & Articles", author: "Academic Journals" }
  ];

  const resources = domain.resources || defaultResources;

  return (
    <div className="pb-20 relative z-10">
       {/* Header */}
       <div className="relative p-6 md:p-12 border-b border-dark-border bg-black/40 backdrop-blur-md">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-2 text-neon-blue font-mono text-sm mb-4">
                <Link to="/" className="hover:underline">CODEX</Link>
                <span>/</span>
                <span>DOMAIN_{String(domain.id).padStart(2, '0')}</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
                <div className="p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-xl text-neon-blue">
                    {getIcon(domain.icon, "w-12 h-12")}
                </div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{domain.title}</h1>
                    <p className="text-xl text-gray-400 max-w-3xl">{domain.shortDescription}</p>
                </div>
            </div>
          </div>
       </div>

       <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-16">
          
          {/* Section 1: Core Pillars */}
          <section>
              <div className="flex items-center mb-6">
                  <Box className="w-6 h-6 text-neon-purple mr-3" />
                  <h2 className="text-2xl font-bold text-gray-100">1. Core Meta-Structure</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {domain.pillars.map((pillar, idx) => (
                     <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 border border-dark-border bg-dark-card rounded-lg hover:bg-white/5 transition-colors"
                     >
                         <span className="text-neon-purple font-mono text-sm block mb-1">Pillar 0{idx + 1}</span>
                         <p className="text-gray-300 font-medium">{pillar}</p>
                     </motion.div>
                 ))}
              </div>
          </section>

          {/* Section 2: Subdomains with Tabs */}
          <section>
              <div className="flex items-center mb-6">
                  <Layers className="w-6 h-6 text-neon-blue mr-3" />
                  <h2 className="text-2xl font-bold text-gray-100">2. Full Subdomain Expansion</h2>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b border-dark-border">
                <button
                  onClick={() => setActiveTab('subjects')}
                  className={`px-6 py-3 font-mono transition-all ${
                    activeTab === 'subjects'
                      ? 'text-neon-blue border-b-2 border-neon-blue'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Subjects
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-6 py-3 font-mono transition-all ${
                    activeTab === 'resources'
                      ? 'text-neon-blue border-b-2 border-neon-blue'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Resources
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'subjects' ? (
                <div className="space-y-4">
                    {domain.subdomains.map((topic, idx) => (
                        <Accordion key={idx} topic={topic} index={idx} domainId={domainId} />
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 border-l-4 border-neon-blue bg-dark-card/50 rounded-r-lg"
                    >
                      <div className="flex items-start gap-4">
                        <BookOpen className="w-6 h-6 text-neon-blue flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-lg font-bold text-neon-blue mb-1">{resource.title}</h3>
                          <p className="text-gray-400 text-sm">{resource.author}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
          </section>

          {/* Section 3: Advanced Layers */}
          {domain.advancedLayers && (
              <section>
                  <div className="flex items-center mb-6">
                      <Activity className="w-6 h-6 text-neon-green mr-3" />
                      <h2 className="text-2xl font-bold text-gray-100">3. Advanced Mastery Layers</h2>
                  </div>
                  <div className="space-y-4">
                      {domain.advancedLayers.map((layer, idx) => (
                          <div key={idx} className="flex flex-col md:flex-row md:items-center p-5 border-l-4 border-neon-green bg-dark-card/30 rounded-r-lg">
                              <div className="md:w-1/4 font-bold text-neon-green font-mono mb-1 md:mb-0">Layer {idx + 1}: {layer.name}</div>
                              <div className="md:w-3/4 text-gray-300">{layer.description}</div>
                          </div>
                      ))}
                  </div>
              </section>
          )}

          {/* Section 4: Tracks */}
          {domain.tracks && (
              <section>
                  <div className="flex items-center mb-6">
                       <div className="w-6 h-6 rounded-full border-2 border-white mr-3 flex items-center justify-center text-[10px] font-bold">4</div>
                      <h2 className="text-2xl font-bold text-gray-100">Professional Mastery Tracks</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {domain.tracks.map((track, idx) => (
                          <div key={idx} className="p-6 border border-gray-800 bg-gradient-to-br from-gray-900 to-black rounded-xl">
                              <h3 className="text-xl font-bold text-white mb-2">Track {String.fromCharCode(65+idx)}: {track.name}</h3>
                              <p className="text-gray-400 text-sm">{track.description}</p>
                          </div>
                      ))}
                  </div>
              </section>
          )}

          {/* Navigation Footer */}
          <div className="flex justify-between pt-12 border-t border-dark-border">
              {prevDomain ? (
                  <Link to={`/domain/${prevDomain}`} className="flex items-center text-gray-400 hover:text-neon-blue transition-colors group">
                      <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                      <div className="text-left">
                          <div className="text-xs font-mono">PREVIOUS</div>
                          <div className="font-bold">Domain {prevDomain}</div>
                      </div>
                  </Link>
              ) : <div />}

              {nextDomain ? (
                   <Link to={`/domain/${nextDomain}`} className="flex items-center text-gray-400 hover:text-neon-blue transition-colors group text-right">
                      <div className="text-right">
                          <div className="text-xs font-mono">NEXT</div>
                          <div className="font-bold">Domain {nextDomain}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                   </Link>
              ) : <div />}
          </div>
       </div>
    </div>
  );
};

export default DomainView;
