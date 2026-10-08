import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../../services/audioEffects';
import { getCinematicConfig } from '../../config/cinematic.config';

interface TerminalBootProps {
  onComplete: (withSound: boolean) => void;
}

export const TerminalBoot: React.FC<TerminalBootProps> = ({ onComplete }) => {
  const config = getCinematicConfig();

  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fullLines = useRef([
    `[ SYSTEM INITIALIZATION // ${config.title.toUpperCase()} ]`,
    `AUTHOR: ${config.organization.toUpperCase()} • ${config.location.toUpperCase()}`,
    `TELEMETRY FEED: ${config.telemetrySource.toUpperCase()}`,
    `SECURITY PROTOCOL: COMPETITION SENSORS & REAL-TIME SLAM ACTIVE.`,
    `DATA STREAM SYNCHRONIZED. SYSTEM INTEGRITY VERIFIED.`
  ]);

  useEffect(() => {
    let currentLineIdx = 0;
    let charIdx = 0;
    let timeoutId: any;

    const typeNextChar = () => {
      if (currentLineIdx >= fullLines.current.length) {
        // Typing lines finished -> start segmented progress loading
        startProgress();
        return;
      }

      const line = fullLines.current[currentLineIdx];
      if (charIdx < line.length) {
        setCurrentLineText(line.slice(0, charIdx + 1));
        charIdx++;

        // Deterministic organic typing cadence (14ms - 26ms)
        const delay = Math.floor(Math.random() * 12) + 14;
        timeoutId = setTimeout(typeNextChar, delay);
      } else {
        // Line complete
        setTypedLines(prev => [...prev, line]);
        setCurrentLineText('');
        currentLineIdx++;
        charIdx = 0;
        timeoutId = setTimeout(typeNextChar, 140);
      }
    };

    const startProgress = () => {
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 10) + 6;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(progressInterval);
          setProgress(100);
          setTimeout(() => {
            setIsTypingComplete(true);
          }, 200);
        } else {
          setProgress(currentProgress);
        }
      }, 45);
    };

    timeoutId = setTimeout(typeNextChar, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSelectAudio = (withSound: boolean) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (withSound) {
      soundFx.setPreference(true);
      soundFx.unlockAudio();
      soundFx.playAccessGranted();
      setTimeout(() => {
        soundFx.playCinematicDrop();
        soundFx.startAmbientHum();
      }, 250);
    } else {
      soundFx.setPreference(false);
    }

    // Cinematic fade and transition
    setTimeout(() => {
      onComplete(withSound);
    }, 750);
  };

  // 36 segments for loading progress bar
  const totalSegments = 36;
  const filledSegments = Math.round((progress / 100) * totalSegments);

  return (
    <div
      role="dialog"
      aria-label="System Boot Terminal"
      className={`fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 transition-all duration-700 select-none overflow-hidden font-vt323 terminal-font ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Subtle Cyber Glow Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#f59e0b]/[0.08] via-[#38bdf8]/[0.04] to-transparent blur-3xl pointer-events-none" />

      {/* Main Terminal Frame */}
      <div className="relative w-full max-w-2xl bg-[#090b10]/95 border border-[#f59e0b]/40 rounded-xl p-5 sm:p-7 shadow-[0_0_60px_rgba(245,158,11,0.2)] backdrop-blur-2xl transition-all duration-300">
        
        {/* Top Header Corner Brackets & System Code */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5 text-sm sm:text-base tracking-[0.18em] text-[#94a3b8]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-pulse shadow-[0_0_8px_#f59e0b]" />
            <span className="text-[#fde68a] font-bold uppercase">{config.systemCode}</span>
          </div>

          {/* Cyber Hatch Status Pattern */}
          <div className="flex items-center gap-1 opacity-80">
            <span className="h-3 w-1 bg-[#f59e0b] rounded-xs shadow-[0_0_4px_#f59e0b]" />
            <span className="h-3 w-1 bg-[#f59e0b] rounded-xs shadow-[0_0_4px_#f59e0b]" />
            <span className="h-3 w-1 bg-[#f59e0b] rounded-xs shadow-[0_0_4px_#f59e0b]" />
            <span className="h-3 w-1 bg-[#f59e0b] rounded-xs shadow-[0_0_4px_#f59e0b]" />
          </div>
        </div>

        {/* Terminal Content Output Area */}
        <div className="space-y-2.5 min-h-[160px] text-base sm:text-lg text-[#e2e8f0] font-vt323 leading-relaxed tracking-wider">
          {typedLines.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="text-[#f59e0b] font-bold select-none text-lg">&gt;</span>
              <span className={idx === 0 ? 'text-[#fbbf24] font-bold drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'text-[#e2e8f0]'}>
                {line}
              </span>
            </div>
          ))}

          {/* Active Typing Line with Blinking Cursor */}
          {currentLineText && (
            <div className="flex items-start gap-2.5">
              <span className="text-[#f59e0b] font-bold select-none text-lg">&gt;</span>
              <span className="text-[#e2e8f0]">{currentLineText}</span>
              <span className="inline-block w-2.5 h-5 bg-[#f59e0b] animate-pulse ml-0.5 align-middle shadow-[0_0_6px_#f59e0b]" />
            </div>
          )}

          {!currentLineText && !isTypingComplete && typedLines.length > 0 && (
            <div className="flex items-start gap-2.5">
              <span className="text-[#f59e0b] font-bold select-none text-lg">&gt;</span>
              <span className="inline-block w-2.5 h-5 bg-[#f59e0b] animate-pulse shadow-[0_0_6px_#f59e0b]" />
            </div>
          )}
        </div>

        {/* Segmented Progress Loading Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-[#94a3b8] mb-2 font-vt323 tracking-wider">
            <span className={progress === 100 ? 'text-emerald-400 font-bold flex items-center gap-1.5' : 'text-[#fde68a] font-bold'}>
              {progress === 100 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              {progress < 100 ? 'INITIALIZING TELEMETRY PIPELINE' : 'CLEARANCE VERIFIED'}
            </span>
            <span className="font-bold text-white tabular-nums text-base">{progress}%</span>
          </div>

          <div className="flex gap-1 h-3.5 bg-[#05070a] p-0.5 border border-white/10 rounded-md">
            {Array.from({ length: totalSegments }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-xs transition-all duration-75 ${
                  idx < filledSegments
                    ? progress === 100
                      ? 'bg-gradient-to-t from-[#059669] to-[#34d399] shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                      : 'bg-gradient-to-t from-[#d97706] via-[#f59e0b] to-[#fbbf24] shadow-[0_0_6px_rgba(245,158,11,0.8)]'
                    : 'bg-[#111622]/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Audio Output Selection Action Screen */}
        <div
          className={`mt-7 pt-4 border-t border-white/10 transition-all duration-500 flex flex-col items-center text-center ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <p className="text-sm sm:text-base font-bold tracking-[0.2em] text-[#fde68a] uppercase mb-4 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
            [ CLEARANCE COMPLETE • SELECT AUDIO PROTOCOL ]
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md">
            {/* Enter with Sound (Primary Golden Amber Glow Button) */}
            <button
              id="btn-enter-with-sound"
              onClick={() => handleSelectAudio(true)}
              className="group relative w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#d97706] hover:brightness-110 text-black font-bold text-base sm:text-lg tracking-[0.16em] uppercase rounded-lg transition-all duration-200 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-black flex-shrink-0" />
              <span>ENTER WITH SOUND</span>
            </button>

            {/* Enter without Sound (Muted Outlined Button) */}
            <button
              id="btn-enter-without-sound"
              onClick={() => handleSelectAudio(false)}
              className="w-full sm:flex-1 py-3 px-4 bg-[#0d111a]/90 hover:bg-[#161d2c] text-[#cbd5e1] hover:text-white border border-white/15 hover:border-white/40 font-bold text-base sm:text-lg tracking-[0.16em] uppercase rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <VolumeX className="w-4 h-4 text-[#cbd5e1] group-hover:text-white flex-shrink-0" />
              <span>ENTER WITHOUT SOUND</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
