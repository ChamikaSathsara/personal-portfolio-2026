"use client";

import { useState, useEffect } from "react";
import { getSiteConfig } from "@/lib/data";
import type { SiteConfig } from "@/types";
import JsonPreview from "@/components/admin/JsonPreview";
import ImageUploader from "@/components/admin/ImageUploader";
import { saveCmsData, fetchCmsData } from "@/lib/admin-api";
import { CheckCircle2, Loader2 } from "lucide-react";
import SupabaseStatusCard from "@/components/admin/SupabaseStatusCard";

export default function AdminSettingsPage() {
  const initial = getSiteConfig();
  const [site, setSite] = useState<SiteConfig>(initial);
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchCmsData<SiteConfig>("site").then((data) => {
      if (data && typeof data === "object" && data.name) {
        setSite(data);
      }
    });
  }, []);

  const updateField = (key: keyof SiteConfig, value: unknown) => {
    setSite((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateSocial = (key: keyof SiteConfig["socials"], value: string) => {
    setSite((prev) => ({ ...prev, socials: { ...prev.socials, [key]: value } }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await saveCmsData(
      "site",
      site,
      avatarDataUrl
        ? { path: site.avatarUrl || "/images/profile/chamika.webp", dataUrl: avatarDataUrl }
        : undefined
    );
    setSaving(false);
    setSaved(true);

    if (res.success) {
      setSavedStatus("Site settings saved to Supabase DB & disk in real time!");
      setTimeout(() => setSavedStatus(null), 3500);
    } else {
      setSavedStatus("Failed to sync site settings.");
      setTimeout(() => setSavedStatus(null), 3500);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Real-time Notification Banner */}
      {savedStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{savedStatus}</span>
          </div>
          <span className="text-[10px] text-emerald-400/70">Live on public site</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            Site Settings
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">Configure your portfolio information • Real-time persistence</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-sm inline-flex items-center gap-1.5"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          <span>{saving ? "Saving..." : "Save Settings (Real-time)"}</span>
        </button>
      </div>

      {/* Supabase Cloud Connection & Sync */}
      <SupabaseStatusCard />

      <div className="panel p-6 space-y-5">
        <h2 className="text-sm font-bold text-white border-b border-[var(--border)] pb-3" style={{ fontFamily: "var(--font-display)" }}>
          Personal Info
        </h2>

        {[
          { label: "Full Name", key: "name" as const },
          { label: "Title / Role", key: "title" as const },
          { label: "Email", key: "email" as const },
          { label: "Phone", key: "phone" as const },
          { label: "Location", key: "location" as const },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              {label}
            </label>
            <input
              value={site[key] as string}
              onChange={(e) => updateField(key, e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none"
            />
          </div>
        ))}

        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
            Short Bio (Hero)
          </label>
          <textarea
            value={site.shortBio}
            onChange={(e) => updateField("shortBio", e.target.value)}
            rows={2}
            className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
            Full Bio (About section)
          </label>
          <textarea
            value={site.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            rows={5}
            className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none resize-none"
          />
        </div>

        <ImageUploader
          value={avatarDataUrl}
          onChange={(url) => { setAvatarDataUrl(url); updateField("avatarUrl", "/images/profile/chamika.webp"); }}
          onRemove={() => { setAvatarDataUrl(""); updateField("avatarUrl", ""); }}
          slug="chamika"
          type="profile"
          label="Profile Photo"
        />
      </div>

      {/* Social links */}
      <div className="panel p-6 space-y-4">
        <h2 className="text-sm font-bold text-white border-b border-[var(--border)] pb-3" style={{ fontFamily: "var(--font-display)" }}>
          Social Links
        </h2>
        {(["linkedin", "github", "medium", "behance"] as const).map((social) => (
          <div key={social}>
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              {social}
            </label>
            <input
              value={site.socials[social] || ""}
              onChange={(e) => updateSocial(social, e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none font-mono"
              style={{ fontFamily: "var(--font-mono)" }}
              placeholder={`https://${social}.com/...`}
            />
          </div>
        ))}
      </div>

      {/* JSON Export */}
      {saved && (
        <JsonPreview data={site} filename="site.json" label="Updated site.json" />
      )}
    </div>
  );
}
