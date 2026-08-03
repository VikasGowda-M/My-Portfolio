export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
}

export interface Document {
  id: string;
  type: "certificate" | "research" | "resume" | "internship";
  title: string;
  description: string;
  fileUrl: string;
  date: string;
  issuer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
}

export const defaultProfile: Profile = {
  name: "Alex Johnson",
  title: "Full Stack Developer & Researcher",
  bio: "Passionate developer and researcher with expertise in web technologies, machine learning, and software architecture. I love building solutions that create real impact and collaborating on meaningful projects.",
  avatar: "",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
};

export const defaultProjects: Project[] = [
  {
    id: "1",
    title: "AI-Powered Task Manager",
    description: "A smart task management app that uses ML to prioritize and categorize work automatically. Integrates with popular tools like Slack, Jira, and GitHub.",
    tags: ["React", "Python", "TensorFlow", "FastAPI"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Real-time Collaboration Platform",
    description: "A collaborative workspace with real-time editing, video calls, and integrated project management. Supports up to 100 simultaneous users.",
    tags: ["Next.js", "WebRTC", "Socket.io", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Blockchain Voting System",
    description: "A secure, transparent voting system built on Ethereum with a user-friendly interface. Ensures immutability and verifiability of all votes.",
    tags: ["Solidity", "Web3.js", "React", "MetaMask"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Health Monitoring Dashboard",
    description: "A comprehensive health tracking platform with wearable device integration, data visualization, and AI-powered health insights.",
    tags: ["React Native", "Node.js", "MongoDB", "D3.js"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
  },
];

export const defaultDocuments: Document[] = [
  {
    id: "1",
    type: "certificate",
    title: "AWS Certified Solutions Architect",
    description: "Professional level AWS certification demonstrating expertise in designing distributed systems on AWS cloud infrastructure.",
    fileUrl: "#",
    date: "2024-06",
    issuer: "Amazon Web Services",
  },
  {
    id: "2",
    type: "certificate",
    title: "Google Professional Cloud Developer",
    description: "Certification for proficiency in building and deploying scalable applications on Google Cloud Platform.",
    fileUrl: "#",
    date: "2024-03",
    issuer: "Google Cloud",
  },
  {
    id: "3",
    type: "research",
    title: "Efficient Neural Architecture Search for Edge Devices",
    description: "Research exploring optimization techniques for deploying neural networks on resource-constrained IoT devices with minimal accuracy loss.",
    fileUrl: "#",
    date: "2024-01",
    issuer: "IEEE Conference on AI",
  },
  {
    id: "4",
    type: "research",
    title: "Federated Learning in Healthcare Systems",
    description: "Study on privacy-preserving machine learning techniques applied to distributed healthcare data across multiple institutions.",
    fileUrl: "#",
    date: "2023-09",
    issuer: "ACM Digital Health",
  },
  {
    id: "5",
    type: "resume",
    title: "Software Engineer Resume 2024",
    description: "Current resume highlighting 5+ years of experience in full-stack development, cloud architecture, and research.",
    fileUrl: "#",
    date: "2024-11",
    issuer: "",
  },
  {
    id: "6",
    type: "internship",
    title: "Google Summer Internship Report",
    description: "Comprehensive report on work completed during the summer internship at Google, focusing on ML infrastructure improvements.",
    fileUrl: "#",
    date: "2023-09",
    issuer: "Google Inc.",
  },
  {
    id: "7",
    type: "internship",
    title: "Microsoft Research Internship Report",
    description: "Report detailing contributions to Microsoft's AI research team, including work on large language model evaluation frameworks.",
    fileUrl: "#",
    date: "2022-12",
    issuer: "Microsoft Corporation",
  },
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications",
    excerpt: "Best practices and design patterns for building large-scale React applications that stay maintainable as they grow.",
    content: "Full article content goes here...",
    date: "2024-11-15",
    tags: ["React", "Architecture", "JavaScript"],
  },
  {
    id: "2",
    title: "Introduction to Quantum Computing",
    excerpt: "An accessible introduction to quantum computing concepts and their potential impact on software development and cryptography.",
    content: "Full article content goes here...",
    date: "2024-10-20",
    tags: ["Quantum", "Computer Science", "Future Tech"],
  },
  {
    id: "3",
    title: "The Future of Web Development in 2025",
    excerpt: "Exploring emerging technologies and trends — from AI-driven development to Web Assembly — that are reshaping the web.",
    content: "Full article content goes here...",
    date: "2024-09-05",
    tags: ["Web Dev", "Trends", "2025"],
  },
];

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {
    // ignore
  }
  return defaultValue;
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function loadProfile(): Profile {
  return loadFromStorage("portfolio_profile", defaultProfile);
}

export function loadProjects(): Project[] {
  return loadFromStorage("portfolio_projects", defaultProjects);
}

export function loadDocuments(): Document[] {
  return loadFromStorage("portfolio_documents", defaultDocuments);
}

export function loadBlogPosts(): BlogPost[] {
  return loadFromStorage("portfolio_blogs", defaultBlogPosts);
}
