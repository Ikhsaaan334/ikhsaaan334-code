export const profile = {
  name: 'Muhammad Ikhsan Nur Rafid',
  shortName: 'Ikhsan Nur Rafid',
  role: 'Aspiring backend engineer',
  intro:
    'Backend engineering student at BINUS University. I build REST APIs and the services around them, mostly in Go and Laravel.',
  status: 'Closed to offers',
  location: 'Bandung, Indonesia',
  email: 'muhammad.rafid001@binus.ac.id',
  github: 'https://github.com/Ikhsaaan334',
  linkedin: 'https://www.linkedin.com/in/muhammad-ikhsan-nur-rafid-4b33aa326/',
  cv: '/assets/CV-Muhammad-Ikhsan-Nur-Rafid.pdf',
};

export const about = {
  heading: 'I like the part users never see.',
  paragraphs: [
    "I'm Muhammad Ikhsan Nur Rafid, a Computer Science undergraduate at BINUS University with a strong interest in backend engineering: designing REST APIs, managing databases, and building services that can be relied on.",
    'I particularly enjoy Go. Its syntax and approach feel close to C, the language I grew up learning programming with, while being far more practical for building real backends. I also have practical experience in penetration testing, which shapes how I build secure web services, and I bring AI agents into my development workflow to move faster.',
  ],
  facts: [
    { label: 'Focus', value: 'Backend services, security testing' },
    { label: 'Studying', value: 'Undergraduate Student Computer Science, BINUS University' },
    { label: 'Based in', value: 'Bandung, Indonesia' },
    { label: 'Status', value: 'Closed to offers for now' },
  ],
};

export const journey = [
  {
    kind: 'education',
    org: 'BINUS University',
    title: 'Undergraduate Student Computer Science',
    period: 'Sep 2024 to Apr 2028',
    text: 'I chose Computer Science to strengthen my software engineering fundamentals, and spend most of my time building web apps and APIs with Laravel, Go and databases.',
  },
  {
    kind: 'org',
    org: 'Majelis Taklim Al-Khawarizmi, BINUS Bandung',
    title: 'Secretary',
    period: 'Jan 2026 to Jan 2027',
    text: 'I lead administration and coordination for the campus organisation.',
  },
  {
    kind: 'org',
    org: 'Majelis Taklim Al-Khawarizmi, BINUS Bandung',
    title: 'Media activist',
    period: 'Jan 2025 to Jan 2026',
    text: 'I contributed to campus media, which sharpened how I manage, write and work in a team.',
  },
];

export const stack = [
  {
    group: 'Languages',
    items: [
      { name: 'Go', src: '/logos/go.svg' },
      { name: 'PHP', src: '/logos/php.svg' },
      { name: 'Python', src: '/logos/python.svg' },
      { name: 'JavaScript', src: '/logos/javascript.svg' },
      { name: 'TypeScript', src: '/logos/typescript.svg' },
    ],
  },
  {
    group: 'Frameworks and runtime',
    items: [
      { name: 'Laravel', src: '/logos/laravel.svg' },
      { name: 'Node.js', src: '/logos/nodejs.svg' },
      { name: 'React', src: '/logos/react.svg' },
    ],
  },
  {
    group: 'Data and tooling',
    items: [
      { name: 'MySQL', src: '/logos/mysql.svg' },
      { name: 'PostgreSQL', src: '/logos/postgresql.svg' },
      { name: 'Docker', src: '/logos/docker.svg' },
      { name: 'Git', src: '/logos/git.svg' },
    ],
  },
];

export type Project = {
  id: string;
  title: string;
  blurb: string;
  stack: string[];
  repo: string;
  demo?: string;
  status?: string;
  cover?: { ground: 'cyan' | 'stage' | 'canvas'; mark: string; markAlt: string };
};

