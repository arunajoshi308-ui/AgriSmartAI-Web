"use client";

import { useState } from "react";
import ProximityHover from "@/components/ProximityHover";
import { useRipple } from "@/hooks/useAnimations";
import { useCountUp } from "@/hooks/useCountUp";

const CROPS = ["Wheat", "Rice", "Maize", "Tomato", "Cotton", "Soybean", "Sugarcane", "Potato", "Onion", "Groundnut", "Mustard", "Sunflower", "Pulses", "Banana"];
const SOIL_TYPES = ["Alluvial / Loam", "Black Soil", "Clay Soil", "Sandy Soil", "Red Soil", "Peaty Soil"];
const IRRIGATION = ["Drip Irrigation", "Canal / Sprinkler", "Rainfed", "Furrow Irrigation", "Tubewell / Borewell"];
const SEED_QUALITY = ["Hybrid High Yield", "Certified Seed", "Local Seed", "Organic Seed", "GM Seed"];

const baseYieldPerAcre: Record<string, number> = {
  Wheat: 2.8, Rice: 3.5, Maize: 4.2, Tomato: 18.0, Cotton: 1.5, Soybean: 2.5,
  Sugarcane: 35.0, Potato: 12.0, Onion: 10.0, Groundnut: 1.2, Mustard: 1.5,
  Sunflower: 1.0, Pulses: 0.8, Banana: 15.0,
};
const soilMultiplier: Record<string, number> = { "Alluvial / Loam": 1.2, "Black Soil": 1.15, "Clay Soil": 1.0, "Sandy Soil": 0.85, "Red Soil": 0.95, "Peaty Soil": 1.05 };
const irrigationMultiplier: Record<string, number> = { "Drip Irrigation": 1.25, "Canal / Sprinkler": 1.10, "Rainfed": 0.80, "Furrow Irrigation": 1.0, "Tubewell / Borewell": 1.15 };
const seedMultiplier: Record<string, number> = { "Hybrid High Yield": 1.20, "Certified Seed": 1.05, "Local Seed": 0.90, "Organic Seed": 0.95, "GM Seed": 1.30 };
const pricePerTon: Record<string, number> = {
  Wheat: 310, Rice: 380, Maize: 260, Tomato: 450, Cotton: 820, Soybean: 560,
  Sugarcane: 50, Potato: 200, Onion: 350, Groundnut: 900, Mustard: 650,
  Sunflower: 700, Pulses: 800, Banana: 400,
};
const npkRatios: Record<string, string> = {
  Wheat: "120 : 60 : 40 (NPK kg/ha)", Rice: "100 : 50 : 50 (NPK kg/ha)", Maize: "150 : 75 : 60 (NPK kg/ha)",
  Tomato: "180 : 90 : 120 (NPK kg/ha)", Cotton: "90 : 45 : 45 (NPK kg/ha)", Soybean: "30 : 60 : 40 (NPK kg/ha)",
  Sugarcane: "250 : 120 : 80 (NPK kg/ha)", Potato: "200 : 100 : 150 (NPK kg/ha)", Onion: "120 : 60 : 60 (NPK kg/ha)",
  Groundnut: "25 : 50 : 40 (NPK kg/ha)", Mustard: "100 : 50 : 30 (NPK kg/ha)", Sunflower: "80 : 60 : 40 (NPK kg/ha)",
  Pulses: "20 : 60 : 30 (NPK kg/ha)", Banana: "200 : 110 : 220 (NPK kg/ha)",
};
const cropEmojis: Record<string, string> = {
  Wheat: "🌾", Rice: "🍚", Maize: "🌽", Tomato: "🍅", Cotton: "🤍", Soybean: "🫘",
  Sugarcane: "🎋", Potato: "🥔", Onion: "🧅", Groundnut: "🥜", Mustard: "🌼",
  Sunflower: "🌻", Pulses: "🫛", Banana: "🍌",
};
const recommendations = [
  "Apply 50% Nitrogen during land prep and 50% at vegetative split.",
  "Maintain soil moisture at field capacity during seed germination.",
  "Spray micro-nutrient mixture (Zinc + Iron + Boron) at 30 days post-sowing.",
  "Deploy AgriSmart AI Disease Scanner weekly for early leaf rust protection.",
];

