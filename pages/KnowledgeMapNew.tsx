import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Zap } from 'lucide-react';
import { domains } from '../data';

interface Node {
  id: number;
  name: string;
  type: string;
  color: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  fx: number;
  fy: number;
  radius: number;
  scale: number;
  targetScale: number;
  opacity: number;
  pulseOffset: number;
  pulseSpeed: number;
  subjects: number;
}

interface Moon {
  id: string;
  parentId: number;
  parentX: number;
  parentY: number;
  angle: number;
  orbitRadius: number;
  speed: number;
  radius: number;
  color: string;
  opacity: number;
}

interface Line {
  from: number;
  to: number;
  t: number;
  speed: number;
  opacity: number;
  targetOpacity: number;
}

const KnowledgeMapNew: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [heatMapMode, setHeatMapMode] = useState(false);
  const [stats, setStats] = useState({
    nodes: 10,
    connections: 0,
    mostConnected: '-',
    hovered: '-'
  });

  const nodesRef = useRef<Node[]>([]);
  const moonsRef = useRef<Moon[]>([]);
  const linesRef = useRef<Line[]>([]);
  const hoveredNodeRef = useRef<Node | null>(null);
  const expandedDomainRef = useRef<number | null>(null);
  
  const offsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  
  const timeRef = useRef(0);
  const introProgressRef = useRef(0);
  const isIntroCompleteRef = useRef(false);

  const masteryData: Record<number, number> = {
    1: 65, 2: 80, 3: 55, 4: 40, 5: 70,
    6: 45, 7: 60, 8: 50, 9: 75, 10: 85
  };

  const domainColors: Record<number, string> = {
    1: '#4488ff', 2: '#00ffcc', 3: '#aa44ff', 4: '#ff6644', 5: '#ffcc44',
    6: '#44ff88', 7: '#ff44aa', 8: '#88ff44', 9: '#ff8844', 10: '#44aaff'
  };

  const connections = [
    [1, 2], [1, 3], [1, 4], [1, 6],
    [2, 3], [2, 6], [2, 10],
    [3, 8], [3, 9], [3, 5],
    [4, 1], [4, 8],
    [5, 9], [5, 7], [5, 10],
    [6, 9], [6, 10],
    [7, 8], [7, 9],
    [8, 9], [8, 3]
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateCanvasSize();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Initialize nodes
    nodesRef.current = domains.slice(0, 10).map((domain, i) => {
      const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;
      
      return {
        id: domain.id,
        name: domain.title,
        type: 'domain',
        color: domainColors[domain.id],
        x: cx,
        y: cy,
        targetX: cx + Math.cos(angle) * radius,
        targetY: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        fx: 0,
        fy: 0,
        radius: 28,
        scale: 0,
        targetScale: 1,
        opacity: 1,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.8 + Math.random() * 0.4,
        subjects: 16
      };
    });

    // Initialize lines
    linesRef.current = connections.map(([from, to]) => ({
      from: from - 1,
      to: to - 1,
      t: Math.random(),
      speed: 0.004,
      opacity: 0.15,
      targetOpacity: 0.15
    }));

    // Pre-settle physics
    for (let i = 0; i < 50; i++) {
      updatePhysics(0.016, cx, cy);
    }

    nodesRef.current.forEach(node => {
      node.targetX = node.x;
      node.targetY = node.y;
    });

    let animationId: number;
    const animate = () => {
      timeRef.current++;
      
      if (!isIntroCompleteRef.current) {
        introProgressRef.current += 0.016 / 1.5;
        if (introProgressRef.current >= 1) {
          introProgressRef.current = 1;
          isIntroCompleteRef.current = true;
        }
        
        const t = easeOutElastic(introProgressRef.current);
        nodesRef.current.forEach(node => {
          node.x = cx + (node.targetX - cx) * t;
          node.y = cy + (node.targetY - cy) * t;
          node.scale = t;
        });
      } else {
        if (!expandedDomainRef.current) {
          updatePhysics(0.016, cx, cy);
        }
        
        nodesRef.current.forEach(node => {
          node.scale += (node.targetScale - node.scale) * 0.08;
        });
        
        linesRef.current.forEach(line => {
          line.opacity += (line.targetOpacity - line.opacity) * 0.08;
        });
      }

      render(ctx, canvas.width, canvas.height, cx, cy);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  const updatePhysics = (dt: number, cx: number, cy: number) => {
    const k = 8000;
    const attractionStrength = 0.002;
    const damping = 0.88;
    const centeringForce = 0.0003;

    nodesRef.current.forEach(node => {
      node.fx = 0;
      node.fy = 0;
    });

    for (let i = 0; i < nodesRef.current.length; i++) {
      for (let j = i + 1; j < nodesRef.current.length; j++) {
        const dx = nodesRef.current[j].x - nodesRef.current[i].x;
        const dy = nodesRef.current[j].y - nodesRef.current[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = k / (dist * dist);
        
        nodesRef.current[i].fx -= (dx / dist) * force;
        nodesRef.current[i].fy -= (dy / dist) * force;
        nodesRef.current[j].fx += (dx / dist) * force;
        nodesRef.current[j].fy += (dy / dist) * force;
      }
    }

    linesRef.current.forEach(line => {
      const n1 = nodesRef.current[line.from];
      const n2 = nodesRef.current[line.to];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = dist * attractionStrength;
      
      n1.fx += dx * force;
      n1.fy += dy * force;
      n2.fx -= dx * force;
      n2.fy -= dy * force;
    });

    nodesRef.current.forEach(node => {
      node.fx += (cx - node.x) * centeringForce;
      node.fy += (cy - node.y) * centeringForce;
    });

    nodesRef.current.forEach(node => {
      node.vx = (node.vx + node.fx * dt) * damping;
      node.vy = (node.vy + node.fy * dt) * damping;
      
      node.vx += (Math.random() - 0.5) * 0.04;
      node.vy += (Math.random() - 0.5) * 0.04;
      
      node.x += node.vx;
      node.y += node.vy;
    });
  };

  const render = (ctx: CanvasRenderingContext2D, width: number, height: number, cx: number, cy: number) => {
    ctx.clearRect(0, 0, width, height);
    
    ctx.save();
    ctx.translate(offsetRef.current.x, offsetRef.current.y);
    ctx.scale(scaleRef.current, scaleRef.current);

    // Draw lines
    linesRef.current.forEach(line => {
      const n1 = nodesRef.current[line.from];
      const n2 = nodesRef.current[line.to];
      
      if (!n1 || !n2) return;
      
      const opacity = line.opacity * n1.opacity * n2.opacity;
      
      ctx.strokeStyle = `rgba(201, 168, 76, ${opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();
      
      const dotX = n1.x + (n2.x - n1.x) * line.t;
      const dotY = n1.y + (n2.y - n1.y) * line.t;
      const dotSize = line.opacity > 0.5 ? 4 : 2;
      
      ctx.fillStyle = `rgba(201, 168, 76, ${Math.min(opacity * 2, 1)})`;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
      ctx.fill();
      
      line.t += line.speed;
      if (line.t > 1) line.t = 0;
    });

    // Draw nodes
    nodesRef.current.forEach(node => {
      if (node.opacity < 0.01) return;
      
      ctx.save();
      ctx.globalAlpha = node.opacity;
      
      const displayScale = node.scale * (hoveredNodeRef.current === node ? 1.4 : 1);
      const currentRadius = node.radius * displayScale;
      
      let nodeColor = node.color;
      if (heatMapMode) {
        const mastery = masteryData[node.id] || 0;
        nodeColor = interpolateColor('#1a3a6a', '#c9a84c', mastery / 100);
      }
      
      const pulseSize = 20 + Math.sin(timeRef.current * 0.001 * node.pulseSpeed + node.pulseOffset) * 12;
      ctx.shadowBlur = pulseSize;
      ctx.shadowColor = nodeColor;
      
      ctx.fillStyle = nodeColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = '#fff';
      ctx.font = '12px Cinzel';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(node.name, node.x, node.y + currentRadius + 8);
      
      ctx.restore();
    });
    
    ctx.restore();
  };

  const easeOutElastic = (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  };

  const interpolateColor = (color1: string, color2: string, t: number) => {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-20">
        <Link to="/" className="flex items-center text-neon-blue hover:text-neon-blue/80 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-mono text-sm">Back to Codex</span>
        </Link>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-dark-card/90 backdrop-blur-md border border-dark-border rounded-lg px-6 py-3">
          <h1 className="text-xl font-bold font-mono text-neon-blue">NEURAL CONSTELLATION</h1>
          <p className="text-xs text-gray-500 text-center">Interactive Knowledge System</p>
        </div>
      </div>

      {/* Search */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 w-96 max-w-[90vw]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domains..."
            className="w-full pl-10 pr-4 py-2 bg-dark-card/90 backdrop-blur-md border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue"
          />
        </div>
      </div>

      {/* Heat Map Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setHeatMapMode(!heatMapMode)}
          className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
            heatMapMode
              ? 'bg-neon-blue/20 border border-neon-blue text-neon-blue'
              : 'bg-dark-card/90 backdrop-blur-md border border-dark-border text-white hover:border-neon-blue/50'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-2" />
          Heat Map
        </button>
      </div>

      {/* Stats Panel */}
      <div className="absolute bottom-4 left-4 z-20 bg-dark-card/90 backdrop-blur-md border border-dark-border rounded-lg p-4 min-w-[200px]">
        <h3 className="text-sm font-bold font-mono text-neon-blue mb-3">NEURAL STATS</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Nodes:</span>
            <span className="text-neon-blue font-mono">{stats.nodes}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Connections:</span>
            <span className="text-neon-blue font-mono">{connections.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Most Connected:</span>
            <span className="text-neon-blue font-mono text-[10px]">Math</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};

export default KnowledgeMapNew;
