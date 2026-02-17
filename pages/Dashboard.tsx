import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, RefreshCcw, Sparkles, Trophy } from 'lucide-react';
import {
  DOMAIN_COLORS,
  getMasteryData,
  masteryDomains,
  readActivityLog,
  readLS,
  uid,
  writeLS,
} from '../utils/codex';

type SortKey = 'domain' | 'completion' | 'quiz' | 'hours' | 'notes';

type SortDirection = 'asc' | 'desc';

interface DomainRow {
  id: number;
  name: string;
  subjectsChecked: number;
  subjectsTotal: number;
  completion: number;
  quizAvg: number;
  hours: number;
  notes: number;
  lastActivity: string;
  status: string;
  activityScore: number;
}

interface ArenaResult {
  id: string;
  mode: 'domain' | 'speed' | 'gauntlet';
  score: number;
  timestamp: number;
  totalQuestions: number;
  correct: number;
  domainScores?: Record<number, { correct: number; total: number }>;
}

interface ActivityDay {
  count: number;
  domains: Set<number>;
  types: Set<string>;
}

interface Achievement {
  id: string;
  name: string;
  check: (rows: DomainRow[], meta: ReturnType<typeof getMasteryData>) => boolean;
}

interface RadarHover {
  row: DomainRow;
  x: number;
  y: number;
}

interface CountCardProps {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  ringPercent?: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_step', name: 'First Step', check: (_, meta) => meta.checkedSubjects >= 1 },
  { id: 'scholar', name: 'Scholar', check: (_, meta) => meta.checkedSubjects >= 50 },
  { id: 'centurion', name: 'Centurion', check: (_, meta) => meta.checkedSubjects >= 100 },
  { id: 'quiz_novice', name: 'Quiz Novice', check: (_, meta) => meta.quizCount >= 1 },
  { id: 'quiz_master', name: 'Quiz Master', check: (_, meta) => meta.quizCount >= 20 },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    check: () => readLS<ArenaResult[]>('arena_results', []).some((entry) => entry.correct === entry.totalQuestions),
  },
  {
    id: 'gauntlet_champion',
    name: 'Gauntlet Champion',
    check: () =>
      readLS<ArenaResult[]>('arena_results', []).some((entry) => entry.mode === 'gauntlet' && entry.correct >= 24),
  },
  { id: 'chronicler', name: 'Chronicler', check: (_, meta) => meta.noteCount >= 10 },
  { id: 'sage', name: 'Sage', check: (_, meta) => meta.noteCount >= 50 },
  {
    id: 'polymath',
    name: 'Polymath',
    check: (rows) => rows.every((row) => row.completion > 0 || row.notes > 0 || row.quizAvg > 0),
  },
  { id: 'streak_7', name: 'Streak 7', check: (_, meta) => meta.currentStreak >= 7 },
  { id: 'streak_30', name: 'Streak 30', check: (_, meta) => meta.currentStreak >= 30 },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    check: () => readLS<ArenaResult[]>('arena_results', []).some((entry) => entry.mode === 'speed' && entry.score >= 2500),
  },
  {
    id: 'connector',
    name: 'Connector',
    check: () => readLS<Array<{ domains: number[] }>>('observatory_resources', []).some((entry) => (entry.domains?.length ?? 0) >= 2),
  },
  {
    id: 'astronomer',
    name: 'Astronomer',
    check: () => Number.parseInt(localStorage.getItem('codex_map_views') ?? '0', 10) >= 10,
  },
  {
    id: 'oracle_seeker',
    name: 'Oracle Seeker',
    check: () => readLS<Array<{ id: string }>>('oracle_sessions', []).length >= 20,
  },
  {
    id: 'deep_diver',
    name: 'Deep Diver',
    check: () => readLS<Array<{ masteryLevel: number }>>('grimoire_notes', []).some((note) => note.masteryLevel === 5),
  },
  { id: 'completionist', name: 'Completionist', check: (rows) => rows.some((row) => row.completion >= 100) },
  { id: 'omniverse', name: 'Omniverse', check: (rows) => rows.every((row) => row.completion >= 50) },
  { id: 'ascended', name: 'Ascended', check: (rows) => rows.every((row) => row.completion >= 90) },
];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const dayKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const arcPath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number): string => {
  const startX = cx + Math.cos(startAngle) * r;
  const startY = cy + Math.sin(startAngle) * r;
  const endX = cx + Math.cos(endAngle) * r;
  const endY = cy + Math.sin(endAngle) * r;
  const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
};

