import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import RequestForm from "@/components/RequestForm";
import BackLink from "@/components/BackLink";
import AnimatedHeadline from "@/components/AnimatedHeadline";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ need?: string }> }) {
  const { need } = await searchParams;
  const states = await prisma.state.findMany({
    orderBy: { name: "asc" },
    include: { areas: { orderBy: { name: "asc" } } },
  });

  return (
    <div className="fa-texture relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-5 pb-24">
        <div className="pt-6"><BackLink /></div>
        <section className="pt-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0F6E56]">Concierge</p>
          <AnimatedHeadline text="Tell us what you need." gradWord="need" className="fa-serif mx-auto mt-4 max-w-xl text-3xl leading-[1.12] md:text-5xl" />
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#5A6B63]">
            Electrician, drummer, dispenser repair &mdash; anything, anywhere in
            Nigeria. If we have a vetted pro, we connect you. If we don&apos;t,
            we go out, find one, and vet them for you. Free, always.
          </p>
        </section>
        <section className="fa-fluff mt-10 p-6 md:p-10">
          <RequestForm states={states.map((s) => ({ id: s.id, name: s.name, areas: s.areas.map((a) => ({ id: a.id, name: a.name })) }))} initialNeed={need || ""} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}