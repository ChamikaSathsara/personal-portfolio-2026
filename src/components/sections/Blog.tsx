"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Tag, Sparkles, BookOpen, Code, Cloud, PenTool, ExternalLink, Layers } from "lucide-react";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

interface BlogProps {
  posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
  return (
    <section id="blog" className="section-padding relative">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <div className="section-label">Engineering Notes</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
              Writing on <span className="gradient-text">Craft & Code.</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Thoughts, architectures, and practical guides on modern web engineering, cloud systems, and UX design.
            </p>
          </div>

          <Link
            href="/blog"
            className="btn-ghost text-sm self-start md:self-auto flex-shrink-0"
          >
            <span>View All Articles</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="glass-card overflow-hidden flex flex-col group relative">
      {/* Visual Cover Graphic (Custom Gradient Graphic - Never Breaks!) */}
      <div className="relative h-48 w-full bg-slate-900 border-b border-white/[0.08] overflow-hidden flex items-center justify-center p-6">
        <BlogGraphic slug={post.slug} />

        {post.featured && (
          <span className="absolute top-4 left-4 badge bg-violet-600/20 border-violet-500/40 text-violet-300 font-semibold">
            <Sparkles size={11} className="mr-1 text-violet-400" />
            Featured
          </span>
        )}

        <span className="absolute bottom-3 right-4 text-[11px] font-mono text-slate-400 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-md">
          <Clock size={11} />
          {post.readingTime} min read
        </span>
      </div>

      {/* Content */}
      <div className="p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="text-xs font-mono text-slate-400 mb-3">
            {formatDate(post.publishedAt)}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors mb-3 leading-snug">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-400 bg-white/[0.03] border border-white/[0.06]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] w-full text-xs font-mono">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-violet-400 hover:text-white transition-colors"
            >
              <span>Read Article</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="https://medium.com/@chamikasathsara1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 text-[11px]"
              title="Read on Medium"
            >
              <span>Medium</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function BlogGraphic({ slug }: { slug: string }) {
  if (slug.includes("nextjs") || slug.includes("caching")) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center group-hover:scale-105 transition-transform duration-500">
        <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
          <Code size={24} />
        </div>
        <span className="text-xs font-mono text-slate-300">Next.js Caching Architecture</span>
      </div>
    );
  }

  if (slug.includes("layered") || slug.includes("architecture")) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center group-hover:scale-105 transition-transform duration-500">
        <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
          <Layers size={24} />
        </div>
        <span className="text-xs font-mono text-slate-300">Layered Architecture for Web</span>
      </div>
    );
  }

  if (slug.includes("haptics") || slug.includes("vibration")) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center group-hover:scale-105 transition-transform duration-500">
        <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
          <Sparkles size={24} />
        </div>
        <span className="text-xs font-mono text-slate-300">Tactile Haptics & Modern UX</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center group-hover:scale-105 transition-transform duration-500">
      <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-300">
        <PenTool size={24} />
      </div>
      <span className="text-xs font-mono text-slate-300">Human-Centered AI Interfaces</span>
    </div>
  );
}
