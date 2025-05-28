import Hero from "@/components/main/Hero";
import Skills from "@/components/main/Skills";
import Projects from "@/components/main/Projects";
import Contact from "@/components/main/Contact";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </div>
  );
}
