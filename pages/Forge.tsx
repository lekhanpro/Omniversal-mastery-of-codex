import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Flame, Plus, Save, Trash2 } from 'lucide-react';
import { appendActivity, DOMAIN_COLORS, masteryDomains, readLS, uid, writeLS } from '../utils/codex';

type ProjectType = 'Build' | 'Research' | 'Creative' | 'Experiment' | 'Deploy' | 'Analysis';
type ProjectStatus = 'Idea' | 'Building' | 'Testing' | 'Deployed' | 'Complete' | 'Archived';

interface Milestone {
  id: string;
  text: string;
  timestamp: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  domains: number[];
  type: ProjectType;
  status: ProjectStatus;
  difficulty: number;
  techStack: string[];
  link: string;
  targetDate: string;
  progress: number;
  milestones: Milestone[];
  resourceRefs: string[];
}

const TYPES: ProjectType[] = ['Build', 'Research', 'Creative', 'Experiment', 'Deploy', 'Analysis'];
const STATUSES: ProjectStatus[] = ['Idea', 'Building', 'Testing', 'Deployed', 'Complete', 'Archived'];

const emptyProject = (): Project => ({
  id: '',
  name: '',
  description: '',
  domains: [],
  type: 'Build',
  status: 'Idea',
  difficulty: 3,
  techStack: [],
  link: '',
  targetDate: '',
  progress: 0,
  milestones: [],
  resourceRefs: [],
});

