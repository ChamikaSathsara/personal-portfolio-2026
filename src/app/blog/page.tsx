import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundManager from "@/components/ui/react-bits/BackgroundManager";
import { getDbBlogPosts, getDbSiteConfig } from "@/lib/supabase-db";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Clock, Tag, ArrowRight, Code, Cloud, PenTool } from "lucide-react";

export const metadata = {
  title: "Blog & Engineering Notes | Chamika Pathirage",
  description: "Articles on modern web architecture, AWS serverless, TypeScript, and UI/UX engineering.",
};

export default async function BlogIndexPage() {
  const posts = await getDbBlogPosts();
  const site = await getDbSiteConfig();

  return (
    <div className="relative min-h-screen text-slate-100">
      <BackgroundManager initialMode="aurora" showToggle={false} />
      <Navbar />

      <main className="container-custom pt-32 pb-24 relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="section-label">Engineering Notes</div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
            Articles & <span className="gradient-text">Case Studies.</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Practical insights on scalable full-stack development, cloud systems, and UX engineering patterns.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="glass-card overflow-hidden flex flex-col group">
              <div className="relative h-44 w-full bg-slate-900 border-b border-white/[0.08] flex items-center justify-center p-6">
                <BlogHeaderGraphic slug={post.slug} />
              </div>

              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-3">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readingTime} min
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors mb-3">
                    {post.title}
                  </h2>

                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 bg-white/[0.03] border border-white/[0.06]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono text-violet-400 hover:text-white transition-colors pt-4 border-t border-white/[0.08] w-full"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer site={site} />
    </div>
  );
}

function BlogHeaderGraphic({ slug }: { slug: string }) {
  if (slug.includes("nextjs") || slug.includes("caching")) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
          <Code size={20} />
        </div>
        <span className="text-[11px] font-mono text-slate-400">Next.js Caching</span>
      </div>
    );
  }
  if (slug.includes("layered") || slug.includes("architecture")) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
          <Cloud size={20} />
        </div>
        <span className="text-[11px] font-mono text-slate-400">Layered Architecture</span>
      </div>
    );
  }
  if (slug.includes("haptics") || slug.includes("vibration")) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
          <PenTool size={20} />
        </div>
        <span className="text-[11px] font-mono text-slate-400">Tactile Haptics UX</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
        <PenTool size={20} />
      </div>
      <span className="text-[11px] font-mono text-slate-400">AI & Human UX</span>
    </div>
  );
}
