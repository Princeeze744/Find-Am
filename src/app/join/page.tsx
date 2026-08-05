import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JoinForm from "@/components/JoinForm";
import BackLink from "@/components/BackLink";
import { prisma } from "@/lib/db";

export const revalidate = 300;

export default async function JoinPage() {
  const [categories, rivers] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.state.findUnique({ where: { slug: "rivers" }, include: { areas: { orderBy: { name: "asc" } } } }),
  ]);

  return (
    <div className="fa-texture relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 pb-24">
        <div className="pt-6"><BackLink /></div>
        <section className="grid items-center gap-8 pt-6 md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0F6E56]">For skilled hands</p>
            <h1 className="fa-serif mt-4 text-3xl leading-[1.12] md:text-5xl">
              Your good name deserves more customers.
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#5A6B63]">
              Join FindAm and let neighbours you have never met find you, trust
              you, and call you. Free to join &mdash; the first 30 pros pay
              nothing. We vet in person, so your verified badge actually means
              something.
            </p>
            <p className="mt-4 text-[14px] text-[#5A6B63]">
              Already on FindAm?{" "}
              <a href="/pro-login" className="font-semibold text-[#0F6E56] underline">Sign in to your dashboard</a>
            </p>
          </div>
          <div className="fa-photo relative aspect-[5/4]">
            <Image src="/images/join-hero.jpeg" alt="A Port Harcourt artisan receiving good news on his phone" fill priority sizes="(max-width: 768px) 100vw, 520px" className="object-cover" />
          </div>
        </section>

        <section className="fa-fluff mt-12 p-6 md:p-10">
          <h2 className="fa-serif text-2xl">Apply to join</h2>
          <p className="mt-2 mb-7 text-[14px] text-[#5A6B63]">
            Takes about 5 minutes. Our team reviews every application personally.
          </p>
          <JoinForm categories={categories} areas={rivers?.areas ?? []} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}