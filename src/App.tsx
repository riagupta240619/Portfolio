/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { MUSEUM_NAV_ITEMS } from './data/portfolioData';
import { PROJECTS_CATALOG, type ProjectExhibit } from './data/projects';
import { IntroAnimation } from './components/IntroAnimation';
import { Navigation } from './components/Navigation';
import { HomeHero } from './components/HomeHero';
import { AboutSection } from './components/AboutSection';
import { ProjectGallery } from './components/ProjectGallery';
import { TechStack } from './components/TechStack';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { AchievementsSection } from './components/AchievementsSection';
import { EducationSection } from './components/EducationSection';
import { PublicationsSection } from './components/PublicationsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { ProjectDetails } from './components/ProjectDetails';
import { SectionDetailsModal } from './components/SectionDetailsModal';
import { Museum3DCanvas, type CameraMode } from './components/Museum3DCanvas';
import { SpatialDock } from './components/SpatialDock';
import type { InteractiveTargetMeta } from './three/sculptures';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<ProjectExhibit | null>(null);
  const [selectedSectionModal, setSelectedSectionModal] = useState<string | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<InteractiveTargetMeta | null>(null);

  const [cameraMode, setCameraMode] = useState<CameraMode>('guided');
  const [zenMode, setZenMode] = useState<boolean>(false);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  // Keyboard shortcut 'H' toggles spatial dock visibility
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key.toLowerCase() === 'h') {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const handleReplayIntro = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setShowIntro(true);
  }, []);

  const programmaticNavLockUntilRef = useRef<number>(0);

  const handleNavigate = useCallback((sectionId: string) => {
    programmaticNavLockUntilRef.current = performance.now() + 750;
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleEnterOrbit = useCallback(() => {
    setCameraMode('orbit');
    setZenMode(true);
  }, []);

  // Synchronize active museum room & 3D waypoint progress deterministically
  // Accounts for both 2D section boundaries and 3D corridor chamber midpoints in zenMode
  useEffect(() => {
    const sectionIds = MUSEUM_NAV_ITEMS.map((item) => item.id);
    let rafId = 0;

    const updateFromScroll = () => {
      rafId = 0;
      const elements = sectionIds
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter((entry): entry is { id: string; el: HTMLElement } => entry.el !== null);

      if (elements.length === 0) return;

      const scrollY = window.scrollY;
      const vh = window.innerHeight || 1;
      const docHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(1, docHeight - vh);
      const n = elements.length;

      // 1. Piecewise-linear mapping so each section top aligns with its 3D camera waypoint
      const anchors: number[] = [];
      for (let i = 0; i < n; i++) {
        const rawTop = elements[i].el.getBoundingClientRect().top + scrollY;
        const clampedTop = i === 0 ? 0 : Math.min(rawTop, maxScroll);
        const monotonicTop = i === 0 ? 0 : Math.max(anchors[i - 1], clampedTop);
        anchors.push(monotonicTop);
      }
      if (n > 1) {
        anchors[n - 1] = Math.max(anchors[n - 2], Math.min(anchors[n - 1], maxScroll));
      }

      let progress = n <= 1 ? 0 : 1;
      if (n > 1) {
        if (scrollY <= anchors[0]) {
          progress = 0;
        } else if (scrollY < anchors[n - 1]) {
          for (let i = 0; i < n - 1; i++) {
            const start = anchors[i];
            const end = anchors[i + 1];
            if (scrollY <= end && end > start) {
              const localT = (scrollY - start) / (end - start);
              progress = (i + localT) / (n - 1);
              break;
            }
          }
        }
      }

      setScrollProgress(progress);

      // 2. Determine active section title for Navigation & SpatialDock
      let nextActive = elements[0].id;

      if (scrollY + vh >= docHeight - 24) {
        nextActive = elements[n - 1].id;
      } else if (zenMode && n > 1) {
        // In Zen Mode (3D corridor only), match the 3D chamber currently in camera view
        const roomIndex = Math.min(
          n - 1,
          Math.max(0, Math.round(progress * (n - 1)))
        );
        nextActive = elements[roomIndex].id;
      } else {
        // With editorial panels visible, pick the section with largest visible area
        // inside the readable viewport band (below mobile sticky header, above dock)
        const bandTop = window.innerWidth < 1024 ? 56 : 0;
        const bandBottom = vh * 0.84;
        let bestOverlap = -1;

        for (const { id, el } of elements) {
          const rect = el.getBoundingClientRect();
          const visTop = Math.max(rect.top, bandTop);
          const visBottom = Math.min(rect.bottom, bandBottom);
          const overlap = Math.max(0, visBottom - visTop);
          if (overlap > bestOverlap) {
            bestOverlap = overlap;
            nextActive = id;
          }
        }
      }

      if (performance.now() >= programmaticNavLockUntilRef.current) {
        setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
      }
    };

    const scheduleUpdate = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateFromScroll);
    };

    const cancelProgrammaticLock = () => {
      programmaticNavLockUntilRef.current = 0;
    };

    updateFromScroll();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('wheel', cancelProgrammaticLock, { passive: true });
    window.addEventListener('touchstart', cancelProgrammaticLock, { passive: true });

    const mainEl = document.getElementById('main-content');
    const resizeObserver =
      mainEl && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(scheduleUpdate)
        : null;
    if (mainEl && resizeObserver) {
      resizeObserver.observe(mainEl);
    }

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('wheel', cancelProgrammaticLock);
      window.removeEventListener('touchstart', cancelProgrammaticLock);
      resizeObserver?.disconnect();
    };
  }, [zenMode]);

  return (
    <div className="relative min-h-screen text-[#242522]">
      {/* Keyboard Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#242522] focus:text-[#F4F1EB] focus:font-mono focus:text-xs"
      >
        Skip to exhibition content
      </a>

      {/* Interactive 3D WebGL Museum Corridor */}
      <Museum3DCanvas
        scrollProgress={scrollProgress}
        activeSection={activeSection}
        cameraMode={cameraMode}
        onSelectProject={(proj) => {
          setSelectedSectionModal(null);
          setSelectedProject(proj);
        }}
        onSelectSectionModal={(secId) => {
          setSelectedProject(null);
          setSelectedSectionModal(secId);
        }}
        onHoveredTargetChange={setHoveredTarget}
      />

      {/* Signature Infinity Intro Curtain */}
      <IntroAnimation isOpen={showIntro} onComplete={handleIntroComplete} />

      {/* Thin Reading / Gallery Scroll Progress Hairline */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="no-print fixed top-0 left-0 right-0 lg:left-64 h-[2px] bg-[#7774A9] origin-left z-40"
      />

      {/* Museum Navigation (Desktop Rail + Mobile Directory) */}
      <Navigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onReplayIntro={handleReplayIntro}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* Spatial 2D Editorial Overlay Layer */}
      <main
        id="main-content"
        className={`relative z-10 lg:pl-64 transition-opacity duration-300 ${
          zenMode
            ? 'opacity-0 zen-hidden select-none'
            : 'opacity-100 pointer-events-none'
        }`}
      >
        <HomeHero
          onExplore={() => handleNavigate('exhibitions')}
          onViewResume={() => setResumeOpen(true)}
          onEnterOrbit={handleEnterOrbit}
        />
        <AboutSection />
        <ProjectGallery onSelectProject={setSelectedProject} />
        <TechStack />
        <ExperienceTimeline />
        <AchievementsSection />
        <EducationSection />
        <PublicationsSection />
        <ContactSection onOpenResume={() => setResumeOpen(true)} />
        <div className="pointer-events-auto pb-20">
          <Footer onReplayIntro={handleReplayIntro} />
        </div>
      </main>

      {/* Bottom Spatial 3D Control Dock */}
      <SpatialDock
        activeSection={activeSection}
        cameraMode={cameraMode}
        zenMode={zenMode}
        dockCollapsed={dockCollapsed}
        hoveredTarget={hoveredTarget}
        onSelectSection={handleNavigate}
        onToggleCameraMode={() =>
          setCameraMode((prev) => (prev === 'guided' ? 'orbit' : 'guided'))
        }
        onToggleZenMode={() => setZenMode((prev) => !prev)}
        onToggleCollapsed={() => setDockCollapsed((prev) => !prev)}
      />

      {/* Unified Project Detail Modal (triggered by 2D cards OR 3D sculptures) */}
      <ProjectDetails
        project={selectedProject}
        allProjects={PROJECTS_CATALOG}
        onClose={() => setSelectedProject(null)}
        onNavigateProject={setSelectedProject}
      />

      {/* Section Exhibit Modal (triggered by clicking any 3D room sculpture) */}
      <SectionDetailsModal
        sectionId={selectedSectionModal}
        onClose={() => setSelectedSectionModal(null)}
        onSelectSection={setSelectedSectionModal}
        onOpenResume={() => setResumeOpen(true)}
        onJumpToExhibitions={() => {
          setZenMode(false);
          handleNavigate('exhibitions');
        }}
        onSelectProject={(proj) => {
          setSelectedSectionModal(null);
          setSelectedProject(proj);
        }}
      />

      {/* Resume Dossier / PDF Download Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
