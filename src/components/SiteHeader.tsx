"use client";

import { motion } from "framer-motion";
import Logo from "./Logo";

export default function SiteHeader() {
  return (
    <header className="fa-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-2.5">
          <Logo />
          <span className="text-lg font-semibold tracking-tight">FindAm</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-4">
          <span className="hidden items-center gap-2 text-sm text-[#5A6B63] sm:flex">
            <span className="fa-live-dot" /> Port Harcourt
          </span>
          <button className="fa-btn !px-4 !py-2 text-sm">Get early access</button>
        </motion.div>
      </div>
    </header>
  );
}