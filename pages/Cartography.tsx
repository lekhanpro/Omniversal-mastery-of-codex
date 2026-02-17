import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Download, Plus, Share2, Trash2 } from 'lucide-react';
import { DOMAIN_COLORS, masteryDomains, readLS, uid, writeLS } from '../utils/codex';

type Stage = 1 | 2 | 3 | 4;
type NodeStatus = 'not_started' | 'in_progress' | 'completed';
type EdgeKind = 'prerequisite' | 'optional';

interface RoadmapNode {
  id: string;
  subject: string;
  domain: number;
  hours: number;
  notes: string;
  stage: Stage;
  x: number;
  y: number;
  status: NodeStatus;
}

interface RoadmapEdge {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
  label: string;
}

interface Roadmap {
  id: string;
  name: string;
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  createdAt: string;
}

const STAGE_NAMES = ['Foundations', 'Core', 'Advanced', 'Mastery'] as const;

const seededRoadmaps = (): Roadmap[] => {
  const mkNode = (subject: string, domain: number, stage: Stage, x: number, y: number): RoadmapNode => ({
    id: uid('node'),
    subject,
    domain,
    stage,
    x,
    y,
    notes: '',
    hours: 8 + stage * 4,
    status: 'not_started',
  });
  return [
    {
      id: uid('roadmap'),
      name: 'Path to ML Engineer',
      createdAt: new Date().toISOString(),
      nodes: [
        mkNode('Python Fundamentals', 3, 1, 120, 130),
        mkNode('Linear Algebra for ML', 4, 1, 120, 260),
        mkNode('Machine Learning Basics', 4, 2, 360, 170),
        mkNode('Model Evaluation', 4, 2, 360, 290),
        mkNode('MLOps Fundamentals', 3, 3, 610, 190),
      ],
      edges: [],
    },
    {
      id: uid('roadmap'),
      name: 'Philosophy Deep Dive',
      createdAt: new Date().toISOString(),
      nodes: [
        mkNode('Logic Foundations', 7, 1, 120, 150),
        mkNode('Ethics Frameworks', 7, 2, 360, 150),
        mkNode('Epistemology', 7, 3, 610, 150),
        mkNode('Philosophy of Mind', 8, 4, 860, 150),
      ],
      edges: [],
    },
    {
      id: uid('roadmap'),
      name: 'Full Stack Developer',
      createdAt: new Date().toISOString(),
      nodes: [
        mkNode('HTML + CSS', 3, 1, 120, 120),
        mkNode('JavaScript', 3, 1, 120, 260),
        mkNode('React + State', 3, 2, 360, 120),
        mkNode('APIs + Auth', 3, 3, 610, 200),
        mkNode('Cloud Deployment', 10, 4, 860, 200),
      ],
      edges: [],
    },
  ];
};

const getRoadmapsFromStorage = (): Roadmap[] => {
  const stored = readLS<Roadmap[]>('cartography_roadmaps', []);
  if (stored.length > 0) return stored;
  const seeded = seededRoadmaps();
  writeLS('cartography_roadmaps', seeded);
  return seeded;
};

