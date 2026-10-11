"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Star, StarOff, ExternalLink, CheckCircle2, Loader2, Database } from "lucide-react";
import type { BlogPost } from "@/types";
import { getAllBlogPosts } from "@/lib/data";
import { formatDate, generateSlug } from "@/lib/utils";
import ImageUploader from "@/components/admin/ImageUploader";
import JsonPreview from "@/components/admin/JsonPreview";
import { saveCmsData, fetchCmsData } from "@/lib/admin-api";

const emptyPost: BlogPost = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: [],
  publishedAt: new Date().toISOString().split("T")[0],
  featured: false,
};

export default function AdminBlogsPage() {
  const initialPosts = getAllBlogPosts();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [tagsInput, setTagsInput] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [showJson, setShowJson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchCmsData<BlogPost[]>("blogs").then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setPosts(data);
      }
    });
  }, []);

  const openNew = () => {
    setEditing({ ...emptyPost });
    setImageDataUrl("");
    setTagsInput("");
    setActiveTab("editor");
  };

  const openEdit = (post: BlogPost) => {
    setEditing({ ...post });
    setImageDataUrl("");
    setTagsInput(post.tags.join(", "));
    setActiveTab("editor");
  };

  const showNotification = (msg: string) => {
    setSavedStatus(msg);
    setTimeout(() => setSavedStatus(null), 3500);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    const slug = editing.slug || generateSlug(editing.title);
    const id = editing.id || slug;
    const coverImage = imageDataUrl
      ? `/images/blog/${slug}.webp`
      : editing.coverImage;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updated: BlogPost = { ...editing, id, slug, coverImage, tags };

    const updatedList = posts.some((p) => p.id === id)
      ? posts.map((p) => (p.id === id ? updated : p))
      : [...posts, updated];

    setPosts(updatedList);
    setEditing(null);
    setImageDataUrl("");

    const res = await saveCmsData(
      "blogs",
      updatedList,
      imageDataUrl ? { path: coverImage, dataUrl: imageDataUrl } : undefined
    );
    setSaving(false);

    if (res.success) {
      showNotification("Article saved to Supabase DB & disk in real time!");
    } else {
      showNotification("Saved in session, could not sync.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const updatedList = posts.filter((p) => p.id !== id);
    setPosts(updatedList);
    await saveCmsData("blogs", updatedList);
    showNotification("Article deleted from Supabase DB & disk in real time!");
  };

  const handleToggleFeatured = async (id: string) => {
    const updatedList = posts.map((p) =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    setPosts(updatedList);
    await saveCmsData("blogs", updatedList);
    showNotification("Article featured status updated in real time!");
  };

  const updateField = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) => {
    setEditing((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [key]: value };
      if (key === "title" && !prev.slug) {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  };

  return (
    <div className="max-w-6xl space-y-6">
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-black tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Blog Posts
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">{posts.length} articles</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">
          <Plus size={15} />
          New Post
        </button>
      </div>

      {/* Editor */}
      {editing && (
        <div className="panel overflow-hidden">
          {/* Editor header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest border transition-all ${
                  activeTab === "editor"
                    ? "border-[var(--primary)] text-white bg-[var(--primary)]/10"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest border transition-all ${
                  activeTab === "preview"
                    ? "border-[var(--primary)] text-white bg-[var(--primary)]/10"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Preview
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(null)}
                className="btn-ghost text-sm py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary text-sm py-1.5 px-3 inline-flex items-center gap-1.5"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                <span>{saving ? "Saving..." : "Save Post (Real-time)"}</span>
              </button>
            </div>
          </div>

          {activeTab === "editor" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border)]">
              {/* Form */}
              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Post title..."
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none transition-colors font-sans"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editing.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    placeholder="post-slug"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-[var(--muted)] text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none transition-colors font-mono"
                    style={{ fontFamily: "var(--font-mono)" }}
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                    Excerpt
                  </label>
                  <textarea
                    value={editing.excerpt}
                    onChange={(e) => updateField("excerpt", e.target.value)}
                    placeholder="Short description..."
                    rows={2}
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none transition-colors resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Next.js, TypeScript, React"
                    className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none transition-colors"
                  />
                </div>

                {/* Date + Featured */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                      Published Date
                    </label>
                    <input
                      type="date"
                      value={editing.publishedAt}
                      onChange={(e) => updateField("publishedAt", e.target.value)}
                      className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm focus:border-[var(--primary)] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                      Featured
                    </label>
                    <button
                      onClick={() => updateField("featured", !editing.featured)}
                      className={`w-full border py-2 text-sm transition-all ${
                        editing.featured
                          ? "border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/5"
                          : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      {editing.featured ? "✓ Featured" : "Not Featured"}
                    </button>
                  </div>
                </div>

                {/* Image */}
                <ImageUploader
                  value={imageDataUrl}
                  onChange={(url) => setImageDataUrl(url)}
                  onRemove={() => {
                    setImageDataUrl("");
                    updateField("coverImage", "");
                  }}
                  slug={editing.slug || "post"}
                  type="blog"
                  label="Cover Image"
                />
              </div>

              {/* Content editor */}
              <div className="p-6 flex flex-col">
                <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)] block mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                  Content (Markdown)
                </label>
                <textarea
                  value={editing.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="# Post Title&#10;&#10;Write your content in markdown..."
                  className="flex-1 min-h-80 w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-white text-sm placeholder:text-[var(--muted-2)] focus:border-[var(--primary)] outline-none transition-colors resize-none font-mono leading-relaxed"
                  style={{ fontFamily: "var(--font-mono)" }}
                />
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="p-8 max-w-2xl mx-auto">
              {(imageDataUrl || editing.coverImage) && (
                <div className="relative h-48 mb-6 bg-[var(--surface)] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageDataUrl || editing.coverImage}
                    alt={editing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {tagsInput.split(",").filter(Boolean).map((t) => (
                  <span key={t} className="badge text-xs">
                    {t.trim()}
                  </span>
                ))}
              </div>
              <h1
                className="text-3xl font-black tracking-tighter text-white mb-4 leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {editing.title || "Untitled Post"}
              </h1>
              <p className="text-[var(--muted)] mb-6">{editing.excerpt}</p>
              <div className="text-xs font-mono text-[var(--muted-2)] mb-8" style={{ fontFamily: "var(--font-mono)" }}>
                {editing.publishedAt}
                {editing.featured && (
                  <span className="ml-3 text-[var(--accent)]">★ Featured</span>
                )}
              </div>
              <div className="prose-sm text-[var(--muted)] whitespace-pre-wrap text-sm leading-relaxed">
                {editing.content || "Start writing content in the editor tab..."}
              </div>
            </div>
          )}
        </div>
      )}

      {/* JSON export */}
      {showJson && (
        <JsonPreview
          data={posts}
          filename="blogs.json"
          label="Updated blogs.json"
        />
      )}

      {/* Posts list */}
      <div className="panel overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2
            className="text-sm font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            All Posts
          </h2>
        </div>
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[var(--muted)] mb-4">
              No blog posts yet. Create your first article.
            </p>
            <button onClick={openNew} className="btn-primary text-sm">
              <Plus size={14} />
              New Post
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-[var(--surface)] transition-colors gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm text-white font-medium truncate">
                      {post.title}
                    </span>
                    {post.featured && (
                      <span className="badge text-xs border-[var(--primary)]/40 text-[var(--primary-light)] flex-shrink-0">
                        Featured
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[var(--muted-2)]" style={{ fontFamily: "var(--font-mono)" }}>
                    {post.slug} · {formatDate(post.publishedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[var(--muted)] hover:text-white transition-colors"
                    aria-label="View post"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => handleToggleFeatured(post.id)}
                    className="p-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                    aria-label={post.featured ? "Unfeature" : "Feature"}
                  >
                    {post.featured ? <Star size={13} className="text-[var(--accent)]" /> : <StarOff size={13} />}
                  </button>
                  <button
                    onClick={() => openEdit(post)}
                    className="p-1.5 text-[var(--muted)] hover:text-white transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 text-[var(--muted)] hover:text-red-400 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export all */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowJson(true)}
          className="btn-ghost text-sm"
        >
          ↓ Export All as JSON
        </button>
      </div>
    </div>
  );
}
