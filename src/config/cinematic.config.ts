export interface CinematicConfig {
  bootEnabled: boolean;
  title: string;
  subtitle: string;
  event: string;
  location: string;
  date: string;
  systemCode: string;
  organization: string;
  telemetrySource: string;
}

export const getCinematicConfig = (): CinematicConfig => {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {} as any;

  return {
    bootEnabled: env.VITE_CINEMATIC_BOOT_ENABLED !== 'false',
    title: env.VITE_CINEMATIC_TITLE || 'KINETICS HACKATHON',
    subtitle: env.VITE_CINEMATIC_SUBTITLE || 'AUTONOMOUS ROBOTICS CHALLENGE',
    event: env.VITE_CINEMATIC_EVENT || 'NATIONAL ROBOTICS EVALUATION 2026',
    location: env.VITE_CINEMATIC_LOCATION || 'NATIONAL INSTITUTE OF TECHNOLOGY DELHI',
    date: env.VITE_CINEMATIC_DATE || 'OCTOBER 2026 • LIVE TELEMETRY',
    systemCode: env.VITE_CINEMATIC_SYSTEM_CODE || 'SYS / CLEARANCE ACCESS V1.07-D',
    organization: env.VITE_CINEMATIC_ORGANIZATION || 'KINETIC ROBOTICS CLUB',
    telemetrySource: env.VITE_CINEMATIC_TELEMETRY_SOURCE || 'REAL-TIME AUTONOMOUS SLAM & AI EVALUATION',
  };
};
