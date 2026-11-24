import React, { useMemo, useState } from 'react';
import {
  PROJECTS_CATALOG,
  getPopulatedCategories,
  type ProjectExhibit,
} from '../data/projects';
import { ProjectFilters, type FilterValue } from './ProjectFilters';
import { ProjectCard } from './ProjectCard';

interface ProjectGalleryProps {
  onSelectProject: (project: ProjectExhibit) => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  onSelectProject,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('All Projects');

  const populatedCategories = useMemo(
    () => getPopulatedCategories(PROJECTS_CATALOG),
    []
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of populatedCategories) {
      counts[cat] = PROJECTS_CATALOG.filter((p) =>
        p.categories.includes(cat)
      ).length;
    }
    return counts;
  }, [populatedCategories]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All Projects') return PROJECTS_CATALOG;
    return PROJECTS_CATALOG.filter((project) =>
      project.categories.includes(activeFilter)
    );
  }, [activeFilter]);

  return (
    <section
      id="exhibitions"
      aria-labelledby="exhibitions-heading"
      className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header & Filters */}
        <div className="pointer-events-auto bg-[#F4F1EB]/92 border border-[#242522]/14 p-7 sm:p-9 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#242522]/12">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] uppercase text-[#57534E] mb-3">
                03 — Exhibitions
              </p>
              <h2
                id="exhibitions-heading"
                className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#242522]"
              >
                The Main Exhibition Gallery
              </h2>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-[#4A4843]">
              Selected engineering works presented as curated exhibits—inspect
              the cards below or click any 3D sculpture in the gallery wing.
            </p>
          </div>

          <ProjectFilters
            categories={populatedCategories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={categoryCounts}
            totalCount={PROJECTS_CATALOG.length}
          />
        </div>

        {/* Varied Editorial Gallery Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pointer-events-auto">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant={
                idx === 0 && filteredProjects.length > 1 ? 'featured' : 'gallery'
              }
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
