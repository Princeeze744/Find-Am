import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { WhatsAppIcon } from "@/components/Icons";
import { prisma } from "@/lib/db";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  const cat = await prisma.category.findUnique({
    where: { slug: category },
    include: {
      pros: {
        where: { status: "vetted" },
        orderBy: { jobsDone: "desc" },
        include: {
          areas: { include: { area: true } },
          reviews: { where: { verified: true } },
        },
      },
    },
  });

  if (!cat) notFound();

  return (
    <div className="fa-texture relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-24">
        <nav className="pt-8 text-sm text-[#9AA8A1]">
          <Link href="/" className="hover:text-[#0F6E56]">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5A6B63]">{cat.name}</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="fa-serif text-3xl md:text-5xl">{cat.name} in Port Harcourt</h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#5A6B63]">
              {cat.pros.length} vetted {cat.pros.length === 1 ? "pro" : "pros"} &mdash; every
              one met in person, work inspected, references called.
              {cat.priceFrom ? ` Prices from \u20a6${cat.priceFrom.toLocaleString("en-NG")}.` : ""}
            </p>
          </div>
        </div>

        {cat.pros.length === 0 ? (
          <div className="fa-fluff mt-10 max-w-xl p-8 text-center">
            <p className="fa-serif text-2xl">We&apos;re vetting {cat.name.toLowerCase()} right now</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[#5A6B63]">
              Tell us what you need and we&apos;ll personally find and vet the right
              person for you &mdash; free.
            </p>
            <button className="fa-btn mt-6">Request a pro</button>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {cat.pros.map((p) => {
              const ratings = p.reviews.map((r) => r.rating);
              const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
              return (
                <div key={p.id} className="fa-fluff overflow-hidden !p-0">
                  <Link href={`/pro/${p.slug}`} className="block">
                    <div className="relative aspect-[4/3]">
                      <Image src={p.photoUrl || "/images/hero-electrician.png"} alt={`${p.name}, verified ${p.trade.toLowerCase()} on FindAm`} fill sizes="(max-width: 768px) 100vw, 380px" className="object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,40,31,0.75)] to-transparent px-5 pb-3.5 pt-10">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{p.name}</span>
                          <span className="fa-badge !border-transparent !bg-[rgba(228,245,238,0.92)]">&#10003; Verified</span>
                        </div>
                        <p className="mt-0.5 text-[13px] text-[#CFE8DD]">
                          {p.trade} &middot; {p.areas.map((pa) => pa.area.name).join(", ")}
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-4 text-[13px] text-[#5A6B63]">
                      <span className="font-medium text-[#B78A2E]">
                        {avg ? `\u2605 ${avg} (${ratings.length})` : "New on FindAm"}
                      </span>
                      <span>{p.jobsDone} jobs</span>
                      <span>~{p.replyMins} min</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noopener noreferrer" className="fa-btn flex-1 text-[14px]">
                        <WhatsAppIcon /> WhatsApp
                      </a>
                      <Link href={`/pro/${p.slug}`} className="fa-btn-ghost !px-4 text-[14px]">
                        Profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}