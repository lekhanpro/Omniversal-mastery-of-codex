import React, { useEffect, useRef } from 'react';

interface AnchorPoint {
  angle: number;
  freq: number;
  amp: number;
  phase: number;
}

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  anchors: AnchorPoint[];
  hue: number;
  alpha: number;
  foreground: boolean;
  offset: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleOffset: number;
  twinkleSpeed: number;
  large: boolean;
  goldGlow: boolean;
}

interface ShootingStar {
  active: boolean;
  nextStartAt: number;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  progress: number;
  speed: number;
}

interface Point {
  x: number;
  y: number;
}

const BLOB_COUNT = 6;
const MAX_REPEL_DISTANCE = 300;
const SHOOTING_STAR_POOL = 3;
const SHOOTING_STAR_TRAVEL = 400;

const randomInRange = (min: number, max: number): number => min + Math.random() * (max - min);

const createAnchors = (): AnchorPoint[] =>
  Array.from({ length: 8 }, (_, index) => ({
    angle: (Math.PI * 2 * index) / 8,
    freq: randomInRange(0.0003, 0.0009),
    amp: randomInRange(20, 60),
    phase: Math.random() * Math.PI * 2,
  }));

const createBlob = (width: number, height: number, foreground: boolean): Blob => ({
  x: randomInRange(0, width),
  y: randomInRange(0, height),
  vx: randomInRange(-0.08, 0.08),
  vy: randomInRange(-0.08, 0.08),
  baseRadius: randomInRange(120, 220),
  anchors: createAnchors(),
  hue: randomInRange(200, 260),
  alpha: foreground ? 0.18 : randomInRange(0.08, 0.14),
  foreground,
  offset: Math.random() * 1000,
});

const createStars = (width: number, height: number): Star[] => {
  const stars: Star[] = [
    ...Array.from({ length: 150 }, () => ({
      x: randomInRange(0, width),
      y: randomInRange(0, height),
      radius: randomInRange(0.3, 0.8),
      baseOpacity: randomInRange(0.25, 0.55),
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: randomInRange(0.8, 1.8),
      large: false,
      goldGlow: false,
    })),
    ...Array.from({ length: 50 }, () => ({
      x: randomInRange(0, width),
      y: randomInRange(0, height),
      radius: randomInRange(0.9, 1.4),
      baseOpacity: randomInRange(0.45, 0.8),
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: randomInRange(1.2, 2.3),
      large: false,
      goldGlow: false,
    })),
    ...Array.from({ length: 32 }, () => ({
      x: randomInRange(0, width),
      y: randomInRange(0, height),
      radius: randomInRange(1.5, 2.5),
      baseOpacity: randomInRange(0.55, 1),
      twinkleOffset: Math.random() * Math.PI * 2,
      twinkleSpeed: randomInRange(1.4, 2.8),
      large: true,
      goldGlow: false,
    })),
  ];

  const largeStars = stars.filter((star) => star.large);
  for (let index = 0; index < Math.min(10, largeStars.length); index += 1) {
    largeStars[index].goldGlow = true;
  }

  return stars;
};

const createShootingStars = (): ShootingStar[] =>
  Array.from({ length: SHOOTING_STAR_POOL }, () => ({
    active: false,
    nextStartAt: randomInRange(4000, 8000),
    x: 0,
    y: 0,
    dirX: 0,
    dirY: 0,
    progress: 0,
    speed: randomInRange(0.25, 0.45),
  }));

const drawSmoothClosedCurve = (ctx: CanvasRenderingContext2D, points: Point[]): void => {
  if (points.length < 3) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let index = 0; index < points.length; index += 1) {
    const p0 = points[(index - 1 + points.length) % points.length];
    const p1 = points[index];
    const p2 = points[(index + 1) % points.length];
    const p3 = points[(index + 2) % points.length];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  ctx.closePath();
};

const CosmicCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.style.willChange = 'transform';

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = (): void => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const blobs: Blob[] = Array.from({ length: BLOB_COUNT }, (_, index) => createBlob(width, height, index === 0));
    const stars = createStars(width, height);
    const shootingStars = createShootingStars();

    let raf = 0;
    let lastFrame = 0;
    let elapsed = 0;

    const updateBlobRepulsion = (): void => {
      for (let index = 0; index < blobs.length; index += 1) {
        for (let other = index + 1; other < blobs.length; other += 1) {
          const blobA = blobs[index];
          const blobB = blobs[other];
          const dx = blobB.x - blobA.x;
          const dy = blobB.y - blobA.y;
          const distance = Math.hypot(dx, dy);
          if (distance <= 0 || distance > MAX_REPEL_DISTANCE) continue;

          const pushStrength = ((MAX_REPEL_DISTANCE - distance) / MAX_REPEL_DISTANCE) * 0.02;
          const nx = dx / distance;
          const ny = dy / distance;

          blobA.vx -= nx * pushStrength;
          blobA.vy -= ny * pushStrength;
          blobB.vx += nx * pushStrength;
          blobB.vy += ny * pushStrength;
        }
      }
    };

    const updateBlobs = (deltaTime: number): void => {
      updateBlobRepulsion();
      blobs.forEach((blob) => {
        const speed = blob.foreground ? 1.8 : 1;
        blob.x += blob.vx * deltaTime * speed;
        blob.y += blob.vy * deltaTime * speed;
        blob.vx *= 0.998;
        blob.vy *= 0.998;

        const boundary = blob.baseRadius * 1.1;
        if (blob.x < -boundary || blob.x > width + boundary) blob.vx *= -1;
        if (blob.y < -boundary || blob.y > height + boundary) blob.vy *= -1;
      });
    };

    const drawBlobs = (time: number): void => {
      blobs.forEach((blob) => {
        const breathe = 1 + Math.sin(time * 0.0007 + blob.offset) * 0.13;
        const points = blob.anchors.map((anchor) => {
          const morph = Math.sin(time * anchor.freq + anchor.phase + blob.offset) * anchor.amp;
          const radius = (blob.baseRadius + morph) * breathe;
          return {
            x: blob.x + Math.cos(anchor.angle) * radius,
            y: blob.y + Math.sin(anchor.angle) * radius,
          };
        });

        const gradient = context.createRadialGradient(blob.x, blob.y, blob.baseRadius * 0.15, blob.x, blob.y, blob.baseRadius * 1.2);
        gradient.addColorStop(0, `hsla(${blob.hue}, 88%, 68%, ${blob.alpha})`);
        gradient.addColorStop(0.5, `hsla(${blob.hue + 20}, 80%, 52%, ${blob.alpha * 0.8})`);
        gradient.addColorStop(1, `hsla(${blob.hue + 40}, 75%, 30%, 0)`);

        context.fillStyle = gradient;
        drawSmoothClosedCurve(context, points);
        context.fill();
      });
    };

    const drawStars = (time: number): void => {
      stars.forEach((star) => {
        const twinkle = star.large
          ? 0.55 + Math.sin(time * 0.0016 * star.twinkleSpeed + star.twinkleOffset) * 0.45
          : 0.8 + Math.sin(time * 0.0009 * star.twinkleSpeed + star.twinkleOffset) * 0.2;

        context.save();
        context.globalAlpha = Math.max(0.05, star.baseOpacity * twinkle);
        if (star.goldGlow) {
          context.shadowBlur = 8;
          context.shadowColor = '#c9a84c';
        }
        context.fillStyle = star.goldGlow ? '#f2dd9d' : '#eef3ff';
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });
    };

    const activateShootingStar = (star: ShootingStar): void => {
      star.active = true;
      star.progress = 0;
      star.x = randomInRange(-80, width * 0.7);
      star.y = randomInRange(-40, height * 0.45);
      const angle = randomInRange(0.2, 0.52);
      star.dirX = Math.cos(angle);
      star.dirY = Math.sin(angle);
      star.speed = randomInRange(0.26, 0.44);
    };

    const updateAndDrawShootingStars = (deltaTime: number): void => {
      shootingStars.forEach((star) => {
        if (!star.active && elapsed >= star.nextStartAt) {
          activateShootingStar(star);
        }
        if (!star.active) return;

        star.progress += star.speed * deltaTime;

        const headX = star.x + star.dirX * star.progress;
        const headY = star.y + star.dirY * star.progress;
        const tailLength = 120;
        const tailX = headX - star.dirX * tailLength;
        const tailY = headY - star.dirY * tailLength;

        const gradient = context.createLinearGradient(headX, headY, tailX, tailY);
        gradient.addColorStop(0, 'rgba(244, 231, 194, 0.95)');
        gradient.addColorStop(0.5, 'rgba(201, 168, 76, 0.55)');
        gradient.addColorStop(1, 'rgba(201, 168, 76, 0)');

        context.save();
        context.strokeStyle = gradient;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(headX, headY);
        context.lineTo(tailX, tailY);
        context.stroke();
        context.restore();

        if (star.progress >= SHOOTING_STAR_TRAVEL) {
          star.active = false;
          star.nextStartAt = elapsed + randomInRange(4000, 8000);
        }
      });
    };

    const animate = (time: number): void => {
      if (time - lastFrame < 1000 / 60) {
        raf = window.requestAnimationFrame(animate);
        return;
      }

      const deltaTime = lastFrame === 0 ? 16.67 : time - lastFrame;
      lastFrame = time;
      elapsed += deltaTime;

      context.clearRect(0, 0, width, height);
      updateBlobs(deltaTime);
      drawBlobs(time);
      drawStars(time);
      updateAndDrawShootingStars(deltaTime);

      raf = window.requestAnimationFrame(animate);
    };

    raf = window.requestAnimationFrame(animate);
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
};

export default CosmicCanvas;
