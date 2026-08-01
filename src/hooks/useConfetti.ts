"use client";

import { useEffect, useRef } from "react";

interface ConfettiPiece {
  x: number; y: number; vx: number; vy: number;
  rotation: number; vr: number; color: string; size: number;
  life: number;
}

const COLORS = ["#D1E67C", "#5D621E", "#FFE0B2", "#D7C5F0", "#B3E0FF", "#E7E9D9"];
const EMOJIS = ["🎉", "✨", "🌟", "💫", "🎊"];

/**
 * Confetti burst — fires a short confetti animation on a canvas overlay.
 * Call fireConfetti() to trigger. Auto-cleans up.
 */
export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const fireConfetti = (x?: number, y?: number) => {
    // Clean up any existing canvas
    if (canvasRef.current) {
      canvasRef.current.remove();
      canvasRef.current = null;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const originX = x ?? window.innerWidth / 2;
    const originY = y ?? window.innerHeight / 2;

    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.5;
      const speed = 4 + Math.random() * 8;
      pieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        life: 1,
      });
    }

    // Add emoji confetti
    const emojiPieces: { x: number; y: number; vx: number; vy: number; emoji: string; size: number; life: number; rotation: number; vr: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      emojiPieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        size: 16 + Math.random() * 12,
        life: 1,
        rotation: Math.random() * 0.4,
        vr: (Math.random() - 0.5) * 0.1,
      });
    }

    const gravity = 0.25;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      let alive = false;

      pieces.forEach((p) => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.vx *= 0.99;
        p.rotation += p.vr;
        p.life -= 0.012;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      emojiPieces.forEach((p) => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity * 0.8;
        p.vx *= 0.98;
        p.life -= 0.01;
        p.rotation += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      });

      ctx.globalAlpha = 1;

      if (alive && frame < 200) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        canvas.remove();
        canvasRef.current = null;
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (canvasRef.current) canvasRef.current.remove();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return fireConfetti;
}
