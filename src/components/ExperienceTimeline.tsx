import React from 'react';
import { motion } from 'motion/react';
import { EXPERIENCE_LIST } from '../data/portfolioData';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#F4F1EB]/90 border border-[#242522]/12 px-7 py-6">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[#57534E] mb-3">
              05 — Experience
            </p>
            <h2
              id="experience-heading"
              className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#242522]"
            >
              Professional Journey
            </h2>
          </div>
          <span className="font-serif italic text-lg text-[#56538A]">
            Chronological Record
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="pointer-events-auto mt-10 relative pl-6 sm:pl-10 border-l border-[#242522]/25 space-y-10">
          {EXPERIENCE_LIST.map((exp, idx) => (
            <motion.article
              key={exp.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative bg-[#FFFFFF] border border-[#242522]/12 p-7 sm:p-10"
            >
              {/* Timeline Axis Node */}
              <span
                aria-hidden="true"
                className="absolute -left-[29px] sm:-left-[45px] top-9 w-2.5 h-2.5 bg-[#242522] ring-4 ring-[#EBE7DF]"
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                {/* Left Metadata Column */}
                <div className="lg:col-span-4 space-y-2 pb-5 lg:pb-0 border-b lg:border-b-0 lg:border-r border-[#242522]/10 lg:pr-6">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#56538A]">
                    {exp.number}
                  </p>
                  <p className="font-mono text-xs text-[#57534E] tabular-figures">
                    {exp.duration}
                  </p>
                  <p className="text-sm font-medium text-[#242522] pt-2">
                    {exp.organization}
                  </p>
                </div>

                {/* Right Role & Responsibilities */}
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="font-serif text-3xl text-[#242522] font-normal">
                    {exp.role}
                  </h3>

                  <ul className="space-y-3">
                    {exp.responsibilities.map((item, rIdx) => (
                      <li
                        key={rIdx}
                        className="flex items-start gap-3 text-[15px] leading-[1.7] text-[#4A4843]"
                      >
                        <span
                          className="font-mono text-xs text-[#7774A9] mt-1 shrink-0"
                          aria-hidden="true"
                        >
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
