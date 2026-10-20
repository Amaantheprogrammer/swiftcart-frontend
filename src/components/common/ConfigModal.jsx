import React, { useState } from "react";
import Modal from "./Modal";
import { useConfig } from "../../context/ConfigContext";
import { Server, CheckCircle2, AlertCircle, RefreshCw, Globe } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { DEFAULT_RENDER_BASE_URL } from "../../api/client";

export const ConfigModal = ({ isOpen, onClose }) => {
  const { isOnline, checking, activeUrl, mode, changeMode, checkConnection } = useConfig();
  const [customInput, setCustomInput] = useState(activeUrl || DEFAULT_RENDER_BASE_URL);
  const [testing, setTesting] = useState(false);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Backend Server Configuration"
      subtitle="Connect to your live Render deployment or local Spring Boot instance"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Connection status card */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            isOnline
              ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/30 border-rose-500/30 text-rose-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full animate-ping ${
                isOnline ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            <div>
              <p className="font-semibold text-sm">
                {isOnline ? "Live Backend Connected" : "Backend Server Unreachable"}
              </p>
              <p className="text-xs opacity-80 mt-0.5 font-mono">
                Target: {activeUrl || DEFAULT_RENDER_BASE_URL}
              </p>
            </div>
          </div>
          <button
            onClick={handleTest}
            disabled={testing || checking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing || checking ? "animate-spin" : ""}`} />
            Test Ping
          </button>
        </div>

        {/* Target Environment options */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select API Environment
          </label>

          <div
            onClick={() => changeMode("render")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              mode === "render"
                ? "bg-indigo-950/40 border-indigo-500 text-white"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
            }`}
          >
            <Globe className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Live Cloud Deployment (Render)</p>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Default Cloud
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                https://e-commercebackendproject.onrender.com
              </p>
            </div>
          </div>

          <div
            onClick={() => changeMode("local")}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              mode === "local"
                ? "bg-indigo-950/40 border-indigo-500 text-white"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
            }`}
          >
            <Server className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Local Spring Boot Backend</p>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  :8080
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target: http://localhost:8080 (Requires MySQL & Redis running locally)
              </p>
            </div>
          </div>
        </div>

        {/* Custom URL input */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Or Custom API Host
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. https://my-backend.domain.com"
              className="flex-1 px-3.5 py-2 rounded-xl glass-input text-sm"
            />
            <button
              onClick={() => changeMode("custom", customInput)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shrink-0"
            >
              Set Host
            </button>
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
