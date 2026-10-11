import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const FILE_MAP: Record<string, string> = {
  projects: "projects.json",
  blogs: "blogs.json",
  site: "site.json",
  experience: "experience.json",
  skills: "skills.json",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data, imagePayload } = body;

    const fileName = FILE_MAP[type];
    if (!fileName) {
      return NextResponse.json(
        { success: false, error: `Invalid content type: ${type}` },
        { status: 400 }
      );
    }

    const dataFilePath = path.join(process.cwd(), "data", fileName);

    // Write formatted JSON to file
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(data, null, 2),
      "utf8"
    );

    // Save uploaded image if provided (base64 data URL)
    if (imagePayload && imagePayload.path && imagePayload.dataUrl) {
      try {
        const matches = imagePayload.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches[2]) {
          const buffer = Buffer.from(matches[2], "base64");
          const targetImagePath = path.join(process.cwd(), "public", imagePayload.path.replace(/^\//, ""));
          await fs.mkdir(path.dirname(targetImagePath), { recursive: true });
          await fs.writeFile(targetImagePath, buffer);
        }
      } catch (imgErr) {
        console.error("Failed to save image payload:", imgErr);
      }
    }

    // Invalidate Next.js cache so the public site updates instantly
    try {
      revalidatePath("/");
      revalidatePath("/blog");
      revalidatePath("/admin");
      revalidatePath(`/admin/${type}`);
    } catch {
      // Revalidation fallback
    }

    // Also sync to Supabase if configured
    let supabaseStatus = { synced: false, message: "" };
    try {
      const { syncCollectionToSupabase } = await import("@/lib/supabase-cms");
      const res = await syncCollectionToSupabase(type as "projects" | "blogs" | "site" | "experience" | "skills", data);
      supabaseStatus = { synced: res.success, message: res.message || "" };
    } catch (sbErr) {
      supabaseStatus = {
        synced: false,
        message: sbErr instanceof Error ? sbErr.message : "Supabase sync skipped",
      };
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${fileName} in real-time!`,
      supabase: supabaseStatus,
      timestamp: Date.now(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error saving CMS data:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
