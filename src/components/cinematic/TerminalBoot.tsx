import React, { useState, useEffect, useRef } from 'react';
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
      className={`fixed inset-0 z-50 bg-[#050608]/95 flex items-center justify-center p-4 sm:p-6 transition-all duration-700 select-none overflow-hidden font-mono ${
        isTransitioning ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background CRT scanline & subtle noise overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-radial-gradient from-[#b91c1c]/10 via-transparent to-transparent pointer-events-none" />

      {/* Main Terminal Frame */}
      <div className="relative w-full max-w-2xl bg-[#090b10]/95 border border-[#dc2626]/50 rounded-sm p-5 sm:p-7 shadow-[0_0_50px_rgba(220,38,38,0.2)] backdrop-blur-md">
        {/* Top Header Corner Brackets & System Code */}
        <div className="flex items-center justify-between border-b border-[#dc2626]/30 pb-3 mb-5 text-[11px] sm:text-xs tracking-[0.2em] text-[#9ca3af]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#dc2626] animate-pulse" />
            <span className="text-[#f87171] font-bold">{config.systemCode}</span>
          </div>
          {/* Cyber Hatch Pattern */}
          <div className="flex items-center gap-1 opacity-70">
            <span className="h-3 w-1 bg-[#dc2626]" />
            <span className="h-3 w-1 bg-[#dc2626]" />
            <span className="h-3 w-1 bg-[#dc2626]" />
            <span className="h-3 w-1 bg-[#dc2626]" />
          </div>
        </div>

        {/* Terminal Content Output Area */}
        <div className="space-y-2.5 min-h-[140px] text-xs sm:text-sm text-[#e5e7eb] font-mono leading-relaxed">
          {typedLines.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-[#dc2626] font-bold select-none">&gt;</span>
              <span className={idx === 0 ? 'text-[#f87171] font-bold' : 'text-[#d1d5db]'}>
                {line}
              </span>
            </div>
          ))}

          {/* Active Typing Line with Blinking Cursor */}
          {currentLineText && (
            <div className="flex items-start gap-2">
              <span className="text-[#dc2626] font-bold select-none">&gt;</span>
              <span className="text-[#d1d5db]">{currentLineText}</span>
              <span className="inline-block w-2 h-4 bg-[#dc2626] animate-pulse ml-0.5 align-middle" />
            </div>
          )}

          {!currentLineText && !isTypingComplete && typedLines.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-[#dc2626] font-bold select-none">&gt;</span>
              <span className="inline-block w-2 h-4 bg-[#dc2626] animate-pulse" />
            </div>
          )}
        </div>

        {/* Segmented Progress Loading Bar */}
        <div className="mt-6 pt-4 border-t border-[#1f2430]">
          <div className="flex items-center justify-between text-[11px] text-[#9ca3af] mb-2 font-mono tracking-wider">
            <span className="text-[#f87171] font-bold">
              {progress < 100 ? 'INITIALIZING TELEMETRY PIPELINE' : 'CLEARANCE VERIFIED'}
            </span>
            <span>{progress}%</span>
          </div>

          <div className="flex gap-1 h-3.5 bg-[#05070a] p-0.5 border border-[#374151]/80 rounded-sm">
            {Array.from({ length: totalSegments }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 transition-all duration-75 ${
                  idx < filledSegments
                    ? 'bg-gradient-to-t from-[#991b1b] to-[#ef4444] shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                    : 'bg-[#111622]/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Audio Output Selection Action Screen */}
        <div
          className={`mt-7 pt-4 border-t border-[#dc2626]/30 transition-all duration-500 flex flex-col items-center text-center ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#fca5a5] uppercase mb-4">
            [ CLEARANCE COMPLETE • SELECT AUDIO PROTOCOL ]
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            {/* Enter with Sound (Primary Red Glow Button) */}
            <button
              id="btn-enter-with-sound"
              onClick={() => handleSelectAudio(true)}
              className="group relative w-full sm:flex-1 py-3 px-4 bg-[#dc2626] hover:bg-[#ef4444] text-black font-black text-xs sm:text-sm tracking-[0.2em] uppercase rounded-sm transition-all duration-200 shadow-[0_0_24px_rgba(220,38,38,0.5)] hover:shadow-[0_0_36px_rgba(239,68,68,0.8)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔊 ENTER WITH SOUND</span>
            </button>

            {/* Enter without Sound (Muted Outlined Button) */}
            <button
              id="btn-enter-without-sound"
              onClick={() => handleSelectAudio(false)}
              className="w-full sm:flex-1 py-3 px-4 bg-[#11141d]/80 hover:bg-[#1f2433] text-[#9ca3af] hover:text-white border border-[#374151] hover:border-[#9ca3af] font-bold text-xs sm:text-sm tracking-[0.18em] uppercase rounded-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔇 ENTER WITHOUT SOUND</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
