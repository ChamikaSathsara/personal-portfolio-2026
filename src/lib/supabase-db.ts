"use cache";

import { supabase, isSupabaseConfigured } from "./supabase";
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
// Live Supabase DB Query Functions (Isomorphic Cache Module)
// ==============================================================================

export async function getDbProjects(): Promise<Project[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          image: p.image || "",
          technologies: Array.isArray(p.technologies) ? p.technologies : [],
          category: p.category || "Full Stack",
          github: p.github || "",
          liveUrl: p.live_url || p.liveUrl || "",
          featured: Boolean(p.featured),
        }));
      }
    } catch {
      // Fallback to local
    }
  }
  return projectsData as Project[];
}

export async function getDbFeaturedProjects(): Promise<Project[]> {
  const projects = await getDbProjects();
  return projects.filter((p) => p.featured);
}

export async function getDbProjectById(id: string): Promise<Project | undefined> {
  const projects = await getDbProjects();
  return projects.find((p) => p.id === id);
}

export async function getDbBlogPosts(): Promise<BlogPost[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((b) => ({
          id: b.id,
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt || "",
          content: b.content || "",
          coverImage: b.cover_image || b.image || "",
          tags: Array.isArray(b.tags) ? b.tags : [],
          publishedAt: b.published_at || b.date || "2026-01-01",
          featured: Boolean(b.featured),
          readingTime: calculateReadingTime(b.content || ""),
        }));
      }
    } catch {
      // Fallback
    }
  }

  return (blogsData as BlogPost[]).map((post) => ({
    ...post,
    readingTime: calculateReadingTime(post.content),
  }));
}

export async function getDbFeaturedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getDbBlogPosts();
  return posts.filter((p) => p.featured);
}

export async function getDbBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getDbBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getDbSiteConfig(): Promise<SiteConfig> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("*")
        .eq("id", "default")
        .single();

      if (!error && data) {
        return {
          name: data.name,
          title: data.title,
          email: data.email,
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          shortBio: data.short_bio || data.shortBio || "",
          avatarUrl: data.avatar_url || data.avatar || "/images/profile/chamika.webp",
          socials: data.socials || data.social || {},
          stats: Array.isArray(data.stats) ? data.stats : [],
        };
      }
    } catch {
      // Fallback
    }
  }
  return siteData as SiteConfig;
}

export async function getDbExperience(): Promise<ExperienceItem[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((e) => ({
          id: e.id,
          company: e.company,
          role: e.role,
          duration: e.duration || e.period || "",
          startDate: e.start_date || e.startDate || "",
          endDate: e.end_date || e.endDate || "",
          description: e.description || "",
          type: e.type || "full-time",
          current: Boolean(e.current),
        }));
      }
    } catch {
      // Fallback
    }
  }
  return experienceData as ExperienceItem[];
}

export async function getDbSkills(): Promise<SkillCategory[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("skills").select("*");

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((s) => ({
          id: s.id,
          category: s.category || s.title || "",
          icon: s.icon || "Code",
          skills: Array.isArray(s.skills) ? s.skills : [],
        }));
      }
    } catch {
      // Fallback
    }
  }
  return skillsData as SkillCategory[];
}
