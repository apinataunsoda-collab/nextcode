import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "ตัวอย่างเว็บ Portfolio | NxtCode Solution",
  robots: { index: false },
};

const WORKS = [
  { title: "Brand Identity - Coffee Shop", cat: "Branding", img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=60" },
  { title: "E-Commerce UI Design", cat: "UI/UX", img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=600&q=60" },
  { title: "Mobile App - Fitness", cat: "App Design", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=60" },
  { title: "Corporate Website Redesign", cat: "Web Design", img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=600&q=60" },
  { title: "Social Media Campaign", cat: "Marketing", img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=60" },
  { title: "Product Photography", cat: "Photography", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=60" },
];

const SKILLS = ["UI/UX Design", "Branding", "Web Development", "Photography", "Motion Graphics", "Marketing"];

export default function DemoPortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="text-xl font-bold">Alex.design</div>
          <nav className="hidden gap-6 text-sm font-medium text-white/70 md:flex">
            <span className="cursor-pointer hover:text-white">About</span>
            <span className="cursor-pointer hover:text-white">Works</span>
            <span className="cursor-pointer hover:text-white">Skills</span>
            <span className="cursor-pointer hover:text-white">Contact</span>
          </nav>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">Hire Me</button>
        </div>
      </header>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=60" alt="Profile" width={96} height={96} className="object-cover" />
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Hi, I&apos;m <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Alex</span>
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Creative Designer & Developer based in Bangkok.
            I craft beautiful digital experiences that drive results.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900">View Works</button>
            <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white">Download CV</button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold">Selected Works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WORKS.map((w) => (
              <div key={w.title} className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 transition hover:border-purple-500/50">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={w.img} alt={w.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/40" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-purple-400">{w.cat}</span>
                  <h3 className="mt-1 font-semibold">{w.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold">Skills & Tools</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {SKILLS.map((s) => (
              <span key={s} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm">{s}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h2 className="text-2xl font-bold">Let&apos;s Work Together</h2>
          <p className="mt-2 text-white/70">Got a project in mind? Let&apos;s talk.</p>
          <div className="mt-6 space-y-3">
            <input placeholder="Your Name" className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none" />
            <input placeholder="Email" className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none" />
            <textarea placeholder="Tell me about your project..." rows={4} className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none" />
            <button className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-semibold text-white">Send Message</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/50">
        © 2026 Alex.design | Powered by NxtCode Solution
      </footer>
    </div>
  );
}
