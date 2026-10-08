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
      className={`relative flex items-center justify-end overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Ambient Warm Golden / Amber Horizon Glow */}
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-72 h-44 bg-[#f59e0b]/[0.14] blur-3xl pointer-events-none" />
      <div className="absolute right-12 bottom-2 w-48 h-28 bg-[#ea580c]/[0.10] blur-2xl pointer-events-none" />

      {/* 2. Cyber Telemetry HUD Tag Overlay */}
      <div className="absolute top-3 right-4 z-20 flex items-center gap-2 px-2.5 py-1 rounded-md border border-[#f59e0b]/30 bg-[#0a0a0c]/85 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_6px_#f59e0b]" />
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#fde68a] uppercase">
          ARM.KINEMATICS // 6-DOF
        </span>
      </div>

      {/* 3. High-Definition Robotic Arm Visual */}
      {!imageFailed ? (
        <div className="relative z-10 w-full h-full flex items-center justify-end">
          <img
            src="/robotic_arm.png"
            alt="KINETICS 6-DOF High-Precision Robotic Arm"
            className="w-auto h-full max-h-[160px] sm:max-h-[180px] lg:max-h-[210px] object-contain object-right drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] transition-all duration-700"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 8%, rgba(0,0,0,1) 25%, rgba(0,0,0,1) 100%)',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src.endsWith('/robotic_arm.png')) {
                target.src = './robotic_arm.png';
              } else if (target.src.endsWith('./robotic_arm.png')) {
                target.src = 'robotic_arm.png';
              } else {
                setImageFailed(true);
              }
            }}
            loading="lazy"
          />
        </div>
      ) : (
        /* Cyber Fallback Schematic if Asset URL is unavailable */
        <div className="relative z-10 w-64 h-32 rounded-xl border border-white/10 bg-white/[0.02] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#71717a]">
            <span>ARM.ACTUATOR // V4</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 flex-1 bg-[#f59e0b]/40 rounded-full" />
            <div className="h-1 flex-1 bg-[#f59e0b]/70 rounded-full" />
            <div className="h-1 flex-1 bg-[#f59e0b] rounded-full shadow-[0_0_8px_#f59e0b]" />
          </div>
          <div className="text-[9px] font-mono text-[#a1a1aa] tracking-widest uppercase">
            6-AXIS HIGH TORQUE SERVO ARRAY
          </div>
        </div>
      )}
    </div>
  );
};
