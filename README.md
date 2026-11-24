# THE INFINITE MUSEUM ∞

**A Digital Exhibition by Ria Gupta**

*Engineering ideas into reality.*

An interactive 3D developer portfolio presenting software engineering, cybersecurity, cryptography, and research through a digital museum experience.

## Overview

The Infinite Museum blends a navigable WebGL exhibition with accessible portfolio content. Visitors can explore the 3D museum, inspect individual project exhibits, or move directly to sections using the museum directory.

**Build. Break. Learn. Repeat.**

## Features

- Immersive Three.js museum with interactive exhibits and camera controls
- Animated infinity-themed introduction with replay
- Guided scrolling and an optional 3D inspection/orbit mode
- Interactive project gallery, category filters, and detailed project views
- About, technical skills, experience, achievements, education, research, and contact sections
- Responsive navigation, keyboard-accessible controls, and reduced-motion support
- Resume dossier view and PDF download support when the PDF asset is supplied

## Exhibitions

| Project | Focus | Repository or demo |
| --- | --- | --- |
| Synthetic Log Generator | Security log generation, AI/ML, Wazuh SIEM | [GitHub](https://github.com/riagupta240619/Synthetic-Log-generator) |
| PQShield | Hybrid post-quantum cryptography, FastAPI, MQTT | [GitHub](https://github.com/riagupta240619/Hybrid-Post-Quantum-Cryptography) |
| Hospital Management System | Patient, appointment, and doctor workflows | [Demo](https://hospital-management-system-here.vercel.app) |

Project records are maintained in `src/data/projects.ts`. Other portfolio content lives in `src/data/portfolioData.ts`.

## Technology stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **3D:** Three.js
- **Animation:** Motion
- **Icons:** Lucide React

The repository also includes Google GenAI and Express dependencies and a sample environment file. Review whether those are needed for your deployment before configuring API secrets.

## Getting started

**Requirements:** Node.js version compatible with Vite 8, and npm (or Bun).

```bash
git clone https://github.com/riagupta240619/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open the local URL printed by Vite (the dev script defaults to port 3000).

### Production build

```bash
npm run build
npm run preview
```

The static production build is generated in `dist/`.

### Resume PDF

The original resume PDF is **not included in this repository**. To enable the actual PDF download, place your file at:

```text
public/Ria_Gupta.pdf
```

The portfolio expects the asset at `/Ria_Gupta.pdf`. Until the PDF is available, the website provides a printable resume dossier instead. Before making the site public, review any contact information in `src/data/portfolioData.ts`.

## Deploying to Vercel

1. Import this repository into a Vercel project.
2. Select **Vite** as the framework.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Deploy the `main` branch.
5. Add environment variables in Vercel only if runtime features actually require them; **never commit API keys**.

Vercel can automatically deploy subsequent pushes after the repository is linked.

## Project layout

```text
src/
  components/       Museum UI, navigation, exhibits, modals
  data/             Portfolio identity, achievements, projects
  three/            Three.js world, materials, sculptures
  App.tsx           Portfolio orchestration
  index.css         Styling
  main.tsx          Entry point
```

## Customize

- Edit `src/data/portfolioData.ts` for biography, experience, skills, achievements, education, and contact details.
- Edit `src/data/projects.ts` to add or modify project exhibits.
- Update components in `src/components/` and 3D scenes in `src/three/`.

## Author

**Ria Gupta** — Full Stack Developer · Computer Science Engineering Student

[GitHub](https://github.com/riagupta240619) · [LinkedIn](https://www.linkedin.com/in/ria-gupta-20r999)

---

*THE INFINITE MUSEUM ∞ — An infinite journey of ideas, engineering, and creation.*
