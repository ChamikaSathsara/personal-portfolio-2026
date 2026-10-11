"use client";

import { useState } from "react";
import { Copy, Check, Download, ChevronDown, ChevronUp } from "lucide-react";

interface JsonPreviewProps {
  data: unknown;
  filename?: string;
  label?: string;
}

export default function JsonPreview({ data, filename = "data.json", label = "Generated JSON" }: JsonPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const copyJson = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono uppercase tracking-widest text-[var(--muted-2)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {label}
          </span>
          <span className="badge text-xs">{filename}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] text-xs text-[var(--muted)] hover:text-white hover:border-[var(--border-strong)] transition-all font-mono"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {copied ? <Check size={12} className="text-[var(--accent)]" /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={downloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] text-xs text-[var(--muted)] hover:text-white hover:border-[var(--border-strong)] transition-all font-mono"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <Download size={12} />
            Download
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 border border-[var(--border)] text-[var(--muted)] hover:text-white transition-all"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* JSON content */}
      {expanded && (
        <div className="overflow-auto max-h-96">
          <pre className="p-4 text-xs font-mono text-[var(--muted)] leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
            <code>{jsonString}</code>
          </pre>
        </div>
      )}

      {!expanded && (
        <div className="p-3">
          <p className="text-xs text-[var(--muted-2)] font-mono text-center" style={{ fontFamily: "var(--font-mono)" }}>
            Click expand to preview JSON — {jsonString.split("\n").length} lines
          </p>
        </div>
      )}
    </div>
  );
}
