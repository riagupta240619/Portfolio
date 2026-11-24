import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Printer, Info } from 'lucide-react';
import {
  ABOUT_CONTENT,
  ACHIEVEMENTS_LIST,
  CONTACT_INFO,
  EDUCATION_RECORD,
  EXPERIENCE_LIST,
  MUSEUM_IDENTITY,
  PUBLICATIONS_LIST,
  TECH_STACK_GROUPS,
} from '../data/portfolioData';
import { PROJECTS_CATALOG } from '../data/projects';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [pdfAvailable, setPdfAvailable] = useState<boolean>(false);

  // Verify whether /Ria_Gupta.pdf actually exists as a PDF asset (not SPA HTML fallback)
  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    fetch(MUSEUM_IDENTITY.resumePath, { method: 'HEAD' })
      .then((res) => {
        if (!active) return;
        const contentType = res.headers.get('content-type') || '';
        setPdfAvailable(res.ok && contentType.toLowerCase().includes('pdf'));
      })
      .catch(() => {
        if (active) setPdfAvailable(false);
      });

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      active = false;
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="resume-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#242522]/75 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#FFFFFF] text-[#242522] border border-[#242522]/20 shadow-2xl"
          >
            {/* Modal Toolbar */}
            <div className="no-print sticky top-0 z-10 bg-[#F4F1EB] border-b border-[#242522]/12 px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E]">
                  Curriculum Vitae · Source of Truth
                </p>
                <h2 id="resume-modal-title" className="font-serif text-xl text-[#242522]">
                  {MUSEUM_IDENTITY.ownerName} — Resume Dossier
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                {pdfAvailable ? (
                  <a
                    href={MUSEUM_IDENTITY.resumePath}
                    download="Ria_Gupta.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors font-mono text-xs tracking-[0.12em] uppercase whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Download Ria_Gupta.pdf</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors font-mono text-xs tracking-[0.12em] uppercase whitespace-nowrap cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Print / Save as PDF</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close resume view"
                  className="inline-flex items-center justify-center w-9 h-9 border border-[#242522]/20 hover:bg-[#242522] hover:text-[#F4F1EB] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* PDF Placement Note when static PDF is not yet placed in public/ */}
            {!pdfAvailable && (
              <div className="no-print mx-6 sm:mx-8 mt-6 p-4 bg-[#F4F1EB] border border-[#242522]/12 flex items-start gap-3 text-xs leading-relaxed text-[#4A4843]">
                <Info className="w-4 h-4 text-[#56538A] shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <strong className="font-medium text-[#242522]">
                    Static PDF Asset Path:
                  </strong>{' '}
                  To serve your original file directly as a downloadable PDF, place{' '}
                  <code className="font-mono bg-[#EBE7DF] px-1.5 py-0.5">
                    Ria_Gupta.pdf
                  </code>{' '}
                  inside{' '}
                  <code className="font-mono bg-[#EBE7DF] px-1.5 py-0.5">
                    public/Ria_Gupta.pdf
                  </code>{' '}
                  (resolved at <code className="font-mono">/Ria_Gupta.pdf</code>).
                  Until then, you can inspect the complete verified dossier below
                  or use <strong>Print / Save as PDF</strong>.
                </p>
              </div>
            )}

            {/* Printable Resume Content */}
            <div className="p-6 sm:p-10 space-y-8 text-sm">
              <header className="pb-5 border-b border-[#242522]/20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h3 className="font-serif text-3xl text-[#242522]">
                    {MUSEUM_IDENTITY.ownerName}
                  </h3>
                  <p className="text-[#4A4843] mt-1">{MUSEUM_IDENTITY.role}</p>
                </div>
                <div className="font-mono text-xs text-[#4A4843] space-y-1 sm:text-right">
                  <p>{CONTACT_INFO.email}</p>
                  <p>{CONTACT_INFO.phone}</p>
                  <p>India</p>
                </div>
              </header>

              <section className="space-y-2">
                <h4 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                  Summary
                </h4>
                <p className="leading-relaxed text-[#242522]/90">
                  {ABOUT_CONTENT.summary}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                  Education
                </h4>
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-medium text-[#242522]">
                      {EDUCATION_RECORD.degree}
                    </p>
                    <p className="text-[#4A4843]">
                      {EDUCATION_RECORD.institution}
                    </p>
                  </div>
                  <div className="font-mono text-xs text-right text-[#4A4843]">
                    <p>{EDUCATION_RECORD.duration}</p>
                    <p>CGPA: {EDUCATION_RECORD.cgpa}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                  Experience
                </h4>
                {EXPERIENCE_LIST.map((exp) => (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="flex flex-wrap justify-between gap-2">
                      <p className="font-medium text-[#242522]">
                        {exp.role} — {exp.organization}
                      </p>
                      <span className="font-mono text-xs text-[#4A4843]">
                        {exp.duration}
                      </span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-[#4A4843]">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section className="space-y-4">
                <h4 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                  Projects
                </h4>
                {PROJECTS_CATALOG.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex flex-wrap justify-between gap-2">
                      <p className="font-medium text-[#242522]">
                        {proj.fullTitle}
                      </p>
                      <span className="font-mono text-xs text-[#4A4843]">
                        {proj.year} · {proj.technologies.join(', ')}
                      </span>
                    </div>
                    <p className="text-[#4A4843]">{proj.shortDescription}</p>
                    <ul className="list-disc pl-5 space-y-1 text-[#4A4843]">
                      {proj.details.keyFeatures.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                  Technical Skills
                </h4>
                <div className="space-y-1.5 text-[#4A4843]">
                  {TECH_STACK_GROUPS.map((group) => (
                    <p key={group.id}>
                      <strong className="text-[#242522] font-medium">
                        {group.category}:
                      </strong>{' '}
                      {group.items.join(', ')}
                    </p>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                  Achievements
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-[#4A4843]">
                  {ACHIEVEMENTS_LIST.map((ach) => (
                    <li key={ach.id}>{ach.detail}</li>
                  ))}
                </ul>
              </section>

              <section className="space-y-1">
                <h4 className="font-mono text-xs tracking-[0.16em] uppercase text-[#56538A]">
                  Publication
                </h4>
                {PUBLICATIONS_LIST.map((pub) => (
                  <p key={pub.id} className="text-[#4A4843]">
                    “{pub.title}” — {pub.journal}, {pub.date}.
                  </p>
                ))}
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
