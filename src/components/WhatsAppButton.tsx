"use client";

import { WhatsAppIcon } from "./Icons";

export default function WhatsAppButton({
  proId,
  whatsapp,
  source = "whatsapp_tap",
  className = "fa-btn mt-4 flex w-full text-[14px]",
  label = "Chat on WhatsApp",
}: {
  proId: string;
  whatsapp: string;
  source?: string;
  className?: string;
  label?: string;
}) {
  function logLead() {
    try {
      const payload = JSON.stringify({ proId, source });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/lead", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true });
      }
    } catch {}
  }

  return (
    <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={logLead} className={className}>
      <WhatsAppIcon /> {label}
    </a>
  );
}