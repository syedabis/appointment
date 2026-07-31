import { withBasePath } from "@/lib/basePath";

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  specialties: string[];
  category: "all" | "genai" | "ml" | "n8n" | "career";
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  bio: string;
  stack: string[];
  nextAvailable: string;
}

export interface SessionTrack {
  id: string;
  title: string;
  duration: string;
  tag: string;
  badgeColor: string;
  description: string;
  highlights: string[];
  recommendedFor: string;
  price: string;
  isClosed?: boolean;
}

export interface TimeSlot {
  time: string;
  period: "Morning" | "Afternoon" | "Evening";
  isPopular?: boolean;
  isFastFilling?: boolean;
}

export interface Testimonial {
  name: string;
  roleBefore: string;
  roleAfter: string;
  company: string;
  quote: string;
  avatar: string;
  highlight: string;
}

export const SESSION_TRACKS: SessionTrack[] = [
  {
    id: "linkedin-resume-portfolio",
    title: "1. LinkedIn, Resume and Portfolio",
    duration: "15 Mins",
    tag: "Most Popular",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30",
    description: "Transform your LinkedIn profile, ATS resume, and GitHub portfolio into high-conversion showcase assets for AI recruiters & clients.",
    highlights: [
      "Live ATS resume roast & structural rewrite suggestions",
      "LinkedIn headline, summary & recruiter keyword tuning",
      "GitHub repo showcase, README refactoring & project polish",
      "Direct outreach templates for DataCrumbs alumni network"
    ],
    recommendedFor: "Students & Job Seekers building portfolio visibility",
    price: "Rs 1,500"
  },
  {
    id: "career-advisory-ai-blueprint",
    title: "2. Career Advisory, Freelancing & AI Blueprint",
    duration: "15 Mins",
    tag: "Freelance & Career",
    badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30",
    description: "Personalized 1-on-1 strategy for freelancing & career growth. Build custom GenAI/n8n automation blueprints, close high-ticket clients, and map your AI career transition.",
    highlights: [
      "Freelance client acquisition & Upwork/cold outreach playbook",
      "High-ticket AI & n8n automation pricing ($1k–$5k retainers)",
      "Agentic AI & n8n workflow system architecture review",
      "Skill gap breakdown & personalized AI career roadmap"
    ],
    recommendedFor: "Freelancers, consultants & engineers seeking high-ticket clients or career clarity",
    price: "Rs 1,500"
  },
  {
    id: "mock-interviews",
    title: "3. Mock Interviews",
    duration: "15 Mins",
    tag: "Registration Closed",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border-rose-300 dark:border-rose-500/30",
    description: "1-on-1 mock technical interview simulation with Syed Abis covering GenAI system design, Python algorithms, SQL live coding, and STAR behavioral drills.",
    highlights: [
      "Live system design framing (RAG pipelines / ML infrastructure)",
      "Technical coding & SQL live drill under pressure",
      "Instant breakdown of technical strengths & blind spots",
      "Post-interview score card & action plan checklist"
    ],
    recommendedFor: "Slots Fully Booked • Registration Closed for Non-Members",
    price: "Free",
    isClosed: true
  }
];

export const MENTORS: Mentor[] = [
  {
    id: "syed-abis",
    name: "Syed Abis",
    role: "Lead AI Engineer & Principal Mentor",
    company: "DataCrumbs Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    specialties: ["LinkedIn & Resume Roast", "Career Advisory & Freelancing", "AI & n8n Blueprint", "Mock Technical Interviews"],
    category: "all",
    rating: 4.99,
    reviewsCount: 480,
    experienceYears: 9,
    bio: "Lead AI Engineer & Head Mentor at DataCrumbs. Guiding students 1-on-1 through portfolio building, career strategy, n8n automations, and rigorous technical mock interviews.",
    stack: ["Python", "GenAI & RAG", "n8n Automation", "System Design", "Career Coaching"],
    nextAvailable: "Today, 4:00 PM"
  }
];

export const TIME_SLOTS: TimeSlot[] = [
  { time: "09:00 AM - 09:15 AM", period: "Morning" },
  { time: "09:30 AM - 09:45 AM", period: "Morning", isPopular: true },
  { time: "10:00 AM - 10:15 AM", period: "Morning" },
  { time: "10:30 AM - 10:45 AM", period: "Morning" },
  { time: "02:00 PM - 02:15 PM", period: "Afternoon", isFastFilling: true },
  { time: "02:30 PM - 02:45 PM", period: "Afternoon", isPopular: true },
  { time: "03:00 PM - 03:15 PM", period: "Afternoon" },
  { time: "06:00 PM - 06:15 PM", period: "Evening", isPopular: true },
  { time: "06:30 PM - 06:45 PM", period: "Evening", isFastFilling: true },
  { time: "07:00 PM - 07:15 PM", period: "Evening" }
];

