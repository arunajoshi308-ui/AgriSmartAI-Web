"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface Diagnosis {
  cropName: string;
  diseaseName: string;
  healthStatus: string;
  confidence: number;
  symptoms: string;
  organicTreatment: string;
  chemicalTreatment: string;
  prevention: string;
}

const CROPS = ["Tomato", "Wheat", "Rice", "Maize", "Cotton", "Potato", "Chili", "General"];

const statusColors: Record<string, string> = {
  HEALTHY: "bg-green-200 text-green-900",
  WARNING: "bg-yellow-200 text-yellow-900",
  DISEASED: "bg-red-200 text-red-900",
};

export default function ScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState("Tomato");
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setSelectedImage(result);
      setDiagnosis(null);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const fileToBase64 = (dataUrl: string) => {
    const parts = dataUrl.split(",");
    return parts[1] || parts[0];
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setDiagnosis(null);
    try {
      const resp = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: fileToBase64(selectedImage),
          cropHint,
        }),
      });
      const data = await resp.json();
      setDiagnosis(data);
    } catch {
      setDiagnosis({
        cropName: cropHint,
        diseaseName: "Analysis Error",
        healthStatus: "WARNING",
        confidence: 0,
        symptoms: "Could not analyze image. Please try again.",
        organicTreatment: "",
        chemicalTreatment: "",
        prevention: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = () => {
    if (!diagnosis) return;
    const history = JSON.parse(localStorage.getItem("agriScanHistory") || "[]");
    history.unshift({
      ...diagnosis,
      timestamp: Date.now(),
      image: selectedImage,
    });
    localStorage.setItem("agriScanHistory", JSON.stringify(history.slice(0, 50)));
    setSaved(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="bento-card bg-bento-peach p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-bento-dark flex items-center justify-center">
          <span className="text-bento-peach text-lg">📷</span>
        </div>
        <div>
          <h2 className="font-black text-bento-dark text-base">Disease Scanner</h2>
          <p className="text-xs font-bold text-bento-olive">AI-Powered Plant Disease Detection • Gemini Vision</p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className="bento-card bg-white p-6 cursor-pointer hover:bg-bento-bg transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedImage ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedImage} alt="Selected leaf" className="w-full rounded-2xl max-h-72 object-cover bento-border" />
            <button
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setDiagnosis(null); }}
              className="absolute top-2 right-2 bg-bento-dark text-white rounded-full w-8 h-8 flex items-center justify-center font-black"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-3">🌿</div>
            <p className="font-black text-bento-dark text-base">Tap to upload a leaf photo</p>
            <p className="text-sm font-bold text-bento-olive mt-1">
              Camera or gallery • JPG/PNG supported
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Crop Selector */}
      <div className="bento-card bg-bento-warm p-4">
        <p className="text-sm font-black text-bento-dark mb-3">Select Crop Category:</p>
        <div className="flex flex-wrap gap-2">
          {CROPS.map((crop) => (
            <button
              key={crop}
              onClick={() => setCropHint(crop)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                cropHint === crop
                  ? "bg-bento-dark text-white"
                  : "bg-white bento-border text-bento-dark hover:bg-bento-lime"
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyzeImage}
        disabled={!selectedImage || loading}
        className="w-full bg-bento-lime bento-border rounded-2xl py-3.5 font-black text-sm text-bento-dark hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-bento-dark border-t-transparent rounded-full animate-spin" />
            Analyzing leaf...
          </span>
        ) : (
          "🔬 ANALYZE WITH AI"
        )}
      </button>

      {/* Diagnosis Results */}
      {diagnosis && (
        <div className="space-y-4 animate-fadeIn">
          {/* Main Result Card */}
          <div className="bento-card bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-black text-bento-dark text-lg">{diagnosis.diseaseName}</h3>
                <p className="text-xs font-bold text-bento-olive">{diagnosis.cropName} • Crop Analysis</p>
              </div>
              <span className={`px-3 py-1 rounded-xl text-[10px] font-black ${statusColors[diagnosis.healthStatus] || statusColors.WARNING}`}>
                {diagnosis.healthStatus}
              </span>
            </div>

            {/* Confidence Bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-bold text-bento-olive">AI Confidence</span>
                <span className="text-xs font-black text-bento-dark">{diagnosis.confidence}%</span>
              </div>
              <div className="w-full bg-bento-warm rounded-full h-2.5 bento-border">
                <div
                  className="bg-bento-lime h-full rounded-full"
                  style={{ width: `${diagnosis.confidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="bento-card bg-bento-peach p-4">
            <h4 className="font-black text-bento-dark text-sm mb-1.5">🔍 Symptoms</h4>
            <p className="text-sm font-medium text-bento-olive">{diagnosis.symptoms}</p>
          </div>

          {/* Organic Treatment */}
          <div className="bento-card bg-bento-lime p-4">
            <h4 className="font-black text-bento-dark text-sm mb-1.5">🌿 Organic Treatment</h4>
            <p className="text-sm font-medium text-bento-dark">{diagnosis.organicTreatment}</p>
          </div>

          {/* Chemical Treatment */}
          <div className="bento-card bg-bento-skyblue p-4">
            <h4 className="font-black text-bento-dark text-sm mb-1.5">⚗️ Chemical Treatment</h4>
            <p className="text-sm font-medium text-bento-dark">{diagnosis.chemicalTreatment}</p>
          </div>

          {/* Prevention */}
          <div className="bento-card bg-bento-lavender p-4">
            <h4 className="font-black text-bento-dark text-sm mb-1.5">🛡️ Prevention</h4>
            <p className="text-sm font-medium text-bento-dark">{diagnosis.prevention}</p>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={saveToHistory}
              className="flex-1 bg-bento-dark text-white font-black text-sm py-3 rounded-2xl hover:opacity-90 transition-opacity"
            >
              {saved ? "✅ Saved to History" : "💾 Save to History"}
            </button>
            <Link
              href="/history"
              className="flex-1 bg-white bento-border text-bento-dark font-black text-sm py-3 rounded-2xl text-center hover:bg-bento-lime transition-colors"
            >
              📋 View History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
