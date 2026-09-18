// Single source of truth for the /resume page and the generated PDF (/resume.pdf).
// Wording follows the locked primary resume.

export const resume = {
  name: "William Koonz",
  title: "AI Product & Design Engineer",
  location: "Dallas–Fort Worth, TX",
  availability: "Open to US remote and select hybrid roles",
  email: "koonzwg@gmail.com",
  // PDF only — kept off the public web page to avoid scraping.
  phone: "602-354-0598",
  links: [
    { label: "github.com/koonzwg", href: "https://github.com/koonzwg" },
    { label: "linkedin.com/in/williamkoonz", href: "https://www.linkedin.com/in/williamkoonz" },
  ],
  profile:
    "AI product and design engineer with a founder/operator background spanning product management, design, engineering, AI systems, growth, and go-to-market. Takes products from concept and positioning through UX/UI, technical implementation, launch, and iteration. Founded and shipped two consumer iOS products, led product design across web and DeFi products, built quantitative trading systems, and founded and exited a service business.",
  experience: [
    {
      company: "Shado",
      title: "Founder · AI Product & Design Engineer",
      dates: "Apr 2026 – Present",
      bullets: [
        "Founded, designed, and shipped a live AI-guided reflection app for iOS, reaching approximately 220 users in its first months after launch.",
        "Own end-to-end product development across strategy, Figma UX/UI and design systems, AI behavior and personalization, SwiftUI implementation, Supabase/Postgres architecture, web experiences, App Store release, and ongoing iteration.",
      ],
    },
    {
      company: "Product Design Studio",
      title: "Product Designer",
      dates: "Jul 2024 – Mar 2026",
      bullets: [
        "Led product design across web applications, crypto/DeFi products, and early-stage software, translating ambiguous requirements into user flows, interaction models, design systems, high-fidelity prototypes, and developer-ready specifications.",
      ],
    },
    {
      company: "Finalform — AI Calorie Tracker",
      title: "Founder · Product Designer & Developer",
      dates: "Mar 2024 – Aug 2025",
      bullets: [
        "Designed and shipped an AI-powered iOS calorie tracker used by approximately 200–300 people, enabling food logging through photos, voice, and conversational text using Swift/SwiftUI, Supabase, and OpenAI APIs.",
      ],
    },
    {
      company: "Goodkleen",
      title: "Founder",
      dates: "Mar 2023 – Feb 2024",
      bullets: [
        "Founded and operated a residential cleaning company across positioning, customer acquisition, booking, contractor scheduling, and service delivery; designed the brand and Webflow site, integrated BookingKoala, and exited through a transfer of the customer base and operations to two contractors.",
      ],
    },
    {
      company: "MetaPharm",
      title: "Founder & Product Lead",
      dates: "Oct 2021 – Mar 2022",
      bullets: [
        "Founded and led pre-launch product development for a play-to-earn game and NFT ecosystem, coordinating approximately 12–15 contributors and external partners across product, blockchain/web engineering, game design, illustration, branding, paid growth, and community.",
      ],
    },
    {
      company: "Independent",
      title: "Quantitative Crypto Trader & Strategy Developer",
      dates: "2017 – 2021",
      bullets: [
        "Designed low-liquidity Bitcoin-pair strategies using relative volume, trade velocity, order-book depth, and bid/ask imbalance to generate weighted directional confidence signals and inform position sizing.",
        "Built cross-exchange, triangular-arbitrage, and momentum systems using Python, Node.js, CCXT, WebSockets, and REST APIs; progressed from live paper testing and manual validation to automated execution, position limits, and trailing stops, while building strategy and automation systems for private traders and investors.",
      ],
    },
  ],
  education: [
    {
      school: "4Geeks Academy",
      program: "Full Stack Software Development",
      dates: "Completed Dec 2022",
    },
  ],
  skills: [
    {
      group: "Product",
      items:
        "Product strategy & vision · Product management · 0-to-1 development · Product discovery · Roadmapping · Prioritization · Requirements · Experimentation · Cross-functional leadership",
    },
    {
      group: "Design",
      items:
        "UX/UI · Interaction design · User flows · Design systems · Prototyping · Figma · Branding · Creative direction · Developer handoff · Midjourney",
    },
    {
      group: "Engineering",
      items:
        "Swift · SwiftUI · Python · JavaScript · TypeScript · Node.js · React · Next.js · SQL · PostgreSQL · Supabase · REST APIs · WebSockets · Git/GitHub · Webflow",
    },
    {
      group: "AI",
      items:
        "AI-native product design · LLM integration · OpenAI APIs · Prompt & behavior design · Memory & personalization · Agent/workflow design · AI-assisted engineering",
    },
    {
      group: "Growth",
      items:
        "Go-to-market strategy · Positioning · Customer acquisition · Sales · Growth experimentation · Funnel optimization · Marketplace operations · Contractor/vendor management",
    },
  ],
};
