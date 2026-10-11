"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Copy, Check, ArrowRight, Send, MessageSquare, Sparkles } from "lucide-react";
import type { SiteConfig } from "@/types";

interface ContactProps {
  site: SiteConfig;
}

export default function Contact({ site }: ContactProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(site.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Build mailto link
    const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
      formData.subject || "Project Inquiry"
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="section-label">Get In Touch</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Let&apos;s Build Something{" "}
            <span className="gradient-text">Great Together.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Have a project in mind, an engineering position to discuss, or want to collaborate? I&apos;d love to hear from you.
          </p>
        </div>

        {/* 2-Column Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Email Card */}
            <div className="glass-card p-6 flex items-center justify-between group hover:border-violet-500/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Email
                  </div>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-sm sm:text-base font-semibold text-white hover:text-violet-300 transition-colors"
                  >
                    {site.email}
                  </a>
                </div>
              </div>

              <button
                onClick={copyEmail}
                className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all"
                aria-label="Copy email address"
                title="Copy email"
              >
                {copiedEmail ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {/* Phone Card */}
            <div className="glass-card p-6 flex items-center justify-between group hover:border-cyan-500/40 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </div>
                  <a
                    href={`tel:${site.phone}`}
                    className="text-sm sm:text-base font-semibold text-white hover:text-cyan-300 transition-colors"
                  >
                    {site.phone}
                  </a>
                </div>
              </div>

              <button
                onClick={copyPhone}
                className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all"
                aria-label="Copy phone number"
                title="Copy phone"
              >
                {copiedPhone ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {/* Location Card */}
            <div className="glass-card p-6 flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Location
                </div>
                <div className="text-sm sm:text-base font-semibold text-white">
                  {site.location}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  GMT+5:30 (Available for remote global teams)
                </div>
              </div>
            </div>

            {/* Quick Status Note */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Quick Response Guarantee</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                I typically respond to inquiries within 24 hours. Feel free to connect for freelance projects, technical consulting, or full-time roles.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (7 Cols) */}
          <div className="lg:col-span-7 glass-panel p-8 sm:p-10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Send a Direct Message</h3>
                  <p className="text-xs font-mono text-slate-400">Directly reaches my inbox</p>
                </div>
              </div>
              <Sparkles size={18} className="text-violet-400" />
            </div>

            {submitted ? (
              <div className="p-8 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                  <Check size={24} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Message Composed!</h4>
                <p className="text-sm text-slate-300 mb-6">
                  Your email client has been opened with your message. If it didn&apos;t open automatically, you can email me directly at {site.email}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-ghost text-xs"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-2">
                      Your Name <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-2">
                      Your Email <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-2">
                    Subject / Project Topic
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Web App Development / Hiring Inquiry"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block mb-2">
                    Message <span className="text-violet-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your project, timeline, or position..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 text-sm sm:text-base group"
                >
                  <span>Send Message</span>
                  <Send
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
