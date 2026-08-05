import Logo from "./Logo";
import { FINDAM_WHATSAPP } from "@/lib/config";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[rgba(14,23,19,0.08)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-[#9AA8A1] md:flex-row">
        <div className="flex items-center gap-2">
          <Logo size={24} />
          <span>FindAm &mdash; trusted hands, Port Harcourt</span>
        </div>
        <div className="flex gap-5">
          <span>Vetted in person</span>
          <span>Real reviews only</span>
          <span>Free for you, always</span>
          <a href="/pro-login" className="font-semibold text-[#0F6E56]">Pro sign in</a>
          {FINDAM_WHATSAPP && (
            <a href={`https://wa.me/${FINDAM_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0F6E56]">Talk to us</a>
          )}
        </div>
      </div>
    </footer>
  );
}