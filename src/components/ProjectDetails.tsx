import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectExhibit } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';

interface ProjectDetailsProps {
  project: ProjectExhibit | null;
  allProjects: ProjectExhibit[];
  onClose: () => void;
  onNavigateProject: (project: ProjectExhibit) => void;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  allProjects,
  onClose,
  onNavigateProject,
}) => {
  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  const currentIndex = project
    ? allProjects.findIndex((p) => p.id === project.id)
    : -1;
  const prevProject =
    currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-detail-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exhibit-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#242522]/75 flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-y-auto"
        >
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F4F1EB] text-[#242522] border border-[#242522]/20 shadow-2xl"
          >
            {/* Sticky Accession Modal Header */}
            <div className="sticky top-0 z-10 bg-[#F4F1EB] border-b border-[#242522]/12 px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-[0.16em] uppercase text-[#57534E]">
                <span className="text-[#56538A] font-medium">{project.number}</span>
                <span aria-hidden="true">·</span>
                <span>{project.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-figures">{project.year}</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="inline-flex items-center justify-center w-10 h-10 border border-[#242522]/20 text-[#242522] hover:bg-[#242522] hover:text-[#F4F1EB] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Detail Body */}
            <div className="p-6 sm:p-10 space-y-10">
              {/* Title & External Links */}
              <div className="space-y-5">
                <h2
                  id="exhibit-modal-title"
                  className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#242522] leading-[1.08]"
                >
                  {project.fullTitle}
                </h2>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors font-mono text-xs tracking-[0.14em] uppercase whitespace-nowrap"
                    >
                      <Github className="w-4 h-4" aria-hidden="true" />
                      <span>GitHub Repository</span>
                    </a>
                  )}
                  {project.liveDemoUrl && (
                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#56538A] text-[#56538A] hover:bg-[#56538A] hover:text-white transition-colors font-mono text-xs tracking-[0.14em] uppercase whitespace-nowrap"
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Architectural Schematic Plate */}
              <figure className="space-y-2.5">
                <div className="border border-[#242522]/14 overflow-hidden">
                  <ProjectVisual
                    visualType={project.visualType}
                    title={project.fullTitle}
                  />
                </div>
                <figcaption className="font-serif italic text-xs text-[#57534E]">
                  {project.visualCaption}
                </figcaption>
              </figure>

              {/* Museum Accession Metadata Grid */}
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-[#242522]/12">
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E] mb-1.5">
                    Exhibition Year
                  </dt>
                  <dd className="font-mono text-sm text-[#242522] tabular-figures">
                    {project.year}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E] mb-1.5">
                    Discipline
                  </dt>
                  <dd className="text-sm text-[#242522]">
                    {project.categoryLabel}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E] mb-1.5">
                    Technologies Used
                  </dt>
                  <dd className="font-mono text-xs text-[#242522] leading-relaxed">
                    {project.technologies.join(' · ')}
                  </dd>
                </div>
              </dl>

              {/* Structured Monograph Sections */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
                <div className="md:col-span-7 space-y-8">
                  <section className="space-y-2.5">
                    <h3 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                      Project Overview
                    </h3>
                    <p className="text-[15px] sm:text-base leading-[1.75] text-[#242522]/90">
                      {project.details.overview}
                    </p>
                  </section>

                  {project.details.problemStatement && (
                    <section className="space-y-2.5">
                      <h3 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                        Problem Statement
                      </h3>
                      <p className="text-[15px] leading-[1.75] text-[#4A4843]">
                        {project.details.problemStatement}
                      </p>
                    </section>
                  )}

                  <section className="space-y-2.5">
                    <h3 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                      Objective
                    </h3>
                    <p className="text-[15px] leading-[1.75] text-[#4A4843]">
                      {project.details.objective}
                    </p>
                  </section>

                  <section className="space-y-3">
                    <h3 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                      Key Features & Contributions
                    </h3>
                    <ul className="space-y-2.5">
                      {project.details.keyFeatures.map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-[15px] leading-relaxed text-[#242522]/90"
                        >
                          <span className="font-mono text-xs text-[#7774A9] mt-1 shrink-0">
                            0{idx + 1}
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Right Monograph Column: Technical Implementation & Workflow */}
                <div className="md:col-span-5 space-y-8 bg-[#EBE7DF]/60 border border-[#242522]/12 p-6">
                  <section className="space-y-3">
                    <h3 className="font-mono text-xs tracking-[0.16em] uppercase text-[#242522]">
                      Technical Implementation
                    </h3>
                    <ul className="space-y-2.5">
                      {project.details.technicalImplementation.map((impl, idx) => (
                        <li
                          key={idx}
                          className="text-sm leading-relaxed text-[#4A4843] pb-2.5 border-b border-[#242522]/10 last:border-b-0 last:pb-0"
                        >
                          {impl}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {project.details.workflowSteps && (
                    <section className="space-y-3 pt-4 border-t border-[#242522]/12">
                      <h3 className="font-mono text-xs tracking-[0.16em] uppercase text-[#242522]">
                        System Workflow
                      </h3>
                      <ol className="space-y-2.5">
                        {project.details.workflowSteps.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-sm leading-relaxed text-[#4A4843]"
                          >
                            <span className="font-mono text-[11px] text-[#56538A] mt-0.5 tabular-figures shrink-0">
                              {idx + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}

                  {project.details.learnings && project.details.learnings.length > 0 && (
                    <section className="space-y-3 pt-4 border-t border-[#242522]/12">
                      <h3 className="font-mono text-xs tracking-[0.16em] uppercase text-[#242522]">
                        Challenges & Learnings
                      </h3>
                      <ul className="space-y-2">
                        {project.details.learnings.map((item, idx) => (
                          <li key={idx} className="text-sm leading-relaxed text-[#4A4843]">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>

              {/* Exhibit Navigation Footer */}
              <div className="pt-6 border-t border-[#242522]/12 flex items-center justify-between gap-4">
                {prevProject ? (
                  <button
                    type="button"
                    onClick={() => onNavigateProject(prevProject)}
                    className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#57534E] hover:text-[#242522] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    <span>{prevProject.title}</span>
                  </button>
                ) : (
                  <span />
                )}

                {nextProject ? (
                  <button
                    type="button"
                    onClick={() => onNavigateProject(nextProject)}
                    className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#57534E] hover:text-[#242522] transition-colors cursor-pointer"
                  >
                    <span>{nextProject.title}</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <span />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
