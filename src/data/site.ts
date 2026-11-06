// ─────────────────────────────────────────────────────────────
//  THIS IS THE ONLY FILE YOU NEED TO EDIT.
//  Everything on the site is generated from the data below.
//  Replace anything marked TODO, save, and the page updates.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Your Name', // TODO
  // Shown under your name in the hero. Keep it to one punchy line.
  tagline: 'Software engineer who ships things people actually use.', // TODO
  // Short paragraph for the About section. 2–4 sentences.
  about:
    'I’m a CS student at Cornell University who likes building full-stack products end to end, from the database schema to the last hover state. Lately I’ve been focused on TODO. I care about clean interfaces, fast software, and code my teammates enjoy reading.', // TODO
  location: 'Ithaca, NY', // TODO
  // One plain sentence under the tagline. Set to '' to hide it.
  status: 'Looking for software engineering internships for summer 2027.', // TODO
  // Your hand-lettered name, exported as a transparent PNG or SVG into public/art/.
  // Example: '/art/name.svg'. Until you add it, your name shows as text.
  lettering: '',
  // A photo of you for the About section, in public/art/.
  // Example: '/art/me.jpg'. Until you add it, a dashed box shows where it goes.
  photo: '',
  email: 'you@example.com', // TODO
  // Put your resume PDF in the `public/` folder with this exact name,
  // or change the path. Set to '' to hide the button.
  resume: '/resume.pdf',
  links: {
    github: 'https://github.com/henlam1',
    linkedin: 'https://www.linkedin.com/in/YOUR-HANDLE', // TODO
  },
};

export type Project = {
  title: string;
  // One or two short sentences: what it does, plus the most impressive concrete detail.
  description: string;
  tech: string[];
  repo?: string; // GitHub link. Leave out for private repos.
  repoLabel?: string; // Button text for the repo link. Defaults to 'GitHub'.
  live?: string; // Live demo link
  liveLabel?: string; // Button text for the live link. Defaults to 'Live demo'.
  note?: string; // Shown instead of the GitHub button, e.g. 'Private repo'
  year: string;
};

// Order matters: put your strongest project first.
export const projects: Project[] = [
  {
    title: 'GoPack',
    description:
      'A trip packing-list app that suggests what to bring for each trip. React Query caching cut redundant API calls by 40%, and 100+ unit and end-to-end tests run in CI.',
    tech: ['TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'React Query', 'Jest', 'Playwright', 'GitHub Actions'],
    repo: 'https://github.com/henlam1/GoPack',
    live: 'https://gopack-client.onrender.com',
    year: '2024–25',
  },
  {
    title: 'Wait or Switch',
    description:
      'Tells NYC commuters whether to wait for the N train or switch to the D, using live MTA feeds and a database of past arrival times.',
    tech: ['Python', 'PostgreSQL', 'Flyway', 'Docker', 'pandas', 'GTFS-realtime'],
    note: 'Private repo, in progress',
    year: '2026',
  },
  {
    title: 'Treetracker web map',
    description:
      'Open-source contributions to Greenstand’s public map of planted trees. Three merged fixes, including keeping URL state in sync as people pan the map and switch between tokens.',
    tech: ['JavaScript', 'React', 'Next.js', 'Material UI', 'Leaflet'],
    repo: 'https://github.com/Greenstand/treetracker-web-map-client/pulls?q=is%3Apr+author%3Ahenlam1+is%3Amerged',
    repoLabel: 'Merged PRs',
    live: 'https://map.treetracker.org',
    liveLabel: 'Live site',
    year: '2023',
  },
  {
    title: 'Decaf compiler',
    description:
      'Course project with a partner: a compiler for Decaf, a small Java-like language, from lexing and parsing through type checking to code generation for an abstract machine.',
    tech: ['Python', 'PLY'],
    repo: 'https://github.com/henlam1/Decaf-Compiler',
    year: '2024',
  },
  {
    title: 'MNIST Digit Identifier',
    description:
      'Course project with a partner: built linear classifiers, k-nearest neighbors, and a neural network from scratch in NumPy to recognize handwritten digits, then compared their accuracy.',
    tech: ['Python', 'NumPy', 'Matplotlib', 'Jupyter'],
    repo: 'https://github.com/henlam1/MNIST-Digit-Identifier',
    year: '2024',
  },
];

export type ArtPiece = {
  title: string;
  src: string; // image in public/art/, e.g. '/art/swan.jpg'
  caption?: string; // e.g. 'Pen and ink, 2025'
  credit?: string; // for studies, e.g. 'Study after [artist name]'
  // Show this piece in the homepage viewer. Pick 3–5 that look good as characters and pixels:
  // high-contrast ink drawings and pixel sprites convert better than photos.
  featured?: boolean;
};

// Everything here appears in the Personal tab under Projects; featured pieces also appear
// in the homepage viewer. Drawings, digital pieces, pixel art, bakes: anything you've made.
export const art: ArtPiece[] = [
  {
    title: 'Shark (stand-in)',
    src: '/art/stand-in.svg',
    caption: 'Placeholder until you add your own pieces',
    featured: true,
  },
];

export type Experience = {
  role: string;
  org: string;
  dates: string;
  points: string[];
};

// Internships, research, TA positions, club leadership. Most recent first.
export const experience: Experience[] = [
  {
    role: 'Software Engineering Intern',
    org: 'Company Name',
    dates: 'Jun – Aug 2026',
    points: [
      'Shipped a feature that did X, measured by Y. TODO',
      'Owned a service end to end, from design doc to on-call. TODO',
    ],
  },
  {
    role: 'Teaching Assistant, CS 2110',
    org: 'Cornell University',
    dates: 'Jan 2026 – Present',
    points: ['Led weekly sections for 30 students and held office hours. TODO'],
  },
];

export const education = {
  school: 'Cornell University', // TODO
  degree: 'B.S. Computer Science', // TODO
  dates: 'Expected May 2028', // TODO
  coursework: ['Data Structures', 'Algorithms', 'Systems Programming', 'Databases'], // TODO
};

// Grouped skills. Only list things you'd be comfortable being asked about in an interview.
export const skills: Record<string, string[]> = {
  Languages: ['TypeScript', 'Python', 'Java', 'C', 'SQL'],
  Frontend: ['React', 'Astro', 'HTML/CSS', 'Tailwind'],
  Backend: ['Node.js', 'FastAPI', 'PostgreSQL', 'Redis'],
  Tools: ['Git', 'Docker', 'AWS', 'Linux'],
};
