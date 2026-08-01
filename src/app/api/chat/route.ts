import { NextRequest, NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are AgriSmart AI, a versatile AI assistant created by Class 9 Student Innovators.

You are an expert in agriculture — crop yield optimization, plant disease diagnosis, soil health, irrigation, fertilizer/NPK guidance, organic farming, pest control — but you can also answer ANY question the user asks.

You can help with:
- General knowledge and questions about any topic (science, history, geography, math, technology, health, etc.)
- Homework help and explanations
- Writing and creative tasks (essays, emails, stories, poems)
- Programming and coding questions
- Planning and advice (travel, career, life decisions)
- Calculations and conversions
- Fun conversations, jokes, trivia

Rules:
- Always be helpful, friendly, and supportive
- Give practical, actionable answers with formatting like bolding, bullet points, and step-by-step instructions when appropriate
- Keep tone warm and approachable — you're like a smart friend who knows everything
- If someone asks about agriculture, bring your full expertise. If they ask about anything else, answer it just as well.
- Never say "I can only help with agriculture" or refuse to answer — you can answer everything.`;

function getFallbackAnswer(prompt: string): string {
  const p = prompt.toLowerCase();

  // Agriculture topics
  if (p.includes("fertilizer") || p.includes("npk")) {
    return `🌿 **Optimal Fertilizer & NPK Guide**:\n\n• **Nitrogen (N)**: Essential for leafy vegetative growth. Apply early during leaf development.\n• **Phosphorus (P)**: Crucial for strong root establishment and flower bloom.\n• **Potassium (K)**: Boosts disease resistance, water retention, and fruit quality.\n\n**General NPK ratios:**\n- Wheat: 120:60:40 kg/ha\n- Rice: 100:50:50 kg/ha\n- Tomato: 180:90:120 kg/ha\n\n💡 Apply 50% Nitrogen at land prep and 50% at vegetative split for best results.`;
  }
  if (p.includes("pest") || p.includes("insect") || (p.includes("organic") && p.includes("control"))) {
    return `🐛 **Organic Pest Control Tips**:\n\n• **Neem Oil**: Mix 5ml neem oil + 1L water. Spray weekly on affected leaves.\n• **Garlic-Chili Spray**: Blend 10 garlic cloves + 2 chilies in 1L water. Strain and spray.\n• **Companion Planting**: Marigolds repel nematodes; basil repels tomato hornworms.\n• **Crop Rotation**: Rotate every 2 seasons to disrupt pest life cycles.\n\n🌱 AgriSmart AI recommends weekly crop monitoring for early pest detection.`;
  }
  if (p.includes("irrigation") || p.includes("water") || p.includes("drought")) {
    return `💧 **Smart Irrigation Guide**:\n\n• **Drip Irrigation**: Saves 30-50% water vs flood irrigation. Best for tomatoes, cotton.\n• **Scheduling**: Water early morning (5-7 AM) to minimize evaporation loss.\n• **Soil Moisture**: Maintain at field capacity during germination and flowering.\n• **Drought**: Use mulching (straw/leaves) to retain soil moisture.\n\n📊 AgriSmart AI yield optimizer factors irrigation method into your revenue estimate!`;
  }
  if (p.includes("wheat") || (p.includes("yield") && p.includes("boost")) || (p.includes("crop") && p.includes("increase"))) {
    return `🌾 **Wheat Yield Optimization Tips**:\n\n• **Seed Rate**: Use 100-125 kg/ha certified seed for optimal plant density.\n• **Sowing Time**: Optimal window is November 15 - December 15.\n• **Nitrogen Split**: 50% basal + 25% at CRI stage + 25% at flowering.\n• **Weed Control**: Apply 2,4-D at 30-35 days post-sowing.\n• **Irrigation**: 4-6 irrigations at CRI, tillering, late jointing, flowering, dough stages.\n\n📈 Expected yield: 2.8 tons/acre with optimal practices!`;
  }

  // General knowledge topics
  if (p.includes("hello") || p.includes("hi") || p.includes("hey")) {
    return `👋 Hello! I'm AgriSmart AI, your all-round AI assistant! 🌱\n\nI can help you with:\n• 🌾 Agriculture, crops, soil, irrigation, pest control\n• 📚 General knowledge, homework, science, history\n• 💻 Coding and programming\n• ✍️ Writing, essays, creative tasks\n• 🧮 Math and calculations\n• 💬 Just about anything else!\n\nWhat can I help you with today?`;
  }
  if (p.includes("joke")) {
    return `😄 Here's one for you:\n\nWhy did the scarecrow win an award?\n\nBecause he was **outstanding in his field**! 🌾😂\n\nWant another one? Just ask!`;
  }
  if (p.includes("math") || p.includes("calculate") || p.includes("equation")) {
    return `🧮 I'd love to help with math! \n\nI can handle arithmetic, algebra, geometry, calculus, statistics, and more. \n\nJust type your problem clearly (e.g. "What is 15% of 240?" or "Solve 2x + 5 = 17") and I'll work it out step by step! 📐`;
  }
  if (p.includes("code") || p.includes("program") || p.includes("python") || p.includes("javascript")) {
    return `💻 I can help with coding! I know Python, JavaScript, Java, C++, HTML/CSS, SQL, and more.\n\nTell me what you're trying to build or what error you're stuck on, and I'll walk you through the solution with code examples. 🚀`;
  }
  if (p.includes("write") || p.includes("essay") || p.includes("poem") || p.includes("story")) {
    return `✍️ I'd love to help you write! I can help with essays, stories, poems, emails, reports, and more.\n\nTell me the topic, length, and style you want, and I'll craft it for you! 📝`;
  }

  return `🌱 I'm AgriSmart AI — I can answer ANY question you have!\n\nI'm an expert in agriculture 🌾, but I can also help with:\n• 📚 General knowledge & homework\n• 💻 Programming & coding\n• ✍️ Writing & creative tasks\n• 🧮 Math & calculations\n• 💬 Advice on any topic\n\n⚠️ *Note: Connect the GEMINI_API_KEY to unlock full AI responses. Currently running in offline mode with limited responses.*\n\nAsk me anything! 🚀`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const userPrompt = prompt || (messages && messages[messages.length - 1]?.content) || "";

    // If no API key, use fallback responses
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
