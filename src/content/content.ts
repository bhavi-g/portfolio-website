/**
 * Single source of truth for all site copy, links, and data.
 * Edit here — components only render what this file exports.
 */

export type NavLink = { label: string; href: string };

export type Project = {
  title: string;
  subtitle?: string;
  description: string;
  tech: string[];
  github: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  location?: string;
  highlights: string[];
};

export type SkillGroup = {
  label: string;
  skills: string[];
};

export const site = {
  name: "Bhavish Goyal",
  role: "AI Software Developer",
  tagline:
    "Waterloo CS × AI Specialization Currently building at Communitech",
  description:
    "Portfolio of Bhavish Goyal, AI Software Developer — neural network and LLM training, applied ML, and full-stack AI products.",
  url: "https://bhavishgoyal.dev", // TODO: replace with the deployed URL
};

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const about = {
  paragraph:
    "I build impactful software and AI projects — from distributed agent execution engines to neural networks that compose music. I like working where technical depth meets creativity, and outside of shipping code I enjoy leadership, mentoring, and being active in student communities.",
  // Drop your portrait here — see instructions. Portrait 4:5, ~800×1000px+.
  photo: "/bhavish.jpg",
};

export const projects: Project[] = [
  {
    title: "MultiPoker",
    description:
      "Modular poker engine supporting multiple game variants with reusable gameplay, player-action, and hand-evaluation logic.",
    tech: ["Swift", "iOS", "OOP"],
    github: "https://github.com/bhavi-g/MultiPoker",
  },
  {
    title: "Agent Orchestrator",
    subtitle: "Distributed AI Execution Engine",
    description:
      "Coordinates multi-step agent workflows with persistent state, retry handling, and modular workflow control for reliable automated reasoning pipelines.",
    tech: ["Go", "SQLite", "Claude APIs", "Concurrency", "REST"],
    github: "https://orchestai.onrender.com",
  },
  {
    title: "AURA",
    subtitle: "Automated Understanding & Remediation for Audits",
    description:
      "AI-assisted audit platform that analyzes Solidity contracts for vulnerabilities, synthesizes multi-tool findings, explains root causes, and generates PR-ready remediation diffs.",
    tech: ["Python", "Rust", "FastAPI", "Slither", "Mythril"],
    github: "https://github.com/bhavi-g/AURA",
  },
  {
    title: "SmartStay",
    subtitle: "Student Co-op Housing Aggregator (MVP)",
    description:
      "A lean backend that stores student housing listings and exposes an API to query them — with web scrapers, a CSV ingest pipeline, and Reddit batch collection for sourcing. Zero-config on SQLite, swappable to PostgreSQL via a DB URL.",
    tech: ["Python", "FastAPI", "SQLAlchemy", "SQLite", "Web Scraping"],
    github: "https://github.com/bhavi-g/SmartStay",
  },
  {
    title: "MusicRNN",
    subtitle: "A Small Collection of AI Music Experiments",
    description:
      "Two self-contained AI music projects in one repo: a character-level LSTM that generates classical tunes in ABC notation, and a Punjabi/Bhangra-style text-to-music generator built on MusicGen.",
    tech: ["Python", "LSTM", "MusicGen", "Transformers", "ABC Notation"],
    github: "https://github.com/bhavi-g/MusicRNN",
  },
];

export const experience: ExperienceEntry[] = [
  {
    company: "Communitech",
    role: "Software Developer, AI Adoption (Co-op)",
    period: "May 2026 – Present",
    location: "Waterloo",
    highlights: [],
  },
  {
    company: "IST, University of Waterloo",
    role: "AI Developer",
    period: "Jan – Apr 2026",
    location: "Waterloo",
    highlights: [
      "Built enterprise AI services with C#/.NET 8, Azure Functions, Cosmos DB, and Azure OpenAI, handling 900+ inputs per request.",
      "Improved retrieval quality 16% and cut hallucinations 25% via reranking, BM25, and contextual retrieval.",
      "Cut transient failures 28% with retry logic, structured logging, and health checks.",
    ],
  },
  {
    company: "Technovia Services",
    role: "Software Engineer Intern",
    period: "May – Aug 2025",
    location: "Noida",
    highlights: [
      "Built Python data pipelines and ML evaluation validating 15K predictions, improving accuracy 12%.",
      "Shipped React/TypeScript dashboards for training metrics and drift.",
      "Automated testing with Pytest and Postman, catching 30+ API issues.",
    ],
  },
  {
    company: "Peaktew",
    role: "AI Software Developer",
    period: "Jan – Apr 2025",
    location: "Waterloo",
    highlights: [
      "Trained CNN/Transformer models on 50K+ samples with PyTorch and TensorFlow, lifting validation accuracy 8%.",
      "Integrated OpenAI and Hugging Face models into production workflows.",
      "Reached 90% test coverage on ML workflows.",
    ],
  },
  {
    company: "Muide",
    role: "Full-Stack Developer",
    period: "May – Aug 2023",
    location: "Waterloo",
    highlights: [
      "Ran Python/SQL analytics on 1,000+ sessions, improving retention 12%.",
      "Automated A/B tests and Looker Studio reports, cutting manual analysis 30%.",
    ],
  },
];

export const education = {
  school: "University of Waterloo",
  degree: "Bachelor of Computer Science (Co-op)",
  specialization: "Specialization in Artificial Intelligence",
  period: "Sep 2023 – Apr 2028",
  logo: "/uwaterloo-logo.svg", // Drop the UWaterloo logo here — see instructions.
  highlights: [
    "$22,000 International Excellence Scholarship",
    "Undergraduate Representative, Mathematics Endowment Fund",
  ],
  // National / international olympiads & scholar exams
  olympiads: ["IMO", "KVPY", "NTSE", "NSEJS", "RMO", "PRMO"],
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    skills: ["Python", "C#", "Swift", "Kotlin", "JavaScript/TypeScript", "SQL", "Go", "Rust", "C++"],
  },
  {
    label: "Frameworks & Libraries",
    skills: [".NET 8", "Azure Functions", "FastAPI", "REST", "SQLAlchemy", "React", "NumPy", "Pandas"],
  },
  {
    label: "AI / ML",
    skills: [
      "Azure OpenAI",
      "Semantic Kernel",
      "Agentic AI",
      "RAG",
      "Embeddings",
      "Prompt Engineering",
      "LLM Evaluation",
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "XGBoost",
      "Hugging Face",
    ],
  },
  {
    label: "Tools",
    skills: [
      "Docker",
      "CI/CD",
      "Serverless",
      "Pytest",
      "Postman",
      "Cosmos DB",
      "PostgreSQL",
      "MongoDB",
      "Blob Storage",
      "Vector DBs",
    ],
  },
];

export const extracurriculars = [
  {
    title: "Undergraduate Representative — Mathematics Endowment Fund",
    description:
      "Representing undergraduate students in allocating funding for student-led academic initiatives.",
  },
  {
    title: "Mentoring & Student Community",
    description:
      "Active in mentoring and student-community work across the University of Waterloo.",
  },
];

export const contact = {
  email: "bhavish.goyal@uwaterloo.ca",
  phone: "", // TODO: add phone if you want it shown (hidden while empty)
  github: "https://github.com/bhavi-g",
  githubHandle: "bhavi-g",
  linkedin: "https://www.linkedin.com/in/goyalbhavish",
  linkedinHandle: "goyalbhavish",
  resume: "/resume.pdf",
};
