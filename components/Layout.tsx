import React, { useMemo, useState } from 'react';
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
  { label: 'Knowledge Map', to: '/map', icon: <Map className="h-4 w-4" /> },
  { label: 'Oracle', to: '/oracle', icon: <Sparkles className="h-4 w-4" /> },
  { label: 'Arena', to: '/arena', icon: <Flame className="h-4 w-4" /> },
  { label: 'Grimoire', to: '/grimoire', icon: <BookOpenText className="h-4 w-4" /> },
  { label: 'Observatory', to: '/observatory', icon: <Telescope className="h-4 w-4" /> },
  { label: 'Forge', to: '/forge', icon: <Hammer className="h-4 w-4" /> },
  { label: 'Cartography', to: '/cartography', icon: <Compass className="h-4 w-4" /> },
  { label: 'Dashboard', to: '/dashboard', icon: <BarChart3 className="h-4 w-4" /> },
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
      <CosmicCanvas />
      <ScrollProgress />

      {isReadOnly && (
        <div className="fixed left-1/2 top-2 z-[1001] -translate-x-1/2 rounded-full border border-[#c9a84c]/60 bg-black/80 px-4 py-1 text-xs tracking-wide text-[#e7cb8d] backdrop-blur">
          Viewing Lekhan&apos;s Progress
        </div>
      )}

      <header className="glass-panel fixed left-0 right-0 top-0 z-[1000] flex h-14 items-center justify-between border-b px-4 md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="glass-button rounded-md p-2 transition"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <Link to="/" className="font-mono text-sm tracking-[0.24em] text-[#c9a84c]">
          CODEX
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copyShareUrl}
            className="glass-button rounded-md p-2 transition"
            aria-label="Share progress"
          >
            {shareCopied ? <Copy className="h-4 w-4 text-[#c9a84c]" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="glass-button rounded-md p-2 transition"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-[#c9a84c]" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <aside
        className={`glass-panel-strong fixed inset-y-0 left-0 z-[999] w-[290px] border-r transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="hidden items-center justify-between border-b border-[var(--codex-border)] px-5 py-5 md:flex">
            <Link to="/" className="font-mono text-sm tracking-[0.28em] text-[#c9a84c]">
              OMNIVERSAL CODEX
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="glass-button rounded-md p-2 transition"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-[#c9a84c]" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-16 flex-1 overflow-y-auto px-4 pb-4 md:mt-0">
            <div className="mb-3 px-2 pt-4 text-xs uppercase tracking-[0.2em] text-[var(--codex-text-soft)]">Navigation</div>
            <div className="space-y-1.5">
              {mainNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                    isActive(item.to)
                      ? 'border-[#c9a84c]/60 bg-[#c9a84c]/10 text-[#c9a84c]'
                      : 'border-transparent text-[var(--codex-text)] hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-6 mb-3 px-2 text-xs uppercase tracking-[0.2em] text-[var(--codex-text-soft)]">Domains</div>
            <div className="space-y-1.5 pb-8">
              {masteryDomains.map((domain) => (
                <Link
                  key={domain.id}
                  to={`/domain/${domain.id}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                    location.pathname === `/domain/${domain.id}`
                      ? 'bg-[#c9a84c]/12 text-[#c9a84c]'
                      : 'text-[var(--codex-text-soft)] hover:bg-white/10'
                  }`}
                >
                  <span className="text-[#c9a84c]">{getIcon(domain.icon, 'h-4 w-4')}</span>
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

      <main className="relative z-10 flex-1 overflow-x-hidden overflow-y-auto pt-14 md:pt-0">{children}</main>
    </div>
  );
};

export default Layout;
