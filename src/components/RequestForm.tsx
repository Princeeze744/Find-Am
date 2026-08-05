"use client";

import Image from "next/image";
import { useState } from "react";
import Picker from "./Picker";

type AreaOpt = { id: string; name: string };
type StateOpt = { id: string; name: string; areas: AreaOpt[] };

export default function RequestForm({ states, initialNeed = "" }: { states: StateOpt[]; initialNeed?: string }) {
  const [need, setNeed] = useState(initialNeed);
  const [stateId, setStateId] = useState(states.find((s) => s.name === "Rivers")?.id || "");
  const [area, setArea] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const currentState = states.find((s) => s.id === stateId);
  const areas = currentState?.areas ?? [];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ need, area: [currentState?.name, area || customArea].filter(Boolean).join(" - "), phone }),
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
        <div className="relative mx-auto mb-4 h-28 w-28">
          <Image src="/images/success-shield.jpeg" alt="" fill sizes="112px" className="object-cover object-center" style={{ borderRadius: "1.5rem" }} />
        </div>
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
          <label className={label}>Your state *</label>
          <Picker
            options={states.map((s) => ({ id: s.id, label: s.name }))}
            value={stateId}
            onChange={(id) => { setStateId(id); setArea(""); }}
            placeholder="Choose your state"
            title="Which state are you in?"
          />
        </div>
        <div>
          <label className={label}>Your area</label>
          <Picker
            options={areas.map((a) => ({ id: a.name, label: a.name }))}
            value={area}
            onChange={setArea}
            placeholder="Choose your area"
            title={currentState ? `Where in ${currentState.name}?` : "Your area"}
          />
          <input className={input + " mt-2"} placeholder="Area not listed? Type it here" value={customArea} onChange={(e) => setCustomArea(e.target.value)} />
        </div>
      </div>
      <div>
        <label className={label}>Phone or WhatsApp *</label>
        <input className={input} placeholder="e.g. 0803 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
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