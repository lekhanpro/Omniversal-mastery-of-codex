import React, { useEffect, useRef, useState } from 'react';
import { domains } from '../data';
import { domainConnections } from '../quotes-data';
import { useNavigate } from 'react-router-dom';

interface NodePosition {
  x: number;
  y: number;
  domain: typeof domains[0];
  id: number;
}

const ConstellationMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawConstellation();
    };

    const getCheckedCount = (domainId: number) => {
      const domain = domains.find(d => d.id === domainId);
      if (!domain) return 0;

      let count = 0;
      domain.subdomains.forEach((subdomain, idx) => {
        subdomain.points.forEach((_, pointIdx) => {
          const key = `codex_d${domainId}_s${idx}_p${pointIdx}`;
          if (localStorage.getItem(key) === 'true') count++;
        });
      });
      return count;
    };

    const getTotalPoints = (domainId: number) => {
      const domain = domains.find(d => d.id === domainId);
      if (!domain) return 1;
      return domain.subdomains.reduce((sum, sub) => sum + sub.points.length, 0);
    };

    const drawConstellation = () => {
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;
      const radius = Math.min(w, h) * 0.35;

      ctx.clearRect(0, 0, w, h);

      const positions: NodePosition[] = domains.slice(0, 10).map((domain, i) => {
        const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
        return {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          domain: domain,
          id: domain.id
        };
      });

      setNodePositions(positions);

      // Draw connections
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.3)';
      ctx.lineWidth = 1;

      domainConnections.forEach(({ from, to }) => {
        const node1 = positions.find(n => n.id === from);
        const node2 = positions.find(n => n.id === to);

        if (node1 && node2) {
          ctx.beginPath();
          ctx.moveTo(node1.x, node1.y);
          ctx.lineTo(node2.x, node2.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      positions.forEach(node => {
        const isHovered = hoveredNode === node.id;
        const checkedCount = getCheckedCount(node.id);
        const totalCount = getTotalPoints(node.id);

        ctx.save();

        if (isHovered) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#c9a84c';
        }

        // Outer circle
        ctx.fillStyle = isHovered ? 'rgba(201, 168, 76, 0.4)' : 'rgba(201, 168, 76, 0.2)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle (progress)
        const progressAngle = (checkedCount / totalCount) * Math.PI * 2;
        ctx.fillStyle = '#c9a84c';
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.arc(node.x, node.y, 15, -Math.PI / 2, -Math.PI / 2 + progressAngle);
        ctx.closePath();
        ctx.fill();

        // Center dot
        ctx.fillStyle = isHovered ? '#ffffff' : '#c9a84c';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Tooltip
        if (isHovered) {
          ctx.fillStyle = 'rgba(10, 10, 26, 0.95)';
          ctx.strokeStyle = '#c9a84c';
          ctx.lineWidth = 1;

          const tooltipText = node.domain.title;
          const subText = `${totalCount} topics`;
          ctx.font = '14px sans-serif';
          const textWidth = Math.max(ctx.measureText(tooltipText).width, ctx.measureText(subText).width);

          const tooltipX = node.x - textWidth / 2 - 10;
          const tooltipY = node.y - 60;

          ctx.fillRect(tooltipX, tooltipY, textWidth + 20, 45);
          ctx.strokeRect(tooltipX, tooltipY, textWidth + 20, 45);

          ctx.fillStyle = '#c9a84c';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(tooltipText, tooltipX + 10, tooltipY + 20);

          ctx.fillStyle = '#a0a0b8';
          ctx.font = '12px sans-serif';
          ctx.fillText(subText, tooltipX + 10, tooltipY + 37);
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundNode: number | null = null;
      nodePositions.forEach(node => {
        const dist = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
        if (dist < 25) foundNode = node.id;
      });

      if (foundNode !== hoveredNode) {
        setHoveredNode(foundNode);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      nodePositions.forEach(node => {
        const dist = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
        if (dist < 25 && !node.domain.isLocked) {
          navigate(`/domain/${node.id}`);
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [hoveredNode, nodePositions, navigate]);

  return (
    <div ref={containerRef} className="w-full h-[600px] bg-dark-card/50 rounded-xl border border-dark-border overflow-hidden">
      <canvas ref={canvasRef} className="cursor-pointer" />
    </div>
  );
};

export default ConstellationMap;
