export type ProjectCategory =
  | 'Full Stack Development'
  | 'Cybersecurity'
  | 'AI & Machine Learning'
  | 'Embedded Systems & IoT'
  | 'Cryptography'
  | 'Backend Development';

export interface ProjectExhibit {
  id: string;
  number: string;
  title: string;
  fullTitle: string;
  categoryLabel: string;
  categories: ProjectCategory[];
  year: string;
  shortDescription: string;
  technologies: string[];
  visualType: 'synthetic-log' | 'pqshield' | 'hospital' | 'generic';
  visualCaption: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  details: {
    overview: string;
    problemStatement?: string;
    objective: string;
    keyFeatures: string[];
    technicalImplementation: string[];
    workflowSteps?: string[];
    learnings?: string[];
  };
}

/**
 * Structured exhibition catalog.
 * To add future projects (e.g., Embedded Systems & IoT or V2V autonomous vehicle projects),
 * append a new ProjectExhibit entry here. Filter tabs update automatically.
 */
export const PROJECTS_CATALOG: ProjectExhibit[] = [
  {
    id: 'synthetic-log-generator',
    number: 'PROJECT 01',
    title: 'Synthetic Log Generator',
    fullTitle: 'Synthetic Log Generator',
    categoryLabel: 'Cybersecurity · AI/ML · Full Stack Development',
    categories: ['Cybersecurity', 'AI & Machine Learning', 'Full Stack Development'],
    year: '2026',
    shortDescription:
      'Developed a platform to generate synthetic security logs using LLMs, ML models, and scenario-based workflows.',
    technologies: ['React', 'TypeScript', 'Python', 'AI/ML', 'Wazuh SIEM'],
    visualType: 'synthetic-log',
    visualCaption: 'Exhibition Schematic 01 — Modular Scenario Generation & Wazuh SIEM Validation Flow',
    githubUrl: 'https://github.com/riagupta240619/Synthetic-Log-generator',
    details: {
      overview:
        'A full-stack security data engineering platform designed to generate realistic, structured synthetic security logs using Large Language Models (LLMs), machine learning models, and scenario-based workflows for security monitoring and detection testing.',
      problemStatement:
        'Security monitoring and detection rules require varied, scenario-driven log datasets for validation, which can be difficult to assemble consistently for testing SIEM detection workflows.',
      objective:
        'Enable security engineers and researchers to generate, manage, inspect, and validate synthetic security log datasets against Wazuh SIEM detection workflows.',
      keyFeatures: [
        'Modular log generation workflows driven by LLMs, ML models, and scenario definitions.',
        'Dataset management and interactive log visualization for generated security datasets.',
        'Direct integration with Wazuh SIEM to validate generated logs and support security monitoring and detection testing.',
      ],
      technicalImplementation: [
        'Frontend interface built with React and TypeScript for configuring generation scenarios, browsing datasets, and visualizing log records.',
        'Python-based AI/ML generation pipelines orchestrating LLM and ML workflows.',
        'Wazuh SIEM integration pipeline for ingesting generated logs and verifying detection behavior.',
      ],
      workflowSteps: [
        'Select or configure a security scenario workflow.',
        'Generate synthetic log streams via Python AI/ML and LLM modules.',
        'Inspect and manage generated datasets in the React + TypeScript visualizer.',
        'Forward validated log output to Wazuh SIEM for monitoring and detection testing.',
      ],
    },
  },
  {
    id: 'pqshield',
    number: 'PROJECT 02',
    title: 'PQShield',
    fullTitle: 'PQShield: Hybrid Post-Quantum Security Platform',
    categoryLabel: 'Cybersecurity · Cryptography · Backend Development',
    categories: ['Cybersecurity', 'Cryptography', 'Backend Development'],
    year: '2026',
    shortDescription:
      'Developed hybrid encryption using X25519, ML-KEM-768, and AES-256-GCM for secure IoT data exchange.',
    technologies: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Docker'],
    visualType: 'pqshield',
    visualCaption: 'Exhibition Schematic 02 — X25519 + ML-KEM-768 Hybrid Key Exchange & MQTT Pipeline',
    githubUrl: 'https://github.com/riagupta240619/Hybrid-Post-Quantum-Cryptography',
    details: {
      overview:
        'PQShield is a hybrid post-quantum security platform combining classical elliptic-curve key exchange (X25519), post-quantum key encapsulation (ML-KEM-768), and authenticated symmetric encryption (AES-256-GCM) to protect IoT data exchange.',
      problemStatement:
        'IoT data pipelines require resilient key exchange and message protection mechanisms that integrate post-quantum cryptographic primitives alongside classical schemes while preserving practical service throughput.',
      objective:
        'Design, implement, and benchmark a containerized hybrid cryptographic architecture for authenticated IoT telemetry exchange.',
      keyFeatures: [
        'Hybrid cryptographic pipeline combining X25519, ML-KEM-768, and AES-256-GCM.',
        'FastAPI services and MQTT messaging pipelines with device authentication, replay checks, and audit logging.',
        'Performance benchmarking and scalability evaluation using Locust-based load testing.',
      ],
      technicalImplementation: [
        'Backend services implemented in Python with FastAPI, backed by PostgreSQL persistence for device records and audit logs.',
        'MQTT transport pipeline enforcing device authentication and replay protection checks.',
        'React frontend interface paired with Docker-based deployment and Locust load-testing harnesses.',
      ],
      workflowSteps: [
        'Device authenticates and establishes shared keys via hybrid X25519 + ML-KEM-768 exchange.',
        'Payload is encrypted with AES-256-GCM and transmitted across the MQTT pipeline.',
        'FastAPI verification layer performs replay checks and records audit logs in PostgreSQL.',
        'Benchmark suite and Locust load tests measure cryptographic performance and scalability.',
      ],
    },
  },
  {
    id: 'hospital-management-system',
    number: 'PROJECT 03',
    title: 'Hospital Management System',
    fullTitle: 'Hospital Management System',
    categoryLabel: 'Full Stack Development · Web Development',
    categories: ['Full Stack Development'],
    year: '2025',
    shortDescription:
      'Developed a full-stack web application to manage patient records, appointments, and doctor workflows.',
    technologies: ['React', 'JavaScript', 'Node.js', 'REST APIs'],
    visualType: 'hospital',
    visualCaption: 'Exhibition Schematic 03 — Clinical Records, Appointments & Pharmacy API Architecture',
    liveDemoUrl: 'https://hospital-management-system-here.vercel.app',
    details: {
      overview:
        'A full-stack web application built to coordinate patient records, appointment scheduling, and doctor workflows alongside prescription verification and online medicine ordering.',
      objective:
        'Streamline clinical coordination across patient registration, appointment management, doctor workflows, and pharmacy-related API integrations.',
      keyFeatures: [
        'Structured management of patient records, appointments, and doctor workflows.',
        'End-to-end frontend-backend integration for patient and appointment operations.',
        'API integrations supporting prescription verification and online medicine ordering.',
      ],
      technicalImplementation: [
        'React and JavaScript single-page client interface for clinical and patient workflows.',
        'Node.js backend exposing REST APIs for patient data, appointments, and external pharmacy verification/ordering workflows.',
      ],
      workflowSteps: [
        'Manage patient profiles and appointment bookings in the React interface.',
        'Coordinate doctor schedules and clinical updates through Node.js REST APIs.',
        'Verify prescriptions and handle online medicine ordering via integrated API endpoints.',
      ],
    },
  },
];

export const ALL_FILTER_ORDER: ProjectCategory[] = [
  'Full Stack Development',
  'Cybersecurity',
  'AI & Machine Learning',
  'Embedded Systems & IoT',
  'Cryptography',
  'Backend Development',
];

export function getPopulatedCategories(projects: ProjectExhibit[]): ProjectCategory[] {
  const present = new Set<ProjectCategory>();
  for (const project of projects) {
    for (const cat of project.categories) {
      present.add(cat);
    }
  }
  return ALL_FILTER_ORDER.filter((cat) => present.has(cat));
}
