"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "./FileUpload";

type Editable = {
  photoUrl: string; bio: string; tags: string; priceGuide: string; yearsExp: number;
  videoUrl: string; instagram: string; facebook: string; tiktok: string; workPhotos: string;
};

export default function ProfileEditor({ initial }: { initial: Editable }) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...initial,
    yearsExp: String(initial.yearsExp || ""),
    priceGuide: (initial.priceGuide || "").split("|").join("\n"),
  });
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function save() {
    setState("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/pro-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          yearsExp: Number(form.yearsExp) || 0,
          priceGuide: form.priceGuide.split("\n").map((s) => s.trim()).filter(Boolean).join("|"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setState("error");
        return;
      }
      setState("saved");
      router.refresh();
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setErrorMsg("Network problem. Please try again.");
      setState("error");
    }
  }

  const label = "block text-[13px] font-semibold text-[#3C4A43] mb-1.5";
  const input = "fa-input w-full px-4 py-3 text-[15px] outline-none placeholder:text-[#9AA8A1]";

  return (
    <div className="fa-fluff mt-4 space-y-5 p-6">
      <FileUpload label="Profile photo" value={form.photoUrl} onUploaded={(url) => setForm({ ...form, photoUrl: url })} hint="Customers see this on your profile" />
      <div>
        <label className={label}>About you (shown on your public profile)</label>
        <textarea className={input} rows={3} placeholder="What you do best, how you work, why people call you back..." value={form.bio} onChange={set("bio")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Skills and keywords (comma separated)</label>
          <input className={input} placeholder="e.g. wiring, solar, inverter" value={form.tags} onChange={set("tags")} />
          <p className="mt-1 text-[12px] text-[#9AA8A1]">These help customers find you in search.</p>
        </div>
        <div>
          <label className={label}>Years of experience</label>
          <input className={input} type="number" min="0" value={form.yearsExp} onChange={set("yearsExp")} />
        </div>
      </div>
      <div>
        <label className={label}>Price guide (one service per line)</label>
        <textarea className={input} rows={3} value={form.priceGuide} onChange={set("priceGuide")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Instagram</label>
          <input className={input} value={form.instagram} onChange={set("instagram")} />
        </div>
        <div>
          <label className={label}>Facebook</label>
          <input className={input} value={form.facebook} onChange={set("facebook")} />
        </div>
        <div>
          <label className={label}>TikTok</label>
          <input className={input} value={form.tiktok} onChange={set("tiktok")} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Video introduction link</label>
          <input className={input} placeholder="YouTube, TikTok or Drive link" value={form.videoUrl} onChange={set("videoUrl")} />
        </div>
        <div>
          <label className={label}>Work photo links (comma separated)</label>
          <input className={input} value={form.workPhotos} onChange={set("workPhotos")} />
        </div>
      </div>
      {state === "error" && (
        <p className="rounded-xl bg-[#FBEAF0] px-4 py-3 text-[14px] text-[#993556]">{errorMsg}</p>
      )}
      <div className="flex items-center gap-3">
        <button onClick={save} disabled={state === "saving"} className="fa-btn text-[14px] disabled:opacity-60">
          {state === "saving" ? "Saving..." : "Save changes"}
        </button>
        {state === "saved" && <span className="text-[14px] font-semibold text-[#0F6E56]">Saved &#10003; Your profile is updated.</span>}
      </div>
      <p className="text-[12px] text-[#9AA8A1]">
        Name, trade and phone number are locked to protect your verified identity &mdash;
        message the FindAm team to change those.
      </p>
    </div>
  );
}