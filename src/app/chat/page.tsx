"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  sender: "USER" | "BOT";
  text: string;
  id: number;
}

const SUGGESTIONS = [
  "🌾 How to boost wheat yields this season?",
  "🧪 What is the best NPK ratio for clay soil?",
  "🐛 Organic pest control for tomatoes",
  "💧 Drought irrigation scheduling tips",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      sender: "BOT",
      text: "🌱 Hello! I'm AgriSmart AI, your digital crop yield optimizer and plant health assistant built by Class 9 Student Innovators. How can I assist your farm today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
        body: JSON.stringify({
          prompt: text,
          messages: [...messages, userMsg].map((m) => ({
            content: m.text,
          })),
        }),
      });
      const data = await resp.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "BOT", text: data.response || "Sorry, I couldn't process that. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "BOT", text: "⚠️ Connection error. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col">
      {/* Header Card */}
      <div className="bento-card bg-bento-warm p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bento-lavender bento-border flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <div>
            <h2 className="font-black text-bento-dark text-base">Agricultural AI Chatbot</h2>
            <p className="text-xs font-bold text-bento-olive">Class 9 Innovation • Gemini 3.5 Flash</p>
          </div>
        </div>
        <div className="bg-bento-lime bento-border rounded-xl px-2 py-1">
          <span className="text-[10px] font-black text-bento-dark">24/7 AGRI ASSIST</span>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => sendMessage(s.split(" ").slice(1).join(" "))}
            className="flex-shrink-0 bg-white bento-border rounded-2xl px-3 py-1.5 text-[11px] font-black text-bento-dark hover:bg-bento-lime transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 px-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                msg.sender === "USER"
                  ? "bg-bento-dark text-white"
                  : "bg-white bento-border text-bento-dark"
              }`}
            >
              {msg.sender === "BOT" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-bento-lime bento-border flex items-center justify-center text-[10px]">
                    🌱
                  </div>
                  <span className="text-[10px] font-black text-bento-olive">AgriSmart AI</span>
                </div>
              )}
              <p className="text-sm font-medium whitespace-pre-wrap chat-markdown">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-bento-lime bento-border flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-bento-dark border-t-transparent rounded-full animate-spin" />
            </div>
            <span className="text-sm font-bold text-bento-olive">AgriSmart AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bento-border bg-white p-2 flex gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask about crops, soil, pests, irrigation..."
          className="flex-1 px-4 py-2 text-sm font-medium bg-bento-bg rounded-xl focus:outline-none"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading}
          className="bg-bento-lime bento-border rounded-xl px-4 py-2 font-black text-sm text-bento-dark hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          Send ➤
        </button>
      </div>
    </div>
  );
}
