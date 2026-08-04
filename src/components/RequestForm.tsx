"use client";

import { useState } from "react";

export default function RequestForm({ areas }: { areas: { id: string; name: string }[] }) {
  const [need, setNeed] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need, area, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setErrorMsg("Network problem. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="fa-fluff p-8 text-center">
        <p className="fa-serif text-2xl text-[#0A4A3A]">Request received!</p>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#5A6B63]">
          Our team is on it. We&apos;ll reach out on WhatsApp as soon as we have
          the right vetted person for you &mdash; and if we don&apos;t have one
          yet, we&apos;ll go out and find them.
        </p>
      </div>
    );
  }

  const label = "block text-[13px] font-semibold text-[#3C4A43] mb-1.5";
  const input = "fa-input w-full px-4 py-3 text-[15px] outline-none placeholder:text-[#9AA8A1]";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className={label}>What do you need done? *</label>
        <textarea className={input} rows={3} placeholder="e.g. My generator is not starting. I need someone this week." value={need} onChange={(e) => setNeed(e.target.value)} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Your area</label>
          <select className={input} value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Choose your area</option>
            {areas.map((a) => (
              <option key={a.id} value={a.name}>{a.name}</option>
            ))}
            <option value="Other">Other / not listed</option>
          </select>
        </div>
        <div>
          <label className={label}>Phone or WhatsApp *</label>
          <input className={input} placeholder="e.g. 0803 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
      </div>
      {state === "error" && (
        <p className="rounded-xl bg-[#FBEAF0] px-4 py-3 text-[14px] text-[#993556]">{errorMsg}</p>
      )}
      <button type="submit" disabled={state === "sending"} className="fa-btn w-full text-[15px] disabled:opacity-60">
        {state === "sending" ? "Sending..." : "Find me someone I can trust"}
      </button>
      <p className="text-center text-[12px] text-[#9AA8A1]">Free. No account needed. We reply on WhatsApp.</p>
    </form>
  );
}