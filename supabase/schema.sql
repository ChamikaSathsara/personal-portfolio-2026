-- ==============================================================================
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

-- Ensure backwards-compatible columns exist on blogs
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

-- Ensure backwards-compatible columns exist on site_config
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

-- Ensure backwards-compatible columns exist on experience
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

-- Ensure backwards-compatible columns exist on skills
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

-- Create full read/write policies for anon and authenticated users
create policy "Allow all access on projects" on public.projects for all using (true) with check (true);
create policy "Allow all access on blogs" on public.blogs for all using (true) with check (true);
create policy "Allow all access on site_config" on public.site_config for all using (true) with check (true);
create policy "Allow all access on experience" on public.experience for all using (true) with check (true);
create policy "Allow all access on skills" on public.skills for all using (true) with check (true);

-- ==============================================================================
-- Seed / Upsert Data: Chamika's Verified Projects, Blogs, Site Config, Experience & Skills
-- ==============================================================================

-- 1. Site Config Seed
insert into public.site_config (id, name, title, email, phone, location, bio, short_bio, avatar_url, avatar, socials, social, stats)
values (
  'default',
  'Chamika Pathirage',
  'Full Stack Software & UX Engineer',
  'chamikasathsara1@gmail.com',
  '+94 76 48 52 827',
  'Bandaragama, Sri Lanka',
  'Results-driven Full Stack Software and UI/UX Engineer with a BSc. Hons in Computing and Information Systems (Second Class Upper Division). Highly skilled in architecting modern web applications, mobile front-ends, and serverless ecosystems. Blends technical software development expertise with professional experience in business development, compliance operations, and creative UI/UX design to deliver robust, user-centric digital products.',
  'I build modern web and mobile experiences that combine clean engineering, thoughtful UX, and scalable architecture.',
  '/images/profile/chamika.webp',
  '/images/profile/chamika.webp',
  '{"linkedin": "https://www.linkedin.com/in/chamika-sathsara/", "github": "https://github.com/ChamikaSathsara", "medium": "https://medium.com/@chamikasathsara1", "behance": "https://www.behance.net/chamikasathsara1"}'::jsonb,
  '{"linkedin": "https://www.linkedin.com/in/chamika-sathsara/", "github": "https://github.com/ChamikaSathsara", "medium": "https://medium.com/@chamikasathsara1", "behance": "https://www.behance.net/chamikasathsara1"}'::jsonb,
  '[{"label": "Graduated", "value": "2025"}, {"label": "Final GPA", "value": "3.36"}, {"label": "Speciality", "value": "Full Stack"}, {"label": "Focus", "value": "Web + Mobile"}]'::jsonb
)
on conflict (id) do update set
  name = excluded.name,
  title = excluded.title,
  email = excluded.email,
  phone = excluded.phone,
  location = excluded.location,
  bio = excluded.bio,
  short_bio = excluded.short_bio,
  avatar_url = excluded.avatar_url,
  avatar = excluded.avatar,
  socials = excluded.socials,
  social = excluded.social,
  stats = excluded.stats,
  updated_at = now();

