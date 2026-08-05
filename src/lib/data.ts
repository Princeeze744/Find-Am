export const categories = [
  { name: "Electricians", vetted: 24, from: "3,000", d: "M13 2 4.5 13.5h6L10 22l8.5-11.5h-6L13 2Z" },
  { name: "Plumbers", vetted: 19, from: "3,500", d: "M12 3c3 4.2 6 7.4 6 11a6 6 0 0 1-12 0c0-3.6 3-6.8 6-11Z" },
  { name: "Generator techs", vetted: 21, from: "4,000", d: "M4 9h12l2-3h2v12h-2l-2-3H4V9Zm0 0v6" },
  { name: "AC technicians", vetted: 17, from: "4,000", d: "M12 2v20M2 12h20M5 5l14 14M19 5 5 19" },
  { name: "Tailors", vetted: 26, from: "2,000", d: "M6 4a2.5 2.5 0 1 0 2.4 3.3L20 20M18 4 8.4 16.7A2.5 2.5 0 1 0 6 20" },
  { name: "Cleaners", vetted: 21, from: "5,000", d: "M12 2v7m0 0-6 4 1.5 9h9L18 13l-6-4Z" },
];

export const pros = [
  { name: "Chinedu Eze", trade: "Electrician", areas: "Rumuola, GRA, Woji", rating: "4.9", reviews: 31, jobs: 84, reply: "~25 min", img: "/images/hero-electrician.png", pos: "50% 20%", wa: "2340000000000" },
  { name: "Ezekiel Amadi", trade: "Plumber", areas: "GRA, Peter Odili, Trans-Amadi", rating: "5.0", reviews: 22, jobs: 57, reply: "~15 min", img: "/images/handshake-trust.png", pos: "78% 25%", wa: "2340000000000" },
  { name: "Tamuno David", trade: "Keyboardist", areas: "All of Port Harcourt", rating: "4.8", reviews: 18, jobs: 41, reply: "~30 min", img: "/images/keyboardist-wedding.png", pos: "35% 20%", wa: "2340000000000" },
];

export const ticker: { who: string; what: string; when: string }[] = [
  { who: "FindAm", what: "is vetting founding pros across Port Harcourt", when: "now" },
  { who: "Every pro", what: "gets a workshop visit before going live", when: "always" },
  { who: "Your requests", what: "are handled personally by our team", when: "always" },
  { who: "First 30 pros", what: "join completely free", when: "limited" },
];

const retiredFakeTicker = [
  { who: "Ada in Woji", what: "found an electrician", when: "2 min ago" },
  { who: "Emeka in GRA", what: "booked a deep clean", when: "9 min ago" },
  { who: "Tari in Eliozu", what: "fixed a leaking pipe", when: "14 min ago" },
  { who: "Mrs. Bello in Rumuola", what: "serviced her generator", when: "21 min ago" },
  { who: "Ibinabo in Trans-Amadi", what: "found a tailor", when: "28 min ago" },
  { who: "Chuks in Rumuodara", what: "found a wedding keyboardist", when: "33 min ago" },
];

export const voices: { q: string; w: string; a: string }[] = [
  { q: "We started FindAm because finding someone you can trust in this city should not depend on who you know. Every pro here was met in person \u2014 workshop seen, references called, ID confirmed \u2014 before you ever see them.", w: "The FindAm team", a: "Port Harcourt" },
  { q: "We are building the founding class now: the first 30 pros join free, get vetted personally, and grow with us from day one. If you know skilled hands with a good name \u2014 send them our way.", w: "Prince, founder", a: "FindAm" },
  { q: "Real reviews from real jobs will live here soon. We only publish reviews tied to actual connections made through FindAm \u2014 no invented praise, ever.", w: "Our promise", a: "always" },
];

const retiredFakeVoices = [
  { q: "He came same day, fixed the fault, and the price he said is the price I paid. I have kept his number.", w: "Mrs. Adaeze", a: "Woji" },
  { q: "First time in Port Harcourt I did not have to beg somebody for a trusted person. I just checked FindAm.", w: "Ibim", a: "GRA" },
  { q: "As a pro, my phone used to be quiet. Now neighbours I have never met are calling me for work.", w: "Chinedu", a: "Electrician, Rumuola" },
];

export const longTailChips = ["Keyboardist", "Drummer", "MC", "Makeup artist", "Dispenser repair", "DSTV installer"];

export const heroChips = ["Generator not starting", "Leaking pipe", "House wiring", "Deep cleaning"];