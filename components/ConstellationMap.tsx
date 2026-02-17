import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Flame, Search } from 'lucide-react';
import { useShareProgress } from '../contexts/ShareProgressContext';
import { DOMAIN_COLORS, getDomainProgress, lightenColor, masteryDomains } from '../utils/codex';

interface MoonNode {
  name: string;
  radius: number;
  speed: number;
  angle: number;
  delayMs: number;
}

interface PlanetNode {
  id: number;
  name: string;
  color: string;
  completion: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  moons: MoonNode[];
  pulseOffset: number;
}

interface ConnectionEdge {
  from: number;
  to: number;
  dotT: number;
}

interface SearchResult {
  matchedNodeIds: Set<number>;
  count: number;
}

interface HoveredMoon {
  text: string;
  x: number;
  y: number;
}

const MAP_DOMAIN_IDS = masteryDomains.map((domain) => domain.id);
const REPULSION_K = 8000;
const ATTRACTION_K = 0.002;
const DAMPING = 0.88;
const CENTERING_FORCE = 0.0003;
const BIG_BANG_DURATION = 1500;

const CORE_CONNECTIONS: Array<[number, number]> = [
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 6],
  [2, 3],
  [2, 6],
  [2, 10],
  [3, 8],
  [3, 9],
  [3, 5],
  [4, 1],
  [4, 8],
  [5, 9],
  [5, 7],
  [5, 10],
  [6, 9],
  [6, 10],
  [7, 8],
  [7, 9],
  [8, 9],
  [8, 3],
];

const CONNECTIONS: Array<[number, number]> = (() => {
  const map = new Map<string, [number, number]>();
  const addEdge = (left: number, right: number): void => {
    if (left === right) return;
    if (!MAP_DOMAIN_IDS.includes(left) || !MAP_DOMAIN_IDS.includes(right)) return;
    const key = left < right ? `${left}-${right}` : `${right}-${left}`;
    if (!map.has(key)) {
      map.set(key, left < right ? [left, right] : [right, left]);
    }
  };

  CORE_CONNECTIONS.forEach(([left, right]) => addEdge(left, right));

  // Ensure all 20 domains stay meaningfully connected in the force graph.
  MAP_DOMAIN_IDS.forEach((domainId, index) => {
    const next = MAP_DOMAIN_IDS[(index + 1) % MAP_DOMAIN_IDS.length];
    const skip = MAP_DOMAIN_IDS[(index + 4) % MAP_DOMAIN_IDS.length];
    addEdge(domainId, next);
    addEdge(domainId, skip);
  });

  return [...map.values()];
})();

const randomInRange = (min: number, max: number): number => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
const lerp = (current: number, target: number, factor: number): number => current + (target - current) * factor;

const easeOutElastic = (t: number): number => {
  if (t === 0 || t === 1) return t;
  const period = (2 * Math.PI) / 3;
  return Math.pow(2, -10 * t) * Math.sin(((t * 10) - 0.75) * period) + 1;
};

