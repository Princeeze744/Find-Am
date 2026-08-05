"use client";

import { useRouter } from "next/navigation";

export default function BackLink({ fallback = "/", label = "Back" }: { fallback?: string; label?: string }) {
  const router = useRouter();

  function go() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <button onClick={go} className="fa-chip !cursor-pointer !gap-2 !px-4 !py-2 text-[13px] font-semibold">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5m6-7-7 7 7 7" />
      </svg>
      {label}
    </button>
  );
}