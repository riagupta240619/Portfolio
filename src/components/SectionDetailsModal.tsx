import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  ArrowUpRight,
  Download,
  FileText,
} from 'lucide-react';
import {
  ABOUT_CONTENT,
  ACHIEVEMENTS_LIST,
  CONTACT_INFO,
  EDUCATION_RECORD,
  EXPERIENCE_LIST,
  MUSEUM_IDENTITY,
  MUSEUM_NAV_ITEMS,
  PUBLICATIONS_LIST,
  TECH_STACK_GROUPS,
} from '../data/portfolioData';
import { PROJECTS_CATALOG, type ProjectExhibit } from '../data/projects';

const MODAL_SECTION_ORDER = [
  'home',
  'about',
  'exhibitions',
  'tech-stack',
  'experience',
  'achievements',
  'education',
  'research',
  'contact',
] as const;

interface SectionDetailsModalProps {
  sectionId: string | null;
  onClose: () => void;
  onSelectSection: (sectionId: string) => void;
  onOpenResume: () => void;
  onJumpToExhibitions: () => void;
  onSelectProject: (project: ProjectExhibit) => void;
}

export const SectionDetailsModal: React.FC<SectionDetailsModalProps> = ({
  sectionId,
  onClose,
  onSelectSection,
  onOpenResume,
  onJumpToExhibitions,
  onSelectProject,
}) => {
  useEffect(() => {
    if (!sectionId) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sectionId, onClose]);

  const navMeta = sectionId
    ? MUSEUM_NAV_ITEMS.find((item) => item.id === sectionId)
    : undefined;

  const orderIndex = sectionId
    ? MODAL_SECTION_ORDER.indexOf(sectionId as (typeof MODAL_SECTION_ORDER)[number])
    : -1;
  const prevId = orderIndex > 0 ? MODAL_SECTION_ORDER[orderIndex - 1] : null;
  const nextId =
    orderIndex >= 0 && orderIndex < MODAL_SECTION_ORDER.length - 1
      ? MODAL_SECTION_ORDER[orderIndex + 1]
      : null;

  const prevMeta = prevId
    ? MUSEUM_NAV_ITEMS.find((item) => item.id === prevId)
    : undefined;
  const nextMeta = nextId
    ? MUSEUM_NAV_ITEMS.find((item) => item.id === nextId)
    : undefined;

  return (
    <AnimatePresence>
      {sectionId && navMeta && (
        <motion.div
          key="section-detail-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="section-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#242522]/75 flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-y-auto"
        >
          <motion.div
            key={sectionId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#F4F1EB] text-[#242522] border border-[#242522]/20 shadow-2xl"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-[#F4F1EB] border-b border-[#242522]/12 px-6 sm:px-10 py-4 flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] tracking-[0.16em] uppercase text-[#57534E]">
                <span className="text-[#56538A] font-medium">{navMeta.navLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{navMeta.subtitle}</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close room exhibit"
                className="inline-flex items-center justify-center w-10 h-10 border border-[#242522]/20 text-[#242522] hover:bg-[#242522] hover:text-[#F4F1EB] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-10 space-y-8">
              {sectionId === 'home' && (
                <div className="space-y-6">
                  <p className="font-serif italic text-2xl text-[#56538A]">
                    {MUSEUM_IDENTITY.subtitle}
                  </p>
                  <h2
                    id="section-modal-title"
                    className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#242522]"
                  >
                    {MUSEUM_IDENTITY.siteName} {MUSEUM_IDENTITY.symbol}
                  </h2>
                  <p className="font-serif text-2xl text-[#242522]/90">
                    {MUSEUM_IDENTITY.tagline}
                  </p>
                  <p className="text-base leading-[1.75] text-[#4A4843] max-w-2xl">
                    {MUSEUM_IDENTITY.heroSupportingText}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.14em] uppercase text-[#57534E] pt-2 border-t border-[#242522]/12">
                    {MUSEUM_IDENTITY.heroMetadata.map((item, idx) => (
                      <React.Fragment key={item}>
                        {idx > 0 && <span aria-hidden="true">·</span>}
                        <span>{item}</span>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onJumpToExhibitions();
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors font-mono text-xs tracking-[0.14em] uppercase cursor-pointer"
                    >
                      <span>Explore Project Wing</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenResume();
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 border border-[#242522]/30 text-[#242522] hover:bg-[#EBE7DF] transition-colors font-mono text-xs tracking-[0.14em] uppercase cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>View Resume</span>
                    </button>
                  </div>
                </div>
              )}

              {sectionId === 'about' && (
                <div className="space-y-8">
                  <h2
                    id="section-modal-title"
                    className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]"
                  >
                    The Story Behind the Work
                  </h2>
                  <p className="text-base leading-[1.85] text-[#242522]/90 first-letter:text-5xl first-letter:font-serif first-letter:font-medium first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none">
                    {ABOUT_CONTENT.summary}
                  </p>
                  <blockquote className="py-5 border-y border-[#242522]/14">
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E] mb-2">
                      Core Philosophy
                    </p>
                    <p className="font-serif italic text-3xl text-[#242522]">
                      {ABOUT_CONTENT.philosophy}
                    </p>
                  </blockquote>
                  <div className="space-y-4">
                    <p className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                      Engineering Approach
                    </p>
                    <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ABOUT_CONTENT.processSteps.map((step) => (
                        <li
                          key={step.step}
                          className="bg-[#FFFFFF] border border-[#242522]/12 p-5 space-y-1.5"
                        >
                          <span className="font-mono text-xs text-[#56538A] tabular-figures">
                            {step.step}
                          </span>
                          <h3 className="font-serif text-xl text-[#242522]">
                            {step.title}
                          </h3>
                          <p className="text-sm text-[#4A4843] leading-relaxed">
                            {step.note}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {sectionId === 'exhibitions' && (
                <div className="space-y-7">
                  <div className="space-y-3">
                    <h2
                      id="section-modal-title"
                      className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]"
                    >
                      The Main Exhibition Gallery
                    </h2>
                    <p className="text-base leading-[1.75] text-[#4A4843] max-w-2xl">
                      Three flagship engineering works curated in this wing—inspect
                      any exhibit below or click its individual 3D pedestal in the room.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {PROJECTS_CATALOG.map((proj) => (
                      <article
                        key={proj.id}
                        className="bg-[#FFFFFF] border border-[#242522]/12 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[10px] tracking-[0.16em] uppercase text-[#57534E]">
                            <span className="text-[#56538A] font-medium">{proj.number}</span>
                            <span aria-hidden="true">·</span>
                            <span>{proj.categoryLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-figures">{proj.year}</span>
                          </div>
                          <h3 className="font-serif text-2xl text-[#242522]">
                            {proj.fullTitle}
                          </h3>
                          <p className="text-sm leading-relaxed text-[#4A4843] max-w-xl">
                            {proj.shortDescription}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectProject(proj)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors font-mono text-[11px] tracking-[0.14em] uppercase whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
                        >
                          <span>Inspect Exhibit</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {sectionId === 'tech-stack' && (
                <div className="space-y-7">
                  <h2
                    id="section-modal-title"
                    className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]"
                  >
                    The Engineering Toolkit
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {TECH_STACK_GROUPS.map((group) => (
                      <div
                        key={group.id}
                        className="bg-[#FFFFFF] border border-[#242522]/12 p-6 space-y-3"
                      >
                        <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#56538A]">
                          Collection {group.index}
                        </p>
                        <h3 className="font-serif text-2xl text-[#242522]">
                          {group.category}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#4A4843]">
                          {group.items.join(' · ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sectionId === 'experience' && (
                <div className="space-y-7">
                  <h2
                    id="section-modal-title"
                    className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]"
                  >
                    Professional Journey
                  </h2>
                  <div className="space-y-5">
                    {EXPERIENCE_LIST.map((exp) => (
                      <article
                        key={exp.id}
                        className="bg-[#FFFFFF] border border-[#242522]/12 p-6 sm:p-8 space-y-4"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3 border-b border-[#242522]/10">
                          <div>
                            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#56538A]">
                              {exp.number}
                            </p>
                            <h3 className="font-serif text-2xl sm:text-3xl text-[#242522] mt-1">
                              {exp.role}
                            </h3>
                            <p className="text-sm font-medium text-[#4A4843]">
                              {exp.organization}
                            </p>
                          </div>
                          <span className="font-mono text-xs text-[#57534E] tabular-figures">
                            {exp.duration}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {exp.responsibilities.map((r, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-[#4A4843] leading-relaxed">
                              <span className="font-mono text-xs text-[#7774A9] mt-0.5">—</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {sectionId === 'achievements' && (
                <div className="space-y-7">
                  <h2
                    id="section-modal-title"
                    className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]"
                  >
                    Milestones
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {ACHIEVEMENTS_LIST.map((ach) => (
                      <article
                        key={ach.id}
                        className="bg-[#FFFFFF] border border-[#242522]/12 p-6 space-y-3"
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] uppercase text-[#57534E]">
                          <span>Milestone {ach.number}</span>
                          <span>{ach.platformOrContext}</span>
                        </div>
                        <p className="font-serif text-4xl text-[#56538A] tabular-figures">
                          {ach.metric}
                        </p>
                        <h3 className="font-serif text-2xl text-[#242522]">
                          {ach.title}
                        </h3>
                        <p className="text-sm text-[#4A4843] leading-relaxed">
                          {ach.detail}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {sectionId === 'education' && (
                <div className="space-y-7">
                  <h2
                    id="section-modal-title"
                    className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]"
                  >
                    Academic Foundation
                  </h2>
                  <div className="bg-[#FFFFFF] border border-[#242522]/12 p-8 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#242522]/10">
                      <span className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                        {EDUCATION_RECORD.duration}
                      </span>
                      <span className="font-mono text-sm text-[#242522] tabular-figures">
                        CGPA: {EDUCATION_RECORD.cgpa}
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl text-[#242522]">
                      {EDUCATION_RECORD.degree}
                    </h3>
                    <p className="text-base text-[#4A4843]">
                      {EDUCATION_RECORD.institution}
                    </p>
                  </div>
                </div>
              )}

              {sectionId === 'research' && (
                <div className="space-y-7">
                  <h2
                    id="section-modal-title"
                    className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]"
                  >
                    Research &amp; Publications
                  </h2>
                  {PUBLICATIONS_LIST.map((pub) => (
                    <article
                      key={pub.id}
                      className="bg-[#FFFFFF] border border-[#242522]/12 p-8 space-y-6"
                    >
                      <div className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.14em] uppercase text-[#57534E]">
                        <span className="text-[#56538A]">{pub.accession}</span>
                        <span aria-hidden="true">·</span>
                        <span>{pub.date}</span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#242522] leading-snug">
                        “{pub.title}”
                      </h3>
                      <div className="pt-4 border-t border-[#242522]/10">
                        <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#57534E] mb-1">
                          Journal
                        </p>
                        <p className="text-base font-medium text-[#242522]">
                          {pub.journal}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {sectionId === 'contact' && (
                <div className="space-y-7">
                  <h2
                    id="section-modal-title"
                    className="font-serif text-3xl sm:text-4xl font-normal text-[#242522]"
                  >
                    {CONTACT_INFO.heading}
                  </h2>
                  <p className="text-base text-[#4A4843] leading-relaxed">
                    {CONTACT_INFO.supportingText}
                  </p>
                  <div className="bg-[#FFFFFF] border border-[#242522]/12 divide-y divide-[#242522]/10">
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="flex items-center justify-between p-5 hover:bg-[#F4F1EB] transition-colors"
                    >
                      <span className="flex items-center gap-3 text-sm sm:text-base font-medium">
                        <Mail className="w-4 h-4 text-[#56538A]" aria-hidden="true" />
                        <span>{CONTACT_INFO.email}</span>
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#57534E]" aria-hidden="true" />
                    </a>
                    <a
                      href={CONTACT_INFO.phoneHref}
                      className="flex items-center justify-between p-5 hover:bg-[#F4F1EB] transition-colors"
                    >
                      <span className="flex items-center gap-3 font-mono text-sm sm:text-base tabular-figures">
                        <Phone className="w-4 h-4 text-[#56538A]" aria-hidden="true" />
                        <span>{CONTACT_INFO.phone}</span>
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#57534E]" aria-hidden="true" />
                    </a>
                    {CONTACT_INFO.socials.map((s) => (
                      <a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-5 hover:bg-[#F4F1EB] transition-colors text-sm"
                      >
                        <span className="font-medium">{s.label}</span>
                        <span className="flex items-center gap-2 font-mono text-xs text-[#57534E]">
                          <span>{s.username}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </span>
                      </a>
                    ))}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenResume();
                      }}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors font-mono text-xs tracking-[0.14em] uppercase cursor-pointer"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>Download Resume</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Room Modal Navigation Footer */}
              <div className="pt-6 border-t border-[#242522]/12 flex items-center justify-between gap-4">
                {prevId && prevMeta ? (
                  <button
                    type="button"
                    onClick={() => onSelectSection(prevId)}
                    className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#57534E] hover:text-[#242522] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    <span>{prevMeta.label}</span>
                  </button>
                ) : (
                  <span />
                )}

                {nextId && nextMeta ? (
                  <button
                    type="button"
                    onClick={() => onSelectSection(nextId)}
                    className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] uppercase text-[#57534E] hover:text-[#242522] transition-colors cursor-pointer"
                  >
                    <span>{nextMeta.label}</span>
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
