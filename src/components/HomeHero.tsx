import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, ArrowUpRight, FileText, Move3d } from 'lucide-react';
import { MUSEUM_IDENTITY } from '../data/portfolioData';

interface HomeHeroProps {
  onExplore: () => void;
  onViewResume: () => void;
  onEnterOrbit: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onExplore,
  onViewResume,
  onEnterOrbit,
}) => {
  return (
    <section
      id="home"
      aria-label="The Grand Entrance"
      className="relative min-h-[calc(100vh-3.5rem)] lg:min-h-screen flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16 pointer-events-none"
    >
      {/* Top Curatorial Kicker */}
      <div className="pointer-events-auto inline-flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#242522]/15 bg-[#F4F1EB]/88 px-5 py-3">
        <span className="font-mono text-xs tracking-[0.18em] uppercase text-[#57534E]">
          01 — The Grand Entrance · 3D Atrium
        </span>
        <span className="font-mono text-xs tracking-[0.16em] uppercase text-[#57534E]">
          {MUSEUM_IDENTITY.role}
        </span>
      </div>

      {/* Left-Anchored Typographic Plaque Leaving Right Atrium Open for Live 3D Infinity Sculpture */}
      <div className="my-auto py-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto xl:col-span-6 bg-[#F4F1EB]/92 border border-[#242522]/14 p-7 sm:p-10 space-y-6"
        >
          <div className="space-y-3">
            <p className="font-serif italic text-xl sm:text-2xl text-[#56538A]">
              {MUSEUM_IDENTITY.subtitle}
            </p>
            <h1 className="font-serif text-[clamp(2.3rem,4.6vw,4.1rem)] font-normal tracking-[-0.015em] leading-[1.04] text-[#242522] [text-wrap:balance]">
              {MUSEUM_IDENTITY.siteName}{' '}
              <span className="text-[#7774A9] font-light" aria-hidden="true">
                {MUSEUM_IDENTITY.symbol}
              </span>
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-[#242522]/90 tracking-tight">
              {MUSEUM_IDENTITY.tagline}
            </p>
          </div>

          <p className="max-w-xl text-base leading-[1.7] text-[#4A4843]">
            {MUSEUM_IDENTITY.heroSupportingText}
          </p>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onExplore}
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors duration-200 font-mono text-xs tracking-[0.15em] uppercase whitespace-nowrap cursor-pointer"
            >
              <span>Explore the Exhibition</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onViewResume}
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#242522]/30 bg-[#FFFFFF]/80 text-[#242522] hover:border-[#242522] hover:bg-[#EBE7DF] transition-colors duration-200 font-mono text-xs tracking-[0.15em] uppercase whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>View Resume</span>
            </button>

            <button
              type="button"
              onClick={onEnterOrbit}
              className="inline-flex items-center gap-2 px-4 py-3 border border-[#56538A]/35 text-[#56538A] hover:bg-[#56538A] hover:text-white transition-colors duration-200 font-mono text-xs tracking-[0.14em] uppercase whitespace-nowrap cursor-pointer"
            >
              <Move3d className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Inspect 3D Space</span>
            </button>
          </div>
        </motion.div>

        {/* Open Spatial Window onto the 3D Infinity Sculpture */}
        <div className="hidden xl:flex xl:col-span-6 items-end justify-end min-h-[360px] pointer-events-none">
          <div className="bg-[#F4F1EB]/86 border border-[#242522]/12 px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E]">
            Sculpture 00 · 3D Lemniscate · Scroll to Walk the Corridor
          </div>
        </div>
      </div>

      {/* Bottom Metadata & Scroll Indicator */}
      <div className="pointer-events-auto bg-[#F4F1EB]/88 border border-[#242522]/12 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] tracking-[0.16em] uppercase text-[#57534E]">
          {MUSEUM_IDENTITY.heroMetadata.map((item, idx) => (
            <React.Fragment key={item}>
              {idx > 0 && <span aria-hidden="true">·</span>}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>

        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#242522] hover:text-[#56538A] transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <span>Scroll to Enter</span>
          <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};