-- 2. Projects Seed
insert into public.projects (id, title, description, image, technologies, category, github, live_url, featured)
values
(
  'hiretrace-io',
  'HireTrace.io — Smart Recruitment & ATS Platform',
  'A comprehensive applicant tracking and candidate pipeline platform. Built with full-stack MERN & TypeScript architectures, featuring automated candidate stage progression, resume parsing, interview evaluation workflows, and real-time dashboard analytics.',
  '/images/projects/hiretrace.webp',
  '["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS"]'::jsonb,
  'Full Stack',
  'https://github.com/ChamikaSathsara',
  'https://github.com/ChamikaSathsara',
  true
),
(
  'layered-architecture-web',
  'Enterprise Layered Architecture System',
  'Production reference system implementing clean 4-tier layered architecture (Presentation Layer, Application Service Layer, Repository Layer, and Database Layer). Designed for high maintainability, testability, and enterprise scalability.',
  '/images/projects/layered-architecture.webp',
  '["Next.js", "TypeScript", "Node.js", "REST APIs", "GraphQL", "SOLID Principles"]'::jsonb,
  'Full Stack',
  'https://github.com/ChamikaSathsara',
  'https://medium.com/@chamikasathsara1',
  true
),
(
  'knoit-keyboard',
  'KnoitKeyboard — Smart Android Mobile Keyboard',
  'An intelligent mobile keyboard application developed with Android Studio and Java. Features custom themes, responsive tactile feedback, localized input methods, gesture typing, and optimized Android input service lifecycle management.',
  '/images/projects/knoit-keyboard.webp',
  '["Android Studio", "Java", "Mobile UX", "Haptics", "SDK Architecture"]'::jsonb,
  'Mobile',
  'https://github.com/ChamikaSathsara/KnoitKeyboard',
  'https://github.com/ChamikaSathsara/KnoitKeyboard',
  true
),
(
  'behance-design-systems',
  'Creative UI/UX & Digital Brand Showcase',
  'Curated collection of digital product designs, glassmorphic design systems, mobile app prototypes, and brand identities published on Behance. Bridges creative visual aesthetics with technical front-end implementation.',
  '/images/projects/behance-showcase.webp',
  '["Figma", "UI/UX Design", "Behance", "Design Systems", "Prototyping"]'::jsonb,
  'UI/UX',
  'https://github.com/ChamikaSathsara',
  'https://www.behance.net/chamikasathsara1',
  true
),
(
  'learning-algorithms',
  'Algorithms & Data Structures Repository',
  'Comprehensive implementation of fundamental computer science algorithms and memory-efficient data structures in C and C++, covering binary search trees, graph algorithms, sorting techniques, and algorithmic complexity benchmarks.',
  '/images/projects/learning-algorithms.webp',
  '["C", "C++", "Data Structures", "Algorithms", "Performance Optimization"]'::jsonb,
  'Web',
  'https://github.com/ChamikaSathsara/learning-algorithms',
  'https://github.com/ChamikaSathsara/learning-algorithms',
  false
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  image = excluded.image,
  technologies = excluded.technologies,
  category = excluded.category,
  github = excluded.github,
  live_url = excluded.live_url,
  featured = excluded.featured,
  updated_at = now();

-- 3. Blogs Seed
insert into public.blogs (id, slug, title, excerpt, content, cover_image, image, tags, published_at, date, medium_url, featured)
values
(
  'nextjs-caching-architecture-guide',
  'nextjs-caching-architecture-guide',
  'The Definitive Guide to Next.js Caching Architecture: Internals, Patterns, and Evolution',
  'A deep dive into Next.js App Router caching internals, semantic invalidation, cacheLife primitives, and high-performance server components for enterprise scale.',
  '# The Definitive Guide to Next.js Caching Architecture

*Originally published on Medium by Chamika Pathirage (@chamikasathsara1)*

Modern web applications demand lightning-fast response times combined with dynamic personalized data. In this guide, we break down the four caching layers of Next.js, how cache invalidation has evolved, and production architectural patterns.

## The Four Caching Layers

1. **Request Memoization** — Deduplicates identical `fetch` requests within a single React render tree cycle.
2. **Data Cache** — Persists HTTP fetch responses across incoming requests and user sessions.
3. **Full Route Cache** — Automatically stores static HTML and React Server Component (RSC) payloads at build time or during revalidation.
4. **Router Cache (Client-Side)** — In-memory browser cache storing visited routes and prefetched segments.

```tsx
// Revalidating cached data with tags
import { revalidateTag } from ''next/cache'';

export async function updateArticle(id: string) {
  ''use server'';
  await db.articles.update(id);
  revalidateTag(''articles'');
}
```

## Evolving Semantic Invalidation: cacheLife and cacheTag

Recent iterations of Next.js introduce declarative time profiles via `cacheLife`. Instead of hardcoding magic numbers for revalidation windows, teams define semantic caching tiers such as `seconds`, `minutes`, `hours`, and `days`.

## Production Architectural Takeaways

- Prefer granular data-level caching tags over whole-page purge cycles.
- Separate static shell layout components from dynamic user data segments.
- Monitor cache hit ratios in production to prevent unexpected cold start overhead.',
  '/images/blog/nextjs-caching.webp',
  '/images/blog/nextjs-caching.webp',
  '["Next.js", "Web Architecture", "Performance", "Caching"]'::jsonb,
  '2025-12-15',
  '2025-12-15',
  'https://medium.com/@chamikasathsara1',
  true
),
(
  'haptics-vibration-define-modern-ux',
  'haptics-vibration-define-modern-ux',
  'The Pulse of Interaction: Why Haptics and Vibration Define Modern UX',
  'Exploring the tactile dimension of digital products: how haptic technology, micro-vibrations, and physical affordances elevate accessibility and user delight.',
  '# The Pulse of Interaction: Why Haptics and Vibration Define Modern UX

*Originally published on Medium by Chamika Pathirage (@chamikasathsara1)*

For decades, digital user interfaces lived purely in visual and auditory dimensions. However, modern touch devices and wearable ecosystems have made tactile sensations — haptic feedback — a primary communication channel for UX engineers.

## The Power of Physical Affordances

When a user pulls to refresh or toggles an important switch, instantaneous micro-vibrations validate the physical boundary of the digital action. This creates what cognitive psychologists describe as tactile confirmation, reducing cognitive uncertainty and eliminating unnecessary double-taps.

## Designing for Accessibility

Haptics are indispensable for accessibility:

- **Dual Sensory Impairment** — Provides crucial non-visual feedback for users with combined visual and auditory limitations.
- **High-Distraction Environments** — In noisy or outdoor environments, tactile cues ensure critical notifications and confirmations are never missed.

## Haptic Design Guidelines for Developers

1. **Never Overuse Feedback** — Reserve haptics for decisive actions (success confirmations, destructive alerts, slider detents).
2. **Match Physical Dynamics** — Light tick pulses for transient items, firm sharp buzzes for errors or boundary limits.
3. **Respect User Preferences** — Always honor device-level accessibility toggles and respect reduced motion/tactile settings.',
  '/images/blog/haptics-ux.webp',
  '/images/blog/haptics-ux.webp',
  '["UX Design", "Haptics", "Mobile UX", "Accessibility"]'::jsonb,
  '2026-02-10',
  '2026-02-10',
  'https://medium.com/@chamikasathsara1',
  true
),
(
  'introducing-layered-architecture-web-applications',
  'introducing-layered-architecture-web-applications',
  'Introducing Layered Architecture for Web Applications',
  'How structuring web systems into Presentation, Application, Data Access, and Database layers drastically improves maintainability, reusability, and enterprise scale.',
  '# Introducing Layered Architecture for Web Applications

*Originally published on Medium by Chamika Pathirage (@chamikasathsara1)*

As web applications grow in size and complexity, codebases without deliberate architecture quickly deteriorate into ''spaghetti code.'' Layered Architecture is a foundational architectural pattern that divides software systems into distinct, self-contained logical layers.

## The Core Layers

1. **Presentation Layer (UI Layer)** — Responsible for capturing user interactions and presenting visual states. Should contain zero database access or business logic.
2. **Application Layer (Service Layer)** — The central brain that orchestrates workflows, validates business rules, and transforms data between layers.
3. **Data Access Layer (Repository Layer)** — Abstract layer handling all queries, mutations, and database connectors. Shields domain logic from specific ORMs or database drivers.
4. **Database Layer** — The physical persistence storage (PostgreSQL, MongoDB, DynamoDB).

```
[ Presentation Layer (UI / Next.js Pages) ]
                     ↓
[ Application Layer (Services & Business Logic) ]
                     ↓
[ Data Access Layer (Repositories & ORM) ]
                     ↓
[ Database (PostgreSQL / MongoDB / DynamoDB) ]
```

## Key Architectural Benefits

- **Separation of Concerns:** Each layer has a well-defined boundary.
- **Independent Scalability:** Workload bottlenecks can be isolated and scaled horizontally.
- **Testability:** Business logic can be unit-tested without mocking live database connections.
- **Maintainability:** Modifying database schemas or external APIs only affects the repository layer.',
  '/images/blog/layered-architecture.webp',
  '/images/blog/layered-architecture.webp',
  '["Software Architecture", "System Design", "Clean Architecture", "Engineering"]'::jsonb,
  '2025-03-20',
  '2025-03-20',
  'https://medium.com/@chamikasathsara1',
  true
),
(
  'ux-engineers-imperative-crafting-answers-ai',
  'ux-engineers-imperative-crafting-answers-ai',
  'The UX Engineer''s Imperative: Crafting ''Beautiful'' Answers for the AI Era',
  'Why raw model intelligence is insufficient without human-centered interfaces. How UX engineers shape trust, clarity, and delightful experiences in modern AI software.',
  '# The UX Engineer''s Imperative: Crafting ''Beautiful'' Answers for the AI Era

*Originally published on Medium by Chamika Pathirage (@chamikasathsara1)*

The explosion of generative models and large language models has fundamentally transformed software interaction. However, intelligence alone does not equal a great product.

## Beyond the Plain Chatbox

The plain text box is a primitive modality. Modern generative interfaces require rich micro-interactions, streaming state indicators, citation pills, collapsible artifact drawers, and bidirectional canvas editors.

## Designing for Trust and Latency

1. **Progressive Rendering** — Avoid jarring layout shifts by streaming tokens with smooth font transitions and stable height reservations.
2. **Explainability & Sourcing** — Enable interactive citations that allow users to inspect the underlying source data in one tap.
3. **Graceful Failure States** — Offer context-aware repair suggestions when an AI output fails validation.',
  '/images/blog/ai-ux.webp',
  '/images/blog/ai-ux.webp',
  '["AI & UX", "Product Design", "Frontend", "Human-Centered AI"]'::jsonb,
  '2026-03-12',
  '2026-03-12',
  'https://medium.com/@chamikasathsara1',
  false
)
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_image = excluded.cover_image,
  image = excluded.image,
  tags = excluded.tags,
  published_at = excluded.published_at,
  date = excluded.date,
  medium_url = excluded.medium_url,
  featured = excluded.featured,
  updated_at = now();

-- 4. Experience Seed
insert into public.experience (id, company, role, duration, period, start_date, end_date, description, skills, type, current)
values
(
  'qriomatrix-engineer',
  'QrioMatrix Technologies (Pvt) Ltd',
  'Software Frontend & Mobile Engineer',
  'June 2025 — Present',
  'June 2025 — Present',
  '2025-06',
  '',
  'Architecting and deploying responsive web and mobile front-end applications utilizing modern component libraries, TypeScript, and clean code principles. Collaborating closely with cross-functional design and engineering teams to translate wireframes into high-performance, polished user interfaces. Optimizing application state management and component structures for seamless cross-platform user experience flows.',
  '["TypeScript", "React", "Next.js", "Mobile UX", "State Management"]'::jsonb,
  'full-time',
  true
),
(
  'qriomatrix-trainee',
  'QrioMatrix Technologies (Pvt) Ltd',
  'Trainee Software Engineer',
  '1 Year 6 Months',
  '1 Year 6 Months',
  '2023-12',
  '2025-05',
  'Contributed to the complete software development lifecycle, implementing feature updates, conducting thorough code maintenance, and executing bug fixes. Supported backend integration workflows and participated in agile team planning sessions to ensure timely software delivery.',
  '["JavaScript", "React", "Git", "Agile", "Bug Fixing"]'::jsonb,
  'trainee',
  false
),
(
  'ntb-frimi',
  'NTB Bank — FriMi Digital Banking',
  'Digital Banking Operations',
  '6 Months',
  '6 Months',
  '2023-06',
  '2023-11',
  'Executed rigorous KYC (Know Your Customer) verification protocols, ensuring compliance with banking regulatory standards and security policies. Drove user acquisition and merchant onboarding strategies for FriMi digital wallet promotions, contributing directly to regional growth targets.',
  '["KYC Compliance", "FinTech", "Digital Wallets", "Operations"]'::jsonb,
  'internship',
  false
)
on conflict (id) do update set
  company = excluded.company,
  role = excluded.role,
  duration = excluded.duration,
  period = excluded.period,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  description = excluded.description,
  skills = excluded.skills,
  type = excluded.type,
  current = excluded.current,
  updated_at = now();

-- 5. Skills Seed
insert into public.skills (id, category, title, icon, skills)
values
(
  'frontend-mobile',
  'Frontend & Mobile',
  'Frontend & Mobile',
  'Monitor',
  '["JavaScript ES6+", "TypeScript", "Next.js", "React", "Mobile UI/UX", "Tailwind CSS", "shadcn/ui"]'::jsonb
),
(
  'backend-cloud',
  'Backend & Cloud',
  'Backend & Cloud',
  'Cloud',
  '["Node.js", "GraphQL", "REST APIs", "AWS Lambda", "DynamoDB", "Serverless Architecture"]'::jsonb
),
(
  'design',
  'Design',
  'Design',
  'Palette',
  '["Figma", "UI/UX Design", "Glassmorphism", "Minimalism", "Graphic Design", "Branding"]'::jsonb
),
(
  'business',
  'Business & Operations',
  'Business & Operations',
  'Briefcase',
  '["KYC Compliance", "Digital Wallet Promotions", "Client Communication", "Agile Project Coordination"]'::jsonb
)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  icon = excluded.icon,
  skills = excluded.skills,
  updated_at = now();
