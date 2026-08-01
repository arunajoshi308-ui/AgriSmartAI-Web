"use client";

import Link from "next/link";
import { useState } from "react";

const TEAM = [
  { name: "Shourya", emoji: "🌾", color: "bg-bento-lime" },
  { name: "Pranav J", emoji: "🔬", color: "bg-bento-peach" },
  { name: "Pratyush", emoji: "📊", color: "bg-bento-lavender" },
  { name: "Pranav K", emoji: "🤖", color: "bg-bento-skyblue" },
  { name: "Rohan", emoji: "🌱", color: "bg-bento-warm" },
  { name: "Krutik", emoji: "💧", color: "bg-bento-lime" },
];

export default function Home() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      setSubmitted(true);
      setFeedback("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-4">
      {/* Hero Bento Tile */}
      <div className="bento-card bg-bento-lime p-5 md:p-7 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-bento-dark text-white text-[10px] font-black px-3 py-1 rounded-full">
            AI ACTIVE • CLASS 9
          </span>
          <div className="w-9 h-9 rounded-full bg-bento-dark flex items-center justify-center">
            <span className="text-bento-lime text-lg">🤖</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-bento-dark leading-tight">
          Need to optimize<br />your crop yield?
        </h1>
        <p className="text-bento-olive font-bold text-sm md:text-base mt-1">
          Ask our Gemini 3.5 AI for real-time agronomy advisory &amp; soil pH analysis
        </p>
        <Link
          href="/chat"
          className="mt-4 w-full md:w-auto inline-flex items-center justify-center gap-2 bg-bento-dark text-white font-black text-sm px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity"
        >
          💬 START CHATTING WITH AI
        </Link>
      </div>

      {/* Bento 2x2 Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Disease Scanner Tile */}
        <Link href="/scanner" className="bento-card bg-bento-peach p-5 hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 rounded-full bg-bento-dark flex items-center justify-center mb-3">
            <span className="text-bento-peach text-lg">📷</span>
          </div>
          <h3 className="font-black text-bento-dark text-base">Disease Scanner</h3>
          <p className="text-xs font-bold text-bento-olive mt-1">
            Snap a leaf photo for instant AI diagnosis
          </p>
        </Link>

        {/* AI Chat Tile */}
        <Link href="/chat" className="bento-card bg-bento-lavender p-5 hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 rounded-full bg-bento-dark flex items-center justify-center mb-3">
            <span className="text-bento-lavender text-lg">🧠</span>
          </div>
          <h3 className="font-black text-bento-dark text-base">AI Crop Advisor</h3>
          <p className="text-xs font-bold text-bento-olive mt-1">
            24/7 agronomy chat with Gemini 3.5 Flash
          </p>
        </Link>

        {/* Yield Optimizer Tile */}
        <Link href="/yield" className="bento-card bg-bento-skyblue p-5 hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 rounded-full bg-bento-dark flex items-center justify-center mb-3">
            <span className="text-bento-skyblue text-lg">📊</span>
          </div>
          <h3 className="font-black text-bento-dark text-base">Yield Optimizer</h3>
          <p className="text-xs font-bold text-bento-olive mt-1">
            Calculate crop yield &amp; revenue forecasts
          </p>
        </Link>

        {/* History Tile */}
        <Link href="/history" className="bento-card bg-bento-warm p-5 hover:scale-[1.02] transition-transform">
          <div className="w-10 h-10 rounded-full bg-bento-dark flex items-center justify-center mb-3">
            <span className="text-bento-warm text-lg">🕘</span>
          </div>
          <h3 className="font-black text-bento-dark text-base">Scan History</h3>
          <p className="text-xs font-bold text-bento-olive mt-1">
            Review past disease scans &amp; lab results
          </p>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bento-card bg-white p-4 text-center">
          <p className="text-2xl md:text-3xl font-black text-bento-dark">99%</p>
          <p className="text-[10px] font-bold text-bento-olive uppercase mt-1">AI Accuracy</p>
        </div>
        <div className="bento-card bg-white p-4 text-center">
          <p className="text-2xl md:text-3xl font-black text-bento-dark">6+</p>
          <p className="text-[10px] font-bold text-bento-olive uppercase mt-1">Crop Types</p>
        </div>
        <div className="bento-card bg-white p-4 text-center">
          <p className="text-2xl md:text-3xl font-black text-bento-dark">24/7</p>
          <p className="text-[10px] font-bold text-bento-olive uppercase mt-1">AI Assist</p>
        </div>
      </div>

      {/* About Section */}
      <div className="bento-card bg-bento-warm p-5 md:p-7">
        <h2 className="font-black text-bento-dark text-lg mb-3">🌱 About AgriSmart AI</h2>
        <p className="text-sm font-medium text-bento-olive leading-relaxed">
          AgriSmart AI is an AI-powered agricultural assistant created by Class 9 Student Innovators.
          Our mission is to empower farmers with cutting-edge AI technology for crop yield optimization,
          real-time plant disease detection, and expert agronomy advisory — all in one app.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-bento-lime bento-border rounded-xl px-3 py-1.5 text-xs font-black text-bento-dark">Gemini 3.5 Flash</span>
          <span className="bg-bento-peach bento-border rounded-xl px-3 py-1.5 text-xs font-black text-bento-dark">Disease Detection</span>
          <span className="bg-bento-lavender bento-border rounded-xl px-3 py-1.5 text-xs font-black text-bento-dark">Yield Forecasting</span>
          <span className="bg-bento-skyblue bento-border rounded-xl px-3 py-1.5 text-xs font-black text-bento-dark">Soil Analysis</span>
        </div>
      </div>

      {/* Team Section */}
      <div className="bento-card bg-bento-dark p-5 md:p-7">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">👥</span>
          <h2 className="font-black text-bento-lime text-lg">Meet the Team</h2>
        </div>
        <p className="text-sm font-bold text-bento-bg/70 mb-4">
          Class 9 Student Innovators behind AgriSmart AI
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-3 bg-bento-bg/10 border-2 border-bento-bg/20 rounded-2xl p-3 hover:border-bento-lime transition-colors"
            >
              <div className={`w-11 h-11 rounded-full ${member.color} bento-border flex items-center justify-center text-lg flex-shrink-0`}>
                {member.emoji}
              </div>
              <div>
                <p className="font-black text-bento-bg text-sm">{member.name}</p>
                <p className="text-[10px] font-bold text-bento-lime">Student Innovator</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bento-card bg-white p-5 md:p-7">
        <h2 className="font-black text-bento-dark text-lg mb-2">📝 Student Feedback</h2>
        <p className="text-sm font-bold text-bento-olive mb-4">
          We&apos;d love to hear from you! Rate AgriSmart AI and share your thoughts.
        </p>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl transition-transform hover:scale-125 ${star <= rating ? "" : "grayscale opacity-40"}`}
            >
              ⭐
            </button>
          ))}
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your feedback..."
          className="w-full bento-border rounded-2xl p-4 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-bento-lime bg-bento-bg"
          rows={3}
        />
        <button
          onClick={handleFeedbackSubmit}
          className="mt-3 bg-bento-dark text-white font-black text-sm px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity"
        >
          {submitted ? "✅ Thank you for your feedback!" : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
