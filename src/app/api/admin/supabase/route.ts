import { NextRequest, NextResponse } from "next/server";
import {
  testSupabaseConnection,
  syncAllLocalToSupabase,
  SUPABASE_SQL_SCHEMA,
} from "@/lib/supabase-cms";

export async function GET() {
  try {
    const health = await testSupabaseConnection();
    return NextResponse.json({
      success: true,
      ...health,
      sqlSchema: SUPABASE_SQL_SCHEMA,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error checking Supabase";
    return NextResponse.json(
      {
        success: false,
        connected: false,
        statusText: msg,
        sqlSchema: SUPABASE_SQL_SCHEMA,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || "test";

    if (action === "test") {
      const health = await testSupabaseConnection();
      return NextResponse.json({ success: true, ...health });
    }

    if (action === "sync-all") {
      const result = await syncAllLocalToSupabase();
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json(
      { success: false, error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
