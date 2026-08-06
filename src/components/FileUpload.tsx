"use client";

import { useRef, useState } from "react";

export default function FileUpload({
  label,
  value,
  onUploaded,
  hint = "",
}: {
  label: string;
  value: string;
  onUploaded: (url: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setState("uploading");
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        setState("error");
        return;
      }
      onUploaded(data.url);
      setState("idle");
    } catch {
      setError("Network problem. Please try again.");
      setState("error");
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#3C4A43]">{label}</label>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {value ? (
        <div className="flex items-center gap-3">
          <img src={value} alt="" className="h-16 w-16 rounded-xl object-cover" />
          <span className="text-[13px] font-semibold text-[#0F6E56]">Uploaded &#10003;</span>
          <button type="button" onClick={() => inputRef.current?.click()} className="fa-chip !cursor-pointer text-[12px]">
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={state === "uploading"}
          className="fa-input flex w-full items-center justify-center gap-2 px-4 py-3 text-[14px] font-semibold text-[#0F6E56] disabled:opacity-60"
        >
          {state === "uploading" ? "Uploading..." : "\u{1F4F7} Take photo or choose from gallery"}
        </button>
      )}
      {hint && <p className="mt-1 text-[12px] text-[#9AA8A1]">{hint}</p>}
      {state === "error" && <p className="mt-1 text-[13px] text-[#993556]">{error}</p>}
    </div>
  );
}