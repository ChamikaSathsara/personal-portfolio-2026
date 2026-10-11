import { getSupabaseServerClient, getSupabaseConfigStatus } from "./supabase-server";
import fs from "fs/promises";
import path from "path";
import type {
  Project,
  BlogPost,
  SiteConfig,
  ExperienceItem,
  SkillCategory,
} from "@/types";

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- Chamika Pathirage - 2026 Portfolio Database Setup & Seed
-- Run this complete script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/khjevvstddndlfohlkin/sql
-- ==============================================================================

-- 1. Create / Update Projects Table
create table if not exists public.projects (
  id text primary key,
  title text not null,
  description text,
  image text,
  technologies jsonb default '[]'::jsonb,
  category text,
  github text,
  live_url text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create / Update Blogs Table
create table if not exists public.blogs (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  image text,
  tags jsonb default '[]'::jsonb,
  published_at text,
  date text,
  medium_url text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.blogs add column if not exists cover_image text;
alter table public.blogs add column if not exists tags jsonb default '[]'::jsonb;
alter table public.blogs add column if not exists published_at text;
alter table public.blogs add column if not exists medium_url text;

-- 3. Create / Update Site Config Table
create table if not exists public.site_config (
  id text primary key default 'default',
  name text,
  title text,
  email text,
  phone text,
  location text,
  bio text,
  short_bio text,
  avatar_url text,
  avatar text,
  socials jsonb default '{}'::jsonb,
  social jsonb default '{}'::jsonb,
  stats jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

alter table public.site_config add column if not exists short_bio text;
alter table public.site_config add column if not exists avatar_url text;
alter table public.site_config add column if not exists socials jsonb default '{}'::jsonb;

-- 4. Create / Update Experience Table
create table if not exists public.experience (
  id text primary key,
  company text not null,
  role text not null,
  duration text,
  period text,
  start_date text,
  end_date text,
  description text,
  skills jsonb default '[]'::jsonb,
  type text default 'full-time',
  current boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.experience add column if not exists duration text;
alter table public.experience add column if not exists start_date text;
alter table public.experience add column if not exists end_date text;
alter table public.experience add column if not exists current boolean default false;

-- 5. Create / Update Skills Table
create table if not exists public.skills (
  id text primary key,
  category text,
  title text,
  icon text,
  skills jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.skills add column if not exists category text;
alter table public.skills add column if not exists title text;

-- Enable Row Level Security (RLS) on all tables
alter table public.projects enable row level security;
alter table public.blogs enable row level security;
alter table public.site_config enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;

-- Drop prior policies to avoid conflicts
drop policy if exists "Allow public read on projects" on public.projects;
drop policy if exists "Allow public read on blogs" on public.blogs;
drop policy if exists "Allow public read on site_config" on public.site_config;
drop policy if exists "Allow public read on experience" on public.experience;
drop policy if exists "Allow public read on skills" on public.skills;

drop policy if exists "Allow all access on projects" on public.projects;
drop policy if exists "Allow all access on blogs" on public.blogs;
drop policy if exists "Allow all access on site_config" on public.site_config;
drop policy if exists "Allow all access on experience" on public.experience;
drop policy if exists "Allow all access on skills" on public.skills;

-- Create policies for public read and CMS admin access (anon & authenticated)
create policy "Allow all access on projects" on public.projects for all using (true) with check (true);
create policy "Allow all access on blogs" on public.blogs for all using (true) with check (true);
create policy "Allow all access on site_config" on public.site_config for all using (true) with check (true);
create policy "Allow all access on experience" on public.experience for all using (true) with check (true);
create policy "Allow all access on skills" on public.skills for all using (true) with check (true);
`;

// ==============================================================================
// Read from Supabase DB (with automatic local JSON fallback)
// ==============================================================================

export async function fetchProjectsFromSupabase(): Promise<Project[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          image: item.image || "",
          technologies: Array.isArray(item.technologies) ? item.technologies : [],
          category: item.category || "Full Stack",
          github: item.github || "",
          liveUrl: item.live_url || item.liveUrl || "",
          featured: Boolean(item.featured),
        }));
      }
    } catch {
      // Fallback to local
    }
  }

  // Fallback to local JSON
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "projects.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function fetchBlogsFromSupabase(): Promise<BlogPost[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt || "",
          content: item.content || "",
          coverImage: item.cover_image || item.image || "",
          tags: Array.isArray(item.tags) ? item.tags : [],
          publishedAt: item.published_at || item.date || "2026-01-01",
          featured: Boolean(item.featured),
        }));
      }
    } catch {
      // Fallback
    }
  }

  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "blogs.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function fetchSiteConfigFromSupabase(): Promise<SiteConfig> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
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

  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "site.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return {
      name: "Chamika Pathirage",
      title: "Full Stack Software & UX Engineer",
      email: "chamikasathsara1@gmail.com",
      phone: "+94 76 48 52 827",
      location: "Bandaragama, Sri Lanka",
      bio: "",
      shortBio: "",
      avatarUrl: "/images/profile/chamika.webp",
      socials: {
        linkedin: "https://www.linkedin.com/in/chamika-sathsara/",
        github: "https://github.com/ChamikaSathsara",
        medium: "https://medium.com/@chamikasathsara1",
        behance: "https://www.behance.net/chamikasathsara1",
      },
      stats: [],
    };
  }
}

export async function fetchExperienceFromSupabase(): Promise<ExperienceItem[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          company: item.company,
          role: item.role,
          duration: item.duration || item.period || "",
          startDate: item.start_date || item.startDate || "",
          endDate: item.end_date || item.endDate || "",
          description: item.description || "",
          type: item.type || "full-time",
          current: Boolean(item.current),
        }));
      }
    } catch {
      // Fallback
    }
  }

  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "experience.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function fetchSkillsFromSupabase(): Promise<SkillCategory[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("skills").select("*");

      if (!error && Array.isArray(data) && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          category: item.category || item.title || "",
          icon: item.icon || "Code",
          skills: Array.isArray(item.skills) ? item.skills : [],
        }));
      }
    } catch {
      // Fallback
    }
  }

  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "skills.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// ==============================================================================
// Connectivity and Synchronization Functions
// ==============================================================================

export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  statusText: string;
  config: ReturnType<typeof getSupabaseConfigStatus>;
}> {
  const config = getSupabaseConfigStatus();
  if (!config.hasUrl) {
    return {
      connected: false,
      statusText: "SUPABASE_URL is not configured",
      config,
    };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      connected: false,
      statusText: "Supabase client could not be initialized. Check API keys.",
      config,
    };
  }

  try {
    const { data, error } = await supabase.from("projects").select("id").limit(1);
    if (error) {
      if (error.code === "PGRST204" || error.message.includes("relation") || error.message.includes("does not exist")) {
        return {
          connected: true,
          statusText: "Connected to Supabase project, but tables are not yet created. Run the provided SQL script.",
          config,
        };
      }
      return {
        connected: false,
        statusText: `Supabase query returned: ${error.message}`,
        config,
      };
    }

    return {
      connected: true,
      statusText: `Connected to Supabase DB live! (${data?.length || 0} projects found)`,
      config,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return {
      connected: false,
      statusText: `Connection failed: ${msg}`,
      config,
    };
  }
}

export async function syncCollectionToSupabase(
  type: "projects" | "blogs" | "site" | "experience" | "skills",
  data: unknown
): Promise<{ success: boolean; message?: string }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase client not configured or missing keys",
    };
  }

  try {
    if (type === "projects" && Array.isArray(data)) {
      const rows = data.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        image: p.image,
        technologies: p.technologies || [],
        category: p.category,
        github: p.github || "",
        live_url: p.liveUrl || "",
        featured: Boolean(p.featured),
        updated_at: new Date().toISOString(),
      }));

      // Delete existing records that are no longer in data, or upsert all
      const { error } = await supabase.from("projects").upsert(rows, { onConflict: "id" });
      if (error) throw error;
      return { success: true, message: `Synced ${rows.length} projects to Supabase DB` };
    }

    if (type === "blogs" && Array.isArray(data)) {
      const rows = data.map((b) => ({
        id: b.id,
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        cover_image: b.coverImage || b.image,
        image: b.coverImage || b.image,
        tags: b.tags || [],
        published_at: b.publishedAt || b.date,
        date: b.publishedAt || b.date,
        medium_url: b.mediumUrl || "",
        featured: Boolean(b.featured),
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("blogs").upsert(rows, { onConflict: "id" });
      if (error) throw error;
      return { success: true, message: `Synced ${rows.length} blogs to Supabase DB` };
    }

    if (type === "site" && typeof data === "object" && data !== null) {
      const s = data as Record<string, unknown>;
      const row = {
        id: "default",
        name: s.name,
        title: s.title,
        email: s.email,
        phone: s.phone || "",
        location: s.location || "",
        bio: s.bio || "",
        short_bio: s.shortBio || "",
        avatar_url: s.avatarUrl || s.avatar || "/images/profile/chamika.webp",
        avatar: s.avatarUrl || s.avatar || "/images/profile/chamika.webp",
        socials: s.socials || s.social || {},
        social: s.socials || s.social || {},
        stats: s.stats || [],
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("site_config").upsert(row, { onConflict: "id" });
      if (error) throw error;
      return { success: true, message: "Synced site configuration to Supabase DB" };
    }

    if (type === "experience" && Array.isArray(data)) {
      const rows = data.map((e) => ({
        id: e.id,
        company: e.company,
        role: e.role,
        duration: e.duration || e.period || "",
        period: e.duration || e.period || "",
        start_date: e.startDate || e.start_date || "",
        end_date: e.endDate || e.end_date || "",
        description: e.description || "",
        skills: e.skills || [],
        type: e.type || "full-time",
        current: Boolean(e.current),
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("experience").upsert(rows, { onConflict: "id" });
      if (error) throw error;
      return { success: true, message: `Synced ${rows.length} experience items to Supabase DB` };
    }

    if (type === "skills" && Array.isArray(data)) {
      const rows = data.map((s) => ({
        id: s.id,
        category: s.category || s.title || "",
        title: s.category || s.title || "",
        icon: s.icon || "Code",
        skills: s.skills || [],
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("skills").upsert(rows, { onConflict: "id" });
      if (error) throw error;
      return { success: true, message: `Synced ${rows.length} skill categories to Supabase DB` };
    }

    return { success: false, message: `Unsupported collection type: ${type}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, message: `Supabase sync error: ${msg}` };
  }
}

export async function syncAllLocalToSupabase(): Promise<{
  results: Record<string, { success: boolean; message?: string }>;
}> {
  const collections = ["projects", "blogs", "site", "experience", "skills"] as const;
  const results: Record<string, { success: boolean; message?: string }> = {};

  const fileMap: Record<string, string> = {
    projects: "projects.json",
    blogs: "blogs.json",
    site: "site.json",
    experience: "experience.json",
    skills: "skills.json",
  };

  for (const col of collections) {
    try {
      const filePath = path.join(process.cwd(), "data", fileMap[col]);
      const content = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(content);
      const res = await syncCollectionToSupabase(col, parsed);
      results[col] = res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "File read error";
      results[col] = { success: false, message: msg };
    }
  }

  return { results };
}
