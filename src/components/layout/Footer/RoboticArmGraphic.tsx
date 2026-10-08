import React, { useState } from 'react';

interface RoboticArmGraphicProps {
  className?: string;
}

export const RoboticArmGraphic: React.FC<RoboticArmGraphicProps> = ({
  className = '',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={`pointer-events-none select-none relative flex items-center justify-end overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Ambient Warm Golden Rim Glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-48 bg-[#f59e0b]/[0.08] blur-3xl pointer-events-none" />

      {/* Cinematic 3D Robotic Arm Render with Soft Left-Gradient Mask & Screen Blending */}
      {!imageFailed ? (
        <img
          src="robotic_arm.png"
          alt="KINETIC 3D Autonomous Robotic Arm"
          className="w-full h-full max-h-[220px] lg:max-h-[240px] object-cover object-right mix-blend-screen opacity-95 transition-opacity duration-500"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 12%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 12%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 100%)',
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.endsWith('./robotic_arm.png') && !target.src.endsWith('/robotic_arm.png')) {
              target.src = './robotic_arm.png';
            } else {
              setImageFailed(true);
            }
          }}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-end pr-4">
          <div className="w-48 h-36 rounded-2xl bg-gradient-to-l from-[#f59e0b]/10 to-transparent border-r border-[#f59e0b]/30" />
        </div>
      )}
    </div>
  );
};
