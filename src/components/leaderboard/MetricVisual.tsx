import React from 'react';
import { MetricType } from '../../types/leaderboard';
import { toProperCase } from '../../utils/text';

interface MetricVisualProps {
  type?: MetricType;
  label?: string;
}

export const MetricVisual: React.FC<MetricVisualProps> = ({ label }) => {
  const formattedLabel = label ? toProperCase(label) : 'Autonomous SLAM Feed';

  return (
    <div className="flex items-center overflow-hidden font-sans">
      <span className="text-xs sm:text-sm text-[#a7a6a6] tracking-normal truncate">
        {formattedLabel}
      </span>
    </div>
  );
};

