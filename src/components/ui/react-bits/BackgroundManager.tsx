"use client";

import React, { useState } from "react";
import Aurora from "./Aurora";
import Particles from "./Particles";
import Squares from "./Squares";
import { Sparkles, Layers, Grid, Waves } from "lucide-react";

type BackgroundMode = "aurora-particles" | "aurora" | "particles" | "squares";

interface BackgroundManagerProps {
  initialMode?: BackgroundMode;
  showToggle?: boolean;
}

export default function BackgroundManager({
  initialMode = "aurora-particles",
  showToggle = true,
}: BackgroundManagerProps) {
  const [mode, setMode] = useState<BackgroundMode>(initialMode);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base dark noise/space depth */}
        <div className="absolute inset-0 bg-[#06080F]" />

        {/* Dynamic Backgrounds based on mode */}
        {(mode === "aurora-particles" || mode === "aurora") && (
          <Aurora
            colorStops={["#7C3AED", "#06B6D4", "#4F46E5", "#EC4899"]}
            speed={0.8}
            className="absolute inset-0"
          />
        )}

        {(mode === "aurora-particles" || mode === "particles") && (
          <Particles
            particleCount={55}
            particleColors={["#A78BFA", "#38BDF8", "#818CF8", "#F472B6"]}
            speed={0.4}
            minDistance={110}
            className="absolute inset-0"
          />
        )}

        {mode === "squares" && (
          <Squares
            squareSize={48}
            borderColor="rgba(255, 255, 255, 0.04)"
            hoverFillColor="rgba(124, 58, 237, 0.18)"
            speed={0.3}
            className="absolute inset-0"
          />
        )}

        {/* Global ambient radial vignette to keep center readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, transparent 20%, rgba(6, 8, 15, 0.7) 80%, rgba(6, 8, 15, 0.95) 100%)",
          }}
        />
      </div>

      {/* Floating Interactive React Bits Background Switcher */}
      {showToggle && (
        <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end">
          {menuOpen && (
            <div className="mb-2 p-2 rounded-2xl glass-panel border border-white/10 shadow-2xl backdrop-blur-xl animate-fade-in flex flex-col gap-1 min-w-[170px]">
              <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/50">
                React Bits Background
              </div>
              <button
                onClick={() => {
                  setMode("aurora-particles");
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                  mode === "aurora-particles"
                    ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Sparkles size={13} className="text-violet-400" />
                <span>Aurora + Particles</span>
              </button>

              <button
                onClick={() => {
                  setMode("aurora");
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                  mode === "aurora"
                    ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Waves size={13} className="text-cyan-400" />
                <span>Aurora Borealis</span>
              </button>

              <button
                onClick={() => {
                  setMode("particles");
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                  mode === "particles"
                    ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Layers size={13} className="text-pink-400" />
                <span>Connected Particles</span>
              </button>

              <button
                onClick={() => {
                  setMode("squares");
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                  mode === "squares"
                    ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Grid size={13} className="text-emerald-400" />
                <span>Interactive Squares</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-card border border-white/10 hover:border-violet-500/40 text-xs font-mono text-white/80 hover:text-white transition-all shadow-lg hover:shadow-violet-500/10 hover:scale-105 active:scale-95"
            title="Switch Background Animation"
            aria-label="Switch Background Animation"
          >
            <Sparkles size={14} className="text-violet-400 animate-pulse" />
            <span className="hidden md:inline">React Bits FX</span>
          </button>
        </div>
      )}
    </>
  );
}
