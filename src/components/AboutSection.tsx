import React from 'react';
import { motion } from 'motion/react';
import { ABOUT_CONTENT } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 bg-[#F4F1EB]/90 border border-[#242522]/12 px-7 py-6">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[#57534E] mb-3">
              02 — About
            </p>
            <h2
              id="about-heading"
              className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#242522]"
            >
              The Story Behind the Work
            </h2>
          </div>
          <span className="font-serif italic text-lg text-[#56538A]">
            Curatorial Statement
          </span>
        </div>

        {/* Asymmetric 2-Column Editorial Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Resume Narrative + Philosophy Pull Quote */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto lg:col-span-6 space-y-10 bg-[#F4F1EB]/92 border border-[#242522]/12 p-7 sm:p-10"
          >
            <p className="max-w-prose text-base sm:text-[17px] leading-[1.85] text-[#242522]/90 first-letter:text-5xl first-letter:font-serif first-letter:font-medium first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:leading-none first-letter:text-[#242522]">
              {ABOUT_CONTENT.summary}
            </p>

            {/* Editorial Pull Quote (top & bottom hairline dividers, no left accent stripe) */}
            <blockquote className="py-7 border-y border-[#242522]/16">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#57534E] mb-3">
                Core Philosophy
              </p>
              <p className="font-serif italic text-3xl sm:text-4xl text-[#242522] tracking-tight">
                {ABOUT_CONTENT.philosophy}
              </p>
            </blockquote>
          </motion.div>

          {/* Right Column: Iterative Engineering Process */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto lg:col-span-6 bg-[#EBE7DF]/94 border border-[#242522]/12 p-7 sm:p-10"
          >
            <div className="flex items-center justify-between pb-5 border-b border-[#242522]/12">
              <span className="font-mono text-xs tracking-[0.16em] uppercase text-[#57534E]">
                Approach to Engineering
              </span>
              <span className="font-mono text-xs text-[#56538A] tabular-figures">
                Continuous Cycle ∞
              </span>
            </div>

            <ol className="divide-y divide-[#242522]/10 mt-2">
              {ABOUT_CONTENT.processSteps.map((item) => (
                <li key={item.step} className="py-5 first:pt-6 last:pb-2 flex gap-5">
                  <span className="font-mono text-xs text-[#56538A] pt-1 tabular-figures shrink-0">
                    {item.step}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl sm:text-2xl text-[#242522] font-normal">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#4A4843]">
                      {item.note}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
