"use client";

import { useMemo } from "react";

/**
 * Professional animated background — three layers:
 * 1. Aurora blobs: large blurred gradient circles that slowly drift
 * 2. Mesh grid: subtle dot/line pattern at ~3% opacity
 * 3. Floating geometric shapes: small shapes drifting upward at low opacity
 *
 * All pure CSS — no canvas, no rAF, no performance issues.
 * Fixed position behind all content (z-index: 0, content sits at z-index: 1).
 */

const SHAPES = [
  { size: 14, left: 5, delay: 0, duration: 18, shape: "rounded" },
  { size: 10, left: 12, delay: 3, duration: 22, shape: "circle" },
  { size: 18, left: 20, delay: 6, duration: 16, shape: "rounded" },
  { size: 8, left: 28, delay: 1, duration: 25, shape: "circle" },
  { size: 16, left: 35, delay: 4, duration: 20, shape: "rounded" },
  { size: 12, left: 42, delay: 8, duration: 19, shape: "circle" },
  { size: 14, left: 50, delay: 2, duration: 23, shape: "rounded" },
  { size: 10, left: 58, delay: 5, duration: 17, shape: "circle" },
  { size: 16, left: 65, delay: 7, duration: 21, shape: "rounded" },
  { size: 8, left: 72, delay: 3, duration: 24, shape: "circle" },
  { size: 14, left: 80, delay: 9, duration: 18, shape: "rounded" },
  { size: 12, left: 88, delay: 6, duration: 22, shape: "circle" },
  { size: 10, left: 95, delay: 1, duration: 20, shape: "rounded" },
];

const AURORA_COLORS = [
  { color: "#D1E67C", x: 10, y: 20, size: 400, delay: 0, duration: 20 },
  { color: "#D7C5F0", x: 80, y: 60, size: 350, delay: 5, duration: 25 },
  { color: "#FFE0B2", x: 50, y: 80, size: 300, delay: 10, duration: 18 },
  { color: "#B3E0FF", x: 90, y: 10, size: 280, delay: 3, duration: 22 },
];

export default function AnimatedBackground() {
  const shapes = useMemo(() => SHAPES, []);
  const auroras = useMemo(() => AURORA_COLORS, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Layer 1: Aurora blobs */}
      {auroras.map((blob, i) => (
        <div
          key={`aurora-${i}`}
          style={{
            position: "absolute",
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            width: `${blob.size}px`,
            height: `${blob.size}px`,
            borderRadius: "50%",
            background: blob.color,
            filter: "blur(80px)",
            opacity: 0.12,
            transform: "translate(-50%, -50%)",
            animation: `auroraDrift ${blob.duration}s ease-in-out infinite`,
            animationDelay: `${blob.delay}s`,
          }}
        />
      ))}

      {/* Layer 2: Mesh grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(28, 28, 22, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(28, 28, 22, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* Layer 3: Floating geometric shapes */}
      {shapes.map((shape, i) => (
        <div
          key={`shape-${i}`}
          style={{
            position: "absolute",
            bottom: "-30px",
            left: `${shape.left}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            borderRadius: shape.shape === "circle" ? "50%" : shape.shape === "rounded" ? "24%" : "0",
            border: "1.5px solid rgba(93, 98, 30, 0.08)",
            background: "rgba(209, 230, 124, 0.03)",
            animation: `bgShapeFloat ${shape.duration}s linear infinite`,
            animationDelay: `${shape.delay}s`,
          }}
        />
      ))}

      {/* Layer 4: Subtle radial vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(250, 250, 248, 0.5) 100%)",
        }}
      />
    </div>
  );
}
