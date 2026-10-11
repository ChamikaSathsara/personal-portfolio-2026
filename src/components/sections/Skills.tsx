"use client";

import React from "react";
import { Monitor, Cloud, Palette, Briefcase, LucideIcon, Sparkles, CheckCircle2 } from "lucide-react";
import type { SkillCategory } from "@/types";

interface SkillsProps {
  skills: SkillCategory[];
}

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Cloud,
  Palette,
  Briefcase,
};

const categoryTheme: Record<
  string,
  { color: string; bg: string; border: string; glow: string }
> = {
  Monitor: {
    color: "#A78BFA",
    bg: "rgba(167, 139, 250, 0.1)",
    border: "rgba(167, 139, 250, 0.25)",
    glow: "rgba(167, 139, 250, 0.15)",
  },
  Cloud: {
    color: "#38BDF8",
    bg: "rgba(56, 189, 248, 0.1)",
    border: "rgba(56, 189, 248, 0.25)",
    glow: "rgba(56, 189, 248, 0.15)",
  },
  Palette: {
    color: "#F472B6",
    bg: "rgba(244, 114, 182, 0.1)",
    border: "rgba(244, 114, 182, 0.25)",
    glow: "rgba(244, 114, 182, 0.15)",
  },
  Briefcase: {
    color: "#34D399",
    bg: "rgba(52, 211, 153, 0.1)",
    border: "rgba(52, 211, 153, 0.25)",
    glow: "rgba(52, 211, 153, 0.15)",
  },
};

export default function Skills({ skills }: SkillsProps) {
  return (
    <section id="skills" className="section-padding relative">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="section-label">Technical Matrix</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Technical Expertise{" "}
            <span className="gradient-text">Across the Stack.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            A comprehensive overview of tools, architectures, and design principles I leverage to deliver production-grade software.
          </p>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category) => {
            const Icon = iconMap[category.icon] || Monitor;
            const theme = categoryTheme[category.icon] || categoryTheme.Monitor;

            return (
              <div
                key={category.id}
                className="glass-card p-7 flex flex-col justify-between relative group hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Category Header with Icon */}
                  <div className="flex items-center gap-3.5 mb-6">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{
                        background: theme.bg,
                        border: `1px solid ${theme.border}`,
                      }}
                    >
                      <Icon size={20} style={{ color: theme.color }} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-slate-100 transition-colors">
                        {category.category}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {category.skills.length} competencies
                      </span>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-2.5">
                    {category.skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition-all"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: theme.color }}
                        />
                        <span className="text-xs font-medium text-slate-300">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom subtle indicator */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Proficiency</span>
                  <span style={{ color: theme.color }} className="font-semibold">
                    Production
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
