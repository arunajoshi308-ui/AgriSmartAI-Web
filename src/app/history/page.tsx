"use client";

import { useState, useEffect } from "react";

interface ScanRecord {
  cropName: string;
  diseaseName: string;
  healthStatus: string;
  confidence: number;
  symptoms: string;
  organicTreatment: string;
  chemicalTreatment: string;
  prevention: string;
  timestamp: number;
  image?: string;
}

const statusColors: Record<string, string> = {
  HEALTHY: "bg-green-200 text-green-900",
  WARNING: "bg-yellow-200 text-yellow-900",
  DISEASED: "bg-red-200 text-red-900",
};

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("agriScanHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const deleteRecord = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    localStorage.setItem("agriScanHistory", JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem("agriScanHistory");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 page-enter">
      {/* Header */}
      <div className="bento-card bg-bento-warm p-4 flex items-center justify-between animate-slideDown hover-lift">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bento-dark flex items-center justify-center animate-float">
            <span className="text-bento-warm text-lg">🕘</span>
          </div>
          <div>
            <h2 className="font-black text-bento-dark text-base">Scan History &amp; Lab</h2>
            <p className="text-xs font-bold text-bento-olive">
              {history.length} saved {history.length === 1 ? "diagnosis" : "diagnoses"}
            </p>
          </div>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-black text-bento-olive hover:text-bento-orange transition-colors hover:scale-105 active:scale-95"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="bento-card bg-white p-8 text-center animate-bounceIn hover-lift">
          <div className="text-5xl mb-4 animate-float">🌱</div>
          <h3 className="font-black text-bento-dark text-base mb-1">No Scans Yet</h3>
          <p className="text-sm font-bold text-bento-olive mb-4">
            Start scanning plant leaves to build your history
          </p>
          <a
            href="/scanner"
            className="inline-block bg-bento-lime bento-border rounded-2xl px-6 py-3 font-black text-sm text-bento-dark hover:scale-105 active:scale-95 transition-all press"
          >
            📷 Open Disease Scanner
          </a>
        </div>
      ) : (
        /* History List */
        <div className="space-y-3">
          {history.map((record, i) => (
            <div
              key={i}
              className="bento-card bg-white overflow-hidden hover-lift animate-slideUp"
              style={{ animationDelay: `${0.08 * (i + 1)}s` }}
            >
              <div
                className="p-4 cursor-pointer transition-all hover:bg-bento-bg/50"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {record.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={record.image}
                        alt={record.cropName}
                        className="w-12 h-12 rounded-xl object-cover bento-border transition-transform hover:scale-110"
                      />
                    )}
                    <div>
                      <h3 className="font-black text-bento-dark text-sm">{record.diseaseName}</h3>
                      <p className="text-xs font-bold text-bento-olive">
                        {record.cropName} • {new Date(record.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black animate-pop ${statusColors[record.healthStatus] || statusColors.WARNING}`}>
                      {record.healthStatus}
                    </span>
                    <span className="text-xs font-black text-bento-dark">{record.confidence}%</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-bento-olive line-clamp-2">
                  {record.symptoms}
                </p>
                {expanded === i && (
                  <div className="mt-3 pt-3 border-t-2 border-bento-dark/10 space-y-3 animate-slideUp">
                    <div className="animate-fadeIn delay-1">
                      <p className="text-[10px] font-black text-bento-olive uppercase mb-1">🌿 Organic Treatment</p>
                      <p className="text-sm font-medium text-bento-dark">{record.organicTreatment}</p>
                    </div>
                    <div className="animate-fadeIn delay-2">
                      <p className="text-[10px] font-black text-bento-olive uppercase mb-1">⚗️ Chemical Treatment</p>
                      <p className="text-sm font-medium text-bento-dark">{record.chemicalTreatment}</p>
                    </div>
                    <div className="animate-fadeIn delay-3">
                      <p className="text-[10px] font-black text-bento-olive uppercase mb-1">🛡️ Prevention</p>
                      <p className="text-sm font-medium text-bento-dark">{record.prevention}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteRecord(i); }}
                      className="text-xs font-black text-bento-orange hover:text-red-700 transition-colors hover:scale-105 active:scale-95 press"
                    >
                      🗑️ Delete Record
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
