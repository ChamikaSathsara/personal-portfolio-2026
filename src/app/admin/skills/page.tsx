"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, CheckCircle2, Loader2, Database } from "lucide-react";
import type { SkillCategory } from "@/types";
import { getAllSkills } from "@/lib/data";
import JsonPreview from "@/components/admin/JsonPreview";
import { saveCmsData, fetchCmsData } from "@/lib/admin-api";

const ICONS = ["Monitor", "Cloud", "Palette", "Briefcase", "Code", "Database", "Globe", "Cpu"];

const emptyCategory: SkillCategory = {
  id: "",
  category: "",
  icon: "Monitor",
  skills: [],
};

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>(getAllSkills());
  const [editing, setEditing] = useState<SkillCategory | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchCmsData<SkillCategory[]>("skills").then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setCategories(data);
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

    const id = editing.id || editing.category.toLowerCase().replace(/\s+/g, "-");
    const updated = { ...editing, id };

    const updatedList = categories.some((x) => x.id === id)
      ? categories.map((x) => (x.id === id ? updated : x))
      : [...categories, updated];

    setCategories(updatedList);
    setEditing(null);
    setSkillInput("");

    const res = await saveCmsData("skills", updatedList);
    setSaving(false);

    if (res.success) {
      showNotification("Skills saved to Supabase DB & disk in real time!");
    } else {
      showNotification("Saved in session, could not sync.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const updatedList = categories.filter((x) => x.id !== id);
    setCategories(updatedList);
    await saveCmsData("skills", updatedList);
    showNotification("Category deleted from Supabase DB & disk in real time!");
  };

  const addSkill = () => {
    if (!skillInput.trim() || !editing) return;
    const skills = skillInput.split(",").map((s) => s.trim()).filter(Boolean);
    setEditing((prev) => prev ? { ...prev, skills: [...prev.skills, ...skills] } : prev);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setEditing((prev) => prev ? { ...prev, skills: prev.skills.filter((s) => s !== skill) } : prev);
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
            Skills
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{categories.length} categories • Real-time synchronization active</p>
        </div>
        <button onClick={() => { setEditing({ ...emptyCategory }); setSkillInput(""); }} className="btn-primary text-sm">
          <Plus size={15} />
          Add Category
        </button>
      </div>

      {editing && (
        <div className="panel p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {editing.id ? "Edit Category" : "New Category"}
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
                <span>{saving ? "Saving..." : "Save Category (Real-time)"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Category Name</label>
              <input
                value={editing.category}
                onChange={(e) => setEditing((p) => p ? { ...p, category: e.target.value } : p)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none"
                placeholder="e.g. Frontend & Mobile"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Icon</label>
              <select
                value={editing.icon}
                onChange={(e) => setEditing((p) => p ? { ...p, icon: e.target.value } : p)}
                className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none"
              >
                {ICONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                className="flex-1 bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none"
                placeholder="Type skill and press Enter (or comma separated)..."
              />
              <button type="button" onClick={addSkill} className="btn-ghost text-xs px-3">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-8 p-2 border border-[var(--border)] bg-[var(--bg)]">
              {editing.skills.length === 0 ? (
                <span className="text-xs text-[var(--muted-2)] font-mono">No skills added yet</span>
              ) : (
                editing.skills.map((skill) => (
                  <span key={skill} className="badge text-xs flex items-center gap-1 group">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="text-[var(--muted-2)] hover:text-red-400">
                      <X size={10} />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showJson && <JsonPreview data={categories} filename="skills.json" label="Updated skills.json" />}

      <div className="panel overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>Skill Categories</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {categories.map((cat) => (
            <div key={cat.id} className="p-6 hover:bg-[var(--surface)] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-bold">{cat.category}</span>
                  <span className="badge text-xs">{cat.icon}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing({ ...cat }); setSkillInput(""); }} className="p-1.5 text-[var(--muted)] hover:text-white transition-colors" title="Edit">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-[var(--muted)] hover:text-red-400 transition-colors" title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((s) => (
                  <span key={s} className="badge text-xs">{s}</span>
                ))}
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
