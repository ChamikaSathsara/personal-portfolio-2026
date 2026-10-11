"use client";

import React, { useState } from "react";
import { ExternalLink, Sparkles, Layers, ArrowUpRight, Smartphone, Database, Layout, Code2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectsProps {
  projects: Project[];
}

const categories = ["All", "Full Stack", "Mobile", "UI/UX", "Web"] as const;

export default function Projects({ projects }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="section-padding relative">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="max-w-2xl">
            <div className="section-label">Featured Works</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
              Built with <span className="gradient-text">Intention & Precision.</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Explore key software systems, mobile applications, and interface architectures engineered for scale and usability.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-full glass-card border border-white/10 w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all",
                  activeFilter === cat
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="glass-card overflow-hidden flex flex-col group relative">
      {/* Decorative Top Graphical Preview Header (Custom SVG / UI Mockup) */}
      <div className="relative h-56 sm:h-64 w-full bg-[#0B0F19] border-b border-white/[0.08] flex items-center justify-center overflow-hidden p-6">
        <ProjectVisual category={project.category} id={project.id} />

        {/* Feature badge */}
        {project.featured && (
          <span className="absolute top-4 left-4 badge bg-violet-600/20 border-violet-500/40 text-violet-300 font-semibold">
            <Sparkles size={11} className="mr-1 text-violet-400" />
            Featured Project
          </span>
        )}

        {/* Category badge */}
        <span className="absolute top-4 right-4 badge text-slate-300 bg-slate-900/60 backdrop-blur-md">
          {project.category}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors mb-3">
            {project.title}
          </h3>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-md text-xs font-mono text-slate-300 bg-white/[0.04] border border-white/[0.08]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/[0.08]">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-400 hover:text-white transition-colors"
              >
                <span>Live Preview</span>
                <ArrowUpRight size={14} />
              </a>
            ) : (
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>Enterprise Architecture</span>
              </span>
            )}

            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors ml-auto"
              >
                <GithubIcon size={14} />
                <span>Source Code</span>
              </a>
            ) : (
              <span className="text-xs font-mono text-slate-400 ml-auto">
                Internal IP
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Graphic Mockup Renderer for projects (Ensures crisp visuals without broken image URLs)
function ProjectVisual({ category, id }: { category: string; id: string }) {
  if (id === "hiretrace-io") {
    return (
      <div className="w-full max-w-sm rounded-xl bg-slate-900/90 border border-white/10 p-4 shadow-2xl transition-transform duration-500 group-hover:scale-105">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500/80" />
          </div>
          <span className="text-[10px] font-mono text-emerald-400">HireTrace.io ATS Dashboard</span>
        </div>
        <div className="space-y-2">
          <div className="h-4 rounded bg-emerald-600/30 w-3/4 animate-pulse flex items-center px-2 text-[9px] font-mono text-emerald-300">
            Candidate Pipeline Active
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="h-10 rounded bg-cyan-600/20 border border-cyan-500/30 flex flex-col justify-center items-center text-[8px] font-mono text-cyan-300">
              <span>Applied</span>
              <span className="font-bold">142</span>
            </div>
            <div className="h-10 rounded bg-purple-600/20 border border-purple-500/30 flex flex-col justify-center items-center text-[8px] font-mono text-purple-300">
              <span>Interview</span>
              <span className="font-bold">28</span>
            </div>
            <div className="h-10 rounded bg-emerald-600/20 border border-emerald-500/30 flex flex-col justify-center items-center text-[8px] font-mono text-emerald-300">
              <span>Offered</span>
              <span className="font-bold">12</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (id === "layered-architecture-web") {
    return (
      <div className="w-full max-w-sm rounded-xl bg-slate-900/90 border border-white/10 p-4 shadow-2xl transition-transform duration-500 group-hover:scale-105">
        <div className="flex items-center gap-2 mb-3">
          <Database size={16} className="text-violet-400" />
          <span className="text-xs font-mono text-violet-300 font-semibold">4-Tier Clean Architecture</span>
        </div>
        <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-black/40 border border-violet-500/20 text-[10px] font-mono">
          <div className="flex justify-between text-cyan-300"><span>1. Presentation Layer</span><span>UI / React</span></div>
          <div className="flex justify-between text-violet-300"><span>2. Application Layer</span><span>Domain Services</span></div>
          <div className="flex justify-between text-amber-300"><span>3. Repository Layer</span><span>Data Access</span></div>
          <div className="flex justify-between text-emerald-300"><span>4. Database Layer</span><span>PostgreSQL / Mongo</span></div>
        </div>
      </div>
    );
  }

  if (id === "knoit-keyboard") {
    return (
      <div className="w-48 rounded-2xl bg-slate-900 border-2 border-white/20 p-3 shadow-2xl flex flex-col items-center transition-transform duration-500 group-hover:scale-105">
        <div className="w-12 h-1.5 rounded-full bg-white/20 mb-3" />
        <div className="w-full space-y-1.5">
          <div className="h-6 rounded bg-violet-600/40 border border-violet-500/50 flex items-center px-2 text-[8px] font-mono text-white justify-between">
            <span>KnoitKeyboard</span>
            <span>Q W E R T Y</span>
          </div>
          <div className="h-5 rounded bg-white/5 border border-white/10 flex items-center px-2 text-[8px] font-mono text-slate-300">
            Haptic Touch Feedback
          </div>
          <div className="h-5 rounded bg-cyan-600/20 border border-cyan-500/30 flex items-center px-2 text-[8px] font-mono text-cyan-300">
            Native Android SDK
          </div>
        </div>
      </div>
    );
  }

  if (id === "learning-algorithms") {
    return (
      <div className="w-full max-w-sm rounded-xl bg-slate-900/90 border border-white/10 p-4 shadow-2xl transition-transform duration-500 group-hover:scale-105">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono text-cyan-400 font-semibold">C/C++ Data Structures</span>
          <span className="text-[10px] font-mono text-slate-400">O(log n) Benchmarks</span>
        </div>
        <div className="space-y-1 text-[10px] font-mono text-slate-400 bg-black/40 p-2.5 rounded-lg border border-white/10">
          <div className="text-cyan-300">void binarySearch(int arr[], int n) &#123; ... &#125;</div>
          <div className="text-emerald-300">struct TreeNode &#123; int val; ... &#125;;</div>
          <div className="text-violet-300">std::vector&lt;int&gt; graphTraversal();</div>
        </div>
      </div>
    );
  }

  // Fallback: Behance UI/UX design kit
  return (
    <div className="w-full max-w-sm rounded-xl bg-slate-900/90 border border-white/10 p-4 shadow-2xl transition-transform duration-500 group-hover:scale-105">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-pink-400 font-semibold">Behance Portfolio Showcase</span>
        <span className="text-[10px] font-mono text-slate-400">Figma → Product</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <div className="h-8 rounded bg-violet-500/40 flex items-center justify-center text-[9px] font-mono text-white">#7C3AED</div>
        <div className="h-8 rounded bg-cyan-500/40 flex items-center justify-center text-[9px] font-mono text-white">#06B6D4</div>
        <div className="h-8 rounded bg-pink-500/40 flex items-center justify-center text-[9px] font-mono text-white">#EC4899</div>
        <div className="h-8 rounded bg-emerald-500/40 flex items-center justify-center text-[9px] font-mono text-white">#10B981</div>
      </div>
      <div className="mt-3 h-2 rounded bg-white/10 w-4/5" />
    </div>
  );
}
