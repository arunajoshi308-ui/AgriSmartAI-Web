"use client";

import { useState, useRef, useEffect } from "react";
import ProximityHover from "@/components/ProximityHover";

interface Message { sender: "USER" | "BOT"; text: string; id: number; }
const SUGGESTIONS = [
  "🌾 How to boost wheat yields?",
  "🧪 Best NPK for clay soil?",
  "🐛 Organic pest control for tomatoes",
  "💧 Drought irrigation tips",
  "📚 Explain photosynthesis simply",
  "💻 Help me with Python code",
  "🧮 Solve 15% of 240",
  "✍️ Write a short poem about farming",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, sender: "BOT", text: "🌱 Hello! I'm AgriSmart AI — your all-round AI assistant built by Class 9 Student Innovators.\n\nI'm an expert in agriculture 🌾, but I can also help with homework 📚, coding 💻, writing ✍️, math 🧮, or just about anything else you're curious about!\n\nWhat can I help you with today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now(), sender: "USER", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const resp = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: text, messages: [...messages, userMsg].map((m) => ({ content: m.text })) }) });
      const data = await resp.json();
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "BOT", text: data.response || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "BOT", text: "⚠️ Connection error. Please try again." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6 h-[calc(100vh-150px)] md:h-[calc(100vh-100px)] flex flex-col page-enter pb-20 md:pb-0">
      {/* HEADER */}
      <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark mb-3 md:mb-4 animate-fadeDown" style={{ height: 80 }}>
        <ProximityHover shape="rounded" fill="stroke" strokeWidth={2} particleColor="#D7C5F0" gradientColor="#D1E67C" backgroundColor="#1C1C16" maxSize={22} minSize={3} gap={8} influence={160} autoPulse />
        <div className="absolute inset-0 bg-gradient-to-r from-bento-dark/45 via-transparent to-bento-dark/35 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-5">
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-bento-lavender bento-border flex items-center justify-center animate-float text-base md:text-lg flex-shrink-0">🧠</div>
            <div>
              <h2 className="font-black text-bento-lavender text-sm md:text-base" style={{ textShadow: "0 2px 8px rgba(28,28,22,0.9)" }}>AI Assistant</h2>
              <p className="text-[10px] md:text-xs font-bold text-bento-lime" style={{ textShadow: "0 1px 6px rgba(28,28,22,0.8)" }}>Ask me anything • Gemini 3.5 Flash</p>
            </div>
          </div>
          <div className="bg-bento-lime bento-border rounded-xl px-2 py-1 flex-shrink-0 animate-gentle-bounce">
            <span className="text-[9px] md:text-[10px] font-black text-bento-dark">● 24/7</span>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2" style={{ scrollbarWidth: "none" }}>
        {SUGGESTIONS.map((s, i) => (
          <button key={s} onClick={() => sendMessage(s.split(" ").slice(1).join(" "))} className="flex-shrink-0 bg-white bento-border rounded-xl px-3 py-1.5 text-[11px] font-black text-bento-dark hover:bg-bento-lime hover:scale-105 active:scale-95 transition-all animate-fadeIn mobile-touch" style={{ animationDelay: `${0.05 * (i + 1)}s`, transitionTimingFunction: "var(--ease)" }}>{s}</button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2.5 md:space-y-3 px-1" style={{ scrollBehavior: "smooth" }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"} animate-fadeUp`}>
            <div className={`max-w-[85%] rounded-2xl p-2.5 md:p-3 transition-all hover:scale-[1.01] ${msg.sender === "USER" ? "bg-bento-dark text-white" : "bg-white bento-border text-bento-dark"}`} style={{ transitionTimingFunction: "var(--ease)" }}>
              {msg.sender === "BOT" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-bento-lime bento-border flex items-center justify-center text-[10px] animate-float flex-shrink-0">🌱</div>
                  <span className="text-[10px] font-black text-bento-olive">AgriSmart AI</span>
                </div>
              )}
              <p className="text-xs md:text-sm font-medium whitespace-pre-wrap chat-markdown">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 animate-fadeIn">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-bento-lime bento-border flex items-center justify-center text-xs animate-float flex-shrink-0">🌱</div>
            <div className="bg-white bento-border rounded-2xl px-4 py-3 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-bento-olive loading-dot" />
              <div className="w-2 h-2 rounded-full bg-bento-olive loading-dot" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 rounded-full bg-bento-olive loading-dot" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bento-border bg-white p-2 flex gap-2 mt-2 animate-fadeUp hover-lift">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage(input)} placeholder="Ask me anything..." className="flex-1 px-3 md:px-4 py-2.5 text-sm font-medium bg-bento-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-lime transition-all" />
        <button onClick={() => sendMessage(input)} disabled={loading} className="bg-bento-lime bento-border rounded-xl px-4 py-2.5 font-black text-sm text-bento-dark hover:scale-105 active:scale-95 transition-all disabled:opacity-50 press mobile-touch" style={{ transitionTimingFunction: "var(--ease-spring)" }}>Send ➤</button>
      </div>
    </div>
  );
}
