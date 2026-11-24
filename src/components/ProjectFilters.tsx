import React from 'react';
import type { ProjectCategory } from '../data/projects';

export type FilterValue = 'All Projects' | ProjectCategory;

interface ProjectFiltersProps {
  categories: ProjectCategory[];
  activeFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  counts: Record<string, number>;
  totalCount: number;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  categories,
  activeFilter,
  onFilterChange,
  counts,
  totalCount,
}) => {
  const options: FilterValue[] = ['All Projects', ...categories];

  return (
    <div
      role="tablist"
      aria-label="Filter exhibitions by discipline"
      className="flex flex-wrap items-center gap-2 pt-2"
    >
      {options.map((option) => {
        const isActive = activeFilter === option;
        const count =
          option === 'All Projects' ? totalCount : counts[option] ?? 0;

        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(option)}
            className={`px-4 py-2 font-mono text-xs tracking-[0.1em] transition-colors duration-150 border whitespace-nowrap shrink-0 cursor-pointer ${
              isActive
                ? 'bg-[#242522] text-[#F4F1EB] border-[#242522]'
                : 'bg-transparent text-[#4A4843] border-[#242522]/18 hover:border-[#242522]/50 hover:text-[#242522]'
            }`}
          >
            <span>{option}</span>
            <span
              className={`ml-2 tabular-figures ${
                isActive ? 'text-[#B9C6D0]' : 'text-[#57534E]'
              }`}
            >
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};
