import React from 'react';
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
  const currentIdx = Math.max(
    0,
    MUSEUM_NAV_ITEMS.findIndex((item) => item.id === activeSection)
  );
  const currentRoom = MUSEUM_NAV_ITEMS[currentIdx] ?? MUSEUM_NAV_ITEMS[0];

  const handlePrev = () => {
    const prevIdx = (currentIdx - 1 + MUSEUM_NAV_ITEMS.length) % MUSEUM_NAV_ITEMS.length;
    onSelectSection(MUSEUM_NAV_ITEMS[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIdx + 1) % MUSEUM_NAV_ITEMS.length;
    onSelectSection(MUSEUM_NAV_ITEMS[nextIdx].id);
  };

  return (
    <div className="no-print fixed bottom-4 left-1/2 lg:left-[calc(50%+8rem)] -translate-x-1/2 z-30 flex flex-col items-center max-w-[94vw] pointer-events-none">
      {/* Live 3D Raycast Hover Plaque for ANY Room or Project Sculpture */}
      {hoveredTarget ? (
        <div className="mb-2.5 px-4 py-2 bg-[#242522] text-[#F4F1EB] border border-[#F4F1EB]/15 shadow-lg pointer-events-none text-center">
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B9C6D0]">
            {hoveredTarget.kicker} · Click 3D Object to View
          </p>
          <p className="font-serif text-base text-[#F4F1EB]">
            {hoveredTarget.title}
          </p>
        </div>
      ) : (
        zenMode && (
          <div className="mb-2 px-3.5 py-1.5 bg-[#242522]/90 text-[#EBE7DF] border border-[#F4F1EB]/15 font-mono text-[10px] tracking-[0.14em] uppercase pointer-events-none">
            {cameraMode === 'orbit'
              ? 'Drag to Orbit · Scroll to Zoom · Click Any 3D Sculpture'
              : 'Scroll to Walk · Click Any 3D Sculpture to Inspect'}
          </div>
        )
      )}

      {/* Collapse / Expand Handle */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-expanded={!dockCollapsed}
        className="pointer-events-auto inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#242522] text-[#F4F1EB] border border-[#F4F1EB]/15 font-mono text-[10px] tracking-[0.16em] uppercase hover:bg-[#56538A] transition-colors cursor-pointer"
      >
        {dockCollapsed ? (
          <>
            <ChevronUp className="w-3 h-3" aria-hidden="true" />
            <span>Show 3D Controls</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3 h-3" aria-hidden="true" />
            <span>Hide Controls</span>
          </>
        )}
      </button>

      {/* Main Spatial Control Bar */}
      {!dockCollapsed && (
        <div
          role="region"
          aria-label="3D Museum Spatial Controls"
          className="pointer-events-auto mt-1 bg-[#242522] text-[#F4F1EB] border border-[#F4F1EB]/15 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 shadow-xl"
        >
          {/* Room Stepper */}
          <div className="flex items-center gap-1.5 pr-2 sm:pr-3 border-r border-[#F4F1EB]/15">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous museum room"
              className="p-1.5 text-[#EBE7DF] hover:text-white hover:bg-[#F4F1EB]/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-[#F4F1EB] min-w-[118px] text-center whitespace-nowrap tabular-figures">
              {currentRoom.navLabel}
            </span>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next museum room"
              className="p-1.5 text-[#EBE7DF] hover:text-white hover:bg-[#F4F1EB]/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Camera Navigation Mode */}
          <button
            type="button"
            onClick={onToggleCameraMode}
            className={`inline-flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase border transition-colors whitespace-nowrap cursor-pointer ${
              cameraMode === 'orbit'
                ? 'bg-[#7774A9] text-white border-[#7774A9]'
                : 'bg-transparent text-[#EBE7DF] border-[#F4F1EB]/20 hover:border-[#F4F1EB]/60'
            }`}
          >
            {cameraMode === 'orbit' ? (
              <>
                <Move3d className="w-3.5 h-3.5" aria-hidden="true" />
                <span>3D Orbit: On</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>3D Orbit: Off</span>
              </>
            )}
          </button>

          {/* Zen / Unobstructed 3D Mode */}
          <button
            type="button"
            onClick={onToggleZenMode}
            className={`inline-flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase border transition-colors whitespace-nowrap cursor-pointer ${
              zenMode
                ? 'bg-[#F4F1EB] text-[#242522] border-[#F4F1EB]'
                : 'bg-transparent text-[#EBE7DF] border-[#F4F1EB]/20 hover:border-[#F4F1EB]/60'
            }`}
          >
            {zenMode ? (
              <>
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Show Panels</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                <span>3D Pure View</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
