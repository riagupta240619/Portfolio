import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LEMNISCATE_PATH, LEMNISCATE_VIEWBOX } from './InfinityLogo';

interface IntroAnimationProps {
  isOpen: boolean;
  onComplete: () => void;
}

type IntroPhase = 'spark' | 'trace' | 'zoom' | 'reveal';

export const IntroAnimation: React.FC<IntroAnimationProps> = ({
  isOpen,
  onComplete,
}) => {
  const [phase, setPhase] = useState<IntroPhase>('spark');
  const [particlePos, setParticlePos] = useState<{ x: number; y: number } | null>(null);
  const [trailPoints, setTrailPoints] = useState<Array<{ x: number; y: number }>>([]);
  const pathRef = useRef<SVGPathElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setPhase('zoom');
      const timer = window.setTimeout(() => {
        onComplete();
      }, 650);
      return () => window.clearTimeout(timer);
    }

    setPhase('spark');
    setTrailPoints([]);
    setParticlePos(null);

    const t1 = window.setTimeout(() => setPhase('trace'), 620);
    const t2 = window.setTimeout(() => setPhase('zoom'), 2500);
    const t3 = window.setTimeout(() => setPhase('reveal'), 3250);
    const t4 = window.setTimeout(() => onComplete(), 3750);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [isOpen, onComplete]);

  // Glowing particle continuously traveling along the infinity path
  useEffect(() => {
    if (!isOpen || (phase !== 'trace' && phase !== 'zoom')) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const startTime = performance.now();
    const traceDuration = 1800; // matches Scene 2 formation

    const tick = (now: number) => {
      const pathEl = pathRef.current;
      if (pathEl) {
        const totalLength = pathEl.getTotalLength();
        const elapsed = now - startTime;
        const progress = (elapsed % traceDuration) / traceDuration;
        const pt = pathEl.getPointAtLength(progress * totalLength);
        setParticlePos({ x: pt.x, y: pt.y });
        setTrailPoints((prev) => {
          const next = [...prev, { x: pt.x, y: pt.y }];
          return next.slice(-14);
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, phase]);

  // Allow Escape key to skip intro immediately
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="museum-intro-curtain"
          role="dialog"
          aria-modal="true"
          aria-label="The Infinite Museum introduction animation"
          initial={{ opacity: 1 }}
          animate={{
            opacity: phase === 'reveal' ? 0 : 1,
            backgroundColor: phase === 'zoom' || phase === 'reveal' ? '#242522' : '#191A17',
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none"
        >
          {/* Skip Intro Control — always visible and accessible */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-20">
            <button
              type="button"
              onClick={onComplete}
              className="font-mono text-xs tracking-[0.2em] uppercase text-[#EBE7DF]/80 hover:text-white border border-[#EBE7DF]/25 hover:border-[#EBE7DF]/60 px-4 py-2 transition-colors duration-200 whitespace-nowrap cursor-pointer"
            >
              Skip Intro
            </button>
          </div>

          {/* Center Stage: Scene 1 Spark -> Scene 2 Lemniscate -> Scene 3 Zoom */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-2xl px-8">
            <motion.div
              initial={{ scale: 1, y: 0, opacity: 1 }}
              animate={
                phase === 'zoom'
                  ? { scale: 0.34, y: -48, opacity: 0.9 }
                  : phase === 'reveal'
                  ? { scale: 0.24, y: -84, opacity: 0 }
                  : { scale: 1, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[360px] sm:max-w-[440px] flex items-center justify-center"
            >
              {/* Scene 1: Tiny central point of light */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  phase === 'spark'
                    ? { scale: [0, 1.3, 1], opacity: 1 }
                    : { scale: 0.5, opacity: 0 }
                }
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-2.5 h-2.5 rounded-full bg-[#F4F1EB] shadow-[0_0_24px_6px_rgba(185,198,208,0.55)]"
              />

              {/* Scene 2 & 3: Fine Luminous Infinity Path & Traveling Particle */}
              <svg
                viewBox={LEMNISCATE_VIEWBOX}
                className="w-full h-auto overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <filter id="intro-soft-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2.4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="intro-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EBE7DF" />
                    <stop offset="50%" stopColor="#B9C6D0" />
                    <stop offset="100%" stopColor="#7774A9" />
                  </linearGradient>
                </defs>

                {/* Faint guide path once tracing starts */}
                {phase !== 'spark' && (
                  <path
                    d={LEMNISCATE_PATH}
                    stroke="rgba(244, 241, 235, 0.1)"
                    strokeWidth="1"
                  />
                )}

                {/* Main animated luminous line */}
                <motion.path
                  ref={pathRef}
                  d={LEMNISCATE_PATH}
                  stroke="url(#intro-line-grad)"
                  strokeWidth="1.65"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#intro-soft-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    phase === 'spark'
                      ? { pathLength: 0, opacity: 0 }
                      : { pathLength: 1, opacity: 1 }
                  }
                  transition={{
                    pathLength: { duration: 1.75, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.25 },
                  }}
                />

                {/* Soft light trail behind particle */}
                {trailPoints.map((pt, idx) => {
                  const ratio = (idx + 1) / trailPoints.length;
                  return (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={1.1 + ratio * 1.4}
                      fill="#B9C6D0"
                      opacity={ratio * 0.38}
                    />
                  );
                })}

                {/* Glowing traveling particle */}
                {particlePos && (phase === 'trace' || phase === 'zoom') && (
                  <g>
                    <circle
                      cx={particlePos.x}
                      cy={particlePos.y}
                      r="6"
                      fill="#B9C6D0"
                      opacity="0.22"
                    />
                    <circle
                      cx={particlePos.x}
                      cy={particlePos.y}
                      r="2.4"
                      fill="#FFFFFF"
                      filter="url(#intro-soft-glow)"
                    />
                  </g>
                )}
              </svg>
            </motion.div>

            {/* Scene 1–2 Subtitle & Scene 3 Title Emergence */}
            <div className="mt-10 h-12 flex flex-col items-center justify-center text-center">
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={
                  phase === 'spark' || phase === 'trace'
                    ? { opacity: 0.78, y: 0 }
                    : { opacity: 0, y: -6 }
                }
                transition={{ duration: 0.45 }}
                className="font-mono text-[11px] sm:text-xs tracking-[0.26em] uppercase text-[#EBE7DF]"
              >
                AN EXPERIMENT IN CONTINUOUS CREATION
              </motion.p>

              {(phase === 'zoom' || phase === 'reveal') && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-xl sm:text-2xl tracking-[0.06em] text-[#F4F1EB] -mt-5"
                >
                  THE INFINITE MUSEUM ∞
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
