import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LogoutButton from "@/components/LogoutButton";
import ProfileEditor from "@/components/ProfileEditor";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const jar = await cookies();
  const proId = jar.get("fa-pro")?.value;
  if (!proId) redirect("/pro-login");

  const pro = await prisma.pro.findUnique({
    where: { id: proId },
    include: {
      category: true,
      areas: { include: { area: true } },
      reviews: { where: { verified: true } },
      _count: { select: { leads: true } },
    },
  });
  if (!pro) redirect("/pro-login");

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const leadsThisWeek = await prisma.lead.count({ where: { proId: pro.id, createdAt: { gte: weekAgo } } });

  const ratings = pro.reviews.map((r) => r.rating);
  const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

  return (
    <div className="fa-texture relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 pb-24">
        <section className="flex flex-wrap items-center gap-4 pt-10">
          <div className="fa-photo relative h-20 w-20 shrink-0 !rounded-2xl">
            <Image src={pro.photoUrl || "/images/hero-electrician.png"} alt={pro.name} fill sizes="80px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="fa-serif text-2xl md:text-3xl">Welcome, {pro.name.split(" ")[0]}</h1>
            <p className="mt-1 text-[14px] text-[#5A6B63]">
              {pro.trade} &middot; {pro.status === "vetted" ? "Verified pro" : "Application " + pro.status}
            </p>
          </div>
          <LogoutButton />
        </section>

        <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="fa-fluff p-5 text-center">
            <p className="fa-serif text-3xl text-[#0A4A3A]">{pro.profileViews}</p>
            <p className="mt-1 text-[12px] text-[#5A6B63]">profile views</p>
          </div>
          <div className="fa-fluff p-5 text-center">
            <p className="fa-serif text-3xl text-[#0A4A3A]">{leadsThisWeek}</p>
            <p className="mt-1 text-[12px] text-[#5A6B63]">WhatsApp taps this week</p>
          </div>
          <div className="fa-fluff p-5 text-center">
            <p className="fa-serif text-3xl text-[#0A4A3A]">{pro._count.leads}</p>
            <p className="mt-1 text-[12px] text-[#5A6B63]">taps all time</p>
          </div>
          <div className="fa-fluff p-5 text-center">
            <p className="fa-serif text-3xl text-[#0A4A3A]">{avg ?? "\u2014"}</p>
            <p className="mt-1 text-[12px] text-[#5A6B63]">{avg ? `rating (${ratings.length})` : "no reviews yet"}</p>
          </div>
        </section>

        {pro.status === "vetted" && (
          <section className="fa-fluff mt-8 flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="font-semibold">Your public profile is live</p>
              <p className="mt-1 text-[13px] text-[#5A6B63]">This is what customers see when they find you.</p>
            </div>
            <Link href={`/pro/${pro.slug}`} className="fa-btn-ghost !px-5 !py-2.5 text-[14px]">View my profile</Link>
          </section>
        )}

        <section className="mt-8">
          <h2 className="fa-serif text-xl md:text-2xl">Your details</h2>
          <div className="fa-fluff mt-4 divide-y divide-[rgba(14,23,19,0.06)] !p-0">
            {[
              ["Trade", pro.trade],
              ["Category", pro.category.name],
              ["Areas", pro.areas.map((a) => a.area.name).join(", ") || "None set"],
              ["Bio", pro.bio || "Not written yet"],
              ["Skills/tags", pro.tags || "None set"],
              ["Price guide", pro.priceGuide ? pro.priceGuide.split("|").join(" \u00b7 ") : "Not set"],
              ["Video intro", pro.videoUrl || "Not added"],
              ["WhatsApp", pro.whatsapp],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="w-28 shrink-0 text-[13px] font-semibold text-[#5A6B63]">{k}</span>
                <span className="break-words text-[14px] text-[#3C4A43]">{v}</span>
              </div>
            ))}
          </div>
          <h2 className="fa-serif mt-10 text-xl md:text-2xl">Edit your profile</h2>
          <ProfileEditor initial={{ bio: pro.bio, tags: pro.tags, priceGuide: pro.priceGuide, yearsExp: pro.yearsExp, videoUrl: pro.videoUrl, instagram: pro.instagram, facebook: pro.facebook, tiktok: pro.tiktok, workPhotos: pro.workPhotos }} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}