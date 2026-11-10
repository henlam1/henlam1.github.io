// ─────────────────────────────────────────────────────────────
//  THIS IS THE ONLY FILE YOU NEED TO EDIT.
//  Everything on the site is generated from the data below.
//  Replace anything marked TODO, save, and the page updates.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Henry Lam', // TODO
  // Shown under your name in the hero. Keep it to one punchy line.
  tagline: 'I build full-stack web apps, and I draw sometimes.',
  // Short paragraph for the About section. 2–4 sentences.
  about:
    'I’m a Master of Engineering student in Computer Science at Cornell Tech, after a B.S. in Computer Science from Stony Brook. I build full-stack web apps end to end, from auth and APIs to tests and deployment. Away from the keyboard, I make art and bake.',
  location: 'New York, NY',
  // One plain sentence under the tagline. Set to '' to hide it.
  status: 'Looking for full-time software engineering roles starting summer 2027.',
  // Your hand-lettered name, exported as a transparent PNG or SVG into public/art/.
  // Example: '/art/name.svg'. Until you add it, your name shows as text.
  lettering: '',
  // A photo of you for the About section, in public/art/.
  // Example: '/art/me.jpg'. Until you add it, a dashed box shows where it goes.
  photo: '',
  email: 'henry.lam.7369@gmail.com',
  // Put your resume PDF in the `public/` folder with this exact name,
  // or change the path. Set to '' to hide the button.
  resume: '/portfolio_resume.pdf',
  links: {
    github: 'https://github.com/henlam1',
    linkedin: 'https://www.linkedin.com/in/henry-lam-454173269/', // TODO
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
      'A trip packing-list app with AI packing suggestions that cut manual edits by about 35%. React Query caching cut redundant API calls by about 40%, and 100+ unit and end-to-end tests run in CI.',
    tech: [
      'TypeScript',
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'OpenAI API',
      'Jest',
      'Playwright',
      'AWS',
    ],
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
    title: 'Greenstand open source',
    description:
      'Fixed a site-wide bug on Greenstand’s public map of planted trees: opening a tree from a direct link stopped every other marker from showing data. Merged to production after code review with the maintainers.',
    tech: ['JavaScript', 'React', 'React-Leaflet', 'Next.js'],
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
    role: 'Software Developer',
    org: 'UnieLogics, early-stage startup',
    dates: 'Nov 2024 – Apr 2025',
    points: [
      'Replaced manual account creation with Google OAuth 2.0 single sign-on, removing signup steps and login friction.',
      'Built automated emails for password recovery and account verification, core account-management features.',
      'Refactored a legacy codebase to reduce technical debt and make future features simpler to build.',
    ],
  },
];

// Most recent first.
export const education: { degree: string; school: string; dates: string; note?: string }[] = [
  {
    degree: 'M.Eng. in Computer Science',
    school: 'Cornell Tech, Cornell University',
    dates: 'Expected May 2027',
  },
  {
    degree: 'B.S. in Computer Science',
    school: 'Stony Brook University',
    dates: '2020–2024',
    note: '3.7 GPA, magna cum laude',
  },
];

// Grouped skills. Only list things you'd be comfortable being asked about in an interview.
export const skills: Record<string, string[]> = {
  Languages: ['Python', 'TypeScript', 'JavaScript', 'Java'],
  Frontend: ['React', 'React Query', 'HTML/CSS'],
  Backend: ['Node.js', 'Express', 'REST APIs', 'MongoDB'],
  'Auth and security': ['OAuth 2.0', 'JWT', 'httpOnly cookies'],
  'Cloud and DevOps': ['AWS', 'Heroku', 'CI/CD', 'GitHub Actions'],
  Testing: ['Jest', 'Playwright', 'Selenium', 'Postman'],
};
