"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProximityHover from "@/components/ProximityHover";
import { useRipple } from "@/hooks/useAnimations";

const TEAM = [
  { name: "Shourya", emoji: "🌾", color: "bg-bento-lime" },
  { name: "Pranav J", emoji: "🔬", color: "bg-bento-peach" },
  { name: "Pratyush", emoji: "📊", color: "bg-bento-lavender" },
  { name: "Pranav K", emoji: "🤖", color: "bg-bento-skyblue" },
  { name: "Rohan", emoji: "🌱", color: "bg-bento-warm" },
  { name: "Krutik", emoji: "💧", color: "bg-bento-lime" },
  { name: "Myank", emoji: "🧪", color: "bg-bento-peach" },
  { name: "Nikunj", emoji: "🦋", color: "bg-bento-lavender" },
];

const STATS = [
  { value: "99%", label: "AI Accuracy", icon: "🎯" },
  { value: "8+", label: "Crop Types", icon: "🌾" },
  { value: "24/7", label: "AI Assist", icon: "🤖" },
  { value: "8", label: "Innovators", icon: "👥" },
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

export default function Home() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const ripple = useRipple();

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

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      setSubmitted(true);
      setFeedback("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6 page-enter">
      {/* ===== HERO ===== */}
      <div className="relative rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeDown" style={{ height: "440px" }}>
        <ProximityHover
          shape="hexagon"
          fill="stroke"
          strokeWidth={2}
          particleColor="#D1E67C"
          gradientColor="#5D621E"
          backgroundColor="#1C1C16"
          maxSize={44}
          minSize={6}
          gap={6}
          influence={320}
          rotateOnHover
          autoPulse
        />
        {/* Gradient overlay for guaranteed text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-bento-dark/30 via-transparent to-bento-dark/40 pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
          <span className="bg-bento-lime text-bento-dark text-[10px] font-black px-4 py-1.5 rounded-full mb-4 pointer-events-auto border-2 border-bento-dark animate-fadeUp delay-2 hover-lift">
            ● AI ACTIVE • CLASS 9
          </span>
          {/* Title with guaranteed visibility — backdrop + shadow + gradient */}
          <div className="hero-title-wrap">
            <h1 className="text-3xl md:text-5xl font-black text-white text-center leading-tight animate-fadeUp delay-3"
              style={{ textShadow: "0 4px 24px rgba(28,28,22,0.9), 0 2px 4px rgba(28,28,22,0.8), 0 0 40px rgba(209,230,124,0.15)" }}
            >
              AgriSmart AI 🌾
            </h1>
          </div>
          <p className="text-bento-lime font-bold text-sm md:text-lg mt-3 text-center animate-fadeUp delay-4"
            style={{ textShadow: "0 2px 8px rgba(28,28,22,0.8)" }}
          >
            Move your cursor across the grid ✨
          </p>
          <Link
            href="/chat"
            className="mt-5 pointer-events-auto ripple-container inline-flex items-center justify-center gap-2 bg-bento-lime text-bento-dark font-black text-sm px-7 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all animate-fadeUp delay-5 hover-lift border-2 border-bento-dark"
          >
            💬 START CHATTING WITH AI
          </Link>
        </div>
      </div>

      {/* ===== MARQUEE ===== */}
      <div className="marquee bento-border bg-bento-dark rounded-2xl py-2.5 animate-fadeIn">
        <div className="marquee-content">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((text, i) => (
            <span key={i} className="text-bento-lime font-black text-sm whitespace-nowrap px-6">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* ===== FEATURE GRID ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURES.map((feat, i) => (
          <Link
            key={feat.href}
            href={feat.href}
            className={`bento-card ${feat.color} p-5 hover-lift animate-fadeUp press group relative overflow-hidden`}
            style={{ animationDelay: `${0.1 * (i + 1)}s` }}
          >
            <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full border-2 border-bento-dark/8 animate-spin-slow" />
            <div className="w-10 h-10 rounded-full bg-bento-dark flex items-center justify-center mb-3 transition-transform group-hover:animate-wiggle relative z-10">
              <span className="text-lg">{feat.icon}</span>
            </div>
            <h3 className="font-black text-bento-dark text-base relative z-10">{feat.title}</h3>
            <p className="text-xs font-bold text-bento-olive mt-1 relative z-10">{feat.desc}</p>
          </Link>
        ))}
      </div>

      {/* ===== STATS ===== */}
      <div
        className={`relative rounded-[28px] overflow-hidden border-2 border-bento-dark ${visibleSections.has("stats") ? "animate-fadeUp" : "opacity-0"}`}
        data-reveal
        id="stats"
        style={{ height: "150px" }}
      >
        <ProximityHover
          shape="circle"
          fill="solid"
          particleColor="#D1E67C"
          gradientColor="#8B9530"
          backgroundColor="#1C1C16"
          maxSize={20}
          minSize={3}
          gap={10}
          influence={200}
          autoPulse
        />
        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-bento-dark/40 via-bento-dark/30 to-bento-dark/40 pointer-events-none" />
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 items-center px-4">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-xl mb-1 animate-float" style={{ animationDelay: `${0.4 * (i + 1)}s` }}>{stat.icon}</div>
              <p className="text-2xl md:text-3xl font-black text-bento-lime drop-shadow-lg"
                style={{ textShadow: "0 2px 12px rgba(28,28,22,0.9)" }}
              >{stat.value}</p>
              <p className="text-[10px] font-bold text-white/70 uppercase mt-1"
                style={{ textShadow: "0 1px 4px rgba(28,28,22,0.8)" }}
              >{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="relative rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeUp" style={{ height: "70px" }}>
        <ProximityHover
          shape="star"
          fill="stroke"
          strokeWidth={1.5}
          particleColor="#D1E67C"
          backgroundColor="#1C1C16"
          maxSize={28}
          minSize={4}
          gap={8}
          influence={180}
          rotateOnHover
          autoPulse
        />
        <div className="absolute inset-0 bg-bento-dark/30 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-bento-lime font-black text-sm tracking-widest animate-text-glow">
            ⚡ POWERED BY GEMINI 3.5 FLASH ⚡
          </p>
        </div>
      </div>

      {/* ===== ABOUT ===== */}
      <div
        className={`bento-card bg-bento-warm p-5 md:p-7 hover-lift overflow-hidden ${visibleSections.has("about") ? "animate-fadeUp" : "opacity-0"}`}
        data-reveal
        id="about"
      >
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-bento-dark/10 animate-spin-slow" />
        <h2 className="font-black text-bento-dark text-lg mb-3 relative z-10">🌱 About AgriSmart AI</h2>
        <p className="text-sm font-medium text-bento-olive leading-relaxed relative z-10">
          AgriSmart AI is an AI-powered agricultural assistant created by Class 9 Student Innovators.
          Our mission is to empower farmers with cutting-edge AI technology for crop yield optimization,
          real-time plant disease detection, and expert agronomy advisory — all in one app.
        </p>
        <div className="flex flex-wrap gap-2 mt-4 relative z-10">
          {["Gemini 3.5 Flash", "Disease Detection", "Yield Forecasting", "Soil Analysis"].map((tag, i) => (
            <span
              key={tag}
              className="bento-border rounded-xl px-3 py-1.5 text-xs font-black text-bento-dark hover-pop cursor-default"
              style={{ background: ["#D1E67C", "#FFE0B2", "#D7C5F0", "#B3E0FF"][i] }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ===== TEAM ===== */}
      <div
        className={`relative rounded-[28px] overflow-hidden border-2 border-bento-dark hover-lift ${visibleSections.has("team") ? "animate-fadeUp" : "opacity-0"}`}
        data-reveal
        id="team"
        style={{ minHeight: "340px" }}
      >
        <div className="absolute inset-0">
          <ProximityHover
            shape="rounded"
            fill="solid"
            particleColor="#D1E67C"
            gradientColor="#5D621E"
            backgroundColor="#1C1C16"
            maxSize={26}
            minSize={3}
            gap={8}
            influence={220}
            autoPulse
          />
        </div>
        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-bento-dark/50 via-bento-dark/30 to-bento-dark/50 pointer-events-none" />
        <div className="relative z-10 p-5 md:p-7">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl animate-float">👥</span>
            <h2 className="font-black text-bento-lime text-xl drop-shadow-lg"
              style={{ textShadow: "0 2px 12px rgba(28,28,22,0.9)" }}
            >Meet the Team</h2>
          </div>
          <p className="text-sm font-bold text-white/80 mb-4"
            style={{ textShadow: "0 1px 6px rgba(28,28,22,0.8)" }}
          >
            Class 9 Student Innovators behind AgriSmart AI
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="flex items-center gap-3 bg-white/15 backdrop-blur-md border-2 border-bento-lime/40 rounded-2xl p-3 hover:border-bento-lime hover:bg-white/25 transition-all hover-lift"
                style={{
                  animation: visibleSections.has("team") ? `fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${0.08 * (i + 1)}s both` : "none"
                }}
              >
                <div className={`${member.color} w-11 h-11 rounded-full border-2 border-bento-dark flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:animate-wiggle`}>
                  {member.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-white text-sm truncate drop-shadow">{member.name}</p>
                  <p className="text-[10px] font-bold text-bento-lime">Student Innovator</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== FEEDBACK ===== */}
      <div
        className={`relative rounded-[28px] overflow-hidden border-2 border-bento-dark ${visibleSections.has("feedback") ? "animate-fadeUp" : "opacity-0"}`}
        data-reveal
        id="feedback"
      >
        {/* Mini grid strip at top */}
        <div style={{ height: "40px" }}>
          <ProximityHover
            shape="triangle"
            fill="stroke"
            strokeWidth={1.5}
            particleColor="#5D621E"
            backgroundColor="#D1E67C"
            maxSize={18}
            minSize={2}
            gap={6}
            influence={120}
            rotateOnHover
          />
        </div>
        <div className="bg-white p-5 md:p-7">
          <h2 className="font-black text-bento-dark text-lg mb-2">📝 Student Feedback</h2>
          <p className="text-sm font-bold text-bento-olive mb-4">
            We&apos;d love to hear from you! Rate AgriSmart AI and share your thoughts.
          </p>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-all hover:scale-125 active:scale-90 ${star <= rating ? "animate-pop" : "grayscale opacity-40"}`}
              >
                ⭐
              </button>
            ))}
          </div>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your feedback..."
            className="w-full bento-border rounded-2xl p-4 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-bento-lime focus:scale-[1.005] bg-bento-bg transition-all"
            rows={3}
          />
          <button
            onClick={(e) => { ripple(e); handleFeedbackSubmit(); }}
            className="mt-3 bg-bento-dark text-white font-black text-sm px-6 py-3 rounded-2xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all press ripple-container overflow-hidden relative"
          >
            {submitted ? "✅ Thank you for your feedback!" : "Submit Feedback"}
          </button>
        </div>
      </div>

      {/* ===== FOOTER DIVIDER ===== */}
      <div className="relative rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeUp" style={{ height: "60px" }}>
        <ProximityHover
          shape="diamond"
          fill="solid"
          particleColor="#D1E67C"
          backgroundColor="#1C1C16"
          maxSize={16}
          minSize={2}
          gap={8}
          influence={150}
          autoPulse
        />
        <div className="absolute inset-0 bg-bento-dark/30 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-bento-lime font-black text-xs tracking-wider animate-text-glow">
            🌾 AgriSmart AI • Class 9 Innovators 🌾
          </p>
        </div>
      </div>
    </div>
  );
}
