import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { domains } from '../data';
import { useTheme } from '../contexts/ThemeContext';

const KnowledgeMapNew: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [hoveredDomain, setHoveredDomain] = useState<number | null>(null);

  const domainIcons: Record<number, string> = {
    1: '⚔️', 2: '🧠', 3: '💻', 4: '🤖', 5: '⚛️',
    6: '💰', 7: '🏛️', 8: '🎤', 9: '🔒', 10: '🔮',
    11: '🌍', 12: '📚', 13: '🎨', 14: '⚖️', 15: '🖥️',
    16: '🧠', 17: '🌱', 18: '🌌', 19: '🧘', 20: '🗿'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      render(ctx, canvas.width, canvas.height);
    };
    updateSize();

    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [isDark, hoveredDomain]);

  const render = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.fillStyle = isDark ? '#050505' : '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Draw connection lines
    ctx.strokeStyle = isDark ? 'rgba(201, 168, 76, 0.15)' : 'rgba(100, 116, 139, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const angle1 = ((i / 20) * Math.PI * 2) - Math.PI / 2;
      const x1 = centerX + Math.cos(angle1) * radius;
      const y1 = centerY + Math.sin(angle1) * radius;
      
      // Connect to next 2 domains
      for (let j = 1; j <= 2; j++) {
        const angle2 = (((i + j) / 20) * Math.PI * 2) - Math.PI / 2;
        const x2 = centerX + Math.cos(angle2) * radius;
        const y2 = centerY + Math.sin(angle2) * radius;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(0, 243, 255, 0.1)' : 'rgba(0, 102, 204, 0.05)';
    ctx.fill();
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OMNIVERSAL', centerX, centerY - 8);
    ctx.fillText('CODEX', centerX, centerY + 8);

    // Draw domain nodes
    domains.forEach((domain, index) => {
      const angle = ((index / 20) * Math.PI * 2) - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      const isHovered = hoveredDomain === domain.id;
      const nodeRadius = isHovered ? 45 : 35;

      // Glow effect for hovered
      if (isHovered) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeRadius + 15);
        gradient.addColorStop(0, '#00f3ff40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(x - nodeRadius - 15, y - nodeRadius - 15, (nodeRadius + 15) * 2, (nodeRadius + 15) * 2);
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(10, 10, 10, 0.9)' : 'rgba(255, 255, 255, 0.95)';
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#00f3ff' : (isDark ? '#333' : '#cbd5e1');
      ctx.lineWidth = isHovered ? 3 : 2;
      ctx.stroke();

      // Icon
      ctx.font = `${isHovered ? 28 : 24}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(domainIcons[domain.id] || '📖', x, y);

      // Domain name
      ctx.font = `${isHovered ? 'bold 11px' : '10px'} Arial`;
      ctx.fillStyle = isHovered ? '#00f3ff' : (isDark ? '#999' : '#475569');
      const name = domain.title.length > 15 ? domain.title.substring(0, 13) + '...' : domain.title;
      ctx.fillText(name, x, y + nodeRadius + 15);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    domains.forEach((domain, index) => {
      const angle = ((index / 20) * Math.PI * 2) - Math.PI / 2;
      const nodeX = centerX + Math.cos(angle) * radius;
      const nodeY = centerY + Math.sin(angle) * radius;

      const dist = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      if (dist < 35) {
        navigate(`/domain/${domain.id}`);
      }
    });
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.35;

    let found: number | null = null;
    domains.forEach((domain, index) => {
      const angle = ((index / 20) * Math.PI * 2) - Math.PI / 2;
      const nodeX = centerX + Math.cos(angle) * radius;
      const nodeY = centerY + Math.sin(angle) * radius;

      const dist = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
      if (dist < 35) {
        found = domain.id;
      }
    });

    setHoveredDomain(found);
  };

  return (
    <div className="relative w-full h-screen bg-slate-50 dark:bg-dark-bg overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Link to="/" className="flex items-center text-neon-blue hover:text-neon-blue/80 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-mono text-sm">Back to Codex</span>
        </Link>
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border border-slate-200 dark:border-dark-border rounded-lg px-6 py-3 shadow-sm">
          <h1 className="text-xl font-bold font-mono text-neon-blue">KNOWLEDGE MAP</h1>
          <p className="text-xs text-slate-500 dark:text-gray-500 text-center">Circular Constellation of 20 Domains</p>
        </div>
      </div>

      {hoveredDomain && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border border-slate-200 dark:border-dark-border rounded-lg px-6 py-3 shadow-sm max-w-md">
          <h3 className="font-bold text-neon-blue mb-1">{domains.find(d => d.id === hoveredDomain)?.title}</h3>
          <p className="text-xs text-slate-600 dark:text-gray-400">{domains.find(d => d.id === hoveredDomain)?.shortDescription}</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onMouseLeave={() => setHoveredDomain(null)}
      />
    </div>
  );
};

export default KnowledgeMapNew;
