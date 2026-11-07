import React, { useState } from "react";
import Modal from "./Modal";
import { useConfig } from "../../context/ConfigContext";
import { useAi } from "../../context/AiContext";
import { Server, RefreshCw, Globe, Sparkles, Bot } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { DEFAULT_RENDER_BASE_URL } from "../../api/client";
import { DEFAULT_AI_URL } from "../../api/aiApi";

export const ConfigModal = ({ isOpen, onClose }) => {
  const { isOnline, checking, activeUrl, mode, changeMode, checkConnection } = useConfig();
  const { isAiOnline, aiUrl, updateAiUrl, checkHealth: checkAiHealth } = useAi();

  const [customInput, setCustomInput] = useState(activeUrl || DEFAULT_RENDER_BASE_URL);
  const [customAiInput, setCustomAiInput] = useState(aiUrl || DEFAULT_AI_URL);
  const [testing, setTesting] = useState(false);
  const [testingAi, setTestingAi] = useState(false);
  const { success, error } = useToast();

  const handleTest = async () => {
    setTesting(true);
    const result = await checkConnection();
    setTesting(false);
    if (result.online) {
      success(`Connected successfully to backend (HTTP ${result.status})!`);
    } else {
      error(`Unable to connect: ${result.error || result.message || 'Offline'}`);
    }
  };

  const handleTestAi = async () => {
    setTestingAi(true);
    const result = await checkAiHealth();
    setTestingAi(false);
    if (result.online) {
      success(`Connected to SwiftCart AI service!`);
    } else {
      error(`AI Service unreachable at ${aiUrl}: ${result.error || 'Offline'}`);
    }
  };

  const handleSetAiUrl = () => {
    if (!customAiInput.trim()) return;
    updateAiUrl(customAiInput.trim());
    success(`AI Service URL updated to ${customAiInput.trim()}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Environment & Services Configuration"
      subtitle="Manage your Spring Boot backend and Python FastAPI AI shopping assistant endpoints"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Backend connection section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              Spring Boot E-Commerce Core
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isOnline ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
              {isOnline ? "Online" : "Disconnected"}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isOnline
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : "bg-rose-950/20 border-rose-500/30 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  isOnline ? "bg-emerald-400 animate-ping" : "bg-rose-400"
                }`}
              />
              <p className="text-xs truncate font-mono">
                Target: {activeUrl || DEFAULT_RENDER_BASE_URL}
              </p>
            </div>
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || checking}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${testing || checking ? "animate-spin" : ""}`} />
              Test Ping
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              onClick={() => changeMode("render")}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                mode === "render"
                  ? "bg-indigo-950/40 border-indigo-500 text-white"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold">Render Cloud</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  e-commercebackendproject.onrender.com
                </p>
              </div>
            </div>

            <div
              onClick={() => changeMode("local")}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                mode === "local"
                  ? "bg-indigo-950/40 border-indigo-500 text-white"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
              }`}
            >
              <Server className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold">Local Spring Boot</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  http://localhost:8080
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Service Configuration section */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              SwiftCart AI Assistant (FastAPI)
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isAiOnline ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
              {isAiOnline ? "AI Ready" : "AI Offline"}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isAiOnline
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                : "bg-amber-950/20 border-amber-500/30 text-amber-300"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Bot className="w-4 h-4 shrink-0 text-purple-400" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white">
                  FastAPI Semantic Assistant
                </p>
                <p className="text-[11px] font-mono text-slate-400 truncate">
                  {aiUrl}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestAi}
              disabled={testingAi}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${testingAi ? "animate-spin" : ""}`} />
              Ping AI
            </button>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              AI Service Host Endpoint
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAiInput}
                onChange={(e) => setCustomAiInput(e.target.value)}
                placeholder="http://localhost:8000"
                className="flex-1 px-3 py-2 rounded-xl glass-input text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleSetAiUrl}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs transition-colors shrink-0"
              >
                Update AI URL
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Start with: <code className="text-slate-400 font-mono">cd swiftcart-ai &amp;&amp; uvicorn app.main:app --port 8000</code>
            </p>
          </div>
        </div>

        {/* Action footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfigModal;
