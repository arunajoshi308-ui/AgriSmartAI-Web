"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up animation — animates from 0 to target when element enters viewport.
 */
export function useCountUp(target: number, duration = 1500): { ref: React.RefObject<HTMLDivElement>; value: number } {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // easeOutExpo for a professional deceleration
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, value };
}

/**
 * In-view detection — returns true when element scrolls into view.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.15): { ref: React.RefObject<T>; inView: boolean } {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
