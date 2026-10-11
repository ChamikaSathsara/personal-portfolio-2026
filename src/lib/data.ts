import siteData from "../../data/site.json";
import projectsData from "../../data/projects.json";
import blogsData from "../../data/blogs.json";
import experienceData from "../../data/experience.json";
import skillsData from "../../data/skills.json";
import type {
  SiteConfig,
  Project,
  BlogPost,
  ExperienceItem,
  SkillCategory,
} from "@/types";
import { calculateReadingTime } from "./utils";

// ==============================================================================
// Synchronous local helpers (used as initial hydration states / local fallback)
// ==============================================================================

export function getSiteConfig(): SiteConfig {
  return siteData as SiteConfig;
}

export function getAllProjects(): Project[] {
  return projectsData as Project[];
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectById(id: string): Project | undefined {
  return getAllProjects().find((p) => p.id === id);
}

export function getAllBlogPosts(): BlogPost[] {
  return (blogsData as BlogPost[]).map((post) => ({
    ...post,
    readingTime: calculateReadingTime(post.content),
  }));
}

export function getFeaturedBlogPosts(): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.featured);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((p) => p.slug === slug);
}

export function getAllExperience(): ExperienceItem[] {
  return experienceData as ExperienceItem[];
}

export function getAllSkills(): SkillCategory[] {
  return skillsData as SkillCategory[];
}