interface CropResult {
  crop: string; estimatedYieldTons: number; estimatedRevenueUSD: number;
  npkRatio: string; isCustom: boolean; acresPerCrop: number;
}

function CountUpStat({ target, prefix = "", suffix = "", duration = 800 }: { target: number; prefix?: string; suffix?: string; duration?: number }) {
  const { ref, value } = useCountUp(target, duration);
  return <span ref={ref}>{prefix}{value.toLocaleString()}{suffix}</span>;
}

function CropResultCard({ crop, index }: { crop: CropResult; index: number }) {
  return (
    <div className="bento-card bg-white p-3 md:p-4 animate-slide-up hover-lift hover-glow relative overflow-hidden border-trace" style={{ animationDelay: `${0.06 * (index + 1)}s`, transitionTimingFunction: "var(--ease)" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg md:text-xl">{cropEmojis[crop.crop] || "🌱"}</span>
          <h4 className="font-black text-bento-dark text-sm md:text-base heading-underline">{crop.crop}</h4>
        </div>
        {crop.isCustom && <span className="text-[9px] font-black text-bento-olive bg-bento-warm rounded-lg px-2 py-0.5">Custom</span>}
      </div>
      <div className="grid grid-cols-2 gap-2 md:gap-3 mt-2">
        <div className="bg-bento-warm rounded-xl p-2 md:p-2.5">
          <p className="text-[9px] font-black text-bento-olive uppercase">Yield</p>
          <p className="text-sm md:text-lg font-black text-bento-dark">
            <CountUpStat target={crop.estimatedYieldTons} suffix=" t" />
          </p>
        </div>
        <div className="bg-bento-peach rounded-xl p-2 md:p-2.5">
          <p className="text-[9px] font-black text-bento-olive uppercase">Revenue</p>
          <p className="text-sm md:text-lg font-black text-bento-dark">
            $<CountUpStat target={crop.estimatedRevenueUSD} />
          </p>
        </div>
      </div>
      <div className="mt-2 bg-bento-lavender rounded-xl p-2 md:p-2.5">
        <p className="text-[9px] font-black text-bento-olive uppercase">NPK Ratio</p>
        <p className="text-xs md:text-sm font-black text-bento-dark">{crop.npkRatio}</p>
      </div>
      <p className="text-[10px] font-bold text-bento-olive mt-2">📐 {crop.acresPerCrop} acres allocated</p>
    </div>
  );
}

export default function YieldPage() {
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Wheat"]);
  const [acres, setAcres] = useState(1);
  const [soilType, setSoilType] = useState("Alluvial / Loam");
  const [irrigation, setIrrigation] = useState("Drip Irrigation");
  const [seedQuality, setSeedQuality] = useState("Hybrid High Yield");
  const [customCrop, setCustomCrop] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [results, setResults] = useState<{ crops: CropResult[]; totalYield: number; totalRevenue: number } | null>(null);
  const ripple = useRipple();

  const toggleCrop = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
    setResults(null);
  };

  const addCustomCrop = () => {
    const name = customCrop.trim();
    if (!name || selectedCrops.includes(name)) return;
    setSelectedCrops((prev) => [...prev, name]);
    setCustomCrop("");
    setShowCustom(false);
    setResults(null);
  };

  const calculate = () => {
    if (selectedCrops.length === 0) return;
    const soilMult = soilMultiplier[soilType] || 1.0;
    const irrMult = irrigationMultiplier[irrigation] || 1.0;
    const seedMult = seedMultiplier[seedQuality] || 1.0;
    const acresPerCrop = acres / selectedCrops.length;

    const cropResults: CropResult[] = selectedCrops.map((c) => {
      const baseYield = baseYieldPerAcre[c] || 3.0;
      const price = pricePerTon[c] || 400;
      const npk = npkRatios[c] || "100 : 50 : 50 (NPK kg/ha) — Estimated for custom crop";
      const totalTons = acresPerCrop * baseYield * soilMult * irrMult * seedMult;
      return {
        crop: c,
        estimatedYieldTons: Math.round(totalTons * 100) / 100,
        estimatedRevenueUSD: Math.round(totalTons * price * 100) / 100,
        npkRatio: npk,
        isCustom: !baseYieldPerAcre[c] || !pricePerTon[c],
        acresPerCrop: Math.round(acresPerCrop * 100) / 100,
      };
    });

    const totalYield = Math.round(cropResults.reduce((sum, r) => sum + r.estimatedYieldTons, 0) * 100) / 100;
    const totalRevenue = Math.round(cropResults.reduce((sum, r) => sum + r.estimatedRevenueUSD, 0) * 100) / 100;

    setResults({ crops: cropResults, totalYield, totalRevenue });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-3 md:space-y-4 page-enter pb-24 md:pb-6">
      {/* HEADER */}
      <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeDown" style={{ height: 90 }}>
        <ProximityHover shape="diamond" fill="stroke" strokeWidth={2} particleColor="#B3E0FF" gradientColor="#D1E67C" backgroundColor="#1C1C16" maxSize={26} minSize={4} gap={8} influence={180} rotateOnHover autoPulse />
        <div className="absolute inset-0 bg-gradient-to-r from-bento-dark/45 via-transparent to-bento-dark/35 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-5">
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-bento-skyblue bento-border flex items-center justify-center animate-float text-base md:text-lg flex-shrink-0 hover-icon">📊</div>
            <div>
              <h2 className="font-black text-bento-skyblue text-sm md:text-base" style={{ textShadow: "0 2px 8px rgba(28,28,22,0.9)" }}>Yield Optimizer</h2>
              <p className="text-[10px] md:text-xs font-bold text-bento-lime" style={{ textShadow: "0 1px 6px rgba(28,28,22,0.8)" }}>Multi-crop yield calculator & revenue forecast</p>
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="bento-card bg-white p-4 md:p-5 space-y-3 md:space-y-4 animate-fadeUp hover-lift relative overflow-hidden border-trace">
        <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 animate-float-sway select-none">📈</div>

        {/* MULTI-CROP SELECTOR */}
        <div className="relative z-10">
          <label className="text-xs md:text-sm font-black text-bento-dark mb-2 block heading-underline">
            🌾 Select Crops <span className="text-bento-olive">({selectedCrops.length} selected)</span>
          </label>

          {/* Selected crops summary */}
          {selectedCrops.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {selectedCrops.map((c) => (
                <span key={c} className="bg-bento-dark text-white rounded-xl px-2.5 py-1 text-[11px] font-black flex items-center gap-1.5 animate-pop">
                  {cropEmojis[c] || "🌱"} {c}
                  <button onClick={() => toggleCrop(c)} className="hover:scale-125 active:scale-90 transition-transform press" style={{ transitionTimingFunction: "var(--ease-spring)" }}>✕</button>
                </span>
              ))}
            </div>
          )}

          {/* Crop options — multi-select toggle + inline Custom button */}
          {!showCustom ? (
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {CROPS.map((crop) => {
                const isSelected = selectedCrops.includes(crop);
                return (
                  <button
                    key={crop}
                    onClick={() => toggleCrop(crop)}
                    className={`px-2.5 md:px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-black transition-all hover:scale-105 active:scale-95 mobile-touch press flex items-center gap-1 ${isSelected ? "bg-bento-dark text-white animate-pop" : "bg-bento-warm bento-border text-bento-dark hover:bg-bento-lime"}`}
                    style={{ transitionTimingFunction: "var(--ease-spring)" }}
                  >
                    {isSelected && <span className="text-[10px]">✓</span>}
                    {cropEmojis[crop] || "🌱"} {crop}
                  </button>
                );
              })}
              <button
                onClick={() => setShowCustom(true)}
                className="px-2.5 md:px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-black transition-all hover:scale-105 active:scale-95 mobile-touch press bg-bento-lavender bento-border text-bento-dark hover:bg-bento-lime flex items-center gap-1"
                style={{ transitionTimingFunction: "var(--ease-spring)" }}
              >
                ✏️ Custom
              </button>
            </div>
          ) : (
            <div className="flex gap-2 animate-fadeIn">
              <input
                type="text"
                value={customCrop}
                onChange={(e) => setCustomCrop(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomCrop()}
                placeholder="Type crop name (e.g. Coffee, Grapes, Tobacco...)"
                className="flex-1 bento-border rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-bento-lime transition-all"
                autoFocus
              />
              <button
                onClick={addCustomCrop}
                disabled={!customCrop.trim()}
                className="bg-bento-lime bento-border rounded-xl px-4 py-2.5 font-black text-xs text-bento-dark hover:scale-105 active:scale-95 transition-all press disabled:opacity-50 mobile-touch"
                style={{ transitionTimingFunction: "var(--ease-spring)" }}
              >
                + Add
              </button>
              <button
                onClick={() => { setShowCustom(false); setCustomCrop(""); }}
                className="bg-bento-warm bento-border rounded-xl px-4 py-2.5 font-black text-xs text-bento-dark hover:scale-105 active:scale-95 transition-all press mobile-touch"
                style={{ transitionTimingFunction: "var(--ease-spring)" }}
              >
                ← Back
              </button>
            </div>
          )}
          {selectedCrops.length === 0 && (
            <p className="text-[10px] font-bold text-red-500 mt-2">⚠️ Please select at least one crop</p>
          )}
        </div>

        {/* SOIL / IRRIGATION / SEED — single select */}
        {[
          { label: "🟫 Soil Type", value: soilType, setter: setSoilType, options: SOIL_TYPES },
          { label: "💧 Irrigation", value: irrigation, setter: setIrrigation, options: IRRIGATION },
          { label: "🌱 Seed Quality", value: seedQuality, setter: setSeedQuality, options: SEED_QUALITY },
        ].map((group, gi) => (
          <div key={group.label} className="animate-fadeIn relative z-10" style={{ animationDelay: `${0.08 * (gi + 2)}s` }}>
            <label className="text-xs md:text-sm font-black text-bento-dark mb-2 block heading-underline">{group.label}</label>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {group.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => group.setter(opt)}
                  className={`px-2.5 md:px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-black transition-all hover:scale-105 active:scale-95 mobile-touch press ${group.value === opt ? "bg-bento-dark text-white animate-pop" : "bg-bento-warm bento-border text-bento-dark hover:bg-bento-lime"}`}
                  style={{ transitionTimingFunction: "var(--ease-spring)" }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* ACREAGE SLIDER */}
        <div className="animate-fadeIn delay-5 relative z-10">
          <label className="text-xs md:text-sm font-black text-bento-dark mb-2 block">
            📐 Farm Area (Acres): <span className="text-bento-olive">{acres}</span>
            {selectedCrops.length > 1 && <span className="text-[10px] text-bento-olive font-bold"> → {Math.round((acres / selectedCrops.length) * 100) / 100} acres per crop</span>}
          </label>
          <input type="range" min="0.5" max="50" step="0.5" value={acres} onChange={(e) => setAcres(parseFloat(e.target.value))} className="w-full accent-bento-olive transition-all" />
          <div className="flex justify-between text-[10px] font-bold text-bento-olive"><span>0.5 acre</span><span>50 acres</span></div>
        </div>

        {/* CALCULATE BUTTON */}
        <button
          onClick={(e) => { ripple(e); calculate(); }}
          disabled={selectedCrops.length === 0}
          className="w-full bg-bento-lime bento-border rounded-2xl py-3 md:py-3.5 font-black text-sm text-bento-dark btn-anim btn-glow-trail active:scale-95 transition-all disabled:opacity-50 press hover-lift ripple-container overflow-hidden relative mobile-touch shimmer-sweep relative z-10"
          style={{ transitionTimingFunction: "var(--ease-spring)" }}
        >
          📊 CALCULATE YIELD & REVENUE {selectedCrops.length > 1 && `(${selectedCrops.length} CROPS)`}
        </button>
      </div>

      {/* RESULTS */}
      {results && (
        <div className="space-y-3 md:space-y-4 animate-slide-up">
          {/* COMBINED TOTAL */}
          <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeUp">
            <div style={{ height: 36 }}>
              <ProximityHover shape="hexagon" fill="solid" particleColor="#D1E67C" backgroundColor="#1C1C16" maxSize={16} minSize={2} gap={8} influence={140} autoPulse />
            </div>
            <div className="bg-bento-lime p-4 md:p-5 relative overflow-hidden">
              <div className="absolute -top-2 -right-2 text-4xl opacity-10 animate-sway select-none">💰</div>
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <span className="text-lg md:text-xl">📊</span>
                <h3 className="font-black text-bento-dark text-sm md:text-base heading-underline">Combined Total ({results.crops.length} crops • {acres} acres)</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-10">
                <div className="animate-fadeIn delay-1">
                  <p className="text-[10px] font-black text-bento-olive uppercase">Total Yield</p>
                  <p className="text-xl md:text-2xl font-black text-bento-dark">
                    <CountUpStat target={results.totalYield} suffix=" tons" duration={1000} />
                  </p>
                </div>
                <div className="animate-fadeIn delay-2">
                  <p className="text-[10px] font-black text-bento-olive uppercase">Total Revenue</p>
                  <p className="text-xl md:text-2xl font-black text-bento-dark">
                    $<CountUpStat target={results.totalRevenue} duration={1000} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* INDIVIDUAL CROP BREAKDOWN */}
          {results.crops.length > 1 && (
            <div className="space-y-2.5 md:space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="text-base md:text-lg">🌿</span>
                <h3 className="font-black text-bento-dark text-xs md:text-sm heading-underline">Per-Crop Breakdown</h3>
                <span className="text-[10px] font-bold text-bento-olive">acres split evenly</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
                {results.crops.map((crop, i) => (
                  <CropResultCard key={crop.crop} crop={crop} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* NPK (if single crop, show inline; if multi, it's in per-crop cards) */}
          {results.crops.length === 1 && (
            <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeUp delay-2">
              <div style={{ height: 32 }}>
                <ProximityHover shape="star" fill="stroke" strokeWidth={1.5} particleColor="#5D621E" backgroundColor="#D7C5F0" maxSize={16} minSize={2} gap={6} influence={120} rotateOnHover />
              </div>
              <div className="bg-bento-lavender p-3 md:p-4 relative overflow-hidden hover-lift">
                <div className="absolute -bottom-1 -right-1 text-3xl opacity-10 animate-float-sway select-none">🧪</div>
                <h4 className="font-black text-bento-dark text-xs md:text-sm mb-2 relative z-10 heading-underline">🧪 Recommended NPK Ratio</h4>
                <p className="text-sm md:text-lg font-black text-bento-dark animate-fadeIn delay-1 relative z-10">{results.crops[0].npkRatio}</p>
              </div>
            </div>
          )}

          {/* AI RECOMMENDATIONS */}
          <div className="bento-card bg-white p-4 md:p-5 animate-fadeUp delay-3 hover-lift hover-glow relative overflow-hidden border-trace">
            <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 animate-sway select-none">📋</div>
            <h4 className="font-black text-bento-dark text-xs md:text-sm mb-3 relative z-10 heading-underline">📋 AI Recommendations</h4>
            <ul className="space-y-2 relative z-10">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 animate-fadeIn" style={{ animationDelay: `${0.08 * (i + 1)}s` }}>
                  <span className="text-bento-lime bg-bento-dark rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 animate-pop">{i + 1}</span>
                  <span className="text-xs md:text-sm font-medium text-bento-dark leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
