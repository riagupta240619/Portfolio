import React from 'react';
import { motion } from 'motion/react';
import {
  Code2,
  Cpu,
  Layout,
  Server,
  Database,
  Cloud,
  Wrench,
} from 'lucide-react';
import { TECH_STACK_GROUPS } from '../data/portfolioData';

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  languages: Code2,
  'core-cs': Cpu,
  frontend: Layout,
  backend: Server,
  databases: Database,
  cloud: Cloud,
  testing: Wrench,
};

export const TechStack: React.FC = () => {
  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#F4F1EB]/90 border border-[#242522]/12 px-7 py-6">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[#57534E] mb-3">
              04 — Tech Stack
            </p>
            <h2
              id="tech-stack-heading"
              className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#242522]"
            >
              The Engineering Toolkit
            </h2>
          </div>
          <span className="font-serif italic text-lg text-[#56538A]">
            Seven Disciplines · Active Materials
          </span>
        </div>

        {/* Grouped Architectural Catalog Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pointer-events-auto">
          {TECH_STACK_GROUPS.map((group, idx) => {
            const Icon = GROUP_ICONS[group.id] ?? Code2;
            const isWide = group.id === 'core-cs';

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group border border-[#242522]/12 bg-[#FFFFFF]/92 hover:bg-[#FFFFFF] hover:border-[#242522]/30 transition-colors duration-200 p-7 flex flex-col justify-between ${
                  isWide ? 'md:col-span-2 xl:col-span-2' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#242522]/10">
                    <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#56538A]">
                      Collection {group.index}
                    </span>
                    <Icon
                      className="w-4 h-4 text-[#57534E] group-hover:text-[#56538A] transition-colors"
                      aria-hidden={true}
                    />
                  </div>

                  <h3 className="font-serif text-2xl text-[#242522] font-normal mt-4 mb-5">
                    {group.category}
                  </h3>

                  <ul
                    className={`grid gap-y-2.5 gap-x-6 ${
                      isWide ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                    }`}
                  >
                    {group.items.map((tech) => (
                      <li
                        key={tech}
                        className="flex items-center justify-between py-1.5 border-b border-[#242522]/8 text-sm text-[#242522]/90"
                      >
                        <span>{tech}</span>
                        <span
                          className="w-1.5 h-1.5 bg-[#B9C6D0] group-hover:bg-[#7774A9] transition-colors shrink-0"
                          aria-hidden="true"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
