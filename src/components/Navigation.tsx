import React, { useState, useEffect } from 'react';
import { Menu, X, RotateCcw, Download } from 'lucide-react';
import { MUSEUM_NAV_ITEMS, MUSEUM_IDENTITY } from '../data/portfolioData';
import { InfinityLogo } from './InfinityLogo';

interface NavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onReplayIntro: () => void;
  onOpenResume: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  onNavigate,
  onReplayIntro,
  onOpenResume,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape or resize to desktop
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Desktop Left Curatorial Directory Rail */}
      <aside
        aria-label="Museum Exhibition Directory"
        className="no-print hidden lg:flex lg:flex-col lg:justify-between lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 bg-[#F4F1EB] border-r border-[#242522]/12 px-7 py-9 z-30"
      >
        <div>
          {/* Museum Mark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="group block pb-7 border-b border-[#242522]/12"
          >
            <div className="flex items-center gap-3 mb-2.5">
              <InfinityLogo
                className="w-9 h-4.5 transition-transform duration-300 group-hover:scale-105"
                strokeColor="#242522"
                accentColor="#7774A9"
                strokeWidth={2.4}
                animateOrb
              />
            </div>
            <span className="block font-serif text-lg tracking-wide text-[#242522] leading-tight">
              THE INFINITE MUSEUM
            </span>
            <span className="block font-mono text-[11px] tracking-[0.14em] uppercase text-[#57534E] mt-1">
              {MUSEUM_IDENTITY.ownerName}
            </span>
          </a>

          {/* Museum Room Index */}
          <nav aria-label="Primary sections" className="mt-7">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#57534E] mb-4">
              Exhibition Directory
            </p>
            <ul className="space-y-1">
              {MUSEUM_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                      }}
                      aria-current={isActive ? 'location' : undefined}
                      className={`group flex items-center justify-between py-2 text-xs font-mono tracking-[0.12em] transition-colors duration-150 whitespace-nowrap ${
                        isActive
                          ? 'text-[#242522] font-medium'
                          : 'text-[#57534E] hover:text-[#242522]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`inline-block w-3 h-[1px] transition-all duration-200 ${
                            isActive
                              ? 'bg-[#7774A9] w-5'
                              : 'bg-[#242522]/20 group-hover:bg-[#242522]/50 group-hover:w-4'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item.navLabel}</span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Curatorial Utilities */}
        <div className="pt-6 border-t border-[#242522]/12 space-y-3">
          <button
            type="button"
            onClick={onOpenResume}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors duration-200 font-mono text-[11px] tracking-[0.14em] uppercase whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Download Resume</span>
          </button>

          <button
            type="button"
            onClick={onReplayIntro}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[#57534E] hover:text-[#242522] transition-colors duration-150 font-mono text-[11px] tracking-[0.12em] uppercase whitespace-nowrap cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span>Replay Intro</span>
          </button>
        </div>
      </aside>

      {/* Mobile / Tablet Single-Row Top Bar (<= 56px height) */}
      <header className="no-print lg:hidden sticky top-0 z-30 h-14 bg-[#F4F1EB] border-b border-[#242522]/12 px-4 sm:px-6 flex items-center justify-between gap-4">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0"
        >
          <InfinityLogo
            className="w-7 h-3.5"
            strokeColor="#242522"
            accentColor="#7774A9"
            strokeWidth={2.6}
          />
          <span className="font-serif text-base sm:text-lg tracking-wide text-[#242522] font-medium">
            THE INFINITE MUSEUM
          </span>
        </a>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-museum-directory"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="inline-flex items-center gap-2 min-h-[44px] px-3 text-xs font-mono tracking-[0.14em] uppercase text-[#242522] hover:text-[#56538A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>{mobileMenuOpen ? 'Close' : 'Directory'}</span>
          {mobileMenuOpen ? (
            <X className="w-4 h-4" aria-hidden="true" />
          ) : (
            <Menu className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Mobile Collapsible Full-Height Museum Directory */}
      {mobileMenuOpen && (
        <div
          id="mobile-museum-directory"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile exhibition directory"
          className="no-print lg:hidden fixed inset-0 top-14 z-40 bg-[#F4F1EB] overflow-y-auto px-6 py-8 flex flex-col justify-between border-t border-[#242522]/12"
        >
          <nav aria-label="Mobile sections">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#57534E] mb-5">
              Museum Rooms
            </p>
            <ul className="divide-y divide-[#242522]/10 border-y border-[#242522]/10">
              {MUSEUM_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                      }}
                      className={`flex items-center justify-between py-3.5 min-h-[48px] transition-colors ${
                        isActive ? 'text-[#56538A]' : 'text-[#242522]'
                      }`}
                    >
                      <span className="font-mono text-xs tracking-[0.14em]">
                        {item.navLabel}
                      </span>
                      <span className="font-serif italic text-sm text-[#57534E]">
                        {item.subtitle}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="pt-8 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-5 py-3 bg-[#242522] text-[#F4F1EB] font-mono text-xs tracking-[0.14em] uppercase cursor-pointer"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download Resume</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onReplayIntro();
              }}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-5 py-3 border border-[#242522]/25 text-[#242522] font-mono text-xs tracking-[0.14em] uppercase cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Replay Intro</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
