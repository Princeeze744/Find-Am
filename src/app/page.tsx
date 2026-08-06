import HomeView, { type HomeCategory, type HomePro } from "@/components/HomeView";
import { prisma } from "@/lib/db";
import { categories as staticCategories } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [dbCategories, dbPros] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { pros: { where: { status: "vetted" } } } } },
    }),
    prisma.pro.findMany({
      where: { status: "vetted" },
      orderBy: { jobsDone: "desc" },
      take: 3,
      include: {
        areas: { include: { area: true } },
        reviews: { where: { verified: true } },
      },
    }),
  ]);

  const iconMap: Record<string, string> = Object.fromEntries(
    staticCategories.map((c) => [c.name, c.d])
  );
  const fallbackIcon = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 5h2v6h-2V7Zm0 8h2v2h-2v-2Z";

  const categories: HomeCategory[] = dbCategories.filter((c) => c._count.pros > 0).map((c) => ({
    name: c.name,
    slug: c.slug,
    vetted: c._count.pros,
    from: c.priceFrom ? c.priceFrom.toLocaleString("en-NG") : "—",
    d: iconMap[c.name] ?? fallbackIcon,
  }));

  const pros: HomePro[] = dbPros.map((p) => {
    const ratings = p.reviews.map((r) => r.rating);
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "New";
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      trade: p.trade,
      areas: p.areas.map((pa) => pa.area.name).join(", ") || "Port Harcourt",
      rating: avg,
      reviews: ratings.length,
      jobs: p.jobsDone,
      reply: `~${p.replyMins} min`,
      img: p.photoUrl || "/images/hero-electrician.png",
      pos: "50% 20%",
      wa: p.whatsapp,
    };
  });

  const realSlides = dbPros
    .filter((p) => p.photoUrl && p.photoUrl.startsWith("http"))
    .slice(0, 4)
    .map((p) => ({ src: p.photoUrl, trade: p.trade }));

  return <HomeView categories={categories} pros={pros} realSlides={realSlides} />;
}