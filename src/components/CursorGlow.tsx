"use client";

import { useEffect, useRef } from "react";

/**
 * CursorGlow — a soft radial glow that follows the cursor across the page.
 * Desktop only, respects reduced motion, pointer-events none.
 * Uses rAF for smooth movement, cleans up on unmount.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Lerp toward cursor for smooth trailing
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      glow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        width: 400,
        height: 400,
        zIndex: 0,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(209, 230, 124, 0.08) 0%, transparent 60%)",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}
