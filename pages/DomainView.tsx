import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../components/Icons';
import Accordion from '../components/Accordion';
import { ArrowLeft, ArrowRight, Box, Layers, Activity, BookOpen } from 'lucide-react';
import { DOMAIN_COLORS, masteryDomains } from '../utils/codex';

const DomainView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const domainId = parseInt(id || '0');
  const domain = masteryDomains.find(d => d.id === domainId);
  const [activeTab, setActiveTab] = useState<'subjects' | 'resources'>('subjects');

  if (!domain || domain.isLocked) {
    return <Navigate to="/" />;
  }

  const maxDomainId = masteryDomains[masteryDomains.length - 1]?.id ?? 20;
  const prevDomain = domainId > 1 ? domainId - 1 : null;
  const nextDomain = domainId < maxDomainId ? domainId + 1 : null;
  const domainColor = DOMAIN_COLORS[domain.id] ?? '#c9a84c';

  // Default resources if not provided
  const defaultResources = [
    { title: 'Foundational Textbook', author: 'Various Authors' },
    { title: 'Advanced Course Materials', author: 'Online Platforms' },
    { title: 'Research Papers & Articles', author: 'Academic Journals' },
  ];

  const resources = domain.resources || defaultResources;

  return (
    <div className="relative z-10 pb-20">
      {/* Header */}
      <div className="glass-panel-strong relative border-b border-[var(--codex-border)] p-6 md:p-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex items-center space-x-2 font-mono text-sm text-[var(--codex-text-soft)]">
            <Link to="/" className="transition hover:text-[#c9a84c]">
              CODEX
            </Link>
            <span>/</span>
            <span>DOMAIN_{String(domain.id).padStart(2, '0')}</span>
          </div>
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="rounded-xl border p-4 shadow-[0_0_24px_rgba(201,168,76,0.18)]" style={{ borderColor: `${domainColor}80`, background: `${domainColor}18`, color: domainColor }}>
              {getIcon(domain.icon, 'h-12 w-12')}
            </div>
            <div>
              <h1 className="mb-4 text-3xl font-bold text-[var(--codex-text)] md:text-5xl">{domain.title}</h1>
              <p className="max-w-3xl text-xl text-[var(--codex-text-soft)]">{domain.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 p-6 md:p-12">
        {/* Section 1: Core Pillars */}
        <section>
          <div className="mb-6 flex items-center">
            <Box className="mr-3 h-6 w-6" style={{ color: domainColor }} />
            <h2 className="text-2xl font-bold text-[var(--codex-text)]">1. Core Meta-Structure</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {domain.pillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="glass-panel rounded-xl p-4"
              >
                <span className="mb-1 block font-mono text-sm" style={{ color: domainColor }}>
                  Pillar 0{idx + 1}
                </span>
                <p className="font-medium text-[var(--codex-text)]">{pillar}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2: Subdomains with Tabs */}
        <section>
          <div className="mb-6 flex items-center">
            <Layers className="mr-3 h-6 w-6" style={{ color: domainColor }} />
            <h2 className="text-2xl font-bold text-[var(--codex-text)]">2. Full Subdomain Expansion</h2>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-[var(--codex-border)] pb-2">
            <button
              onClick={() => setActiveTab('subjects')}
              className={`glass-button rounded-md px-4 py-2 font-mono text-sm transition ${activeTab === 'subjects' ? 'border-[#c9a84c]/60 bg-[#c9a84c]/14 text-[#c9a84c]' : 'text-[var(--codex-text-soft)]'}`}
            >
              Subjects
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`glass-button rounded-md px-4 py-2 font-mono text-sm transition ${activeTab === 'resources' ? 'border-[#c9a84c]/60 bg-[#c9a84c]/14 text-[#c9a84c]' : 'text-[var(--codex-text-soft)]'}`}
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
                  className="glass-panel rounded-xl border-l-4 p-5"
                  style={{ borderLeftColor: domainColor }}
                >
                  <div className="flex items-start gap-4">
                    <BookOpen className="mt-1 h-6 w-6 shrink-0" style={{ color: domainColor }} />
                    <div>
                      <h3 className="mb-1 text-lg font-bold" style={{ color: domainColor }}>
                        {resource.title}
                      </h3>
                      <p className="text-sm text-[var(--codex-text-soft)]">{resource.author}</p>
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
            <div className="mb-6 flex items-center">
              <Activity className="mr-3 h-6 w-6" style={{ color: domainColor }} />
              <h2 className="text-2xl font-bold text-[var(--codex-text)]">3. Advanced Mastery Layers</h2>
            </div>
            <div className="space-y-4">
              {domain.advancedLayers.map((layer, idx) => (
                <div key={idx} className="glass-panel flex flex-col rounded-xl border-l-4 p-5 md:flex-row md:items-center" style={{ borderLeftColor: domainColor }}>
                  <div className="mb-1 font-mono font-bold md:mb-0 md:w-1/4" style={{ color: domainColor }}>
                    Layer {idx + 1}: {layer.name}
                  </div>
                  <div className="md:w-3/4 text-[var(--codex-text)]">{layer.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Tracks */}
        {domain.tracks && (
          <section>
            <div className="mb-6 flex items-center">
              <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold" style={{ borderColor: domainColor, color: domainColor }}>
                4
              </div>
              <h2 className="text-2xl font-bold text-[var(--codex-text)]">Professional Mastery Tracks</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {domain.tracks.map((track, idx) => (
                <div key={idx} className="glass-panel rounded-xl p-6">
                  <h3 className="mb-2 text-xl font-bold text-[var(--codex-text)]">
                    Track {String.fromCharCode(65 + idx)}: {track.name}
                  </h3>
                  <p className="text-sm text-[var(--codex-text-soft)]">{track.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Navigation Footer */}
        <div className="flex justify-between border-t border-[var(--codex-border)] pt-12">
          {prevDomain ? (
            <Link to={`/domain/${prevDomain}`} className="group flex items-center text-[var(--codex-text-soft)] transition hover:text-[#c9a84c]">
              <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <div className="text-left">
                <div className="text-xs font-mono">PREVIOUS</div>
                <div className="font-bold">Domain {prevDomain}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextDomain ? (
            <Link to={`/domain/${nextDomain}`} className="group flex items-center text-right text-[var(--codex-text-soft)] transition hover:text-[#c9a84c]">
              <div className="text-right">
                <div className="text-xs font-mono">NEXT</div>
                <div className="font-bold">Domain {nextDomain}</div>
              </div>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainView;
