"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star, StarOff, GitBranch, ExternalLink, CheckCircle2, Loader2, Database } from "lucide-react";
import type { Project } from "@/types";
import { getAllProjects } from "@/lib/data";
import { generateSlug } from "@/lib/utils";
import ImageUploader from "@/components/admin/ImageUploader";
import JsonPreview from "@/components/admin/JsonPreview";
import { saveCmsData, fetchCmsData } from "@/lib/admin-api";

const CATEGORIES = ["Web", "Mobile", "UI/UX", "Full Stack"] as const;

const emptyProject: Project = {
  id: "",
  title: "",
  description: "",
  image: "",
  technologies: [],
  category: "Web",
  github: "",
  liveUrl: "",
  featured: false,
};

export default function AdminProjectsPage() {
  const initial = getAllProjects();
  const [projects, setProjects] = useState<Project[]>(initial);
  const [editing, setEditing] = useState<Project | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [techInput, setTechInput] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchCmsData<Project[]>("projects").then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setProjects(data);
      }
    });
  }, []);

  const openNew = () => {
    setEditing({ ...emptyProject });
    setImageDataUrl("");
    setTechInput("");
  };

  const openEdit = (p: Project) => {
    setEditing({ ...p });
    setImageDataUrl("");
    setTechInput(p.technologies.join(", "));
  };

  const showNotification = (msg: string) => {
    setSavedStatus(msg);
    setTimeout(() => setSavedStatus(null), 3500);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    const id = editing.id || generateSlug(editing.title);
    const image = imageDataUrl ? `/images/projects/${id}.webp` : editing.image;
    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updated: Project = { ...editing, id, image, technologies };

    const updatedList = projects.some((p) => p.id === id)
      ? projects.map((p) => (p.id === id ? updated : p))
      : [...projects, updated];

    setProjects(updatedList);
    setEditing(null);
    setImageDataUrl("");

    // Persist in real time to data/projects.json
    const res = await saveCmsData(
      "projects",
      updatedList,
      imageDataUrl ? { path: image, dataUrl: imageDataUrl } : undefined
    );

    setSaving(false);
    if (res.success) {
      showNotification("Project saved to Supabase DB & disk in real time!");
    } else {
      showNotification("Saved in session, but could not sync.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updatedList = projects.filter((p) => p.id !== id);
    setProjects(updatedList);
    await saveCmsData("projects", updatedList);
    showNotification("Project deleted from Supabase DB & disk in real time!");
  };

  const handleToggleFeatured = async (id: string) => {
    const updatedList = projects.map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    setProjects(updatedList);
    await saveCmsData("projects", updatedList);
    showNotification("Featured status updated in Supabase DB in real time!");
  };

  const updateField = <K extends keyof Project>(key: K, value: Project[K]) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div className="max-w-5xl space-y-6">
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
            Projects
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{projects.length} projects • Real-time synchronization active</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">
          <Plus size={15} />
          New Project
        </button>
      </div>

      {/* Editor */}
      {editing && (
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {editing.id ? "Edit Project" : "New Project"}
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
                <span>{saving ? "Saving..." : "Save Project (Real-time)"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
            {/* Left */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                  Title
                </label>
                <input
                  value={editing.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none"
                  placeholder="Project name..."
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                  Description
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none resize-none"
                  placeholder="What does this project do?"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                  Technologies (comma separated)
                </label>
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none"
                  placeholder="Next.js, TypeScript, Tailwind"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                    Category
                  </label>
                  <select
                    value={editing.category}
                    onChange={(e) => updateField("category", e.target.value as Project["category"])}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                    Featured
                  </label>
                  <button
                    onClick={() => updateField("featured", !editing.featured)}
                    className={`w-full py-2 px-3 border text-xs font-mono transition-colors ${
                      editing.featured
                        ? "border-[var(--primary)] text-[var(--primary-light)] bg-[var(--primary)]/10"
                        : "border-[var(--border)] text-[var(--muted-2)]"
                    }`}
                  >
                    {editing.featured ? "★ Featured" : "☆ Standard"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                    GitHub URL
                  </label>
                  <input
                    value={editing.github || ""}
                    onChange={(e) => updateField("github", e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                    Live URL / Demo
                  </label>
                  <input
                    value={editing.liveUrl || ""}
                    onChange={(e) => updateField("liveUrl", e.target.value)}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Right: Image Uploader & Preview */}
            <div className="p-6">
              <ImageUploader
                value={imageDataUrl}
                onChange={(url) => setImageDataUrl(url)}
                onRemove={() => { setImageDataUrl(""); updateField("image", ""); }}
                slug={editing.id || generateSlug(editing.title) || "project"}
                type="projects"
                label="Project Cover Image"
              />

              {/* Preview card */}
              <div className="mt-6 panel overflow-hidden">
                <div className="h-28 bg-[var(--surface)] flex items-center justify-center text-[var(--muted-2)] text-xs font-mono border-b border-[var(--border)]" style={{ fontFamily: "var(--font-mono)" }}>
                  {imageDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageDataUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : "Cover Preview"}
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-white truncate">{editing.title || "Project Title"}</p>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{editing.description || "Description..."}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {techInput.split(",").filter(Boolean).slice(0, 3).map((t) => (
                      <span key={t} className="badge text-xs">{t.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON export fallback */}
      {showJson && (
        <JsonPreview data={projects} filename="projects.json" label="Updated projects.json" />
      )}

      {/* List */}
      <div className="panel overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            All Projects
          </h2>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Direct Disk Sync
          </span>
        </div>
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[var(--muted)] mb-4">No projects yet. Add your first project.</p>
            <button onClick={openNew} className="btn-primary text-sm">
              <Plus size={14} /> New Project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--surface)] transition-colors gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm text-white font-medium truncate">{p.title}</span>
                    {p.featured && <span className="badge text-xs border-[var(--primary)]/40 text-[var(--primary-light)] flex-shrink-0">Featured</span>}
                  </div>
                  <span className="text-xs font-mono text-[var(--muted-2)]" style={{ fontFamily: "var(--font-mono)" }}>
                    {p.category} · {p.technologies.slice(0, 3).join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[var(--muted)] hover:text-white transition-colors" title="View Source">
                      <GitBranch size={13} />
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[var(--muted)] hover:text-white transition-colors" title="View Live">
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button
                    onClick={() => handleToggleFeatured(p.id)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    title="Toggle Featured"
                  >
                    {p.featured ? <Star size={13} className="text-[var(--accent)]" /> : <StarOff size={13} />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-1.5 text-[var(--muted)] hover:text-white transition-colors" title="Edit">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-[var(--muted)] hover:text-red-400 transition-colors" title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <button onClick={() => setShowJson(!showJson)} className="btn-ghost text-sm">
          {showJson ? "Hide JSON Preview" : "↓ Export All as JSON"}
        </button>
      </div>
    </div>
  );
}
