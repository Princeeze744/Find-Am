"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProLoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"pin" | "forgot-request" | "forgot-verify">("pin");
  const [whatsapp, setWhatsapp] = useState("");
  const [pin, setPin] = useState("");
  const [code, setCode] = useState("");
  const [newPin, setNewPin] = useState("");
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

  async function loginPin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const { res, data } = await call({ action: "pin", whatsapp, pin });
    setBusy(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    router.push("/dashboard");
    router.refresh();
  }

  async function requestCode() {
    setBusy(true); setError(""); setMsg("");
    const { res, data } = await call({ action: "request", whatsapp });
    setBusy(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    setMsg(data.message);
    setMode("forgot-verify");
  }

  async function verifyAndReset(e: React.FormEvent) {
    e.preventDefault();
    if (newPin.length !== 4) { setError("Choose a new 4-digit PIN."); return; }
    setBusy(true); setError("");
    const { res, data } = await call({ action: "verify", whatsapp, code, newPin });
    setBusy(false);
    if (!res.ok) { setError(data.error || "Something went wrong."); return; }
    router.push("/dashboard");
    router.refresh();
  }

  const input = "fa-input w-full px-4 py-3 text-center text-[15px] outline-none placeholder:text-[#9AA8A1]";
  const pinInput = input + " tracking-[0.4em] font-semibold";

  return (
    <div className="fa-fluff mx-auto max-w-sm p-8">
      <p className="fa-serif text-center text-2xl">Pro sign in</p>

      {mode === "pin" && (
        <form onSubmit={loginPin} className="mt-6 space-y-4">
          <input className={input} placeholder="Your WhatsApp number e.g. 2348031234567" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
          <input className={pinInput} type="password" inputMode="numeric" maxLength={4} placeholder="Your 4-digit PIN" value={pin} onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))} required />
          {error && <p className="text-center text-[13px] text-[#993556]">{error}</p>}
          <button type="submit" disabled={busy} className="fa-btn w-full disabled:opacity-60">
            {busy ? "Checking..." : "Sign in"}
          </button>
          <button type="button" onClick={() => { setMode("forgot-request"); setError(""); }} className="w-full text-center text-[13px] text-[#5A6B63] underline">
            Forgot PIN?
          </button>
          <p className="text-center text-[12px] leading-relaxed text-[#9AA8A1]">
            Not on FindAm yet?{" "}
            <a href="/join" className="font-semibold text-[#0F6E56] underline">Apply here</a>
          </p>
        </form>
      )}

      {mode === "forgot-request" && (
        <div className="mt-6 space-y-4">
          <p className="text-center text-[13px] leading-relaxed text-[#5A6B63]">
            We&apos;ll send a one-time code to your WhatsApp so you can set a new PIN.
          </p>
          <input className={input} placeholder="Your WhatsApp number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
          {error && <p className="text-center text-[13px] text-[#993556]">{error}</p>}
          <button onClick={requestCode} disabled={busy} className="fa-btn w-full disabled:opacity-60">
            {busy ? "Sending..." : "Send me a code"}
          </button>
          <button type="button" onClick={() => { setMode("pin"); setError(""); }} className="w-full text-center text-[13px] text-[#5A6B63] underline">
            Back to sign in
          </button>
        </div>
      )}

      {mode === "forgot-verify" && (
        <form onSubmit={verifyAndReset} className="mt-6 space-y-4">
          {msg && <p className="text-center text-[13px] leading-relaxed text-[#5A6B63]">{msg}</p>}
          <input className={pinInput} placeholder="000000" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))} required />
          <input className={pinInput} type="password" inputMode="numeric" maxLength={4} placeholder="New 4-digit PIN" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ""))} required />
          {error && <p className="text-center text-[13px] text-[#993556]">{error}</p>}
          <button type="submit" disabled={busy} className="fa-btn w-full disabled:opacity-60">
            {busy ? "Verifying..." : "Set PIN and sign in"}
          </button>
          <button type="button" disabled={busy} onClick={requestCode} className="w-full text-center text-[13px] font-semibold text-[#0F6E56] underline disabled:opacity-60">
            Resend code
          </button>
        </form>
      )}
    </div>
  );
}