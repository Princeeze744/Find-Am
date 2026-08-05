"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setQuery("");
    return () => { document.body.style.overflow = ""; };
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

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[80] bg-[rgba(6,40,31,0.45)] backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-x-0 bottom-0 z-[90] mx-auto max-w-lg rounded-t-[1.8rem] bg-[#FDFBF7] px-5 pb-8 pt-3 shadow-[0_-20px_60px_rgba(6,40,31,0.25)]"
              style={{ maxHeight: "75vh" }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[rgba(14,23,19,0.12)]" />
              <p className="fa-serif text-center text-xl">{title}</p>
              {searchable && options.length > 6 && (
                <input
                  autoFocus={false}
                  className="fa-input mt-4 w-full px-4 py-3 text-[15px] outline-none placeholder:text-[#9AA8A1]"
                  placeholder="Type to filter..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              )}
              <div className="mt-4 flex flex-wrap gap-2 overflow-y-auto" style={{ maxHeight: "45vh" }}>
                {filtered.length === 0 ? (
                  <p className="w-full py-6 text-center text-[14px] text-[#9AA8A1]">Nothing matches &ldquo;{query}&rdquo;</p>
                ) : (
                  filtered.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => { onChange(o.id); setOpen(false); }}
                      className={"fa-chip !cursor-pointer !px-4 !py-2.5 !text-[14px] " + (o.id === value ? "!border-[#0F6E56] !bg-[#E4F5EE] !text-[#0A4A3A] !font-semibold" : "")}
                    >
                      {o.label}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}