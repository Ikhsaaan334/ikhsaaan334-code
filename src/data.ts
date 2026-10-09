export const profile = {
  name: "Muhammad Ikhsan Nur Rafid",
  shortName: "Ikhsan",
  role: "Aspiring Backend Engineer",
  tagline: "API & Web Services",
  heroSub:
    "I build structured, scalable, and maintainable backends: REST APIs, databases, and reliable services with Laravel, Go, Node.js, and cloud.",
  email: "muhammad.rafid001@binus.ac.id",
  github: "https://github.com/Ikhsaaan334",
  linkedin: "https://www.linkedin.com/in/muhammad-ikhsan-nur-rafid-4b33aa326/",
  cv: "/assets/CV-Muhammad-Ikhsan-Nur-Rafid.pdf",
  photo: "/assets/foto.jpeg",
  location: "Bandung, Indonesia",
};

export const aboutBio = [
  "Hi! I'm Muhammad Ikhsan Nur Rafid, an undergraduate Computer Science student at BINUS University with a strong interest in backend engineering: designing REST APIs, managing databases, and building services that can be relied on.",
  "I particularly enjoy Go: its syntax and approach feel close to C, the language I grew up learning programming with, while being far more practical for building backends and real-world applications. Beyond that, I have practical experience in penetration testing for building secure web services, and I integrate AI agents into my development workflow for efficiency.",
];

export const stats = [
  { value: 9, suffix: "+", label: "Projects Built" },
  { value: 5, suffix: "", label: "Certifications" },
  { value: 12, suffix: "+", label: "Technologies Used" },
  { value: 2, suffix: "", label: "Campus Organizations" },
];

export const journey = [
  {
    kind: "education",
    org: "BINUS University",
    title: "B.Sc. Computer Science",
    period: "Sep 2024 – Apr 2028",
    text: "Chose Computer Science to strengthen my software engineering fundamentals. Actively building web apps and APIs with Laravel, Go, and databases.",
    current: true,
    gpa: "GPA 3.40 / 4.00",
  },
  {
    kind: "experience",
    org: "Majelis Taklim Al-Khawarizmi, BINUS Bandung",
    title: "Secretary",
    period: "Jan 2026 – Jan 2027",
    text: "Leading administration and coordination for the campus organization.",
    current: false,
    gpa: "",
  },
  {
    kind: "experience",
    org: "Majelis Taklim Al-Khawarizmi, BINUS Bandung",
    title: "Media Activist",
    period: "Jan 2025 – Jan 2026",
    text: "Contributed actively to campus media: sharpening management, content, and teamwork skills.",
    current: false,
    gpa: "",
  },
];

export const techLogos = [
  { src: "/logos/laravel.svg", alt: "Laravel" },
  { src: "/logos/go.svg", alt: "Go" },
  { src: "/logos/php.svg", alt: "PHP" },
  { src: "/logos/nodejs.svg", alt: "Node.js" },
  { src: "/logos/python.svg", alt: "Python" },
  { src: "/logos/javascript.svg", alt: "JavaScript" },
  { src: "/logos/typescript.svg", alt: "TypeScript" },
  { src: "/logos/react.svg", alt: "React" },
  { src: "/logos/mysql.svg", alt: "MySQL" },
  { src: "/logos/postgresql.svg", alt: "PostgreSQL" },
  { src: "/logos/docker.svg", alt: "Docker" },
  { src: "/logos/git.svg", alt: "Git" },
];

