"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export type PickerOption = { id: string; label: string };

export default function Picker({
  options,
  value,
  onChange,
  placeholder = "Choose...",
  title = "Choose one",
  searchable = true,
}: {
  options: PickerOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  title?: string;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setQuery("");
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.id === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fa-input flex w-full items-center justify-between px-4 py-3 text-left text-[15px]"
      >
        <span className={selected ? "text-[#14201B]" : "text-[#9AA8A1]"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9AA8A1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {mounted && createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-[rgba(6,40,31,0.4)] md:items-center md:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-[1.4rem] bg-[#FDFBF7] px-4 pb-5 pt-2.5 shadow-[0_-20px_60px_rgba(6,40,31,0.25)] md:rounded-[1.2rem] md:px-5 md:pb-5 md:pt-4 md:shadow-[0_30px_80px_rgba(6,40,31,0.3)]"
              style={{ maxHeight: "70vh", display: "flex", flexDirection: "column" }}
            >
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[rgba(14,23,19,0.12)] md:hidden" />
              <p className="fa-serif text-center text-lg md:text-left">{title}</p>
              {searchable && options.length > 6 && (
                <input
                  className="fa-input mt-3 w-full px-3.5 py-2.5 text-[14px] outline-none placeholder:text-[#9AA8A1]"
                  placeholder="Type to filter..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              )}
              {options.length === 0 && (
                <p className="w-full py-8 text-center text-[14px] text-[#9AA8A1]">
                  Nothing to choose from yet &mdash; you can continue without this.
                </p>
              )}
              <div className="mt-3 flex flex-wrap content-start gap-1.5 overflow-y-auto pb-1" style={{ overscrollBehavior: "contain" }}>
                {filtered.length === 0 && options.length > 0 ? (
                  <p className="w-full py-6 text-center text-[14px] text-[#9AA8A1]">Nothing matches &ldquo;{query}&rdquo;</p>
                ) : (
                  filtered.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => { onChange(o.id === value ? "" : o.id); setOpen(false); }}
                      className={"fa-chip !cursor-pointer !px-3.5 !py-2 !text-[13.5px] " + (o.id === value ? "!border-[#0F6E56] !bg-[#E4F5EE] !text-[#0A4A3A] !font-semibold" : "")}
                    >
                      {o.label}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body)}
    </>
  );
}