"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Determine active section
      const sections = navLinks.map((l) => l.href.replace("#", ""));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 sm:px-8",
          isScrolled ? "pt-3" : "pt-5"
        )}
      >
        <div className="max-w-6xl mx-auto">
          <nav
            className={cn(
              "flex items-center justify-between px-6 py-2.5 rounded-full transition-all duration-300",
              isScrolled
                ? "bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                : "bg-slate-900/40 backdrop-blur-md border border-white/[0.08]"
            )}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="Chamika Pathirage Portfolio"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
                CP
              </div>
              <span className="font-bold text-base tracking-tight text-white group-hover:text-violet-300 transition-colors">
                Chamika<span className="text-violet-400">.</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <ul className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = activeSection === id;

                return (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all relative",
                        isActive
                          ? "text-white bg-white/10 font-semibold"
                          : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                      )}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Action Button & Mobile Menu Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleNavClick("#contact")}
                className="hidden sm:inline-flex btn-primary text-xs py-2 px-4 shadow-none"
              >
                <span>Let&apos;s Connect</span>
                <ArrowUpRight size={13} />
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-full glass-card border border-white/10 text-slate-300 hover:text-white transition-colors"
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden animate-fade-in">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="absolute top-20 left-4 right-4 p-6 rounded-3xl glass-panel border border-white/10 shadow-2xl flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="flex items-center justify-between p-3 rounded-2xl text-left text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <span>{link.label}</span>
                <span className="text-violet-400 font-mono text-xs">→</span>
              </button>
            ))}

            <div className="pt-4 border-t border-white/10 mt-2">
              <button
                onClick={() => handleNavClick("#contact")}
                className="btn-primary w-full text-sm py-3 justify-center"
              >
                <span>Let&apos;s Connect</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
