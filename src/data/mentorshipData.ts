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

export interface EnrolledStudent {
  rollNo: string;
  fullName: string;
  email: string;
  phone: string;
  cohort: string;
  status: string;
  portfolioUrl: string;
  focusAreas: string[];
  isEnrolledVerified: boolean;
}

export const MOCK_ENROLLED_STUDENTS: Record<string, Omit<EnrolledStudent, "isEnrolledVerified">> = {
  "DC-2024-8841": {
    rollNo: "DC-2024-8841",
    fullName: "Ali Raza",
    email: "ali.raza@example.com",
    phone: "+92 300 1234567",
    cohort: "Agentic AI & GenAI Cohort 4",
    status: "Student / Fresh Graduate",
    portfolioUrl: "https://github.com/aliraza-ai/rag-pipeline",
    focusAreas: ["LinkedIn & ATS Resume Roast", "Career Advisory, Freelancing & AI Blueprint"]
  },
  "DC-2024-1052": {
    rollNo: "DC-2024-1052",
    fullName: "Fatima Noor",
    email: "fatima.noor@datacrumbs.org",
    phone: "+92 321 9876543",
    cohort: "Data Science & MLOps Cohort 3",
    status: "Transitioning into AI / Data Science",
    portfolioUrl: "https://github.com/fatima-noor/predictive-models",
    focusAreas: ["Career Advisory, Freelancing & AI Blueprint", "System Architecture Review"]
  },
  "DC-2024-9932": {
    rollNo: "DC-2024-9932",
    fullName: "Muhammad Bilal",
    email: "bilal.m@example.com",
    phone: "+92 333 4567890",
    cohort: "n8n Automation & AI Freelance Cohort 2",
    status: "Freelancer looking for clients",
    portfolioUrl: "https://github.com/mbilal/n8n-agency-workflows",
    focusAreas: ["Career Advisory, Freelancing & AI Blueprint", "LinkedIn & ATS Resume Roast"]
  },
  "DC-2024-4410": {
    rollNo: "DC-2024-4410",
    fullName: "Sarah Ahmed",
    email: "sarah.a@gmail.com",
    phone: "+92 345 6789012",
    cohort: "Deep Learning & Vision Cohort 1",
    status: "Working Software / ML Engineer",
    portfolioUrl: "https://github.com/sarah-ahmed/yolo-vision-inference",
    focusAreas: ["GitHub Portfolio Polish"]
  }
};

export function fetchStudentByRollNo(inputRollNo: string): EnrolledStudent | null {
  const cleaned = inputRollNo.trim().toUpperCase();
  if (!cleaned) return null;

  if (MOCK_ENROLLED_STUDENTS[cleaned]) {
    return {
      ...MOCK_ENROLLED_STUDENTS[cleaned],
      isEnrolledVerified: true
    };
  }

  if (cleaned.startsWith("DC-") || cleaned.length >= 3) {
    const formattedId = cleaned.startsWith("DC-") ? cleaned : `DC-2024-${cleaned}`;
    return {
      rollNo: formattedId,
      fullName: "Enrolled Student (" + formattedId + ")",
      email: "student." + cleaned.toLowerCase().replace(/[^a-z0-9]/g, "") + "@datacrumbs.org",
      phone: "+92 300 000" + Math.floor(1000 + Math.random() * 9000),
      cohort: "DataCrumbs Agentic AI Bootcamp (Active)",
      status: "Student / Fresh Graduate",
      portfolioUrl: "https://github.com/datacrumbs-student/" + cleaned.toLowerCase(),
      focusAreas: ["LinkedIn & ATS Resume Roast", "Career Advisory, Freelancing & AI Blueprint"],
      isEnrolledVerified: true
    };
  }

  return null;
}

export const SESSION_TRACKS: SessionTrack[] = [
  {
    id: "linkedin-resume-portfolio",
    title: "1. LinkedIn, Resume and Portfolio",
    duration: "15 Mins",
    tag: "Most Popular",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
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
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
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
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
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
  }
];

export const ALUMNI_COMPANIES = [
  "Google", "Amazon", "Microsoft", "Meta", "Turing", "EasyHire", "NexusBot", "DataCrumbs Labs", "Sarb", "Careem"
];

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
