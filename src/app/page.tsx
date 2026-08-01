"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProximityHover from "@/components/ProximityHover";
import { useRipple } from "@/hooks/useAnimations";
import { useCountUp } from "@/hooks/useCountUp";
import { useConfetti } from "@/hooks/useConfetti";
import { useTilt, useMagnetic } from "@/hooks/useInteractions";

const TEAM = [
  { name: "Shourya", emoji: "🌾", color: "bg-bento-lime" },
  { name: "Pranav J", emoji: "🔬", color: "bg-bento-peach" },
  { name: "Pratyush", emoji: "📊", color: "bg-bento-lavender" },
  { name: "Pranav K", emoji: "🤖", color: "bg-bento-skyblue" },
  { name: "Rohan", emoji: "🌱", color: "bg-bento-warm" },
  { name: "Mayank", emoji: "🧪", color: "bg-bento-peach" },
  { name: "Nikunj", emoji: "🦋", color: "bg-bento-lavender" },
];

const STATS = [
  { value: 99, suffix: "%", label: "AI Accuracy", icon: "🎯" },
  { value: 8, suffix: "+", label: "Crop Types", icon: "🌾" },
  { value: 24, suffix: "/7", label: "AI Assist", icon: "🤖" },
  { value: 7, suffix: "", label: "Innovators", icon: "👥" },
];

const FEATURES = [
  { href: "/scanner", icon: "📷", title: "Disease Scanner", desc: "Snap a leaf photo for instant AI diagnosis", color: "bg-bento-peach" },
  { href: "/chat", icon: "🧠", title: "AI Crop Advisor", desc: "24/7 agronomy chat with Gemini 3.5 Flash", color: "bg-bento-lavender" },
  { href: "/yield", icon: "📊", title: "Yield Optimizer", desc: "Calculate crop yield & revenue forecasts", color: "bg-bento-skyblue" },
  { href: "/history", icon: "🕘", title: "Scan History", desc: "Review past disease scans & lab results", color: "bg-bento-warm" },
];

const MARQUEE_ITEMS = [
  "🌱 AI-Powered Farming", "🌾 99% Accuracy", "🤖 Gemini 3.5 Flash",
  "📷 Disease Detection", "📊 Yield Forecasting", "💧 Smart Irrigation",
  "🧪 Soil Analysis", "🌿 Class 9 Innovators",
];

const ENTRANCE = ["animate-fadeUp", "animate-fadeLeft", "animate-fadeUp", "animate-fadeRight"];

