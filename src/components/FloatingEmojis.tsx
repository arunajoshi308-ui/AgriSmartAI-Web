"use client";

import { useEffect, useState } from "react";

interface EmojiParticle {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const EMOJI_POOL = ["🌾", "🌱", "🌿", "🦋", "🐝", "💧", "☀️", "🧪", "🔬", "🧬", "📈", "🪴", "🍂", "🌍", "✨"];

export default function FloatingEmojis({ count = 14 }: { count?: number }) {
  const [emojis, setEmojis] = useState<EmojiParticle[]>([]);

  useEffect(() => {
    const generated: EmojiParticle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)],
      left: Math.random() * 100,
      size: 18 + Math.random() * 28,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 10,
      opacity: 0.08 + Math.random() * 0.12,
    }));
    setEmojis(generated);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {emojis.map((e) => (
        <div
          key={e.id}
          className="absolute"
          style={{
            left: `${e.left}%`,
            bottom: `-60px`,
            fontSize: `${e.size}px`,
            opacity: e.opacity,
            animation: `emojiFloat ${e.duration}s linear ${e.delay}s infinite`,
          }}
        >
          {e.emoji}
        </div>
      ))}
    </div>
  );
}
