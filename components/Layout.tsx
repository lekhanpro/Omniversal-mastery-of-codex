import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  BookOpenText,
  Compass,
  Copy,
  Flame,
  Hammer,
  Home,
  Map,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Telescope,
  X,
} from 'lucide-react';
import { getIcon } from './Icons';
import { useTheme } from '../contexts/ThemeContext';
import CosmicCanvas from './CosmicCanvas';
import ScrollProgress from './ScrollProgress';
import { useShareProgress } from '../contexts/ShareProgressContext';
import { encodeSharePayload, masteryDomains, withShareParam } from '../utils/codex';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const mainNav: NavItem[] = [
  { label: 'Home', to: '/', icon: <Home className="h-4 w-4" /> },
  { label: 'Codex Features', to: '/features', icon: <Compass className="h-4 w-4" /> },
  { label: 'The Oracle', to: '/oracle', icon: <Sparkles className="h-4 w-4" /> },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { isReadOnly } = useShareProgress();

  const totalSubjects = useMemo(
    () => masteryDomains.reduce((sum, domain) => sum + domain.subdomains.reduce((acc, sub) => acc + sub.points.length, 0), 0),
    []
  );
  const totalDomains = masteryDomains.length;

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const copyShareUrl = async (): Promise<void> => {
    const url = withShareParam(encodeSharePayload());
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      window.prompt('Copy this share URL:', url);
    }
  };

  const isActive = (target: string): boolean =>
    target === '/' ? location.pathname === '/' : location.pathname.startsWith(target);

  return (
    <div className="relative flex min-h-[100dvh] text-[var(--codex-text)]">
      <CosmicCanvas isDark={isDark} />
      <ScrollProgress />

      {isReadOnly && (
        <div className="glass-panel fixed left-1/2 top-2 z-[1001] -translate-x-1/2 rounded-full border border-[var(--codex-border)] px-4 py-1 text-xs tracking-wide text-[var(--codex-text)]">
          Viewing Lekhan&apos;s Progress
        </div>
      )}

      <header className="glass-panel fixed left-0 right-0 top-0 z-[1000] flex h-16 items-center justify-between border-b border-[var(--codex-border)] px-4 md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="glass-button rounded-xl p-2"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link to="/" className="font-cinzel text-sm tracking-[0.14em] text-[var(--codex-text-strong)]">
          OMNIVERSAL CODEX
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copyShareUrl}
            className="glass-button rounded-xl p-2"
            aria-label="Share progress"
          >
            {shareCopied ? <Copy className="h-4 w-4 text-[var(--codex-primary)]" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="glass-button rounded-xl p-2"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-[var(--codex-gold)]" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <aside
        className={`glass-panel-strong fixed inset-y-0 left-0 z-[999] w-[304px] border-r border-[var(--codex-border)] transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(76,99,255,0.28),transparent_68%)]" />
          <div className="absolute -bottom-24 right-2 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.2),transparent_72%)]" />
        </div>

        <div className="relative flex h-full flex-col">
          <div className="hidden items-center justify-between border-b border-[var(--codex-border)] px-5 py-5 md:flex">
            <Link to="/" className="font-cinzel text-sm tracking-[0.16em] text-[var(--codex-text-strong)]">
              OMNIVERSAL CODEX
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="glass-button inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4 text-[var(--codex-gold)]" /> Light
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" /> Dark
                </>
              )}
            </button>
          </div>

          <div className="mt-16 flex-1 overflow-y-auto px-4 pb-4 md:mt-0">
            <div className="mb-3 px-2 pt-4 text-xs uppercase tracking-[0.2em] text-[var(--codex-text-soft)]">Navigation</div>
            <div className="space-y-1.5">
              {mainNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition ${isActive(item.to)
                    ? 'border-[var(--codex-primary)]/45 bg-[linear-gradient(135deg,rgba(76,99,255,0.18),rgba(201,168,76,0.14))] text-[var(--codex-text-strong)] shadow-[0_10px_24px_rgba(76,99,255,0.18)]'
                    : 'border-transparent text-[var(--codex-text)] hover:border-[var(--codex-border)] hover:bg-white/10'
                    }`}
                >
                  <span className={`rounded-lg p-1 ${isActive(item.to) ? 'bg-white/20' : 'bg-transparent group-hover:bg-white/10'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mb-3 mt-6 px-2 text-xs uppercase tracking-[0.2em] text-[var(--codex-text-soft)]">Domains</div>
            <div className="space-y-1.5 pb-8">
              {masteryDomains.map((domain) => (
                <Link
                  key={domain.id}
                  to={`/domain/${domain.id}`}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${location.pathname === `/domain/${domain.id}`
                    ? 'border-[var(--codex-primary)]/45 bg-white/20 text-[var(--codex-text-strong)]'
                    : 'border-transparent text-[var(--codex-text-soft)] hover:border-[var(--codex-border)] hover:bg-white/10'
                    }`}
                >
                  <span className="text-[var(--codex-primary)]">{getIcon(domain.icon, 'h-4 w-4')}</span>
                  <span className="truncate">{domain.id}. {domain.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--codex-border)] px-4 py-3 text-[11px] text-[var(--codex-text-soft)]">
            CODEX v2.0 | {totalSubjects} Subjects | {totalDomains} Domains | Knowledge is the only infinity
          </div>
        </div>
      </aside>

      <main className="relative z-10 flex flex-1 flex-col overflow-x-hidden pt-16 md:pt-0">{children}</main>
    </div>
  );
};

export default Layout;
