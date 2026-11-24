export interface NavItem {
  id: string;
  number: string;
  label: string;
  navLabel: string;
  subtitle: string;
}

export interface TechGroup {
  id: string;
  index: string;
  category: string;
  items: string[];
}

export interface ExperienceItem {
  id: string;
  number: string;
  role: string;
  organization: string;
  duration: string;
  responsibilities: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
  cgpa: string;
}

export interface AchievementItem {
  id: string;
  number: string;
  metric: string;
  title: string;
  detail: string;
  platformOrContext: string;
}

export interface PublicationItem {
  id: string;
  accession: string;
  title: string;
  journal: string;
  date: string;
}

export interface SocialProfile {
  label: string;
  username: string;
  url: string;
  platform: 'linkedin' | 'github' | 'leetcode' | 'tryhackme';
}

export const MUSEUM_IDENTITY = {
  siteName: 'THE INFINITE MUSEUM',
  symbol: '∞',
  subtitle: 'A Digital Exhibition by Ria Gupta',
  ownerName: 'Ria Gupta',
  role: 'Full Stack Developer · Computer Science Engineering Student',
  tagline: 'Engineering ideas into reality.',
  philosophy: 'Build. Break. Learn. Repeat.',
  heroSupportingText:
    'Computer Science Engineering student exploring software development, cybersecurity, intelligent systems, and emerging technologies.',
  heroMetadata: [
    'BASED IN INDIA',
    'COMPUTER SCIENCE & ENGINEERING',
    'OPEN TO LEARNING AND BUILDING',
  ],
  resumePath: '/Ria_Gupta.pdf',
};

export const MUSEUM_NAV_ITEMS: NavItem[] = [
  { id: 'home', number: '01', label: 'HOME', navLabel: '01 — HOME', subtitle: 'The Grand Entrance' },
  { id: 'about', number: '02', label: 'ABOUT', navLabel: '02 — ABOUT', subtitle: 'The Story Behind the Work' },
  { id: 'exhibitions', number: '03', label: 'EXHIBITIONS', navLabel: '03 — EXHIBITIONS', subtitle: 'Curated Works' },
  { id: 'tech-stack', number: '04', label: 'TECH STACK', navLabel: '04 — TECH STACK', subtitle: 'The Engineering Toolkit' },
  { id: 'experience', number: '05', label: 'EXPERIENCE', navLabel: '05 — EXPERIENCE', subtitle: 'Professional Journey' },
  { id: 'achievements', number: '06', label: 'ACHIEVEMENTS', navLabel: '06 — ACHIEVEMENTS', subtitle: 'Milestones' },
  { id: 'education', number: '07', label: 'EDUCATION', navLabel: '07 — EDUCATION', subtitle: 'Academic Foundation' },
  { id: 'research', number: '08', label: 'RESEARCH', navLabel: '08 — RESEARCH', subtitle: 'Publications' },
  { id: 'contact', number: '09', label: 'CONTACT', navLabel: '09 — CONTACT', subtitle: 'The Final Room' },
];

export const ABOUT_CONTENT = {
  summary:
    'Computer Science Engineering student with hands-on experience in developing web applications, backend services, and data-driven solutions. Proficient in Java, C++, Python, JavaScript, and SQL, with a strong foundation in Data Structures and Algorithms, OOP, Operating Systems, Database Management Systems, and Computer Networks. Experienced in building REST APIs, database integration, AI/ML-driven data processing, and cloud deployment.',
  philosophy: 'Build. Break. Learn. Repeat.',
  processSteps: [
    {
      step: '01',
      title: 'Understand the problem.',
      note: 'Examine constraints, system context, and core requirements before writing code.',
    },
    {
      step: '02',
      title: 'Explore possible solutions.',
      note: 'Evaluate data structures, architectural patterns, and trade-offs across approaches.',
    },
    {
      step: '03',
      title: 'Design and develop.',
      note: 'Build modular interfaces, reliable APIs, and structured persistence layers.',
    },
    {
      step: '04',
      title: 'Test and improve.',
      note: 'Validate pipelines, run benchmarks, inspect edge cases, and refine execution.',
    },
    {
      step: '05',
      title: 'Learn and build again.',
      note: 'Carry every discovery forward into the next experiment in continuous creation.',
    },
  ],
};

