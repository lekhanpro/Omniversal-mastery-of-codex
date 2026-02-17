import React, { useEffect } from 'react';
import { Orbit } from 'lucide-react';
import ConstellationMap from '../components/ConstellationMap';
import { appendActivity, masteryDomains } from '../utils/codex';

const KnowledgeMap: React.FC = () => {
  useEffect(() => {
    const views = Number.parseInt(localStorage.getItem('codex_map_views') ?? '0', 10) + 1;
    localStorage.setItem('codex_map_views', String(views));
    appendActivity(
      'map',
      masteryDomains.map((domain) => domain.id),
      'Opened knowledge map'
    );
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-3 pb-8 pt-4 md:px-6 md:pt-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="glass-panel rounded-lg border p-2 text-[#e4ca87]">
          <Orbit className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-cinzel text-2xl text-[var(--codex-text)] md:text-3xl">Knowledge Map</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--codex-text-soft)]">Force-Directed Constellation • 20 Domains</p>
        </div>
      </div>
      <ConstellationMap />
    </div>
  );
};

export default KnowledgeMap;
