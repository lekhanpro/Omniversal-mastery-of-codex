import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles, Target } from 'lucide-react';
import { getIcon } from '../components/Icons';
import QuotesRotator from '../components/QuotesRotator';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useShareProgress } from '../contexts/ShareProgressContext';
import { DOMAIN_COLORS, getAllDomainProgress, getDomainById, masteryDomains } from '../utils/codex';

interface CrossInsight {
  id: number;
  leftDomain: number;
  rightDomain: number;
  bridge: string;
}

const CROSS_DOMAIN_INSIGHTS: CrossInsight[] = [
  { id: 1, leftDomain: 1, rightDomain: 2, bridge: 'Breath mechanics in combat mirrors attentional control loops in cognition.' },
  { id: 2, leftDomain: 2, rightDomain: 3, bridge: 'Chunking in learning maps directly to reusable software abstractions.' },
  { id: 3, leftDomain: 3, rightDomain: 6, bridge: 'System reliability and business resilience are the same architecture question.' },
  { id: 4, leftDomain: 4, rightDomain: 15, bridge: 'Robot path planning and graph optimization share the same search backbone.' },
  { id: 5, leftDomain: 5, rightDomain: 7, bridge: 'Ethics without rhetoric fails; rhetoric without ethics manipulates.' },
  { id: 6, leftDomain: 6, rightDomain: 11, bridge: 'Macro strategy must model geopolitics as a delayed, nonlinear market force.' },
  { id: 7, leftDomain: 7, rightDomain: 8, bridge: 'Narrative framing changes biological stress response through perceived agency.' },
  { id: 8, leftDomain: 8, rightDomain: 17, bridge: 'Planetary health starts with cellular adaptation and scales upward.' },
  { id: 9, leftDomain: 9, rightDomain: 3, bridge: 'Secure-by-design thinking is just defensive architecture at code level.' },
  { id: 10, leftDomain: 10, rightDomain: 4, bridge: 'Future scenarios are useful only when anchored to physical constraints.' },
  { id: 11, leftDomain: 11, rightDomain: 14, bridge: 'Policy feedback loops behave like control systems under public pressure.' },
  { id: 12, leftDomain: 12, rightDomain: 2, bridge: 'Meta-learning sharpens metacognition by exposing hidden cognitive defaults.' },
  { id: 13, leftDomain: 13, rightDomain: 7, bridge: 'Creative impact scales with narrative precision and emotional timing.' },
  { id: 14, leftDomain: 14, rightDomain: 6, bridge: 'Institutional budgeting is game theory with delayed human consequences.' },
  { id: 15, leftDomain: 15, rightDomain: 3, bridge: 'Algorithmic complexity determines product possibility before design starts.' },
  { id: 16, leftDomain: 16, rightDomain: 9, bridge: 'Social engineering exploits the same trust channels security teams defend.' },
  { id: 17, leftDomain: 17, rightDomain: 5, bridge: 'Sustainability is applied ethics under ecological constraints.' },
  { id: 18, leftDomain: 1, rightDomain: 3, bridge: 'Biomechanics and UI ergonomics both optimize friction for repeatable flow.' },
  { id: 19, leftDomain: 4, rightDomain: 10, bridge: 'Automation maturity is a predictor of future strategic advantage.' },
  { id: 20, leftDomain: 12, rightDomain: 15, bridge: 'Learning systems and compute systems both fail under unobserved bottlenecks.' },
];

const seededPick = <T,>(items: T[], count: number, seedSource: string): T[] => {
  const seed = seedSource.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = (seed + index * 37) % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy.slice(0, count);
};