const Cartography: React.FC = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(() => getRoadmapsFromStorage());
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>(() => getRoadmapsFromStorage()[0]?.id ?? '');
  const [editMode, setEditMode] = useState(false);
  const [criticalPath, setCriticalPath] = useState(false);
  const [showNodeModal, setShowNodeModal] = useState(false);
  const [nodeDraft, setNodeDraft] = useState<RoadmapNode | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [celebration, setCelebration] = useState('');
  const [leftSearch, setLeftSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState({ panX: 0, panY: 0, zoom: 1 });
  const draggingRef = useRef<{ nodeId: string | null; draggingCanvas: boolean; lastX: number; lastY: number; edgeFrom: string | null }>({ nodeId: null, draggingCanvas: false, lastX: 0, lastY: 0, edgeFrom: null });

  const roadmap = useMemo(() => roadmaps.find((item) => item.id === selectedRoadmapId) ?? roadmaps[0], [roadmaps, selectedRoadmapId]);
  const criticalNodeSet = useMemo(() => {
    if (!roadmap || !criticalPath) return new Set<string>();
    const adjacency = new Map<string, string[]>();
    roadmap.edges.filter((edge) => edge.kind === 'prerequisite').forEach((edge) => {
      const list = adjacency.get(edge.from) ?? [];
      adjacency.set(edge.from, [...list, edge.to]);
    });
    const memo = new Map<string, string[]>();
    const dfs = (id: string): string[] => {
      if (memo.has(id)) return memo.get(id)!;
      const next = adjacency.get(id) ?? [];
      let best: string[] = [id];
      next.forEach((to) => {
        const candidate = [id, ...dfs(to)];
        if (candidate.length > best.length) best = candidate;
      });
      memo.set(id, best);
      return best;
    };
    let longest: string[] = [];
    roadmap.nodes.forEach((node) => {
      const chain = dfs(node.id);
      if (chain.length > longest.length) longest = chain;
    });
    return new Set(longest);
  }, [criticalPath, roadmap]);

  const progress = useMemo(() => {
    if (!roadmap) return { overall: 0, byStage: [0, 0, 0, 0], hoursLeft: 0 };
    const done = roadmap.nodes.filter((node) => node.status === 'completed').length;
    const overall = roadmap.nodes.length === 0 ? 0 : (done / roadmap.nodes.length) * 100;
    const byStage = [1, 2, 3, 4].map((stage) => {
      const stageNodes = roadmap.nodes.filter((node) => node.stage === stage);
      const completed = stageNodes.filter((node) => node.status === 'completed').length;
      return stageNodes.length === 0 ? 0 : (completed / stageNodes.length) * 100;
    });
    const hoursLeft = roadmap.nodes.filter((node) => node.status !== 'completed').reduce((sum, node) => sum + node.hours, 0);
    return { overall, byStage, hoursLeft };
  }, [roadmap]);

  useEffect(() => {
    writeLS('cartography_roadmaps', roadmaps);
  }, [roadmaps]);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('roadmap');
    if (!param) return;
    try {
      const decoded = JSON.parse(window.atob(param)) as Roadmap;
      setRoadmaps((current) => [decoded, ...current]);
      setSelectedRoadmapId(decoded.id);
    } catch {
      // ignore invalid payload
    }
  }, []);

  useEffect(() => {
    if (!roadmap) return;
    if (progress.byStage.some((value) => value === 100)) {
      const stageDone = progress.byStage.findIndex((value) => value === 100) + 1;
      if (stageDone > 0) {
        setCelebration(`Stage ${stageDone} Complete!`);
        window.setTimeout(() => setCelebration(''), 1800);
      }
    }
    if (progress.overall === 100) {
      setCelebration('Roadmap Complete!');
      window.setTimeout(() => setCelebration(''), 2200);
    }
  }, [progress.byStage, progress.overall, roadmap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !roadmap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const draw = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#070707';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const toScreen = (x: number, y: number): [number, number] => [x * view.zoom + view.panX, y * view.zoom + view.panY];
      const findNode = (id: string): RoadmapNode | undefined => roadmap.nodes.find((node) => node.id === id);

      roadmap.edges.forEach((edge) => {
        const from = findNode(edge.from);
        const to = findNode(edge.to);
        if (!from || !to) return;
        const [x1, y1] = toScreen(from.x + 160, from.y + 35);
        const [x2, y2] = toScreen(to.x, to.y + 35);
        const cp1x = x1 + 60 * view.zoom;
        const cp2x = x2 - 60 * view.zoom;
        const highlighted = criticalNodeSet.has(from.id) && criticalNodeSet.has(to.id);

        ctx.save();
        ctx.strokeStyle = highlighted ? '#e4ca87' : 'rgba(180,180,190,0.6)';
        ctx.lineWidth = highlighted ? 2.4 : 1.5;
        if (edge.kind === 'optional') ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(cp1x, y1, cp2x, y2, x2, y2);
        ctx.stroke();
        ctx.restore();
      });

      roadmap.nodes.forEach((node) => {
        const [x, y] = toScreen(node.x, node.y);
        const width = 160 * view.zoom;
        const height = 70 * view.zoom;
        const active = selectedNodeId === node.id;
        const color = DOMAIN_COLORS[node.domain] ?? '#c9a84c';
        const isCritical = criticalNodeSet.has(node.id);

        ctx.fillStyle =
          node.status === 'completed'
            ? '#c9a84c'
            : node.status === 'in_progress'
            ? 'rgba(86, 153, 255, 0.6)'
            : 'rgba(40,40,45,0.85)';
        ctx.strokeStyle = active || isCritical ? '#e4ca87' : color;
        ctx.lineWidth = active || isCritical ? 2.4 : 1.4;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 12 * view.zoom);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f0f0f0';
        ctx.font = `${13 * view.zoom}px Cinzel`;
        ctx.fillText(node.subject.slice(0, 22), x + 8 * view.zoom, y + 26 * view.zoom);
        ctx.font = `${10 * view.zoom}px JetBrains Mono`;
        ctx.fillText(`${node.hours}h`, x + 8 * view.zoom, y + 56 * view.zoom);
        ctx.fillText(node.status === 'completed' ? '✓' : '◻', x + width - 18 * view.zoom, y + 56 * view.zoom);
      });
    };
    draw();
  }, [criticalNodeSet, roadmap, selectedNodeId, view]);

  useEffect(() => {
    const onDelete = (event: KeyboardEvent): void => {
      if (event.key !== 'Delete' || !roadmap) return;
      if (selectedNodeId) {
        setRoadmaps((current) =>
          current.map((item) =>
            item.id !== roadmap.id
              ? item
              : {
                  ...item,
                  nodes: item.nodes.filter((node) => node.id !== selectedNodeId),
                  edges: item.edges.filter((edge) => edge.from !== selectedNodeId && edge.to !== selectedNodeId),
                }
          )
        );
        setSelectedNodeId(null);
      }
      if (selectedEdgeId) {
        setRoadmaps((current) =>
          current.map((item) => (item.id !== roadmap.id ? item : { ...item, edges: item.edges.filter((edge) => edge.id !== selectedEdgeId) }))
        );
        setSelectedEdgeId(null);
      }
    };
    window.addEventListener('keydown', onDelete);
    return () => window.removeEventListener('keydown', onDelete);
  }, [roadmap, selectedEdgeId, selectedNodeId]);

  const updateRoadmap = (next: Roadmap): void => {
    setRoadmaps((current) => current.map((item) => (item.id === next.id ? next : item)));
  };

  const handleCanvasPointer = (event: React.MouseEvent<HTMLCanvasElement>, type: 'down' | 'move' | 'up' | 'dblclick'): void => {
    if (!roadmap) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - view.panX) / view.zoom;
    const y = (event.clientY - rect.top - view.panY) / view.zoom;
    const hitNode = roadmap.nodes.find((node) => x >= node.x && x <= node.x + 160 && y >= node.y && y <= node.y + 70);

    if (type === 'dblclick' && hitNode && editMode) {
      setNodeDraft(hitNode);
      setShowNodeModal(true);
      return;
    }
    if (type === 'down') {
      draggingRef.current.lastX = event.clientX;
      draggingRef.current.lastY = event.clientY;
      if (hitNode) {
        setSelectedNodeId(hitNode.id);
        if (event.shiftKey && editMode) draggingRef.current.edgeFrom = hitNode.id;
        else draggingRef.current.nodeId = editMode ? hitNode.id : null;
      } else {
        setSelectedNodeId(null);
        if (editMode) setShowNodeModal(true);
        draggingRef.current.draggingCanvas = true;
      }
    }
    if (type === 'move') {
      const dx = (event.clientX - draggingRef.current.lastX) / view.zoom;
      const dy = (event.clientY - draggingRef.current.lastY) / view.zoom;
      draggingRef.current.lastX = event.clientX;
      draggingRef.current.lastY = event.clientY;
      if (draggingRef.current.nodeId && editMode) {
        updateRoadmap({
          ...roadmap,
          nodes: roadmap.nodes.map((node) =>
            node.id === draggingRef.current.nodeId
              ? { ...node, x: Math.round((node.x + dx) / 20) * 20, y: Math.round((node.y + dy) / 20) * 20 }
              : node
          ),
        });
      } else if (draggingRef.current.draggingCanvas) {
        setView((current) => ({ ...current, panX: current.panX + dx * current.zoom, panY: current.panY + dy * current.zoom }));
      }
    }
    if (type === 'up') {
      if (draggingRef.current.edgeFrom && hitNode && hitNode.id !== draggingRef.current.edgeFrom) {
        const kind = (window.prompt('Edge type: prerequisite or optional', 'prerequisite') ?? 'prerequisite') as EdgeKind;
        updateRoadmap({
          ...roadmap,
          edges: [
            ...roadmap.edges,
            {
              id: uid('edge'),
              from: draggingRef.current.edgeFrom,
              to: hitNode.id,
              kind: kind === 'optional' ? 'optional' : 'prerequisite',
              label: kind === 'optional' ? 'optional' : 'prerequisite',
            },
          ],
        });
      }
      draggingRef.current = { nodeId: null, draggingCanvas: false, lastX: 0, lastY: 0, edgeFrom: null };
    }
  };

  const addNodeFromDraft = (): void => {
    if (!roadmap || !nodeDraft) return;
    const next = nodeDraft.id
      ? roadmap.nodes.map((node) => (node.id === nodeDraft.id ? nodeDraft : node))
      : [...roadmap.nodes, { ...nodeDraft, id: uid('node') }];
    updateRoadmap({ ...roadmap, nodes: next });
    setNodeDraft(null);
    setShowNodeModal(false);
  };

  const addAutoRecommended = (): void => {
    if (!roadmap) return;
    const unchecked: RoadmapNode[] = [];
    masteryDomains.forEach((domain, dIndex) => {
      const subject = domain.subdomains[dIndex % domain.subdomains.length];
      unchecked.push({
        id: uid('node'),
        subject: subject.title,
        domain: domain.id,
        stage: ((dIndex % 4) + 1) as Stage,
        x: 120 + (dIndex % 4) * 220,
        y: 120 + Math.floor(dIndex / 4) * 120,
        hours: 10 + (dIndex % 3) * 4,
        notes: '',
        status: 'not_started',
      });
    });
    updateRoadmap({ ...roadmap, nodes: [...roadmap.nodes, ...unchecked.slice(0, 8)] });
  };

  if (!roadmap) return null;

  const shareRoadmap = (): void => {
    const payload = window.btoa(JSON.stringify(roadmap));
    const url = `${window.location.origin}${window.location.pathname}?roadmap=${encodeURIComponent(payload)}${window.location.hash}`;
    navigator.clipboard.writeText(url).catch(() => null);
  };

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] px-3 py-4 md:px-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select value={roadmap.id} onChange={(event) => setSelectedRoadmapId(event.target.value)} className="rounded border border-white/20 bg-black/55 px-3 py-1.5 text-sm text-gray-200">
          {roadmaps.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <button type="button" onClick={() => { const name = window.prompt('Roadmap name', 'New Roadmap'); if (!name) return; const fresh: Roadmap = { id: uid('roadmap'), name, createdAt: new Date().toISOString(), nodes: [], edges: [] }; setRoadmaps((current) => [fresh, ...current]); setSelectedRoadmapId(fresh.id); }} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300"><Plus className="mr-1 inline h-3.5 w-3.5" />Create New</button>
        <button type="button" onClick={() => { const name = window.prompt('Rename roadmap', roadmap.name); if (!name) return; updateRoadmap({ ...roadmap, name }); }} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">Rename</button>
        <button type="button" onClick={() => { const duplicate = { ...roadmap, id: uid('roadmap'), name: `${roadmap.name} Copy`, nodes: roadmap.nodes.map((node) => ({ ...node, id: uid('node') })), edges: [] }; setRoadmaps((current) => [duplicate, ...current]); setSelectedRoadmapId(duplicate.id); }} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">Duplicate</button>
        <button type="button" onClick={() => { if (!window.confirm('Delete this roadmap?')) return; const next = roadmaps.filter((item) => item.id !== roadmap.id); setRoadmaps(next); setSelectedRoadmapId(next[0]?.id ?? ''); }} className="rounded border border-red-500/45 px-3 py-1.5 text-sm text-red-300"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Delete</button>
        <button type="button" onClick={() => setEditMode((current) => !current)} className={`rounded border px-3 py-1.5 text-sm ${editMode ? 'border-[#c9a84c]/70 text-[#e4ca87]' : 'border-white/20 text-gray-300'}`}>Edit Mode</button>
        <button type="button" onClick={() => setCriticalPath((current) => !current)} className={`rounded border px-3 py-1.5 text-sm ${criticalPath ? 'border-[#c9a84c]/70 text-[#e4ca87]' : 'border-white/20 text-gray-300'}`}>Critical Path</button>
        <button type="button" onClick={addAutoRecommended} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">Auto-Recommend</button>
        <button type="button" onClick={() => { const canvas = canvasRef.current; if (!canvas) return; const link = document.createElement('a'); link.href = canvas.toDataURL('image/png'); link.download = `roadmap-${Date.now()}.png`; link.click(); }} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300"><Download className="mr-1 inline h-3.5 w-3.5" />PNG</button>
        <button type="button" onClick={() => { const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' })); link.download = `${roadmap.name}.json`; link.click(); }} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">JSON</button>
        <button type="button" onClick={shareRoadmap} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300"><Share2 className="mr-1 inline h-3.5 w-3.5" />Share URL</button>
      </div>

      <div className="mb-3 rounded-xl border border-white/10 bg-black/45 p-3 text-xs text-gray-300">
        <div className="mb-1">Overall Progress {progress.overall.toFixed(1)}%</div>
        <div className="mb-2 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#c9a84c]" style={{ width: `${progress.overall}%` }} /></div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {progress.byStage.map((value, index) => (
            <div key={index}>
              <div>{STAGE_NAMES[index]}</div>
              <div className="h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#44aaff]" style={{ width: `${value}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="mt-2">Hours Remaining: {progress.hoursLeft} · Predicted finish: {new Date(Date.now() + progress.hoursLeft * 86_400_000 / Math.max(1, Number.parseInt(localStorage.getItem('arena_streak') ?? '1', 10))).toLocaleDateString()}</div>
      </div>

      <div className="relative grid gap-3 lg:grid-cols-[1fr_260px]">
        <div className="relative rounded-xl border border-white/10 bg-black/45">
          <div className="pointer-events-none absolute inset-x-0 top-2 grid grid-cols-4 px-4 text-center text-xs text-gray-500">
            {STAGE_NAMES.map((name) => <div key={name} className="font-cinzel">{name}</div>)}
          </div>
          <canvas
            ref={canvasRef}
            width={1200}
            height={620}
            className="h-[620px] w-full"
            onMouseDown={(event) => handleCanvasPointer(event, 'down')}
            onMouseMove={(event) => handleCanvasPointer(event, 'move')}
            onMouseUp={(event) => handleCanvasPointer(event, 'up')}
            onDoubleClick={(event) => handleCanvasPointer(event, 'dblclick')}
            onWheel={(event) => {
              event.preventDefault();
              const rect = event.currentTarget.getBoundingClientRect();
              const mouseX = event.clientX - rect.left;
              const mouseY = event.clientY - rect.top;
              const wx = (mouseX - view.panX) / view.zoom;
              const wy = (mouseY - view.panY) / view.zoom;
              const nextZoom = Math.max(0.5, Math.min(2, view.zoom * (event.deltaY > 0 ? 0.92 : 1.08)));
              setView((current) => ({
                ...current,
                zoom: nextZoom,
                panX: mouseX - wx * nextZoom,
                panY: mouseY - wy * nextZoom,
              }));
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              if (!editMode) return;
              const payload = event.dataTransfer.getData('text/plain');
              if (!payload) return;
              const [subject, domainRaw] = payload.split('||');
              const rect = event.currentTarget.getBoundingClientRect();
              const x = Math.round(((event.clientX - rect.left - view.panX) / view.zoom) / 20) * 20;
              const y = Math.round(((event.clientY - rect.top - view.panY) / view.zoom) / 20) * 20;
              updateRoadmap({
                ...roadmap,
                nodes: [
                  ...roadmap.nodes,
                  { id: uid('node'), subject, domain: Number(domainRaw), stage: 1, x, y, hours: 10, notes: '', status: 'not_started' },
                ],
              });
            }}
          />
          <div className="pointer-events-none absolute right-3 top-3 text-[#c9a84c]" style={{ animation: 'spin 60s linear infinite' }}>
            <Compass className="h-10 w-10" />
          </div>
        </div>

        {editMode && (
          <aside className="rounded-xl border border-white/10 bg-black/45 p-3">
            <input value={leftSearch} onChange={(event) => setLeftSearch(event.target.value)} placeholder="Search subjects..." className="mb-2 w-full rounded border border-white/20 bg-black/55 px-2 py-1 text-xs text-gray-200" />
            <select value={domainFilter ?? ''} onChange={(event) => setDomainFilter(event.target.value ? Number(event.target.value) : null)} className="mb-2 w-full rounded border border-white/20 bg-black/55 px-2 py-1 text-xs text-gray-200">
              <option value="">All domains</option>
              {masteryDomains.map((domain) => <option key={domain.id} value={domain.id}>D{domain.id}</option>)}
            </select>
            <div className="max-h-[560px] space-y-2 overflow-y-auto">
              {masteryDomains
                .filter((domain) => !domainFilter || domain.id === domainFilter)
                .map((domain) => (
                  <div key={domain.id}>
                    <div className="mb-1 text-xs text-gray-500">D{domain.id}. {domain.title}</div>
                    <div className="space-y-1">
                      {domain.subdomains
                        .filter((subdomain) => subdomain.title.toLowerCase().includes(leftSearch.toLowerCase()))
                        .map((subdomain) => {
                          const already = roadmap.nodes.some((node) => node.subject === subdomain.title);
                          return (
                            <div
                              key={subdomain.title}
                              draggable={!already}
                              onDragStart={(event) => event.dataTransfer.setData('text/plain', `${subdomain.title}||${domain.id}`)}
                              className={`rounded border px-2 py-1 text-xs ${already ? 'border-white/10 bg-black/35 text-gray-600' : 'border-white/20 text-gray-300 hover:border-[#c9a84c]'}`}
                            >
                              {subdomain.title} {already && '✓'}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
            </div>
          </aside>
        )}
      </div>

      <AnimatePresence>
        {showNodeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-black/90 p-4">
              <h3 className="mb-2 font-cinzel text-2xl text-[#e4ca87]">{nodeDraft?.id ? 'Edit Node' : 'Add Node'}</h3>
              <div className="space-y-2 text-sm">
                <input value={nodeDraft?.subject ?? ''} onChange={(event) => setNodeDraft((current) => ({ ...(current ?? { id: '', subject: '', domain: 1, stage: 1, x: 140, y: 140, hours: 8, notes: '', status: 'not_started' }), subject: event.target.value }))} placeholder="Subject Name" className="w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={nodeDraft?.domain ?? 1} onChange={(event) => setNodeDraft((current) => ({ ...(current ?? { id: '', subject: '', domain: 1, stage: 1, x: 140, y: 140, hours: 8, notes: '', status: 'not_started' }), domain: Number(event.target.value) }))} className="rounded border border-white/20 bg-black/55 px-2 py-1">
                    {masteryDomains.map((domain) => <option key={domain.id} value={domain.id}>D{domain.id}</option>)}
                  </select>
                  <select value={nodeDraft?.stage ?? 1} onChange={(event) => setNodeDraft((current) => ({ ...(current ?? { id: '', subject: '', domain: 1, stage: 1, x: 140, y: 140, hours: 8, notes: '', status: 'not_started' }), stage: Number(event.target.value) as Stage }))} className="rounded border border-white/20 bg-black/55 px-2 py-1">
                    {[1, 2, 3, 4].map((stage) => <option key={stage} value={stage}>Stage {stage}</option>)}
                  </select>
                </div>
                <input type="number" value={nodeDraft?.hours ?? 8} onChange={(event) => setNodeDraft((current) => ({ ...(current ?? { id: '', subject: '', domain: 1, stage: 1, x: 140, y: 140, hours: 8, notes: '', status: 'not_started' }), hours: Number(event.target.value) }))} placeholder="Estimated Hours" className="w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
                <textarea value={nodeDraft?.notes ?? ''} onChange={(event) => setNodeDraft((current) => ({ ...(current ?? { id: '', subject: '', domain: 1, stage: 1, x: 140, y: 140, hours: 8, notes: '', status: 'not_started' }), notes: event.target.value }))} placeholder="Notes" className="h-20 w-full rounded border border-white/20 bg-black/55 px-3 py-2" />
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={addNodeFromDraft} className="rounded border border-[#c9a84c]/70 bg-[#c9a84c]/12 px-3 py-1.5 text-sm text-[#e4ca87]">Save</button>
                <button type="button" onClick={() => setShowNodeModal(false)} className="rounded border border-white/20 px-3 py-1.5 text-sm text-gray-300">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {celebration && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-x-0 top-16 z-50 mx-auto max-w-sm rounded-xl border border-[#c9a84c]/65 bg-[#c9a84c]/12 p-4 text-center font-cinzel text-2xl text-[#e4ca87]">
            {celebration}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cartography;
