import React from 'react';
import { ArrowUp, RotateCcw } from 'lucide-react';
import { MUSEUM_IDENTITY } from '../data/portfolioData';

interface FooterProps {
  onReplayIntro: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print px-6 sm:px-10 lg:px-16 py-12 bg-[#242522] text-[#F4F1EB]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2">
          <p className="font-serif text-2xl tracking-wide">
            {MUSEUM_IDENTITY.siteName} {MUSEUM_IDENTITY.symbol}
          </p>
          <p className="text-sm text-[#EBE7DF]/80">
            Designed and developed by {MUSEUM_IDENTITY.ownerName}.
          </p>
          <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#B9C6D0]">
            {MUSEUM_IDENTITY.philosophy}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onReplayIntro}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#F4F1EB]/25 text-[#F4F1EB] hover:border-[#F4F1EB] transition-colors font-mono text-xs tracking-[0.14em] uppercase whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Replay Intro</span>
          </button>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#F4F1EB] text-[#242522] hover:bg-[#B9C6D0] transition-colors font-mono text-xs tracking-[0.14em] uppercase whitespace-nowrap cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
