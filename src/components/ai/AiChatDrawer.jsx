import { useState, useRef, useEffect } from "react";
import { useAi } from "../../context/AiContext";
import {
  Sparkles,
  Send,
  X,
  Trash2,
  RefreshCw,
  Bot,
  User,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import FormattedAiMessage from "./FormattedAiMessage";
import AiProductMiniCard from "./AiProductMiniCard";

const SUGGESTED_PROMPTS = [
  "🔥 Recommend trending products under $100",
  "💻 Find the best laptops and electronics",
  "👟 Show me running shoes and sports gear",
  "🎧 Best audio accessories with noise cancellation",
];

export const AiChatDrawer = () => {
  const {
    isAiOpen,
    closeAi,
    messages,
    isSending,
    isAiOnline,
    aiUrl,
    checkHealth,
    sendMessage,
    clearMessages,
  } = useAi();

  const [input, setInput] = useState("");
  const [checking, setChecking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAiOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isAiOpen, messages, isSending]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePing = async () => {
    setChecking(true);
    await checkHealth();
    setChecking(false);
  };

  const handlePromptClick = (prompt) => {
    sendMessage(prompt);
  };

  if (!isAiOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeAi}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg lg:max-w-xl glass-panel bg-slate-950/95 border-l border-slate-800 shadow-2xl flex flex-col animate-slide-in">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-base">SwiftCart AI</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 font-mono">
                    Assistant
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex h-2 w-2 relative">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isAiOnline ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isAiOnline ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAiOnline ? (
                      <span className="text-emerald-400 font-medium">FastAPI Service Connected</span>
                    ) : (
                      <span className="text-amber-400 font-medium">Service Offline (:8000)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePing}
                disabled={checking}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Ping AI Service"
              >
                <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
              </button>

              <button
                type="button"
                onClick={clearMessages}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={closeAi}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2.5 bg-slate-900/30 border-b border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Try:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700/60 text-slate-300 hover:text-indigo-200 text-xs shrink-0 transition-all font-medium whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-md ${
                      isUser
                        ? "bg-indigo-600 text-white"
                        : "bg-linear-to-tr from-purple-600 to-indigo-600 text-white"
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                      isUser
                        ? "bg-linear-to-br from-indigo-600 to-purple-600 text-white rounded-tr-sm"
                        : msg.isError
                        ? "bg-rose-950/40 border border-rose-500/40 text-rose-200 rounded-tl-sm"
                        : "glass-card bg-slate-900/80 border border-slate-800/80 text-slate-200 rounded-tl-sm"
                    }`}
                  >
                    <FormattedAiMessage content={msg.content} />

                    {/* Interactive Product cards if any were matched */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-2">
                        <p className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Recommended Catalog Items:
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.products.map((product) => (
                            <AiProductMiniCard
                              key={product.id}
                              product={product}
                              onNavigate={closeAi}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      className={`mt-2 text-[10px] text-right ${
                        isUser ? "text-indigo-200" : "text-slate-500"
                      }`}
                    >
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Thinking / Streaming Indicator */}
            {isSending && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-xl shrink-0 bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="p-4 rounded-2xl glass-card bg-slate-900/80 border border-slate-800 rounded-tl-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching catalog & generating recommendation...</span>
                  </div>
                  <div className="flex gap-1 pt-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                  </div>
                </div>
              </div>
            )}

            {/* Offline Helper Card if AI is offline */}
            {!isAiOnline && (
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>SwiftCart AI Service Offline</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Start your local FastAPI service to chat with AI:
                </p>
                <div className="p-2 rounded-lg bg-black/50 font-mono text-[11px] text-emerald-400 select-all border border-slate-800">
                  cd swiftcart-ai &amp;&amp; uvicorn app.main:app --port 8000
                </div>
                <p className="text-[10px] text-slate-400">
                  Target: <span className="font-mono text-slate-300">{aiUrl}</span>
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60">
            <form onSubmit={handleSend} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products, compare prices, or request suggestions..."
                  className="w-full pl-4 pr-24 py-3 rounded-2xl glass-input text-xs sm:text-sm bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 shadow-inner"
                  disabled={isSending}
                />

                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="submit"
                    disabled={!input.trim() || isSending}
                    className="p-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/30 transition-all active:scale-95"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                <span>Press Enter to send</span>
                <span>Powered by Gemini &amp; ChromaDB</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatDrawer;
