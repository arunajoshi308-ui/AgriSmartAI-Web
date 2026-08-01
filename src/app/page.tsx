"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const TEAM = [
  { name: "Shourya", emoji: "🌾", color: "bg-bento-lime" },
  { name: "Pranav J", emoji: "🔬", color: "bg-bento-peach" },
  { name: "Pratyush", emoji: "📊", color: "bg-bento-lavender" },
  { name: "Pranav K", emoji: "🤖", color: "bg-bento-skyblue" },
  { name: "Rohan", emoji: "🌱", color: "bg-bento-warm" },
  { name: "Krutik", emoji: "💧", color: "bg-bento-lime" },
  { name: "Myank", emoji: "🧪", color: "bg-bento-peach" },
  { name: "Nikunj", emoji: "昆虫", color: "bg-bento-lavender" },
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

  // Scroll reveal
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
      {/* Hero Bento Tile */}
      <div
        className="bento-card bg-bento-lime p-5 md:p-7 shadow-sm animate-slideDown hover-lift"
        data-reveal
        id="hero"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="bg-bento-dark text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse-soft">
            ● AI ACTIVE • CLASS 9
          </span>
          <div className="w-9 h-9 rounded-full bg-bento-dark flex items-center justify-center animate-float">
            <span className="text-bento-lime text-lg">🤖</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-bento-dark leading-tight animate-fadeIn delay-2">
          Need to optimize<br />your crop yield?
        </h1>
        <p className="text-bento-olive font-bold text-sm md:text-lg mt-1 animate-fadeIn delay-3">
          Ask our Gemini 3.5 AI for real-time agronomy advisory &amp; soil pH analysis
        </p>
        <Link
          href="/chat"
          className="mt-4 w-full md:w-auto inline-flex items-center justify-center gap-2 bg-bento-dark text-white font-black text-sm px-6 py-3 rounded-2xl hover:opacity-90 transition-all hover:scale-105 press animate-fadeIn delay-4"
        >
          💬 START CHATTING WITH AI
        </Link>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURES.map((feat, i) => (
          <Link
            key={feat.href}
            href={feat.href}
            className={`bento-card ${feat.color} p-5 hover-lift animate-scaleIn press group`}
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

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`bento-card ${stat.color} p-4 text-center hover-pop animate-flipIn`}
            style={{ animationDelay: `${0.1 * (i + 1)}s` }}
          >
            <div className="text-xl mb-1">{stat.icon}</div>
            <p className="text-2xl md:text-3xl font-black text-bento-dark">{stat.value}</p>
            <p className="text-[10px] font-bold text-bento-olive uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* About Section */}
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
              className={`bento-border rounded-xl px-3 py-1.5 text-xs font-black text-bento-dark animate-bounceIn hover-pop`}
              style={{
                animationDelay: `${0.1 * (i + 1)}s`,
                background: ["bg-bento-lime", "bg-bento-peach", "bg-bento-lavender", "bg-bento-skyblue"][i],
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Team Section — FIXED VISIBILITY */}
      <div
        className={`bento-card bg-gradient-to-br from-bento-dark via-[#2a2a20] to-bento-dark p-5 md:p-7 hover-lift ${visibleSections.has("team") ? "animate-slideUp" : "opacity-0"}`}
        data-reveal
        id="team"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl animate-float">👥</span>
          <h2 className="font-black text-bento-lime text-xl">Meet the Team</h2>
        </div>
        <p className="text-sm font-bold text-bento-lime/80 mb-4">
          Class 9 Student Innovators behind AgriSmart AI
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-bento-lime/30 rounded-2xl p-3 hover:border-bento-lime hover:bg-white/20 transition-all hover-lift animate-scaleIn group"
              style={{ animationDelay: `${0.08 * (i + 1)}s` }}
            >
              <div className={`${member.color} w-11 h-11 rounded-full border-2 border-bento-dark flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:animate-wiggle`}>
                {member.emoji}
              </div>
              <div className="min-w-0">
                <p className="font-black text-white text-sm truncate">{member.name}</p>
                <p className="text-[10px] font-bold text-bento-lime">Student Innovator</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Form */}
      <div
        className={`bento-card bg-white p-5 md:p-7 hover-lift ${visibleSections.has("feedback") ? "animate-slideUp" : "opacity-0"}`}
        data-reveal
        id="feedback"
      >
        <h2 className="font-black text-bento-dark text-lg mb-2">📝 Student Feedback</h2>
        <p className="text-sm font-bold text-bento-olive mb-4">
          We&apos;d love to hear from you! Rate AgriSmart AI and share your thoughts.
        </p>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => { setRating(star); }}
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
  );
}
