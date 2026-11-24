import React from 'react';
import { motion } from 'motion/react';
import { PUBLICATIONS_LIST } from '../data/portfolioData';

export const PublicationsSection: React.FC = () => {
  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#F4F1EB]/90 border border-[#242522]/12 px-7 py-6">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[#57534E] mb-3">
              08 — Research
            </p>
            <h2
              id="research-heading"
              className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#242522]"
            >
              Research &amp; Publications
            </h2>
          </div>
          <span className="font-serif italic text-lg text-[#56538A]">
            Academic Monograph
          </span>
        </div>

        {/* Publication Exhibit */}
        <div className="pointer-events-auto mt-8 space-y-8">
          {PUBLICATIONS_LIST.map((pub) => (
            <motion.article
              key={pub.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="border border-[#242522]/14 bg-[#FFFFFF]/94 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Subtle Geometric Optics Plate */}
              <div className="lg:col-span-4 bg-[#EBE7DF]/55 border-b lg:border-b-0 lg:border-r border-[#242522]/12 p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E]">
                  <span>Optical Geometry</span>
                  <span>{pub.accession}</span>
                </div>

                <svg
                  viewBox="0 0 220 150"
                  className="w-full h-auto my-6"
                  fill="none"
                  aria-hidden="true"
                >
                  {/* Two Plane Mirrors Inclined at Angle Theta */}
                  <line x1="36" y1="124" x2="188" y2="124" stroke="#242522" strokeWidth="1.6" />
                  <line x1="36" y1="124" x2="152" y2="30" stroke="#242522" strokeWidth="1.6" />
                  {/* Angle Theta Arc */}
                  <path
                    d="M 74 124 A 38 38 0 0 0 65 100"
                    stroke="#56538A"
                    strokeWidth="1.2"
                  />
                  <text
                    x="81"
                    y="113"
                    fill="#56538A"
                    fontSize="11"
                    fontFamily="Cormorant Garamond, serif"
                    fontStyle="italic"
                  >
                    θ
                  </text>
                  {/* Incident & Reflected Ray Path */}
                  <polyline
                    points="178,44 122,55 138,124 88,82 98,124"
                    stroke="#7774A9"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                  />
                  <circle cx="122" cy="55" r="2.2" fill="#242522" />
                  <circle cx="138" cy="124" r="2.2" fill="#242522" />
                  <circle cx="88" cy="82" r="2.2" fill="#242522" />
                </svg>

                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#57534E]">
                  Plane Mirrors · Inclination θ
                </p>
              </div>

              {/* Publication Monograph Text */}
              <div className="lg:col-span-8 p-8 sm:p-12 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.14em] uppercase text-[#57534E]">
                    <span className="text-[#56538A] font-medium">Published Paper</span>
                    <span aria-hidden="true">·</span>
                    <span>{pub.date}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#242522] leading-[1.25] [text-wrap:balance]">
                    “{pub.title}”
                  </h3>
                </div>

                <dl className="pt-6 border-t border-[#242522]/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E] mb-1">
                      Journal
                    </dt>
                    <dd className="text-sm sm:text-[15px] text-[#242522] font-medium">
                      {pub.journal}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E] mb-1">
                      Publication Date
                    </dt>
                    <dd className="font-mono text-sm text-[#242522]">
                      {pub.date}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
