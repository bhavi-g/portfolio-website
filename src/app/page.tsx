import Nav from "@/components/Nav";
import Hero from "@/components/hero/Hero";
import About from "@/components/About";
import Projects from "@/components/projects/Projects";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Extracurriculars from "@/components/Extracurriculars";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { projects } from "@/content/content";
import { findProjectImage } from "@/lib/publicAsset";

export default function Home() {
  // Resolved server-side (filesystem check) and passed down — each project's
  // preview auto-swaps in the moment its file lands in public/projects/.
  const projectImages = Object.fromEntries(
    projects.map((p) => [p.title, findProjectImage(p.title)])
  );

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Projects projectImages={projectImages} />
        <Experience />
        <Education />
        <Skills />
        <Extracurriculars />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
