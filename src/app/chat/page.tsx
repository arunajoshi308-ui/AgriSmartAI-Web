"use client";

import { useState, useRef, useEffect } from "react";
import ProximityHover from "@/components/ProximityHover";

interface Message { sender: "USER" | "BOT"; text: string; id: number; }

const SUGGESTIONS = [
  "🌾 How to boost wheat yields this season?",
  "🧪 What is the best NPK ratio for clay soil?",
  "🐛 Organic pest control for tomatoes",
  "💧 Drought irrigation scheduling tips",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, sender: "BOT", text: "🌱 Hello! I'm AgriSmart AI, your digital crop yield optimizer and plant health assistant built by Class 9 Student Innovators. How can I assist your farm today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now(), sender: "USER", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, messages: [...messages, userMsg].map((m) => ({ content: m.text })) }),
      });
      const data = await resp.json();
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "BOT", text: data.response || "Sorry, I couldn't process that. Please try again." }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "BOT", text: "⚠️ Connection error. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col page-enter">
      {/* ===== HEADER: Rounded grid with auto-pulse ===== */}
      <div className="relative rounded-[28px] overflow-hidden border-2 border-bento-dark mb-4 animate-slideDown" style={{ height: "110px" }}>
        <ProximityHover
          shape="rounded"
          fill="stroke"
          strokeWidth={2}
          particleColor="#D7C5F0"
          gradientColor="#D1E67C"
          backgroundColor="#1C1C16"
          maxSize={26}
          minSize={3}
          gap={8}
          influence={180}
          autoPulse
        />
        <div className="absolute inset-0 flex items-center justify-between px-5 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-bento-lavender bento-border flex items-center justify-center animate-float text-lg">🧠</div>
            <div>
              <h2 className="font-black text-bento-lavender text-base drop-shadow-lg">Agricultural AI Chatbot</h2>
              <p className="text-xs font-bold text-bento-lime/80">Class 9 Innovation • Gemini 3.5 Flash</p>
            </div>
          </div>
          <div className="bg-bento-lime bento-border rounded-xl px-2 py-1 animate-pulse-soft">
            <span className="text-[10px] font-black text-bento-dark">● 24/7 AGRI ASSIST</span>
          </div>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => sendMessage(s.split(" ").slice(1).join(" "))}
            className="flex-shrink-0 bg-white bento-border rounded-2xl px-3 py-1.5 text-[11px] font-black text-bento-dark hover:bg-bento-lime hover:scale-105 active:scale-95 transition-all animate-fadeIn"
            style={{ animationDelay: `${0.1 * (i + 1)}s` }}
          >{s}</button>
        ))}
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 px-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"} animate-fadeIn`}>
            <div className={`max-w-[80%] rounded-2xl p-3 transition-transform hover:scale-[1.02] ${
              msg.sender === "USER" ? "bg-bento-dark text-white" : "bg-white bento-border text-bento-dark"
            }`}>
              {msg.sender === "BOT" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-bento-lime bento-border flex items-center justify-center text-[10px] animate-float">🌱</div>
                  <span className="text-[10px] font-black text-bento-olive">AgriSmart AI</span>
                </div>
              )}
              <p className="text-sm font-medium whitespace-pre-wrap chat-markdown">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-bento-lime bento-border flex items-center justify-center text-xs">🌱</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-bento-olive loading-dot" />
              <div className="w-2 h-2 rounded-full bg-bento-olive loading-dot" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 rounded-full bg-bento-olive loading-dot" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bento-border bg-white p-2 flex gap-2 mt-2 animate-slideUp hover-lift">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask about crops, soil, pests, irrigation..."
          className="flex-1 px-4 py-2 text-sm font-medium bg-bento-bg rounded-xl focus:outline-none focus:ring-2 focus:ring-bento-lime transition-all"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading}
          className="bg-bento-lime bento-border rounded-xl px-4 py-2 font-black text-sm text-bento-dark hover:scale-105 active:scale-95 transition-all disabled:opacity-50 press"
        >Send ➤</button>
      </div>
    </div>
  );
}
