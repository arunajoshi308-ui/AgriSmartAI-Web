"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/scanner", label: "Scan", icon: "📷" },
  { href: "/chat", label: "Chat", icon: "💬" },
  { href: "/yield", label: "Yield", icon: "📊" },
  { href: "/history", label: "Lab", icon: "🔬" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:flex sticky top-0 z-50 bg-bento-bg/95 backdrop-blur-md border-b-2 border-bento-dark animate-fadeDown">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-bento-dark flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110" style={{ transitionTimingFunction: "var(--ease-spring)", transitionDuration: "0.3s" }}>
              <span className="text-bento-lime text-lg">🌾</span>
            </div>
            <span className="font-black text-bento-dark text-lg gradient-text">AgriSmart AI</span>
          </Link>
          <div className="flex items-center gap-1.5">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-2 rounded-xl font-black text-sm transition-all hover:scale-105 active:scale-95 ${active ? "bg-bento-lime text-bento-dark border-2 border-bento-dark animate-pop" : "text-bento-olive hover:bg-bento-warm border-2 border-transparent"}`}
                  style={{ transitionTimingFunction: "var(--ease)" }}
                >
                  <span className="mr-1">{tab.icon}</span>{tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-50 bg-bento-bg/95 backdrop-blur-md border-b-2 border-bento-dark safe-top animate-fadeDown">
        <div className="flex items-center justify-center px-4 py-2.5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-full bg-bento-dark flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110" style={{ transitionTimingFunction: "var(--ease-spring)", transitionDuration: "0.3s" }}>
              <span className="text-bento-lime text-sm">🌾</span>
            </div>
            <span className="font-black text-bento-dark text-sm gradient-text">AgriSmart AI</span>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom animate-fadeUp">
        <div className="mobile-nav bg-white/95 backdrop-blur-xl border-t-2 border-bento-dark flex justify-around items-center py-1.5 px-2">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`mobile-nav-item flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all active:scale-90 ${active ? "bg-bento-lime border-2 border-bento-dark animate-pop" : ""}`}
                style={{ transitionTimingFunction: "var(--ease)" }}
              >
                <span className={`text-lg transition-transform ${active ? "scale-110" : ""}`} style={{ transitionTimingFunction: "var(--ease-spring)", transitionDuration: "0.3s" }}>{tab.icon}</span>
                <span className={`mobile-nav-label font-black ${active ? "text-bento-dark" : "text-bento-olive"}`}>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
