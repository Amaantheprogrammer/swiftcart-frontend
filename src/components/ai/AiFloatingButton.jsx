import { useAi } from "../../context/AiContext";
import { Sparkles, Bot } from "lucide-react";

export const AiFloatingButton = () => {
  const { isAiOpen, openAi, isAiOnline } = useAi();

  if (isAiOpen) return null;

  return (
    <button
      onClick={openAi}
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-2xl shadow-indigo-600/50 hover:shadow-indigo-600/70 border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in"
      aria-label="Open SwiftCart AI Shopping Assistant"
      title="Open SwiftCart AI Assistant"
    >
      <div className="relative">
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        <span
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
            isAiOnline ? "bg-emerald-400" : "bg-amber-400"
          }`}
        />
      </div>

      <div className="flex flex-col text-left">
        <span className="text-white font-extrabold tracking-wide text-xs">SwiftCart AI</span>
        <span className="text-[10px] text-indigo-100 font-medium hidden sm:inline">
          Shopping Assistant
        </span>
      </div>
    </button>
  );
};

export default AiFloatingButton;
