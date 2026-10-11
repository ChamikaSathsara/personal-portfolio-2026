"use client";

import React from "react";
import { GraduationCap, Award, Briefcase, Code, Sparkles, CheckCircle2, ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "@/types";

interface AboutProps {
  site: SiteConfig;
}

export default function About({ site }: AboutProps) {
  return (
    <section id="about" className="section-padding relative">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="section-label">About Me</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            Where Engineering Rigor meets{" "}
            <span className="gradient-text">Design Thinking.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            {site.bio}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Bento Card 1: Experience & Focus (Col span 2) */}
          <div className="glass-card p-8 md:col-span-2 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/20 transition-all duration-500" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Code size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Full Stack Architecture</h3>
                  <p className="text-xs font-mono text-slate-400">Scalable Web & Mobile Apps</p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Specialized in architecting cloud-native web systems, cross-platform mobile apps with React Native, and intuitive user experiences with high engineering fidelity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Next.js App Router & Server Components</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>React Native & Expo Ecosystem</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>AWS Lambda, DynamoDB & GraphQL</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                  <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>Figma UI/UX & Design Systems</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Production Experience</span>
              <span className="text-violet-400 font-semibold">QrioMatrix Technologies</span>
            </div>
          </div>

          {/* Bento Card 2: Education Card (Col span 2) */}
          <div className="glass-card p-8 md:col-span-1 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-600/20 transition-all duration-500" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Academic Honors</h3>
                    <p className="text-xs font-mono text-slate-400">Sabaragamuwa University of Sri Lanka</p>
                  </div>
                </div>
                <span className="badge text-[11px] bg-cyan-500/10 border-cyan-500/30 text-cyan-300">
                  2020 — 2025
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-white">
                    BSc. Hons in Computing & Information Systems
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Focused on core algorithms, modern distributed computing, database management, and human-computer interaction.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-400 block mb-0.5">Classification</span>
                    <span className="text-sm font-semibold text-white">Second Class Upper Division</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-400 block mb-0.5">Final GPA</span>
                    <span className="text-2xl font-black text-cyan-300">3.36</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center gap-2 text-xs font-mono text-slate-400">
              <Award size={14} className="text-cyan-400" />
              <span>Rigorous Computer Science & System Architecture</span>
            </div>
          </div>

          {/* Bento Card 3-6: Stats Row */}
          {site.stats.map((stat, i) => (
            <div
              key={i}
              className="glass-card p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:scale-[1.02] transition-transform"
            >
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2 group-hover:text-violet-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
