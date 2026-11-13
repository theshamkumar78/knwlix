import Link from "next/link";
import Image from "next/image";

const EMAIL = "team@gmail.com"; // apni team ki email yahan likho

export default function Footer() {
  const links = [["Courses", "/courses"], ["Instructors", "/instructors"], ["About", "/about"], ["Contact", "/contact"]];
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <Image src="/logo/knowlix-wordmark.png" alt="Knowlix" width={120} height={21} />
          <p className="mt-3 text-sm">Learn. Explore. Achieve.</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">Explore</p>
          <ul className="space-y-2">
            {links.map(([l, h]) => (
              <li key={h}><Link href={h} className="transition hover:text-white">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold text-white">Contact</p>
          <a href={`mailto:${EMAIL}`} className="break-all transition hover:text-white">{EMAIL}</a>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} Knowlix. All rights reserved.</p>
    </footer>
  );
}