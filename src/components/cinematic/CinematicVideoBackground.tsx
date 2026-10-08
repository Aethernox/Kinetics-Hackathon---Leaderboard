import React, { useRef, useState, useEffect } from 'react';

interface CinematicVideoBackgroundProps {
  videoUrl?: string;
  scrollProgress?: number;
}

export const CinematicVideoBackground: React.FC<CinematicVideoBackgroundProps> = ({
  videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4',
  scrollProgress = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Autoplay with audio muted is standard; catch handled gracefully
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#050505] select-none"
    >
      {/* 1. CloudFront Cinematic Full-Bleed Video Layer */}
      {!hasError && (
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-85' : 'opacity-0'
            }`}
          style={{
            transform: `scale(${1 + scrollProgress * 0.05}) translateY(${scrollProgress * -20}px)`,
            transition: 'transform 0.1s ease-out, opacity 1s ease-in-out',
          }}
        />
      )}

      {/* Fallback Static Gradient & Glow if Video Network is Delayed */}
      <div
        className={`absolute inset-0 bg-[#050505] transition-opacity duration-700 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-[450px] bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-3xl" />
      </div>

      {/* 2. Top Header Subtle Dark Scrim (For crystal-clear navigation legibility) */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#050505]/90 via-[#050505]/50 to-transparent pointer-events-none" />

      {/* 3. Subtle Lateral Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,5,5,0.75)_100%)] pointer-events-none" />

      {/* 4. Cinematic Bottom Edge Fade into Deep #050505 Surface */}
      <div
        className="absolute bottom-0 inset-x-0 h-64 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(5, 5, 5, 1) 0%, rgba(5, 5, 5, 0.95) 25%, rgba(5, 5, 5, 0.75) 50%, rgba(5, 5, 5, 0.3) 75%, transparent 100%)',
        }}
      />
    </div>
  );
};
