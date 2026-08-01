import { NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are AgriSmart AI, an expert agricultural scientist and crop yield optimization chatbot created by Class 9 Student Innovators.
Your goal is to help farmers maximize crop yields, optimize fertilizer/irrigation usage, prevent soil degradation, and diagnose crop diseases.
Provide practical, actionable, easy-to-read advice using formatting like bolding, bullet points, and step-by-step instructions.
Keep tone friendly, supportive, and professional.`;

function getFallbackAnswer(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("fertilizer") || p.includes("npk")) {
    return `🌿 **Optimal Fertilizer & NPK Guide**:\n\n• **Nitrogen (N)**: Essential for leafy vegetative growth. Apply early during leaf development.\n• **Phosphorus (P)**: Crucial for strong root establishment and flower bloom.\n• **Potassium (K)**: Boosts disease resistance, water retention, and fruit quality.\n\n**General NPK ratios:**\n- Wheat: 120:60:40 kg/ha\n- Rice: 100:50:50 kg/ha\n- Tomato: 180:90:120 kg/ha\n\n💡 Apply 50% Nitrogen at land prep and 50% at vegetative split for best results.`;
  }
  if (p.includes("pest") || p.includes("insect") || p.includes("organic")) {
    return `🐛 **Organic Pest Control Tips**:\n\n• **Neem Oil**: Mix 5ml neem oil + 1L water. Spray weekly on affected leaves.\n• **Garlic-Chili Spray**: Blend 10 garlic cloves + 2 chilies in 1L water. Strain and spray.\n• **Companion Planting**: Marigolds repel nematodes; basil repels tomato hornworms.\n• **Crop Rotation**: Rotate every 2 seasons to disrupt pest life cycles.\n\n🌱 AgriSmart AI recommends weekly crop monitoring for early pest detection.`;
  }
  if (p.includes("irrigation") || p.includes("water") || p.includes("drought")) {
    return `💧 **Smart Irrigation Guide**:\n\n• **Drip Irrigation**: Saves 30-50% water vs flood irrigation. Best for tomatoes, cotton.\n• **Scheduling**: Water early morning (5-7 AM) to minimize evaporation loss.\n• **Soil Moisture**: Maintain at field capacity during germination and flowering.\n• **Drought**: Use mulching (straw/leaves) to retain soil moisture.\n\n📊 AgriSmart AI yield optimizer factors irrigation method into your revenue estimate!`;
  }
  if (p.includes("wheat") || p.includes("yield") || p.includes("boost")) {
    return `🌾 **Wheat Yield Optimization Tips**:\n\n• **Seed Rate**: Use 100-125 kg/ha certified seed for optimal plant density.\n• **Sowing Time**: Optimal window is November 15 - December 15.\n• **Nitrogen Split**: 50% basal + 25% at CRI stage + 25% at flowering.\n• **Weed Control**: Apply 2,4-D at 30-35 days post-sowing.\n• **Irrigation**: 4-6 irrigations at CRI, tillering, late jointing, flowering, dough stages.\n\n📈 Expected yield: 2.8 tons/acre with optimal practices!`;
  }
  return `🌱 AgriSmart AI is here to help with crop yield optimization, plant disease diagnosis, soil health, irrigation, fertilizer (NPK) guidance, and organic farming.\n\nAsk me about:\n• Fertilizer and NPK ratios for specific crops\n• Organic pest control methods\n• Irrigation and water management\n• Crop-specific yield optimization\n• Soil health and pH management`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const userPrompt = prompt || (messages && messages[messages.length - 1]?.content) || "";

    // If no API key, use fallback expert responses
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return NextResponse.json({ response: getFallbackAnswer(userPrompt) });
    }

    const contents: Array<{ parts: Array<{ text: string }> }> = [];

    // Add conversation history
    if (messages && Array.isArray(messages)) {
      for (const msg of messages) {
        contents.push({
          parts: [{ text: msg.content || msg.text || "" }],
        });
      }
    }

    // Add current prompt
    if (prompt) {
      contents.push({ parts: [{ text: prompt }] });
    }

    const body = {
      contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    if (resp.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return NextResponse.json({ response: data.candidates[0].content.parts[0].text });
    }

    return NextResponse.json({ response: getFallbackAnswer(userPrompt) });
  } catch (error) {
    const { prompt } = await req.json().catch(() => ({ prompt: "" }));
    return NextResponse.json({ response: getFallbackAnswer(prompt || "") });
  }
}
