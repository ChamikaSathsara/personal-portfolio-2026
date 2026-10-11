"use client";

import React from "react";
import { Briefcase, Calendar, MapPin, Building2, CheckCircle2 } from "lucide-react";
import type { ExperienceItem } from "@/types";

interface ExperienceProps {
  experience: ExperienceItem[];
}

const typeConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  "full-time": {
    label: "Full-Time",
    bg: "rgba(16, 185, 129, 0.12)",
    text: "#34D399",
    border: "rgba(16, 185, 129, 0.3)",
  },
  trainee: {
    label: "Trainee",
    bg: "rgba(56, 189, 248, 0.12)",
    text: "#38BDF8",
    border: "rgba(56, 189, 248, 0.3)",
  },
  internship: {
    label: "Internship",
    bg: "rgba(167, 139, 250, 0.12)",
    text: "#A78BFA",
    border: "rgba(167, 139, 250, 0.3)",
  },
  contract: {
    label: "Contract",
    bg: "rgba(251, 191, 36, 0.12)",
    text: "#FBBF24",
    border: "rgba(251, 191, 36, 0.3)",
  },
};

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="section-padding relative">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="section-label">Career Journey</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Where I&apos;ve <span className="gradient-text">Made an Impact.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Track record of shipping production code, driving product features, and ensuring operational compliance.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-6 sm:pl-10 border-l border-white/10 space-y-12">
          {experience.map((item) => {
            const typeStyle = typeConfig[item.type] || typeConfig["full-time"];

            return (
              <div key={item.id} className="relative group">
                {/* Timeline Node */}
                <div
                  className={`absolute -left-[31px] sm:-left-[47px] top-6 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    item.current
                      ? "bg-emerald-400 border-white shadow-[0_0_16px_rgba(16,185,129,0.8)] scale-125"
                      : "bg-[#06080F] border-slate-500 group-hover:border-violet-400 group-hover:bg-violet-500/30"
                  }`}
                />

                {/* Experience Card */}
                <div className="glass-card p-8 group-hover:border-violet-500/30 transition-all">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">
                          {item.role}
                        </h3>
                        {item.current && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Current Position
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-violet-400 font-semibold">
                        <Building2 size={16} />
                        <span>{item.company}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center md:flex-col md:items-end gap-2.5">
                      <span
                        className="badge text-xs"
                        style={{
                          background: typeStyle.bg,
                          color: typeStyle.text,
                          borderColor: typeStyle.border,
                        }}
                      >
                        {typeStyle.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400">
                        <Calendar size={12} />
                        {item.duration}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
