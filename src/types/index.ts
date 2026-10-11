export interface SiteConfig {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  shortBio: string;
  avatarUrl: string;
  socials: {
    linkedin: string;
    github: string;
    medium: string;
    behance: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: "Web" | "Mobile" | "UI/UX" | "Full Stack";
  github: string;
  liveUrl: string;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
  featured: boolean;
  readingTime?: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
  description: string;
  type: "full-time" | "internship" | "trainee" | "contract";
  current: boolean;
}

export interface SkillCategory {
  id: string;
  category: string;
  icon: string;
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  classification: string;
  description: string;
}
