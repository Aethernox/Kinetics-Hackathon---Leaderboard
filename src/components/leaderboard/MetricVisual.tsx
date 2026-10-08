import React from 'react';
import { MetricType } from '../../types/leaderboard';
import { toProperCase } from '../../utils/text';

interface MetricVisualProps {
  type?: MetricType;
  label?: string;
}

export const MetricVisual: React.FC<MetricVisualProps> = ({ label }) => {
  const formattedLabel = label ? toProperCase(label) : 'Telemetry Data Feed';

  return (
    <div className="flex items-center overflow-hidden font-['Times_New_Roman',Times,serif]">
      <span className="text-xs sm:text-sm text-[#d1d5db] tracking-wide truncate">
        {formattedLabel}
      </span>
    </div>
  );
};
