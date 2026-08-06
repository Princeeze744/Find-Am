"use client";

import Image from "next/image";
import Link from "next/link";
import HeroRotator from "@/components/HeroRotator";
import { motion, useScroll, useTransform } from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { fadeUp, stagger } from "@/components/Motion";
import { SearchIcon } from "@/components/Icons";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ticker, voices, longTailChips, heroChips } from "@/lib/data";

const headline = ["Find", "someone", "you", "can", "trust,", "in", "two", "minutes."];

export type HomeCategory = { name: string; slug: string; vetted: number; from: string; d: string };
export type HomePro = { id: string; name: string; slug: string; trade: string; areas: string; rating: string; reviews: number; jobs: number; reply: string; img: string; pos: string; wa: string };

export default function HomeView({ categories, pros }: { categories: HomeCategory[]; pros: HomePro[] }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -48]);
  const orbY = useTransform(scrollY, [0, 800], [0, 90]);
  return (
    <div className="fa-texture relative">
      <motion.div className="fa-orb h-[420px] w-[420px] bg-[rgba(15,110,86,0.16)]" style={{ top: "-120px", right: "-100px", y: orbY }} />
      {[
        { left: "8%", size: 5, dur: 22, delay: 0 },
        { left: "22%", size: 3, dur: 28, delay: 4 },
        { left: "45%", size: 6, dur: 25, delay: 9 },
        { left: "63%", size: 4, dur: 30, delay: 2 },
        { left: "78%", size: 5, dur: 24, delay: 12 },
        { left: "91%", size: 3, dur: 27, delay: 6 },
      ].map((d, i) => (
        <span key={i} className="fa-dust" style={{ left: d.left, bottom: "-20px", width: d.size * 3, height: d.size * 3, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }} />
      ))}
      <div className="fa-orb h-[360px] w-[360px] bg-[rgba(183,138,46,0.12)]" style={{ top: "600px", left: "-140px" }} />

      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 pb-24">
        {/* HERO */}
        <section className="grid items-center gap-10 pt-14 md:grid-cols-2 md:gap-14 md:pt-20">
          <div>
            <motion.p variants={fadeUp} initial="hidden" animate="show" className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0F6E56]">
              Nigeria&apos;s trusted hands
            </motion.p>
            <h1 className="fa-serif mt-5 max-w-xl text-[2.6rem] leading-[1.1] md:text-[3.6rem] md:leading-[1.06]">
              {headline.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.65, delay: 0.12 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  className={"mr-[0.24em] inline-block " + (word === "trust," ? "fa-grad-text" : "")}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.7 }} className="mt-5 max-w-md text-[15px] leading-relaxed text-[#5A6B63] md:text-lg">
              Every pro vetted in person &mdash; workshop visited, work inspected,
              references called. No stories, no fear.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1.15, duration: 0.7 }} className="fa-input mt-8 flex max-w-md items-center gap-3 px-5 py-4">
              <form action="/search" className="flex w-full items-center gap-3">
                <SearchIcon />
                <input name="q" required placeholder='Try "AC repair" or "drummer"' className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#9AA8A1]" />
                <button type="submit" className="fa-btn !rounded-xl !px-4 !py-2 text-sm">Search</button>
              </form>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" animate="show" transition={{ delayChildren: 1.3 }} className="mt-5 flex flex-wrap items-center gap-2">
              {heroChips.map((c) => (
                <motion.span key={c} variants={fadeUp} className="fa-chip">{c}</motion.span>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <motion.div style={{ y: heroY }}>
            <HeroRotator slides={[
              { src: "/images/hero-electrician.png", trade: "Electrician" },
              { src: "/images/pros/makeup.png", trade: "Makeup artist" },
              { src: "/images/pros/mc.png", trade: "MC" },
              { src: "/images/plumber-portrait.jpeg", trade: "Plumber" },
              { src: "/images/pros/carpenter.png", trade: "Carpenter" },
              { src: "/images/pros/doctor.png", trade: "Doctor" },
              { src: "/images/pros/cleaner.png", trade: "Cleaner" },
            ]} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.7 }} className="fa-fluff absolute -bottom-5 left-2 flex items-center gap-3 px-5 py-3.5 md:left-8">
              <span className="fa-badge">&#10003; Verified</span>
              <div className="text-[13px] leading-tight">
                <p className="font-semibold">Vetted in person</p>
                <p className="text-[#5A6B63]">workshop &middot; work &middot; references</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* LIVE TICKER */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mt-20">
          <div className="fa-marquee">
            {[0, 1].map((track) => (
              <div key={track} className="fa-marquee-track" aria-hidden={track === 1}>
                {ticker.map((t, i) => (
                  <div key={i} className="fa-fluff flex items-center gap-3 whitespace-nowrap !rounded-full px-5 py-2.5">
                    <span className="fa-live-dot" />
                    <span className="text-sm"><strong className="font-semibold">{t.who}</strong> {t.what}</span>
                    <span className="text-xs text-[#9AA8A1]">{t.when}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.section>

        {/* FILM STRIP - the cast */}
        <section className="mt-20">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.22em] text-[#0F6E56]">
            Whoever you need. Vetted.
          </motion.p>
          <div className="fa-filmstrip">
            {[0, 1].map((track) => (
              <div key={track} className="fa-filmstrip-track" aria-hidden={track === 1}>
                {[
                  { src: "/images/pros/mc.png", t: "MC" },
                  { src: "/images/pros/makeup.png", t: "Makeup artist" },
                  { src: "/images/pros/carpenter.png", t: "Carpenter" },
                  { src: "/images/pros/doctor.png", t: "Doctor" },
                  { src: "/images/pros/lawyer.png", t: "Lawyer" },
                  { src: "/images/pros/cleaner.png", t: "Cleaner" },
                  { src: "/images/pros/decorator.png", t: "Interior decorator" },
                  { src: "/images/hero-electrician.png", t: "Electrician" },
                ].map((p) => (
                  <div key={p.src + track} className="fa-portrait">
                    <Image src={p.src} alt={`A verified FindAm ${p.t.toLowerCase()}`} fill sizes="190px" className="object-cover" />
                    <span className="absolute bottom-3 left-3 z-10 text-[13px] font-semibold text-[#F5F1EA]">{p.t}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES - editorial split */}
        <section className="mt-24 md:mt-32">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <div>
              <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="fa-serif text-2xl md:text-4xl">
                What do you<br />need done?
              </motion.h2>
              <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-4 max-w-xs text-[15px] leading-relaxed text-[#5A6B63]">
                Every category below is stocked with pros we met face to face.
                Prices start honest and stay honest.
              </motion.p>
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-6">
                <span className="cursor-pointer text-sm font-semibold text-[#0F6E56]">Browse all categories &rarr;</span>
              </motion.div>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="grid gap-3 sm:grid-cols-2">
              {categories.map((c) => (
                <motion.div key={c.name} variants={fadeUp} whileTap={{ scale: 0.98 }}><Link href={`/c/${c.slug}`} className="fa-fluff group flex cursor-pointer items-center gap-4 !rounded-2xl px-5 py-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E4F5EE]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={c.d} />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{c.name}</span>
                    <span className="block text-[13px] text-[#5A6B63]">{c.vetted} vetted &middot; from &#8358;{c.from}</span>
                  </span>
                  <span className="text-[#9AA8A1] transition-transform group-hover:translate-x-1">&rarr;</span>
                </Link></motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* TOP PROS - photo-led cards */}
        <section className="mt-24 md:mt-32">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="flex items-end justify-between">
            <h2 className="fa-serif text-2xl md:text-4xl">Top rated pros near you</h2>
            <span className="cursor-pointer text-sm font-medium text-[#0F6E56]">View all &rarr;</span>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-8 grid gap-5 md:grid-cols-3">
            {pros.map((p) => (
              <motion.div key={p.name} variants={fadeUp} className="fa-fluff overflow-hidden !p-0">
                <Link href={`/pro/${p.slug}`} className="relative block aspect-[4/3]">
                  <Image src={p.img} alt={`${p.name}, verified ${p.trade.toLowerCase()} on FindAm`} fill sizes="(max-width: 768px) 100vw, 380px" className="object-cover" style={{ objectPosition: p.pos }} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,40,31,0.75)] to-transparent px-5 pb-3.5 pt-10">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className="fa-badge !border-transparent !bg-[rgba(228,245,238,0.92)]">&#10003; Verified</span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-[#CFE8DD]">{p.trade} &middot; {p.areas}</p>
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex items-center gap-4 text-[13px] text-[#5A6B63]">
                    <span className="font-medium text-[#B78A2E]">&#9733; {p.rating} ({p.reviews})</span>
                    <span>{p.jobs} jobs</span>
                    <span>{p.reply}</span>
                  </div>
                  <WhatsAppButton proId={p.id} whatsapp={p.wa} source="home_card" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* WHY TRUST */}
        <section className="mt-24 md:mt-32">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <motion.div initial={{ opacity: 0, x: -30, scale: 0.94 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="fa-photo relative aspect-[5/4]">
              <Image src="/images/pros/vetting.png" alt="A FindAm verifier inspecting an artisan workshop in Port Harcourt" fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
            </motion.div>
            <div>
              <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="fa-serif text-2xl md:text-4xl">
                Why people trust FindAm
              </motion.h2>
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-7 space-y-4">
                {[
                  { n: "1", t: "We visit in person", d: "Workshop seen, identity confirmed, tools and trade checked with our own eyes." },
                  { n: "2", t: "We inspect real work", d: "Two completed jobs examined and two past customers called before approval." },
                  { n: "3", t: "Neighbours keep score", d: "Only people who hired through FindAm can review, so ratings stay honest." },
                ].map((s) => (
                  <motion.div key={s.n} variants={fadeUp} className="fa-fluff flex items-start gap-4 p-5">
                    <div className="fa-step-num shrink-0">{s.n}</div>
                    <div>
                      <p className="font-semibold">{s.t}</p>
                      <p className="mt-1 text-[14px] leading-relaxed text-[#5A6B63]">{s.d}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* LONG TAIL */}
        <section className="mt-24 md:mt-32">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="md:order-2">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="fa-photo relative aspect-[5/4]">
                <Image src="/images/keyboardist-wedding.png" alt="A wedding keyboardist found on FindAm playing at a Port Harcourt reception" fill sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
              </motion.div>
            </div>
            <div className="md:order-1">
              <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="fa-serif text-2xl md:text-4xl">
                Even the ones you didn&apos;t expect
              </motion.h2>
              <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-4 max-w-md text-[15px] leading-relaxed text-[#5A6B63]">
                Emergency keyboardist for Sunday service. A drummer for your
                reception. The one man in town who fixes water dispensers.
                Search anything &mdash; and if we don&apos;t have it yet, tell
                us. We&apos;ll go out, find them, and vet them for you.
              </motion.p>
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-6 flex flex-wrap gap-2">
                {longTailChips.map((c) => (
                  <span key={c} className="fa-chip">{c}</span>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="mt-7">
                <Link href="/request" className="fa-btn inline-flex">Request any service</Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* VOICES */}
        <section className="mt-24 md:mt-32">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="fa-serif text-center text-2xl md:text-4xl">
            Voices from the city
          </motion.h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} className="mt-9 grid gap-5 md:grid-cols-3">
            {voices.map((v) => (
              <motion.div key={v.w} variants={fadeUp} className="fa-fluff flex flex-col p-7">
                <span className="fa-serif text-4xl leading-none text-[#B78A2E]">&ldquo;</span>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#3C4A43]">{v.q}</p>
                <p className="mt-4 text-sm font-semibold">{v.w} <span className="font-normal text-[#9AA8A1]">&middot; {v.a}</span></p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* PRO RECRUITMENT PANEL */}
        <section className="mt-24 md:mt-32">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="fa-panel px-7 py-12 text-center md:px-16 md:py-20">
            <h2 className="fa-serif mx-auto max-w-2xl text-[1.9rem] leading-snug md:text-5xl">
              Skilled hands and a good name?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-[#BFE8D9] md:text-base">
              Get verified, get seen, get steady work. The first 30 pros join
              free &mdash; we only succeed when you do.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/join" className="fa-btn-ghost">Join as a pro</Link>
              <Link href="/request" className="fa-btn !bg-none !bg-[#FAF7F2] !text-[#0A4A3A]">Request a pro</Link>
            </div>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}