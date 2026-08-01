"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProximityHover from "@/components/ProximityHover";

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
  { value: "99%", label: "AI Accuracy", color: "bg-bento-lime", icon: "🎯" },
  { value: "8+", label: "Crop Types", color: "bg-bento-peach", icon: "🌾" },
  { value: "24/7", label: "AI Assist", color: "bg-bento-lavender", icon: "🤖" },
  { value: "8", label: "Innovators", color: "bg-bento-skyblue", icon: "👥" },
];

const FEATURES = [
  { href: "/scanner", icon: "📷", title: "Disease Scanner", desc: "Snap a leaf photo for instant AI diagnosis", color: "bg-bento-peach" },
  { href: "/chat", icon: "🧠", title: "AI Crop Advisor", desc: "24/7 agronomy chat with Gemini 3.5 Flash", color: "bg-bento-lavender" },
  { href: "/yield", icon: "📊", title: "Yield Optimizer", desc: "Calculate crop yield & revenue forecasts", color: "bg-bento-skyblue" },
  { href: "/history", icon: "🕘", title: "Scan History", desc: "Review past disease scans & lab results", color: "bg-bento-warm" },
];

export default function Home() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      setSubmitted(true);
      setFeedback("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-5 page-enter">
      {/* ===== HERO: Hexagon stroke grid with gradient + auto-pulse ===== */}
      <div className="relative rounded-[28px] overflow-hidden border-2 border-bento-dark animate-slideDown" style={{ height: "420px" }}>
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
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="bg-bento-lime text-bento-dark text-[10px] font-black px-4 py-1.5 rounded-full mb-3 animate-pulse-soft pointer-events-auto border-2 border-bento-dark">
            ● AI ACTIVE • CLASS 9
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white text-center leading-tight animate-fadeIn delay-2 drop-shadow-2xl">
            AgriSmart AI 🌾
          </h1>
          <p className="text-bento-lime font-bold text-sm md:text-lg mt-2 text-center animate-fadeIn delay-3 drop-shadow-lg">
            Move your cursor across the grid ✨
          </p>
          <Link
            href="/chat"
            className="mt-4 pointer-events-auto inline-flex items-center justify-center gap-2 bg-bento-lime text-bento-dark font-black text-sm px-7 py-3 rounded-2xl hover:scale-110 active:scale-95 transition-all animate-fadeIn delay-4 hover-glow border-2 border-bento-dark"
          >
            💬 START CHATTING WITH AI
          </Link>
        </div>
      </div>

      {/* ===== FEATURE GRID with Diamond stroke mini-grids ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURES.map((feat, i) => (
          <Link
            key={feat.href}
            href={feat.href}
            className={`bento-card ${feat.color} p-5 hover-lift animate-scaleIn press group relative overflow-hidden`}
            style={{ animationDelay: `${0.1 * (i + 1)}s` }}
          >
            <div className="w-10 h-10 rounded-full bg-bento-dark flex items-center justify-center mb-3 transition-transform group-hover:animate-wiggle">
              <span className="text-lg">{feat.icon}</span>
            </div>
            <h3 className="font-black text-bento-dark text-base">{feat.title}</h3>
            <p className="text-xs font-bold text-bento-olive mt-1">{feat.desc}</p>
          </Link>
        ))}
      </div>

      {/* ===== STATS with auto-pulsing circle grid background ===== */}
      <div className="relative rounded-[28px] overflow-hidden border-2 border-bento-dark" style={{ height: "160px" }}>
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
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 items-center px-4">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center animate-flipIn" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
              <div className="text-xl mb-1 animate-float" style={{ animationDelay: `${0.3 * (i + 1)}s` }}>{stat.icon}</div>
              <p className="text-2xl md:text-3xl font-black text-bento-lime drop-shadow-lg">{stat.value}</p>
              <p className="text-[10px] font-bold text-bento-bg/70 uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== DIVIDER: Star stroke grid ===== */}
      <div className="relative rounded-[28px] overflow-hidden border-2 border-bento-dark animate-slideUp" style={{ height: "80px" }}>
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
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-bento-lime font-black text-sm tracking-widest drop-shadow-lg animate-pulse-soft">
            ⚡ POWERED BY GEMINI 3.5 FLASH ⚡
          </p>
        </div>
      </div>

      {/* ===== ABOUT SECTION ===== */}
      <div
        className={`bento-card bg-bento-warm p-5 md:p-7 hover-lift ${visibleSections.has("about") ? "animate-slideUp" : "opacity-0"}`}
        data-reveal
        id="about"
      >
        <h2 className="font-black text-bento-dark text-lg mb-3 animate-fadeIn">🌱 About AgriSmart AI</h2>
        <p className="text-sm font-medium text-bento-olive leading-relaxed">
          AgriSmart AI is an AI-powered agricultural assistant created by Class 9 Student Innovators.
          Our mission is to empower farmers with cutting-edge AI technology for crop yield optimization,
          real-time plant disease detection, and expert agronomy advisory — all in one app.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {["Gemini 3.5 Flash", "Disease Detection", "Yield Forecasting", "Soil Analysis"].map((tag, i) => (
            <span
              key={tag}
              className="bento-border rounded-xl px-3 py-1.5 text-xs font-black text-bento-dark animate-bounceIn hover-pop"
              style={{ animationDelay: `${0.1 * (i + 1)}s`, background: ["#D1E67C", "#FFE0B2", "#D7C5F0", "#B3E0FF"][i] }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ===== TEAM SECTION with auto-pulsing rounded grid ===== */}
      <div
        className={`relative rounded-[28px] overflow-hidden border-2 border-bento-dark hover-lift ${visibleSections.has("team") ? "animate-slideUp" : "opacity-0"}`}
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
        <div className="relative z-10 p-5 md:p-7">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl animate-float">👥</span>
            <h2 className="font-black text-bento-lime text-xl drop-shadow-lg">Meet the Team</h2>
          </div>
          <p className="text-sm font-bold text-bento-lime/80 mb-4 drop-shadow">
            Class 9 Student Innovators behind AgriSmart AI
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEAM.map((member, i) => (
              <div
                key={member.name}
                className="flex items-center gap-3 bg-white/15 backdrop-blur-md border-2 border-bento-lime/40 rounded-2xl p-3 hover:border-bento-lime hover:bg-white/25 transition-all hover-lift animate-scaleIn group"
                style={{ animationDelay: `${0.08 * (i + 1)}s` }}
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

      {/* ===== FEEDBACK with triangle grid accent ===== */}
      <div
        className={`relative rounded-[28px] overflow-hidden border-2 border-bento-dark ${visibleSections.has("feedback") ? "animate-slideUp" : "opacity-0"}`}
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
        {/* Feedback content */}
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
            className="w-full bento-border rounded-2xl p-4 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-bento-lime focus:scale-[1.01] bg-bento-bg transition-all"
            rows={3}
          />
          <button
            onClick={handleFeedbackSubmit}
            className="mt-3 bg-bento-dark text-white font-black text-sm px-6 py-3 rounded-2xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all press"
          >
            {submitted ? "✅ Thank you for your feedback!" : "Submit Feedback"}
          </button>
        </div>
      </div>

      {/* ===== FOOTER DIVIDER: Diamond solid grid ===== */}
      <div className="relative rounded-[28px] overflow-hidden border-2 border-bento-dark" style={{ height: "60px" }}>
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
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-bento-lime font-black text-xs tracking-wider drop-shadow animate-pulse-soft">
            🌾 AgriSmart AI • Class 9 Innovators 🌾
          </p>
        </div>
      </div>
    </div>
  );
}
