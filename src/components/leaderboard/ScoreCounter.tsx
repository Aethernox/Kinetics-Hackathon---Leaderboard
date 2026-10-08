import React, { useEffect, useState } from 'react';

interface ScoreCounterProps {
  score: number;
  className?: string;
  suffix?: string;
}

export const ScoreCounter: React.FC<ScoreCounterProps> = ({ score, className = '', suffix = 'pts' }) => {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    const startScore = displayScore;
    const endScore = score;
    if (startScore === endScore) return;

    const duration = 800;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startScore + (endScore - startScore) * ease);
      setDisplayScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className={`flex items-baseline gap-1.5 font-jetbrains tabular-nums ${className}`}>
      <span className="font-semibold tracking-tight text-[#fafafa]">
        {displayScore.toLocaleString()}
      </span>
      {suffix && (
        <span className="text-[10px] sm:text-xs font-normal text-[#a7a6a6] uppercase tracking-wider">
          {suffix}
        </span>
      )}
    </div>
  );
};

