import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, RefreshCcw, Trophy } from 'lucide-react';
import { DOMAIN_COLORS, getMasteryData, masteryDomains, readActivityLog, readLS, writeLS } from '../utils/codex';

type SortKey = 'domain' | 'completion' | 'quiz' | 'hours' | 'notes';

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
}

interface Badge {
  id: string;
  name: string;
  condition: (rows: DomainRow[], meta: ReturnType<typeof getMasteryData>) => boolean;
}

const BADGES: Badge[] = [
  { id: 'first_step', name: 'First Step', condition: (_, meta) => meta.checkedSubjects >= 1 },
  { id: 'scholar', name: 'Scholar', condition: (_, meta) => meta.checkedSubjects >= 50 },
  { id: 'centurion', name: 'Centurion', condition: (_, meta) => meta.checkedSubjects >= 100 },
  { id: 'quiz_novice', name: 'Quiz Novice', condition: (_, meta) => meta.quizCount >= 1 },
  { id: 'quiz_master', name: 'Quiz Master', condition: (_, meta) => meta.quizCount >= 20 },
  { id: 'perfect_score', name: 'Perfect Score', condition: () => readLS<Array<{ correct: number; totalQuestions: number }>>('arena_results', []).some((result) => result.correct === result.totalQuestions) },
  { id: 'gauntlet', name: 'Gauntlet Champion', condition: () => readLS<Array<{ mode: string; correct: number; totalQuestions: number }>>('arena_results', []).some((result) => result.mode === 'gauntlet' && result.correct >= 24) },
  { id: 'chronicler', name: 'Chronicler', condition: (_, meta) => meta.noteCount >= 10 },
  { id: 'sage', name: 'Sage', condition: (_, meta) => meta.noteCount >= 50 },
  { id: 'polymath', name: 'Polymath', condition: (rows) => rows.every((row) => row.notes > 0 || row.completion > 0) },
  { id: 'streak7', name: 'Streak 7', condition: (_, meta) => meta.currentStreak >= 7 },
  { id: 'streak30', name: 'Streak 30', condition: (_, meta) => meta.currentStreak >= 30 },
  { id: 'speed', name: 'Speed Demon', condition: () => readLS<Array<{ mode: string; score: number }>>('arena_results', []).some((result) => result.mode === 'speed' && result.score >= 2500) },
  { id: 'connector', name: 'Connector', condition: (_, meta) => meta.resourceCount >= 20 },
  { id: 'astronomer', name: 'Astronomer', condition: () => Number.parseInt(localStorage.getItem('codex_map_views') ?? '0', 10) >= 10 },
  { id: 'oracle', name: 'Oracle Seeker', condition: () => readLS<Array<{ id: string }>>('oracle_sessions', []).length >= 20 },
  { id: 'deep_diver', name: 'Deep Diver', condition: () => readLS<Array<{ masteryLevel: number }>>('grimoire_notes', []).some((note) => note.masteryLevel === 5) },
  { id: 'completionist', name: 'Completionist', condition: (rows) => rows.some((row) => row.completion >= 100) },
  { id: 'omniverse', name: 'Omniverse', condition: (rows) => rows.every((row) => row.completion >= 50) },
  { id: 'ascended', name: 'Ascended', condition: (rows) => rows.every((row) => row.completion >= 90) },
];

