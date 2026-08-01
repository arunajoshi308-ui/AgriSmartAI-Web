"use client";

import { useRef, type MouseEvent } from "react";

/**
 * Magnetic hover hook — element follows the cursor slightly.
 * Usage: const { ref, handleMove, handleLeave } = useMagnetic();
 * <button ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className="magnetic">...</button>
 */
export function useMagnetic(strength = 0.3) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  return { ref, handleMove, handleLeave };
}

/**
 * Ripple click effect — adds expanding circle on click.
 * Usage: const handleRipple = useRipple();
 * <button onClick={handleRipple} className="ripple-container">...</button>
 */
export function useRipple() {
  return (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple-effect";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };
}
