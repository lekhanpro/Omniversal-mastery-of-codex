import React, { useEffect, useRef } from 'react';

interface BlobAnchor {
  angle: number;
  radiusOffset: number;
  freq: number;
  amp: number;
}

class Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  points: number;
  anchors: BlobAnchor[];
  colorSet: string[];
  alpha: number;
  timeOffset: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    this.baseSize = 150 + Math.random() * 200;
    this.points = 8;
    this.anchors = [];
    this.colorSet = this.getRandomColorSet();
    this.alpha = 0.12 + Math.random() * 0.13;
    this.timeOffset = Math.random() * 1000;

    for (let i = 0; i < this.points; i++) {
      this.anchors.push({
        angle: (i / this.points) * Math.PI * 2,
        radiusOffset: Math.random() * 0.3 + 0.7,
        freq: 0.0003 + Math.random() * 0.0005,
        amp: 20 + Math.random() * 30
      });
    }
  }

  getRandomColorSet(): string[] {
    const sets = [
      ['#0a0030', '#1a0050', '#000820'],
      ['#1a0800', '#300a00', '#1a0800'],
      ['#001a10', '#003020', '#001a10']
    ];
    return sets[Math.floor(Math.random() * sets.length)];
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -this.baseSize || this.x > width + this.baseSize) this.vx *= -1;
    if (this.y < -this.baseSize || this.y > height + this.baseSize) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const breathe = Math.sin(time * 0.0008 + this.timeOffset) * 0.15 + 1;
    ctx.scale(breathe, breathe);

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.baseSize);
    gradient.addColorStop(0, this.colorSet[0]);
    gradient.addColorStop(0.5, this.colorSet[1]);
    gradient.addColorStop(1, this.colorSet[2]);

    ctx.fillStyle = gradient;
    ctx.globalAlpha = this.alpha;

    ctx.beginPath();
    for (let i = 0; i <= this.points; i++) {
      const anchor = this.anchors[i % this.points];
      const morphOffset = Math.sin(time * anchor.freq + this.timeOffset) * anchor.amp;
      const radius = this.baseSize * anchor.radiusOffset + morphOffset;

      const x = Math.cos(anchor.angle) * radius;
      const y = Math.sin(anchor.angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        const prevAnchor = this.anchors[(i - 1) % this.points];
        const prevMorph = Math.sin(time * prevAnchor.freq + this.timeOffset) * prevAnchor.amp;
        const prevRadius = this.baseSize * prevAnchor.radiusOffset + prevMorph;
        const prevX = Math.cos(prevAnchor.angle) * prevRadius;
        const prevY = Math.sin(prevAnchor.angle) * prevRadius;

        const cp1x = prevX + Math.cos(prevAnchor.angle + Math.PI / 2) * 50;
        const cp1y = prevY + Math.sin(prevAnchor.angle + Math.PI / 2) * 50;
        const cp2x = x - Math.cos(anchor.angle + Math.PI / 2) * 50;
        const cp2y = y - Math.sin(anchor.angle + Math.PI / 2) * 50;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
      }
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

class Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  baseOpacity: number;
  twinkle: boolean;
  twinkleOffset: number;
  hasGlow: boolean;

  constructor(width: number, height: number, tier: 'tiny' | 'medium' | 'large') {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.twinkleOffset = Math.random() * 1000;

    if (tier === 'tiny') {
      this.radius = 0.4;
      this.opacity = 0.4;
      this.baseOpacity = 0.4;
      this.twinkle = false;
      this.hasGlow = false;
    } else if (tier === 'medium') {
      this.radius = 0.8;
      this.opacity = 0.7;
      this.baseOpacity = 0.7;
      this.twinkle = false;
      this.hasGlow = false;
    } else {
      this.radius = 1.4;
      this.baseOpacity = 1.0;
      this.opacity = 1.0;
      this.twinkle = true;
      this.hasGlow = Math.random() < 0.25;
    }
  }

  draw(ctx: CanvasRenderingContext2D, time: number) {
    ctx.save();

    if (this.twinkle) {
      this.opacity = this.baseOpacity * (0.5 + Math.sin(time * 0.002 + this.twinkleOffset) * 0.5);
    }

    if (this.hasGlow) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#c9a84c';
    }

    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class ShootingStar {
  active: boolean;
  nextTime: number;
  startTime: number;
  duration: number;
  x: number;
  y: number;
  angle: number;
  length: number;
  speed: number;

  constructor() {
    this.active = false;
    this.nextTime = 0;
    this.startTime = 0;
    this.duration = 800;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.length = 0;
    this.speed = 0;
  }

  reset(currentTime: number) {
    this.active = false;
    this.nextTime = currentTime + (4000 + Math.random() * 4000);
  }

  start(currentTime: number, width: number, height: number) {
    this.active = true;
    this.startTime = currentTime;
    this.duration = 800;
    this.x = Math.random() * width;
    this.y = Math.random() * height * 0.5;
    this.angle = Math.random() * Math.PI / 4 + Math.PI / 6;
    this.length = 100 + Math.random() * 100;
    this.speed = 3 + Math.random() * 2;
  }

  update(currentTime: number, width: number, height: number) {
    if (!this.active && currentTime >= this.nextTime) {
      this.start(currentTime, width, height);
    }

    if (this.active && currentTime - this.startTime >= this.duration) {
      this.reset(currentTime);
    }
  }

  draw(ctx: CanvasRenderingContext2D, currentTime: number) {
    if (!this.active) return;

    const elapsed = currentTime - this.startTime;
    const progress = elapsed / this.duration;

    const currentX = this.x + Math.cos(this.angle) * this.speed * elapsed;
    const currentY = this.y + Math.sin(this.angle) * this.speed * elapsed;

    const gradient = ctx.createLinearGradient(
      currentX, currentY,
      currentX - Math.cos(this.angle) * this.length,
      currentY - Math.sin(this.angle) * this.length
    );

    gradient.addColorStop(0, `rgba(255, 255, 255, ${1 - progress})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(
      currentX - Math.cos(this.angle) * this.length,
      currentY - Math.sin(this.angle) * this.length
    );
    ctx.stroke();
  }
}

const CosmicCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const blobs: Blob[] = Array.from({ length: 8 }, () => new Blob(width, height));
    const stars: Star[] = [
      ...Array.from({ length: 60 }, () => new Star(width, height, 'tiny')),
      ...Array.from({ length: 100 }, () => new Star(width, height, 'medium')),
      ...Array.from({ length: 40 }, () => new Star(width, height, 'large'))
    ];
    const shootingStars: ShootingStar[] = Array.from({ length: 3 }, () => new ShootingStar());

    let animationFrameId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      ctx.clearRect(0, 0, width, height);

      blobs.forEach(blob => {
        blob.update(width, height);
        blob.draw(ctx, currentTime);
      });

      stars.forEach(star => star.draw(ctx, currentTime));

      shootingStars.forEach(star => {
        star.update(currentTime, width, height);
        star.draw(ctx, currentTime);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    animate(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default CosmicCanvas;
