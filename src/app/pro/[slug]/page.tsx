import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import BackLink from "@/components/BackLink";

export const revalidate = 60;

export default async function ProPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const pro = await prisma.pro.findUnique({
    where: { slug },
    include: {
      category: true,
      areas: { include: { area: true } },
      reviews: { where: { verified: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!pro || pro.status !== "vetted") notFound();

  prisma.pro.update({ where: { id: pro.id }, data: { profileViews: { increment: 1 } } }).catch(() => {});

  const ratings = pro.reviews.map((r) => r.rating);
  const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
  const priceRows = pro.priceGuide ? pro.priceGuide.split("|") : [];
  const jar = await cookies();
  const isOwner = jar.get("fa-pro")?.value === pro.id;

  const vettedDate = pro.vettedAt
    ? new Date(pro.vettedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="fa-texture relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 pb-24">
        <div className="pt-6"><BackLink fallback="/" /></div>
        <nav className="pt-3 text-sm text-[#9AA8A1]">
          <Link href="/" className="hover:text-[#0F6E56]">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/c/${pro.category.slug}`} className="hover:text-[#0F6E56]">{pro.category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-[#5A6B63]">{pro.name}</span>
        </nav>

        <section className="mt-8 grid gap-8 md:grid-cols-[300px_1fr] md:gap-12">
          <div className="fa-photo relative aspect-[4/5]">
            <Image src={pro.photoUrl || "/images/hero-electrician.png"} alt={`${pro.name}, verified ${pro.trade.toLowerCase()} on FindAm`} fill priority sizes="(max-width: 768px) 100vw, 300px" className="object-cover" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="fa-serif text-3xl md:text-4xl">{pro.name}</h1>
              <span className="fa-badge">&#10003; Verified</span>
            </div>
            <p className="mt-2 text-[15px] text-[#5A6B63]">
              {pro.trade} &middot; {pro.yearsExp} yrs experience &middot; covers{" "}
              {pro.areas.map((pa) => pa.area.name).join(", ")}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-5 text-[14px] text-[#5A6B63]">
              <span className="font-medium text-[#B78A2E]">
                {avg ? `\u2605 ${avg} \u00b7 ${ratings.length} verified ${ratings.length === 1 ? "review" : "reviews"}` : "New on FindAm"}
              </span>
              <span>{pro.jobsDone} jobs done</span>
              <span>replies in ~{pro.replyMins} min</span>
            </div>

            {pro.bio && (
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-[#3C4A43]">{pro.bio}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppButton proId={pro.id} whatsapp={pro.whatsapp} source="profile_top" className="fa-btn text-[15px]" />
              <a href={`tel:${pro.phone}`} className="fa-btn-ghost text-[15px]">Call</a>
            </div>
          </div>
        </section>

        {vettedDate && (
          <section className="fa-fluff mt-10 border-l-4 !border-l-[#0F6E56] p-6">
            <p className="flex items-center gap-2 font-semibold text-[#0A4A3A]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4Z" />
                <path d="m9 12 2 2 4-4.5" />
              </svg>
              Vetted in person &mdash; {vettedDate}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#3C4A43]">{pro.vettedNotes}</p>
          </section>
        )}

        {priceRows.length > 0 && (
          <section className="mt-10">
            <h2 className="fa-serif text-2xl">Price guide</h2>
            <div className="fa-fluff mt-4 divide-y divide-[rgba(14,23,19,0.06)] !p-0">
              {priceRows.map((row) => {
                const [service, price] = row.split(" from ");
                return (
                  <div key={row} className="flex items-center justify-between px-6 py-4">
                    <span className="text-[15px]">{service.replace(/ from.*/, "").replace(/:.*/, "")}{row.includes(":") ? "" : ""}</span>
                    <span className="text-[15px] font-medium text-[#0A4A3A]">
                      {price ? `from ${price}` : row.split(":")[1]?.trim() || ""}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[13px] text-[#9AA8A1]">
              Starting prices &mdash; final cost depends on the job. The price agreed is the price paid.
            </p>
          </section>
        )}

        <section className="mt-10">
          {pro.workPhotos && (
            <div className="mb-10">
              <h2 className="fa-serif text-2xl">Recent work</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                {pro.workPhotos.split(",").map((u) => u.trim()).filter(Boolean).slice(0, 6).map((u, i) => (
                  <a key={i} href={u} target="_blank" rel="noopener noreferrer" className="fa-photo relative block aspect-[4/3] bg-[#EFEBE3]">
                    {/\.(jpg|jpeg|png|webp)($|\?)/i.test(u) ? (
                      <Image src={u} alt={`Work by ${pro.name} ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 300px" className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold text-[#0F6E56]">View work {i + 1} &#8599;</span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          <h2 className="fa-serif text-2xl">Verified reviews</h2>
          {pro.reviews.length === 0 ? (
            <p className="mt-4 text-[15px] text-[#5A6B63]">
              No reviews yet &mdash; be the first to hire {pro.name.split(" ")[0]} and tell the city.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {pro.reviews.map((r) => (
                <div key={r.id} className="fa-fluff p-6">
                  <div className="flex items-center gap-2 text-[13px] text-[#5A6B63]">
                    <span className="text-[#B78A2E]">{"\u2605".repeat(r.rating)}</span>
                    <span className="font-semibold text-[#14201B]">{r.author}</span>
                    {r.area && <span>&middot; {r.area}</span>}
                    <span className="fa-badge !text-[10px]">verified job</span>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#3C4A43]">&ldquo;{r.text}&rdquo;</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="fa-panel mt-14 px-7 py-10 text-center">
          {isOwner ? (
            <>
              <p className="fa-serif text-2xl md:text-3xl">This is your public profile</p>
              <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[#BFE8D9]">
                Exactly what customers see when they find you. Keep your work
                photos fresh and your prices honest.
              </p>
              <a href="/dashboard" className="fa-btn mx-auto mt-6 inline-flex !bg-none !bg-[#FAF7F2] !text-[#0A4A3A]">
                Open my dashboard
              </a>
            </>
          ) : (
            <>
              <p className="fa-serif text-2xl md:text-3xl">Ready when you are</p>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[#BFE8D9]">
            Message {pro.name.split(" ")[0]} now &mdash; he typically replies within {pro.replyMins} minutes.
          </p>
          <WhatsAppButton proId={pro.id} whatsapp={pro.whatsapp} source="profile_bottom" className="fa-btn mx-auto mt-6 flex !bg-none !bg-[#FAF7F2] !text-[#0A4A3A]" />
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}