export const TIMEZONES = [
  { code: "PKT", label: "Karachi / Pakistan Standard Time (UTC+5)" },
  { code: "IST", label: "India Standard Time (UTC+5:30)" },
  { code: "EST", label: "Eastern Time - US & Canada (UTC-5)" },
  { code: "PST", label: "Pacific Time - US & Canada (UTC-8)" },
  { code: "GMT", label: "Greenwich Mean Time - London (UTC+0)" },
  { code: "CET", label: "Central European Time - Berlin (UTC+1)" },
  { code: "GST", label: "Gulf Standard Time - Dubai (UTC+4)" },
  { code: "SGT", label: "Singapore Time (UTC+8)" }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Hamza Malik",
    roleBefore: "University Student with zero projects",
    roleAfter: "Junior AI Engineer",
    company: "Turing AI",
    quote: "My 1-on-1 mentorship session with Syed Abis changed everything. He spent 15 minutes reviewing my RAG pipeline line by line. I used that exact project to secure my offer!",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    highlight: "8+ Deployed ML Projects"
  },
  {
    name: "Ayesha Khan",
    roleBefore: "Marketing Associate",
    roleAfter: "Data Analyst",
    company: "EasyHire",
    quote: "Syed Abis roasted my resume and LinkedIn profile in our 15-min session and showed me how to showcase my n8n workflows. I received 3 callbacks within 10 days.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    highlight: "Role Transitioned in 4 Months"
  },
  {
    name: "Zayn Ahmed",
    roleBefore: "Stuck in repetitive operations",
    roleAfter: "AI Automation Freelancer",
    company: "Upwork Top Rated ($15k+)",
    quote: "Syed Abis reviewed my client pitch deck in our AI & Freelance Blueprint slot. I closed a $2,500 automation retainer with a US client right after applying his recommendations.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    highlight: "$2.5k Client Closed"
  },
  {
    name: "Bilal Siddiqui",
    roleBefore: "Software Intern",
    roleAfter: "GenAI System Engineer",
    company: "DataStax Partner",
    quote: "The 1-on-1 feedback on Vector databases, LangChain memory, and hybrid search optimization saved me weeks of trial & error. Highly recommended for serious devs!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    highlight: "GenAI Production Deployment"
  },
  {
    name: "Sana Fatima",
    roleBefore: "CS Graduate",
    roleAfter: "Computer Vision Researcher",
    company: "VisionTech Labs",
    quote: "Syed Abis gave me exact guidance on framing my YOLO and OpenCV GitHub repos to stand out to international AI recruiters. Got selected for a funded AI fellowship!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    highlight: "Funded AI Research Fellowship"
  },
  {
    name: "Usman Chaudhry",
    roleBefore: "Manual QA Tester",
    roleAfter: "n8n Workflow Automation Lead",
    company: "AutomationX",
    quote: "I was struggling to pitch complex n8n agentic workflows to enterprise clients. Syed Abis shared a structured pricing framework that doubled my project rates instantly.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
    highlight: "2x Freelance Hourly Rate"
  },
  {
    name: "Mariam Tariq",
    roleBefore: "Data Entry Operator",
    roleAfter: "Associate Machine Learning Engineer",
    company: "Techlogix",
    quote: "The resume rewrite & keyword optimization in Track 1 bypassed ATS filters seamlessly. I went from zero responses to 4 tech interview invitations in two weeks!",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    highlight: "4 Interview Invitations in 14 Days"
  },
  {
    name: "Farhan Ali",
    roleBefore: "Backend Developer",
    roleAfter: "MLOps & Cloud Infrastructure Specialist",
    company: "CloudAI Solutions",
    quote: "Syed Abis's architecture breakdown for containerized ML model deployment gave me total confidence during my technical interview round. Landed the role with 40% hike!",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
    highlight: "40% Salary Increase"
  },
  {
    name: "Zubair Hassan",
    roleBefore: "Junior Python Programmer",
    roleAfter: "AI Agent Architect",
    company: "BotScale Systems",
    quote: "1-on-1 strategy sessions at DataCrumbs are gold. We mapped out autonomous multi-agent systems using CrewAI, which became the cornerstone of my current engineering job.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    highlight: "Multi-Agent System Deployed"
  },
  {
    name: "Hira Mustafa",
    roleBefore: "Final Year Student",
    roleAfter: "AI Product Consultant",
    company: "NextGen Systems",
    quote: "Syed Abis showed me how to turn my university thesis into a commercial AI MVP. The clarity and actionable roadmap from a single session was priceless.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    highlight: "Thesis Converted to Paid MVP"
  }
];

export interface CompanyItem {
  name: string;
  logo?: string;
}

export const ALUMNI_COMPANIES: (string | CompanyItem)[] = Array.from({ length: 31 }, (_, i) => ({
  name: `Alumni Partner ${i + 1}`,
  logo: withBasePath(`/logos/${i + 1}.png`),
}));

export const FAQS = [
  {
    q: "How long is each 1-on-1 mentorship session?",
    a: "All 1-on-1 mentorship sessions are 15 minutes long to provide laser-focused, high-impact feedback without fluff."
  },
  {
    q: "How much do the mentorship sessions cost?",
    a: "LinkedIn, Resume & Portfolio review and Career Advisory/Freelance Blueprint sessions are Rs 1,500 each. Enrolled DataCrumbs students can enter their Student Roll No for a Free Pass. Mock Interviews are Free, but registration is currently closed due to high demand."
  },
  {
    q: "Why are Mock Interviews closed for registration?",
    a: "Mock interview slots with Syed Abis are currently fully booked. You can book Track 1 or Track 2, or check back next week when new slots open."
  },
  {
    q: "What should I prepare before my 15-minute slot?",
    a: "Have your GitHub repository link, resume PDF, or LinkedIn URL ready in advance so Syed Abis can dive straight into your review."
  }
];
