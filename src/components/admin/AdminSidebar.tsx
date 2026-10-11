"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Briefcase,
  Wrench,
  Settings,
  ChevronRight,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Blog Posts", href: "/admin/blogs", icon: FileText },
  { label: "Experience", href: "/admin/experience", icon: Briefcase },
  { label: "Skills", href: "/admin/skills", icon: Wrench },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-[var(--border)] bg-[var(--surface)] min-h-screen flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-[var(--border)]">
        <div
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          CP<span className="text-[var(--primary)]">.</span>
          <span className="text-xs font-mono text-[var(--muted-2)] ml-2 normal-case tracking-normal" style={{ fontFamily: "var(--font-mono)" }}>
            admin
          </span>
        </div>
        <p className="text-xs text-emerald-400/80 mt-0.5 font-mono" style={{ fontFamily: "var(--font-mono)" }}>
          CMS • Supabase Cloud
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-px">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors group",
                    isActive
                      ? "bg-[var(--primary)]/10 text-white border-l-2 border-[var(--primary)] pl-[calc(0.75rem-2px)]"
                      : "text-[var(--muted)] hover:text-white hover:bg-[var(--card)] border-l-2 border-transparent pl-[calc(0.75rem-2px)]"
                  )}
                >
                  <Icon size={15} className="flex-shrink-0" />
                  <span>{item.label}</span>
                  {isActive && (
                    <ChevronRight size={12} className="ml-auto text-[var(--primary)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[var(--border)] space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--muted-2)] hover:text-white transition-colors font-mono"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <Home size={13} />
          View Public Site ↗
        </Link>
        <button
          onClick={() => {
            sessionStorage.removeItem("portfolio_cms_auth");
            window.location.href = "/admin";
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-mono text-left"
        >
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