// Every entry maps to a public repository. Blurbs only state what its README says.
export const projects: Project[] = [
  {
    id: 'hydrasec',
    title: 'HydraSec',
    blurb:
      'Scanner that runs six security tools against a website you own, each in its own isolated container, and merges the findings into one report.',
    stack: ['Express', 'BullMQ', 'Redis', 'PostgreSQL', 'Docker'],
    repo: 'https://github.com/Ikhsaaan334/hydrasec',
    cover: { ground: 'stage', mark: '/logos/docker.svg', markAlt: 'Docker' },
  },
  {
    id: 'kodekita',
    title: 'KodeKita',
    blurb:
      'Platform for learning to code in Indonesian. Lessons in seven languages, challenges with hidden tests, and a judge that runs the code in a sandbox.',
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Docker'],
    repo: 'https://github.com/Ikhsaaan334/Kodekita',
    // No demo link: the Vercel deployment listed on the repository no longer exists (DEPLOYMENT_NOT_FOUND, Nov 2026).
    cover: { ground: 'cyan', mark: '/logos/react.svg', markAlt: 'React' },
  },
  {
    id: 'techstore',
    title: 'TechStore',
    blurb:
      'Online store built to learn Go: a modular monolith REST API on SQLite with JWT login, a checkout flow and HTML invoices, plus a vanilla JavaScript front end.',
    stack: ['Go', 'SQLite', 'JWT', 'JavaScript'],
    repo: 'https://github.com/Ikhsaaan334/ecommerce-Go',
    cover: { ground: 'canvas', mark: '/logos/go.svg', markAlt: 'Go' },
  },
  {
    id: 'skycast',
    title: 'SkyCast Pro',
    blurb:
      'Weather service split in two: a Laravel JSON API with token login and user roles, and a separate Vue single-page app that calls it.',
    stack: ['Laravel', 'MySQL', 'Vue 3', 'Pinia'],
    repo: 'https://github.com/Ikhsaaan334/weatherinformation-app',
    cover: { ground: 'stage', mark: '/logos/laravel.svg', markAlt: 'Laravel' },
  },
  {
    id: 'mql-docs',
    title: 'MQL Docs',
    blurb:
      'Searchable reference for MQL4 and MQL5, the languages behind MetaTrader scripts. Side-by-side differences, migration mappings and pitfalls with fixed code.',
    stack: ['Vite', 'TypeScript', 'Shiki'],
    repo: 'https://github.com/Ikhsaaan334/mqldocs',
    demo: 'https://mqldocs.vercel.app',
    cover: { ground: 'cyan', mark: '/logos/javascript.svg', markAlt: 'JavaScript' },
  },
  {
    id: 'schale-os',
    title: 'SCHALE.OS Music Player',
    blurb:
      'Self-hosted web music player with a Blue Archive theme. It streams YouTube audio without ads, imports local files and keeps playlists in a local database.',
    stack: ['Next.js', 'Drizzle', 'SQLite', 'FFmpeg', 'Docker'],
    repo: 'https://github.com/Ikhsaaan334/MusicPlayer',
    cover: { ground: 'canvas', mark: '/logos/nodejs.svg', markAlt: 'Node.js' },
  },
  {
    id: 'senseis-desk',
    title: "Sensei's Desk",
    blurb:
      'Personal blog with a Blue Archive theme. Laravel and React are joined by Inertia, with a rich text editor and music that keeps playing between pages.',
    stack: ['Laravel 12', 'React 19', 'Inertia.js', 'Tiptap'],
    repo: 'https://github.com/Ikhsaaan334/sensei-desk',
  },
  {
    id: 'isitreal',
    title: 'IsItReal',
    blurb:
      'Web app that checks images and videos for deepfakes. YOLOv8 finds the faces, then an EfficientNet model looks for blending artefacts.',
    stack: ['Python', 'PyTorch', 'YOLOv8', 'Express'],
    repo: 'https://github.com/Ikhsaaan334/Deepfake-Detector',
  },
  {
    id: 'neural-fuzzy',
    title: 'Adaptive Neural Fuzzy Forwarding',
    blurb:
      'Simulation for a research paper on packet forwarding in vehicular named-data networks. It compares four forwarding strategies at three vehicle speeds.',
    stack: ['C++', 'Python', 'ndnSIM', 'ns-3'],
    repo: 'https://github.com/Ikhsaaan334/Adaptive-Neural-Fuzzy-Based-Forwarding-Strategy',
    status: 'In publication',
  },
  {
    id: 'security-writeup',
    title: 'Security Research Write-Up',
    blurb:
      'Responsible disclosure of four flaws in an industrial asset management platform: a leaked client secret, stored XSS, wildcard CORS and an information leak.',
    stack: ['Disclosure', 'XSS', 'CORS'],
    repo: 'https://github.com/Ikhsaaan334/Security-Research-WriteUp-March2026',
    status: 'Disclosed to the vendor',
  },
  {
    id: 'lux-ai-bot',
    title: 'Lux AI Discord Bot',
    blurb:
      "Discord bot that answers questions through the Gemini API, built for the Ashura Heaven server. It splits long replies at Discord's 2,000 character limit.",
    stack: ['Python', 'discord.py', 'Gemini API'],
    repo: 'https://github.com/Ikhsaaan334/lux-ai-discord-bot',
  },
  {
    id: 'lux-ai-web',
    title: 'Lux AI Landing Page',
    blurb: 'Landing page for the Lux AI bot: what it does, a chat example, and links to invite the bot.',
    stack: ['HTML', 'Tailwind CSS'],
    repo: 'https://github.com/Ikhsaaan334/luxai-web',
    // No demo link: the Vercel deployment listed on the repository no longer exists (DEPLOYMENT_NOT_FOUND, Nov 2026).
  },
  {
    id: 'asl-translator',
    title: 'ASL Alphabet Translator',
    blurb:
      'CNN that reads American Sign Language letters from an image or a webcam feed, trained on 87,000 images across 29 classes.',
    stack: ['Python', 'TensorFlow', 'CUDA'],
    repo: 'https://github.com/Ikhsaaan334/ASL-Alphabet-Translator-Model',
  },
  {
    id: 'todo-list',
    title: 'To-Do List',
    blurb: 'To-do list web app built as the mid-project for a backend development course at BNCC.',
    stack: ['PHP'],
    repo: 'https://github.com/Ikhsaaan334/ToDo-List-',
  },
];