const Forge: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(() => readLS<Project[]>('forge_projects', []));
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<Project>(emptyProject());
  const [selected, setSelected] = useState<Project | null>(null);
  const [techInput, setTechInput] = useState('');
  const [queueOrder, setQueueOrder] = useState<string[]>(() => readLS<string[]>('forge_queue_order', []));
  const [dragId, setDragId] = useState<string | null>(null);
  const [milestoneInput, setMilestoneInput] = useState('');
  const [deleteName, setDeleteName] = useState('');
  const [synergyHover, setSynergyHover] = useState<string>('Hover a domain node or line');
  const emberRef = useRef<HTMLCanvasElement>(null);
  const synergyRef = useRef<HTMLCanvasElement>(null);
  const analyticsRef = useRef<HTMLCanvasElement>(null);

  const grimoireNotes = useMemo(
    () => readLS<Array<{ id: string; title: string; domain: number; tags?: string[] }>>('grimoire_notes', []),
    []
  );

  useEffect(() => {
    writeLS('forge_projects', projects);
  }, [projects]);

  useEffect(() => {
    const canvas = analyticsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#090b11';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const byStatus = STATUSES.map((status) => projects.filter((project) => project.status === status).length);
    const statusTotal = Math.max(1, byStatus.reduce((sum, value) => sum + value, 0));
    const statusColors = ['#7d8699', '#4da9ff', '#6ee7b7', '#ffd166', '#c9a84c', '#8f8f98'];
    let statusX = 18;
    byStatus.forEach((count, index) => {
      const width = (count / statusTotal) * 260;
      ctx.fillStyle = statusColors[index];
      ctx.fillRect(statusX, 24, width, 20);
      statusX += width;
    });
    ctx.fillStyle = '#98a1b0';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText('Projects by Status', 18, 16);

    const domainCounts = masteryDomains.map((domain) =>
      projects.filter((project) => project.domains.includes(domain.id)).length
    );
    const maxDomainCount = Math.max(1, ...domainCounts);
    domainCounts.forEach((count, index) => {
      const barHeight = (count / maxDomainCount) * 80;
      const x = 18 + index * 14;
      ctx.fillStyle = DOMAIN_COLORS[masteryDomains[index].id];
      ctx.fillRect(x, 146 - barHeight, 8, barHeight);
    });
    ctx.fillStyle = '#98a1b0';
    ctx.fillText('Domains Used', 18, 164);

    const avgDomains =
      projects.length === 0
        ? 0
        : projects.reduce((sum, project) => sum + project.domains.length, 0) / projects.length;
    ctx.fillStyle = '#d7bf81';
    ctx.font = '12px JetBrains Mono';
    ctx.fillText(`Avg Domains/Project: ${avgDomains.toFixed(2)}`, 300, 44);

    const now = new Date();
    const velocity = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const count = projects.filter((project) => {
        if (!project.targetDate) return false;
        const projectDate = new Date(project.targetDate);
        return `${projectDate.getFullYear()}-${projectDate.getMonth() + 1}` === key;
      }).length;
      return { label: date.toLocaleString(undefined, { month: 'short' }), count };
    });
    const maxVelocity = Math.max(1, ...velocity.map((entry) => entry.count));
    const chartX = 300;
    const chartY = 62;
    const chartW = 240;
    const chartH = 88;
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.strokeRect(chartX, chartY, chartW, chartH);
    ctx.strokeStyle = '#c9a84c';
    ctx.beginPath();
    velocity.forEach((entry, index) => {
      const x = chartX + (index / 5) * chartW;
      const y = chartY + chartH - (entry.count / maxVelocity) * chartH;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      ctx.fillStyle = '#98a1b0';
      ctx.fillText(entry.label, x - 10, chartY + chartH + 12);
    });
    ctx.stroke();
    ctx.fillStyle = '#98a1b0';
    ctx.fillText('Build Velocity (6 months)', chartX, 56);
  }, [projects]);

  useEffect(() => {
    writeLS('forge_queue_order', queueOrder);
  }, [queueOrder]);

  useEffect(() => {
    const canvas = emberRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    const particles = Array.from({ length: 72 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.8 - Math.random() * 1.2,
      life: 0,
      ttl: 2000 + Math.random() * 2200,
    }));
    let raf = 0;
    let last = performance.now();

    const draw = (time: number): void => {
      const dt = time - last;
      last = time;
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.life += dt;
        p.x += p.vx * dt * 0.03;
        p.y += p.vy * dt * 0.03;
        if (p.life >= p.ttl || p.y < -20) {
          p.x = Math.random() * width;
          p.y = height + Math.random() * 40;
          p.life = 0;
        }
        const alpha = 1 - p.life / p.ttl;
        ctx.fillStyle = `rgba(255, 142, 64, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + alpha * 2, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const canvas = synergyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 120;

    const positions = masteryDomains.map((domain, index) => {
      const angle = (Math.PI * 2 * index) / masteryDomains.length - Math.PI / 2;
      return { id: domain.id, x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
    });

    const pairCount = new Map<string, number>();
    const pairProjects = new Map<string, string[]>();
    projects.forEach((project) => {
      for (let i = 0; i < project.domains.length; i += 1) {
        for (let j = i + 1; j < project.domains.length; j += 1) {
          const key = [project.domains[i], project.domains[j]].sort((a, b) => a - b).join('-');
          pairCount.set(key, (pairCount.get(key) ?? 0) + 1);
          const current = pairProjects.get(key) ?? [];
          pairProjects.set(key, [...current, project.name]);
        }
      }
    });

    const drawMap = (hoverNode: number | null, hoverPair: string | null): void => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#090b11';
      ctx.fillRect(0, 0, width, height);

      pairCount.forEach((count, key) => {
        const [left, right] = key.split('-').map(Number);
        const from = positions.find((item) => item.id === left);
        const to = positions.find((item) => item.id === right);
        if (!from || !to) return;
        const highlighted = hoverPair === key || hoverNode === left || hoverNode === right;
        ctx.strokeStyle = highlighted
          ? `rgba(228, 202, 135, ${Math.min(0.95, 0.35 + count * 0.12)})`
          : `rgba(201,168,76,${Math.min(0.72, 0.2 + count * 0.1)})`;
        ctx.lineWidth = highlighted ? 2 + count : 1 + count;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      positions.forEach((position) => {
        const active = hoverNode === position.id;
        ctx.fillStyle = DOMAIN_COLORS[position.id] ?? '#c9a84c';
        ctx.beginPath();
        ctx.arc(position.x, position.y, active ? 11 : 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d1d5db';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(String(position.id), position.x - 3, position.y + 3);
      });
    };

    drawMap(null, null);

    const distanceToSegment = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ): number => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
      const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
      const cx = x1 + t * dx;
      const cy = y1 + t * dy;
      return Math.hypot(px - cx, py - cy);
    };

    const onMove = (event: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      let hoverNode: number | null = null;
      let hoverPair: string | null = null;

      for (const position of positions) {
        if (Math.hypot(mx - position.x, my - position.y) <= 12) {
          hoverNode = position.id;
          break;
        }
      }

      if (hoverNode !== null) {
        const related = projects.filter((project) => project.domains.includes(hoverNode));
        setSynergyHover(
          `D${hoverNode}: ${related.length} project${related.length === 1 ? '' : 's'} (${related
            .slice(0, 3)
            .map((project) => project.name)
            .join(', ') || 'none'})`
        );
        drawMap(hoverNode, null);
        return;
      }

      for (const [key] of pairCount) {
        const [left, right] = key.split('-').map(Number);
        const from = positions.find((item) => item.id === left);
        const to = positions.find((item) => item.id === right);
        if (!from || !to) continue;
        if (distanceToSegment(mx, my, from.x, from.y, to.x, to.y) < 6) {
          hoverPair = key;
          break;
        }
      }

      if (hoverPair) {
        const names = pairProjects.get(hoverPair) ?? [];
        setSynergyHover(`${hoverPair.replace('-', ' - ')}: ${names.length} project(s) | ${names.slice(0, 3).join(', ')}`);
        drawMap(null, hoverPair);
      } else {
        setSynergyHover('Hover a domain node or line');
        drawMap(null, null);
      }
    };

    const onLeave = (): void => {
      setSynergyHover('Hover a domain node or line');
      drawMap(null, null);
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    return () => {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, [projects]);

  const queueProjects = useMemo(() => {
    const building = projects.filter((project) => project.status === 'Building');
    const sorted = [...building].sort((a, b) => queueOrder.indexOf(a.id) - queueOrder.indexOf(b.id));
    return sorted;
  }, [projects, queueOrder]);

  const submitProject = (): void => {
    if (!formData.name.trim() || formData.domains.length === 0) return;
    const index = projects.length + 1;
    const id = `FORGE-${String(index).padStart(3, '0')}`;
    const project: Project = { ...formData, id };
    setProjects((current) => [project, ...current]);
    if (project.status === 'Building') setQueueOrder((current) => [...current, project.id]);
    setFormData(emptyProject());
    setTechInput('');
    setFormOpen(false);
  };

  const updateProject = (project: Project): void => {
    const previous = projects.find((item) => item.id === project.id);
    if (previous && previous.status !== project.status) {
      appendActivity('project', project.domains, `${project.name} status changed to ${project.status}`);
    }
    setProjects((current) => current.map((item) => (item.id === project.id ? project : item)));
    setSelected(project);
  };

  const addMilestone = (): void => {
    if (!selected || !milestoneInput.trim()) return;
    const next: Project = {
      ...selected,
      milestones: [...selected.milestones, { id: uid('mile'), text: milestoneInput.trim(), timestamp: new Date().toISOString() }],
    };
    setMilestoneInput('');
    updateProject(next);
  };

  const removeProject = (): void => {
    if (!selected) return;
    if (deleteName !== selected.name) return;
    setProjects((current) => current.filter((item) => item.id !== selected.id));
    setSelected(null);
    setDeleteName('');
  };

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] px-4 py-6">
      <canvas ref={emberRef} width={420} height={280} className="pointer-events-none absolute bottom-0 right-0 opacity-60" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-cinzel text-3xl text-white">The Forge</h1>
        <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center gap-1 rounded border border-[#c9a84c]/70 bg-[#c9a84c]/12 px-3 py-1.5 text-[#e4ca87]"><Plus className="h-3.5 w-3.5" /> New Project</button>
      </div>

      <div className="mb-6 rounded-xl border border-white/10 bg-black/45 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-[#e4ca87]"><Flame className="h-4 w-4" /> Forge Queue</div>
        <div className="space-y-2">
          {queueProjects.map((project, index) => (
            <div
              key={project.id}
              draggable
              onDragStart={() => setDragId(project.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (!dragId || dragId === project.id) return;
                const next = queueProjects.map((item) => item.id);
                const from = next.indexOf(dragId);
                const to = next.indexOf(project.id);
                next.splice(to, 0, ...next.splice(from, 1));
                setQueueOrder(next);
                setDragId(null);
              }}
              className={`rounded border border-white/15 bg-black/35 px-3 py-2 text-sm text-gray-200 ${index === 0 ? 'shadow-[0_0_18px_rgba(201,168,76,0.22)]' : ''}`}
            >
              {index === 0 && <span className="mr-2 rounded border border-[#c9a84c]/60 px-1 text-[10px] text-[#e4ca87]">CURRENT FOCUS</span>}
              {project.name}
            </div>
          ))}
          {queueProjects.length === 0 && <div className="text-sm text-gray-500">No active building projects.</div>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const synthesis = project.domains.length >= 5 ? 'Omniversal' : project.domains.length >= 3 ? 'Cross-Domain' : 'Focused';
          return (
            <button key={project.id} type="button" onClick={() => setSelected(project)} className="rounded-xl border border-white/12 bg-black/45 p-4 text-left hover:border-[#c9a84c]/50">
              <div className="mb-2 flex items-center justify-between text-xs text-gray-400"><span>{project.id}</span><span>{project.status}</span></div>
              <h3 className="mb-1 text-lg text-white">{project.name}</h3>
              <p className="mb-2 line-clamp-2 text-sm text-gray-400">{project.description}</p>
              <div className="mb-2 flex -space-x-1">{project.domains.map((domainId) => <span key={domainId} className="inline-block h-5 w-5 rounded-full border border-black" style={{ backgroundColor: DOMAIN_COLORS[domainId] }} />)}</div>
              <div className="mb-2 text-xs text-[#e4ca87]">{synthesis === 'Omniversal' ? 'Omniversal' : synthesis === 'Cross-Domain' ? 'Cross-Domain' : 'Focused'}</div>
              <div className="mb-2 flex flex-wrap gap-1">{project.techStack.map((tech) => <span key={tech} className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-gray-300">{tech}</span>)}</div>
              <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#c9a84c]" style={{ width: `${project.progress}%` }} /></div>
            </button>
          );
        })}
      </div>

      <section className="mt-6 rounded-xl border border-white/10 bg-black/45 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-[#e4ca87]"><BarChart3 className="h-4 w-4" /> Domain Synergy Map</div>
        <canvas ref={synergyRef} width={360} height={280} className="w-full max-w-md rounded border border-white/10 bg-black/35" />
        <p className="mt-2 text-xs text-gray-400">{synergyHover}</p>
        <div className="mt-4 text-sm text-[#e4ca87]">Forge Analytics</div>
        <canvas ref={analyticsRef} width={560} height={180} className="mt-2 w-full max-w-2xl rounded border border-white/10 bg-black/35" />
      </section>

      <AnimatePresence>
        {formOpen && (
          <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} className="fixed bottom-0 right-0 top-0 z-40 w-full max-w-md overflow-y-auto border-l border-white/15 bg-black/95 p-4">
            <h2 className="mb-3 font-cinzel text-2xl text-[#e4ca87]">New Forge Project</h2>
            <div className="space-y-2 text-sm">
              <input value={formData.name} onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))} placeholder="Name" className="w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
              <textarea value={formData.description} onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))} placeholder="Description" className="h-24 w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
              <div className="flex flex-wrap gap-1">{masteryDomains.map((domain) => { const active = formData.domains.includes(domain.id); return <button key={domain.id} type="button" onClick={() => setFormData((current) => ({ ...current, domains: active ? current.domains.filter((item) => item !== domain.id) : [...current.domains, domain.id] }))} className={`rounded-full border px-2 py-1 text-xs ${active ? 'border-[#c9a84c]/70 bg-[#c9a84c]/12 text-[#e4ca87]' : 'border-white/20 text-gray-300'}`}>D{domain.id}</button>; })}</div>
              <select value={formData.type} onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value as ProjectType }))} className="w-full rounded border border-white/20 bg-black/55 px-3 py-2">{TYPES.map((type) => <option key={type}>{type}</option>)}</select>
              <select value={formData.status} onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value as ProjectStatus }))} className="w-full rounded border border-white/20 bg-black/55 px-3 py-2">{STATUSES.map((status) => <option key={status}>{status}</option>)}</select>
              <label>Difficulty {formData.difficulty}<input type="range" min={1} max={5} value={formData.difficulty} onChange={(event) => setFormData((current) => ({ ...current, difficulty: Number(event.target.value) }))} className="w-full" /></label>
              <div className="flex gap-2"><input value={techInput} onChange={(event) => setTechInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); const value = techInput.trim(); if (!value) return; setFormData((current) => ({ ...current, techStack: [...current.techStack, value] })); setTechInput(''); } }} placeholder="Tech stack tag" className="flex-1 rounded border border-white/20 bg-black/55 px-3 py-2" /><button type="button" onClick={() => { const value = techInput.trim(); if (!value) return; setFormData((current) => ({ ...current, techStack: [...current.techStack, value] })); setTechInput(''); }} className="rounded border border-white/20 px-2">Add</button></div>
              <input value={formData.link} onChange={(event) => setFormData((current) => ({ ...current, link: event.target.value }))} placeholder="Link" className="w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
              <input type="date" value={formData.targetDate} onChange={(event) => setFormData((current) => ({ ...current, targetDate: event.target.value }))} className="w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
            </div>
            <div className="mt-4 flex gap-2"><button type="button" onClick={submitProject} className="inline-flex items-center gap-1 rounded border border-[#c9a84c]/70 bg-[#c9a84c]/12 px-3 py-1.5 text-[#e4ca87]"><Save className="h-3.5 w-3.5" /> Save</button><button type="button" onClick={() => setFormOpen(false)} className="rounded border border-white/20 px-3 py-1.5 text-gray-300">Cancel</button></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4">
            <div className="grid w-full max-w-5xl gap-4 rounded-2xl border border-white/15 bg-black/92 p-5 md:grid-cols-2">
              <div className="space-y-2 text-sm">
                <h3 className="font-cinzel text-2xl text-white">{selected.name}</h3>
                <textarea value={selected.description} onChange={(event) => updateProject({ ...selected, description: event.target.value })} className="h-24 w-full rounded border border-white/15 bg-black/55 p-2" />
                <label>Status<select value={selected.status} onChange={(event) => updateProject({ ...selected, status: event.target.value as ProjectStatus })} className="ml-2 rounded border border-white/20 bg-black/55 px-2 py-1">{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
                <label>Progress {selected.progress}%<input type="range" min={0} max={100} value={selected.progress} onChange={(event) => updateProject({ ...selected, progress: Number(event.target.value) })} className="w-full" /></label>
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 52 52" className="h-12 w-12 -rotate-90">
                    <circle cx="26" cy="26" r="20" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
                    <circle
                      cx="26"
                      cy="26"
                      r="20"
                      stroke="#c9a84c"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={Math.PI * 40}
                      strokeDashoffset={Math.PI * 40 * (1 - selected.progress / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xs text-gray-300">Completion ring</span>
                </div>
                <div className="text-xs text-gray-400">Linked Observatory IDs: {selected.resourceRefs.join(', ') || 'None'}</div>
                <div className="text-xs text-gray-400">
                  Linked Grimoire Notes:{' '}
                  {grimoireNotes
                    .filter((note) => selected.domains.includes(note.domain))
                    .slice(0, 3)
                    .map((note) => note.title)
                    .join(', ') || 'None'}
                </div>
                <div className="rounded border border-red-500/35 p-2 text-xs"><p className="mb-1 text-red-300">Type project name to delete</p><input value={deleteName} onChange={(event) => setDeleteName(event.target.value)} className="w-full rounded border border-white/20 bg-black/55 px-2 py-1" /><button type="button" onClick={removeProject} className="mt-2 inline-flex items-center gap-1 rounded border border-red-500/55 px-2 py-1 text-red-300"><Trash2 className="h-3 w-3" /> Delete</button></div>
              </div>
              <div>
                <h4 className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-500">Milestone Log</h4>
                <div className="mb-2 flex gap-2"><input value={milestoneInput} onChange={(event) => setMilestoneInput(event.target.value)} placeholder="Add milestone..." className="flex-1 rounded border border-white/20 bg-black/55 px-2 py-1 text-xs" /><button type="button" onClick={addMilestone} className="rounded border border-white/20 px-2 py-1 text-xs">Add</button></div>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {selected.milestones.map((milestone) => (
                    <div key={milestone.id} className="rounded border border-white/10 bg-black/45 px-2 py-1.5 text-xs text-gray-300">
                      <div className="mb-0.5 flex items-center gap-1 text-[#e4ca87]"><Flame className="h-3 w-3" /> {milestone.text}</div>
                      <div className="text-[10px] text-gray-500">{new Date(milestone.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setSelected(null)} className="mt-4 rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">Close</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Forge;
