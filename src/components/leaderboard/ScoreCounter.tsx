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

    const duration = 1000;
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
    <div className={`flex items-baseline gap-1 font-['Times_New_Roman',Times,serif] ${className}`}>
      <span className="font-bold tracking-tight">
        {displayScore.toLocaleString()}
      </span>
      {suffix && (
        <span className="text-xs font-semibold text-[#9ca3af] uppercase">
          {suffix}
        </span>
      )}
    </div>
  );
};