export const featuredProjects = projects.filter(project => project.cover);
export const moreProjects = projects.filter(project => !project.cover);

export const certifications = [
  {
    title: 'Certificate of Appreciation, Capture The Flag',
    org: 'COMPFEST 18',
    date: 'Oct 2026',
    text: 'Participant recognition in the Capture The Flag competition at COMPFEST, Universitas Indonesia.',
    pdf: '/assets/certs/compfest-ctf.pdf',
    href: undefined,
    logo: '/logos/cert-compfest.webp',
  },
  {
    title: 'Google Cloud Computing Foundations',
    org: 'Google',
    date: 'Jun 2026',
    text: 'Core cloud concepts: computing, storage and infrastructure on Google Cloud.',
    pdf: undefined,
    href: 'https://www.credly.com/badges/c327e973-34ba-48e2-a103-c82176b11683/linked_in_profile',
    logo: '/logos/cert-googlecloud.svg',
  },
  {
    title: 'UXvidia, Certificate of Participation',
    org: 'ARKAVIDIA 9.0',
    date: 'May 2025',
    text: 'UI/UX research and design competition.',
    pdf: '/assets/certs/arkavidia-uxvidia.pdf',
    href: undefined,
    logo: '/logos/cert-arkavidia.svg',
  },
  {
    title: 'Cyber Security 2025: How AI and ChatGPT Are Shaping Digital Defense',
    org: 'BINUS Online',
    date: 'Mar 2025',
    text: 'How AI is used in digital defense today.',
    pdf: '/assets/certs/binus-cybersec-ai.pdf',
    href: undefined,
    logo: '/logos/cert-binus.svg',
  },
  {
    title: 'Introduction to Cybersecurity',
    org: 'Cisco',
    date: 'Jan 2025',
    text: 'Technical foundations of cybersecurity, based on the Cisco curriculum.',
    pdf: undefined,
    href: 'https://www.credly.com/badges/0cc71c7c-2fef-4266-91dc-08de6c45c6e4/linked_in_profile',
    logo: '/logos/cert-cisco.svg',
  },
];

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'stack', label: 'Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'certs', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
];