const hexToRgb = (hexColor: string): [number, number, number] => {
  const hex = hexColor.replace('#', '');
  const normalized = hex.length === 3 ? hex.split('').map((char) => `${char}${char}`).join('') : hex;
  const value = Number.parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const mixHex = (cold: string, hot: string, ratio: number): string => {
  const t = clamp(ratio, 0, 1);
  const [cr, cg, cb] = hexToRgb(cold);
  const [hr, hg, hb] = hexToRgb(hot);
  const red = Math.round(cr + (hr - cr) * t);
  const green = Math.round(cg + (hg - cg) * t);
  const blue = Math.round(cb + (hb - cb) * t);
  return `rgb(${red}, ${green}, ${blue})`;
};

const collectMoonNames = (domainId: number): string[] => {
  const domain = masteryDomains.find((entry) => entry.id === domainId);
  if (!domain) return [];
  const names: string[] = [];
  domain.subdomains.forEach((subdomain) => {
    names.push(subdomain.title);
    subdomain.points.slice(0, 2).forEach((point) => names.push(point));
  });
  return [...new Set(names)].slice(0, 16);
};

const initializeNodes = (readOnlyProgress?: Record<string, string>): PlanetNode[] => {
  const nodes: PlanetNode[] = MAP_DOMAIN_IDS.map((domainId, index) => {
    const domain = masteryDomains.find((entry) => entry.id === domainId);
    const names = collectMoonNames(domainId);
    const moons: MoonNode[] = names.map((name, moonIndex) => ({
      name,
      radius: 60 + (moonIndex % 8) * 8,
      speed: 0.002 + (moonIndex % 6) * 0.00055,
      angle: (moonIndex / Math.max(1, names.length)) * Math.PI * 2,
      delayMs: moonIndex * 50,
    }));

    const angle = (index / MAP_DOMAIN_IDS.length) * Math.PI * 2;
    return {
      id: domainId,
      name: domain?.title ?? `Domain ${domainId}`,
      color: DOMAIN_COLORS[domainId] ?? '#44aaff',
      completion: getDomainProgress(domainId, readOnlyProgress).completion,
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      vx: randomInRange(-1, 1),
      vy: randomInRange(-1, 1),
      baseX: Math.cos(angle) * randomInRange(180, 320),
      baseY: Math.sin(angle) * randomInRange(180, 320),
      moons,
      pulseOffset: Math.random() * Math.PI * 2,
    };
  });

  for (let iteration = 0; iteration < 50; iteration += 1) {
    for (let left = 0; left < nodes.length; left += 1) {
      for (let right = left + 1; right < nodes.length; right += 1) {
        const nodeA = nodes[left];
        const nodeB = nodes[right];
        const dx = nodeB.baseX - nodeA.baseX;
        const dy = nodeB.baseY - nodeA.baseY;
        const distanceSq = dx * dx + dy * dy + 0.0001;
        const distance = Math.sqrt(distanceSq);
        const force = REPULSION_K / distanceSq;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        nodeA.vx -= fx;
        nodeA.vy -= fy;
        nodeB.vx += fx;
        nodeB.vy += fy;
      }
    }

    CONNECTIONS.forEach(([from, to]) => {
      const nodeA = nodes.find((entry) => entry.id === from);
      const nodeB = nodes.find((entry) => entry.id === to);
      if (!nodeA || !nodeB) return;
      const dx = nodeB.baseX - nodeA.baseX;
      const dy = nodeB.baseY - nodeA.baseY;
      const distance = Math.hypot(dx, dy) || 1;
      const pull = distance * ATTRACTION_K;
      const fx = (dx / distance) * pull;
      const fy = (dy / distance) * pull;
      nodeA.vx += fx;
      nodeA.vy += fy;
      nodeB.vx -= fx;
      nodeB.vy -= fy;
    });

    nodes.forEach((node) => {
      node.vx += (0 - node.baseX) * CENTERING_FORCE;
      node.vy += (0 - node.baseY) * CENTERING_FORCE;
      node.vx *= DAMPING;
      node.vy *= DAMPING;
      node.baseX += node.vx;
      node.baseY += node.vy;
    });
  }

  nodes.forEach((node) => {
    node.vx = 0;
    node.vy = 0;
    node.tx = node.baseX;
    node.ty = node.baseY;
  });

  return nodes;
};

const initializeEdges = (): ConnectionEdge[] =>
  CONNECTIONS.map(([from, to]) => ({
    from,
    to,
    dotT: Math.random(),
  }));

const createAdjacencyMap = (): Record<number, Set<number>> => {
  const adjacency: Record<number, Set<number>> = {};
  MAP_DOMAIN_IDS.forEach((domainId) => {
    adjacency[domainId] = new Set<number>();
  });
  CONNECTIONS.forEach(([from, to]) => {
    adjacency[from]?.add(to);
    adjacency[to]?.add(from);
  });
  return adjacency;
};

const ConstellationMap: React.FC = () => {
  const { isReadOnly, sharedProgress } = useShareProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<PlanetNode[]>([]);
  const edgesRef = useRef<ConnectionEdge[]>([]);
  const adjacencyRef = useRef<Record<number, Set<number>>>(createAdjacencyMap());
  const animationRef = useRef<number>(0);
  const introStartRef = useRef<number>(0);
  const selectedSinceRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const panRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const draggingRef = useRef(false);
  const dragOriginRef = useRef({ x: 0, y: 0 });

  const [search, setSearch] = useState('');
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [hoveredMoon, setHoveredMoon] = useState<HoveredMoon | null>(null);
  const [heatMapEnabled, setHeatMapEnabled] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);

  const hoveredNodeIdRef = useRef<number | null>(null);
  const selectedNodeIdRef = useRef<number | null>(null);
  const hoveredMoonRef = useRef<HoveredMoon | null>(null);
  const heatMapEnabledRef = useRef(false);
  const searchResultRef = useRef<SearchResult>({ matchedNodeIds: new Set<number>(), count: 0 });
  const searchQueryRef = useRef('');

  const mostConnectedDomain = useMemo(() => {
    let bestDomain: number = MAP_DOMAIN_IDS[0];
    let bestCount = 0;
    MAP_DOMAIN_IDS.forEach((domainId) => {
      const count = adjacencyRef.current[domainId]?.size ?? 0;
      if (count > bestCount) {
        bestDomain = domainId;
        bestCount = count;
      }
    });
    return masteryDomains.find((domain) => domain.id === bestDomain)?.title ?? `Domain ${bestDomain}`;
  }, []);

  const searchResult = useMemo<SearchResult>(() => {
    const query = search.trim().toLowerCase();
    if (!query) return { matchedNodeIds: new Set<number>(), count: 0 };

    const matched = new Set<number>();
    let moonCount = 0;
    nodesRef.current.forEach((node) => {
      const nameMatch = node.name.toLowerCase().includes(query);
      const moonMatches = node.moons.filter((moon) => moon.name.toLowerCase().includes(query)).length;
      if (nameMatch || moonMatches > 0) {
        matched.add(node.id);
      }
      moonCount += moonMatches;
    });
    return {
      matchedNodeIds: matched,
      count: matched.size + moonCount,
    };
  }, [search]);

  useEffect(() => {
    setResultsCount(searchResult.count);
  }, [searchResult]);

  useEffect(() => {
    hoveredNodeIdRef.current = hoveredNodeId;
  }, [hoveredNodeId]);

  useEffect(() => {
    selectedNodeIdRef.current = selectedNodeId;
  }, [selectedNodeId]);

  useEffect(() => {
    hoveredMoonRef.current = hoveredMoon;
  }, [hoveredMoon]);

  useEffect(() => {
    heatMapEnabledRef.current = heatMapEnabled;
  }, [heatMapEnabled]);

  useEffect(() => {
    searchResultRef.current = searchResult;
  }, [searchResult]);

  useEffect(() => {
    searchQueryRef.current = search.trim().toLowerCase();
  }, [search]);

  useEffect(() => {
    nodesRef.current = initializeNodes(isReadOnly ? sharedProgress : undefined);
    edgesRef.current = initializeEdges();
    introStartRef.current = performance.now();
    selectedSinceRef.current = 0;
  }, [isReadOnly, sharedProgress]);

  useEffect(() => {
    const refreshCompletions = (): void => {
      nodesRef.current.forEach((node) => {
        node.completion = getDomainProgress(node.id, isReadOnly ? sharedProgress : undefined).completion;
      });
    };
    refreshCompletions();
    window.addEventListener('storage', refreshCompletions);
    return () => window.removeEventListener('storage', refreshCompletions);
  }, [isReadOnly, sharedProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = (): void => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const toScreen = (x: number, y: number): { x: number; y: number } => ({
      x: width / 2 + panRef.current.x + x * zoomRef.current,
      y: height / 2 + panRef.current.y + y * zoomRef.current,
    });

    const toWorld = (x: number, y: number): { x: number; y: number } => ({
      x: (x - width / 2 - panRef.current.x) / zoomRef.current,
      y: (y - height / 2 - panRef.current.y) / zoomRef.current,
    });

    const applyForceLayoutStep = (): void => {
      const nodes = nodesRef.current;

      const activeSelectedId = selectedNodeIdRef.current;
      if (activeSelectedId !== null) {
        const focused = nodes.find((node) => node.id === activeSelectedId);
        if (!focused) return;
        nodes.forEach((node) => {
          if (node.id === focused.id) {
            node.tx = 0;
            node.ty = 0;
            return;
          }
          const angle = Math.atan2(node.baseY - focused.baseY, node.baseX - focused.baseX);
          const pushRadius = 300 + (node.id % 3) * 40;
          node.tx = Math.cos(angle) * pushRadius;
          node.ty = Math.sin(angle) * pushRadius;
        });
        return;
      }

      for (let left = 0; left < nodes.length; left += 1) {
        for (let right = left + 1; right < nodes.length; right += 1) {
          const nodeA = nodes[left];
          const nodeB = nodes[right];
          const dx = nodeB.baseX - nodeA.baseX;
          const dy = nodeB.baseY - nodeA.baseY;
          const distanceSq = dx * dx + dy * dy + 0.0001;
          const distance = Math.sqrt(distanceSq);
          const force = REPULSION_K / distanceSq;
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          nodeA.vx -= fx;
          nodeA.vy -= fy;
          nodeB.vx += fx;
          nodeB.vy += fy;
        }
      }

      edgesRef.current.forEach((edge) => {
        const nodeA = nodes.find((node) => node.id === edge.from);
        const nodeB = nodes.find((node) => node.id === edge.to);
        if (!nodeA || !nodeB) return;
        const dx = nodeB.baseX - nodeA.baseX;
        const dy = nodeB.baseY - nodeA.baseY;
        const distance = Math.hypot(dx, dy) || 1;
        const pull = distance * ATTRACTION_K;
        const fx = (dx / distance) * pull;
        const fy = (dy / distance) * pull;
        nodeA.vx += fx;
        nodeA.vy += fy;
        nodeB.vx -= fx;
        nodeB.vy -= fy;
      });

      nodes.forEach((node) => {
        node.vx += (0 - node.baseX) * CENTERING_FORCE;
        node.vy += (0 - node.baseY) * CENTERING_FORCE;
        node.vx *= DAMPING;
        node.vy *= DAMPING;
        node.baseX += node.vx;
        node.baseY += node.vy;
        node.tx = node.baseX;
        node.ty = node.baseY;
      });
    };

    const draw = (time: number): void => {
      if (time - lastFrameRef.current < 1000 / 60) {
        animationRef.current = window.requestAnimationFrame(draw);
        return;
      }
      lastFrameRef.current = time;

      const nodes = nodesRef.current;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#04050b';
      context.fillRect(0, 0, width, height);

      applyForceLayoutStep();

      const elapsed = time - introStartRef.current;
      const introT = clamp(elapsed / BIG_BANG_DURATION, 0, 1);
      const bigBangScale = easeOutElastic(introT);
      const lineReveal = clamp((elapsed - 900) / 800, 0, 1);

      nodes.forEach((node) => {
        const targetX = node.tx * bigBangScale;
        const targetY = node.ty * bigBangScale;
        node.x = lerp(node.x, targetX, 0.08);
        node.y = lerp(node.y, targetY, 0.08);
      });

      const activeHoveredId = hoveredNodeIdRef.current;
      const activeSearch = searchQueryRef.current;
      const activeSearchResult = searchResultRef.current;
      const connectedToHovered = activeHoveredId ? adjacencyRef.current[activeHoveredId] ?? new Set<number>() : new Set<number>();

      context.save();
      context.translate(width / 2 + panRef.current.x, height / 2 + panRef.current.y);
      context.scale(zoomRef.current, zoomRef.current);

      edgesRef.current.forEach((edge) => {
        const fromNode = nodes.find((node) => node.id === edge.from);
        const toNode = nodes.find((node) => node.id === edge.to);
        if (!fromNode || !toNode) return;

        const hoveredLine =
          activeHoveredId !== null &&
          (edge.from === activeHoveredId || edge.to === activeHoveredId || connectedToHovered.has(edge.from) || connectedToHovered.has(edge.to));

        let opacity = activeHoveredId === null ? 0.34 : hoveredLine ? 0.75 : 0.08;
        if (activeSearch.length > 0) {
          const matchesFrom = activeSearchResult.matchedNodeIds.has(fromNode.id);
          const matchesTo = activeSearchResult.matchedNodeIds.has(toNode.id);
          opacity *= matchesFrom || matchesTo ? 1 : 0.15;
        }
        opacity *= lineReveal;

        context.save();
        context.globalAlpha = opacity;
        context.strokeStyle = hoveredLine ? '#e9c46a' : 'rgba(128,155,220,0.75)';
        context.lineWidth = hoveredLine ? 2 : 1.2;
        context.setLineDash([10, 7]);
        context.lineDashOffset = (1 - lineReveal) * 80;
        context.beginPath();
        context.moveTo(fromNode.x, fromNode.y);
        context.lineTo(toNode.x, toNode.y);
        context.stroke();
        context.restore();

        edge.dotT = (edge.dotT + 0.004) % 1;
        const dotX = lerp(fromNode.x, toNode.x, edge.dotT);
        const dotY = lerp(fromNode.y, toNode.y, edge.dotT);
        context.save();
        context.globalAlpha = opacity;
        context.fillStyle = '#f3d688';
        context.beginPath();
        context.arc(dotX, dotY, 3, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });

      const activeSelectedId = selectedNodeIdRef.current;
      let hoveredMoonPreview: HoveredMoon | undefined;

      nodes.forEach((node) => {
        const hovered = activeHoveredId === node.id;
        const selected = activeSelectedId === node.id;
        const connected = activeHoveredId !== null && (connectedToHovered.has(node.id) || hovered);

        let opacity = 1;
        if (activeHoveredId !== null && !hovered) {
          opacity = connected ? 0.95 : 0.15;
        }
        if (activeSearch.length > 0) {
          const match = activeSearchResult.matchedNodeIds.has(node.id);
          opacity *= match ? 1 : 0.05;
        }

        const scale = hovered ? 1.4 : 1;
        const radius = 28 * scale;
        const sourceColor = heatMapEnabledRef.current ? mixHex('#1a3a6a', '#c9a84c', node.completion / 100) : node.color;
        const ringColor = lightenColor(sourceColor, 0.3);

        context.save();
        context.globalAlpha = opacity;
        context.shadowBlur = 30;
        context.shadowColor = sourceColor;

        context.fillStyle = sourceColor;
        context.beginPath();
        context.arc(node.x, node.y, radius, 0, Math.PI * 2);
        context.fill();

        context.shadowBlur = 0;
        context.strokeStyle = '#f9e8b5';
        context.lineWidth = 1.2;
        context.setLineDash([6, 6]);
        context.save();
        context.translate(node.x, node.y);
        context.rotate((time * 0.0007) + node.pulseOffset);
        context.beginPath();
        context.arc(0, 0, radius + 12, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        context.save();
        context.translate(node.x, node.y);
        context.rotate(-(time * 0.00045) + node.pulseOffset * 0.8);
        context.strokeStyle = ringColor;
        context.setLineDash([3, 5]);
        context.beginPath();
        context.arc(0, 0, radius + 21, 0, Math.PI * 2);
        context.stroke();
        context.restore();

        context.setLineDash([]);
        context.font = '11px JetBrains Mono';
        context.textAlign = 'center';
        context.fillStyle = '#f5f6ff';
        context.fillText(`D${node.id}`, node.x, node.y + 3);

        if (activeSearch.length > 0 && activeSearchResult.matchedNodeIds.has(node.id)) {
          const pulse = 0.4 + 0.6 * (Math.sin(time * 0.01 + node.pulseOffset) * 0.5 + 0.5);
          context.strokeStyle = `rgba(233, 196, 106, ${pulse})`;
          context.lineWidth = 2.5;
          context.beginPath();
          context.arc(node.x, node.y, radius + 8, 0, Math.PI * 2);
          context.stroke();
        }

        if (selected) {
          const sinceSelection = time - selectedSinceRef.current;
          node.moons.forEach((moon, moonIndex) => {
            const visibility = clamp((sinceSelection - moon.delayMs) / 280, 0, 1);
            if (visibility <= 0) return;
            const moonAngle = moon.angle + time * moon.speed;
            const moonX = node.x + Math.cos(moonAngle) * moon.radius;
            const moonY = node.y + Math.sin(moonAngle) * moon.radius;
            const moonRadius = 8;

            context.save();
            context.globalAlpha = visibility * opacity;
            context.fillStyle = lightenColor(sourceColor, 0.45);
            context.beginPath();
            context.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
            context.fill();
            context.restore();

            if (hoveredMoonRef.current && hoveredMoonRef.current.text === moon.name) {
              hoveredMoonPreview = {
                text: moon.name,
                x: moonX,
                y: moonY,
              };
            }

            if (activeSearch.length > 0 && moon.name.toLowerCase().includes(activeSearch)) {
              context.save();
              context.globalAlpha = visibility * opacity;
              context.strokeStyle = `rgba(233,196,106,${0.6 + Math.sin(time * 0.02 + moonIndex) * 0.3})`;
              context.lineWidth = 1.5;
              context.beginPath();
              context.arc(moonX, moonY, moonRadius + 3, 0, Math.PI * 2);
              context.stroke();
              context.restore();
            }
          });
        }

        context.restore();
      });

      context.restore();

      if (hoveredMoonPreview !== undefined) {
        const moonScreen = toScreen(hoveredMoonPreview.x, hoveredMoonPreview.y);
        context.fillStyle = 'rgba(5,8,18,0.95)';
        context.strokeStyle = '#c9a84c';
        context.lineWidth = 1;
        const text = hoveredMoonPreview.text;
        context.font = '12px "JetBrains Mono", monospace';
        const widthText = context.measureText(text).width;
        const boxW = widthText + 16;
        const boxH = 24;
        context.fillRect(moonScreen.x - boxW / 2, moonScreen.y - 36, boxW, boxH);
        context.strokeRect(moonScreen.x - boxW / 2, moonScreen.y - 36, boxW, boxH);
        context.fillStyle = '#f4e2ae';
        context.textAlign = 'center';
        context.fillText(text, moonScreen.x, moonScreen.y - 20);
      }

      animationRef.current = window.requestAnimationFrame(draw);
    };

    animationRef.current = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const updateHoverState = (mouseX: number, mouseY: number): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const worldX = (mouseX - width / 2 - panRef.current.x) / zoomRef.current;
    const worldY = (mouseY - height / 2 - panRef.current.y) / zoomRef.current;

    const nodes = nodesRef.current;
    let nodeMatch: number | null = null;
    for (const node of nodes) {
      const distance = Math.hypot(worldX - node.x, worldY - node.y);
      if (distance <= 30) {
        nodeMatch = node.id;
        break;
      }
    }
    setHoveredNodeId(nodeMatch);

    const activeSelectedId = selectedNodeIdRef.current;
    if (activeSelectedId !== null) {
      const selectedNode = nodes.find((node) => node.id === activeSelectedId);
      if (!selectedNode) return;
      const now = performance.now();
      const elapsed = now - selectedSinceRef.current;
      let moonMatch: HoveredMoon | null = null;
      selectedNode.moons.forEach((moon) => {
        const visible = clamp((elapsed - moon.delayMs) / 280, 0, 1);
        if (visible <= 0) return;
        const moonAngle = moon.angle + now * moon.speed;
        const moonX = selectedNode.x + Math.cos(moonAngle) * moon.radius;
        const moonY = selectedNode.y + Math.sin(moonAngle) * moon.radius;
        const distance = Math.hypot(worldX - moonX, worldY - moonY);
        if (distance <= 10) {
          moonMatch = { text: moon.name, x: moonX, y: moonY };
        }
      });
      setHoveredMoon(moonMatch);
    } else {
      setHoveredMoon(null);
    }
  };

  const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    draggingRef.current = true;
    dragOriginRef.current = { x: event.clientX, y: event.clientY };
  };

  const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (draggingRef.current) {
      const dx = event.clientX - dragOriginRef.current.x;
      const dy = event.clientY - dragOriginRef.current.y;
      panRef.current.x += dx;
      panRef.current.y += dy;
      dragOriginRef.current = { x: event.clientX, y: event.clientY };
      return;
    }
    updateHoverState(mouseX, mouseY);
  };

  const onMouseUp = (): void => {
    draggingRef.current = false;
  };

  const onCanvasClick = (): void => {
    const hovered = hoveredNodeIdRef.current;
    if (hovered === null) return;
    setSelectedNodeId(hovered);
    selectedSinceRef.current = performance.now();
  };

  const onWheel = (event: React.WheelEvent<HTMLCanvasElement>): void => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;

    const worldX = (cursorX - rect.width / 2 - panRef.current.x) / zoomRef.current;
    const worldY = (cursorY - rect.height / 2 - panRef.current.y) / zoomRef.current;

    const scale = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = clamp(zoomRef.current * scale, 0.4, 3);
    zoomRef.current = newZoom;

    panRef.current.x = cursorX - rect.width / 2 - worldX * newZoom;
    panRef.current.y = cursorY - rect.height / 2 - worldY * newZoom;
  };

  const clearFocus = (): void => {
    setSelectedNodeId(null);
    setHoveredMoon(null);
  };

  return (
    <div ref={containerRef} className="glass-panel relative h-[calc(100dvh-6rem)] min-h-[720px] overflow-hidden rounded-2xl border">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={onCanvasClick}
        onWheel={onWheel}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(68,138,255,0.08),transparent_58%)]" />

      <div className="absolute left-4 top-4 z-10">
        {selectedNodeId !== null ? (
          <button
            type="button"
            onClick={clearFocus}
            className="glass-button inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs text-[#e4ca87] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Map
          </button>
        ) : (
          <Link
            to="/"
            className="glass-button inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs text-[#e4ca87] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Codex
          </Link>
        )}
      </div>

      <div className="absolute left-1/2 top-4 z-10 w-[min(500px,88vw)] -translate-x-1/2">
        <div className="glass-panel rounded-full border px-3 py-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSearch('');
              }}
              placeholder="Search planets or subjects..."
              className="w-full bg-transparent text-sm text-gray-100 outline-none placeholder:text-gray-500"
            />
            <span className="font-mono text-xs text-[#e4ca87]">{resultsCount}</span>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-4 z-10">
        <button
          type="button"
          onClick={() => setHeatMapEnabled((current) => !current)}
          className={`rounded-full border px-3 py-2 text-xs transition ${
            heatMapEnabled
              ? 'border-[#c9a84c]/80 bg-[#c9a84c]/15 text-[#e4ca87]'
              : 'border-white/20 bg-black/70 text-gray-300 hover:border-white/35'
          }`}
        >
          Heat Map
        </button>
      </div>

      <div className="glass-panel absolute bottom-4 left-4 z-10 max-w-xs rounded-lg border px-4 py-3 text-xs">
        <div className="mb-2 font-mono uppercase tracking-[0.2em] text-[#e4ca87]">Map Stats</div>
        <div className="grid grid-cols-2 gap-2 text-gray-300">
          <span>Total Nodes</span>
          <span className="text-right">{MAP_DOMAIN_IDS.length}</span>
          <span>Total Connections</span>
          <span className="text-right">{CONNECTIONS.length}</span>
          <span>Most Connected</span>
          <span className="text-right">{mostConnectedDomain}</span>
          <span>Hovered</span>
          <span className="text-right">
            {hoveredNodeId ? masteryDomains.find((domain) => domain.id === hoveredNodeId)?.title ?? `D${hoveredNodeId}` : 'None'}
          </span>
        </div>
      </div>

      {heatMapEnabled && (
        <div className="glass-panel absolute bottom-4 right-4 z-10 rounded-lg border px-4 py-3 text-xs">
          <div className="mb-2 font-mono uppercase tracking-[0.2em] text-[#e4ca87]">Completion Heat</div>
          <div className="h-2 w-44 rounded-full bg-gradient-to-r from-[#1a3a6a] to-[#c9a84c]" />
          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {selectedNodeId !== null && (
        <div className="glass-panel absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border px-4 py-2 text-xs text-[#e4ca87]">
          <Flame className="mr-1 inline h-3.5 w-3.5" />
          Moons unfolding for {nodesRef.current.find((node) => node.id === selectedNodeId)?.name ?? `D${selectedNodeId}`}
        </div>
      )}
    </div>
  );
};

export default ConstellationMap;
