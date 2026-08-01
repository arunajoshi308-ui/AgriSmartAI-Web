"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Portal", icon: "🌐" },
  { href: "/scanner", label: "Scanner", icon: "📷" },
  { href: "/chat", label: "AI Chat", icon: "💬" },
  { href: "/yield", label: "Yield", icon: "📊" },
  { href: "/history", label: "History", icon: "🕘" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-bento-bg/95 backdrop-blur-md border-b-2 border-bento-dark animate-slideDown">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-bento-dark flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 animate-glow-pulse">
              <span className="text-bento-lime text-lg">🌾</span>
            </div>
            <span className="font-black text-bento-dark text-lg gradient-text">AgriSmart AI</span>
          </Link>
          <div className="flex items-center gap-1">
            {tabs.map((tab, i) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95 ${active ? "bg-bento-lime text-bento-dark border-2 border-bento-dark animate-pop hover-glow-pulse" : "text-bento-olive hover:bg-bento-warm border-2 border-transparent"}`}
                  style={{ animationDelay: `${0.05 * i}s` }}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-bento-dark flex justify-around items-center py-1 animate-slideUp">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href} className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all active:scale-90 ${active ? "bg-bento-lime animate-pop hover-glow-pulse" : ""}`}>
              <span className={`text-xl transition-transform ${active ? "scale-125 animate-float3D" : ""}`}>{tab.icon}</span>
              <span className={`text-[10px] font-black ${active ? "text-bento-dark" : "text-bento-olive"}`}>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
