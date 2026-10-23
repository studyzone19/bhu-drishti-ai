import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import api from "../services/api.js";

const WELCOME = "Namaste! 🙏 I'm your **Bhu-Drishti AI Assistant**. I analyze satellite data from Sentinel-2A/2B and Sentinel-1A SAR to predict landslides 4-6 hours in advance.\n\nHow can I help you today?";

const QUICK_ACTIONS = [
  { label: "🔴 Current Risk", msg: "What is the current landslide risk?" },
  { label: "🛡️ Safety Tips", msg: "Give me landslide safety tips" },
  { label: "🚨 Evacuation", msg: "How to evacuate during a landslide?" },
  { label: "📡 Satellite", msg: "What satellite data do you use?" },
  { label: "🤖 AI Model", msg: "How does the prediction model work?" },
];

function fallbackResponse(msg) {
  const m = msg.toLowerCase();
  if (/risk|danger|threat|warning|alert|critical|score/.test(m))
    return "🔴 Based on current monitoring, several zones in NER show elevated risk. Key factors include recent rainfall exceeding 100mm/24h and soil saturation above 70%. Sentinel-1A SAR has detected surface displacement in critical zones. Please check the Risk Map for your specific area.";
  if (/safe|evacuat|escape|shelter|rescue|emergency|protect/.test(m))
    return "🛡️ **Safety Guidelines:**\n1) Move to higher ground immediately if you notice cracks in soil\n2) Avoid steep slopes during heavy rain\n3) Keep emergency kit ready\n4) Follow local authority instructions\n5) Emergency: **112** | NDRF: 011-24363260";
  if (/rain|weather|monsoon|flood|storm/.test(m))
    return "🌧️ Active monsoon patterns across NER. Cherrapunji and Dima Hasao regions are receiving heavy rainfall. Our AI processes real-time rainfall data at 15-minute intervals. Stay updated via our real-time weather panel.";
  if (/satellite|sentinel|sar|ndvi|radar|optical/.test(m))
    return "🛰️ **Satellite Sources:**\n• **Sentinel-2A/2B:** Optical imagery (NDVI, NDMI, NBR)\n• **Sentinel-1A SAR:** Radar-based ground displacement detection\n• Works through clouds, 24/7 monitoring\n• InSAR for mm-level surface movement tracking";
  if (/predict|model|ai|ml|accuracy|algorithm|how/.test(m))
    return "🤖 Our AI uses RandomForest (300 trees) trained on 25 satellite-derived features. ROC-AUC: 0.81. Prediction window: 4-6 hours. Features include rainfall, terrain, NDVI, SAR change detection, and seismic data.";
  if (/hello|hi|hey|namaste|help/.test(m))
    return WELCOME;
  return "I can help with:\n🔴 **Risk Analysis** — Current landslide risk\n🛡️ **Safety Tips** — NDMA guidelines\n🚨 **Evacuation** — Emergency protocol\n🛰️ **Satellite** — Data sources\n🤖 **AI Model** — How predictions work\n\nJust ask me anything!";
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: WELCOME, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing]);

  async function sendMessage(text) {
    if (!text.trim()) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { from: "user", text: text.trim(), time: ts }]);
    setInput("");
    setTyping(true);

    let reply;
    try {
      const res = await api.post("/risk/chat", { message: text });
      reply = res.data?.reply || fallbackResponse(text);
    } catch {
      reply = fallbackResponse(text);
    }

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 600 + Math.random() * 800);
  }

  // Render markdown-lite: **bold** and newlines
  function renderText(text) {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl shadow-orange-900/40 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Bot className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-[9999] w-[380px] h-[540px] bg-[#0b1121] border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002b5e] to-[#001a3a] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <h3 className="text-white text-sm font-bold">Bhu-Drishti AI</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] text-green-400 font-medium">Online — Sentinel Active</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-[13px] leading-relaxed ${
                    msg.from === "user"
                      ? "bg-orange-500 text-white rounded-br-sm"
                      : "bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700"
                  }`}
                >
                  {renderText(msg.text)}
                  <p className={`text-[9px] mt-1 ${msg.from === "user" ? "text-orange-200" : "text-slate-500"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 border-t border-slate-800 shrink-0 overflow-x-auto flex gap-2 custom-scrollbar">
            {QUICK_ACTIONS.map((qa, i) => (
              <button
                key={i}
                onClick={() => sendMessage(qa.msg)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 border border-slate-700 transition-colors shrink-0"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="px-3 py-2 border-t border-slate-800 flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about landslide risk..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-white px-3 py-2 rounded-lg transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
