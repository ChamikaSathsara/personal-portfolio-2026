"use client";

import React from "react";
import { ArrowRight, Sparkles, MapPin, Download, ExternalLink, Terminal, Code2, Smartphone, Cloud } from "lucide-react";
import { GithubIcon, LinkedinIcon, MediumIcon, BehanceIcon } from "@/components/ui/SocialIcons";
import Aurora from "@/components/ui/react-bits/Aurora";
import Particles from "@/components/ui/react-bits/Particles";
import type { SiteConfig } from "@/types";

interface HeroProps {
  site: SiteConfig;
}

const techStack = [
  { name: "Next.js 16", icon: Code2, color: "#FFFFFF", bg: "rgba(255,255,255,0.08)" },
  { name: "TypeScript", icon: Terminal, color: "#38BDF8", bg: "rgba(56,189,248,0.1)" },
  { name: "React & Native", icon: Smartphone, color: "#60A5FA", bg: "rgba(96,165,250,0.1)" },
  { name: "Node & Serverless", icon: Cloud, color: "#34D399", bg: "rgba(52,211,153,0.1)" },
  { name: "AWS & DynamoDB", icon: Cloud, color: "#FBBF24", bg: "rgba(251,191,36,0.1)" },
  { name: "UI/UX & Figma", icon: Sparkles, color: "#F472B6", bg: "rgba(244,114,182,0.1)" },
];

export default function Hero({ site }: HeroProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-20">
      {/* React Bits Background Animations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Aurora
          colorStops={["#7C3AED", "#06B6D4", "#6366F1", "#EC4899"]}
          speed={0.8}
          className="w-full h-full"
        />
        <Particles
          particleCount={45}
          particleColors={["#A78BFA", "#38BDF8", "#F472B6", "#818CF8"]}
          speed={0.4}
          minDistance={100}
          interactive={true}
          className="w-full h-full"
        />
      </div>

      {/* Hero Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border border-white/10 mb-8 animate-fade-in-up">
            <span className="status-dot">
              <span className="status-dot-ping" />
              <span className="status-dot-core" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Available for Full-Time Roles & High-Impact Projects
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-xs font-mono text-cyan-400 hidden sm:inline-flex items-center gap-1">
              <MapPin size={11} /> {site.location}
            </span>
          </div>

          {/* Main Title / Name */}
          <div className="mb-4">
            <span className="text-sm sm:text-base font-mono uppercase tracking-widest text-violet-400 block mb-3 font-semibold">
              Software Engineer & Creative Technologist
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white mb-4">
              CHAMIKA{" "}
              <span className="gradient-text">PATHIRAGE</span>
            </h1>
          </div>

          {/* Headline / Role */}
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-200 tracking-tight mb-6 max-w-3xl leading-snug">
            Full Stack Software & UI/UX Engineer
          </p>

          {/* Bio statement */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
            {site.shortBio ||
              "I build modern web and mobile experiences combining clean engineering, thoughtful UX, and scalable architecture."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={() => scrollTo("projects")}
              className="btn-primary group text-sm sm:text-base"
              id="hero-view-work"
            >
              <span>Explore Selected Work</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => scrollTo("contact")}
              className="btn-ghost text-sm sm:text-base"
              id="hero-get-in-touch"
            >
              <span>Get In Touch</span>
            </button>

            <button
              onClick={() => scrollTo("about")}
              className="p-3 rounded-full glass-card border border-white/10 hover:border-violet-500/40 text-slate-400 hover:text-white transition-all hidden sm:flex items-center justify-center"
              aria-label="Learn more about Chamika"
              title="Learn more"
            >
              <Sparkles size={16} className="text-violet-400" />
            </button>
          </div>

          {/* Tech Badges Pill Bar */}
          <div className="w-full pt-8 border-t border-white/[0.08] flex flex-col items-center">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-4">
              Core Technologies & Stack
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl">
              {techStack.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-white/[0.08] text-xs font-medium text-slate-200 hover:border-violet-500/30 transition-all cursor-default"
                    style={{ background: "rgba(15, 23, 42, 0.55)" }}
                  >
                    <Icon size={13} style={{ color: tech.color }} />
                    <span>{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Links floating pill */}
          <div className="mt-8 flex items-center gap-3">
            {site.socials.linkedin && (
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full glass-card border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={16} />
              </a>
            )}
            {site.socials.github && (
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full glass-card border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <GithubIcon size={16} />
              </a>
            )}
            {site.socials.medium && (
              <a
                href={site.socials.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full glass-card border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all hover:scale-110"
                aria-label="Medium"
              >
                <MediumIcon size={16} />
              </a>
            )}
            {site.socials.behance && (
              <a
                href={site.socials.behance}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full glass-card border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all hover:scale-110"
                aria-label="Behance"
              >
                <BehanceIcon size={16} />
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
