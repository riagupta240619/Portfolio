import React from 'react';
import type { ProjectExhibit } from '../data/projects';

interface ProjectVisualProps {
  visualType: ProjectExhibit['visualType'];
  title: string;
  compact?: boolean;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({
  visualType,
  title,
  compact = false,
}) => {
  if (visualType === 'synthetic-log') {
    return (
      <div
        className={`relative w-full h-full bg-[#242522] text-[#F4F1EB] flex flex-col justify-between overflow-hidden ${
          compact ? 'p-6 min-h-[240px]' : 'p-8 min-h-[300px]'
        }`}
        aria-label={`${title} architectural exhibition schematic`}
      >
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[#B9C6D0]">
          <span>Telemetry Schematic</span>
          <span>Wazuh SIEM</span>
        </div>

        {/* Minimalist Log Stream & Detection Rule Vector Plate */}
        <svg
          viewBox="0 0 360 150"
          className="w-full h-auto my-4"
          fill="none"
          aria-hidden="true"
        >
          {/* Left Source Nodes: LLM + ML + Scenario */}
          <rect x="12" y="20" width="76" height="28" stroke="#B9C6D0" strokeWidth="1" />
          <text x="50" y="38" textAnchor="middle" fill="#EBE7DF" fontSize="9" fontFamily="DM Mono, monospace">
            LLM ENGINE
          </text>

          <rect x="12" y="61" width="76" height="28" stroke="#7774A9" strokeWidth="1" />
          <text x="50" y="79" textAnchor="middle" fill="#EBE7DF" fontSize="9" fontFamily="DM Mono, monospace">
            ML MODELS
          </text>

          <rect x="12" y="102" width="76" height="28" stroke="#A8A29E" strokeWidth="1" />
          <text x="50" y="120" textAnchor="middle" fill="#EBE7DF" fontSize="9" fontFamily="DM Mono, monospace">
            SCENARIOS
          </text>

          {/* Converging Lines */}
          <path d="M88 34 L138 75" stroke="#B9C6D0" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M88 75 L138 75" stroke="#7774A9" strokeWidth="1.2" />
          <path d="M88 116 L138 75" stroke="#A8A29E" strokeWidth="1" strokeDasharray="3 3" />

          {/* Central Dataset & Visualization Hub */}
          <rect x="138" y="42" width="94" height="66" fill="#2F302C" stroke="#EBE7DF" strokeWidth="1.2" />
          <text x="185" y="64" textAnchor="middle" fill="#F4F1EB" fontSize="9" fontFamily="DM Mono, monospace">
            SYNTHETIC
          </text>
          <text x="185" y="78" textAnchor="middle" fill="#F4F1EB" fontSize="9" fontFamily="DM Mono, monospace">
            DATASET
          </text>
          <line x1="154" y1="90" x2="216" y2="90" stroke="#7774A9" strokeWidth="1.5" />
          <line x1="154" y1="96" x2="198" y2="96" stroke="#B9C6D0" strokeWidth="1" />

          {/* Forward Arrow to Wazuh SIEM */}
          <line x1="232" y1="75" x2="266" y2="75" stroke="#EBE7DF" strokeWidth="1.2" />
          <polygon points="264,71 271,75 264,79" fill="#EBE7DF" />

          {/* Wazuh Validation Target */}
          <rect x="272" y="47" width="76" height="56" stroke="#B9C6D0" strokeWidth="1.2" />
          <text x="310" y="71" textAnchor="middle" fill="#B9C6D0" fontSize="9" fontFamily="DM Mono, monospace">
            WAZUH
          </text>
          <text x="310" y="85" textAnchor="middle" fill="#EBE7DF" fontSize="8" fontFamily="DM Mono, monospace">
            VALIDATION
          </text>
        </svg>

        <div className="flex items-center justify-between pt-3 border-t border-[#F4F1EB]/12 font-mono text-[10px] tracking-[0.14em] text-[#A8A29E]">
          <span>React · TypeScript · Python</span>
          <span>Detection Testing</span>
        </div>
      </div>
    );
  }

  if (visualType === 'pqshield') {
    return (
      <div
        className={`relative w-full h-full bg-[#EBE7DF] text-[#242522] border border-[#242522]/12 flex flex-col justify-between overflow-hidden ${
          compact ? 'p-6 min-h-[240px]' : 'p-8 min-h-[300px]'
        }`}
        aria-label={`${title} cryptographic handshake schematic`}
      >
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E]">
          <span>Cryptographic Geometry</span>
          <span>Post-Quantum Hybrid</span>
        </div>

        {/* Geometric Lattice & Elliptic Curve Handshake Plate */}
        <svg
          viewBox="0 0 360 150"
          className="w-full h-auto my-4"
          fill="none"
          aria-hidden="true"
        >
          {/* Subtle Lattice Grid */}
          {[40, 75, 110].map((y) => (
            <line
              key={y}
              x1="20"
              y1={y}
              x2="340"
              y2={y}
              stroke="rgba(36, 37, 34, 0.08)"
              strokeWidth="1"
            />
          ))}
          {[70, 140, 210, 280].map((x) => (
            <line
              key={x}
              x1={x}
              y1="20"
              x2={x}
              y2="130"
              stroke="rgba(36, 37, 34, 0.08)"
              strokeWidth="1"
            />
          ))}

          {/* X25519 Classical Ring */}
          <circle cx="96" cy="75" r="38" stroke="#242522" strokeWidth="1.2" />
          <text x="96" y="72" textAnchor="middle" fill="#242522" fontSize="9.5" fontFamily="DM Mono, monospace">
            X25519
          </text>
          <text x="96" y="85" textAnchor="middle" fill="#57534E" fontSize="7.5" fontFamily="DM Mono, monospace">
            CLASSICAL
          </text>

          {/* ML-KEM-768 Lattice Ring */}
          <circle cx="152" cy="75" r="38" stroke="#56538A" strokeWidth="1.4" strokeDasharray="4 3" />
          <text x="158" y="72" textAnchor="middle" fill="#56538A" fontSize="9.5" fontFamily="DM Mono, monospace">
            ML-KEM-768
          </text>
          <text x="158" y="85" textAnchor="middle" fill="#57534E" fontSize="7.5" fontFamily="DM Mono, monospace">
            PQC KEM
          </text>

          {/* Hybrid Key Derivation Link */}
          <line x1="190" y1="75" x2="232" y2="75" stroke="#242522" strokeWidth="1.2" />
          <polygon points="230,71 237,75 230,79" fill="#242522" />

          {/* AES-256-GCM + MQTT Vault */}
          <rect x="238" y="41" width="106" height="68" fill="#FFFFFF" stroke="#242522" strokeWidth="1.2" />
          <text x="291" y="67" textAnchor="middle" fill="#242522" fontSize="9.5" fontFamily="DM Mono, monospace">
            AES-256-GCM
          </text>
          <line x1="252" y1="77" x2="330" y2="77" stroke="#B9C6D0" strokeWidth="1.2" />
          <text x="291" y="92" textAnchor="middle" fill="#57534E" fontSize="8" fontFamily="DM Mono, monospace">
            MQTT · REPLAY CHECK
          </text>
        </svg>

        <div className="flex items-center justify-between pt-3 border-t border-[#242522]/12 font-mono text-[10px] tracking-[0.14em] text-[#57534E]">
          <span>FastAPI · PostgreSQL · Docker</span>
          <span>Locust Benchmarked</span>
        </div>
      </div>
    );
  }

  if (visualType === 'hospital') {
    return (
      <div
        className={`relative w-full h-full bg-[#FFFFFF] text-[#242522] border border-[#242522]/12 flex flex-col justify-between overflow-hidden ${
          compact ? 'p-6 min-h-[240px]' : 'p-8 min-h-[300px]'
        }`}
        aria-label={`${title} application architecture preview`}
      >
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E]">
          <span>System Wireframe</span>
          <span>Clinical Workflow</span>
        </div>

        {/* Clean Wireframe Application Plate */}
        <svg
          viewBox="0 0 360 150"
          className="w-full h-auto my-4"
          fill="none"
          aria-hidden="true"
        >
          {/* Outer Window Frame */}
          <rect x="16" y="14" width="328" height="122" fill="#F4F1EB" stroke="#242522" strokeWidth="1" />
          <line x1="16" y1="34" x2="344" y2="34" stroke="#242522" strokeWidth="0.8" />
          <circle cx="28" cy="24" r="2.5" fill="#A8A29E" />
          <circle cx="38" cy="24" r="2.5" fill="#A8A29E" />
          <circle cx="48" cy="24" r="2.5" fill="#A8A29E" />

          {/* Left Navigation Column */}
          <rect x="24" y="42" width="74" height="86" fill="#FFFFFF" stroke="rgba(36,37,34,0.18)" strokeWidth="0.8" />
          <text x="32" y="58" fill="#242522" fontSize="8" fontFamily="DM Mono, monospace">PATIENTS</text>
          <text x="32" y="76" fill="#57534E" fontSize="8" fontFamily="DM Mono, monospace">DOCTORS</text>
          <text x="32" y="94" fill="#57534E" fontSize="8" fontFamily="DM Mono, monospace">SCHEDULE</text>
          <text x="32" y="112" fill="#56538A" fontSize="8" fontFamily="DM Mono, monospace">PHARMACY</text>

          {/* Main Clinical Panel */}
          <rect x="106" y="42" width="142" height="86" fill="#FFFFFF" stroke="rgba(36,37,34,0.18)" strokeWidth="0.8" />
          <text x="116" y="59" fill="#242522" fontSize="8.5" fontFamily="DM Mono, monospace">
            PATIENT RECORDS
          </text>
          <line x1="116" y1="68" x2="236" y2="68" stroke="#B9C6D0" strokeWidth="1.5" />
          <line x1="116" y1="82" x2="220" y2="82" stroke="rgba(36,37,34,0.2)" strokeWidth="1" />
          <line x1="116" y1="94" x2="205" y2="94" stroke="rgba(36,37,34,0.2)" strokeWidth="1" />
          <line x1="116" y1="106" x2="228" y2="106" stroke="rgba(36,37,34,0.2)" strokeWidth="1" />

          {/* Right API Integration Box */}
          <rect x="256" y="42" width="80" height="86" fill="#EBE7DF" stroke="rgba(36,37,34,0.2)" strokeWidth="0.8" />
          <text x="296" y="64" textAnchor="middle" fill="#242522" fontSize="8" fontFamily="DM Mono, monospace">
            REST API
          </text>
          <text x="296" y="84" textAnchor="middle" fill="#56538A" fontSize="7.5" fontFamily="DM Mono, monospace">
            PRESCRIPTION
          </text>
          <text x="296" y="96" textAnchor="middle" fill="#56538A" fontSize="7.5" fontFamily="DM Mono, monospace">
            VERIFY
          </text>
          <text x="296" y="114" textAnchor="middle" fill="#57534E" fontSize="7.5" fontFamily="DM Mono, monospace">
            ORDERING
          </text>
        </svg>

        <div className="flex items-center justify-between pt-3 border-t border-[#242522]/12 font-mono text-[10px] tracking-[0.14em] text-[#57534E]">
          <span>React · JavaScript · Node.js</span>
          <span>REST Integration</span>
        </div>
      </div>
    );
  }

  // Generic plate for future added projects (e.g., Embedded Systems / V2V)
  return (
    <div
      className={`relative w-full h-full bg-[#EBE7DF] text-[#242522] border border-[#242522]/12 flex flex-col justify-between p-8 ${
        compact ? 'min-h-[240px]' : 'min-h-[300px]'
      }`}
    >
      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#57534E]">
        Exhibition Plate
      </span>
      <p className="font-serif text-2xl text-[#242522]">{title}</p>
      <span className="font-mono text-[10px] tracking-[0.14em] text-[#57534E]">
        Archival Record
      </span>
    </div>
  );
};
