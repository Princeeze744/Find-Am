import Logo from "./Logo";

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
        </div>
      </div>
    </footer>
  );
}