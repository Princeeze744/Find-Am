"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/request", label: "Request a pro" },
  { href: "/join", label: "For pros" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fa-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="text-lg font-semibold tracking-tight">FindAm</span>
          </Link>
        </motion.div>

        <motion.nav initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={"relative rounded-xl px-4 py-2 text-sm font-medium transition-colors " + (active ? "text-[#0A4A3A]" : "text-[#5A6B63] hover:text-[#0A4A3A]")}>
                {l.label}
                {active && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-xl bg-[#E4F5EE]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
              </Link>
            );
          })}
          <span className="ml-3 flex items-center gap-2 text-sm text-[#5A6B63]">
            <span className="fa-live-dot" /> Port Harcourt
          </span>
        </motion.nav>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-[rgba(14,23,19,0.08)] bg-white md:hidden"
        >
          <motion.span animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block h-[2px] w-5 rounded bg-[#14201B]" />
          <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="block h-[2px] w-5 rounded bg-[#14201B]" />
          <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block h-[2px] w-5 rounded bg-[#14201B]" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] md:hidden"
            style={{ background: "linear-gradient(180deg, #0A4A3A 0%, #06281F 100%)" }}
          >
            <nav className="flex h-full flex-col justify-center gap-2 px-8">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.12 + i * 0.09, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    className={"fa-serif block py-4 text-4xl " + (pathname === l.href ? "text-[#E4F5EE]" : "text-[rgba(228,245,238,0.6)]")}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-8 flex items-center gap-2 text-sm text-[rgba(228,245,238,0.7)]"
              >
                <span className="fa-live-dot" /> Port Harcourt &middot; free for you, always
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}