"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (dataUrl: string, filename: string) => void;
  onRemove: () => void;
  slug?: string;
  type?: "blog" | "projects" | "profile";
  label?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZE_MB = 5;

export default function ImageUploader({
  value,
  onChange,
  onRemove,
  slug = "image",
  type = "blog",
  label = "Cover Image",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFilename = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
    return `${slug}.${ext}`;
  };

  const processFile = (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Unsupported image format. Please upload JPG, PNG, WEBP, or SVG.");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const filename = generateFilename(file);
      onChange(dataUrl, filename);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [slug]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const imagePath = `/images/${type}/${slug}.webp`;

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-widest text-[var(--muted)]" style={{ fontFamily: "var(--font-mono)" }}>
        {label}
      </label>

      {value ? (
        <div className="relative">
          {/* Preview */}
          <div className="relative h-48 bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-2 gap-2">
            <div>
              <p className="text-xs font-mono text-[var(--muted-2)]" style={{ fontFamily: "var(--font-mono)" }}>
                Path:{" "}
                <code className="text-[var(--primary-light)]">{imagePath}</code>
              </p>
            </div>
            <div className="flex gap-2">
              <label
                htmlFor="image-replace"
                className="btn-ghost text-xs py-1 px-3 cursor-pointer"
              >
                Replace
                <input
                  id="image-replace"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={handleFileInput}
                />
              </label>
              <button
                onClick={onRemove}
                className="p-1 border border-[var(--border)] text-[var(--muted)] hover:text-red-400 hover:border-red-400/40 transition-all"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label
            htmlFor="image-upload"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center h-40 border cursor-pointer transition-all",
              isDragging
                ? "border-[var(--primary)] bg-[var(--primary)]/5"
                : "border-dashed border-[var(--border)] hover:border-[var(--border-strong)] bg-[var(--surface)]"
            )}
          >
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="flex flex-col items-center gap-3 text-center p-6">
              <div className="w-10 h-10 border border-[var(--border)] flex items-center justify-center text-[var(--muted)]">
                {isDragging ? <Upload size={18} /> : <ImageIcon size={18} />}
              </div>
              <div>
                <p className="text-sm text-[var(--muted)] mb-1">
                  {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs text-[var(--muted-2)] font-mono" style={{ fontFamily: "var(--font-mono)" }}>
                  JPG, PNG, WEBP, SVG · Max {MAX_SIZE_MB}MB
                </p>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-400/10 border border-red-400/20 p-2" style={{ fontFamily: "var(--font-mono)" }}>
          <AlertCircle size={12} />
          {error}
        </div>
      )}

      {/* Path info */}
      {!value && (
        <p className="text-xs text-[var(--muted-2)] font-mono" style={{ fontFamily: "var(--font-mono)" }}>
          Will save as: <code className="text-[var(--muted)]">{imagePath}</code>
        </p>
      )}
    </div>
  );
}
