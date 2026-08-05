import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RequestForm from "@/components/RequestForm";
import BackLink from "@/components/BackLink";
import { prisma } from "@/lib/db";

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ need?: string }> }) {
  const { need } = await searchParams;
  const rivers = await prisma.state.findUnique({
    where: { slug: "rivers" },
    include: { areas: { orderBy: { name: "asc" } } },
  });

  return (
    <div className="fa-texture relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 pb-24">
        <div className="pt-6"><BackLink /></div>
        <section className="pt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0F6E56]">Concierge</p>
          <h1 className="fa-serif mt-4 text-3xl leading-[1.12] md:text-5xl">Tell us what you need.</h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#5A6B63]">
            Electrician, drummer, dispenser repair &mdash; anything. If we have a
            vetted pro, we connect you. If we don&apos;t, we go out, find one,
            and vet them for you. Free, always.
          </p>
        </section>
        <section className="fa-fluff mt-10 p-6 md:p-10">
          <RequestForm areas={rivers?.areas ?? []} initialNeed={need || ""} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}