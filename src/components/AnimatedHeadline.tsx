"use client";

import { motion } from "framer-motion";

export default function AnimatedHeadline({
  text,
  gradWord = "",
  className = "fa-serif mt-4 text-3xl leading-[1.12] md:text-5xl",
  startDelay = 0.1,
}: {
  text: string;
  gradWord?: string;
  className?: string;
  startDelay?: number;
}) {
  const words = text.split(" ");
  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: startDelay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className={"mr-[0.24em] inline-block " + (gradWord && word.replace(/[.,!?]/g, "") === gradWord ? "fa-grad-text" : "")}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}