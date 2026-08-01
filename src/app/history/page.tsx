"use client";

import { useState, useEffect, useRef } from "react";
import ProximityHover from "@/components/ProximityHover";

interface ScanRecord {
  cropName: string; diseaseName: string; healthStatus: string; confidence: number;
  symptoms: string; organicTreatment: string; chemicalTreatment: string; prevention: string;
  timestamp: number; image?: string;
}
const statusColors: Record<string, string> = {
  HEALTHY: "bg-green-200 text-green-900", WARNING: "bg-yellow-200 text-yellow-900", DISEASED: "bg-red-200 text-red-900",
};

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("agriScanHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const deleteRecord = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem("agriScanHistory", JSON.stringify(updated));
    setExpanded(null);
  };
  const clearAll = () => { setHistory([]); localStorage.removeItem("agriScanHistory"); setExpanded(null); };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-3 md:space-y-4 page-enter pb-24 md:pb-6">
      {/* HEADER */}
      <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeDown" style={{ height: 80 }}>
        <ProximityHover shape="triangle" fill="stroke" strokeWidth={2} particleColor="#E7E9D9" gradientColor="#D1E67C" backgroundColor="#1C1C16" maxSize={22} minSize={3} gap={8} influence={160} rotateOnHover autoPulse />
        <div className="absolute inset-0 bg-gradient-to-r from-bento-dark/45 via-transparent to-bento-dark/35 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-5">
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-bento-warm bento-border flex items-center justify-center animate-float text-base md:text-lg flex-shrink-0">🔬</div>
            <div>
              <h2 className="font-black text-white text-sm md:text-base" style={{ textShadow: "0 2px 8px rgba(28,28,22,0.9)" }}>Scan Lab</h2>
              <p className="text-[10px] md:text-xs font-bold text-bento-lime" style={{ textShadow: "0 1px 6px rgba(28,28,22,0.8)" }}>{history.length} saved {history.length === 1 ? "diagnosis" : "diagnoses"}</p>
            </div>
          </div>
          {history.length > 0 && (
            <button onClick={clearAll} className="pointer-events-auto text-xs font-black text-bento-lime hover:text-red-400 transition-colors hover:scale-105 active:scale-95 press mobile-touch px-2" style={{ transitionTimingFunction: "var(--ease)" }}>Clear All</button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-scaleIn" style={{ height: 240 }}>
          <ProximityHover shape="star" fill="solid" particleColor="#D1E67C" backgroundColor="#1C1C16" maxSize={20} minSize={3} gap={8} influence={180} autoPulse />
          <div className="absolute inset-0 bg-bento-dark/35 pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
            <div className="text-4xl md:text-5xl mb-3 animate-float-sway">🌱</div>
            <h3 className="font-black text-bento-lime text-base md:text-lg mb-1" style={{ textShadow: "0 2px 12px rgba(28,28,22,0.95)" }}>No Scans Yet</h3>
            <p className="text-xs md:text-sm font-bold text-white/70 mb-3 md:mb-4" style={{ textShadow: "0 1px 6px rgba(28,28,22,0.85)" }}>Start scanning plant leaves to build your history</p>
            <a href="/scanner" className="pointer-events-auto inline-block bg-bento-lime bento-border rounded-2xl px-5 md:px-6 py-2.5 md:py-3 font-black text-xs md:text-sm text-bento-dark hover:scale-105 active:scale-95 transition-all press hover-lift mobile-touch" style={{ transitionTimingFunction: "var(--ease-spring)" }}>📷 Open Scanner</a>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 md:space-y-3">
          {history.map((record, i) => (
            <div key={i} className="bento-card bg-white overflow-hidden hover-lift animate-fadeUp relative" style={{ animationDelay: `${0.06 * (i + 1)}s` }}>
              <div className="p-3 md:p-4 cursor-pointer transition-colors hover:bg-bento-bg/50" onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                    {record.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={record.image} alt={record.cropName} className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover bento-border transition-transform hover:scale-110 flex-shrink-0" style={{ transitionTimingFunction: "var(--ease-spring)" } as any} />
                    )}
                    <div className="min-w-0">
                      <h3 className="font-black text-bento-dark text-sm truncate">{record.diseaseName}</h3>
                      <p className="text-[10px] md:text-xs font-bold text-bento-olive truncate">{record.cropName} • {new Date(record.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black animate-pop ${statusColors[record.healthStatus] || statusColors.WARNING}`}>{record.healthStatus}</span>
                    <span className="text-xs font-black text-bento-dark">{record.confidence}%</span>
                    <span className="text-[10px] text-bento-olive transition-transform" style={{ transform: expanded === i ? "rotate(180deg)" : "rotate(0deg)", transitionTimingFunction: "var(--ease)", transitionDuration: "0.3s" }}>▼</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-bento-olive line-clamp-2">{record.symptoms}</p>
              </div>
              {/* Smooth accordion expand */}
              <div
                ref={(el) => { contentRefs.current[i] = el; }}
                className="accordion-content"
                style={{
                  maxHeight: expanded === i ? "500px" : "0px",
                  opacity: expanded === i ? 1 : 0,
                  marginTop: expanded === i ? undefined : "0px",
                }}
              >
                <div className="px-3 md:px-4 pb-3 md:pb-4 pt-1 border-t-2 border-bento-dark/10 space-y-2.5 md:space-y-3">
                  {[
                    { label: "🌿 Organic Treatment", content: record.organicTreatment },
                    { label: "⚗️ Chemical Treatment", content: record.chemicalTreatment },
                    { label: "🛡️ Prevention", content: record.prevention },
                  ].map((detail, di) => (
                    <div key={di} className="animate-fadeIn" style={{ animationDelay: `${0.05 * (di + 1)}s` }}>
                      <p className="text-[10px] font-black text-bento-olive uppercase mb-1">{detail.label}</p>
                      <p className="text-xs md:text-sm font-medium text-bento-dark leading-relaxed">{detail.content}</p>
                    </div>
                  ))}
                  <button onClick={(e) => { e.stopPropagation(); deleteRecord(i); }} className="text-xs font-black text-red-500 hover:text-red-700 transition-colors hover:scale-105 active:scale-95 press mobile-touch" style={{ transitionTimingFunction: "var(--ease)" }}>🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
