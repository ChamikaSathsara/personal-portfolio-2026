"use client";

export async function saveCmsData(
  type: "projects" | "blogs" | "site" | "experience" | "skills",
  data: unknown,
  imagePayload?: { path: string; dataUrl: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, data, imagePayload }),
    });

    const result = await res.json();
    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    return { success: false, error: msg };
  }
}

export async function fetchCmsData<T>(
  type: "projects" | "blogs" | "site" | "experience" | "skills"
): Promise<T | null> {
  try {
    const res = await fetch(`/api/admin/data?type=${type}`, { cache: "no-store" });
    const json = await res.json();
    if (json.success) {
      return json.data as T;
    }
    return null;
  } catch {
    return null;
  }
}
