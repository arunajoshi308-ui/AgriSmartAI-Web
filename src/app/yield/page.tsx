"use client";

import { useState } from "react";
import ProximityHover from "@/components/ProximityHover";
import { useRipple } from "@/hooks/useAnimations";

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
const recommendations = [
  "Apply 50% Nitrogen during land prep and 50% at vegetative split.",
  "Maintain soil moisture at field capacity during seed germination.",
  "Spray micro-nutrient mixture (Zinc + Iron + Boron) at 30 days post-sowing.",
  "Deploy AgriSmart AI Disease Scanner weekly for early leaf rust protection.",
];

interface SelectorGroup {
  label: string;
  key: string;
  options: string[];
}

const SELECTOR_GROUPS: SelectorGroup[] = [
  { label: "🌾 Crop Type", key: "crop", options: CROPS },
  { label: "🟫 Soil Type", key: "soil", options: SOIL_TYPES },
  { label: "💧 Irrigation", key: "irrigation", options: IRRIGATION },
  { label: "🌱 Seed Quality", key: "seed", options: SEED_QUALITY },
];

export default function YieldPage() {
  const [crop, setCrop] = useState("Wheat");
  const [acres, setAcres] = useState(1);
  const [soilType, setSoilType] = useState("Alluvial / Loam");
  const [irrigation, setIrrigation] = useState("Drip Irrigation");
  const [seedQuality, setSeedQuality] = useState("Hybrid High Yield");
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [customMode, setCustomMode] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<any>(null);
  const ripple = useRipple();

  const stateMap: Record<string, [string, (v: string) => void]> = {
    crop: [crop, setCrop], soil: [soilType, setSoilType], irrigation: [irrigation, setIrrigation], seed: [seedQuality, setSeedQuality],
  };

  // Get effective value (custom or preset)
  const getEffectiveValue = (key: string): string => {
    if (customMode[key] && customInputs[key]?.trim()) return customInputs[key].trim();
    return stateMap[key][0];
  };

  const calculate = () => {
    const effCrop = getEffectiveValue("crop");
    const effSoil = getEffectiveValue("soil");
    const effIrr = getEffectiveValue("irrigation");
    const effSeed = getEffectiveValue("seed");

    // Use known values or sensible defaults for custom entries
    const baseYield = baseYieldPerAcre[effCrop] || 3.0; // default 3 tons/acre for unknown crops
    const soilMult = soilMultiplier[effSoil] || 1.0;    // default neutral for custom soil
    const irrMult = irrigationMultiplier[effIrr] || 1.0;
    const seedMult = seedMultiplier[effSeed] || 1.0;
    const price = pricePerTon[effCrop] || 400; // default $400/ton for unknown crops
    const npk = npkRatios[effCrop] || "100 : 50 : 50 (NPK kg/ha) — Estimated for custom crop";

    const totalTons = acres * baseYield * soilMult * irrMult * seedMult;
    setResult({
      crop: effCrop, acres,
      estimatedYieldTons: Math.round(totalTons * 100) / 100,
      estimatedRevenueUSD: Math.round(totalTons * price * 100) / 100,
      npkRatio: npk,
      isCustom: !baseYieldPerAcre[effCrop] || !pricePerTon[effCrop],
      recommendations,
    });
  };

  const renderSelector = (group: SelectorGroup, gi: number) => {
    const [current, setter] = stateMap[group.key];
    const isCustom = customMode[group.key];
    const customVal = customInputs[group.key] || "";

    return (
      <div key={group.key} className="animate-fadeIn relative z-10" style={{ animationDelay: `${0.08 * (gi + 1)}s` }}>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs md:text-sm font-black text-bento-dark">{group.label}</label>
          {isCustom && (
            <button
              onClick={() => setCustomMode({ ...customMode, [group.key]: false })}
              className="text-[10px] font-black text-bento-olive hover:text-bento-dark press"
            >
              ← Back to list
            </button>
          )}
        </div>
        {!isCustom ? (
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {group.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setter(opt)}
                className={`px-2.5 md:px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-black transition-all hover:scale-105 active:scale-95 mobile-touch ${current === opt ? "bg-bento-dark text-white animate-pop" : "bg-bento-warm bento-border text-bento-dark hover:bg-bento-lime"}`}
              >
                {opt}
              </button>
            ))}
            <button
              onClick={() => setCustomMode({ ...customMode, [group.key]: true })}
              className="px-2.5 md:px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-black transition-all hover:scale-105 active:scale-95 mobile-touch bg-bento-lavender bento-border text-bento-dark hover:bg-bento-lime flex items-center gap-1"
            >
              ✏️ Custom
            </button>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <input
              type="text"
              value={customVal}
              onChange={(e) => setCustomInputs({ ...customInputs, [group.key]: e.target.value })}
              placeholder={`Type custom ${group.label.split(" ").slice(1).join(" ").toLowerCase()}...`}
              className="w-full bento-border rounded-xl px-3 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-bento-lime transition-all"
              autoFocus
            />
            {customVal.trim() && (
              <p className="text-[10px] font-black text-bento-olive mt-1.5">
                ✅ Custom: <span className="text-bento-dark">{customVal.trim()}</span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6 space-y-3 md:space-y-4 page-enter pb-24 md:pb-6">
      {/* HEADER */}
      <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeDown" style={{ height: 90 }}>
        <ProximityHover shape="diamond" fill="stroke" strokeWidth={2} particleColor="#B3E0FF" gradientColor="#D1E67C" backgroundColor="#1C1C16" maxSize={26} minSize={4} gap={8} influence={180} rotateOnHover autoPulse />
        <div className="absolute inset-0 bg-gradient-to-r from-bento-dark/45 via-transparent to-bento-dark/35 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-5">
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-bento-skyblue bento-border flex items-center justify-center animate-float text-base md:text-lg flex-shrink-0">📊</div>
            <div>
              <h2 className="font-black text-bento-skyblue text-sm md:text-base" style={{ textShadow: "0 2px 8px rgba(28,28,22,0.9)" }}>Yield Optimizer</h2>
              <p className="text-[10px] md:text-xs font-bold text-bento-lime" style={{ textShadow: "0 1px 6px rgba(28,28,22,0.8)" }}>Crop yield calculator & revenue forecast</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bento-card bg-white p-4 md:p-5 space-y-3 md:space-y-4 animate-fadeUp hover-lift relative overflow-hidden">
        <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 animate-float-sway select-none">📈</div>
        {SELECTOR_GROUPS.map((group, gi) => renderSelector(group, gi))}
        <div className="animate-fadeIn delay-5 relative z-10">
          <label className="text-xs md:text-sm font-black text-bento-dark mb-2 block">📐 Farm Area (Acres): <span className="text-bento-olive">{acres}</span></label>
          <input type="range" min="0.5" max="50" step="0.5" value={acres} onChange={(e) => setAcres(parseFloat(e.target.value))} className="w-full accent-bento-olive transition-all" />
          <div className="flex justify-between text-[10px] font-bold text-bento-olive"><span>0.5 acre</span><span>50 acres</span></div>
        </div>
        <button onClick={(e) => { ripple(e); calculate(); }} className="w-full bg-bento-lime bento-border rounded-2xl py-3 md:py-3.5 font-black text-sm text-bento-dark hover:scale-[1.01] active:scale-95 transition-all press hover-lift ripple-container overflow-hidden relative mobile-touch shimmer-sweep relative z-10">
          📊 CALCULATE YIELD & REVENUE
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeUp">
            <div style={{ height: 36 }}>
              <ProximityHover shape="hexagon" fill="solid" particleColor="#D1E67C" backgroundColor="#1C1C16" maxSize={16} minSize={2} gap={8} influence={140} autoPulse />
            </div>
            <div className="bg-bento-lime p-4 md:p-5 relative overflow-hidden">
              <div className="absolute -top-2 -right-2 text-4xl opacity-10 animate-sway select-none">💰</div>
              <div className="grid grid-cols-2 gap-3 md:gap-4 relative z-10">
                <div className="animate-fadeIn delay-1">
                  <p className="text-[10px] font-black text-bento-olive uppercase">Estimated Yield</p>
                  <p className="text-xl md:text-2xl font-black text-bento-dark">{result.estimatedYieldTons} tons</p>
                </div>
                <div className="animate-fadeIn delay-2">
                  <p className="text-[10px] font-black text-bento-olive uppercase">Est. Revenue</p>
                  <p className="text-xl md:text-2xl font-black text-bento-dark">${result.estimatedRevenueUSD.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-2.5 md:mt-3 pt-2.5 md:pt-3 border-t-2 border-bento-dark/20 animate-fadeIn delay-3 relative z-10">
                <p className="text-[10px] font-black text-bento-olive uppercase">Crop</p>
                <p className="text-xs md:text-sm font-black text-bento-dark">{result.crop} • {result.acres} acres</p>
                {result.isCustom && (
                  <p className="text-[9px] font-bold text-bento-olive mt-1">💡 Estimated values for custom crop — AI used sensible defaults</p>
                )}
              </div>
            </div>
          </div>

          <div className="relative rounded-[20px] md:rounded-[28px] overflow-hidden border-2 border-bento-dark animate-fadeUp delay-2">
            <div style={{ height: 32 }}>
              <ProximityHover shape="star" fill="stroke" strokeWidth={1.5} particleColor="#5D621E" backgroundColor="#D7C5F0" maxSize={16} minSize={2} gap={6} influence={120} rotateOnHover />
            </div>
            <div className="bg-bento-lavender p-3 md:p-4 relative overflow-hidden">
              <div className="absolute -bottom-1 -right-1 text-3xl opacity-10 animate-float-sway select-none">🧪</div>
              <h4 className="font-black text-bento-dark text-xs md:text-sm mb-2 relative z-10">🧪 Recommended NPK Ratio</h4>
              <p className="text-sm md:text-lg font-black text-bento-dark animate-fadeIn delay-1 relative z-10">{result.npkRatio}</p>
            </div>
          </div>

          <div className="bento-card bg-white p-4 md:p-5 animate-fadeUp delay-3 hover-lift relative overflow-hidden">
            <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 animate-sway select-none">📋</div>
            <h4 className="font-black text-bento-dark text-xs md:text-sm mb-3 relative z-10">📋 AI Recommendations</h4>
            <ul className="space-y-2 relative z-10">
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-2 animate-fadeIn" style={{ animationDelay: `${0.08 * (i + 1)}s` }}>
                  <span className="text-bento-lime bg-bento-dark rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{i + 1}</span>
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
