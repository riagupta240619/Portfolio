import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Compass,
  Move3d,
} from 'lucide-react';
import { MUSEUM_NAV_ITEMS } from '../data/portfolioData';
import type { CameraMode } from './Museum3DCanvas';
import type { InteractiveTargetMeta } from '../three/sculptures';

interface SpatialDockProps {
  activeSection: string;
  cameraMode: CameraMode;
  zenMode: boolean;
  dockCollapsed: boolean;
  hoveredTarget: InteractiveTargetMeta | null;
  onSelectSection: (sectionId: string) => void;
  onToggleCameraMode: () => void;
  onToggleZenMode: () => void;
  onToggleCollapsed: () => void;
}

export const SpatialDock: React.FC<SpatialDockProps> = ({
  activeSection,
  cameraMode,
  zenMode,
  dockCollapsed,
  hoveredTarget,
  onSelectSection,
  onToggleCameraMode,
  onToggleZenMode,
  onToggleCollapsed,
}) => {
  const [hoveredRoomIndex, setHoveredRoomIndex] = useState<number | null>(null);

  const currentIdx = Math.max(
    0,
    MUSEUM_NAV_ITEMS.findIndex((item) => item.id === activeSection)
  );
  const currentRoom = MUSEUM_NAV_ITEMS[currentIdx] ?? MUSEUM_NAV_ITEMS[0];
  const previewRoom =
    hoveredRoomIndex !== null ? MUSEUM_NAV_ITEMS[hoveredRoomIndex] : null;

  const handlePrev = () => {
    const prevIdx =
      (currentIdx - 1 + MUSEUM_NAV_ITEMS.length) % MUSEUM_NAV_ITEMS.length;
    onSelectSection(MUSEUM_NAV_ITEMS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIdx + 1) % MUSEUM_NAV_ITEMS.length;
    onSelectSection(MUSEUM_NAV_ITEMS[nextIdx].id);
  };

  return (
    <div className="no-print fixed bottom-3 sm:bottom-4 left-1/2 lg:left-[calc(50%+8rem)] -translate-x-1/2 z-30 flex flex-col items-center max-w-[calc(100vw-16px)] pointer-events-none">
      {/* Live 3D Raycast Hover Plaque or Desktop Preview Tooltip */}
      {hoveredTarget ? (
        <div className="mb-2 px-3.5 py-1.5 bg-[#242522] text-[#F4F1EB] border border-[#F4F1EB]/15 shadow-lg pointer-events-none text-center max-w-[90vw]">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#B9C6D0] truncate">
            {hoveredTarget.kicker} · Tap to Inspect
          </p>
          <p className="font-serif text-sm sm:text-base text-[#F4F1EB] truncate">
            {hoveredTarget.title}
          </p>
        </div>
      ) : previewRoom ? (
        <div className="hidden sm:block mb-2 px-3 py-1 bg-[#242522] text-[#F4F1EB] font-mono text-[10px] tracking-[0.14em] uppercase shadow-md pointer-events-none">
          {previewRoom.navLabel} — {previewRoom.subtitle}
        </div>
      ) : (
        zenMode &&
        !dockCollapsed && (
          <div className="hidden sm:block mb-2 px-3.5 py-1 bg-[#F4F1EB] text-[#4A4843] border border-[#242522]/15 font-mono text-[10px] tracking-[0.14em] uppercase shadow-sm pointer-events-none">
            {cameraMode === 'orbit'
              ? 'Drag to Orbit · W/S to Walk · Click Any Sculpture'
              : 'Scroll to Walk · Click Any 3D Sculpture to Inspect'}
          </div>
        )
      )}

      {/* Collapsed State: Ultra-compact single tab */}
      {dockCollapsed ? (
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded={false}
          className="pointer-events-auto inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F4F1EB] text-[#242522] border border-[#242522]/20 hover:border-[#242522] shadow-md font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase transition-colors whitespace-nowrap cursor-pointer"
        >
          <ChevronUp className="w-3.5 h-3.5 text-[#56538A]" aria-hidden="true" />
          <span className="sm:hidden tabular-figures">{currentRoom.number}/09</span>
          <span className="hidden sm:inline">{currentRoom.navLabel}</span>
        </button>
      ) : (
        /* Expanded Museum Spatial Dock — Single Row on Mobile & Desktop */
        <div
          role="region"
          aria-label="3D Museum Navigation & View Controls"
          className="pointer-events-auto bg-[#F4F1EB] text-[#242522] border border-[#242522]/18 shadow-[0_10px_28px_rgba(36,37,34,0.12)] px-2 sm:px-3.5 py-1.5 sm:py-2 flex flex-nowrap items-center justify-center gap-1.5 sm:gap-3"
        >
          {/* Zone 1: Compact Room Stepper + Floorplan Dots */}
          <div className="flex items-center gap-0.5 sm:gap-1.5 sm:pr-3 sm:border-r border-[#242522]/12 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous museum room"
              className="w-8 h-8 inline-flex items-center justify-center text-[#57534E] hover:text-[#242522] hover:bg-[#EBE7DF] transition-colors cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <div className="flex flex-col items-center px-1 sm:min-w-[116px]">
              {/* Phone: compact 01/09 counter so it never fills screen */}
              <span className="sm:hidden font-mono text-[11px] font-medium tracking-[0.08em] text-[#242522] whitespace-nowrap tabular-figures">
                {currentRoom.number}/09
              </span>
              {/* Tablet/Desktop: full room label + interactive floorplan dots */}
              <span className="hidden sm:inline font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[#242522] whitespace-nowrap tabular-figures">
                {currentRoom.navLabel}
              </span>
              <div
                className="hidden sm:flex items-center gap-1 mt-1"
                role="navigation"
                aria-label="Jump to museum chamber"
              >
                {MUSEUM_NAV_ITEMS.map((item, idx) => {
                  const isActive = idx === currentIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectSection(item.id)}
                      onMouseEnter={() => setHoveredRoomIndex(idx)}
                      onMouseLeave={() => setHoveredRoomIndex(null)}
                      aria-label={`Go to ${item.navLabel}`}
                      aria-current={isActive ? 'step' : undefined}
                      className={`h-1.5 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'w-4 bg-[#56538A]'
                          : 'w-1.5 bg-[#242522]/22 hover:bg-[#242522]/55'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next museum room"
              className="w-8 h-8 inline-flex items-center justify-center text-[#57534E] hover:text-[#242522] hover:bg-[#EBE7DF] transition-colors cursor-pointer shrink-0"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Zone 2: Camera Mode Segmented Control (Walk vs Orbit) */}
          <div
            role="group"
            aria-label="Camera navigation mode"
            className="inline-flex items-center bg-[#EBE7DF] p-0.5 border border-[#242522]/12 shrink-0"
          >
            <button
              type="button"
              onClick={() => cameraMode !== 'guided' && onToggleCameraMode()}
              aria-pressed={cameraMode === 'guided'}
              className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 font-mono text-[10px] sm:text-[11px] tracking-[0.08em] uppercase transition-colors whitespace-nowrap cursor-pointer ${
                cameraMode === 'guided'
                  ? 'bg-[#242522] text-[#F4F1EB]'
                  : 'text-[#57534E] hover:text-[#242522]'
              }`}
            >
              <Compass className="w-3 h-3" aria-hidden="true" />
              <span>Walk</span>
            </button>
            <button
              type="button"
              onClick={() => cameraMode !== 'orbit' && onToggleCameraMode()}
              aria-pressed={cameraMode === 'orbit'}
              className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 font-mono text-[10px] sm:text-[11px] tracking-[0.08em] uppercase transition-colors whitespace-nowrap cursor-pointer ${
                cameraMode === 'orbit'
                  ? 'bg-[#56538A] text-white'
                  : 'text-[#57534E] hover:text-[#242522]'
              }`}
            >
              <Move3d className="w-3 h-3" aria-hidden="true" />
              <span>Orbit</span>
            </button>
          </div>

          {/* Zone 3: Overlay Visibility Toggle & Collapse */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleZenMode}
              aria-pressed={zenMode}
              aria-label={zenMode ? 'Show content panels' : 'Hide content panels'}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 font-mono text-[10px] sm:text-[11px] tracking-[0.08em] uppercase border transition-colors whitespace-nowrap cursor-pointer ${
                zenMode
                  ? 'bg-[#242522] text-[#F4F1EB] border-[#242522]'
                  : 'bg-[#FFFFFF] text-[#242522] border-[#242522]/20 hover:border-[#242522]'
              }`}
            >
              {zenMode ? (
                <>
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Show Panels</span>
                  <span className="sm:hidden">Panels</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Hide Panels</span>
                  <span className="sm:hidden">3D</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label="Minimize 3D controls bar (shortcut H)"
              title="Minimize controls (H)"
              className="w-8 h-8 inline-flex items-center justify-center border border-[#242522]/15 text-[#57534E] hover:text-[#242522] hover:bg-[#EBE7DF] transition-colors cursor-pointer shrink-0"
            >
              <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
