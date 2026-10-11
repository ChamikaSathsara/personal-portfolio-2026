import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin CMS — Chamika Pathirage Portfolio",
  description: "Protected content management system for the portfolio website.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-[#06080F] text-slate-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="h-14 border-b border-white/10 bg-slate-900/60 backdrop-blur-md flex items-center px-6 gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Portfolio CMS Editor
              </span>
              <span className="badge text-xs bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                Authenticated
              </span>
            </div>
            <div className="ml-auto text-xs text-slate-400 font-mono hidden sm:block">
              Password protected (.env configured)
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
