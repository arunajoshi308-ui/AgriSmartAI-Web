"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ProximityHover from "@/components/ProximityHover";
import { useRipple } from "@/hooks/useAnimations";

interface Diagnosis {
  cropName: string; diseaseName: string; healthStatus: string; confidence: number;
  symptoms: string; organicTreatment: string; chemicalTreatment: string; prevention: string;
}

const CROPS = ["Tomato", "Wheat", "Rice", "Maize", "Cotton", "Potato", "Chili", "General"];
const statusColors: Record<string, string> = {
  HEALTHY: "bg-green-200 text-green-900", WARNING: "bg-yellow-200 text-yellow-900", DISEASED: "bg-red-200 text-red-900",
};

export default function ScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState("Tomato");
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ripple = useRipple();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setSelectedImage(ev.target?.result as string); setDiagnosis(null); setSaved(false); };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setLoading(true); setDiagnosis(null);
    const base64 = selectedImage.split(",")[1] || selectedImage;
    try {
      const resp = await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: base64, cropHint }) });
      setDiagnosis(await resp.json());
    } catch {
      setDiagnosis({ cropName: cropHint, diseaseName: "Analysis Error", healthStatus: "WARNING", confidence: 0, symptoms: "Could not analyze image.", organicTreatment: "", chemicalTreatment: "", prevention: "" });
    } finally { setLoading(false); }
  };

  const saveToHistory = () => {
    if (!diagnosis) return;
    const history = JSON.parse(localStorage.getItem("agriScanHistory") || "[]");
    history.unshift({ ...diagnosis, timestamp: Date.now(), image: selectedImage });
    localStorage.setItem("agriScanHistory", JSON.stringify(history.slice(0, 50)));
    setSaved(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-3 md:space-y-4 page-enter pb-24 md:pb-6">
      {/* HEADER */}
      <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeDown" style={{ height: 90 }}>
        <ProximityHover shape="circle" fill="stroke" strokeWidth={2} particleColor="#FFE0B2" gradientColor="#D1E67C" backgroundColor="#1C1C16" maxSize={26} minSize={4} gap={8} influence={180} autoPulse />
        <div className="absolute inset-0 bg-gradient-to-r from-bento-dark/45 via-transparent to-bento-dark/35 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-5">
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-bento-peach bento-border flex items-center justify-center animate-float text-base md:text-lg flex-shrink-0">📷</div>
            <div>
              <h2 className="font-black text-bento-peach text-sm md:text-base" style={{ textShadow: "0 2px 8px rgba(28,28,22,0.9)" }}>Disease Scanner</h2>
              <p className="text-[10px] md:text-xs font-bold text-bento-lime" style={{ textShadow: "0 1px 6px rgba(28,28,22,0.8)" }}>AI Plant Disease Detection • Gemini Vision</p>
            </div>
          </div>
          <div className="bg-bento-lime bento-border rounded-xl px-2 py-1 flex-shrink-0">
            <span className="text-[9px] md:text-[10px] font-black text-bento-dark">● AI VISION</span>
          </div>
        </div>
      </div>

      {/* Upload */}
      <div className="bento-card bg-white p-4 md:p-6 cursor-pointer hover:bg-bento-bg hover-lift transition-all group animate-fadeUp" onClick={() => fileInputRef.current?.click()}>
        {selectedImage ? (
          <div className="relative animate-fadeIn">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Selected leaf" className="w-full rounded-2xl max-h-64 md:max-h-72 object-cover bento-border transition-transform group-hover:scale-[1.02]" />
            <button onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setDiagnosis(null); }} className="absolute top-2 right-2 bg-bento-dark text-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-black hover:scale-110 active:scale-90 transition-transform press">✕</button>
          </div>
        ) : (
          <div className="text-center py-6 md:py-8">
            <div className="text-4xl md:text-5xl mb-2 md:mb-3 animate-float">🌿</div>
            <p className="font-black text-bento-dark text-sm md:text-base">Tap to upload a leaf photo</p>
            <p className="text-xs md:text-sm font-bold text-bento-olive mt-1">Camera or gallery • JPG/PNG supported</p>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      </div>

      {/* Crop Selector */}
      <div className="bento-card bg-bento-warm p-3 md:p-4 animate-fadeUp delay-2 hover-lift">
        <p className="text-xs md:text-sm font-black text-bento-dark mb-2 md:mb-3">Select Crop Category:</p>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {CROPS.map((crop) => (
            <button key={crop} onClick={() => setCropHint(crop)} className={`px-2.5 md:px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-black transition-all hover:scale-105 active:scale-95 mobile-touch ${cropHint === crop ? "bg-bento-dark text-white animate-pop" : "bg-white bento-border text-bento-dark hover:bg-bento-lime"}`}>{crop}</button>
          ))}
        </div>
      </div>

      {/* Analyze */}
      <button onClick={(e) => { ripple(e); analyzeImage(); }} disabled={!selectedImage || loading} className="w-full bg-bento-lime bento-border rounded-2xl py-3 md:py-3.5 font-black text-sm text-bento-dark hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 press animate-fadeUp delay-3 hover-lift ripple-container overflow-hidden relative mobile-touch">
        {loading ? (
          <span className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-bento-dark border-t-transparent rounded-full animate-spin" />Analyzing leaf...</span>
        ) : "🔬 ANALYZE WITH AI"}
      </button>

      {/* Results */}
      {diagnosis && (
        <div className="space-y-3">
          <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeUp">
            <div style={{ height: 40 }}>
              <ProximityHover shape="hexagon" fill="solid" particleColor={diagnosis.healthStatus === "HEALTHY" ? "#D1E67C" : diagnosis.healthStatus === "DISEASED" ? "#FF6B6B" : "#FFE0B2"} backgroundColor="#1C1C16" maxSize={16} minSize={2} gap={8} influence={140} autoPulse />
            </div>
            <div className="bg-white p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div>
                  <h3 className="font-black text-bento-dark text-base md:text-lg">{diagnosis.diseaseName}</h3>
                  <p className="text-xs font-bold text-bento-olive">{diagnosis.cropName} • Crop Analysis</p>
                </div>
                <span className={`px-2.5 md:px-3 py-1 rounded-xl text-[10px] font-black animate-pop ${statusColors[diagnosis.healthStatus] || statusColors.WARNING}`}>{diagnosis.healthStatus}</span>
              </div>
              <div>
                <div className="flex justify-between mb-1"><span className="text-xs font-bold text-bento-olive">AI Confidence</span><span className="text-xs font-black text-bento-dark">{diagnosis.confidence}%</span></div>
                <div className="w-full bg-bento-warm rounded-full h-2.5 bento-border overflow-hidden">
                  <div className="bg-gradient-to-r from-bento-lime to-bento-olive h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${diagnosis.confidence}%` }} />
                </div>
              </div>
            </div>
          </div>

          {[
            { title: "🔍 Symptoms", content: diagnosis.symptoms, color: "bg-bento-peach", delay: "delay-1" },
            { title: "🌿 Organic Treatment", content: diagnosis.organicTreatment, color: "bg-bento-lime", delay: "delay-2" },
            { title: "⚗️ Chemical Treatment", content: diagnosis.chemicalTreatment, color: "bg-bento-skyblue", delay: "delay-3" },
            { title: "🛡️ Prevention", content: diagnosis.prevention, color: "bg-bento-lavender", delay: "delay-4" },
          ].map((card) => (
            <div key={card.title} className={`bento-card ${card.color} p-3 md:p-4 animate-fadeUp ${card.delay} hover-lift`}>
              <h4 className="font-black text-bento-dark text-xs md:text-sm mb-1.5">{card.title}</h4>
              <p className="text-xs md:text-sm font-medium text-bento-dark leading-relaxed">{card.content}</p>
            </div>
          ))}

          <div className="flex gap-2 md:gap-3 animate-fadeUp delay-5">
            <button onClick={(e) => { ripple(e); saveToHistory(); }} className="flex-1 bg-bento-dark text-white font-black text-xs md:text-sm py-2.5 md:py-3 rounded-2xl hover:scale-105 active:scale-95 transition-all press ripple-container overflow-hidden relative mobile-touch">{saved ? "✅ Saved" : "💾 Save"}</button>
            <Link href="/history" className="flex-1 bg-white bento-border text-bento-dark font-black text-xs md:text-sm py-2.5 md:py-3 rounded-2xl text-center hover:bg-bento-lime hover:scale-105 active:scale-95 transition-all mobile-touch">📋 History</Link>
          </div>
        </div>
      )}
    </div>
  );
}
