import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { WhatsAppIcon } from "@/components/Icons";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  type ProResult = Awaited<ReturnType<typeof findPros>>[number];
  async function findPros(qq: string) {
    return prisma.pro.findMany({
      where: {
        status: "vetted",
        OR: [
          { name: { contains: qq, mode: "insensitive" } },
          { trade: { contains: qq, mode: "insensitive" } },
          { tags: { contains: qq, mode: "insensitive" } },
          { category: { name: { contains: qq, mode: "insensitive" } } },
          { category: { tags: { contains: qq, mode: "insensitive" } } },
        ],
      },
      include: {
        category: true,
        areas: { include: { area: true } },
        reviews: { where: { verified: true } },
      },
      orderBy: { jobsDone: "desc" },
    });
  }

  let pros: ProResult[] = [];
  if (query) {
    pros = await findPros(query);
    await prisma.searchLog.create({
      data: { query: query.slice(0, 200), results: pros.length },
    });
  }

  return (
    <div className="fa-texture relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-24">
        <section className="pt-10">
          <form action="/search" className="fa-input mx-auto flex max-w-xl items-center gap-3 px-5 py-4">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9AA8A1" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input name="q" defaultValue={query} required placeholder='Try "AC repair" or "drummer"' className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#9AA8A1]" />
            <button type="submit" className="fa-btn !rounded-xl !px-4 !py-2 text-sm">Search</button>
          </form>
        </section>

        {!query ? (
          <p className="mt-12 text-center text-[15px] text-[#5A6B63]">
            Type what you need &mdash; a trade, a skill, even a nickname for the job.
          </p>
        ) : pros.length === 0 ? (
          <section className="fa-fluff mx-auto mt-12 max-w-xl p-8 text-center">
            <h1 className="fa-serif text-2xl md:text-3xl">
              No vetted &ldquo;{query}&rdquo; yet &mdash; but that&apos;s our job now.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#5A6B63]">
              Tell us exactly what you need. Our team will go out, find the right
              person, vet them properly, and get back to you. That&apos;s the
              FindAm promise.
            </p>
            <Link href={`/request?need=${encodeURIComponent("I am looking for: " + query)}`} className="fa-btn mx-auto mt-6 inline-flex">
              Request &ldquo;{query}&rdquo; for me
            </Link>
            <p className="mt-3 text-[12px] text-[#9AA8A1]">Free. We reply on WhatsApp.</p>
          </section>
        ) : (
          <section className="mt-10">
            <h1 className="fa-serif text-2xl md:text-3xl">
              {pros.length} vetted {pros.length === 1 ? "pro" : "pros"} for &ldquo;{query}&rdquo;
            </h1>
            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {pros.map((p) => {
                const ratings = p.reviews.map((r) => r.rating);
                const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
                return (
                  <div key={p.id} className="fa-fluff overflow-hidden !p-0">
                    <Link href={`/pro/${p.slug}`} className="relative block aspect-[4/3]">
                      <Image src={p.photoUrl || "/images/hero-electrician.png"} alt={`${p.name}, verified ${p.trade.toLowerCase()} on FindAm`} fill sizes="(max-width: 768px) 100vw, 380px" className="object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,40,31,0.75)] to-transparent px-5 pb-3.5 pt-10">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{p.name}</span>
                          <span className="fa-badge !border-transparent !bg-[rgba(228,245,238,0.92)]">&#10003; Verified</span>
                        </div>
                        <p className="mt-0.5 text-[13px] text-[#CFE8DD]">
                          {p.trade} &middot; {p.areas.map((pa) => pa.area.name).join(", ") || "Port Harcourt"}
                        </p>
                      </div>
                    </Link>
                    <div className="p-5">
                      <div className="flex items-center gap-4 text-[13px] text-[#5A6B63]">
                        <span className="font-medium text-[#B78A2E]">{avg ? `\u2605 ${avg} (${ratings.length})` : "New on FindAm"}</span>
                        <span>{p.jobsDone} jobs</span>
                        <span>~{p.replyMins} min</span>
                      </div>
                      <a href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noopener noreferrer" className="fa-btn mt-4 flex w-full text-[14px]">
                        <WhatsAppIcon /> Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="fa-fluff mx-auto mt-10 max-w-xl p-6 text-center">
              <p className="text-[15px] text-[#5A6B63]">
                Not quite what you needed?{" "}
                <Link href={`/request?need=${encodeURIComponent("I am looking for: " + query)}`} className="font-semibold text-[#0F6E56] underline">
                  Describe it and we&apos;ll find the right person
                </Link>
              </p>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}