import React from 'react';
import { motion } from 'motion/react';
import { ACHIEVEMENTS_LIST } from '../data/portfolioData';

export const AchievementsSection: React.FC = () => {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
      className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#F4F1EB]/90 border border-[#242522]/12 px-7 py-6">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[#57534E] mb-3">
              06 — Achievements
            </p>
            <h2
              id="achievements-heading"
              className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#242522]"
            >
              Milestones
            </h2>
          </div>
          <span className="font-serif italic text-lg text-[#56538A]">
            Verified Honors & Benchmarks
          </span>
        </div>

        {/* Milestones Gallery Grid */}
        <div className="pointer-events-auto mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ACHIEVEMENTS_LIST.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`group border border-[#242522]/14 bg-[#FFFFFF]/92 hover:bg-[#FFFFFF] hover:border-[#242522]/35 transition-colors duration-200 p-8 flex flex-col justify-between ${
                idx === 0 ? 'md:col-span-2 xl:col-span-1' : ''
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.16em] uppercase text-[#57534E]">
                  <span>Milestone {item.number}</span>
                  <span>{item.platformOrContext}</span>
                </div>

                {/* Large Editorial Numeral */}
                <p className="font-serif text-5xl sm:text-6xl font-normal text-[#242522] tracking-tight tabular-figures group-hover:text-[#56538A] transition-colors">
                  {item.metric}
                </p>

                <div className="pt-4 border-t border-[#242522]/10 space-y-2">
                  <h3 className="font-serif text-2xl text-[#242522] font-normal">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-[1.7] text-[#4A4843]">
                    {item.detail}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