export const projects = [
  {
    id: 1,
    title: "E-Commerce Backend",
    description:
      "Modular Go REST API structured with handler-service-repository patterns: JWT auth, bcrypt, transaction-safe SQLite, and a checkout pipeline with order state management and HTML invoicing.",
    tags: ["Go", "REST API", "JWT", "SQLite"],
    date: "Sep 2026",
    href: "https://github.com/Ikhsaaan334/ecommerce-Go",
    icon: "cart",
  },
  {
    id: 2,
    title: "Kodekita",
    description:
      "Indonesian-language interactive coding-learning SaaS: 7 programming languages, 706 curated materials, and a real code-execution judge running in isolated sandboxes.",
    tags: ["SaaS", "E-Learning", "Code Judge"],
    date: "",
    href: "https://github.com/Ikhsaaan334/Kodekita",
    icon: "code",
  },
  {
    id: 3,
    title: "Deepfake Detection System",
    description:
      "Comparative analysis of object detection algorithms to identify manipulated media: a trained YOLOv8 computer vision model deployed as a web app on Hugging Face Spaces.",
    tags: ["Python", "YOLOv8", "Computer Vision"],
    date: "Jun 2026",
    href: undefined,
    icon: "face",
  },
  {
    id: 4,
    title: "Security Research Write-Up",
    description:
      "Independent vulnerability research on a live production system. Findings were responsibly disclosed to the vendor via email, as no public bug bounty program exists.",
    tags: ["Security", "Vulnerability Research", "Disclosure"],
    date: "Mar 2026",
    href: "https://github.com/Ikhsaaan334/Security-Research-WriteUp-March2026",
    icon: "shieldAlert",
  },
  {
    id: 5,
    title: "Adaptive Neural Fuzzy Forwarding Strategy",
    description:
      "Research on an adaptive neural fuzzy-based forwarding strategy for intelligent network packet forwarding: the paper is currently in the publication process.",
    tags: ["Research", "Neural Networks", "Fuzzy Logic"],
    date: "In Progress",
    href: "https://github.com/Ikhsaaan334/Adaptive-Neural-Fuzzy-Based-Forwarding-Strategy",
    icon: "brain",
  },
  {
    id: 6,
    title: "Sensei's Desk",
    description:
      "Custom personal blogging platform with a distinct Blue Archive-inspired visual theme: Laravel 12 backend with a React + Inertia.js single-page frontend.",
    tags: ["Laravel 12", "React", "Inertia.js"],
    date: "Jan 2026",
    href: "https://github.com/Ikhsaaan334/sensei-desk",
    icon: "book",
  },
  {
    id: 7,
    title: "Weather Information App",
    description:
      "Full-stack real-time weather app: BMKG API integrated into Laravel, processed into optimized JSON endpoints, with a reactive Vue.js + Inertia frontend.",
    tags: ["Laravel", "Vue.js", "BMKG API"],
    date: "Jun 2026",
    href: "https://github.com/Ikhsaaan334/weatherinformation-app",
    icon: "cloud",
  },
  {
    id: 8,
    title: "Lux AI Discord Bot",
    description:
      "Interactive Discord bot that answers user queries and boosts server engagement, powered by the Gemini API for context-aware conversational responses.",
    tags: ["Python", "Gemini API", "Discord"],
    date: "Jun 2025",
    href: "https://github.com/Ikhsaaan334/lux-ai-discord-bot",
    icon: "bot",
  },
  {
    id: 9,
    title: "ASL Translator Model",
    description:
      "Machine learning model that translates the ASL alphabet, with potential to grow into an API service.",
    tags: ["Python", "ML", "Computer Vision"],
    date: "2025",
    href: "https://github.com/Ikhsaaan334/ASL-Alphabet-Translator-Model",
    icon: "sign",
  },
];

export const certifications = [
  {
    title: "Certificate of Appreciation · Capture The Flag",
    org: "COMPFEST 18",
    date: "Oct 2026",
    text: "Participant recognition in the Capture The Flag competition at COMPFEST, Universitas Indonesia.",
    pdf: "/assets/certs/compfest-ctf.pdf",
    href: undefined,
    logo: "/logos/cert-compfest.webp",
    color: "#0ea5e9",
  },
  {
    title: "Google Cloud Computing Foundations",
    org: "Google",
    date: "Jun 2026",
    text: "Foundational certificate covering core cloud concepts: computing, storage, and infrastructure on Google Cloud.",
    pdf: undefined,
    href: "https://www.credly.com/badges/c327e973-34ba-48e2-a103-c82176b11683/linked_in_profile",
    logo: "/logos/cert-googlecloud.svg",
    color: "#4285f4",
  },
  {
    title: "UXvidia · Certificate of Participation",
    org: "ARKAVIDIA 9.0",
    date: "May 2025",
    text: "UI/UX research and design competition participation.",
    pdf: "/assets/certs/arkavidia-uxvidia.pdf",
    href: undefined,
    logo: "/logos/cert-arkavidia.svg",
    color: "#eb4924",
  },
  {
    title: "Cyber Security 2025: How AI & ChatGPT Are Shaping Digital Defense",
    org: "BINUS Online",
    date: "Mar 2025",
    text: "How AI is implemented in the current digital defense ecosystem.",
    pdf: "/assets/certs/binus-cybersec-ai.pdf",
    href: undefined,
    logo: "/logos/cert-binus.svg",
    color: "#2f83b9",
  },
  {
    title: "Introduction to Cybersecurity",
    org: "Cisco",
    date: "Jan 2025",
    text: "Technical foundations and industry fundamentals of cybersecurity, based on the Cisco curriculum.",
    pdf: undefined,
    href: "https://www.credly.com/badges/0cc71c7c-2fef-4266-91dc-08de6c45c6e4/linked_in_profile",
    logo: "/logos/cert-cisco.svg",
    color: "#049fd9",
  },
];

export const navSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "certs", label: "Certificates" },
  { id: "contact", label: "Contact" },
];
