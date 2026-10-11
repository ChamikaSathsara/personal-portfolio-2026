import Link from "next/link";
import { FolderKanban, FileText, Star, TrendingUp } from "lucide-react";
import {
  getDbProjects,
  getDbBlogPosts,
  getDbFeaturedProjects,
  getDbFeaturedBlogPosts,
} from "@/lib/supabase-db";

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="panel p-6 group hover:border-[var(--border-strong)] transition-all block"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 border flex items-center justify-center"
          style={{ borderColor: `${color}40`, color }}
        >
          <Icon size={16} />
        </div>
        <TrendingUp size={13} className="text-[var(--muted-2)]" />
      </div>
      <div
        className="text-3xl font-black tracking-tight text-white mb-1 group-hover:text-[var(--primary-light)] transition-colors"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </div>
      <div
        className="text-xs font-mono uppercase tracking-widest text-[var(--muted-2)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </div>
    </Link>
  );
}

export default async function AdminDashboard() {
  const projects = await getDbProjects();
  const posts = await getDbBlogPosts();
  const featuredProjects = await getDbFeaturedProjects();
  const featuredPosts = await getDbFeaturedBlogPosts();

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-black tracking-tight text-white mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Manage your portfolio content. Changes generate downloadable JSON files.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)]">
        <StatCard
          label="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          href="/admin/projects"
          color="var(--primary)"
        />
        <StatCard
          label="Blog Posts"
          value={posts.length}
          icon={FileText}
          href="/admin/blogs"
          color="var(--secondary)"
        />
        <StatCard
          label="Featured Projects"
          value={featuredProjects.length}
          icon={Star}
          href="/admin/projects"
          color="var(--accent)"
        />
        <StatCard
          label="Featured Articles"
          value={featuredPosts.length}
          icon={Star}
          href="/admin/blogs"
          color="#F472B6"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border)]">
        <div className="panel p-6">
          <h2
            className="text-sm font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent Projects
          </h2>
          {projects.length === 0 ? (
            <p className="text-[var(--muted)] text-sm">No projects yet.</p>
          ) : (
            <ul className="space-y-2">
              {projects.slice(0, 4).map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)] truncate pr-2">{p.title}</span>
                  <span className="badge text-xs flex-shrink-0">{p.category}</span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/projects"
            className="mt-4 text-xs font-mono text-[var(--primary-light)] hover:text-white transition-colors block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Manage Projects →
          </Link>
        </div>

        <div className="panel p-6">
          <h2
            className="text-sm font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Recent Blog Posts
          </h2>
          {posts.length === 0 ? (
            <p className="text-[var(--muted)] text-sm">No blog posts yet.</p>
          ) : (
            <ul className="space-y-2">
              {posts.slice(0, 4).map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)] truncate pr-2">{p.title}</span>
                  {p.featured && <span className="badge text-xs flex-shrink-0 border-[var(--primary)]/40 text-[var(--primary-light)]">Featured</span>}
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/blogs"
            className="mt-4 text-xs font-mono text-[var(--primary-light)] hover:text-white transition-colors block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Manage Blog Posts →
          </Link>
        </div>
      </div>

      {/* Architecture note */}
      <div className="panel p-6 border-l-2 border-amber-500/50">
        <h3
          className="text-sm font-bold text-amber-400 mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Static Content Editor
        </h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          This is a front-end content editor — no backend required. When you edit content,
          the editor generates updated JSON that you can <strong className="text-white">download</strong> or{" "}
          <strong className="text-white">copy</strong> and commit to your repository.
          Images are provided as base64 previews — save them to{" "}
          <code className="text-[var(--secondary)] text-xs font-mono" style={{ fontFamily: "var(--font-mono)" }}>
            /public/images/
          </code>{" "}
          manually.
        </p>
      </div>
    </div>
  );
}
