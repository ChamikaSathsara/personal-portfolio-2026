import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import BackgroundManager from "@/components/ui/react-bits/BackgroundManager";
import {
  getDbSiteConfig,
  getDbProjects,
  getDbFeaturedBlogPosts,
  getDbExperience,
  getDbSkills,
} from "@/lib/supabase-db";

export default async function Home() {
  const site = await getDbSiteConfig();
  const projects = await getDbProjects();
  const blogPosts = await getDbFeaturedBlogPosts();
  const experience = await getDbExperience();
  const skills = await getDbSkills();

  return (
    <div className="relative min-h-screen text-slate-100 selection:bg-violet-600/30 selection:text-white">
      {/* React Bits Ambient Background System */}
      <BackgroundManager initialMode="aurora-particles" showToggle={true} />

      {/* Main App Structure */}
      <Navbar />
      <main className="relative z-10">
        <Hero site={site} />
        <About site={site} />
        <Skills skills={skills} />
        <Experience experience={experience} />
        <Projects projects={projects} />
        <Blog posts={blogPosts} />
        <Contact site={site} />
      </main>
      <Footer site={site} />
    </div>
  );
}
