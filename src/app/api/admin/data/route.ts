import { NextRequest, NextResponse } from "next/server";
import {
  fetchProjectsFromSupabase,
  fetchBlogsFromSupabase,
  fetchSiteConfigFromSupabase,
  fetchExperienceFromSupabase,
  fetchSkillsFromSupabase,
} from "@/lib/supabase-cms";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json(
      { success: false, error: "Missing type parameter" },
      { status: 400 }
    );
  }

  try {
    let data = null;
    switch (type) {
      case "projects":
        data = await fetchProjectsFromSupabase();
        break;
      case "blogs":
        data = await fetchBlogsFromSupabase();
        break;
      case "site":
        data = await fetchSiteConfigFromSupabase();
        break;
      case "experience":
        data = await fetchExperienceFromSupabase();
        break;
      case "skills":
        data = await fetchSkillsFromSupabase();
        break;
      default:
        return NextResponse.json(
          { success: false, error: `Invalid type parameter: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error reading data";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