const scoreColor = (score: number): string => {
  if (score >= 85) return '#7cf4be';
  if (score >= 70) return '#e4ca87';
  if (score >= 50) return '#ffb46f';
  return '#ff8383';
};

const CountCard: React.FC<CountCardProps> = ({ label, value, decimals = 0, suffix = '', ringPercent }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    let raf = 0;
    let started = false;

    const animate = (): void => {
      const start = performance.now();
      const duration = 900;

      const step = (time: number): void => {
        const t = clamp((time - start) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(value * eased);
        if (t < 1) {
          raf = window.requestAnimationFrame(step);
        }
      };

      raf = window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          started = true;
          animate();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
    };
  }, [value]);

  const shown = Number(display.toFixed(decimals));
  const showRing = typeof ringPercent === 'number';
  const ringRadius = 20;
  const circumference = 2 * Math.PI * ringRadius;
  const ringDash = circumference - clamp((ringPercent ?? 0) / 100, 0, 1) * circumference;

  return (
    <div ref={cardRef} className="rounded-xl border border-white/12 bg-black/45 p-3">
      <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">{label}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-2xl font-semibold text-[#e4ca87]">
          {shown}
          {suffix}
        </div>
        {showRing && (
          <svg viewBox="0 0 48 48" className="h-11 w-11 -rotate-90">
            <circle cx="24" cy="24" r={ringRadius} stroke="rgba(255,255,255,0.18)" strokeWidth="4" fill="none" />
            <circle
              cx="24"
              cy="24"
              r={ringRadius}
              stroke="#c9a84c"
              strokeWidth="4"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={ringDash}
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const radarRef = useRef<HTMLCanvasElement>(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [radarSeed, setRadarSeed] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>('completion');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [radarHover, setRadarHover] = useState<RadarHover | null>(null);
  const [arcProgress, setArcProgress] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => readLS<string[]>('dashboard_badges', []));
  const [unlockFlash, setUnlockFlash] = useState(false);
  const [burstParticles, setBurstParticles] = useState<Array<{ id: string; angle: number; distance: number }>>([]);

  useEffect(() => {
    const onStorage = (): void => setRefreshTick((value) => value + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1200;

    const step = (time: number): void => {
      const t = clamp((time - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setArcProgress(eased);
      if (t < 1) raf = window.requestAnimationFrame(step);
    };

    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [refreshTick]);

  const mastery = useMemo(() => getMasteryData(), [refreshTick]);
  const activities = useMemo(() => readActivityLog(), [refreshTick]);
  const arenaResults = useMemo(() => readLS<ArenaResult[]>('arena_results', []), [refreshTick]);
  const notes = useMemo(
    () => readLS<Array<{ domain: number; masteryLevel: number; wordCount: number }>>('grimoire_notes', []),
    [refreshTick]
  );

  const domainRows = useMemo<DomainRow[]>(() => {
    const lastByDomain = new Map<number, number>();
    activities.forEach((entry) => {
      entry.domainIds.forEach((domainId) => {
        const current = lastByDomain.get(domainId) ?? 0;
        if (entry.timestamp > current) lastByDomain.set(domainId, entry.timestamp);
      });
    });

    return masteryDomains.map((domain) => {
      const progress = mastery.completionByDomain.find((entry) => entry.domainId === domain.id);
      const noteCount = notes.filter((note) => note.domain === domain.id).length;

      const quiz = arenaResults.reduce(
        (acc, result) => {
          const bucket = result.domainScores?.[domain.id];
          if (!bucket) return acc;
          return { correct: acc.correct + bucket.correct, total: acc.total + bucket.total };
        },
        { correct: 0, total: 0 }
      );

      const activityScore = mastery.domainActivityScore[domain.id] ?? 0;
      const quizAvg = quiz.total > 0 ? (quiz.correct / quiz.total) * 100 : 0;
      const completion = progress?.completion ?? 0;
      const hours = Math.round(noteCount * 1.2 + completion / 8 + activityScore * 0.2 + quiz.total * 0.08);

      return {
        id: domain.id,
        name: domain.title,
        subjectsChecked: progress?.checked ?? 0,
        subjectsTotal: progress?.total ?? 0,
        completion,
        quizAvg,
        hours,
        notes: noteCount,
        lastActivity: lastByDomain.has(domain.id)
          ? new Date(lastByDomain.get(domain.id) ?? Date.now()).toLocaleDateString()
          : '-',
        status: completion >= 90 ? 'Master' : completion >= 60 ? 'Rising' : completion > 0 ? 'Active' : 'Dormant',
        activityScore,
      };
    });
  }, [activities, arenaResults, mastery, notes]);

  const sortedRows = useMemo(() => {
    const items = [...domainRows];
    items.sort((left, right) => {
      const direction = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'domain') return (left.id - right.id) * direction;
      if (sortBy === 'completion') return (left.completion - right.completion) * direction;
      if (sortBy === 'quiz') return (left.quizAvg - right.quizAvg) * direction;
      if (sortBy === 'hours') return (left.hours - right.hours) * direction;
      return (left.notes - right.notes) * direction;
    });
    return items;
  }, [domainRows, sortBy, sortDir]);

  const activityByDate = useMemo(() => {
    const map: Record<string, ActivityDay> = {};
    activities.forEach((entry) => {
      const bucket = map[entry.date] ?? { count: 0, domains: new Set<number>(), types: new Set<string>() };
      bucket.count += 1;
      entry.domainIds.forEach((domainId) => bucket.domains.add(domainId));
      bucket.types.add(entry.type);
      map[entry.date] = bucket;
    });
    return map;
  }, [activities]);

  const heatmapCells = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 363);
    return Array.from({ length: 364 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [refreshTick]);

  const heatmapMonthMarkers = useMemo(() => {
    const markers: Array<{ label: string; week: number }> = [];
    heatmapCells.forEach((date, index) => {
      if (date.getDate() <= 7) {
        const week = Math.floor(index / 7);
        const label = monthNames[date.getMonth()];
        const existing = markers.find((item) => item.label === label && Math.abs(item.week - week) < 2);
        if (!existing) markers.push({ label, week });
      }
    });
    return markers;
  }, [heatmapCells]);

  const streakStats = useMemo(() => {
    const activeDays = Object.entries(activityByDate)
      .filter(([, value]) => value.count > 0)
      .map(([date]) => date)
      .sort();

    let longest = 0;
    let current = 0;
    let previous: Date | null = null;

    activeDays.forEach((day) => {
      const currentDate = new Date(`${day}T00:00:00`);
      if (!previous) {
        current = 1;
      } else {
        const diff = Math.round((currentDate.getTime() - previous.getTime()) / 86_400_000);
        current = diff === 1 ? current + 1 : 1;
      }
      longest = Math.max(longest, current);
      previous = currentDate;
    });

    return { longest, activeDays: activeDays.length };
  }, [activityByDate]);

  const overallPercent = Math.round(mastery.avgCompletion);
  const rankTitle =
    overallPercent >= 90
      ? 'Omniversal'
      : overallPercent >= 75
      ? 'Master'
      : overallPercent >= 55
      ? 'Adept'
      : overallPercent >= 35
      ? 'Scholar'
      : 'Initiate';

  const calendarDays = useMemo(() => {
    const start = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const end = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
    const lead = start.getDay();
    const result: Array<Date | null> = [];
    for (let index = 0; index < lead; index += 1) result.push(null);
    for (let day = 1; day <= end.getDate(); day += 1) {
      result.push(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day));
    }
    return result;
  }, [calendarMonth]);

  useEffect(() => {
    const unlocked = ACHIEVEMENTS.filter((item) => item.check(domainRows, mastery)).map((item) => item.id);
    const newOnes = unlocked.filter((id) => !unlockedBadges.includes(id));
    if (newOnes.length === 0) return;

    const merged = [...new Set([...unlockedBadges, ...newOnes])];
    setUnlockedBadges(merged);
    writeLS('dashboard_badges', merged);

    const firstUnlockDone = localStorage.getItem('dashboard_first_unlock_done') === 'true';
    if (!firstUnlockDone) {
      localStorage.setItem('dashboard_first_unlock_done', 'true');
      setUnlockFlash(true);
      setBurstParticles(
        Array.from({ length: 64 }, (_, index) => ({
          id: uid(`burst_${index}`),
          angle: (Math.PI * 2 * index) / 64,
          distance: 140 + Math.random() * 180,
        }))
      );
      window.setTimeout(() => setUnlockFlash(false), 850);
      window.setTimeout(() => setBurstParticles([]), 1200);
    }
  }, [domainRows, mastery, unlockedBadges]);

  useEffect(() => {
    const canvas = radarRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 190;
    const axes = domainRows.length;

    const completionValues = domainRows.map((row) => row.completion / 100);
    const quizValues = domainRows.map((row) => row.quizAvg / 100);
    const activityValues = domainRows.map((row) => clamp(row.activityScore / 18, 0, 1));

    let raf = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;

    const drawPolygon = (values: number[], progress: number, stroke: string, fill: string): void => {
      context.beginPath();
      values.forEach((value, index) => {
        const angle = (Math.PI * 2 * index) / axes - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius * value * progress;
        const y = centerY + Math.sin(angle) * radius * value * progress;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 2;
      context.fill();
      context.stroke();
    };

    const draw = (): void => {
      context.clearRect(0, 0, width, height);

      context.strokeStyle = 'rgba(255,255,255,0.16)';
      context.lineWidth = 1;
      for (let ring = 1; ring <= 5; ring += 1) {
        context.beginPath();
        for (let axis = 0; axis < axes; axis += 1) {
          const angle = (Math.PI * 2 * axis) / axes - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius * (ring / 5);
          const y = centerY + Math.sin(angle) * radius * (ring / 5);
          if (axis === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.closePath();
        context.stroke();
      }

      domainRows.forEach((row, index) => {
        const angle = (Math.PI * 2 * index) / axes - Math.PI / 2;
        const tipX = centerX + Math.cos(angle) * (radius + 16);
        const tipY = centerY + Math.sin(angle) * (radius + 16);
        context.strokeStyle = 'rgba(255,255,255,0.12)';
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(tipX, tipY);
        context.stroke();

        context.fillStyle = '#a6acb7';
        context.font = '10px JetBrains Mono';
        context.fillText(`D${row.id}`, tipX - 8, tipY + 3);
      });

      p1 = Math.min(1, p1 + 0.032);
      p2 = Math.min(1, p2 + 0.024);
      p3 = Math.min(1, p3 + 0.018);

      drawPolygon(completionValues, p1, 'rgba(201,168,76,0.95)', 'rgba(201,168,76,0.2)');
      drawPolygon(quizValues, p2, 'rgba(93,162,255,0.95)', 'rgba(93,162,255,0.2)');
      drawPolygon(activityValues, p3, 'rgba(64,216,190,0.95)', 'rgba(64,216,190,0.2)');

      if (p3 < 1) {
        raf = window.requestAnimationFrame(draw);
      }
    };

    draw();

    const onMove = (event: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let hit: DomainRow | null = null;
      domainRows.forEach((row, index) => {
        const angle = (Math.PI * 2 * index) / axes - Math.PI / 2;
        const tipX = centerX + Math.cos(angle) * (radius + 16);
        const tipY = centerY + Math.sin(angle) * (radius + 16);
        if (Math.hypot(tipX - x, tipY - y) <= 14) hit = row;
      });
      if (hit) setRadarHover({ row: hit, x, y });
      else setRadarHover(null);
    };

    const onLeave = (): void => setRadarHover(null);

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(raf);
    };
  }, [domainRows, radarSeed]);

  const toggleSort = (key: SortKey): void => {
    if (sortBy === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortBy(key);
    setSortDir(key === 'domain' ? 'asc' : 'desc');
  };

  const iconForTypes = (types: Set<string>): string => {
    if (types.has('quiz')) return 'Q';
    if (types.has('note')) return 'N';
    if (types.has('subject')) return 'S';
    if (types.has('project')) return 'P';
    if (types.has('resource')) return 'R';
    return '';
  };

  return (
    <div className="relative mx-auto max-w-[1360px] px-4 py-6">
      {unlockFlash && <div className="pointer-events-none fixed inset-0 z-40 bg-[#c9a84c]/20" />}
      <AnimatePresence>
        {burstParticles.length > 0 && (
          <motion.div className="pointer-events-none fixed inset-0 z-50" initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            {burstParticles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 rounded-full bg-[#e9cf8d]"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(particle.angle) * particle.distance,
                  y: Math.sin(particle.angle) * particle.distance,
                  opacity: 0,
                }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-5">
        <div className="mb-2 flex items-center gap-2 text-[#e4ca87]">
          <Sparkles className="h-4 w-4" />
          <h1 className="font-cinzel text-3xl text-white">Mastery Arc</h1>
        </div>
        <svg viewBox="0 0 520 250" className="w-full max-w-3xl">
          <path d={arcPath(260, 220, 185, Math.PI, 0)} stroke="rgba(255,255,255,0.14)" strokeWidth="16" fill="none" />
          {domainRows.map((row, index) => {
            const segment = Math.PI / domainRows.length;
            const gap = segment * 0.22;
            const baseStart = Math.PI - segment * index;
            const baseEnd = Math.PI - segment * (index + 1);
            const start = baseStart - gap / 2;
            const fillEnd = start - (segment - gap) * (row.completion / 100) * arcProgress;
            return (
              <path
                key={row.id}
                d={arcPath(260, 220, 185, start, fillEnd)}
                stroke={DOMAIN_COLORS[row.id] ?? '#c9a84c'}
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
            );
          })}
          <text x="260" y="192" textAnchor="middle" className="fill-[#e4ca87] font-cinzel text-[38px]">
            {overallPercent}%
          </text>
          <text x="260" y="215" textAnchor="middle" className="fill-[#9ca3af] text-[11px] uppercase tracking-[0.25em]">
            {rankTitle}
          </text>
        </svg>
      </section>

      <section className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-cinzel text-2xl text-white">Domain Radar</h2>
          <button
            type="button"
            onClick={() => setRadarSeed((value) => value + 1)}
            className="inline-flex items-center gap-1 rounded border border-white/20 px-2 py-1 text-xs text-gray-300"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Animate Again
          </button>
        </div>
        <canvas ref={radarRef} width={500} height={500} className="mx-auto w-full max-w-[520px] rounded-xl border border-white/10 bg-black/35" />
        {radarHover && (
          <div className="mt-3 rounded border border-white/15 bg-black/45 px-3 py-2 text-xs text-gray-300">
            <span className="text-[#e4ca87]">{radarHover.row.name}</span>
            {' | '}Completion {radarHover.row.completion.toFixed(1)}%
            {' | '}Quiz {radarHover.row.quizAvg.toFixed(1)}%
            {' | '}Activity {radarHover.row.activityScore}
          </div>
        )}
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-6">
        <CountCard label="Total Subjects Checked" value={mastery.checkedSubjects} />
        <CountCard label="Avg Completion" value={mastery.avgCompletion} decimals={1} suffix="%" ringPercent={mastery.avgCompletion} />
        <CountCard label="Total Hours Logged" value={mastery.totalHoursLogged} decimals={1} />
        <CountCard label="Quizzes Completed" value={mastery.quizCount} />
        <CountCard label="Current Streak" value={mastery.currentStreak} />
        <CountCard label="Notes Written" value={mastery.noteCount} />
      </section>

      <section className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-4">
        <h2 className="mb-3 font-cinzel text-2xl text-white">Domain Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="cursor-pointer p-2" onClick={() => toggleSort('domain')}>Domain</th>
                <th className="p-2">Subjects</th>
                <th className="cursor-pointer p-2" onClick={() => toggleSort('completion')}>Completion</th>
                <th className="cursor-pointer p-2" onClick={() => toggleSort('quiz')}>Quiz Avg</th>
                <th className="cursor-pointer p-2" onClick={() => toggleSort('hours')}>Hours</th>
                <th className="cursor-pointer p-2" onClick={() => toggleSort('notes')}>Notes</th>
                <th className="p-2">Last Activity</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <motion.tr key={row.id} layout className="border-t border-white/8 text-gray-300">
                  <td className="p-2">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[row.id] }} />
                    D{row.id}. {row.name}
                  </td>
                  <td className="p-2">{row.subjectsChecked}/{row.subjectsTotal}</td>
                  <td className="p-2">
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${row.completion}%`, backgroundColor: DOMAIN_COLORS[row.id] }} />
                    </div>
                  </td>
                  <td className="p-2" style={{ color: scoreColor(row.quizAvg) }}>{row.quizAvg.toFixed(1)}%</td>
                  <td className="p-2">{row.hours}</td>
                  <td className="p-2">{row.notes}</td>
                  <td className="p-2">{row.lastActivity}</td>
                  <td className="p-2"><span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">{row.status}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-4">
        <h2 className="mb-3 font-cinzel text-2xl text-white">Activity Heatmap</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[920px]">
            <div className="relative mb-2 ml-8 h-4 text-[10px] text-gray-500">
              {heatmapMonthMarkers.map((marker) => (
                <span key={`${marker.label}-${marker.week}`} className="absolute" style={{ left: `${marker.week * 17}px` }}>
                  {marker.label}
                </span>
              ))}
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {heatmapCells.map((date) => {
                const key = dayKey(date);
                const entry = activityByDate[key];
                const count = entry?.count ?? 0;
                const intensity = clamp(count / 5, 0, 1);
                const color = count === 0 ? '#0f1014' : `rgba(201,168,76,${0.24 + intensity * 0.76})`;
                const domains = entry ? [...entry.domains].map((id) => `D${id}`).join(', ') : 'None';
                return (
                  <div key={key} className="group relative h-3.5 w-3.5 rounded-[2px]" style={{ backgroundColor: color }}>
                    <div className="pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-white/15 bg-black/95 px-2 py-1 text-[10px] text-gray-300 group-hover:block">
                      {date.toLocaleDateString()} | {count} activities | {domains}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
          <span>Longest streak: {streakStats.longest} days</span>
          <span>Total active days: {streakStats.activeDays}</span>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-4">
        <h2 className="mb-3 font-cinzel text-2xl text-white">Achievement Wall</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = unlockedBadges.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`rounded-lg border p-3 text-sm transition ${
                  unlocked
                    ? 'border-[#c9a84c]/60 bg-[#c9a84c]/10 text-[#e4ca87] shadow-[0_0_20px_rgba(201,168,76,0.16)]'
                    : 'border-white/10 bg-black/35 text-gray-500 blur-[0.2px]'
                }`}
              >
                <Trophy className="mb-2 h-4 w-4" />
                {achievement.name}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-cinzel text-2xl text-white">Monthly Calendar</h2>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
              className="rounded border border-white/20 px-2 py-1"
            >
              Prev
            </button>
            <span>
              {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
              className="rounded border border-white/20 px-2 py-1"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs">
          {weekdayNames.map((day) => (
            <div key={day} className="p-2 text-gray-500">
              {day}
            </div>
          ))}
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`pad-${index}`} className="h-16 rounded border border-transparent" />;
            }
            const key = dayKey(date);
            const entry = activityByDate[key];
            const count = entry?.count ?? 0;
            const today = key === dayKey(new Date());
            const classes =
              count === 0 ? 'bg-black/35' : count >= 5 ? 'bg-[#c9a84c]/45' : count >= 2 ? 'bg-[#c9a84c]/28' : 'bg-[#c9a84c]/16';
            return (
              <div key={key} className={`h-16 rounded border p-1 ${classes} ${today ? 'border-[#e4ca87]' : 'border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span>{date.getDate()}</span>
                  <span className="text-[10px] text-gray-300">{iconForTypes(entry?.types ?? new Set<string>())}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays className="h-3.5 w-3.5" />
          Active days this month: {calendarDays.filter((day) => day && (activityByDate[dayKey(day)]?.count ?? 0) > 0).length}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
