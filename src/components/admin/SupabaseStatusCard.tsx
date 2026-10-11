"use client";

import { useState, useEffect } from "react";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CloudUpload,
} from "lucide-react";

interface SupabaseStatusResponse {
  success: boolean;
  connected: boolean;
  statusText: string;
  config: {
    hasUrl: boolean;
    url: string;
    hasPublishableKey: boolean;
    hasSecretKey: boolean;
    isMaskedSecretKey: boolean;
    jwksUrl: string;
  };
  sqlSchema: string;
}

export default function SupabaseStatusCard() {
  const [data, setData] = useState<SupabaseStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/supabase");
      const json = await res.json();
      setData(json);
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await fetch("/api/admin/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test" }),
      });
      const json = await res.json();
      setData((prev) => (prev ? { ...prev, ...json } : null));
    } catch {
      // Ignore
    } finally {
      setTesting(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync-all" }),
      });
      const json = await res.json();
      if (json.success) {
        setSyncResult("Successfully synced all local CMS data to Supabase tables!");
      } else {
        setSyncResult(json.error || "Sync completed with warnings. Check database tables.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sync failed";
      setSyncResult(`Sync error: ${msg}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 6000);
    }
  };

  const copySql = () => {
    if (!data?.sqlSchema) return;
    navigator.clipboard.writeText(data.sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="panel p-6 animate-pulse space-y-4">
        <div className="h-5 w-48 bg-white/10 rounded" />
        <div className="h-4 w-72 bg-white/5 rounded" />
      </div>
    );
  }

  const isConfigured = data?.config?.hasUrl && data?.config?.hasPublishableKey;
  const isMaskedSecret = data?.config?.isMaskedSecretKey;

  return (
    <div className="panel p-6 space-y-5 border border-emerald-500/20 bg-emerald-950/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Database size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Supabase Cloud Database
              </h2>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  data?.connected
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : isConfigured
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                    : "bg-red-500/15 border-red-500/40 text-red-400"
                }`}
              >
                {data?.connected ? "CONNECTED" : isConfigured ? "CONFIGURED (TABLES PENDING)" : "NOT CONNECTED"}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Integrated with @supabase/server & @supabase/supabase-js
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTest}
            disabled={testing}
            className="btn-ghost text-xs px-3 py-1.5 inline-flex items-center gap-1.5"
          >
            <RefreshCw size={12} className={testing ? "animate-spin" : ""} />
            <span>{testing ? "Testing..." : "Test Connection"}</span>
          </button>

          <button
            onClick={handleSyncAll}
            disabled={syncing}
            className="btn-primary text-xs px-3.5 py-1.5 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 border-emerald-500"
          >
            <CloudUpload size={13} className={syncing ? "animate-spin" : ""} />
            <span>{syncing ? "Syncing..." : "Sync All to Supabase"}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Feedback */}
      {syncResult && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 size={15} className="shrink-0" />
          <span>{syncResult}</span>
        </div>
      )}

      {/* Connection & Configuration Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-1.5 font-mono">
          <div className="text-[var(--muted)] text-[10px] uppercase tracking-wider">Project Endpoint</div>
          <div className="text-white truncate font-medium">{data?.config?.url || "Not set"}</div>
        </div>

        <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-1.5 font-mono">
          <div className="text-[var(--muted)] text-[10px] uppercase tracking-wider">Publishable Key</div>
          <div className="text-emerald-400 truncate flex items-center gap-1.5 font-medium">
            <Check size={12} />
            <span>Configured (Client Queries)</span>
          </div>
        </div>
      </div>

      {/* Secret Key Notice */}
      {isMaskedSecret && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle size={15} />
            <span>Masked Secret Key Notice</span>
          </div>
          <p className="text-[11px] text-amber-200/80 leading-relaxed">
            Your `.env` contains bullet points (<code>••••</code>) in <code>SUPABASE_SECRET_KEY</code>.
            To bypass Row Level Security for admin mutations, copy your unmasked secret key from{" "}
            <a
              href="https://supabase.com/dashboard/project/khjevvstddndlfohlkin/settings/api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-amber-300 inline-flex items-center gap-0.5 hover:text-white"
            >
              Supabase Project API Settings <ExternalLink size={10} />
            </a>{" "}
            and replace the value in `.env`. The publishable key is currently active.
          </p>
        </div>
      )}

      {/* Status Details */}
      <div className="text-xs text-[var(--muted)] flex items-center justify-between pt-1">
        <span>Status: <strong className="text-white">{data?.statusText}</strong></span>
        <a
          href="https://supabase.com/dashboard/project/khjevvstddndlfohlkin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 text-[11px]"
        >
          <span>Open Supabase Dashboard</span>
          <ExternalLink size={11} />
        </a>
      </div>

      {/* Schema / SQL Setup Section */}
      <div className="pt-2 border-t border-[var(--border)]">
        <button
          onClick={() => setShowSql(!showSql)}
          className="w-full flex items-center justify-between text-xs text-[var(--muted)] hover:text-white transition-colors py-1"
        >
          <span className="font-mono text-[11px] uppercase tracking-wider">
            {showSql ? "Hide Supabase SQL Schema Setup" : "View Supabase SQL Schema Setup Script"}
          </span>
          {showSql ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showSql && (
          <div className="mt-3 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--muted)]">
                Copy and run this in your Supabase SQL Editor to create tables (projects, blogs, site_config, experience, skills) with RLS policies:
              </span>
              <button
                onClick={copySql}
                className="btn-ghost text-xs px-2.5 py-1 inline-flex items-center gap-1"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? "Copied!" : "Copy SQL"}</span>
              </button>
            </div>
            <pre className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-[11px] font-mono text-[var(--muted)] overflow-x-auto max-h-60 leading-relaxed">
              {data?.sqlSchema}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
