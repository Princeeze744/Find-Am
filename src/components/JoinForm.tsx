"use client";

import Image from "next/image";
import { useState } from "react";
import Picker from "./Picker";

type Cat = { id: string; name: string };
type AreaOpt = { id: string; name: string };
type StateOpt = { id: string; name: string; areas: AreaOpt[] };

export default function JoinForm({ categories, states }: { categories: Cat[]; states: StateOpt[] }) {
  const [stateId, setStateId] = useState(states.find((s) => s.name === "Rivers")?.id || "");
  const areas = states.find((s) => s.id === stateId)?.areas ?? [];
  const [form, setForm] = useState({
    name: "", phone: "", whatsapp: "", trade: "", categoryId: "",
    yearsExp: "", bio: "", tags: "", priceGuide: "",
    instagram: "", facebook: "", tiktok: "", videoUrl: "", workPhotos: "",
    customAreas: "", customTrade: "", idType: "", idNumber: "", idPhotoUrl: "",
    pin: "",
  });
  const [areaIds, setAreaIds] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const toggleArea = (id: string) =>
    setAreaIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.pin.length !== 4) {
      setErrorMsg("Please create a 4-digit PIN \u2014 you will use it to sign in.");
      setState("error");
      return;
    }
    if (!form.idType) {
      setErrorMsg("Please choose your ID type \u2014 identity verification is required.");
      setState("error");
      return;
    }
    setState("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, areaIds, stateId }),
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
        <p className="fa-serif text-2xl text-[#0A4A3A]">Application received!</p>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#5A6B63]">
          Thank you. Our team will review your application and reach out on WhatsApp
          to arrange your in-person vetting. Once verified, your profile goes live
          and neighbours can start finding you.
        </p>
      </div>
    );
  }

  const label = "block text-[13px] font-semibold text-[#3C4A43] mb-1.5";
  const input = "fa-input w-full px-4 py-3 text-[15px] outline-none placeholder:text-[#9AA8A1]";

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Your full name *</label>
          <input className={input} placeholder="e.g. Chinedu Eze" value={form.name} onChange={set("name")} required />
        </div>
        <div>
          <label className={label}>Years of experience</label>
          <input className={input} type="number" min="0" placeholder="e.g. 5" value={form.yearsExp} onChange={set("yearsExp")} />
        </div>
        <div>
          <label className={label}>Phone number *</label>
          <input className={input} placeholder="e.g. 0803 123 4567" value={form.phone} onChange={set("phone")} required />
        </div>
        <div>
          <label className={label}>WhatsApp number *</label>
          <input className={input} placeholder="e.g. 2348031234567" value={form.whatsapp} onChange={set("whatsapp")} required />
        </div>
        <div>
          <label className={label}>Create your 4-digit PIN *</label>
          <input className={input + " tracking-[0.35em] font-semibold"} type="password" inputMode="numeric" maxLength={4} placeholder="\u2022\u2022\u2022\u2022" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/[^0-9]/g, "") })} required />
          <p className="mt-1 text-[12px] text-[#9AA8A1]">You will sign in with your WhatsApp number + this PIN. Keep it private.</p>
        </div>
        <div>
          <label className={label}>What do you do? *</label>
          <input className={input} placeholder="e.g. Electrician, Makeup artist, DJ" value={form.trade} onChange={set("trade")} required />
          <input className={input + " mt-2"} placeholder="Category not in the list below? Type it here" value={form.customTrade} onChange={set("customTrade")} />
        </div>
        <div>
          <label className={label}>Category *</label>
          <Picker
            options={categories.map((c) => ({ id: c.id, label: c.name }))}
            value={form.categoryId}
            onChange={(id) => setForm({ ...form, categoryId: id, customTrade: "" })}
            placeholder="Choose or type your own"
            title="Which category fits you best?"
            allowCustom
            customSelected={form.customTrade}
            onCustom={(val) => setForm({ ...form, customTrade: val, categoryId: "" })}
          />
        </div>
      </div>

      <div>
        <label className={label}>Your state *</label>
        <Picker
          options={states.map((s) => ({ id: s.id, label: s.name }))}
          value={stateId}
          onChange={(id) => { setStateId(id); setAreaIds([]); }}
          placeholder="Choose your state"
          title="Which state are you based in?"
        />
      </div>

      <div>
        <label className={label}>Areas you cover *</label>
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <button
              type="button"
              key={a.id}
              onClick={() => toggleArea(a.id)}
              className={"fa-chip !cursor-pointer " + (areaIds.includes(a.id) ? "!border-[#0F6E56] !bg-[#E4F5EE] !text-[#0A4A3A]" : "")}
            >
              {a.name}
            </button>
          ))}
        </div>
        <input
          className={input + " mt-3"}
          placeholder="Your area not listed? Type it here (comma separated)"
          value={form.customAreas}
          onChange={set("customAreas")}
        />
      </div>

      <div>
        <label className={label}>Tell customers about yourself</label>
        <textarea className={input} rows={3} placeholder="What you do best, how you work, why people call you back..." value={form.bio} onChange={set("bio")} />
      </div>

      <div>
        <label className={label}>Skills and keywords (comma separated)</label>
        <input className={input} placeholder="e.g. wiring, solar, inverter, CCTV" value={form.tags} onChange={set("tags")} />
        <p className="mt-1 text-[12px] text-[#9AA8A1]">These help customers find you when they search.</p>
      </div>

      <div>
        <label className={label}>Price guide (one service per line)</label>
        <textarea className={input} rows={3} placeholder={"Fan repair from N3,000\nFull wiring: quote after inspection"} value={form.priceGuide} onChange={set("priceGuide")} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Instagram</label>
          <input className={input} placeholder="link or @handle" value={form.instagram} onChange={set("instagram")} />
        </div>
        <div>
          <label className={label}>Facebook</label>
          <input className={input} placeholder="link" value={form.facebook} onChange={set("facebook")} />
        </div>
        <div>
          <label className={label}>TikTok</label>
          <input className={input} placeholder="link or @handle" value={form.tiktok} onChange={set("tiktok")} />
        </div>
      </div>

      <div>
        <label className={label}>Links to photos of your work</label>
        <textarea className={input} rows={2} placeholder="Paste links (Google Drive, Instagram posts...) separated by commas" value={form.workPhotos} onChange={set("workPhotos")} />
      </div>

      <div className="fa-fluff !rounded-2xl p-5">
        <label className={label}>Identity verification (required &mdash; kept private)</label>
        <p className="mb-3 text-[13px] leading-relaxed text-[#5A6B63]">
          FindAm verifies every pro. Your ID is seen only by our vetting team,
          never shown publicly. This protects customers &mdash; and protects
          your good name from impersonators.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Picker
            options={[
              { id: "NIN", label: "NIN" },
              { id: "Voter\u0027s card", label: "Voter\u0027s card" },
              { id: "Driver\u0027s license", label: "Driver\u0027s license" },
              { id: "Int\u0027l passport", label: "Int\u0027l passport" },
            ]}
            value={form.idType}
            onChange={(id) => setForm({ ...form, idType: id })}
            placeholder="ID type *"
            title="Which ID will you present?"
            searchable={false}
          />
          <input className={input} placeholder="ID number *" value={form.idNumber} onChange={set("idNumber")} required />
        </div>
        <input className={input + " mt-3"} placeholder="Link to a clear photo of your ID * (Google Drive, etc.)" value={form.idPhotoUrl} onChange={set("idPhotoUrl")} required />
      </div>

      <div className="fa-fluff !rounded-2xl p-5">
        <label className={label}>Your 30-second video introduction (optional, but powerful)</label>
        <p className="mb-3 text-[13px] leading-relaxed text-[#5A6B63]">
          Record a short video of yourself: your name, what you do, and one thing
          you are proud of. Upload it to YouTube, TikTok or Google Drive and paste
          the link here. Customers trust a face and a voice.
        </p>
        <input className={input} placeholder="Paste your video link" value={form.videoUrl} onChange={set("videoUrl")} />
      </div>

      {state === "error" && (
        <p className="rounded-xl bg-[#FBEAF0] px-4 py-3 text-[14px] text-[#993556]">{errorMsg}</p>
      )}

      <button type="submit" disabled={state === "sending"} className="fa-btn w-full text-[15px] disabled:opacity-60">
        {state === "sending" ? "Sending..." : "Submit my application"}
      </button>
      <p className="text-center text-[12px] text-[#9AA8A1]">
        Free to join. We review every application and vet in person before your profile goes live.
      </p>
    </form>
  );
}