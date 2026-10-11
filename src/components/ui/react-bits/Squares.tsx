"use client";

import React, { useEffect, useRef } from "react";

interface SquaresProps {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  squareSize?: number;
  borderColor?: string;
  hoverFillColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Squares({
  direction = "diagonal",
  speed = 0.5,
  squareSize = 44,
  borderColor = "rgba(255, 255, 255, 0.05)",
  hoverFillColor = "rgba(139, 92, 246, 0.15)",
  className = "",
  style,
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hoveredCellRef = useRef<{ row: number; col: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridOffset = { x: 0, y: 0 };
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - (gridOffset.x % squareSize);
      const mouseY = e.clientY - rect.top - (gridOffset.y % squareSize);

      const col = Math.floor(mouseX / squareSize);
      const row = Math.floor(mouseY / squareSize);

      hoveredCellRef.current = { row, col };
    };

    const handleMouseLeave = () => {
      hoveredCellRef.current = null;
    };

    window.addEventListener("resize", resize);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    resize();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Advance offset based on direction
      const step = speed * 0.4;
      switch (direction) {
        case "diagonal":
          gridOffset.x = (gridOffset.x + step) % squareSize;
          gridOffset.y = (gridOffset.y + step) % squareSize;
          break;
        case "right":
          gridOffset.x = (gridOffset.x + step) % squareSize;
          break;
        case "left":
          gridOffset.x = (gridOffset.x - step) % squareSize;
          break;
        case "up":
          gridOffset.y = (gridOffset.y - step) % squareSize;
          break;
        case "down":
          gridOffset.y = (gridOffset.y + step) % squareSize;
          break;
      }

      const startX = -(gridOffset.x % squareSize);
      const startY = -(gridOffset.y % squareSize);

      const numCols = Math.ceil(width / squareSize) + 2;
      const numRows = Math.ceil(height / squareSize) + 2;

      ctx.lineWidth = 1;
      ctx.strokeStyle = borderColor;

      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const x = startX + c * squareSize;
          const y = startY + r * squareSize;

          const isHovered =
            hoveredCellRef.current &&
            hoveredCellRef.current.row === r &&
            hoveredCellRef.current.col === c;

          if (isHovered) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(x, y, squareSize, squareSize);
            ctx.strokeStyle = "rgba(167, 139, 250, 0.4)";
            ctx.strokeRect(x, y, squareSize, squareSize);
            ctx.strokeStyle = borderColor;
          } else {
            ctx.strokeRect(x, y, squareSize, squareSize);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed, squareSize, borderColor, hoverFillColor]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: "auto" }}
      />
    </div>
  );
}