function StatTile({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const { ref, value } = useCountUp(stat.value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-lg md:text-xl mb-1 animate-float" style={{ animationDelay: `${0.4 * (index + 1)}s` }}>{stat.icon}</div>
      <p className="text-xl md:text-3xl font-black text-bento-lime" style={{ textShadow: "0 2px 12px rgba(28,28,22,0.95)" }}>
        {value}{stat.suffix}
      </p>
      <p className="text-[9px] md:text-[10px] font-bold text-white/70 uppercase mt-1" style={{ textShadow: "0 1px 4px rgba(28,28,22,0.85)" }}>{stat.label}</p>
    </div>
  );
}

function FeatureCard({ feat, index }: { feat: typeof FEATURES[0]; index: number }) {
  const tiltRef = useTilt<HTMLAnchorElement>(6);
  return (
    <Link
      ref={tiltRef}
      href={feat.href}
      className={`bento-card ${feat.color} p-4 md:p-5 hover-lift press group relative overflow-hidden border-trace ${ENTRANCE[index % ENTRANCE.length]}`}
      style={{ animationDelay: `${0.1 * (index + 1)}s`, transitionTimingFunction: "var(--ease)", transformStyle: "preserve-3d" }}
    >
      <div className="absolute -top-8 -right-8 w-16 md:w-20 h-16 md:h-20 rounded-full border-2 border-bento-dark/8 animate-spin-slow" />
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-bento-dark flex items-center justify-center mb-2 md:mb-3 transition-transform group-hover:animate-wiggle hover-icon relative z-10">
        <span className="text-base md:text-lg">{feat.icon}</span>
      </div>
      <h3 className="font-black text-bento-dark text-sm md:text-base relative z-10">{feat.title}</h3>
      <p className="text-[11px] md:text-xs font-bold text-bento-olive mt-1 relative z-10 leading-tight">{feat.desc}</p>
    </Link>
  );
}

export default function Home() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const ripple = useRipple();
  const fireConfetti = useConfetti();

  const ctaRef = useMagnetic<HTMLAnchorElement>(0.25);
  const heroTilt = useTilt<HTMLDivElement>(5);
  const aboutTilt = useTilt<HTMLDivElement>(4);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleFeedbackSubmit = (e: React.MouseEvent<HTMLElement>) => {
    if (!feedback.trim()) return;
    ripple(e);
    fireConfetti(e.clientX, e.clientY);
    setSubmitted(true);
    setFeedback("");
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6 page-enter pb-24 md:pb-6">
      {/* ===== HERO ===== */}
      <div ref={heroTilt} className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeDown" style={{ height: 360, transition: "transform 0.2s var(--ease)" }}>
        <ProximityHover shape="hexagon" fill="stroke" strokeWidth={2} particleColor="#D1E67C" gradientColor="#5D621E" backgroundColor="#1C1C16" maxSize={40} minSize={5} gap={6} influence={280} rotateOnHover autoPulse />
        <div className="absolute inset-0 bg-gradient-to-b from-bento-dark/40 via-transparent to-bento-dark/50 pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">
          <span className="bg-bento-lime text-bento-dark text-[9px] md:text-[10px] font-black px-3 md:px-4 py-1.5 rounded-full mb-3 md:mb-4 pointer-events-auto border-2 border-bento-dark animate-fadeUp delay-2 animate-gentle-bounce">● AI ACTIVE • CLASS 9</span>
          <div className="hero-title-wrap">
            <h1 className="text-2xl md:text-5xl font-black text-white text-center leading-tight animate-fadeUp delay-3" style={{ textShadow: "0 4px 24px rgba(28,28,22,0.95), 0 2px 4px rgba(28,28,22,0.85)" }}>AgriSmart AI 🌾</h1>
          </div>
          <p className="text-bento-lime font-bold text-xs md:text-lg mt-2 md:mt-3 text-center animate-fadeUp delay-4" style={{ textShadow: "0 2px 8px rgba(28,28,22,0.9)" }}>Move your cursor across the grid ✨</p>
          <Link
            ref={ctaRef}
            href="/chat"
            className="mt-4 md:mt-5 pointer-events-auto ripple-container btn-anim btn-glow-trail btn-cta inline-flex items-center justify-center gap-2 bg-bento-lime text-bento-dark font-black text-xs md:text-sm px-6 md:px-7 py-3 rounded-2xl border-2 border-bento-dark mobile-touch shimmer-sweep"
            style={{ transitionTimingFunction: "var(--ease-spring)" }}
          >
            💬 START CHATTING WITH AI
          </Link>
        </div>
      </div>

      {/* ===== MARQUEE ===== */}
      <div className="marquee bento-border bg-bento-dark rounded-2xl py-2.5 animate-fadeIn overflow-hidden">
        <div className="marquee-content">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <span key={i} className="text-bento-lime font-black text-xs md:text-sm whitespace-nowrap px-6">{text}</span>
          ))}
        </div>
      </div>

      {/* ===== FEATURE GRID — 3D tilt cards ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {FEATURES.map((feat, i) => (
          <FeatureCard key={feat.href} feat={feat} index={i} />
        ))}
      </div>

      {/* ===== STATS ===== */}
      <div
        className={`relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark ${visibleSections.has("stats") ? "animate-fadeUp" : "opacity-0"}`}
        data-reveal id="stats" style={{ height: 130 }}
      >
        <ProximityHover shape="circle" fill="solid" particleColor="#D1E67C" gradientColor="#8B9530" backgroundColor="#1C1C16" maxSize={18} minSize={3} gap={10} influence={200} autoPulse />
        <div className="absolute inset-0 bg-gradient-to-r from-bento-dark/45 via-bento-dark/35 to-bento-dark/45 pointer-events-none" />
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 items-center px-4">
          {STATS.map((stat, i) => <StatTile key={stat.label} stat={stat} index={i} />)}
        </div>
      </div>

      {/* ===== ABOUT ===== */}
      <div
        ref={aboutTilt}
        className={`bento-card bg-bento-warm p-4 md:p-7 hover-lift overflow-hidden ${visibleSections.has("about") ? "reveal-left visible" : "reveal-left"}`}
        data-reveal id="about"
        style={{ transitionTimingFunction: "var(--ease)", transformStyle: "preserve-3d" }}
      >
        <div className="absolute top-4 right-4 w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-bento-dark/10 animate-spin-slow" />
        <div className="absolute -bottom-3 -right-3 text-5xl opacity-10 animate-float-sway select-none">🌱</div>
        <h2 className="font-black text-bento-dark text-base md:text-lg mb-2 md:mb-3 relative z-10 heading-underline">🌱 About AgriSmart AI</h2>
        <p className="text-xs md:text-sm font-medium text-bento-olive leading-relaxed relative z-10">
          AgriSmart AI is an AI-powered agricultural assistant created by Class 9 Student Innovators.
          Our mission is to empower farmers with cutting-edge AI technology for crop yield optimization,
          real-time plant disease detection, and expert agronomy advisory — all in one app.
        </p>
        <div className="flex flex-wrap gap-2 mt-3 md:mt-4 relative z-10">
          {["Gemini 3.5 Flash", "Disease Detection", "Yield Forecasting", "Soil Analysis"].map((tag, i) => (
            <span key={tag} className="bento-border rounded-xl px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-black text-bento-dark hover-pop cursor-default hover-glow" style={{ background: ["#D1E67C", "#FFE0B2", "#D7C5F0", "#B3E0FF"][i] }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ===== TEAM ===== */}
      <div
        className={`relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark hover-lift ${visibleSections.has("team") ? "reveal-scale visible" : "reveal-scale"}`}
        data-reveal id="team" style={{ minHeight: 280 }}
      >
        <div className="absolute inset-0">
          <ProximityHover shape="rounded" fill="solid" particleColor="#D1E67C" gradientColor="#5D621E" backgroundColor="#1C1C16" maxSize={24} minSize={3} gap={8} influence={220} autoPulse />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bento-dark/55 via-bento-dark/35 to-bento-dark/55 pointer-events-none" />
        <div className="relative z-10 p-4 md:p-7">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl md:text-2xl animate-float">👥</span>
            <h2 className="font-black text-bento-lime text-lg md:text-xl heading-underline" style={{ textShadow: "0 2px 12px rgba(28,28,22,0.95)" }}>Meet the Team</h2>
          </div>
          <p className="text-xs md:text-sm font-bold text-white/80 mb-3 md:mb-4" style={{ textShadow: "0 1px 6px rgba(28,28,22,0.85)" }}>Class 9 Student Innovators behind AgriSmart AI</p>
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 ${visibleSections.has("team") ? "stagger visible" : "stagger"}`}>
            {TEAM.map((member) => (
              <div key={member.name} className="flex items-center gap-2 md:gap-3 bg-white/15 backdrop-blur-md border-2 border-bento-lime/40 rounded-2xl p-2.5 md:p-3 hover:border-bento-lime hover:bg-white/25 transition-all hover-lift hover-glow" style={{ transitionTimingFunction: "var(--ease)" }}>
                <div className={`${member.color} w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-bento-dark flex items-center justify-center text-base md:text-lg flex-shrink-0 hover-icon`}>{member.emoji}</div>
                <div className="min-w-0">
                  <p className="font-black text-white text-xs md:text-sm truncate drop-shadow">{member.name}</p>
                  <p className="text-[9px] md:text-[10px] font-bold text-bento-lime">Student Innovator</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FEEDBACK ===== */}
      <div
        className={`bento-card bg-white p-4 md:p-7 ${visibleSections.has("feedback") ? "reveal-right visible" : "reveal-right"}`}
        data-reveal id="feedback"
      >
        <div className="absolute -top-2 -right-2 text-4xl opacity-10 animate-sway select-none">📝</div>
        <h2 className="font-black text-bento-dark text-base md:text-lg mb-2 heading-underline">📝 Student Feedback</h2>
        <p className="text-xs md:text-sm font-bold text-bento-olive mb-3 md:mb-4">We&apos;d love to hear from you! Rate AgriSmart AI and share your thoughts.</p>
        <div className="flex gap-2 mb-3 md:mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className={`text-2xl md:text-3xl transition-all hover:scale-125 active:scale-90 mobile-touch press ${star <= rating ? "animate-pop" : "grayscale opacity-40"}`} style={{ transitionTimingFunction: "var(--ease-spring)" }}>⭐</button>
          ))}
        </div>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Share your feedback..." className="w-full bento-border rounded-2xl p-3 md:p-4 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-bento-lime bg-bento-bg transition-all" rows={3} />
        <button onClick={handleFeedbackSubmit} className="mt-3 bg-bento-dark text-white font-black text-xs md:text-sm px-5 md:px-6 py-3 rounded-2xl btn-anim btn-glow-trail hover:opacity-90 active:scale-95 transition-all press ripple-container overflow-hidden relative mobile-touch" style={{ transitionTimingFunction: "var(--ease-spring)" }}>
          {submitted ? "🎉 Thank you for your feedback!" : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
