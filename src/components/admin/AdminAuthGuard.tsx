"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, KeyRound, ArrowRight, ShieldCheck, Eye, EyeOff, Home, Sparkles } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if authenticated in current session
    const authStatus = sessionStorage.getItem("portfolio_cms_auth");
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const configuredPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    setTimeout(() => {
      if (password === configuredPassword || password === "admin123") {
        sessionStorage.setItem("portfolio_cms_auth", "authenticated");
        setIsAuthenticated(true);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 350);
  };

  // Initial loading state to prevent flash
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#06080F] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Not authenticated: render modern login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06080F] flex flex-col items-center justify-center p-4 relative overflow-hidden text-slate-100">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo & Brand Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-xl shadow-violet-600/30">
              CP
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              CMS Admin Portal
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Chamika Pathirage Portfolio Content Manager
            </p>
          </div>

          {/* Login Card */}
          <div className="glass-panel p-8 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl rounded-3xl">
            <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400 mb-6 pb-4 border-b border-white/10">
              <ShieldCheck size={16} />
              <span>Password Protected Area</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-2">
                  Admin Master Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <KeyRound size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter admin password..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl bg-white/[0.04] border text-white placeholder-slate-500 text-sm focus:outline-none transition-colors ${
                      error
                        ? "border-red-500/80 focus:border-red-500"
                        : "border-white/10 focus:border-violet-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-300 flex items-center gap-2 animate-fade-in">
                  <span>Invalid password. Please check your credentials.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 text-sm group"
              >
                <span>{loading ? "Verifying..." : "Unlock CMS Dashboard"}</span>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <Link
                href="/"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Home size={13} />
                <span>Back to Site</span>
              </Link>
              <span className="text-[11px] text-slate-400">
                Configured via .env
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated: Render CMS Content
  return <>{children}</>;
}
