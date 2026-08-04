import Image from "next/image";

export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <Image
      src="/brand/logo-mark.png"
      alt="FindAm"
      width={size}
      height={size}
      className="rounded-xl border border-[rgba(14,23,19,0.06)] shadow-sm"
    />
  );
}