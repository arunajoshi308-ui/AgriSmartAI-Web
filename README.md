# 🌾 AgriSmart AI

**AI Crop Yield Optimizer & Real-time Plant Disease Detector**
Created by Class 9 Student Innovators • Powered by Gemini 3.5 Flash

## Features

- **🌐 Website Portal** — Bento grid home page with feature overview
- **📷 Disease Scanner** — Upload a leaf photo for instant AI disease diagnosis
- **💬 AI Crop Advisor Chat** — 24/7 agronomy chatbot powered by Gemini
- **📊 Yield Optimizer** — Calculate crop yield and revenue forecasts
- **🕘 Scan History** — Review past disease scans and lab results

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** — Bento grid design system
- **Gemini 3.5 Flash API** — AI chat and disease detection

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key. Get one at https://aistudio.google.com/apikey. If unset, app uses built-in expert fallback responses. |

## Design

Bento grid layout with:
- Primary: Lime green (#D1E67C)
- Dark: #1C1C16
- Background: #FAFAF8
- Accents: Peach, Lavender, Sky Blue, Warm

## License

Open source — Created by Class 9 Student Innovators.
