import React, { useState } from "react";
import { useConfig } from "../../context/ConfigContext";
import { Server, Globe, RefreshCw, Settings, CheckCircle2, AlertTriangle } from "lucide-react";
import ConfigModal from "../common/ConfigModal";

export const BackendStatusBanner = () => {
  const { isOnline, checking, mode, activeUrl, checkConnection } = useConfig();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleQuickPing = async () => {
    setTesting(true);
    await checkConnection();
    setTesting(false);
  };

  return (
    <>
      <div className="bg-slate-900/90 border-b border-slate-800 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOnline ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isOnline ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
            </span>
            <span className="text-slate-300 font-medium">
              Backend Status:{" "}
              {isOnline ? (
                <span className="text-emerald-400 font-semibold">
                  Live Cloud Connected (Render)
                </span>
              ) : (
                <span className="text-rose-400 font-semibold">
                  Connecting to Render Cloud...
                </span>
              )}
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
              {activeUrl || "https://e-commercebackendproject.onrender.com"}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickPing}
              disabled={testing || checking}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors flex items-center gap-1"
              title="Ping Backend"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing || checking ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline text-[11px]">Ping</span>
            </button>

            <button
              onClick={() => setIsConfigOpen(true)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors flex items-center gap-1"
              title="Configure Backend Connection"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Server Config</span>
            </button>
          </div>
        </div>
      </div>

      <ConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </>
  );
};

export default BackendStatusBanner;
