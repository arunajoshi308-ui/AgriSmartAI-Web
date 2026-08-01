"use client";

import { useState } from "react";

interface YieldResult {
  crop: string;
  acres: number;
  estimatedYieldTons: number;
  estimatedRevenueUSD: number;
  npkRatio: string;
  recommendations: string[];
}

const CROPS = ["Wheat", "Rice", "Maize", "Tomato", "Cotton", "Soybean"];
const SOIL_TYPES = ["Alluvial / Loam", "Black Soil", "Clay Soil", "Sandy Soil"];
const IRRIGATION = ["Drip Irrigation", "Canal / Sprinkler", "Rainfed"];
const SEED_QUALITY = ["Hybrid High Yield", "Certified Seed", "Local Seed"];

const baseYieldPerAcre: Record<string, number> = {
  Wheat: 2.8, Rice: 3.5, Maize: 4.2, Tomato: 18.0, Cotton: 1.5, Soybean: 2.5,
};

const soilMultiplier: Record<string, number> = {
  "Alluvial / Loam": 1.2, "Black Soil": 1.15, "Clay Soil": 1.0, "Sandy Soil": 0.85,
};

const irrigationMultiplier: Record<string, number> = {
  "Drip Irrigation": 1.25, "Canal / Sprinkler": 1.10, "Rainfed": 0.80,
};

const seedMultiplier: Record<string, number> = {
  "Hybrid High Yield": 1.20, "Certified Seed": 1.05, "Local Seed": 0.90,
};

const pricePerTon: Record<string, number> = {
  Wheat: 310, Rice: 380, Maize: 260, Tomato: 450, Cotton: 820, Soybean: 560,
};

const npkRatios: Record<string, string> = {
  Wheat: "120 : 60 : 40 (NPK kg/ha)",
  Rice: "100 : 50 : 50 (NPK kg/ha)",
  Maize: "150 : 75 : 60 (NPK kg/ha)",
  Tomato: "180 : 90 : 120 (NPK kg/ha)",
  Cotton: "90 : 45 : 45 (NPK kg/ha)",
  Soybean: "30 : 60 : 40 (NPK kg/ha)",
};

const recommendations = [
  "Apply 50% Nitrogen during land prep and 50% at vegetative split.",
  "Maintain soil moisture at field capacity during seed germination.",
  "Spray micro-nutrient mixture (Zinc + Iron + Boron) at 30 days post-sowing.",
  "Deploy AgriSmart AI Disease Scanner weekly for early leaf rust protection.",
];

export default function YieldPage() {
  const [crop, setCrop] = useState("Wheat");
  const [acres, setAcres] = useState(1);
  const [soilType, setSoilType] = useState("Alluvial / Loam");
  const [irrigation, setIrrigation] = useState("Drip Irrigation");
  const [seedQuality, setSeedQuality] = useState("Hybrid High Yield");
  const [result, setResult] = useState<YieldResult | null>(null);

  const calculate = () => {
    const totalTons =
      acres *
      (baseYieldPerAcre[crop] || 3.0) *
      (soilMultiplier[soilType] || 1.0) *
      (irrigationMultiplier[irrigation] || 1.0) *
      (seedMultiplier[seedQuality] || 1.0);

    const revenue = totalTons * (pricePerTon[crop] || 350);

    setResult({
      crop,
      acres,
      estimatedYieldTons: Math.round(totalTons * 100) / 100,
      estimatedRevenueUSD: Math.round(revenue * 100) / 100,
      npkRatio: npkRatios[crop] || "100 : 50 : 50 (NPK kg/ha)",
      recommendations,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="bento-card bg-bento-skyblue p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-bento-dark flex items-center justify-center">
          <span className="text-bento-skyblue text-lg">📊</span>
        </div>
        <div>
          <h2 className="font-black text-bento-dark text-base">Yield Optimizer</h2>
          <p className="text-xs font-bold text-bento-olive">Crop yield calculator &amp; revenue forecast</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bento-card bg-white p-5 space-y-4">
        {/* Crop Selection */}
        <div>
          <label className="text-sm font-black text-bento-dark mb-2 block">🌾 Crop Type</label>
          <div className="flex flex-wrap gap-2">
            {CROPS.map((c) => (
              <button
                key={c}
                onClick={() => setCrop(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  crop === c ? "bg-bento-dark text-white" : "bg-bento-warm bento-border text-bento-dark hover:bg-bento-lime"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Acres */}
        <div>
          <label className="text-sm font-black text-bento-dark mb-2 block">📐 Farm Area (Acres): {acres}</label>
          <input
            type="range"
            min="0.5"
            max="50"
            step="0.5"
            value={acres}
            onChange={(e) => setAcres(parseFloat(e.target.value))}
            className="w-full accent-bento-olive"
          />
          <div className="flex justify-between text-[10px] font-bold text-bento-olive">
            <span>0.5 acre</span>
            <span>50 acres</span>
          </div>
        </div>

        {/* Soil Type */}
        <div>
          <label className="text-sm font-black text-bento-dark mb-2 block">🟫 Soil Type</label>
          <div className="flex flex-wrap gap-2">
            {SOIL_TYPES.map((s) => (
              <button
                key={s}
                onClick={() => setSoilType(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  soilType === s ? "bg-bento-dark text-white" : "bg-bento-warm bento-border text-bento-dark hover:bg-bento-lime"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Irrigation */}
        <div>
          <label className="text-sm font-black text-bento-dark mb-2 block">💧 Irrigation Method</label>
          <div className="flex flex-wrap gap-2">
            {IRRIGATION.map((i) => (
              <button
                key={i}
                onClick={() => setIrrigation(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  irrigation === i ? "bg-bento-dark text-white" : "bg-bento-warm bento-border text-bento-dark hover:bg-bento-lime"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Seed Quality */}
        <div>
          <label className="text-sm font-black text-bento-dark mb-2 block">🌱 Seed Quality</label>
          <div className="flex flex-wrap gap-2">
            {SEED_QUALITY.map((s) => (
              <button
                key={s}
                onClick={() => setSeedQuality(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  seedQuality === s ? "bg-bento-dark text-white" : "bg-bento-warm bento-border text-bento-dark hover:bg-bento-lime"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-bento-lime bento-border rounded-2xl py-3.5 font-black text-sm text-bento-dark hover:opacity-80 transition-opacity"
        >
          📊 CALCULATE YIELD &amp; REVENUE
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fadeIn">
          {/* Big Results Card */}
          <div className="bento-card bg-bento-lime p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black text-bento-olive uppercase">Estimated Yield</p>
                <p className="text-2xl font-black text-bento-dark">{result.estimatedYieldTons} tons</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-bento-olive uppercase">Est. Revenue</p>
                <p className="text-2xl font-black text-bento-dark">${result.estimatedRevenueUSD.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t-2 border-bento-dark/20">
              <p className="text-[10px] font-black text-bento-olive uppercase">Crop</p>
              <p className="text-sm font-black text-bento-dark">{result.crop} • {result.acres} acres</p>
            </div>
          </div>

          {/* NPK Ratio */}
          <div className="bento-card bg-bento-lavender p-4">
            <h4 className="font-black text-bento-dark text-sm mb-2">🧪 Recommended NPK Ratio</h4>
            <p className="text-lg font-black text-bento-dark">{result.npkRatio}</p>
          </div>

          {/* Recommendations */}
          <div className="bento-card bg-white p-5">
            <h4 className="font-black text-bento-dark text-sm mb-3">📋 AI Recommendations</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-bento-lime bg-bento-dark rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-bento-dark">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
