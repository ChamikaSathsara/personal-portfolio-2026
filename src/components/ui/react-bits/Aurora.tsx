"use client";

import React, { CSSProperties } from "react";

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export default function Aurora({
  colorStops = ["#7C3AED", "#06B6D4", "#3B82F6", "#EC4899"],
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0,
  className = "",
  style,
  children,
}: AuroraProps) {
  const c1 = colorStops[0] || "#7C3AED";
  const c2 = colorStops[1] || "#06B6D4";
  const c3 = colorStops[2] || "#3B82F6";
  const c4 = colorStops[3] || "#EC4899";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
      }}
    >
      {/* Background Aurora Layers */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ opacity: 0.85 }}
        aria-hidden="true"
      >
        {/* Glow Blob 1 */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full blur-[100px] opacity-40 mix-blend-screen animate-aurora-1"
          style={{
            background: `radial-gradient(circle, ${c1} 0%, transparent 70%)`,
            animationDuration: `${18 / speed}s`,
          }}
        />

        {/* Glow Blob 2 */}
        <div
          className="absolute top-[10%] -right-[15%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full blur-[120px] opacity-35 mix-blend-screen animate-aurora-2"
          style={{
            background: `radial-gradient(circle, ${c2} 0%, transparent 68%)`,
            animationDuration: `${22 / speed}s`,
          }}
        />

        {/* Glow Blob 3 */}
        <div
          className="absolute bottom-[-10%] left-[20%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[110px] opacity-30 mix-blend-screen animate-aurora-3"
          style={{
            background: `radial-gradient(circle, ${c3} 0%, transparent 70%)`,
            animationDuration: `${26 / speed}s`,
          }}
        />

        {/* Glow Blob 4 (Accent) */}
        <div
          className="absolute top-[35%] left-[30%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] rounded-full blur-[90px] opacity-25 mix-blend-screen animate-aurora-4"
          style={{
            background: `radial-gradient(circle, ${c4} 0%, transparent 65%)`,
            animationDuration: `${20 / speed}s`,
          }}
        />

        {/* Soft atmospheric gradient sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {children}
    </div>
  );
}
