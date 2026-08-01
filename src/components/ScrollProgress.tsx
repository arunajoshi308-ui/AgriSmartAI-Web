"use client";

import { useEffect, useState } from "react";

/**
 * Scroll progress bar — thin animated bar at the top of the page.
 * Shows how far the user has scrolled. Fixed position, pointer-events none.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
      rafId = 0;
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none" style={{ height: 3 }}>
      <div
        className="h-full transition-[width] duration-75 ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #D1E67C, #5D621E, #D1E67C)",
          boxShadow: "0 0 8px rgba(209, 230, 124, 0.5)",
        }}
      />
    </div>
  );
}
