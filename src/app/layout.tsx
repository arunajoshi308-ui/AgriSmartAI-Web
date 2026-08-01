import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingEmojis from "@/components/FloatingEmojis";
import ScrollProgress from "@/components/ScrollProgress";
import AnimatedBackground from "@/components/AnimatedBackground";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "AgriSmart AI — Crop Yield Optimizer & Plant Disease Detector",
  description:
    "AI Crop Yield Optimizer & Real-time Plant Disease Detector created by Class 9 Student Innovators. Powered by Gemini AI.",
  keywords: ["agriculture", "AI", "crop yield", "plant disease", "farming", "Gemini"],
  openGraph: {
    title: "AgriSmart AI",
    description: "AI Crop Yield Optimizer & Real-time Plant Disease Detector",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ScrollProgress />
        <AnimatedBackground />
        <CursorGlow />
        <FloatingEmojis count={12} />
        <Navbar />
        <main className="min-h-screen pb-20 relative" style={{ zIndex: 1 }}>{children}</main>
        <footer className="border-t-2 border-bento-dark bg-bento-dark text-bento-bg px-6 py-8 text-center relative" style={{ zIndex: 1 }}>
          <p className="text-sm font-bold">
            AgriSmart AI 🌾 — Built by Class 9 Student Innovators
          </p>
          <p className="text-xs mt-2 text-bento-lime font-bold">
            Shourya • Pranav J • Pratyush • Pranav K • Rohan • Myank • Nikunj
          </p>
          <p className="text-xs mt-2 text-bento-bg/60">
            Powered by Gemini 3.5 Flash • Open Source on GitHub
          </p>
        </footer>
      </body>
    </html>
  );
}
