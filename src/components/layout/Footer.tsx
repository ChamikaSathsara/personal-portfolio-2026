"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, ArrowUp, Sparkles, Heart } from "lucide-react";
import { GithubIcon, LinkedinIcon, MediumIcon, BehanceIcon } from "@/components/ui/SocialIcons";
import type { SiteConfig } from "@/types";

interface FooterProps {
  site: SiteConfig;
}

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ site }: FooterProps) {
  const currentYear = 2026;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/[0.08] relative z-10 bg-[#06080F]/90 backdrop-blur-xl">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Mission (Col span 2) */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-black text-xs">
                CP
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Chamika Pathirage<span className="text-violet-400">.</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Full Stack Software & UI/UX Engineer specialized in building high-performance web applications, mobile front-ends, and serverless ecosystems.
            </p>

            {/* Active Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open for Full-Time Roles & Consulting</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {site.socials.github && (
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl glass-card border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all hover:scale-110"
                  aria-label="GitHub"
                >
                  <GithubIcon size={16} />
                </a>
              )}
              {site.socials.linkedin && (
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl glass-card border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={16} />
                </a>
              )}
              {site.socials.medium && (
                <a
                  href={site.socials.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl glass-card border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all hover:scale-110"
                  aria-label="Medium"
                >
                  <MediumIcon size={16} />
                </a>
              )}
              {site.socials.behance && (
                <a
                  href={site.socials.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl glass-card border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/40 transition-all hover:scale-110"
                  aria-label="Behance"
                >
                  <BehanceIcon size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="text-xs font-mono text-violet-400 hover:text-violet-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>CMS Portal</span>
                  <span>↗</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
              Direct Contact
            </h3>
            <ul className="space-y-3 text-xs font-mono text-slate-400">
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-violet-400 flex-shrink-0" />
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-cyan-400 flex-shrink-0" />
                <a
                  href={`tel:${site.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={13} className="text-emerald-400 flex-shrink-0" />
                <span>{site.location}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {currentYear} {site.name}. Crafted with Next.js & React Bits.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card border border-white/10 hover:border-violet-500/40 text-slate-400 hover:text-white transition-all text-xs"
          >
            <span>Back to top</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
