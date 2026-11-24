/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
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

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

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

  const handleNavigate = useCallback(
    (sectionId: string) => {
      setActiveSection(sectionId);
      if (zenMode) {
        const idx = MUSEUM_NAV_ITEMS.findIndex((item) => item.id === sectionId);
        if (idx >= 0) {
          setScrollProgress(idx / Math.max(1, MUSEUM_NAV_ITEMS.length - 1));
        }
      }
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [zenMode]
  );

  const handleEnterOrbit = useCallback(() => {
    setCameraMode('orbit');
    setZenMode(true);
  }, []);

  // Track active museum room via IntersectionObserver
  useEffect(() => {
    if (zenMode) return;
    const sectionIds = MUSEUM_NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.05, 0.25, 0.5],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
          zenMode ? 'opacity-0 invisible select-none' : 'opacity-100 pointer-events-none'
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
      />

      {/* Resume Dossier / PDF Download Modal */}
      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
