"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home", desc: "Start here" },
  { href: "/search", label: "Find a pro", desc: "Search anything" },
  { href: "/request", label: "Request a pro", desc: "We find them for you" },
  { href: "/join", label: "For pros", desc: "Join and get customers" },
];

const proLink = {
  in: { href: "/dashboard", label: "My dashboard", desc: "Your stats and profile" },
  out: { href: "/pro-login", label: "Pro sign in", desc: "Access your dashboard" },
};

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    fetch("/api/pro-session").then((r) => r.json()).then((d) => setSignedIn(Boolean(d.signedIn))).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const desktopLinks = [...links.filter((l) => l.href !== "/search"), signedIn ? proLink.in : proLink.out];
  const menuLinks = [...links, signedIn ? proLink.in : proLink.out];

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
          {desktopLinks.map((l) => {
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col md:hidden"
            style={{ backgroundColor: "#06281F" }}
          >
            <div className="flex items-center justify-between border-b border-[rgba(228,245,238,0.1)] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Logo size={30} />
                <span className="text-base font-semibold text-[#F5F1EA]">FindAm</span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pt-2">
              {menuLinks.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <motion.div
                    key={l.href}
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={l.href}
                      className="flex items-center justify-between border-b border-[rgba(228,245,238,0.08)] py-4"
                    >
                      <span>
                        <span className={"block text-[17px] font-semibold " + (active ? "text-[#E4F5EE]" : "text-[#D8EDE3]")}>
                          {l.label}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-[rgba(228,245,238,0.55)]">{l.desc}</span>
                      </span>
                      <span className={"text-[rgba(228,245,238,0.4)] " + (active ? "text-[#B78A2E]" : "")}>
                        {active ? "\u25CF" : "\u2192"}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.45 }} className="mt-6">
                <Link href="/request" className="fa-btn flex w-full !bg-none !bg-[#FAF7F2] !text-[#0A4A3A]">
                  Find me someone I can trust
                </Link>
              </motion.div>
            </nav>

            <div className="border-t border-[rgba(228,245,238,0.1)] px-5 py-4">
              <p className="flex items-center gap-2 text-[13px] text-[rgba(228,245,238,0.7)]">
                <span className="fa-live-dot" /> Port Harcourt &middot; free for you, always
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}