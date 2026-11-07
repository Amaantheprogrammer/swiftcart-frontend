import React from "react";

// Lightweight markdown renderer without external heavy deps
export const FormattedAiMessage = ({ content }) => {
  if (!content) return null;

  // Split into paragraphs / lines
  const lines = content.split("\n");

  const renderInlineFormatted = (text) => {
    // Regex for bold **text**, inline `code`, and links
    const parts = [];
    let lastIndex = 0;
    const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const matchStr = match[0];
      if (matchStr.startsWith("**") && matchStr.endsWith("**")) {
        parts.push(
          <strong key={match.index} className="font-semibold text-white">
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith("`") && matchStr.endsWith("`")) {
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[11px]"
          >
            {matchStr.slice(1, -1)}
          </code>
        );
      } else if (matchStr.startsWith("*") && matchStr.endsWith("*")) {
        parts.push(
          <em key={match.index} className="italic text-slate-300">
            {matchStr.slice(1, -1)}
          </em>
        );
      }

      lastIndex = match.index + matchStr.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-slate-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet point
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 py-0.5">
              <span className="text-indigo-400 font-bold shrink-0">•</span>
              <span className="flex-1">{renderInlineFormatted(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Numbered list: 1. Item
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1.5 py-0.5">
              <span className="text-indigo-400 font-bold text-xs shrink-0 font-mono">
                {numMatch[1]}.
              </span>
              <span className="flex-1">{renderInlineFormatted(numMatch[2])}</span>
            </div>
          );
        }

        // Standard paragraph line
        return <p key={idx}>{renderInlineFormatted(line)}</p>;
      })}
    </div>
  );
};

export default FormattedAiMessage;