export const TECH_STACK_GROUPS: TechGroup[] = [
  {
    id: 'languages',
    index: 'I',
    category: 'Programming Languages',
    items: ['Java', 'C++', 'Python', 'JavaScript', 'C'],
  },
  {
    id: 'core-cs',
    index: 'II',
    category: 'Core Computer Science',
    items: [
      'Data Structures and Algorithms',
      'Object-Oriented Programming',
      'Database Management Systems',
      'Operating Systems',
      'Computer Networks',
    ],
  },
  {
    id: 'frontend',
    index: 'III',
    category: 'Frontend Development',
    items: ['React', 'TypeScript', 'HTML5', 'CSS3', 'Bootstrap'],
  },
  {
    id: 'backend',
    index: 'IV',
    category: 'Backend & APIs',
    items: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs', 'MQTT', 'API Integration'],
  },
  {
    id: 'databases',
    index: 'V',
    category: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'MongoDB'],
  },
  {
    id: 'cloud',
    index: 'VI',
    category: 'Cloud & Infrastructure',
    items: ['AWS', 'Docker', 'Docker Compose', 'Linux', 'Vercel', 'Render'],
  },
  {
    id: 'testing',
    index: 'VII',
    category: 'Testing & Tools',
    items: ['Pytest', 'Locust', 'Git', 'GitHub', 'Wireshark'],
  },
];

export const EXPERIENCE_LIST: ExperienceItem[] = [
  {
    id: 'c3r',
    number: 'EXPERIENCE 01',
    role: 'Software Developer',
    organization: 'Center for CyberSecurity Research and Education (C3R)',
    duration: 'July 2026 – Present',
    responsibilities: [
      'Developing cloud-integrated synthetic security telemetry and validation workflows using AWS.',
      'Integrating OCSF-normalized logs with Wazuh/XDR pipelines to evaluate detection rules and alerts.',
    ],
  },
  {
    id: 'gdg',
    number: 'EXPERIENCE 02',
    role: 'CyberTech Member',
    organization: 'Google Developer Groups (GDG)',
    duration: 'October 2026 – Present',
    responsibilities: [
      'Supported technical events and developer-focused initiatives within the campus community.',
      'Collaborated with the CyberTech team to coordinate technical activities and knowledge-sharing sessions.',
    ],
  },
];

export const EDUCATION_RECORD: EducationItem = {
  degree: 'B.E. Computer Science Engineering',
  institution: 'Chitkara University, Punjab, India',
  duration: '2024 – Expected 2028',
  cgpa: '9.43',
};

export const ACHIEVEMENTS_LIST: AchievementItem[] = [
  {
    id: 'leetcode',
    number: '01',
    metric: '300+',
    title: 'LeetCode',
    platformOrContext: 'Algorithmic Problem Solving',
    detail:
      'Solved 300+ problems on LeetCode, covering data structures, algorithms, and diverse problem-solving patterns.',
  },
  {
    id: 'star-programmer',
    number: '02',
    metric: '35th',
    title: 'Star Programmer',
    platformOrContext: 'Among 200+ Students',
    detail: 'Ranked 35th among 200+ students in the Star Programmer coding competition.',
  },
  {
    id: 'sih',
    number: '03',
    metric: '2 Tracks',
    title: 'Smart India Hackathon',
    platformOrContext: 'Hardware & Software Internal Round',
    detail:
      'Cleared the Internal Round of Smart India Hackathon (SIH) in both Hardware and Software categories.',
  },
  {
    id: 'frontend-comp',
    number: '04',
    metric: 'Top 200',
    title: 'Frontend Project Competition',
    platformOrContext: 'Hackathon Round Qualifier',
    detail:
      'Achieved a Top 200 ranking in a Frontend Project Competition, advancing to the hackathon round.',
  },
  {
    id: 'tryhackme',
    number: '05',
    metric: 'Top 4%',
    title: 'TryHackMe',
    platformOrContext: '100+ Rooms · 20+ CTFs',
    detail: 'Ranked in the Top 4% on TryHackMe with 100+ completed rooms and 20+ completed CTFs.',
  },
];

export const PUBLICATIONS_LIST: PublicationItem[] = [
  {
    id: 'jetir-2023',
    accession: 'PUB. 2023.06',
    title:
      'Relation Between the Total Number of Reflections and the Value of the Angle of Incidence When Two Plane Mirrors Are Inclined at an Angle Theta',
    journal: 'Journal of Emerging Technologies and Innovative Research (JETIR)',
    date: 'June 2023',
  },
];

export const CONTACT_INFO = {
  heading: 'Every great idea begins with a conversation.',
  supportingText:
    "Have a project in mind, an opportunity to discuss, or an interesting problem to solve? Let's connect.",
  email: 'gupta.ria05@gmail.com',
  phone: '+91 7814731025',
  phoneHref: 'tel:+917814731025',
  socials: [
    {
      label: 'LinkedIn',
      username: 'ria-gupta-20r999',
      url: 'https://www.linkedin.com/in/ria-gupta-20r999',
      platform: 'linkedin',
    },
    {
      label: 'GitHub',
      username: 'riagupta240619',
      url: 'https://github.com/riagupta240619',
      platform: 'github',
    },
    {
      label: 'LeetCode',
      username: 'Ria_Gupta_29',
      url: 'https://leetcode.com/u/Ria_Gupta_29',
      platform: 'leetcode',
    },
    {
      label: 'TryHackMe',
      username: 'gupta.ria05',
      url: 'https://tryhackme.com/p/gupta.ria05',
      platform: 'tryhackme',
    },
  ] as SocialProfile[],
};
