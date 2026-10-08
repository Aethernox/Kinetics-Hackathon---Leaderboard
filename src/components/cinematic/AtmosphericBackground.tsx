import React, { useEffect, useRef } from 'react';

interface AtmosphericBackgroundProps {
  accentColor?: 'red' | 'amber';
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({ accentColor = 'red' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Particle embers
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.7 + 0.3),
      alpha: Math.random() * 0.5 + 0.2,
      flickerSpeed: Math.random() * 0.03 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.flickerSpeed) * 0.01;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const clampedAlpha = Math.max(0.1, Math.min(0.7, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = accentColor === 'red'
          ? `rgba(239, 68, 68, ${clampedAlpha})`
          : `rgba(245, 158, 11, ${clampedAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = accentColor === 'red' ? '#ef4444' : '#f59e0b';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [accentColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#06070a]">
      {/* Deep atmospheric radial glow */}
      <div className="absolute inset-0 bg-radial-gradient from-[#991b1b]/12 via-[#06070a]/80 to-[#030406]" />

      {/* Cyber Technical Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #dc2626 1px, transparent 1px), linear-gradient(to bottom, #dc2626 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.85)_100%)]" />

      {/* CRT Scanline Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-25" />
    </div>
  );
};
