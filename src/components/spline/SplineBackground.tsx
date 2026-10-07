import React, { useEffect, useRef, useState } from 'react';

interface SplineBackgroundProps {
  isSplineEnabled?: boolean;
}

export const SplineBackground: React.FC<SplineBackgroundProps> = ({ isSplineEnabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles: Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        a: Math.random() * 0.4 + 0.1,
      });
    }

    let t = 0;
    const render = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.4, 100, w * 0.5, h * 0.5, Math.max(w, h));
      bgGrad.addColorStop(0, '#0d0f14');
      bgGrad.addColorStop(0.6, '#07080b');
      bgGrad.addColorStop(1, '#030406');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Light beam 1
      const g1 = ctx.createLinearGradient(w * 0.4, 0, w, h);
      g1.addColorStop(0, 'rgba(217, 119, 6, 0)');
      g1.addColorStop(0.35, 'rgba(245, 158, 11, 0.09)');
      g1.addColorStop(0.65, 'rgba(234, 88, 12, 0.19)');
      g1.addColorStop(1, 'rgba(180, 83, 9, 0)');

      ctx.fillStyle = g1;
      ctx.beginPath();
      const o1 = Math.sin(t) * 30;
      ctx.moveTo(w * 0.65 + o1, 0);
      ctx.lineTo(w * 0.95 + o1, 0);
      ctx.lineTo(w * 0.45 + o1, h);
      ctx.lineTo(w * 0.15 + o1, h);
      ctx.closePath();
      ctx.fill();

      // Light beam 2
      const g2 = ctx.createLinearGradient(w * 0.7, 0, w * 1.1, h);
      g2.addColorStop(0, 'rgba(251, 191, 36, 0)');
      g2.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
      g2.addColorStop(1, 'rgba(217, 119, 6, 0)');

      ctx.fillStyle = g2;
      ctx.beginPath();
      const o2 = Math.cos(t * 0.8) * 20;
      ctx.moveTo(w * 0.85 + o2, 0);
      ctx.lineTo(w * 1.1 + o2, 0);
      ctx.lineTo(w * 0.75 + o2, h);
      ctx.lineTo(w * 0.5 + o2, h);
      ctx.closePath();
      ctx.fill();

      // Grid horizon
      const gridY = h * 0.75;
      for (let y = gridY; y < h; y += (h - gridY) / 10) {
        const factor = (y - gridY) / (h - gridY);
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.02 + factor * 0.08})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      const vpX = w * 0.5;
      const vpY = h * 0.55;
      for (let x = -w * 0.5; x <= w * 1.5; x += 90) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
        ctx.beginPath();
        ctx.moveTo(vpX, vpY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.fillStyle = `rgba(245, 158, 11, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {isSplineEnabled && (
        <div className="absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-700 pointer-events-none" />
      )}
    </div>
  );
};
