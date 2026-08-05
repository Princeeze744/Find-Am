"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProLoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"number" | "code">("number");
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function call(body: Record<string, string>) {
    const res = await fetch("/api/pro-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { res, data: await res.json() };
  }

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(""); setMsg("");
    const { res, data } = await call({ action: "request", whatsapp });
    setBusy(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    setMsg(data.message);
    setStep("code");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const { res, data } = await call({ action: "verify", whatsapp, code });
    setBusy(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    router.push("/dashboard");
    router.refresh();
  }

  const input = "fa-input w-full px-4 py-3 text-center text-[15px] outline-none placeholder:text-[#9AA8A1]";

  return (
    <div className="fa-fluff mx-auto max-w-sm p-8">
      <p className="fa-serif text-center text-2xl">Pro sign in</p>
      {step === "number" ? (
        <form onSubmit={requestCode} className="mt-6 space-y-4">
          <input className={input} placeholder="Your WhatsApp number e.g. 2348031234567" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
          {error && <p className="text-center text-[13px] text-[#993556]">{error}</p>}
          <button type="submit" disabled={busy} className="fa-btn w-full disabled:opacity-60">
            {busy ? "Checking..." : "Send me a code"}
          </button>
          <p className="text-center text-[12px] leading-relaxed text-[#9AA8A1]">
            We send a 6-digit code to your WhatsApp. Not on FindAm yet?{" "}
            <a href="/join" className="font-semibold text-[#0F6E56] underline">Apply here</a>
          </p>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-6 space-y-4">
          {msg && <p className="text-center text-[13px] leading-relaxed text-[#5A6B63]">{msg}</p>}
          <input className={input + " tracking-[0.4em] font-semibold"} placeholder="000000" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))} required />
          {error && <p className="text-center text-[13px] text-[#993556]">{error}</p>}
          <button type="submit" disabled={busy} className="fa-btn w-full disabled:opacity-60">
            {busy ? "Verifying..." : "Sign in"}
          </button>
          <button type="button" disabled={busy} onClick={requestCode} className="w-full text-center text-[13px] font-semibold text-[#0F6E56] underline disabled:opacity-60">
            Resend code
          </button>
          <button type="button" onClick={() => { setStep("number"); setCode(""); setError(""); }} className="w-full text-center text-[13px] text-[#5A6B63] underline">
            Use a different number
          </button>
        </form>
      )}
    </div>
  );
}