const arcPath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number): string => {
  const start = {
    x: cx + r * Math.cos(startAngle),
    y: cy + r * Math.sin(startAngle),
  };
  const end = {
    x: cx + r * Math.cos(endAngle),
    y: cy + r * Math.sin(endAngle),
  };
  const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

const Home: React.FC = () => {
  const { isReadOnly, sharedProgress } = useShareProgress();
  const [search, setSearch] = useState('');
  const [expandedDomainId, setExpandedDomainId] = useState<number | null>(null);
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const domainCardRefs = useRef<Array<HTMLElement | null>>([]);

  const domainProgress = useMemo(
    () => getAllDomainProgress(isReadOnly ? sharedProgress : undefined),
    [isReadOnly, sharedProgress]
  );

  const filteredDomains = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return masteryDomains;
    return masteryDomains.filter((domain) => {
      if (domain.title.toLowerCase().includes(needle) || domain.shortDescription.toLowerCase().includes(needle)) {
        return true;
      }
      return domain.subdomains.some((subdomain) => subdomain.title.toLowerCase().includes(needle));
    });
  }, [search]);

  const dailyInsights = useMemo(() => seededPick(CROSS_DOMAIN_INSIGHTS, 5, new Date().toDateString()), []);

  const todayFocus = useMemo(() => {
    const sorted = [...domainProgress].sort((left, right) => left.completion - right.completion);
    const focusDomainProgress = sorted[0];
    if (!focusDomainProgress) return null;
    const focusDomain = getDomainById(focusDomainProgress.domainId);
    if (!focusDomain) return null;

    const unchecked: string[] = [];
    focusDomain.subdomains.forEach((subdomain, subIndex) => {
      subdomain.points.forEach((point, pointIndex) => {
        const key = `codex_d${focusDomain.id}_s${subIndex}_p${pointIndex}`;
        const checked = isReadOnly ? sharedProgress[key] === 'true' : localStorage.getItem(key) === 'true';
        if (!checked) unchecked.push(point);
      });
    });

    return {
      domain: focusDomain,
      subjects: seededPick(unchecked, 3, `${new Date().toDateString()}-${focusDomain.id}`),
      completion: focusDomainProgress.completion,
    };
  }, [domainProgress, isReadOnly, sharedProgress]);

  useKeyboardShortcuts({
    domainCardRefs,
    onFocusSearch: () => searchInputRef.current?.focus(),
    onEscape: () => {
      setSearch('');
      setExpandedDomainId(null);
      window.dispatchEvent(new Event('codex-collapse-all'));
    },
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveInsightIndex((current) => (current + 1) % Math.max(1, dailyInsights.length));
    }, 8000);
    return () => window.clearInterval(interval);
  }, [dailyInsights.length]);



  const totalCompletion = domainProgress.reduce((sum, domain) => sum + domain.completion, 0) / Math.max(1, domainProgress.length);

  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-8 md:py-12">
      <section className="glass-panel mb-8 rounded-3xl p-6">
        <h1 className="hero-shimmer font-cinzel text-3xl font-bold tracking-wide text-[var(--codex-text-strong)] md:text-5xl">
          Omniversal Mastery of Codex
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-[var(--codex-text-soft)] md:text-base">
          Navigate your 20-domain mastery architecture. Use keyboard shortcuts: <span className="font-mono text-[var(--codex-primary)]">1-0</span> jump to cards,
          <span className="font-mono text-[var(--codex-primary)]"> / </span> focus search, <span className="font-mono text-[var(--codex-primary)]">Esc</span> clear.
        </p>
        <div className="relative mt-6 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--codex-text-muted)]" />
          <input
            ref={searchInputRef}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search domain, subdomain, concept..."
            className="w-full rounded-full border border-[var(--codex-border)] bg-[rgba(var(--codex-surface-rgb),0.54)] py-3 pl-10 pr-4 text-sm text-[var(--codex-text)] outline-none ring-0 transition focus:border-[var(--codex-primary)] focus:shadow-[0_0_0_2px_rgba(76,99,255,0.24)]"
          />
        </div>
      </section>

      {todayFocus && (
        <section className="glass-panel mb-8 rounded-3xl border border-[var(--codex-primary)]/20 p-6">
          <div className="mb-3 flex items-center gap-2 text-[var(--codex-primary)]">
            <Target className="h-4 w-4" />
            <h2 className="font-cinzel text-xl">Today&apos;s Focus</h2>
          </div>
          <p className="mb-2 text-sm text-[var(--codex-text)]">
            Lowest completion domain: <span className="font-semibold text-[var(--codex-primary)]">{todayFocus.domain.title}</span> ({todayFocus.completion.toFixed(1)}%)
          </p>
          <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-[var(--codex-text)]">
            {todayFocus.subjects.map((subject) => (
              <li key={subject}>{subject}</li>
            ))}
          </ul>
          <Link
            to={`/domain/${todayFocus.domain.id}`}
            className="glass-button inline-flex items-center rounded-xl border border-[var(--codex-primary)]/45 bg-[var(--codex-primary)]/10 px-4 py-2 text-sm text-[var(--codex-primary)] transition hover:bg-[var(--codex-primary)]/20"
          >
            Begin Study
          </Link>
        </section>
      )}

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-cinzel text-2xl text-[var(--codex-text-strong)]">Domains</h2>
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--codex-text-soft)]">{filteredDomains.length} visible</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDomains.map((domain, index) => {
            const progress = domainProgress.find((entry) => entry.domainId === domain.id);
            const completion = progress?.completion ?? 0;
            const accent = DOMAIN_COLORS[domain.id] ?? '#c9a84c';
            const expanded = expandedDomainId === domain.id;
            return (
              <motion.article
                key={domain.id}
                ref={(element) => {
                  domainCardRefs.current[index] = element;
                }}
                layout
                className="glass-panel overflow-hidden rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => setExpandedDomainId((current) => (current === domain.id ? null : domain.id))}
                  className="flex w-full items-start gap-4 p-4 text-left"
                >
                  <div
                    className="rounded-lg border p-2"
                    style={{ borderColor: `${accent}66`, color: accent, backgroundColor: `${accent}12` }}
                  >
                    {getIcon(domain.icon, 'h-5 w-5')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-[var(--codex-text-strong)]">{domain.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--codex-text-soft)]">{domain.shortDescription}</p>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${completion}%`, backgroundColor: accent }} />
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-[var(--codex-border)] px-4 pb-4 pt-3"
                    >
                      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--codex-text-soft)]">Top Subdomains</p>
                      <ul className="mb-3 space-y-1 text-sm text-[var(--codex-text)]">
                        {domain.subdomains.slice(0, 3).map((subdomain) => (
                          <li key={subdomain.title}>* {subdomain.title}</li>
                        ))}
                      </ul>
                      <Link
                        to={`/domain/${domain.id}`}
                        className="glass-button inline-flex rounded-lg border px-3 py-1.5 text-xs uppercase tracking-wide text-[var(--codex-text)] transition hover:border-[var(--codex-primary)] hover:text-[var(--codex-primary)]"
                      >
                        Open Domain
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="mb-10 grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="glass-panel rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2 text-[var(--codex-primary)]">
            <Sparkles className="h-4 w-4" />
            <h3 className="font-cinzel text-xl">Cross-Domain Insights</h3>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={dailyInsights[activeInsightIndex]?.id ?? 0}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 text-sm text-[var(--codex-text)]"
            >
              {dailyInsights[activeInsightIndex]?.bridge}
            </motion.p>
          </AnimatePresence>
          <div className="grid gap-2 sm:grid-cols-2">
            {dailyInsights.map((insight) => (
              <div key={insight.id} className="rounded-lg border border-[var(--codex-border)] bg-white/10 px-3 py-2 text-xs text-[var(--codex-text)]">
                D{insight.leftDomain} - D{insight.rightDomain}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h3 className="mb-3 font-cinzel text-xl text-[var(--codex-text-strong)]">Mastery Arc</h3>
          <div className="mx-auto w-full max-w-[340px]">
            <svg viewBox="0 0 360 220" className="w-full">
              <path d={arcPath(180, 180, 120, Math.PI, 0)} stroke="rgba(255,255,255,0.12)" strokeWidth="14" fill="none" />
              {domainProgress.map((domain, index) => {
                const segment = Math.PI / domainProgress.length;
                const gap = segment * 0.18;
                const start = Math.PI - segment * index + gap / 2;
                const end = Math.PI - segment * (index + 1) - gap / 2;
                const alpha = 0.25 + (domain.completion / 100) * 0.75;
                const stroke = DOMAIN_COLORS[domain.domainId] ?? '#c9a84c';
                return (
                  <path
                    key={domain.domainId}
                    d={arcPath(180, 180, 120, start, end)}
                    stroke={stroke}
                    strokeOpacity={alpha}
                    strokeWidth="12"
                    fill="none"
                  />
                );
              })}
              <text x="180" y="168" textAnchor="middle" className="fill-[#e4ca87] font-cinzel text-[30px]">
                {totalCompletion.toFixed(0)}%
              </text>
              <text x="180" y="190" textAnchor="middle" className="fill-[var(--codex-text-soft)] text-[11px] uppercase tracking-[0.25em]">
                Overall Mastery
              </text>
            </svg>
          </div>
        </div>
      </section>

      <section className="glass-panel mb-14 rounded-2xl p-6">
        <h3 className="mb-4 font-cinzel text-xl text-[var(--codex-text-strong)]">Codex Quotes</h3>
        <QuotesRotator />
      </section>

    </div>
  );
};

export default Home;
