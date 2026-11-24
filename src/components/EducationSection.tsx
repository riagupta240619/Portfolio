import React from 'react';
import { motion } from 'motion/react';
import { EDUCATION_RECORD } from '../data/portfolioData';

export const EducationSection: React.FC = () => {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#F4F1EB]/90 border border-[#242522]/12 px-7 py-6">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[#57534E] mb-3">
              07 — Education
            </p>
            <h2
              id="education-heading"
              className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#242522]"
            >
              Academic Foundation
            </h2>
          </div>
          <span className="font-serif italic text-lg text-[#56538A]">
            Undergraduate Studies
          </span>
        </div>

        {/* Academic Ledger Record */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto mt-8 bg-[#FFFFFF]/94 border border-[#242522]/12 p-8 sm:p-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 space-y-1.5">
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#56538A]">
                Academic Period
              </p>
              <p className="font-mono text-sm text-[#242522] tabular-figures">
                {EDUCATION_RECORD.duration}
              </p>
            </div>

            <div className="lg:col-span-6 space-y-2 lg:border-x border-[#242522]/10 lg:px-8">
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]">
                {EDUCATION_RECORD.degree}
              </h3>
              <p className="text-base text-[#4A4843]">
                {EDUCATION_RECORD.institution}
              </p>
            </div>

            <div className="lg:col-span-3 lg:text-right space-y-1">
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#57534E]">
                Cumulative GPA
              </p>
              <p className="font-mono text-xl text-[#242522] tabular-figures">
                {EDUCATION_RECORD.cgpa}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
