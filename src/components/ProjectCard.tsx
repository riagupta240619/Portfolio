import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import type { ProjectExhibit } from '../data/projects';
import { ProjectVisual } from './ProjectVisual';

interface ProjectCardProps {
  project: ProjectExhibit;
  variant: 'featured' | 'gallery';
  onSelect: (project: ProjectExhibit) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant,
  onSelect,
}) => {
  const isFeatured = variant === 'featured';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group border border-[#242522]/14 bg-[#FFFFFF] transition-colors duration-200 hover:border-[#242522]/35 ${
        isFeatured
          ? 'lg:col-span-12 grid grid-cols-1 lg:grid-cols-12'
          : 'lg:col-span-6 flex flex-col justify-between'
      }`}
    >
      {/* Visual Exhibition Plate */}
      <div
        className={`${
          isFeatured
            ? 'lg:col-span-6 border-b lg:border-b-0 lg:border-r border-[#242522]/12'
            : 'border-b border-[#242522]/12'
        }`}
      >
        <ProjectVisual
          visualType={project.visualType}
          title={project.title}
          compact={!isFeatured}
        />
      </div>

      {/* Curatorial Monograph Content */}
      <div
        className={`flex flex-col justify-between p-7 sm:p-9 ${
          isFeatured ? 'lg:col-span-6 lg:p-11' : 'flex-1'
        }`}
      >
        <div className="space-y-4">
          {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-[0.14em] uppercase text-[#57534E]">
            <span className="text-[#56538A] font-medium">{project.number}</span>
            <span aria-hidden="true">·</span>
            <span>{project.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-figures">{project.year}</span>
          </div>

          <h3
            className={`font-serif font-normal text-[#242522] tracking-tight leading-tight ${
              isFeatured ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            {project.fullTitle}
          </h3>

          <p className="text-[15px] sm:text-base leading-[1.7] text-[#4A4843]">
            {project.shortDescription}
          </p>

          {/* Key Contributions Preview */}
          <ul className="space-y-2 pt-2 border-t border-[#242522]/10">
            {project.details.keyFeatures.slice(0, 2).map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-[#4A4843]"
              >
                <span className="font-mono text-[11px] text-[#7774A9] mt-1 shrink-0">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technology Stack Line & Actions */}
        <div className="pt-7 mt-7 border-t border-[#242522]/12 space-y-5">
          <p className="font-mono text-xs text-[#57534E] leading-relaxed">
            <span className="uppercase tracking-[0.12em] text-[#242522] mr-2">
              Stack:
            </span>
            {project.technologies.join(' · ')}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors duration-200 font-mono text-[11px] tracking-[0.14em] uppercase whitespace-nowrap cursor-pointer"
            >
              <span>View Project Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#242522]/25 text-[#242522] hover:border-[#242522] hover:bg-[#EBE7DF]/50 transition-colors duration-150 font-mono text-[11px] tracking-[0.14em] uppercase whitespace-nowrap"
              >
                <Github className="w-3.5 h-3.5" aria-hidden="true" />
                <span>GitHub</span>
              </a>
            )}

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#56538A]/40 text-[#56538A] hover:bg-[#56538A] hover:text-white transition-colors duration-150 font-mono text-[11px] tracking-[0.14em] uppercase whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};
