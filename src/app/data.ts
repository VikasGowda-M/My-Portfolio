// ─── TypeScript Types ────────────────────────────────────────────────────────
// localStorage has been replaced by Firebase Firestore + Storage.
// See src/firebase/ for all data operations.

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

// ─── Default data (used to seed Firestore on first launch) ──────────────────

export const defaultProfile: Profile = {
  name: "Alex Johnson",
  title: "Full Stack Developer & Researcher",
  bio: "Passionate developer and researcher with expertise in web technologies, machine learning, and software architecture. I love building solutions that create real impact.",
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
    description: "A smart task management app that uses ML to prioritize and categorize work automatically.",
    tags: ["React", "Python", "TensorFlow", "FastAPI"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Real-time Collaboration Platform",
    description: "A collaborative workspace with real-time editing, video calls, and project management.",
    tags: ["Next.js", "WebRTC", "Socket.io", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Blockchain Voting System",
    description: "A secure, transparent voting system built on Ethereum with a user-friendly interface.",
    tags: ["Solidity", "Web3.js", "React", "MetaMask"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
  },
  {
    id: "4",
    title: "Health Monitoring Dashboard",
    description: "A comprehensive health tracking platform with wearable device integration.",
    tags: ["React Native", "Node.js", "MongoDB", "D3.js"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
  },
];

export const defaultDocuments: Document[] = [
  {
    id: "doc1",
    type: "certificate",
    title: "AWS Certified Solutions Architect",
    description: "Professional level AWS certification.",
    fileUrl: "#",
    date: "2024-06",
    issuer: "Amazon Web Services",
  },
  {
    id: "doc2",
    type: "certificate",
    title: "Google Professional Cloud Developer",
    description: "Certification for GCP proficiency.",
    fileUrl: "#",
    date: "2024-03",
    issuer: "Google Cloud",
  },
  {
    id: "doc3",
    type: "research",
    title: "Efficient Neural Architecture Search for Edge Devices",
    description: "Research on deploying neural networks on IoT devices.",
    fileUrl: "#",
    date: "2024-01",
    issuer: "IEEE Conference on AI",
  },
  {
    id: "doc4",
    type: "research",
    title: "Federated Learning in Healthcare Systems",
    description: "Privacy-preserving ML in healthcare data.",
    fileUrl: "#",
    date: "2023-09",
    issuer: "ACM Digital Health",
  },
  {
    id: "doc5",
    type: "resume",
    title: "Software Engineer Resume 2024",
    description: "Current resume highlighting 5+ years of experience.",
    fileUrl: "#",
    date: "2024-11",
    issuer: "",
  },
  {
    id: "doc6",
    type: "internship",
    title: "Google Summer Internship Report",
    description: "Internship report focusing on ML infrastructure.",
    fileUrl: "#",
    date: "2023-09",
    issuer: "Google Inc.",
  },
  {
    id: "doc7",
    type: "internship",
    title: "Microsoft Research Internship Report",
    description: "Contributions to Microsoft AI research team.",
    fileUrl: "#",
    date: "2022-12",
    issuer: "Microsoft Corporation",
  },
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: "blog1",
    title: "Building Scalable React Applications",
    excerpt: "Best practices for building large-scale React applications.",
    content: "Full article content goes here...",
    date: "2024-11-15",
    tags: ["React", "Architecture", "JavaScript"],
  },
  {
    id: "blog2",
    title: "Introduction to Quantum Computing",
    excerpt: "An accessible introduction to quantum computing concepts.",
    content: "Full article content goes here...",
    date: "2024-10-20",
    tags: ["Quantum", "Computer Science", "Future Tech"],
  },
  {
    id: "blog3",
    title: "The Future of Web Development in 2025",
    excerpt: "Emerging technologies reshaping the web.",
    content: "Full article content goes here...",
    date: "2024-09-05",
    tags: ["Web Dev", "Trends", "2025"],
  },
];
