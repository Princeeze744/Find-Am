"use client";

import { useEffect, useState, useCallback } from "react";

type Pending = {
  id: string; name: string; trade: string; phone: string; whatsapp: string;
  bio: string; tags: string; priceGuide: string; yearsExp: number;
  videoUrl: string; instagram: string; facebook: string; tiktok: string; workPhotos: string;
  idType: string; idNumber: string; idPhotoUrl: string; customAreas: string; customTrade: string;
  createdAt: string;
  category: { name: string };
  areas: { area: { name: string } }[];
};
type ProRow = {
  id: string; name: string; trade: string; status: string; jobsDone: number; createdAt: string;
  category: { name: string };
  _count: { leads: number; reviews: number };
};
type Req = { id: string; need: string; area: string; phone: string; status: string; createdAt: string; resolution: string; linkedProId: string };
type LeadRow = { id: string; source: string; createdAt: string; pro: { name: string } };
type SearchRow = { id: string; query: string; results: number; createdAt: string };
type OtpRow = { id: string; name: string; whatsapp: string; otpCode: string; otpExpires: string };

export default function AdminView() {
  const [key, setKey] = useState("");
  const [entered, setEntered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<{ pending: Pending[]; pros: ProRow[]; requests: Req[]; leads: LeadRow[]; searches: SearchRow[]; otps: OtpRow[] } | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async (k: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", { headers: { "x-admin-key": k } });
      if (res.status === 401) {
        setError("Wrong key.");
        setEntered(false);
        return;
      }
      const d = await res.json();
      setData(d);
      setEntered(true);
      sessionStorage.setItem("fa-admin-key", k);
    } catch {
      setError("Network problem.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("fa-admin-key");
    if (saved) {
      setKey(saved);
      load(saved);
    }
  }, [load]);

  async function act(body: Record<string, string>) {
    setLoading(true);
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify(body),
      });
      await load(key);
    } finally {
      setLoading(false);
    }
  }

  if (!entered) {
    return (
      <div className="fa-fluff mx-auto mt-16 max-w-sm p-8 text-center">
        <p className="fa-serif text-2xl">Control room</p>
        <input
          type="password"
          className="fa-input mt-5 w-full px-4 py-3 text-center outline-none"
          placeholder="Admin key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(key)}
        />
        {error && <p className="mt-3 text-[13px] text-[#993556]">{error}</p>}
        <button onClick={() => load(key)} disabled={loading} className="fa-btn mt-4 w-full disabled:opacity-60">
          {loading ? "Checking..." : "Enter"}
        </button>
      </div>
    );
  }

  if (!data) return <p className="mt-16 text-center text-[#5A6B63]">Loading...</p>;

  const h2 = "fa-serif text-xl md:text-2xl mt-12 mb-4";
  const small = "text-[12px] text-[#9AA8A1]";

  return (
    <div className="pb-24">
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { n: data.pending.length, l: "pending applications" },
          { n: data.pros.filter((p) => p.status === "vetted").length, l: "vetted pros" },
          { n: data.requests.filter((r) => r.status === "open").length, l: "open requests" },
          { n: data.leads.length, l: "recent leads" },
        ].map((s) => (
          <div key={s.l} className="fa-fluff p-5 text-center">
            <p className="fa-serif text-3xl text-[#0A4A3A]">{s.n}</p>
            <p className="mt-1 text-[12px] text-[#5A6B63]">{s.l}</p>
          </div>
        ))}
      </div>

      {data.otps && data.otps.length > 0 && (
        <>
          <h2 className={h2}>Login codes waiting to be sent</h2>
          <div className="space-y-3">
            {data.otps.map((o) => (
              <div key={o.id} className="fa-fluff flex flex-wrap items-center gap-3 border-l-4 !border-l-[#B78A2E] p-4">
                <span className="font-semibold">{o.name}</span>
                <span className="fa-serif text-xl tracking-[0.3em] text-[#0A4A3A]">{o.otpCode}</span>
                <span className="text-[13px] text-[#5A6B63]">expires {new Date(o.otpExpires).toLocaleTimeString()}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Your FindAm sign-in code is ${o.otpCode}. It expires in 10 minutes. - FindAm team`);
                    window.open(`https://wa.me/${o.whatsapp}`, "_blank");
                  }}
                  className="fa-btn ml-auto !px-4 !py-2 text-[13px]"
                >
                  Copy + open WhatsApp
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className={h2}>Pending applications</h2>
      {data.pending.length === 0 ? (
        <p className="text-[14px] text-[#5A6B63]">Queue is clear. Every application reviewed.</p>
      ) : (
        <div className="space-y-4">
          {data.pending.map((p) => (
            <div key={p.id} className="fa-fluff p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-lg font-semibold">{p.name}</span>
                <span className="text-[14px] text-[#5A6B63]">{p.trade} &middot; {p.category.name} &middot; {p.yearsExp} yrs</span>
                <span className={small}>{new Date(p.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-[14px] text-[#3C4A43]">{p.bio || "No bio provided."}</p>
              <div className="mt-3 grid gap-1 text-[13px] text-[#5A6B63] sm:grid-cols-2">
                <span>Phone: {p.phone}</span>
                <span>WhatsApp: {p.whatsapp}</span>
                <span>Areas: {p.areas.map((a) => a.area.name).join(", ") || "none"}</span>
                <span>Tags: {p.tags || "none"}</span>
                {p.customAreas && <span className="font-semibold text-[#0A4A3A]">Custom areas (typed): {p.customAreas}</span>}
                {p.customTrade && <span className="font-semibold text-[#0A4A3A]">Custom category (typed): {p.customTrade}</span>}
                <span className="sm:col-span-2 rounded-lg border border-[#B78A2E] bg-[#FDF8EE] px-3 py-2 font-medium text-[#5F4A16]">
                  ID: {p.idType || "MISSING"} &middot; {p.idNumber || "no number"} &middot;{" "}
                  {p.idPhotoUrl ? (
                    <a className="text-[#0F6E56] underline" href={p.idPhotoUrl} target="_blank" rel="noopener noreferrer">view ID photo</a>
                  ) : (
                    "no photo"
                  )}
                </span>
                {p.priceGuide && <span className="sm:col-span-2">Prices: {p.priceGuide.split("|").join(" \u00b7 ")}</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[13px]">
                {p.videoUrl && <a className="text-[#0F6E56] underline" href={p.videoUrl} target="_blank" rel="noopener noreferrer">Video intro</a>}
                {p.instagram && <a className="text-[#0F6E56] underline" href={p.instagram.startsWith("http") ? p.instagram : `https://instagram.com/${p.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">Instagram</a>}
                {p.facebook && <a className="text-[#0F6E56] underline" href={p.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
                {p.tiktok && <a className="text-[#0F6E56] underline" href={p.tiktok.startsWith("http") ? p.tiktok : `https://tiktok.com/@${p.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer">TikTok</a>}
                {p.workPhotos && p.workPhotos.split(",").map((w, i) => (
                  <a key={i} className="text-[#0F6E56] underline" href={w.trim()} target="_blank" rel="noopener noreferrer">Work {i + 1}</a>
                ))}
              </div>
              <textarea
                className="fa-input mt-4 w-full px-4 py-3 text-[14px] outline-none"
                rows={2}
                placeholder="Vetting notes (shown publicly on the profile): e.g. Workshop visited 5 Aug. 2 jobs inspected. 2 references called. ID confirmed."
                value={notes[p.id] || ""}
                onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })}
              />
              <div className="mt-3 flex gap-3">
                <button onClick={() => act({ action: "approve", proId: p.id, notes: notes[p.id] || "" })} disabled={loading} className="fa-btn text-[14px] disabled:opacity-60">
                  Approve as vetted
                </button>
                <button onClick={() => act({ action: "reject", proId: p.id })} disabled={loading} className="fa-btn-ghost !border-[#F09595] !text-[#A32D2D] text-[14px] disabled:opacity-60">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className={h2}>Service requests</h2>
      {data.requests.length === 0 ? (
        <p className="text-[14px] text-[#5A6B63]">No requests yet.</p>
      ) : (
        <div className="space-y-3">
          {data.requests.map((r) => {
            const wa = r.phone.replace(/[^0-9]/g, "").replace(/^0/, "234");
            return (
            <div key={r.id} className="fa-fluff p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={"fa-badge " + (r.status === "open" ? "" : "!bg-[#F1EFE8] !text-[#5F5E5A]")}>{r.status}</span>
                <span className="flex-1 text-[14px] font-medium">{r.need}</span>
                <span className={small}>{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px] text-[#5A6B63]">
                <span>{r.area || "no area"}</span>
                <span>{r.phone}</span>
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="fa-btn !px-3 !py-1.5 text-[12px]">
                  WhatsApp them
                </a>
              </div>
              {r.status === "open" ? (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select id={"link-" + r.id} className="fa-input !w-auto px-3 py-2 text-[13px] outline-none">
                    <option value="">Link a vetted pro (optional)</option>
                    {data.pros.filter((p) => p.status === "vetted").map((p) => (
                      <option key={p.id} value={p.id}>{p.name} - {p.trade}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const note = window.prompt("How was this handled? (shown to the team, powers future testimonials)") || "";
                      const sel = document.getElementById("link-" + r.id) as HTMLSelectElement | null;
                      act({ action: "requestStatus", requestId: r.id, status: "handled", resolution: note, linkedProId: sel?.value || "" });
                    }}
                    className="fa-btn-ghost !px-3 !py-1.5 text-[12px]"
                  >
                    Mark handled
                  </button>
                </div>
              ) : (
                r.resolution && <p className="mt-2 rounded-lg bg-[#F4F8F5] px-3 py-2 text-[13px] text-[#3C4A43]">Resolved: {r.resolution}</p>
              )}
            </div>
          );})}
        </div>
      )}

      <h2 className={h2}>All pros</h2>
      <div className="space-y-2">
        {data.pros.map((p) => (
          <div key={p.id} className="fa-fluff flex flex-wrap items-center gap-3 p-4">
            <span className={"fa-badge " + (p.status === "vetted" ? "" : "!bg-[#FBEAF0] !text-[#993556]")}>{p.status}</span>
            <span className="font-semibold">{p.name}</span>
            <span className="text-[13px] text-[#5A6B63]">{p.trade} &middot; {p.category.name}</span>
            <span className="ml-auto text-[13px] text-[#5A6B63]">{p._count.leads} leads &middot; {p._count.reviews} reviews &middot; {p.jobsDone} jobs</span>
          </div>
        ))}
      </div>

      <h2 className={h2}>Recent leads</h2>
      {data.leads.length === 0 ? (
        <p className="text-[14px] text-[#5A6B63]">No leads logged yet &mdash; lead tracking wires in next.</p>
      ) : (
        <div className="space-y-2">
          {data.leads.map((l) => (
            <div key={l.id} className="fa-fluff flex items-center gap-3 p-3 text-[13px]">
              <span className="font-medium">{l.pro.name}</span>
              <span className="text-[#5A6B63]">{l.source}</span>
              <span className={"ml-auto " + small}>{new Date(l.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <h2 className={h2}>Recent searches</h2>
      {data.searches.length === 0 ? (
        <p className="text-[14px] text-[#5A6B63]">No searches logged yet &mdash; search wires in next.</p>
      ) : (
        <div className="space-y-2">
          {data.searches.map((s) => (
            <div key={s.id} className="fa-fluff flex items-center gap-3 p-3 text-[13px]">
              <span className="font-medium">&ldquo;{s.query}&rdquo;</span>
              <span className="text-[#5A6B63]">{s.results} results</span>
              <span className={"ml-auto " + small}>{new Date(s.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}