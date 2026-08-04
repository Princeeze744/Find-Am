"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export type HeroSlide = { src: string; trade: string };

export default function HeroRotator({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => clearInterval(t);
  }, [slides.length]);

  const current = slides[index];

  return (
    <div className="fa-photo relative aspect-[4/5] w-full max-w-md overflow-hidden md:ml-auto">
      {slides.map((s) => (
        <link key={s.src} rel="preload" as="image" href={s.src} />
      ))}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current.src}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image src={current.src} alt={`A verified FindAm ${current.trade.toLowerCase()} in Port Harcourt`} fill priority sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute left-4 top-4 z-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={current.trade}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="fa-badge !bg-[rgba(250,247,242,0.92)] !text-[13px] !px-3 !py-1.5"
          >
            {current.trade}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
        {slides.map((s, i) => (
          <span key={s.src} className="h-1.5 rounded-full transition-all duration-500" style={{ width: i === index ? "18px" : "6px", background: i === index ? "#E4F5EE" : "rgba(228,245,238,0.45)" }} />
        ))}
      </div>
    </div>
  );
}