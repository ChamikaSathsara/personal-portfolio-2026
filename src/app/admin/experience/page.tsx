"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, CheckCircle2, Loader2, Database } from "lucide-react";
import type { ExperienceItem } from "@/types";
import { getAllExperience } from "@/lib/data";
import JsonPreview from "@/components/admin/JsonPreview";
import { saveCmsData, fetchCmsData } from "@/lib/admin-api";

const empty: ExperienceItem = {
  id: "",
  company: "",
  role: "",
  duration: "",
  startDate: "",
  endDate: "",
  description: "",
  type: "full-time",
  current: false,
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>(getAllExperience());
  const [editing, setEditing] = useState<ExperienceItem | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchCmsData<ExperienceItem[]>("experience").then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setItems(data);
      }
    });
  }, []);

  const showNotification = (msg: string) => {
    setSavedStatus(msg);
    setTimeout(() => setSavedStatus(null), 3500);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    const id = editing.id || editing.company.toLowerCase().replace(/\s+/g, "-");
    const updated = { ...editing, id };

    const updatedList = items.some((x) => x.id === id)
      ? items.map((x) => (x.id === id ? updated : x))
      : [...items, updated];

    setItems(updatedList);
    setEditing(null);

    const res = await saveCmsData("experience", updatedList);
    setSaving(false);

    if (res.success) {
      showNotification("Experience position saved to Supabase DB & disk in real time!");
    } else {
      showNotification("Saved in session, could not sync.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this position?")) return;
    const updatedList = items.filter((x) => x.id !== id);
    setItems(updatedList);
    await saveCmsData("experience", updatedList);
    showNotification("Position deleted from Supabase DB & disk in real time!");
  };

  const updateField = <K extends keyof ExperienceItem>(key: K, value: ExperienceItem[K]) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div className="max-w-4xl space-y-6">
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
            Experience
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{items.length} positions • Real-time synchronization active</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary text-sm">
          <Plus size={15} />
          Add Position
        </button>
      </div>

      {editing && (
        <div className="panel p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {editing.id ? "Edit Position" : "New Position"}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setEditing(null)} className="btn-ghost text-sm py-1.5 px-3">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-sm py-1.5 px-3 inline-flex items-center gap-1.5"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                <span>{saving ? "Saving..." : "Save Position (Real-time)"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Company</label>
              <input
                value={editing.company}
                onChange={(e) => updateField("company", e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none"
                placeholder="Company name..."
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Role / Title</label>
              <input
                value={editing.role}
                onChange={(e) => updateField("role", e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none"
                placeholder="Full Stack Engineer..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Duration Label</label>
              <input
                value={editing.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none"
                placeholder="June 2024 — Present"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Employment Type</label>
              <select
                value={editing.type}
                onChange={(e) => updateField("type", e.target.value as ExperienceItem["type"])}
                className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none"
              >
                <option value="full-time">Full-Time</option>
                <option value="trainee">Trainee</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Current Role?</label>
              <button
                type="button"
                onClick={() => updateField("current", !editing.current)}
                className={`w-full py-2 px-3 border text-xs font-mono transition-colors ${
                  editing.current
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] text-[var(--muted-2)]"
                }`}
              >
                {editing.current ? "✓ Current Position" : "Past Position"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Description</label>
            <textarea
              value={editing.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none resize-none"
              placeholder="Responsibilities and achievements..."
            />
          </div>
        </div>
      )}

      {showJson && <JsonPreview data={items} filename="experience.json" label="Updated experience.json" />}

      <div className="panel overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>Timeline</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--surface)] transition-colors gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm text-white font-medium">{item.role}</span>
                  {item.current && <span className="badge text-xs border-[var(--accent)]/40 text-[var(--accent)]">Current</span>}
                </div>
                <span className="text-xs text-[var(--muted)]">{item.company} · {item.duration}</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditing({ ...item })} className="p-1.5 text-[var(--muted)] hover:text-white transition-colors" title="Edit">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[var(--muted)] hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => setShowJson(!showJson)} className="btn-ghost text-sm">
          {showJson ? "Hide JSON" : "↓ Export as JSON"}
        </button>
      </div>
    </div>
  );
}
