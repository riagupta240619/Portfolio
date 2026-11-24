import React, { useState } from 'react';
import {
  Mail,
  Phone,
  ArrowUpRight,
  Download,
  Copy,
  Check,
  Send,
  Info,
} from 'lucide-react';
import { CONTACT_INFO } from '../data/portfolioData';
import { InfinityLogo } from './InfinityLogo';

interface ContactSectionProps {
  onOpenResume: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenResume,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [preparedNotice, setPreparedNotice] = useState(false);

  const buildMailtoHref = () => {
    const finalSubject = subject.trim() || `Inquiry from ${name.trim() || 'Portfolio Visitor'}`;
    const bodyLines = [
      name.trim() ? `Name: ${name.trim()}` : '',
      email.trim() ? `Reply Email: ${email.trim()}` : '',
      '',
      message.trim(),
    ]
      .filter((line, idx, arr) => line !== '' || (idx > 0 && arr[idx - 1] !== ''))
      .join('\n');

    return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(
      finalSubject
    )}&body=${encodeURIComponent(bodyLines)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreparedNotice(true);
  };

  const handleCopyMessage = async () => {
    const text = `To: ${CONTACT_INFO.email}\nSubject: ${
      subject.trim() || 'Portfolio Inquiry'
    }\nFrom: ${name.trim()} (${email.trim()})\n\n${message.trim()}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API may be restricted in some environments
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28 pointer-events-none"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="pointer-events-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-[#F4F1EB]/92 border border-[#242522]/12 px-7 py-6">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] uppercase text-[#57534E] mb-3">
              09 — Contact
            </p>
            <h2
              id="contact-heading"
              className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#242522] [text-wrap:balance]"
            >
              {CONTACT_INFO.heading}
            </h2>
          </div>
          <span className="font-serif italic text-lg text-[#56538A] shrink-0">
            The Final Room
          </span>
        </div>

        <div className="pointer-events-auto mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Direct Channels, Socials & Resume Download */}
          <div className="lg:col-span-5 space-y-10 bg-[#F4F1EB]/92 border border-[#242522]/12 p-7 sm:p-9">
            <p className="text-base sm:text-[17px] leading-[1.75] text-[#4A4843]">
              {CONTACT_INFO.supportingText}
            </p>

            {/* Direct Email & Phone */}
            <div className="space-y-4 border-y border-[#242522]/12 py-6">
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="group flex items-center justify-between py-2 text-[#242522] hover:text-[#56538A] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#56538A] shrink-0" aria-hidden="true" />
                  <span className="text-sm sm:text-base font-medium">
                    {CONTACT_INFO.email}
                  </span>
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </a>

              <a
                href={CONTACT_INFO.phoneHref}
                className="group flex items-center justify-between py-2 text-[#242522] hover:text-[#56538A] transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#56538A] shrink-0" aria-hidden="true" />
                  <span className="font-mono text-sm sm:text-base tabular-figures">
                    {CONTACT_INFO.phone}
                  </span>
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </a>
            </div>

            {/* Social Directory */}
            <div className="space-y-3">
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#57534E]">
                Developer Profiles
              </p>
              <ul className="divide-y divide-[#242522]/10 border-b border-[#242522]/10">
                {CONTACT_INFO.socials.map((profile) => (
                  <li key={profile.platform}>
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-3 text-sm text-[#242522] hover:text-[#56538A] transition-colors"
                    >
                      <span className="font-medium">{profile.label}</span>
                      <span className="flex items-center gap-2 font-mono text-xs text-[#57534E] group-hover:text-[#56538A]">
                        <span>{profile.username}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prominent Download Resume CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenResume}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors duration-200 font-mono text-xs tracking-[0.16em] uppercase whitespace-nowrap cursor-pointer"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download Resume</span>
              </button>
            </div>
          </div>

          {/* Right Column: Honest Frontend-Only Contact Form */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#242522]/12 p-7 sm:p-10">
            <div className="flex items-start gap-3 p-4 mb-7 bg-[#F4F1EB] border border-[#242522]/12 text-xs leading-relaxed text-[#4A4843]">
              <Info className="w-4 h-4 text-[#56538A] shrink-0 mt-0.5" aria-hidden="true" />
              <p>
                <strong className="font-medium text-[#242522]">
                  Frontend Demo Notice:
                </strong>{' '}
                No backend mail server is connected to this static portfolio.
                Submitting prepares a draft you can send directly via your email
                app or copy to your clipboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-[11px] tracking-[0.14em] uppercase text-[#57534E] mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setPreparedNotice(false);
                    }}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-[#F4F1EB]/60 border border-[#242522]/18 text-sm text-[#242522] placeholder:text-[#A8A29E] focus:border-[#56538A] focus:bg-[#FFFFFF] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-[11px] tracking-[0.14em] uppercase text-[#57534E] mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setPreparedNotice(false);
                    }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-[#F4F1EB]/60 border border-[#242522]/18 text-sm text-[#242522] placeholder:text-[#A8A29E] focus:border-[#56538A] focus:bg-[#FFFFFF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block font-mono text-[11px] tracking-[0.14em] uppercase text-[#57534E] mb-2"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setPreparedNotice(false);
                  }}
                  placeholder="Opportunity, collaboration, or engineering inquiry"
                  className="w-full px-4 py-3 bg-[#F4F1EB]/60 border border-[#242522]/18 text-sm text-[#242522] placeholder:text-[#A8A29E] focus:border-[#56538A] focus:bg-[#FFFFFF] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-[11px] tracking-[0.14em] uppercase text-[#57534E] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setPreparedNotice(false);
                  }}
                  placeholder="Write your message..."
                  className="w-full px-4 py-3 bg-[#F4F1EB]/60 border border-[#242522]/18 text-sm text-[#242522] placeholder:text-[#A8A29E] focus:border-[#56538A] focus:bg-[#FFFFFF] transition-colors resize-y"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#242522] text-[#F4F1EB] hover:bg-[#56538A] transition-colors font-mono text-xs tracking-[0.14em] uppercase whitespace-nowrap cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Prepare Message</span>
                </button>

                {preparedNotice && (
                  <>
                    <a
                      href={buildMailtoHref()}
                      className="inline-flex items-center gap-2 px-5 py-3 border border-[#56538A] text-[#56538A] hover:bg-[#56538A] hover:text-white transition-colors font-mono text-xs tracking-[0.14em] uppercase whitespace-nowrap"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Open in Mail App</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-2 px-4 py-3 border border-[#242522]/25 text-[#242522] hover:bg-[#F4F1EB] transition-colors font-mono text-xs tracking-[0.14em] uppercase whitespace-nowrap cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#56538A]" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              {preparedNotice && (
                <p className="text-xs text-[#56538A] pt-1">
                  Draft ready (frontend demo only — choose “Open in Mail App” or
                  “Copy Text” above to send to {CONTACT_INFO.email}).
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Visual Closing Infinity Sculpture */}
        <div className="pointer-events-auto mt-14 bg-[#F4F1EB]/92 border border-[#242522]/12 px-8 py-12 flex flex-col items-center justify-center text-center space-y-4">
          <InfinityLogo
            className="w-24 h-11"
            strokeColor="#242522"
            accentColor="#7774A9"
            strokeWidth={1.8}
            animateOrb
          />
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#57534E]">
            End of Current Exhibition · Continuous Learning Ahead
          </p>
        </div>
      </div>
    </section>
  );
};