const dayKey = (date: Date): string => date.toISOString().slice(0, 10);
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard: React.FC = () => {
  const radarRef = useRef<HTMLCanvasElement>(null);
  const [radarSeed, setRadarSeed] = useState(0);
  const [sortBy, setSortBy] = useState<SortKey>('completion');
  const [sortAsc, setSortAsc] = useState(false);
  const [hoverAxis, setHoverAxis] = useState<{ x: number; y: number; row: DomainRow } | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => readLS<string[]>('dashboard_badges', []));
  const [showUnlockFlash, setShowUnlockFlash] = useState(false);

  const mastery = useMemo(() => getMasteryData(), []);
  const activities = useMemo(() => readActivityLog(), []);
  const results = useMemo(() => readLS<Array<{ domainScores?: Record<number, { correct: number; total: number }> }>>('arena_results', []), []);
  const notes = useMemo(() => readLS<Array<{ domain: number }>>('grimoire_notes', []), []);

  const domainRows = useMemo<DomainRow[]>(() => {
    const byDate = new Map<number, number>();
    activities.forEach((activity) => {
      activity.domainIds.forEach((domainId) => {
        const current = byDate.get(domainId) ?? 0;
        byDate.set(domainId, Math.max(current, activity.timestamp));
      });
    });

    return masteryDomains.map((domain) => {
      const completion = mastery.completionByDomain.find((entry) => entry.domainId === domain.id);
      const quizStats = results.reduce(
        (acc, result) => {
          const item = result.domainScores?.[domain.id];
          if (!item) return acc;
          return { correct: acc.correct + item.correct, total: acc.total + item.total };
        },
        { correct: 0, total: 0 }
      );
      const noteCount = notes.filter((note) => note.domain === domain.id).length;
      const last = byDate.get(domain.id);
      const completionPct = completion?.completion ?? 0;
      return {
        id: domain.id,
        name: domain.title,
        subjectsChecked: completion?.checked ?? 0,
        subjectsTotal: completion?.total ?? 0,
        completion: completionPct,
        quizAvg: quizStats.total > 0 ? (quizStats.correct / quizStats.total) * 100 : 0,
        hours: Math.round(noteCount * 1.5 + completionPct / 8),
        notes: noteCount,
        lastActivity: last ? new Date(last).toLocaleDateString() : '—',
        status: completionPct >= 90 ? 'Master' : completionPct >= 60 ? 'Rising' : completionPct > 0 ? 'Active' : 'Dormant',
      };
    });
  }, [activities, mastery, notes, results]);

  const sortedRows = useMemo(() => {
    const rows = [...domainRows];
    rows.sort((left, right) => {
      const dir = sortAsc ? 1 : -1;
      if (sortBy === 'domain') return left.id > right.id ? dir : -dir;
      if (sortBy === 'completion') return (left.completion - right.completion) * dir;
      if (sortBy === 'quiz') return (left.quizAvg - right.quizAvg) * dir;
      if (sortBy === 'hours') return (left.hours - right.hours) * dir;
      return (left.notes - right.notes) * dir;
    });
    return rows;
  }, [domainRows, sortAsc, sortBy]);

  const heatmapData = useMemo(() => {
    const map: Record<string, { count: number; domains: Set<number>; types: Set<string> }> = {};
    activities.forEach((activity) => {
      const current = map[activity.date] ?? { count: 0, domains: new Set<number>(), types: new Set<string>() };
      current.count += 1;
      activity.domainIds.forEach((domainId) => current.domains.add(domainId));
      current.types.add(activity.type);
      map[activity.date] = current;
    });
    return map;
  }, [activities]);

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
    let raf = 0;
    let p1 = 0;
    let p2 = 0;
    let p3 = 0;

    const drawPolygon = (values: number[], progress: number, stroke: string, fill: string): void => {
      context.beginPath();
      values.forEach((value, index) => {
        const angle = (Math.PI * 2 * index) / axes - Math.PI / 2;
        const ratio = value * progress;
        const x = centerX + Math.cos(angle) * radius * ratio;
        const y = centerY + Math.sin(angle) * radius * ratio;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.fillStyle = fill;
      context.strokeStyle = stroke;
      context.lineWidth = 2;
      context.fill();
      context.stroke();
    };

    const completionValues = domainRows.map((row) => row.completion / 100);
    const quizValues = domainRows.map((row) => row.quizAvg / 100);
    const activityValues = domainRows.map((row) => Math.min(1, row.hours / 20));

    const draw = (): void => {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = 'rgba(255,255,255,0.16)';
      context.fillStyle = 'rgba(255,255,255,0.2)';
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

      p1 = Math.min(1, p1 + 0.03);
      p2 = Math.min(1, p2 + 0.024);
      p3 = Math.min(1, p3 + 0.02);
      drawPolygon(completionValues, p1, 'rgba(201,168,76,0.95)', 'rgba(201,168,76,0.2)');
      drawPolygon(quizValues, p2, 'rgba(93,162,255,0.95)', 'rgba(93,162,255,0.2)');
      drawPolygon(activityValues, p3, 'rgba(64,216,190,0.95)', 'rgba(64,216,190,0.2)');

      context.font = '10px JetBrains Mono';
      context.fillStyle = '#9ca3af';
      domainRows.forEach((row, index) => {
        const angle = (Math.PI * 2 * index) / axes - Math.PI / 2;
        const x = centerX + Math.cos(angle) * (radius + 16);
        const y = centerY + Math.sin(angle) * (radius + 16);
        context.fillText(`D${row.id}`, x - 8, y);
      });

      if (p3 < 1) raf = requestAnimationFrame(draw);
    };
    draw();
    const onMove = (event: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      let matched: DomainRow | null = null;
      domainRows.forEach((row, index) => {
        const angle = (Math.PI * 2 * index) / axes - Math.PI / 2;
        const tipX = centerX + Math.cos(angle) * (radius + 16);
        const tipY = centerY + Math.sin(angle) * (radius + 16);
        if (Math.hypot(x - tipX, y - tipY) < 14) matched = row;
      });
      if (matched) setHoverAxis({ x, y, row: matched });
      else setHoverAxis(null);
    };
    canvas.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, [domainRows, radarSeed]);

  useEffect(() => {
    const unlocked = BADGES.filter((badge) => badge.condition(domainRows, mastery)).map((badge) => badge.id);
    const previous = new Set(unlockedBadges);
    const newOnes = unlocked.filter((id) => !previous.has(id));
    if (newOnes.length > 0) {
      setShowUnlockFlash(true);
      window.setTimeout(() => setShowUnlockFlash(false), 900);
      const merged = [...new Set([...unlockedBadges, ...newOnes])];
      setUnlockedBadges(merged);
      writeLS('dashboard_badges', merged);
    }
  }, [domainRows, mastery, unlockedBadges]);

  const activityByDate = (date: Date): { count: number; types: string[] } => {
    const entry = heatmapData[dayKey(date)];
    return { count: entry?.count ?? 0, types: [...(entry?.types ?? new Set<string>())] };
  };

  const overallPercent = Math.round(mastery.avgCompletion);
  const rank = overallPercent >= 90 ? 'Omniversal' : overallPercent >= 75 ? 'Master' : overallPercent >= 55 ? 'Adept' : overallPercent >= 35 ? 'Scholar' : 'Initiate';

  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const monthEnd = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
  const leadPadding = monthStart.getDay();
  const days = Array.from({ length: leadPadding + monthEnd.getDate() }, (_, index) => {
    if (index < leadPadding) return null;
    return new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index - leadPadding + 1);
  });

  return (
    <div className="relative mx-auto max-w-[1350px] px-4 py-6">
      {showUnlockFlash && <div className="pointer-events-none fixed inset-0 z-30 bg-[#c9a84c]/18" />}

      <section className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-5">
        <h1 className="font-cinzel text-3xl text-white">Mastery Arc</h1>
        <div className="mt-3 flex items-center gap-8">
          <svg viewBox="0 0 500 220" className="w-full max-w-2xl">
            {domainRows.map((row, index) => {
              const segment = Math.PI / domainRows.length;
              const start = Math.PI - segment * index;
              const end = Math.PI - segment * (index + 1);
              const r = 180;
              const x1 = 250 + Math.cos(start) * r;
              const y1 = 210 + Math.sin(start) * r;
              const x2 = 250 + Math.cos(end) * r;
              const y2 = 210 + Math.sin(end) * r;
              const opacity = 0.2 + (row.completion / 100) * 0.8;
              return <path key={row.id} d={`M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2}`} stroke={DOMAIN_COLORS[row.id]} strokeOpacity={opacity} strokeWidth="10" fill="none" />;
            })}
            <text x="250" y="170" textAnchor="middle" className="fill-[#e4ca87] font-cinzel text-[34px]">{overallPercent}%</text>
            <text x="250" y="194" textAnchor="middle" className="fill-[#9ca3af] text-[11px] uppercase tracking-[0.25em]">{rank}</text>
          </svg>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-cinzel text-2xl text-white">Domain Radar</h2>
          <button type="button" onClick={() => setRadarSeed((value) => value + 1)} className="inline-flex items-center gap-1 rounded border border-white/20 px-2 py-1 text-xs text-gray-300">
            <RefreshCcw className="h-3.5 w-3.5" />
            Animate Again
          </button>
        </div>
        <canvas ref={radarRef} width={500} height={500} className="mx-auto w-full max-w-[520px] rounded-xl border border-white/10 bg-black/35" />
        {hoverAxis && (
          <div className="mt-3 rounded border border-white/15 bg-black/45 px-3 py-2 text-xs text-gray-300">
            {hoverAxis.row.name}: Completion {hoverAxis.row.completion.toFixed(1)}% · Quiz {hoverAxis.row.quizAvg.toFixed(1)}% · Hours {hoverAxis.row.hours}
          </div>
        )}
      </section>

      <section className="mb-6 grid gap-3 md:grid-cols-6">
        {[
          ['Total Subjects Checked', mastery.checkedSubjects],
          ['Avg Completion %', Number(mastery.avgCompletion.toFixed(1))],
          ['Total Hours Logged', domainRows.reduce((sum, row) => sum + row.hours, 0)],
          ['Quizzes Completed', mastery.quizCount],
          ['Current Streak', mastery.currentStreak],
          ['Notes Written', mastery.noteCount],
        ].map(([label, value]) => (
          <motion.div key={String(label)} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-white/12 bg-black/45 p-3">
            <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">{label}</div>
            <div className="mt-2 text-2xl font-bold text-[#e4ca87]">{value}</div>
          </motion.div>
        ))}
      </section>

      <section className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-4">
        <h2 className="mb-3 font-cinzel text-2xl text-white">Domain Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-gray-500">
              <tr>
                <th className="cursor-pointer p-2" onClick={() => { setSortBy('domain'); setSortAsc((v) => !v); }}>Domain</th>
                <th className="p-2">Subjects</th>
                <th className="cursor-pointer p-2" onClick={() => { setSortBy('completion'); setSortAsc((v) => !v); }}>Completion</th>
                <th className="cursor-pointer p-2" onClick={() => { setSortBy('quiz'); setSortAsc((v) => !v); }}>Quiz Avg</th>
                <th className="cursor-pointer p-2" onClick={() => { setSortBy('hours'); setSortAsc((v) => !v); }}>Hours</th>
                <th className="cursor-pointer p-2" onClick={() => { setSortBy('notes'); setSortAsc((v) => !v); }}>Notes</th>
                <th className="p-2">Last Activity</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <motion.tr key={row.id} layout className="border-t border-white/8 text-gray-300">
                  <td className="p-2"><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[row.id] }} />D{row.id}. {row.name}</td>
                  <td className="p-2">{row.subjectsChecked}/{row.subjectsTotal}</td>
                  <td className="p-2">
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-full rounded-full" style={{ width: `${row.completion}%`, backgroundColor: DOMAIN_COLORS[row.id] }} />
                    </div>
                  </td>
                  <td className="p-2" style={{ color: row.quizAvg >= 80 ? '#65ffaf' : row.quizAvg >= 60 ? '#e4ca87' : '#ff8888' }}>{row.quizAvg.toFixed(1)}%</td>
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
          <div className="min-w-[860px]">
            <div className="mb-1 ml-8 flex text-[10px] text-gray-500">{monthNames.map((name) => <span key={name} className="w-[64px]">{name}</span>)}</div>
            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {Array.from({ length: 364 }).map((_, offset) => {
                const date = new Date(Date.now() - (363 - offset) * 86_400_000);
                const info = activityByDate(date);
                const intensity = Math.min(1, info.count / 5);
                const color = info.count === 0 ? '#121212' : `rgba(201, 168, 76, ${0.2 + intensity * 0.8})`;
                return (
                  <div key={dayKey(date)} className="group relative h-3 w-3 rounded-[2px]" style={{ backgroundColor: color }}>
                    <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-white/15 bg-black/95 px-2 py-1 text-[10px] text-gray-300 group-hover:block">
                      {date.toLocaleDateString()} · {info.count} activities
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-white/10 bg-black/50 p-4">
        <h2 className="mb-3 font-cinzel text-2xl text-white">Achievement Wall</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((badge) => {
            const unlocked = unlockedBadges.includes(badge.id);
            return (
              <div key={badge.id} className={`rounded-lg border p-3 text-sm ${unlocked ? 'border-[#c9a84c]/60 bg-[#c9a84c]/10 text-[#e4ca87]' : 'border-white/10 bg-black/35 text-gray-500 blur-[0.2px]'}`}>
                <Trophy className="mb-2 h-4 w-4" />
                {badge.name}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-cinzel text-2xl text-white">Monthly Calendar</h2>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="rounded border border-white/20 px-2 py-1">Prev</button>
            <span>{monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</span>
            <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="rounded border border-white/20 px-2 py-1">Next</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div key={day} className="p-2 text-gray-500">{day}</div>)}
          {days.map((date, index) => {
            if (!date) return <div key={`pad-${index}`} className="h-16 rounded border border-transparent" />;
            const info = activityByDate(date);
            const isToday = dayKey(date) === dayKey(new Date());
            const color = info.count === 0 ? 'bg-black/35' : info.count >= 5 ? 'bg-[#c9a84c]/45' : 'bg-[#c9a84c]/20';
            return (
              <div key={dayKey(date)} className={`h-16 rounded border p-1 ${color} ${isToday ? 'border-[#e4ca87]' : 'border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span>{date.getDate()}</span>
                  <span className="text-[10px]">{info.types.includes('quiz') ? '⚔' : info.types.includes('note') ? '✎' : info.types.includes('subject') ? '•' : ''}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <CalendarDays className="h-3.5 w-3.5" />
          Active days: {Object.values(heatmapData).filter((entry) => entry.count > 0).length}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
