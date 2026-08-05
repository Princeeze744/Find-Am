"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", label: "Home", d: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3v-10.5Z" },
  { href: "/search", label: "Search", d: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9 16-3.5-3.5" },
  { href: "/request", label: "Request", d: "M12 3v18M3 12h18" },
  { href: "/join", label: "For pros", d: "M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-7 18a7 7 0 0 1 14 0" },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 md:hidden" aria-label="Quick navigation">
      <div className="fa-fluff flex w-full max-w-sm items-center justify-around !rounded-full px-2 py-2">
        {tabs.map((t) => {
          const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <Link key={t.href} href={t.href} className="relative flex flex-col items-center gap-0.5 rounded-full px-4 py-1.5">
              {active && (
                <motion.span layoutId="bottom-pill" className="absolute inset-0 rounded-full bg-[#E4F5EE]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#0A4A3A" : "#9AA8A1"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                <path d={t.d} />
              </svg>
              <span className={"relative z-10 text-[10px] font-semibold " + (active ? "text-[#0A4A3A]" : "text-[#9AA8A1]")}>{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}