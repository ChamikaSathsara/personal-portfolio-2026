import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, Calendar, Sparkles, BookOpen } from "lucide-react";
import {
  getDbBlogPosts,
  getDbBlogPostBySlug,
  getDbSiteConfig,
} from "@/lib/supabase-db";
import { formatDate } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundManager from "@/components/ui/react-bits/BackgroundManager";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getDbBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getDbBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Chamika Pathirage`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getDbBlogPostBySlug(slug);
  const site = await getDbSiteConfig();

  if (!post) {
    notFound();
  }

  // Simple markdown-to-HTML parser for basic formatting
  const renderContent = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("# "))
          return `<h1 class="text-3xl font-black tracking-tight text-white mt-10 mb-5">${line.slice(2)}</h1>`;
        if (line.startsWith("## "))
          return `<h2 class="text-2xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">${line.slice(3)}</h2>`;
        if (line.startsWith("### "))
          return `<h3 class="text-xl font-bold text-violet-300 mt-6 mb-3">${line.slice(4)}</h3>`;
        if (line.startsWith("```"))
          return i % 2 === 0
            ? `<pre class="bg-slate-900/90 border border-white/10 rounded-xl p-5 my-5 overflow-x-auto text-sm text-cyan-300 font-mono"><code>`
            : `</code></pre>`;
        if (line.startsWith("- "))
          return `<li class="text-slate-300 ml-4 mb-2 flex items-start gap-2"><span class="text-violet-400 mt-1 font-bold">•</span><span>${line.slice(2)}</span></li>`;
        if (line.match(/^\d+\. /))
          return `<li class="text-slate-300 ml-4 mb-2 list-decimal">${line.replace(/^\d+\. /, "")}</li>`;
        if (line === "") return `<div class="h-4"></div>`;
        if (line.startsWith("**") && line.endsWith("**"))
          return `<strong class="text-white font-semibold">${line.slice(2, -2)}</strong>`;
        return `<p class="text-slate-300 leading-relaxed mb-4 text-base">${line
          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
          .replace(/`(.*?)`/g, '<code class="bg-white/10 px-2 py-0.5 rounded text-cyan-300 font-mono text-xs">$1</code>')}</p>`;
      })
      .join("");
  };

  return (
    <div className="relative min-h-screen text-slate-100">
      <BackgroundManager initialMode="aurora" showToggle={false} />
      <Navbar />

      <main className="pt-32 pb-24 relative z-10">
        <div className="container-custom max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-mono mb-8 group"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to All Articles</span>
          </Link>

          {/* Header */}
          <header className="mb-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="badge bg-violet-600/10 border-violet-500/30 text-violet-300 text-xs font-mono">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-5 text-xs font-mono text-slate-400 border-t border-b border-white/10 py-4">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-violet-400" />
                {formatDate(post.publishedAt)}
              </span>
              {post.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-cyan-400" />
                  {post.readingTime} min read
                </span>
              )}
              <span className="ml-auto text-slate-300 font-semibold">{site.name}</span>
            </div>
          </header>

          {/* Decorative Post Banner */}
          <div className="p-8 rounded-2xl glass-card border border-white/10 mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-violet-400" />
              <div>
                <span className="text-xs font-mono text-slate-400 block">Engineering Publication</span>
                <span className="text-sm font-semibold text-white">Full Stack & System Architecture</span>
              </div>
            </div>
            <Sparkles size={18} className="text-cyan-400" />
          </div>

          {/* Content */}
          <div
            className="prose-custom space-y-2 text-slate-300"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />

          {/* Footer CTA */}
          <div className="mt-16 glass-panel p-8 text-center rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-2">Enjoyed this article?</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              I write about building scalable web & mobile systems. Reach out if you&apos;d like to discuss engineering or collaborate.
            </p>
            <Link href="/#contact" className="btn-primary inline-flex">
              Get In Touch
            </Link>
          </div>
        </div>
      </main>

      <Footer site={site} />
    </div>
  );
}
